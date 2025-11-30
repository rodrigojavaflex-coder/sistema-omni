import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MultiSelectComponent,
      multi: true,
    },
  ],
})
export class MultiSelectComponent implements ControlValueAccessor {
  @Input() options: string[] = [];
  @Input() placeholder = 'Selecionar...';
  @Input() displayLabel = false;
  @Output() selectionChange = new EventEmitter<string[]>();

  selectedItems: string[] = [];
  isOpen = false;

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string[] | null): void {
    this.selectedItems = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.onTouched();
    }
  }

  toggleItem(item: string): void {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    
    this.onChange(this.selectedItems);
    this.selectionChange.emit(this.selectedItems);
  }

  isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  getDisplayValue(): string {
    if (this.selectedItems.length === 0) {
      return this.placeholder;
    }
    if (this.selectedItems.length === 1) {
      return this.selectedItems[0];
    }
    return `${this.selectedItems.length} selecionado(s)`;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  clearSelection(): void {
    this.selectedItems = [];
    this.onChange(this.selectedItems);
    this.selectionChange.emit(this.selectedItems);
  }

  isAllSelected(): boolean {
    return this.options.length > 0 && this.selectedItems.length === this.options.length;
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.clearSelection();
    } else {
      this.selectedItems = [...this.options];
      this.onChange(this.selectedItems);
      this.selectionChange.emit(this.selectedItems);
    }
  }

  get selectAllLabel(): string {
    return this.isAllSelected() ? 'Desmarcar todos' : 'Marcar todos';
  }
}
