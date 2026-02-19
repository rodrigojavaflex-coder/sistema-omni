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
  OCORRENCIA_UPDATE_STATUS = 'ocorrencia:update_status',
  OCORRENCIA_DELETE = 'ocorrencia:delete',
  OCORRENCIA_AUDIT = 'ocorrencia:audit',
  OCORRENCIA_PAINEL_VIEW = 'ocorrencia:painel_view',

  // Origem da Ocorrência
  ORIGEMOCORRENCIA_CREATE = 'origemocorrencia:create',
  ORIGEMOCORRENCIA_READ = 'origemocorrencia:read',
  ORIGEMOCORRENCIA_UPDATE = 'origemocorrencia:update',
  ORIGEMOCORRENCIA_DELETE = 'origemocorrencia:delete',

  // Categoria da Ocorrência
  CATEGORIAOCORRENCIA_CREATE = 'categoriaocorrencia:create',
  CATEGORIAOCORRENCIA_READ = 'categoriaocorrencia:read',
  CATEGORIAOCORRENCIA_UPDATE = 'categoriaocorrencia:update',
  CATEGORIAOCORRENCIA_DELETE = 'categoriaocorrencia:delete',

  // Empresa Terceira
  EMPRESATERCIRA_CREATE = 'empresaterceira:create',
  EMPRESATERCIRA_READ = 'empresaterceira:read',
  EMPRESATERCIRA_UPDATE = 'empresaterceira:update',
  EMPRESATERCIRA_DELETE = 'empresaterceira:delete',

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

export interface PermissionGroup {
  [groupName: string]: {
    key: Permission;
    label: string;
  }[];
}

export interface Perfil {
  id: string;
  nomePerfil: string;
  permissoes: Permission[];
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  perfil: Perfil;
  criadoEm: Date;
  atualizadoEm: Date;
  tema?: string; // Tema preferido do usuário (Claro ou Escuro)
  departamentos?: { id: string; nomeDepartamento: string }[];
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
  ativo?: boolean;
  tema?: string; // Tema preferido (Claro ou Escuro)
  perfilId: string; // ID do perfil do usuário
  departamentoIds?: string[];
}

export interface UpdateUsuarioDto {
  nome?: string;
  email?: string;
  senha?: string;
  ativo?: boolean;
  tema?: string; // Permitir atualizar tema do usuário (Claro ou Escuro)
  perfilId?: string; // Atualizar perfil do usuário
  departamentoIds?: string[];
}

export interface FindUsuariosDto {
  page?: number;
  limit?: number;
  nome?: string;
  email?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
