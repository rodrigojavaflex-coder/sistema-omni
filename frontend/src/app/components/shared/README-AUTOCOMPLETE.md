# Componentes de Autocomplete Reutilizáveis

## 📦 Estrutura

```
src/app/components/shared/
├── autocomplete/
│   ├── autocomplete.component.ts       # Componente genérico base
│   ├── autocomplete.component.html
│   └── autocomplete.component.css
├── motorista-autocomplete/
│   └── motorista-autocomplete.component.ts  # Especialização para Motorista
└── veiculo-autocomplete/
    └── veiculo-autocomplete.component.ts    # Especialização para Veículo
```

## 🎯 Componente Genérico: AutocompleteComponent

Um componente totalmente reutilizável que pode ser configurado para qualquer tipo de busca.

### Características:
- ✅ Busca com debounce configurável
- ✅ Navegação por teclado (↑↓ Enter Escape)
- ✅ Destaque visual do item selecionado
- ✅ Auto-scroll para item destacado
- ✅ Loading state
- ✅ Estado de "nenhum resultado"
- ✅ Implementa ControlValueAccessor (funciona com ngModel e FormControl)
- ✅ Typesafe com TypeScript Generics

### Interface de Configuração:

```typescript
interface AutocompleteConfig<T> {
  placeholder: string;                    // Placeholder do input
  searchFn: (searchTerm: string) => Observable<{ data: T[]; total: number }>;  // Função de busca
  displayFn: (item: T) => string;        // Como exibir o item principal
  displaySecondaryFn?: (item: T) => string;  // Como exibir info secundária (opcional)
  minChars?: number;                      // Mínimo de caracteres (padrão: 2)
  debounceTime?: number;                  // Delay da busca (padrão: 300ms)
  limit?: number;                         // Limite de resultados (padrão: 20)
}
```

## 🚗 Componente Especializado: VeiculoAutocompleteComponent

### Uso no Template (Reactive Forms):

```typescript
// Component TS
import { VeiculoAutocompleteComponent } from './components/shared/veiculo-autocomplete/veiculo-autocomplete.component';

@Component({
  imports: [VeiculoAutocompleteComponent, ReactiveFormsModule],
  // ...
})
export class MeuFormComponent {
  form = this.fb.group({
    idVeiculo: ['', Validators.required]
  });

  onVeiculoSelecionado(veiculo: Veiculo): void {
    console.log('Veículo selecionado:', veiculo);
  }
}
```

```html
<!-- Template HTML -->
<div class="form-group">
  <label class="form-label required">Veículo</label>
  <app-veiculo-autocomplete
    formControlName="idVeiculo"
    [isInvalid]="isFieldInvalid('idVeiculo')"
    (veiculoSelected)="onVeiculoSelecionado($event)">
  </app-veiculo-autocomplete>
  @if (isFieldInvalid('idVeiculo')) {
    <span class="form-error">Campo obrigatório</span>
  }
</div>
```

### Uso no Template (ngModel):

```html
<app-veiculo-autocomplete
  [(ngModel)]="veiculoId"
  [isInvalid]="veiculoInvalido"
  (veiculoSelected)="onVeiculoSelecionado($event)">
</app-veiculo-autocomplete>
```

## 👤 Componente Especializado: MotoristaAutocompleteComponent

### Uso:

```typescript
// Component TS
import { MotoristaAutocompleteComponent } from './components/shared/motorista-autocomplete/motorista-autocomplete.component';

@Component({
  imports: [MotoristaAutocompleteComponent, ReactiveFormsModule],
  // ...
})
export class MeuFormComponent {
  form = this.fb.group({
    idMotorista: ['', Validators.required]
  });

  onMotoristaSelecionado(motorista: Motorista): void {
    console.log('Motorista selecionado:', motorista);
  }
}
```

```html
<!-- Template HTML -->
<div class="form-group">
  <label class="form-label required">Motorista</label>
  <app-motorista-autocomplete
    formControlName="idMotorista"
    [isInvalid]="isFieldInvalid('idMotorista')"
    (motoristaSelected)="onMotoristaSelecionado($event)">
  </app-motorista-autocomplete>
  @if (isFieldInvalid('idMotorista')) {
    <span class="form-error">Campo obrigatório</span>
  }
</div>
```

## 🎨 Criar Novo Autocomplete Especializado

Para criar um novo autocomplete (ex: Cliente, Produto, etc):

```typescript
import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AutocompleteComponent, AutocompleteConfig } from '../autocomplete/autocomplete.component';
import { MeuService } from '../../../services/meu.service';
import { MeuModel } from '../../../models/meu.model';

@Component({
  selector: 'app-meu-autocomplete',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <app-autocomplete 
      [config]="autocompleteConfig"
      [isInvalid]="isInvalid"
      [(ngModel)]="value"
      (itemSelected)="onItemSelected($event)">
    </app-autocomplete>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MeuAutocompleteComponent),
    multi: true
  }]
})
export class MeuAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() isInvalid = false;
  @Output() itemSelected = new EventEmitter<MeuModel>();

  value = '';
  autocompleteConfig!: AutocompleteConfig<MeuModel>;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private meuService: MeuService) {}

  ngOnInit(): void {
    this.autocompleteConfig = {
      placeholder: 'Buscar...',
      searchFn: (searchTerm: string) => this.meuService.buscar(searchTerm),
      displayFn: (item: MeuModel) => item.nome,
      displaySecondaryFn: (item: MeuModel) => item.codigo,  // opcional
      minChars: 2,
      debounceTime: 300
    };
  }

  onItemSelected(item: MeuModel): void {
    this.onChange(item.id);
    this.itemSelected.emit(item);
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
```

## 📝 Vantagens da Abordagem

1. **DRY**: Código escrito uma vez, reutilizado em múltiplos lugares
2. **Type-Safe**: TypeScript generics garantem type safety
3. **Consistência**: Comportamento uniforme em toda aplicação
4. **Manutenção**: Correção de bugs em um lugar só
5. **Acessibilidade**: Navegação por teclado built-in
6. **Performance**: Debounce configurável evita requests desnecessárias
7. **UX**: Loading states e feedback visual consistentes
8. **Extensível**: Fácil criar novos autocompletes especializados

## 🔄 Migração do Código Existente

### Antes (código duplicado):
```typescript
// ocorrencia-form.ts
veiculoSearchText = '';
filteredVeiculos: Veiculo[] = [];
showVeiculoDropdown = false;
selectedVeiculoIndex = -1;
// ... 50+ linhas de código para gerenciar autocomplete

// ocorrencia-list.ts
veiculoSearchText = '';
filteredVeiculos: Veiculo[] = [];
showVeiculoDropdown = false;
selectedVeiculoIndex = -1;
// ... mesmas 50+ linhas duplicadas
```

### Depois (componente reutilizável):
```typescript
// ocorrencia-form.ts
// Sem código de autocomplete - tudo no componente!

// ocorrencia-list.ts  
// Sem código de autocomplete - tudo no componente!
```

```html
<!-- HTML simples -->
<app-veiculo-autocomplete
  formControlName="idVeiculo"
  (veiculoSelected)="onVeiculoSelecionado($event)">
</app-veiculo-autocomplete>
```

## ✅ Checklist de Migração

- [ ] Remover código duplicado de autocomplete dos componentes existentes
- [ ] Substituir por `app-veiculo-autocomplete` e `app-motorista-autocomplete`
- [ ] Testar navegação por teclado
- [ ] Testar validação de formulários
- [ ] Verificar que eventos `itemSelected` funcionam corretamente
- [ ] Remover CSS duplicado dos componentes
