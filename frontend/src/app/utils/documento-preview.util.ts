import {
  DocumentoPreviewKind,
  getDocumentoPreviewKind,
  isDocxMime,
  isLegacyDocMime,
  isLegacyXlsMime,
} from './documento-file.util';
import {
  ExcelColumnType,
  buildSheetFromMatrix,
  resolveCurrencyCellValue,
} from './excel-cell.util';

export type { ExcelColumnType };

export interface ExcelPreviewSheet {
  name: string;
  headers: string[];
  rows: string[][];
  rawRows: (number | null)[][];
  columnTypes: ExcelColumnType[];
  isEmpty: boolean;
}

export interface DocumentoPreviewResult {
  kind: DocumentoPreviewKind;
  objectUrl?: string;
  htmlContent?: string;
  excelSheets?: ExcelPreviewSheet[];
  unsupportedMessage?: string;
}

function isSheetEmpty(headers: string[], rows: string[][]): boolean {
  const hasHeader = headers.some((cell) => cell.trim().length > 0);
  const hasRows = rows.some((row) => row.some((cell) => cell.trim().length > 0));
  return !hasHeader && !hasRows;
}

function readWorksheetMatrix(worksheet: {
  rowCount: number;
  columnCount: number;
  getCell: (row: number, col: number) => { text?: string; value?: unknown };
}): unknown[][] {
  const maxRow = worksheet.rowCount || 0;
  const maxCol = worksheet.columnCount || 0;
  if (maxRow === 0 || maxCol === 0) {
    return [];
  }

  const matrix: unknown[][] = [];
  for (let rowIndex = 1; rowIndex <= maxRow; rowIndex += 1) {
    const row: unknown[] = [];
    for (let colIndex = 1; colIndex <= maxCol; colIndex += 1) {
      const cell = worksheet.getCell(rowIndex, colIndex);
      row.push(resolveCurrencyCellValue(cell.value, cell.text));
    }
    matrix.push(row);
  }

  return matrix;
}

function emptyExcelPreview(): DocumentoPreviewResult {
  return {
    kind: 'excel',
    unsupportedMessage: 'Planilha vazia ou formato não suportado para visualização.',
  };
}

async function previewPdf(blob: Blob): Promise<DocumentoPreviewResult> {
  const pdfBlob =
    blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
  return {
    kind: 'pdf',
    objectUrl: URL.createObjectURL(pdfBlob),
  };
}

async function previewImage(blob: Blob, mimeType: string): Promise<DocumentoPreviewResult> {
  const imageBlob = blob.type.startsWith('image/') ? blob : new Blob([blob], { type: mimeType });
  return {
    kind: 'image',
    objectUrl: URL.createObjectURL(imageBlob),
  };
}

async function previewWord(
  blob: Blob,
  mimeType: string,
  fileName?: string,
): Promise<DocumentoPreviewResult> {
  if (isLegacyDocMime(mimeType, fileName) && !isDocxMime(mimeType, fileName)) {
    return {
      kind: 'word',
      unsupportedMessage:
        'Pré-visualização indisponível para arquivos .doc legados. Faça o download para abrir no Word.',
    };
  }

  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.convertToHtml({ arrayBuffer: await blob.arrayBuffer() });
    return {
      kind: 'word',
      htmlContent: result.value,
    };
  } catch {
    return {
      kind: 'word',
      unsupportedMessage:
        'Não foi possível gerar a pré-visualização deste documento Word. Faça o download do arquivo.',
    };
  }
}

async function previewModernExcel(blob: Blob): Promise<DocumentoPreviewResult> {
  const ExcelJSMod = await import('exceljs');
  const ExcelJS = ExcelJSMod.default ?? ExcelJSMod;
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await blob.arrayBuffer());

  if (!workbook.worksheets.length) {
    return emptyExcelPreview();
  }

  const excelSheets: ExcelPreviewSheet[] = workbook.worksheets.map((worksheet) => {
    const matrix = readWorksheetMatrix(worksheet);
    const { headers, rows, rawRows, columnTypes } = buildSheetFromMatrix(matrix);
    return {
      name: worksheet.name,
      headers,
      rows,
      rawRows,
      columnTypes,
      isEmpty: isSheetEmpty(headers, rows),
    };
  });

  return {
    kind: 'excel',
    excelSheets,
  };
}

async function previewLegacyExcel(blob: Blob): Promise<DocumentoPreviewResult> {
  const XLSX = await import('xlsx');
  const workbook = XLSX.read(await blob.arrayBuffer(), { type: 'array' });
  const sheetNames = workbook.SheetNames;

  if (!sheetNames.length) {
    return emptyExcelPreview();
  }

  const excelSheets: ExcelPreviewSheet[] = sheetNames.map((sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: true,
    }) as unknown[][];
    const matrix = rawRows.map((row) =>
      (row as unknown[]).map((cell) => resolveCurrencyCellValue(cell)),
    );
    const sheetData = buildSheetFromMatrix(matrix);
    return {
      name: sheetName,
      headers: sheetData.headers,
      rows: sheetData.rows,
      rawRows: sheetData.rawRows,
      columnTypes: sheetData.columnTypes,
      isEmpty: isSheetEmpty(sheetData.headers, sheetData.rows),
    };
  });

  return {
    kind: 'excel',
    excelSheets,
  };
}

async function previewExcel(
  blob: Blob,
  mimeType: string,
  fileName?: string,
): Promise<DocumentoPreviewResult> {
  try {
    if (isLegacyXlsMime(mimeType, fileName)) {
      return await previewLegacyExcel(blob);
    }
    return await previewModernExcel(blob);
  } catch {
    return {
      kind: 'excel',
      unsupportedMessage:
        'Não foi possível gerar a pré-visualização desta planilha. Faça o download do arquivo.',
    };
  }
}

export async function buildDocumentoPreview(
  blob: Blob,
  mimeType: string,
  fileName?: string,
): Promise<DocumentoPreviewResult> {
  const kind = getDocumentoPreviewKind(mimeType, fileName);

  try {
    switch (kind) {
      case 'pdf':
        return await previewPdf(blob);
      case 'image':
        return await previewImage(blob, mimeType);
      case 'word':
        return await previewWord(blob, mimeType, fileName);
      case 'excel':
        return await previewExcel(blob, mimeType, fileName);
      default:
        return {
          kind: 'unsupported',
          unsupportedMessage:
            'Pré-visualização não disponível para este formato. Faça o download do arquivo.',
        };
    }
  } catch {
    return {
      kind: 'unsupported',
      unsupportedMessage:
        'Não foi possível gerar a pré-visualização. Faça o download do arquivo.',
    };
  }
}

export function revokeDocumentoPreview(preview: DocumentoPreviewResult | null): void {
  if (preview?.objectUrl) {
    URL.revokeObjectURL(preview.objectUrl);
  }
}
