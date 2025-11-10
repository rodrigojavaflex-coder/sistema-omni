import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MotoristaService } from '../../../services/motorista.service';
import { Motorista } from '../../../models/motorista.model';
import { StatusMotorista } from '../../../models/status-motorista.enum';
import { AutocompleteComponent, AutocompleteConfig } from '../autocomplete/autocomplete.component';

@Component({
  selector: 'app-motorista-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent],
  template: `
    <app-autocomplete 
      [config]="autocompleteConfig"
      [isInvalid]="isInvalid"
      [(ngModel)]="value"
      (itemSelected)="onMotoristaSelected($event)">
    </app-autocomplete>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MotoristaAutocompleteComponent),
      multi: true
    }
  ]
})
export class MotoristaAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() isInvalid = false;
  @Input() filterStatus?: StatusMotorista; // Filtro de status opcional (ex: 'Ativo')
  @Output() motoristaSelected = new EventEmitter<Motorista>();

  value = '';
  autocompleteConfig!: AutocompleteConfig<Motorista>;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private motoristaService: MotoristaService) {}

  ngOnInit(): void {
    this.autocompleteConfig = {
      placeholder: 'Buscar motorista (mín. 2 caracteres)...',
      searchFn: (searchTerm: string) => this.motoristaService.getAll(
        1, 
        20, 
        searchTerm, 
        undefined, 
        undefined, 
        undefined, 
        this.filterStatus // Passa o filtro de status se estiver definido
      ),
      displayFn: (motorista: Motorista) => motorista.nome,
      minChars: 2,
      debounceTime: 300,
      limit: 20
    };
  }

  onMotoristaSelected(motorista: Motorista): void {
    this.onChange(motorista.id);
    this.motoristaSelected.emit(motorista);
  }

  writeValue(value: string): void {
    // Se receber um ID, buscar o motorista correspondente
    if (value && value !== this.value) {
      this.motoristaService.getById(value).subscribe({
        next: (motorista: Motorista) => {
          this.value = motorista.nome;
        },
        error: () => {
          this.value = value; // Fallback para o ID se não encontrar
        }
      });
    } else if (!value) {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
