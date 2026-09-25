/** Grupos preenchidos em runtime (ex.: links BI). */
export const DYNAMIC_PERMISSION_GROUP_KEYS = ['BI — Acesso'] as const;

/** Módulos de permissão alinhados ao menu lateral (ordem de exibição). */
export interface PermissionModuleConfig {
  key: string;
  label: string;
  groupKeys: string[];
}

export const PERMISSION_MODULE_CONFIG: PermissionModuleConfig[] = [
  {
    key: 'administracao',
    label: 'Administração',
    groupKeys: [
      'Configuração',
      'Usuários',
      'Perfis',
      'Auditoria',
      'Departamentos',
      'BI - Administração',
    ],
  },
  {
    key: 'cadastros-gerais',
    label: 'Cadastros — Gerais',
    groupKeys: [
      'Motoristas',
      'Veículos',
      'Modelos de Veículo',
      'Empresa Terceira',
    ],
  },
  {
    key: 'documentos',
    label: 'Documentos',
    groupKeys: ['Tipos de Documento', 'Documentos'],
  },
  {
    key: 'ocorrencias',
    label: 'Ocorrências',
    groupKeys: [
      'Ocorrências',
      'Trechos',
      'Origem da Ocorrência',
      'Categoria da Ocorrência',
    ],
  },
  {
    key: 'vistoria-cadastros',
    label: 'Vistoria',
    groupKeys: [
      'Áreas Vistoriadas',
      'Componentes',
      'Sintomas',
      'Vistas do veículo',
      'Matriz de Criticidade',
    ],
  },
  {
    key: 'metas',
    label: 'Metas',
    groupKeys: ['Metas'],
  },
  {
    key: 'mobile',
    label: 'Mobile',
    groupKeys: ['Vistoria Mobile'],
  },
  {
    key: 'gestao',
    label: 'Gestão',
    groupKeys: [
      'Vistoria Web',
      'Irregularidades – Tratamento',
      'Irregularidades – Manutenção',
      'Irregularidades – Validação',
      'BI — Acesso',
    ],
  },
  {
    key: 'relatorios',
    label: 'Relatórios',
    groupKeys: ['Relatórios', 'Relatórios – Pendências do veículo'],
  },
];
