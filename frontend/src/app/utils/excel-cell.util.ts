export type ExcelColumnType = 'text' | 'date' | 'currency';

const DATE_HEADER_PATTERN = /\b(data|date|dt\.?|vencimento|emiss[aã]o)\b/i;
const CURRENCY_HEADER_PATTERN = /\b(valor|pre[cç]o|total|montante|r\$|custo|saldo)\b/i;
const JS_DATE_STRING_PATTERN =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+\w{3}\s+\d{1,2}\s+\d{4}/i;
const DD_MM_YYYY_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatDateDdMmYyyy(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function dateToMsStartOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatMsToDdMmYyyy(ms: number): string {
  return formatDateDdMmYyyy(new Date(ms));
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function parseDateStringToMs(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const ddMmYyyy = trimmed.match(DD_MM_YYYY_PATTERN);
  if (ddMmYyyy) {
    const day = Number(ddMmYyyy[1]);
    const month = Number(ddMmYyyy[2]);
    const year = Number(ddMmYyyy[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return dateToMsStartOfDay(date);
    }
    return null;
  }

  if (JS_DATE_STRING_PATTERN.test(trimmed)) {
    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return dateToMsStartOfDay(parsed);
    }
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return dateToMsStartOfDay(date);
    }
  }

  return null;
}

export function parseCurrencyToNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const accountingMatch = trimmed.match(/^\(\s*([^)]+)\s*\)$/);
  if (accountingMatch) {
    return parseCurrencyToNumber(`-${accountingMatch[1]}`);
  }

  let normalized = trimmed
    .replace(/\s/g, '')
    .replace(/[−–—]/g, '-')
    .replace(/R\$/gi, '');

  const isNegative = normalized.startsWith('-');
  if (isNegative) {
    normalized = normalized.slice(1);
  }

  normalized = normalized.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return isNegative ? -Math.abs(parsed) : parsed;
}

export function excelSerialToDate(serial: number): Date {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  return new Date(excelEpoch.getTime() + serial * 86400000);
}

export function resolveCellValue(value: unknown): unknown {
  if (value == null) {
    return null;
  }

  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value;
    }

    if ('richText' in value) {
      const parts = (value as { richText: Array<{ text?: string }> }).richText;
      return parts.map((part) => part.text ?? '').join('');
    }

    if ('result' in value) {
      return (value as { result?: unknown }).result ?? null;
    }

    if ('text' in value) {
      const textValue = (value as { text?: string }).text;
      return textValue && textValue.trim().length > 0 ? textValue : null;
    }
  }

  return value;
}

export function resolveCurrencyCellValue(value: unknown, text?: string): unknown {
  const resolved = resolveCellValue(value);
  const normalizedText = text?.trim() ?? '';

  if (typeof resolved === 'number' && Number.isFinite(resolved) && normalizedText) {
    const parsedFromText = parseCurrencyToNumber(normalizedText);
    if (
      parsedFromText != null &&
      parsedFromText < 0 &&
      resolved > 0 &&
      Math.abs(parsedFromText) === Math.abs(resolved)
    ) {
      return parsedFromText;
    }
    return resolved;
  }

  if (resolved != null && resolved !== '') {
    return resolved;
  }

  return normalizedText || null;
}

function isDateLikeValue(value: unknown): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value === 'string') {
    return parseDateStringToMs(value) != null;
  }

  if (typeof value === 'number') {
    return value > 20000 && value < 80000;
  }

  return false;
}

function isCurrencyLikeValue(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value === 'string') {
    return parseCurrencyToNumber(value) != null;
  }

  return false;
}

export function inferColumnType(header: string, samples: unknown[]): ExcelColumnType {
  const normalizedHeader = header.trim().toLowerCase();
  if (DATE_HEADER_PATTERN.test(normalizedHeader)) {
    return 'date';
  }
  if (CURRENCY_HEADER_PATTERN.test(normalizedHeader)) {
    return 'currency';
  }

  const meaningfulSamples = samples
    .map((sample) => resolveCellValue(sample))
    .filter((sample) => sample != null && sample !== '');

  if (meaningfulSamples.length === 0) {
    return 'text';
  }

  const dateCount = meaningfulSamples.filter((sample) => isDateLikeValue(sample)).length;
  const currencyCount = meaningfulSamples.filter((sample) => isCurrencyLikeValue(sample)).length;

  if (dateCount / meaningfulSamples.length >= 0.6) {
    return 'date';
  }

  if (currencyCount / meaningfulSamples.length >= 0.6) {
    return 'currency';
  }

  return 'text';
}

export function extractRawValue(value: unknown, columnType: ExcelColumnType): number | null {
  const resolved = resolveCellValue(value);
  if (resolved == null || resolved === '') {
    return null;
  }

  if (columnType === 'date') {
    if (resolved instanceof Date) {
      return dateToMsStartOfDay(resolved);
    }
    if (typeof resolved === 'number') {
      return dateToMsStartOfDay(excelSerialToDate(resolved));
    }
    if (typeof resolved === 'string') {
      return parseDateStringToMs(resolved);
    }
    return null;
  }

  if (columnType === 'currency') {
    if (typeof resolved === 'number') {
      return resolved;
    }
    if (typeof resolved === 'string') {
      return parseCurrencyToNumber(resolved);
    }
  }

  return null;
}

export function extractRawValueFromDisplay(
  displayValue: string,
  columnType: ExcelColumnType,
): number | null {
  if (!displayValue.trim()) {
    return null;
  }

  if (columnType === 'currency') {
    return parseCurrencyToNumber(displayValue);
  }

  if (columnType === 'date') {
    return parseDateStringToMs(displayValue);
  }

  return null;
}

export function formatDisplayValue(value: unknown, columnType: ExcelColumnType): string {
  const resolved = resolveCellValue(value);
  if (resolved == null || resolved === '') {
    return '';
  }

  if (columnType === 'date') {
    const rawDate = extractRawValue(resolved, 'date');
    if (rawDate != null) {
      return formatMsToDdMmYyyy(rawDate);
    }
    if (resolved instanceof Date) {
      return formatDateDdMmYyyy(resolved);
    }
    return String(resolved);
  }

  if (columnType === 'currency') {
    const rawNumber = extractRawValue(resolved, 'currency');
    if (rawNumber != null) {
      return formatCurrency(rawNumber);
    }
    return String(resolved);
  }

  if (resolved instanceof Date) {
    return formatDateDdMmYyyy(resolved);
  }

  return String(resolved);
}

export function inferColumnTypes(headers: string[], dataMatrix: unknown[][]): ExcelColumnType[] {
  return headers.map((header, columnIndex) => {
    const samples = dataMatrix
      .slice(0, 50)
      .map((row) => row[columnIndex])
      .filter((value) => value != null && value !== '');
    return inferColumnType(header, samples);
  });
}

export function buildSheetFromMatrix(matrix: unknown[][]): {
  headers: string[];
  rows: string[][];
  rawRows: (number | null)[][];
  columnTypes: ExcelColumnType[];
} {
  if (matrix.length === 0) {
    return { headers: [], rows: [], rawRows: [], columnTypes: [] };
  }

  const columnCount = matrix.reduce((max, row) => Math.max(max, row.length), 0);
  const normalizedMatrix = matrix.map((row) => {
    const copy = [...row];
    while (copy.length < columnCount) {
      copy.push('');
    }
    return copy;
  });

  const headers = normalizedMatrix[0].map((cell) => String(resolveCellValue(cell) ?? '').trim());
  const dataMatrix = normalizedMatrix.slice(1);
  const columnTypes = inferColumnTypes(headers, dataMatrix);

  const rows = dataMatrix.map((row) =>
    row.map((cell, columnIndex) => formatDisplayValue(cell, columnTypes[columnIndex])),
  );

  const rawRows = dataMatrix.map((row) =>
    row.map((cell, columnIndex) => extractRawValue(cell, columnTypes[columnIndex])),
  );

  return { headers, rows, rawRows, columnTypes };
}

export function parseDateFilterInput(value: string): number | null {
  return parseDateStringToMs(value);
}

export function parseNumberFilterInput(value: string): number | null {
  return parseCurrencyToNumber(value);
}
