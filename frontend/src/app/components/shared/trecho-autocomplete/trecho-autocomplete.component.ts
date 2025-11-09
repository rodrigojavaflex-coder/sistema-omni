import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TrechoService } from '../../../services/trecho.service';
import { Trecho } from '../../../models/trecho.model';
import { AutocompleteComponent, AutocompleteConfig } from '../autocomplete/autocomplete.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trecho-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent],
  template: `
    <app-autocomplete 
      [config]="autocompleteConfig"
      [isInvalid]="isInvalid"
      [(ngModel)]="value"
      (itemSelected)="onTrechoSelected($event)">
    </app-autocomplete>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TrechoAutocompleteComponent),
      multi: true
    }
  ]
})
export class TrechoAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() isInvalid = false;
  @Output() trechoSelected = new EventEmitter<Trecho>();

  value = '';
  autocompleteConfig!: AutocompleteConfig<Trecho>;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private trechoService: TrechoService) {}

  ngOnInit(): void {
    this.autocompleteConfig = {
      placeholder: 'Buscar trecho (mín. 2 caracteres)...',
      searchFn: (searchTerm: string) => {
        return this.trechoService.getAll(
          1, 
          20, 
          searchTerm
        ).pipe(
          map(response => ({
            data: response.data,
            total: response.total
          }))
        );
      },
      displayFn: (trecho: Trecho) => trecho.descricao,
      minChars: 2,
      debounceTime: 300,
      limit: 20
    };
  }

  onTrechoSelected(trecho: Trecho): void {
    this.onChange(trecho.id);
    this.trechoSelected.emit(trecho);
  }

  writeValue(value: string): void {
    // Se receber um ID, buscar o trecho correspondente
    if (value && value !== this.value) {
      this.trechoService.getById(value).subscribe({
        next: (trecho: Trecho) => {
          this.value = trecho.descricao;
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
