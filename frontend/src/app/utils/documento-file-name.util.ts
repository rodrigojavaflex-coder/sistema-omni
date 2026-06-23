const INVALID_FILE_NAME_CHARS = /[\\/:*?"<>|]/g;

export interface DocumentoDownloadNameInput {
  nomeDocumento: string;
  tipoDocumento: string;
  departamento: string;
  nomeArquivoOriginal: string;
}

function sanitizeFileNamePart(value: string): string {
  return value
    .trim()
    .replace(INVALID_FILE_NAME_CHARS, '')
    .replace(/\s+/g, ' ')
    .replace(/\.+$/g, '');
}

function extractExtension(fileName: string): string {
  const normalized = fileName.trim();
  const lastDot = normalized.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === normalized.length - 1) {
    return '';
  }
  return normalized.slice(lastDot + 1).toLowerCase();
}

export function buildDocumentoDownloadFileName(
  input: DocumentoDownloadNameInput,
): string {
  const extension = extractExtension(input.nomeArquivoOriginal);
  const parts = [
    sanitizeFileNamePart(input.tipoDocumento),
    sanitizeFileNamePart(input.nomeDocumento),
    sanitizeFileNamePart(input.departamento),
  ].filter((part) => part.length > 0);

  const baseName = parts.join('.') || sanitizeFileNamePart(input.nomeArquivoOriginal);
  return extension ? `${baseName}.${extension}` : baseName;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
