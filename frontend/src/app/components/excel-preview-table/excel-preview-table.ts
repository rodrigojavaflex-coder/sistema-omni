import {
  Component,
  OnDestroy,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ExcelColumnType,
  ExcelPreviewSheet,
} from '../../utils/documento-preview.util';
import {
  parseDateFilterInput,
  parseNumberFilterInput,
  extractRawValueFromDisplay,
} from '../../utils/excel-cell.util';

const PAGE_SIZE = 300;
const MAX_DROPDOWN_OPTIONS = 500;
const DEFAULT_COLUMN_WIDTH = 170;
const MIN_COLUMN_WIDTH = 80;
const MAX_COLUMN_WIDTH = 640;

interface DateRangeFilter {
  from: string;
  to: string;
}

interface NumberRangeFilter {
  min: string;
  max: string;
}

@Component({
  selector: 'app-excel-preview-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-preview-table.html',
  styleUrls: ['./excel-preview-table.css'],
})
export class ExcelPreviewTableComponent implements OnDestroy {
  readonly pageSize = PAGE_SIZE;

  sheet = input.required<ExcelPreviewSheet>();

  private readonly textFilters = signal<Record<number, string>>({});
  private readonly dropdownFilters = signal<Record<number, string>>({});
  private readonly dateRangeFilters = signal<Record<number, DateRangeFilter>>({});
  private readonly numberRangeFilters = signal<Record<number, NumberRangeFilter>>({});
  private readonly columnWidths = signal<Record<number, number>>({});
  readonly currentPage = signal(1);
  readonly columnDropdownOptions = signal<string[][]>([]);

  private resizingColumnIndex: number | null = null;
  private resizeStartX = 0;
  private resizeStartWidth = 0;

  readonly filteredRows = computed(() => {
    const sheet = this.sheet();
    const textFilters = this.textFilters();
    const dropdownFilters = this.dropdownFilters();
    const dateRangeFilters = this.dateRangeFilters();
    const numberRangeFilters = this.numberRangeFilters();

    return sheet.rows.filter((row, rowIndex) =>
      sheet.headers.every((_, columnIndex) => {
        const columnType = this.getColumnType(columnIndex);
        const displayValue = String(row[columnIndex] ?? '');
        const rawValue = this.getColumnRawValue(
          sheet,
          rowIndex,
          columnIndex,
          columnType,
          displayValue,
        );

        if (columnType === 'date') {
          return this.matchesDateRangeFilter(rawValue, dateRangeFilters[columnIndex]);
        }

        if (columnType === 'currency') {
          return this.matchesNumberRangeFilter(rawValue, numberRangeFilters[columnIndex]);
        }

        const textFilter = textFilters[columnIndex]?.trim().toLowerCase() ?? '';
        if (textFilter && !displayValue.toLowerCase().includes(textFilter)) {
          return false;
        }

        const dropdownFilter = dropdownFilters[columnIndex] ?? '';
        if (dropdownFilter && displayValue !== dropdownFilter) {
          return false;
        }

        return true;
      }),
    );
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredRows().length / this.pageSize)),
  );

  readonly paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredRows().slice(start, start + this.pageSize);
  });

  readonly rangeLabel = computed(() => {
    const total = this.filteredRows().length;
    if (total === 0) {
      return 'Nenhuma linha encontrada';
    }

    const start = (this.currentPage() - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage() * this.pageSize, total);
    return `Exibindo ${start}–${end} de ${total} linhas`;
  });

  readonly hasActiveFilters = computed(() => {
    const sheet = this.sheet();
    return sheet.headers.some((_, columnIndex) => this.hasColumnFilter(columnIndex));
  });

  private readonly onResizeMove = (event: MouseEvent): void => {
    if (this.resizingColumnIndex == null) {
      return;
    }

    const delta = event.clientX - this.resizeStartX;
    const nextWidth = Math.max(
      MIN_COLUMN_WIDTH,
      Math.min(MAX_COLUMN_WIDTH, this.resizeStartWidth + delta),
    );

    this.columnWidths.update((current) => ({
      ...current,
      [this.resizingColumnIndex as number]: nextWidth,
    }));
  };

  private readonly onResizeEnd = (): void => {
    this.resizingColumnIndex = null;
    document.body.classList.remove('excel-preview--resizing');
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
  };

  constructor() {
    effect(() => {
      const sheet = this.sheet();
      this.textFilters.set({});
      this.dropdownFilters.set({});
      this.dateRangeFilters.set({});
      this.numberRangeFilters.set({});
      this.currentPage.set(1);
      this.columnDropdownOptions.set(this.buildColumnDropdownOptions(sheet));
      this.columnWidths.set(this.buildDefaultColumnWidths(sheet));
    });

    effect(() => {
      const totalPages = this.totalPages();
      if (this.currentPage() > totalPages) {
        this.currentPage.set(totalPages);
      }
    });
  }

  ngOnDestroy(): void {
    this.onResizeEnd();
  }

  getColumnType(columnIndex: number): ExcelColumnType {
    return this.sheet().columnTypes[columnIndex] ?? 'text';
  }

  getColumnWidth(columnIndex: number): number {
    return this.columnWidths()[columnIndex] ?? DEFAULT_COLUMN_WIDTH;
  }

  getTextFilter(columnIndex: number): string {
    return this.textFilters()[columnIndex] ?? '';
  }

  getDropdownFilter(columnIndex: number): string {
    return this.dropdownFilters()[columnIndex] ?? '';
  }

  getDateFilterFrom(columnIndex: number): string {
    return this.dateRangeFilters()[columnIndex]?.from ?? '';
  }

  getDateFilterTo(columnIndex: number): string {
    return this.dateRangeFilters()[columnIndex]?.to ?? '';
  }

  getNumberFilterMin(columnIndex: number): string {
    return this.numberRangeFilters()[columnIndex]?.min ?? '';
  }

  getNumberFilterMax(columnIndex: number): string {
    return this.numberRangeFilters()[columnIndex]?.max ?? '';
  }

  hasColumnFilter(columnIndex: number): boolean {
    const columnType = this.getColumnType(columnIndex);

    if (columnType === 'date') {
      const filter = this.dateRangeFilters()[columnIndex];
      return Boolean(filter?.from.trim() || filter?.to.trim());
    }

    if (columnType === 'currency') {
      const filter = this.numberRangeFilters()[columnIndex];
      return Boolean(filter?.min.trim() || filter?.max.trim());
    }

    const textFilter = this.textFilters()[columnIndex]?.trim() ?? '';
    const dropdownFilter = this.dropdownFilters()[columnIndex] ?? '';
    return textFilter.length > 0 || dropdownFilter.length > 0;
  }

  onResizeStart(columnIndex: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.resizingColumnIndex = columnIndex;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = this.getColumnWidth(columnIndex);
    document.body.classList.add('excel-preview--resizing');
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
  }

  onTextFilterInput(columnIndex: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.textFilters.update((current) => ({ ...current, [columnIndex]: value }));
    this.currentPage.set(1);
  }

  onDropdownFilterChange(columnIndex: number, event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.dropdownFilters.update((current) => ({ ...current, [columnIndex]: value }));
    this.currentPage.set(1);
  }

  onDateFilterChange(
    columnIndex: number,
    field: keyof DateRangeFilter,
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement).value;
    this.dateRangeFilters.update((current) => ({
      ...current,
      [columnIndex]: {
        from: field === 'from' ? value : (current[columnIndex]?.from ?? ''),
        to: field === 'to' ? value : (current[columnIndex]?.to ?? ''),
      },
    }));
    this.currentPage.set(1);
  }

  onNumberFilterChange(
    columnIndex: number,
    field: keyof NumberRangeFilter,
    event: Event,
  ): void {
    const value = (event.target as HTMLInputElement).value;
    this.numberRangeFilters.update((current) => ({
      ...current,
      [columnIndex]: {
        min: field === 'min' ? value : (current[columnIndex]?.min ?? ''),
        max: field === 'max' ? value : (current[columnIndex]?.max ?? ''),
      },
    }));
    this.currentPage.set(1);
  }

  clearColumnFilter(columnIndex: number): void {
    const columnType = this.getColumnType(columnIndex);

    if (columnType === 'date') {
      this.dateRangeFilters.update((current) => {
        const next = { ...current };
        delete next[columnIndex];
        return next;
      });
    } else if (columnType === 'currency') {
      this.numberRangeFilters.update((current) => {
        const next = { ...current };
        delete next[columnIndex];
        return next;
      });
    } else {
      this.textFilters.update((current) => {
        const next = { ...current };
        delete next[columnIndex];
        return next;
      });
      this.dropdownFilters.update((current) => {
        const next = { ...current };
        delete next[columnIndex];
        return next;
      });
    }

    this.currentPage.set(1);
  }

  clearFilters(): void {
    this.textFilters.set({});
    this.dropdownFilters.set({});
    this.dateRangeFilters.set({});
    this.numberRangeFilters.set({});
    this.currentPage.set(1);
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  getColumnOptions(columnIndex: number): string[] {
    return this.columnDropdownOptions()[columnIndex] ?? [];
  }

  getHeaderLabel(columnIndex: number): string {
    const label = this.sheet().headers[columnIndex]?.trim();
    return label || `Coluna ${columnIndex + 1}`;
  }

  getCellValue(row: string[], columnIndex: number): string {
    return row[columnIndex] ?? '';
  }

  private getColumnRawValue(
    sheet: ExcelPreviewSheet,
    rowIndex: number,
    columnIndex: number,
    columnType: ExcelColumnType,
    displayValue: string,
  ): number | null {
    const storedRaw = sheet.rawRows[rowIndex]?.[columnIndex] ?? null;

    if (columnType === 'currency') {
      return (
        extractRawValueFromDisplay(displayValue, columnType) ??
        storedRaw
      );
    }

    if (columnType === 'date') {
      return storedRaw ?? extractRawValueFromDisplay(displayValue, columnType);
    }

    return storedRaw;
  }

  private buildDefaultColumnWidths(sheet: ExcelPreviewSheet): Record<number, number> {
    const widths: Record<number, number> = {};
    sheet.headers.forEach((header, columnIndex) => {
      const labelLength = (header.trim() || `Coluna ${columnIndex + 1}`).length;
      widths[columnIndex] = Math.max(
        DEFAULT_COLUMN_WIDTH,
        Math.min(MAX_COLUMN_WIDTH, labelLength * 10 + 48),
      );
    });
    return widths;
  }

  private matchesDateRangeFilter(
    rawValue: number | null,
    filter?: DateRangeFilter,
  ): boolean {
    if (!filter) {
      return true;
    }

    const fromMs = parseDateFilterInput(filter.from);
    const toMs = parseDateFilterInput(filter.to);
    if (fromMs == null && toMs == null) {
      return true;
    }

    if (rawValue == null) {
      return false;
    }

    if (fromMs != null && rawValue < fromMs) {
      return false;
    }

    if (toMs != null && rawValue > toMs) {
      return false;
    }

    return true;
  }

  private matchesNumberRangeFilter(
    rawValue: number | null,
    filter?: NumberRangeFilter,
  ): boolean {
    if (!filter) {
      return true;
    }

    let minValue = parseNumberFilterInput(filter.min);
    let maxValue = parseNumberFilterInput(filter.max);

    if (minValue != null && maxValue != null && minValue > maxValue) {
      [minValue, maxValue] = [maxValue, minValue];
    }

    if (minValue == null && maxValue == null) {
      return true;
    }

    if (rawValue == null) {
      return false;
    }

    if (minValue != null && rawValue < minValue) {
      return false;
    }

    if (maxValue != null && rawValue > maxValue) {
      return false;
    }

    return true;
  }

  private buildColumnDropdownOptions(sheet: ExcelPreviewSheet): string[][] {
    return sheet.headers.map((_, columnIndex) => {
      if (sheet.columnTypes[columnIndex] !== 'text') {
        return [];
      }

      const values = new Set<string>();
      for (const row of sheet.rows) {
        const value = String(row[columnIndex] ?? '').trim();
        if (value) {
          values.add(value);
        }
      }

      return Array.from(values)
        .sort((left, right) => left.localeCompare(right, 'pt-BR'))
        .slice(0, MAX_DROPDOWN_OPTIONS);
    });
  }
}
