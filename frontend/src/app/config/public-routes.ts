export const PUBLIC_APP_ROUTE_PREFIXES = [
  '/login',
  '/redefinir-senha',
  '/documentos/publico/',
] as const;

export function isPublicAppRoute(path: string): boolean {
  const normalized = path.split('?')[0].split('#')[0];
  return PUBLIC_APP_ROUTE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function isPublicDocumentRoute(path: string): boolean {
  const normalized = path.split('?')[0].split('#')[0];
  return normalized.startsWith('/documentos/publico/');
}
