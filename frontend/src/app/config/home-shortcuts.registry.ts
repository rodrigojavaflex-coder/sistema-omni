/** Definição de um atalho exibível na home. */
export interface HomeShortcutDef {
  id: string;
  label: string;
  /** Texto extra para busca (ex.: título completo quando o label do menu é abreviado). */
  searchLabel?: string;
  route: string;
  icon: string;
  category: string;
  requiredPermissions: string[];
}

/** Máximo de atalhos na tela inicial. */
export const HOME_SHORTCUTS_MAX = 8;

/** Atalhos sugeridos quando o usuário ainda não personalizou. */
export const DEFAULT_HOME_SHORTCUT_IDS: readonly string[] = [
  'ocorrencias',
  'vistorias',
  'painel-ocorrencias',
  'veiculos',
];
