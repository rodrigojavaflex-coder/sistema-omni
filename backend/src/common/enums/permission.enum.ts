export enum Permission {
  CONFIGURACAO_ACCESS = 'configuracao:access',
  // Usuários
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_PRINT = 'user:print',
  USER_AUDIT = 'user:audit',

  // Administração
  ADMIN_FULL = 'admin:full',

  // Sistema
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_LOGS = 'system:logs',

  // Relatórios
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',

  // Auditoria
  AUDIT_VIEW = 'audit:view',
  AUDIT_MANAGE = 'audit:manage',
  // Perfis
  PROFILE_CREATE = 'perfil:create',
  PROFILE_READ   = 'perfil:read',
  PROFILE_UPDATE = 'perfil:update',
  PROFILE_DELETE = 'perfil:delete',
}

export const PERMISSION_GROUPS = {
  Configuração: [
    {
      key: Permission.CONFIGURACAO_ACCESS,
      label: 'Acessar tela de configuração',
    },
  ],
  Usuários: [
    { key: Permission.USER_CREATE, label: 'Criar usuários' },
    { key: Permission.USER_READ, label: 'Visualizar usuários' },
    { key: Permission.USER_UPDATE, label: 'Editar usuários' },
    { key: Permission.USER_DELETE, label: 'Excluir usuários' },
    { key: Permission.USER_PRINT, label: 'Imprimir relatórios de usuários' },
    { key: Permission.USER_AUDIT, label: 'Visualizar auditoria' },
  ],
  Administração: [
    { key: Permission.ADMIN_FULL, label: 'Administração completa' },
  ],
  Sistema: [
    { key: Permission.SYSTEM_CONFIG, label: 'Configurações do sistema' },
    { key: Permission.SYSTEM_LOGS, label: 'Visualizar logs do sistema' },
  ],
  Relatórios: [
    { key: Permission.REPORTS_VIEW, label: 'Visualizar relatórios' },
    { key: Permission.REPORTS_EXPORT, label: 'Exportar relatórios' },
  ],
  Auditoria: [
    { key: Permission.AUDIT_VIEW, label: 'Visualizar logs de auditoria' },
    { key: Permission.AUDIT_MANAGE, label: 'Gerenciar logs de auditoria' },
  ],
  Perfis: [
    { key: Permission.PROFILE_CREATE, label: 'Criar perfis' },
    { key: Permission.PROFILE_READ, label: 'Visualizar perfis' },
    { key: Permission.PROFILE_UPDATE, label: 'Editar perfis' },
    { key: Permission.PROFILE_DELETE, label: 'Excluir perfis' },
  ],
};

export const ALL_PERMISSIONS = Object.values(Permission);
