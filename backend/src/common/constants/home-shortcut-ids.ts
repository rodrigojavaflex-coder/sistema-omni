/** IDs estáticos de atalhos (rotas fixas do menu). Links BI usam `bi-acesso:{uuid}`. */
export const HOME_SHORTCUT_IDS = [
  'auditoria',
  'users',
  'perfil',
  'departamentos',
  'configuracao',
  'configuracao-tempo-fluxo',
  'bi-acesso-links',
  'motoristas',
  'veiculos',
  'modelos-veiculo',
  'empresas-terceiras',
  'ocorrencias',
  'trechos',
  'origem-ocorrencia',
  'categoria-ocorrencia',
  'areas-vistoriadas',
  'componentes',
  'sintomas',
  'matriz-criticidade',
  'metas',
  'vistorias',
  'tratamento',
  'manutencao',
  'validacao-final',
  'painel-metas',
  'painel-ocorrencias',
  'relatorios',
] as const;

export type HomeShortcutId = (typeof HOME_SHORTCUT_IDS)[number];

export const HOME_SHORTCUTS_MAX = 8;

export const HOME_SHORTCUT_ID_SET = new Set<string>(HOME_SHORTCUT_IDS);

export const BI_HOME_SHORTCUT_PREFIX = 'bi-acesso:';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isBiHomeShortcutId(id: string): boolean {
  return id.startsWith(BI_HOME_SHORTCUT_PREFIX);
}

export function extractBiLinkIdFromShortcutId(id: string): string | null {
  if (!isBiHomeShortcutId(id)) return null;
  const linkId = id.slice(BI_HOME_SHORTCUT_PREFIX.length).trim();
  return UUID_REGEX.test(linkId) ? linkId : null;
}
