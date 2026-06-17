export const DOCUMENTO_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export const DOCUMENTO_MIME_TYPES_PERMITIDOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
] as const;

export const DOCUMENTO_PUBLIC_RATE_LIMIT_WINDOW_MS = 60_000;
export const DOCUMENTO_PUBLIC_RATE_LIMIT_MAX = 60;
