import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-data-hora-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-hora-container">
      <div class="input-group">
        <input 
          type="date" 
          [value]="data"
          (change)="onDataChange($event)"
          class="form-input"
          [class.is-invalid]="isInvalid" />
      </div>
      <div class="input-group">
        <input 
          type="time" 
          [value]="hora"
          (change)="onHoraChange($event)"
          class="form-input"
          [class.is-invalid]="isInvalid" />
      </div>
    </div>
  `,
  styles: [`
    .data-hora-container {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .input-group {
      flex: 1;
      min-width: 120px;
    }

    .form-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .form-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    .form-input.is-invalid {
      border-color: #dc3545;
    }

    .form-input.is-invalid:focus {
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataHoraPickerComponent),
      multi: true
    }
  ]
})
export class DataHoraPickerComponent implements ControlValueAccessor, OnInit {
  @Input() isInvalid = false;
  @Output() valueChange = new EventEmitter<string>();

  data = '';
  hora = '';
  private isInitializing = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    // Não fazer nada no init, apenas deixar vazio até o usuário preencher
  }

  onDataChange(event: any): void {
    this.data = event.target.value;
    if (!this.isInitializing) {
      this.emitirValor();
    }
  }

  onHoraChange(event: any): void {
    this.hora = event.target.value;
    if (!this.isInitializing) {
      this.emitirValor();
    }
  }

  private emitirValor(): void {
    if (this.data && this.hora) {
      // Combinar data e hora no formato ISO esperado pelo backend
      const valorCombinado = `${this.data}T${this.hora}`;
      this.onChange(valorCombinado);
      this.valueChange.emit(valorCombinado);
    }
  }

  writeValue(value: string): void {
    if (value) {
      this.isInitializing = true;
      // Valor vem no formato: YYYY-MM-DDTHH:MM (ou similar)
      // Usar split simples sem parsing de Date para evitar problemas de timezone
      const partes = value.split('T');
      if (partes.length === 2) {
        this.data = partes[0];
        this.hora = partes[1].substring(0, 5); // Pegar apenas HH:MM
      }
      setTimeout(() => this.isInitializing = false, 0);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
