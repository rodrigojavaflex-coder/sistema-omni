import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Usuario } from '../../../models/usuario.model';
import { AutocompleteComponent, AutocompleteConfig } from '../autocomplete/autocomplete.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-usuario-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule, AutocompleteComponent],
  template: `
    <app-autocomplete 
      [config]="autocompleteConfig"
      [isInvalid]="isInvalid"
      [(ngModel)]="value"
      (itemSelected)="onUsuarioSelected($event)">
    </app-autocomplete>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UsuarioAutocompleteComponent),
      multi: true
    }
  ]
})
export class UsuarioAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() isInvalid = false;
  @Output() usuarioSelected = new EventEmitter<Usuario>();

  value = '';
  autocompleteConfig!: AutocompleteConfig<Usuario>;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.autocompleteConfig = {
      placeholder: 'Buscar vistoriador (mín. 2 caracteres)...',
      searchFn: (searchTerm: string) => {
        return this.userService.getUsers({
          page: 1,
          limit: 20,
          nome: searchTerm,
        }).pipe(
          map(response => ({
            data: response.data,
            total: response.meta.total
          }))
        );
      },
      displayFn: (usuario: Usuario) => usuario.nome,
      displaySecondaryFn: (usuario: Usuario) => usuario.email,
      minChars: 2,
      debounceTime: 300,
      limit: 20
    };
  }

  onUsuarioSelected(usuario: Usuario): void {
    this.onChange(usuario.id);
    this.usuarioSelected.emit(usuario);
  }

  writeValue(value: string): void {
    if (value && value !== this.value) {
      this.userService.getUserById(value).subscribe({
        next: (usuario: Usuario) => {
          this.value = usuario.nome;
        },
        error: () => {
          this.value = value;
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
