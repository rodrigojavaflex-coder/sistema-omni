# 🎨 Template Base Frontend - Padrões para Novos Formulários (Angular)

> **Documento de Referência para Criar Novos Módulos de Cadastro**
>
> Baseado no fluxo de **Cadastro de Motorista** (standalone component + Reactive Forms)
>
> Versão: 1.0 | Data: 09/11/2025

---

## 📑 Índice
1. [Estrutura Recomendada](#estrutura-recomendada)
2. [Componentes Standalone](#componentes-standalone)
3. [Formulário e Validação](#formulário-e-validação)
4. [Fluxo de CRUD](#fluxo-de-crud)
5. [Helpers de Formatação](#helpers-de-formatação)
6. [Padrões de Template (HTML)](#padrões-de-template-html)
7. [Estilos](#estilos)
8. [Checklist Rápido](#checklist-rápido)

---

## 🗂️ Estrutura Recomendada
```
frontend/src/app/components/[nome-entidade]-form/
  ├─ [nome-entidade]-form.ts      // component standalone (extends BaseFormComponent)
  ├─ [nome-entidade]-form.html    // template
  └─ [nome-entidade]-form.css     // estilos específicos (se necessários)

frontend/src/app/components/[nome-entidade]-list/
  ├─ [nome-entidade]-list.ts      // component standalone (listagem)
  ├─ [nome-entidade]-list.html
  └─ [nome-entidade]-list.css

frontend/src/app/services/[nome-entidade].service.ts // chamadas HTTP
frontend/src/app/models/[nome-entidade].model.ts     // tipos/DTOs
```

**Fundação comum:** herdar de `BaseFormComponent` para reaproveitar `loading`, `submitted`, `markAllAsTouched`, `getFieldError`, navegação pós-salvar.

---

## 🧩 Componentes Standalone
- Use `standalone: true` e importe apenas o necessário (`CommonModule`, `ReactiveFormsModule`, `FormsModule`).
- Injete `Router` no `super` e `ActivatedRoute` local para detectar edição (`id` na rota).
- Inicialize `editMode` e `entityId` no `ngOnInit` antes de `super.ngOnInit()`.

Exemplo (resumido):
```typescript
@Component({
  selector: 'app-[nome]-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './[nome]-form.html',
  styleUrls: ['./[nome]-form.css']
})
export class [Nome]FormComponent extends BaseFormComponent<Create[Nome]Dto | Update[Nome]Dto> {
  constructor(
    private fb: FormBuilder,
    private [nome]Service: [Nome]Service,
    private route: ActivatedRoute,
    router: Router
  ) { super(router); }

  override ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.editMode = true; this.entityId = id; }
    super.ngOnInit();
  }
}
```

---

## ✅ Formulário e Validação
- Crie o `FormGroup` em `initializeForm()`.
- Campos obrigatórios: use `Validators.required`; limites com `maxLength` e máscaras com handlers (`onCpfInput`, `onPhoneInput`).
- Deixe campos realmente opcionais sem `required` (ex.: no motorista, datas opcionais são removidas no `buildFormData` se vazias).
- No `buildFormData`, converta `''` para `undefined` e padronize defaults (ex.: `status = 'Ativo'`).

```typescript
protected initializeForm(): void {
  this.form = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(300)]],
    cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
    status: ['Ativo', Validators.required],
    // opcionais
    email: ['', [Validators.email, Validators.maxLength(100)]],
  });
}

protected buildFormData(): Create[Nome]Dto | Update[Nome]Dto {
  const data: any = { ...this.form.value };
  if (!data.email) delete data.email;
  return data;
}
```

---

## 🔄 Fluxo de CRUD
- `saveEntity`: `await firstValueFrom(service.create(dto))`.
- `updateEntity`: `await firstValueFrom(service.update(id, dto))`.
- `loadEntityById`: buscar, formatar datas para `YYYY-MM-DD` e preencher `patchValue`.
- `onSubmit`: respeite `this.form.invalid`, chame `markAllAsTouched()`, use `notificationService` para mensagens e navegue com `router.navigate([getListRoute()])`.

---

## 🧰 Helpers de Formatação
Replique o padrão do motorista onde fizer sentido:
- CPF/CEP: remover não numéricos, limitar tamanho, aplicar máscara visual no input (`setValue` sem emitir evento).
- Telefone/Celular: normalizar para apenas números no form, mostrar com máscara no input.
- Datas carregadas do backend: `dateString.split('T')[0]` para inputs `type="date"`.

---

## 🖼️ Padrões de Template (HTML)
- Estruture em seções (`form-section`) com títulos claros.
- Botões principais no topo e base do formulário, respeitando `loading`.
- Use `getFormTitle()` e `getSubmitButtonText()` do `BaseFormComponent`.
- Exiba erros com `*ngIf="isFieldInvalid('campo')"` e `{{ getFieldError('campo') }}`.
- Inputs com placeholders úteis para campos mascarados.

Trecho-modelo:
```html
<div class="form-container">
  <h2>{{ getFormTitle() }} [Entidade]</h2>

  <div class="form-actions form-actions-top">
    <button type="submit" class="btn btn-primary" [disabled]="loading" (click)="onSubmit()">
      <span *ngIf="loading" class="spinner"></span>
      {{ loading ? 'Salvando...' : getSubmitButtonText() }}
    </button>
    <button type="button" class="btn btn-secondary" (click)="cancel()">Cancelar</button>
  </div>

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <div class="form-section">
      <h3>Informações Gerais</h3>
      <div class="form-group">
        <label class="form-label">Nome *</label>
        <input type="text" formControlName="nome" class="form-input" />
        <div class="form-error" *ngIf="isFieldInvalid('nome')">{{ getFieldError('nome') }}</div>
      </div>
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-primary" [disabled]="loading">
        <span *ngIf="loading" class="spinner"></span>
        {{ loading ? 'Salvando...' : getSubmitButtonText() }}
      </button>
      <button type="button" class="btn btn-secondary" (click)="cancel()">Cancelar</button>
    </div>
  </form>
</div>
```

---

## 🎨 Estilos
- Preferir classes globais já existentes (botões, form-section). Use CSS local apenas para ajustes.
- Responsividade: use `.form-inline` com wrap e quebre em colunas de largura similar ao motorista-form.
- Mantenha coerência de espaçamento e tipografia do design system atual.

---

## ✅ Checklist Rápido
- [ ] Criou componente standalone `...-form` herdando `BaseFormComponent`.
- [ ] Implementou `initializeForm`, `buildFormData`, `saveEntity`, `updateEntity`, `loadEntityById`, `getListRoute`.
- [ ] Campos obrigatórios com `Validators.required`; opcionais sem required.
- [ ] Tratou datas e máscaras (CPF/CEP/telefone) conforme necessário.
- [ ] Template com seções, erros exibidos e botões com estado de loading.
- [ ] Navegação pós-salvar funcionando.
- [ ] Serviço (`...service.ts`) com métodos `create`, `update`, `getById`.
- [ ] Modelos/DTOs atualizados em `models/[entidade].model.ts`.

Use este guia como base para qualquer novo cadastro, replicando o que já funciona no fluxo de Motorista. 
