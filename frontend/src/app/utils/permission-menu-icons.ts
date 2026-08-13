import { getNavigationMenuIconHtml } from '../config/navigation-icons';

/** Ícones dos módulos de permissão (alinhados ao menu lateral). */
export const PERMISSION_MODULE_ICON_KEYS: Record<string, string> = {
  administracao: 'feather-settings',
  'cadastros-gerais': 'feather-grid',
  documentos: 'feather-folder',
  ocorrencias: 'feather-alert-circle',
  'vistoria-cadastros': 'feather-check',
  metas: 'feather-target',
  mobile: 'feather-check-square',
  gestao: 'feather-briefcase',
  relatorios: 'feather-bar-chart-2',
};

/** Ícones das telas/grupos (labels de PERMISSION_MODULE_CONFIG.groupKeys). */
export const PERMISSION_GROUP_ICON_KEYS: Record<string, string> = {
  Configuração: 'feather-settings',
  Usuários: 'feather-users',
  Perfis: 'feather-shield',
  Auditoria: 'feather-search',
  Departamentos: 'feather-briefcase',
  'BI - Administração': 'feather-pie-chart',
  Motoristas: 'feather-user',
  Veículos: 'feather-truck',
  'Modelos de Veículo': 'feather-layers',
  'Empresa Terceira': 'feather-briefcase',
  'Tipos de Documento': 'feather-file-text',
  Documentos: 'feather-book-open',
  Ocorrências: 'feather-alert-circle',
  Trechos: 'feather-layers',
  'Origem da Ocorrência': 'feather-archive',
  'Categoria da Ocorrência': 'feather-tag',
  'Áreas Vistoriadas': 'feather-grid',
  Componentes: 'feather-layers',
  Sintomas: 'feather-activity',
  'Matriz de Criticidade': 'feather-grid',
  Metas: 'feather-target',
  'Vistoria Web': 'feather-check-square',
  'Vistoria Mobile': 'feather-check-square',
  'Irregularidades – Tratamento': 'tabler-replace',
  'Irregularidades – Manutenção': 'feather-bus-front',
  'Irregularidades – Validação': 'tabler-list-check',
  'BI — Acesso': 'feather-pie-chart',
  Relatórios: 'feather-bar-chart-2',
};

export function getPermissionModuleIconKey(moduleKey: string): string {
  return PERMISSION_MODULE_ICON_KEYS[moduleKey] ?? 'feather-file-text';
}

export function getPermissionGroupIconKey(groupKey: string): string {
  return PERMISSION_GROUP_ICON_KEYS[groupKey] ?? 'feather-file-text';
}

export function getPermissionModuleIconHtml(moduleKey: string): string {
  return getNavigationMenuIconHtml(getPermissionModuleIconKey(moduleKey));
}

export function getPermissionGroupIconHtml(groupKey: string): string {
  return getNavigationMenuIconHtml(getPermissionGroupIconKey(groupKey));
}
