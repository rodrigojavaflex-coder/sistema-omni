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
  PROFILE_READ = 'perfil:read',
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

  // Ocorrências
  OCORRENCIA_CREATE = 'ocorrencia:create',
  OCORRENCIA_READ = 'ocorrencia:read',
  OCORRENCIA_UPDATE = 'ocorrencia:update',
  OCORRENCIA_DELETE = 'ocorrencia:delete',
  OCORRENCIA_AUDIT = 'ocorrencia:audit',

  // Trechos
  TRECHO_CREATE = 'trecho:create',
  TRECHO_READ = 'trecho:read',
  TRECHO_UPDATE = 'trecho:update',
  TRECHO_DELETE = 'trecho:delete',

  // Departamentos
  DEPARTAMENTO_CREATE = 'departamento:create',
  DEPARTAMENTO_READ = 'departamento:read',
  DEPARTAMENTO_UPDATE = 'departamento:update',
  DEPARTAMENTO_DELETE = 'departamento:delete',
  DEPARTAMENTO_AUDIT = 'departamento:audit',

  // Metas
  META_CREATE = 'meta:create',
  META_READ = 'meta:read',
  META_UPDATE = 'meta:update',
  META_DELETE = 'meta:delete',
  META_AUDIT = 'meta:audit',
  META_EXECUCAO_CREATE = 'meta_execucao:create',
  META_EXECUCAO_READ = 'meta_execucao:read',
  META_EXECUCAO_UPDATE = 'meta_execucao:update',
  META_EXECUCAO_DELETE = 'meta_execucao:delete',
  META_EXECUCAO_AUDIT = 'meta_execucao:audit',

  // Vistoria Mobile
  VISTORIA_CREATE = 'vistoria_mobile:create',
  VISTORIA_READ = 'vistoria_mobile:read',
  VISTORIA_UPDATE = 'vistoria_mobile:update',
  // Vistoria Web
  VISTORIA_WEB_READ = 'vistoria_web:read',
  TIPOVISTORIA_CREATE = 'tipovistoria:create',
  TIPOVISTORIA_READ = 'tipovistoria:read',
  TIPOVISTORIA_UPDATE = 'tipovistoria:update',
  TIPOVISTORIA_DELETE = 'tipovistoria:delete',
  TIPOVISTORIA_AUDIT = 'tipovistoria:audit',
  ITEMVISTORIADO_CREATE = 'itemvistoriado:create',
  ITEMVISTORIADO_READ = 'itemvistoriado:read',
  ITEMVISTORIADO_UPDATE = 'itemvistoriado:update',
  ITEMVISTORIADO_DELETE = 'itemvistoriado:delete',
  ITEMVISTORIADO_AUDIT = 'itemvistoriado:audit',
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
    { key: Permission.REPORTS_VIEW, label: 'Acessar menu Relatórios' },
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
  Ocorrências: [
    { key: Permission.OCORRENCIA_CREATE, label: 'Criar ocorrências' },
    { key: Permission.OCORRENCIA_READ, label: 'Visualizar ocorrências' },
    { key: Permission.OCORRENCIA_UPDATE, label: 'Editar ocorrências' },
    { key: Permission.OCORRENCIA_DELETE, label: 'Excluir ocorrências' },
    { key: Permission.OCORRENCIA_AUDIT, label: 'Auditar ocorrências' },
  ],
  Trechos: [
    { key: Permission.TRECHO_CREATE, label: 'Criar trechos' },
    { key: Permission.TRECHO_READ, label: 'Visualizar trechos' },
    { key: Permission.TRECHO_UPDATE, label: 'Editar trechos' },
    { key: Permission.TRECHO_DELETE, label: 'Excluir trechos' },
  ],
  Departamentos: [
    { key: Permission.DEPARTAMENTO_CREATE, label: 'Criar departamentos' },
    { key: Permission.DEPARTAMENTO_READ, label: 'Visualizar departamentos' },
    { key: Permission.DEPARTAMENTO_UPDATE, label: 'Editar departamentos' },
    { key: Permission.DEPARTAMENTO_DELETE, label: 'Excluir departamentos' },
    { key: Permission.DEPARTAMENTO_AUDIT, label: 'Auditar departamentos' },
  ],
  Metas: [
    { key: Permission.META_CREATE, label: 'Criar metas' },
    { key: Permission.META_READ, label: 'Visualizar metas' },
    { key: Permission.META_UPDATE, label: 'Editar metas' },
    { key: Permission.META_DELETE, label: 'Excluir metas' },
    { key: Permission.META_AUDIT, label: 'Auditar metas' },
    {
      key: Permission.META_EXECUCAO_CREATE,
      label: 'Registrar execuções de metas',
    },
    {
      key: Permission.META_EXECUCAO_READ,
      label: 'Visualizar execuções de metas',
    },
    {
      key: Permission.META_EXECUCAO_UPDATE,
      label: 'Editar execuções de metas',
    },
    {
      key: Permission.META_EXECUCAO_DELETE,
      label: 'Excluir execuções de metas',
    },
    {
      key: Permission.META_EXECUCAO_AUDIT,
      label: 'Auditar execuções de metas',
    },
  ],
  'Tipo de Vistoria': [
    { key: Permission.TIPOVISTORIA_CREATE, label: 'Criar tipos de vistoria' },
    { key: Permission.TIPOVISTORIA_READ, label: 'Visualizar tipos de vistoria' },
    { key: Permission.TIPOVISTORIA_UPDATE, label: 'Editar tipos de vistoria' },
    { key: Permission.TIPOVISTORIA_DELETE, label: 'Excluir tipos de vistoria' },
    { key: Permission.TIPOVISTORIA_AUDIT, label: 'Auditar tipos de vistoria' },
  ],
  'Vistoria Mobile': [
    { key: Permission.VISTORIA_CREATE, label: 'Iniciar vistorias (mobile)' },
    { key: Permission.VISTORIA_READ, label: 'Visualizar vistorias (mobile)' },
    { key: Permission.VISTORIA_UPDATE, label: 'Atualizar vistorias (mobile)' },
  ],
  'Vistoria Web': [
    { key: Permission.VISTORIA_WEB_READ, label: 'Visualizar vistorias (web)' },
  ],
  'Itens Vistoriados': [
    { key: Permission.ITEMVISTORIADO_CREATE, label: 'Criar itens vistoriados' },
    { key: Permission.ITEMVISTORIADO_READ, label: 'Visualizar itens vistoriados' },
    { key: Permission.ITEMVISTORIADO_UPDATE, label: 'Editar itens vistoriados' },
    { key: Permission.ITEMVISTORIADO_DELETE, label: 'Excluir itens vistoriados' },
    { key: Permission.ITEMVISTORIADO_AUDIT, label: 'Auditar itens vistoriados' },
  ],
};

export const ALL_PERMISSIONS = Object.values(Permission);
