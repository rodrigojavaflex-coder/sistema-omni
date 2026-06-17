import { MenuItem, MENU_CONFIGURATION } from '../models/menu.model';
import { BiAcessoMenuItem } from '../models/bi-acesso-link.model';
import { HomeShortcutDef } from './home-shortcuts.registry';

/** Prefixo de IDs de atalhos BI cadastrados dinamicamente. */
export const BI_HOME_SHORTCUT_PREFIX = 'bi-acesso:';

/** Mapeamento estável rota → id (compatível com preferências já salvas). */
const ROUTE_TO_SHORTCUT_ID: Record<string, string> = {
  '/auditoria': 'auditoria',
  '/users': 'users',
  '/perfil': 'perfil',
  '/departamento': 'departamentos',
  '/configuracao': 'configuracao',
  '/configuracao/tempo-fluxo': 'configuracao-tempo-fluxo',
  '/bi-acesso-links': 'bi-acesso-links',
  '/motorista': 'motoristas',
  '/veiculo': 'veiculos',
  '/modelos-veiculo': 'modelos-veiculo',
  '/empresa-terceira': 'empresas-terceiras',
  '/tipo-documento': 'tipo-documento',
  '/documento': 'documento',
  '/ocorrencia': 'ocorrencias',
  '/trechos': 'trechos',
  '/origem-ocorrencia': 'origem-ocorrencia',
  '/categoria-ocorrencia': 'categoria-ocorrencia',
  '/areas-vistoriadas': 'areas-vistoriadas',
  '/componentes': 'componentes',
  '/sintomas': 'sintomas',
  '/matriz-criticidade': 'matriz-criticidade',
  '/meta': 'metas',
  '/vistorias': 'vistorias',
  '/irregularidades/tratamento': 'tratamento',
  '/irregularidades/manutencao': 'manutencao',
  '/irregularidades/validacao-final': 'validacao-final',
  '/meta/dashboard': 'painel-metas',
  '/ocorrencia/painel': 'painel-ocorrencias',
  '/reports': 'relatorios',
};

export function routeToShortcutId(route: string): string {
  return ROUTE_TO_SHORTCUT_ID[route] ?? route.replace(/^\//, '').replace(/\//g, '-');
}

export function isBiHomeShortcutId(id: string): boolean {
  return id.startsWith(BI_HOME_SHORTCUT_PREFIX);
}

export function biHomeShortcutId(linkId: string): string {
  return `${BI_HOME_SHORTCUT_PREFIX}${linkId}`;
}

export function extractBiLinkIdFromShortcutId(id: string): string | null {
  if (!isBiHomeShortcutId(id)) return null;
  const linkId = id.slice(BI_HOME_SHORTCUT_PREFIX.length).trim();
  return linkId || null;
}

export function buildStaticHomeShortcutsFromMenu(): HomeShortcutDef[] {
  const results: HomeShortcutDef[] = [];
  collectMenuShortcuts(MENU_CONFIGURATION.items, [], results);
  return results;
}

function collectMenuShortcuts(
  items: MenuItem[],
  path: string[],
  results: HomeShortcutDef[],
): void {
  for (const item of items) {
    if (item.isSubmenu && item.submenuItems?.length) {
      collectMenuShortcuts(item.submenuItems, [...path, item.label], results);
      continue;
    }

    if (!item.route) continue;

    const category =
      path.length > 0 ? path.join(' / ') : item.label;

    results.push({
      id: routeToShortcutId(item.route),
      label: item.label,
      searchLabel: item.title ? `${item.label} ${item.title}` : item.label,
      route: item.route,
      icon: item.icon,
      category,
      requiredPermissions: [...item.requiredPermissions],
    });
  }
}

export function buildBiHomeShortcuts(items: BiAcessoMenuItem[]): HomeShortcutDef[] {
  return items.map((item) => ({
    id: biHomeShortcutId(item.id),
    label: item.label,
    searchLabel: item.label,
    route: `/bi-acesso/view/${item.id}`,
    icon: item.icon?.startsWith('feather-') ? item.icon : 'feather-bar-chart-2',
    category: `${item.group || 'Gestão'} / ${item.subgroup || 'BI'}`,
    requiredPermissions: [item.permissionKey],
  }));
}

/** IDs estáticos derivados do menu (espelha validação do backend). */
export function getStaticHomeShortcutIds(): string[] {
  return buildStaticHomeShortcutsFromMenu().map((s) => s.id);
}
