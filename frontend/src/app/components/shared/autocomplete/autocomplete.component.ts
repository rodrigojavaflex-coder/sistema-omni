import { Component, Input, Output, EventEmitter, forwardRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs';

export interface AutocompleteConfig<T> {
  placeholder: string;
  searchFn: (searchTerm: string) => Observable<{ data: T[]; total: number }>;
  displayFn: (item: T) => string;
  displaySecondaryFn?: (item: T) => string;
  minChars?: number;
  debounceTime?: number;
  limit?: number;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent<T extends { id: string }> implements ControlValueAccessor, OnDestroy {
  @Input() config!: AutocompleteConfig<T>;
  @Input() isInvalid = false;
  @Output() itemSelected = new EventEmitter<T>();

  searchText = '';
  filteredItems: T[] = [];
  showDropdown = false;
  isLoading = false;
  selectedIndex = -1;
  searchTimeout: any;

  // ControlValueAccessor
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.searchText = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.selectedIndex = -1;
    const debounce = this.config.debounceTime || 300;

    this.searchTimeout = setTimeout(() => {
      this.search(this.searchText);
    }, debounce);
  }

  search(searchTerm: string): void {
    const minChars = this.config.minChars || 2;

    if (!searchTerm || searchTerm.trim().length < minChars) {
      this.filteredItems = [];
      this.showDropdown = false;
      return;
    }

    this.isLoading = true;
    this.config.searchFn(searchTerm.trim()).subscribe({
      next: (response) => {
        this.filteredItems = response.data;
        this.showDropdown = this.filteredItems.length > 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar:', error);
        this.filteredItems = [];
        this.showDropdown = false;
        this.isLoading = false;
      }
    });
  }

  selectItem(item: T): void {
    this.searchText = this.config.displayFn(item);
    this.showDropdown = false;
    this.selectedIndex = -1;
    this.onChange(item.id);
    this.itemSelected.emit(item);
  }

  onFocus(): void {
    this.selectedIndex = -1;
    const minChars = this.config.minChars || 2;
    if (this.searchText && this.searchText.length >= minChars) {
      this.search(this.searchText);
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
      this.selectedIndex = -1;
      this.onTouched();
    }, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.showDropdown || this.filteredItems.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.filteredItems.length - 1
        );
        this.scrollToSelected();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.scrollToSelected();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredItems.length) {
          this.selectItem(this.filteredItems[this.selectedIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.showDropdown = false;
        this.selectedIndex = -1;
        break;
    }
  }

  scrollToSelected(): void {
    setTimeout(() => {
      const dropdown = document.querySelector('.autocomplete-dropdown-generic');
      const selectedItem = dropdown?.querySelector('.autocomplete-item.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
}
