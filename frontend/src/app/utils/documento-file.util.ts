export type DocumentoPreviewKind = 'pdf' | 'image' | 'word' | 'excel' | 'unsupported';

const IMAGE_MIME_PREFIX = 'image/';

export function isImageMime(mimeType: string): boolean {
  return mimeType.toLowerCase().startsWith(IMAGE_MIME_PREFIX);
}

export function isPdfMime(mimeType: string, fileName?: string): boolean {
  const mime = mimeType.toLowerCase();
  if (mime.includes('pdf')) {
    return true;
  }
  return fileName?.toLowerCase().endsWith('.pdf') ?? false;
}

export function isWordMime(mimeType: string, fileName?: string): boolean {
  const mime = mimeType.toLowerCase();
  if (
    mime.includes('wordprocessingml') ||
    mime.includes('msword') ||
    mime.includes('word')
  ) {
    return true;
  }
  const ext = fileName?.split('.').pop()?.toLowerCase();
  return ext === 'doc' || ext === 'docx';
}

export function isExcelMime(mimeType: string, fileName?: string): boolean {
  const mime = mimeType.toLowerCase();
  if (mime.includes('sheet') || mime.includes('excel') || mime.includes('ms-excel')) {
    return true;
  }
  const ext = fileName?.split('.').pop()?.toLowerCase();
  return ext === 'xls' || ext === 'xlsx';
}

export function isLegacyDocMime(mimeType: string, fileName?: string): boolean {
  const mime = mimeType.toLowerCase();
  if (mime === 'application/msword') {
    return true;
  }
  return fileName?.toLowerCase().endsWith('.doc') ?? false;
}

export function isDocxMime(mimeType: string, fileName?: string): boolean {
  const mime = mimeType.toLowerCase();
  if (mime.includes('wordprocessingml')) {
    return true;
  }
  return fileName?.toLowerCase().endsWith('.docx') ?? false;
}

export function isLegacyXlsMime(mimeType: string, fileName?: string): boolean {
  const mime = mimeType.toLowerCase();
  if (mime === 'application/vnd.ms-excel') {
    return true;
  }
  const lowerName = fileName?.toLowerCase() ?? '';
  return lowerName.endsWith('.xls') && !lowerName.endsWith('.xlsx');
}

export function getDocumentoPreviewKind(
  mimeType: string,
  fileName?: string,
): DocumentoPreviewKind {
  if (isPdfMime(mimeType, fileName)) {
    return 'pdf';
  }
  if (isImageMime(mimeType)) {
    return 'image';
  }
  if (isWordMime(mimeType, fileName)) {
    return 'word';
  }
  if (isExcelMime(mimeType, fileName)) {
    return 'excel';
  }
  return 'unsupported';
}

export function getFileKindLabel(mimeType: string, fileName?: string): string {
  const kind = getDocumentoPreviewKind(mimeType, fileName);
  switch (kind) {
    case 'pdf':
      return 'PDF';
    case 'image':
      return 'IMG';
    case 'word':
      return 'DOC';
    case 'excel':
      return 'XLS';
    default: {
      const ext = fileName?.split('.').pop()?.toUpperCase();
      return ext && ext.length <= 5 ? ext : 'ARQ';
    }
  }
}
