export enum Permission {
  CONFIGURACAO_ACCESS = 'configuracao:access',
  // Usuários
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  USER_AUDIT = 'user:audit',

  // Relatórios
  REPORTS_VIEW = 'reports:view',

  // Auditoria
  AUDIT_VIEW = 'audit:view',

  // Perfis
  PROFILE_CREATE = 'perfil:create',
  PROFILE_READ   = 'perfil:read',
  PROFILE_UPDATE = 'perfil:update',
  PROFILE_DELETE = 'perfil:delete',
  
  // Veículos
  VEICULO_CREATE = 'veiculo:create',
  VEICULO_READ = 'veiculo:read',
  VEICULO_UPDATE = 'veiculo:update',
  VEICULO_DELETE = 'veiculo:delete',
  VEICULO_AUDIT = 'veiculo:audit',
  
  // Motoristas
  MOTORISTA_CREATE = 'motorista:create',
  MOTORISTA_READ = 'motorista:read',
  MOTORISTA_UPDATE = 'motorista:update',
  MOTORISTA_DELETE = 'motorista:delete',
  MOTORISTA_AUDIT = 'motorista:audit',
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
    { key: Permission.USER_AUDIT, label: 'Visualizar auditoria' },
  ],
  Relatórios: [
    { key: Permission.REPORTS_VIEW, label: 'Visualizar relatórios' },
  ],
  Auditoria: [
    { key: Permission.AUDIT_VIEW, label: 'Visualizar logs de auditoria' },
  ],
  Perfis: [
    { key: Permission.PROFILE_CREATE, label: 'Criar perfis' },
    { key: Permission.PROFILE_READ, label: 'Visualizar perfis' },
    { key: Permission.PROFILE_UPDATE, label: 'Editar perfis' },
    { key: Permission.PROFILE_DELETE, label: 'Excluir perfis' },
  ],
  Veículos: [
    { key: Permission.VEICULO_CREATE, label: 'Criar veículos' },
    { key: Permission.VEICULO_READ, label: 'Visualizar veículos' },
    { key: Permission.VEICULO_UPDATE, label: 'Editar veículos' },
    { key: Permission.VEICULO_DELETE, label: 'Excluir veículos' },
    { key: Permission.VEICULO_AUDIT, label: 'Auditar veículos' },
  ],
  Motoristas: [
    { key: Permission.MOTORISTA_CREATE, label: 'Criar motoristas' },
    { key: Permission.MOTORISTA_READ, label: 'Visualizar motoristas' },
    { key: Permission.MOTORISTA_UPDATE, label: 'Editar motoristas' },
    { key: Permission.MOTORISTA_DELETE, label: 'Excluir motoristas' },
    { key: Permission.MOTORISTA_AUDIT, label: 'Auditar motoristas' },
  ],
};

export const ALL_PERMISSIONS = Object.values(Permission);
