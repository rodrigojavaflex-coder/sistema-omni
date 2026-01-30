import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { VeiculoService } from '../../../services/veiculo.service';
import { Veiculo, StatusVeiculo } from '../../../models/veiculo.model';
import { AutocompleteComponent, AutocompleteConfig } from '../autocomplete/autocomplete.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-veiculo-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent],
  template: `
    <app-autocomplete 
      [config]="autocompleteConfig"
      [isInvalid]="isInvalid"
      [(ngModel)]="value"
      (ngModelChange)="onInputChange($event)"
      (itemSelected)="onVeiculoSelected($event)">
    </app-autocomplete>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VeiculoAutocompleteComponent),
      multi: true
    }
  ]
})
export class VeiculoAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() isInvalid = false;
  @Input() filterStatus?: StatusVeiculo; // Filtro de status opcional (ex: 'ATIVO')
  @Output() veiculoSelected = new EventEmitter<Veiculo>();

  value = '';
  autocompleteConfig!: AutocompleteConfig<Veiculo>;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private veiculoService: VeiculoService) {}

  ngOnInit(): void {
    this.autocompleteConfig = {
      placeholder: 'Buscar veículo (mín. 2 caracteres)...',
      searchFn: (searchTerm: string) => {
        return this.veiculoService.getVeiculos({ 
          page: 1, 
          limit: 20, 
          descricao: searchTerm,
          status: this.filterStatus // Incluir filtro de status se fornecido
        }).pipe(
          map(response => ({
            data: response.data,
            total: response.meta.total
          }))
        );
      },
      displayFn: (veiculo: Veiculo) => veiculo.descricao,
      displaySecondaryFn: (veiculo: Veiculo) => veiculo.placa,
      minChars: 2,
      debounceTime: 300,
      limit: 20
    };
  }

  onVeiculoSelected(veiculo: Veiculo): void {
    this.onChange(veiculo.id);
    this.veiculoSelected.emit(veiculo);
  }

  onInputChange(value: string): void {
    if (!value) {
      this.onChange('');
    }
  }

  writeValue(value: string): void {
    // Se receber um ID, buscar o veículo correspondente
    if (value && value !== this.value) {
      this.veiculoService.getById(value).subscribe({
        next: (veiculo: Veiculo) => {
          this.value = veiculo.descricao;
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
