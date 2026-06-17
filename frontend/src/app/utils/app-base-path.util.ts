export function getAppBasePath(): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
  if (baseHref === '/') {
    return '';
  }

  return baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;
}

export function buildAppUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = getAppBasePath();

  if (typeof window === 'undefined') {
    return `${basePath}${normalizedPath}`;
  }

  return `${window.location.origin}${basePath}${normalizedPath}`;
}
