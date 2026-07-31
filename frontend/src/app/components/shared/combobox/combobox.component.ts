import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from '@angular/forms';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

export interface ComboboxOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxComponent),
      multi: true,
    },
  ],
})
export class ComboboxComponent implements ControlValueAccessor, OnChanges {
  @Input() options: ComboboxOption[] = [];
  @Input() placeholder = 'Selecione...';
  @Input() isInvalid = false;
  @Output() optionSelected = new EventEmitter<ComboboxOption>();

  isOpen = false;
  searchText = '';
  selectedValue = '';
  selectedIndex = -1;
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.selectedValue) {
      this.syncDisplayFromValue();
    }
  }

  get filteredOptions(): ComboboxOption[] {
    const term = this.searchText.trim().toLowerCase();
    if (!term) {
      return this.options;
    }
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(term),
    );
  }

  writeValue(value: string | null): void {
    this.selectedValue = value ?? '';
    this.syncDisplayFromValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (isDisabled) {
      this.closeDropdown();
    }
  }

  toggleDropdown(): void {
    if (this.isDisabled) {
      return;
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.selectedIndex = -1;
      this.onTouched();
    }
  }

  openDropdown(): void {
    if (this.isDisabled || this.isOpen) {
      return;
    }
    this.isOpen = true;
    this.selectedIndex = -1;
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.selectedIndex = -1;
    this.syncDisplayFromValue();
    this.onTouched();
  }

  onSearchInput(): void {
    this.openDropdown();
    this.selectedIndex = -1;
  }

  selectOption(option: ComboboxOption): void {
    this.selectedValue = option.value;
    this.searchText = option.label;
    this.isOpen = false;
    this.selectedIndex = -1;
    this.onChange(option.value);
    this.optionSelected.emit(option);
    this.onTouched();
  }

  clearSelection(event?: MouseEvent): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.selectedValue = '';
    this.searchText = '';
    this.isOpen = false;
    this.selectedIndex = -1;
    this.onChange('');
    this.onTouched();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.isOpen && this.filteredOptions.length > 0) {
        const index =
          this.selectedIndex >= 0 &&
          this.selectedIndex < this.filteredOptions.length
            ? this.selectedIndex
            : 0;
        this.selectOption(this.filteredOptions[index]);
      } else {
        this.openDropdown();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeDropdown();
      return;
    }

    if (!this.isOpen || this.filteredOptions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.filteredOptions.length - 1,
        );
        this.scrollToSelected();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.scrollToSelected();
        break;
    }
  }

  isSelected(option: ComboboxOption): boolean {
    return option.value === this.selectedValue;
  }

  private syncDisplayFromValue(): void {
    if (!this.selectedValue) {
      this.searchText = '';
      return;
    }
    const match = this.options.find(
      (option) => option.value === this.selectedValue,
    );
    this.searchText = match?.label ?? '';
  }

  private scrollToSelected(): void {
    setTimeout(() => {
      const dropdown = document.querySelector('.combobox-dropdown');
      const selectedItem = dropdown?.querySelector('.combobox-item.selected');
      selectedItem?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 0);
  }
}
