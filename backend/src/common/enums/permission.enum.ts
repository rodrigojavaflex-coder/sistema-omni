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

  // Modelos de Veículo
  MODELOVEICULO_CREATE = 'modelo_veiculo:create',
  MODELOVEICULO_READ = 'modelo_veiculo:read',
  MODELOVEICULO_UPDATE = 'modelo_veiculo:update',
  MODELOVEICULO_DELETE = 'modelo_veiculo:delete',

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

  // Áreas Vistoriadas (catálogo)
  AREAVISTORIADA_CREATE = 'areavistoriada:create',
  AREAVISTORIADA_READ = 'areavistoriada:read',
  AREAVISTORIADA_UPDATE = 'areavistoriada:update',
  AREAVISTORIADA_DELETE = 'areavistoriada:delete',
  AREAVISTORIADA_REMOVER_COMPONENTE = 'areavistoriada:remover_componente',
  AREAVISTORIADA_VINCULAR_COMPONENTE = 'areavistoriada:vincular_componente',

  // Componentes (catálogo)
  COMPONENTE_CREATE = 'componente:create',
  COMPONENTE_READ = 'componente:read',
  COMPONENTE_UPDATE = 'componente:update',
  COMPONENTE_DELETE = 'componente:delete',

  // Sintomas (catálogo)
  SINTOMA_CREATE = 'sintoma:create',
  SINTOMA_READ = 'sintoma:read',
  SINTOMA_UPDATE = 'sintoma:update',
  SINTOMA_DELETE = 'sintoma:delete',

  // Matriz de Criticidade (catálogo)
  MATRIZCRITICIDADE_CREATE = 'matrizcriticidade:create',
  MATRIZCRITICIDADE_READ = 'matrizcriticidade:read',
  MATRIZCRITICIDADE_UPDATE = 'matrizcriticidade:update',
  MATRIZCRITICIDADE_DELETE = 'matrizcriticidade:delete',
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
  'Modelos de Veículo': [
    { key: Permission.MODELOVEICULO_CREATE, label: 'Criar modelos de veículo' },
    { key: Permission.MODELOVEICULO_READ, label: 'Visualizar modelos de veículo' },
    { key: Permission.MODELOVEICULO_UPDATE, label: 'Editar modelos de veículo' },
    { key: Permission.MODELOVEICULO_DELETE, label: 'Excluir modelos de veículo' },
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
    {
      key: Permission.OCORRENCIA_UPDATE_STATUS,
      label: 'Registrar andamento da ocorrência',
    },
    { key: Permission.OCORRENCIA_DELETE, label: 'Excluir ocorrências' },
    { key: Permission.OCORRENCIA_AUDIT, label: 'Auditar ocorrências' },
    { key: Permission.OCORRENCIA_PAINEL_VIEW, label: 'Acessar painel de ocorrências' },
  ],
  'Origem da Ocorrência': [
    { key: Permission.ORIGEMOCORRENCIA_CREATE, label: 'Criar origens' },
    { key: Permission.ORIGEMOCORRENCIA_READ, label: 'Visualizar origens' },
    { key: Permission.ORIGEMOCORRENCIA_UPDATE, label: 'Editar origens' },
    { key: Permission.ORIGEMOCORRENCIA_DELETE, label: 'Excluir origens' },
  ],
  'Categoria da Ocorrência': [
    { key: Permission.CATEGORIAOCORRENCIA_CREATE, label: 'Criar categorias' },
    { key: Permission.CATEGORIAOCORRENCIA_READ, label: 'Visualizar categorias' },
    { key: Permission.CATEGORIAOCORRENCIA_UPDATE, label: 'Editar categorias' },
    { key: Permission.CATEGORIAOCORRENCIA_DELETE, label: 'Excluir categorias' },
  ],
  'Empresa Terceira': [
    { key: Permission.EMPRESATERCIRA_CREATE, label: 'Criar empresas' },
    { key: Permission.EMPRESATERCIRA_READ, label: 'Visualizar empresas' },
    { key: Permission.EMPRESATERCIRA_UPDATE, label: 'Editar empresas' },
    { key: Permission.EMPRESATERCIRA_DELETE, label: 'Excluir empresas' },
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
  'Vistoria Mobile': [
    { key: Permission.VISTORIA_CREATE, label: 'Iniciar vistorias (mobile)' },
    { key: Permission.VISTORIA_READ, label: 'Visualizar vistorias (mobile)' },
    { key: Permission.VISTORIA_UPDATE, label: 'Atualizar vistorias (mobile)' },
  ],
  'Vistoria Web': [
    { key: Permission.VISTORIA_WEB_READ, label: 'Visualizar vistorias (web)' },
  ],
  'Áreas Vistoriadas': [
    { key: Permission.AREAVISTORIADA_CREATE, label: 'Criar áreas vistoriadas' },
    { key: Permission.AREAVISTORIADA_READ, label: 'Visualizar áreas vistoriadas' },
    { key: Permission.AREAVISTORIADA_UPDATE, label: 'Editar áreas vistoriadas' },
    { key: Permission.AREAVISTORIADA_DELETE, label: 'Excluir áreas vistoriadas' },
    { key: Permission.AREAVISTORIADA_REMOVER_COMPONENTE, label: 'Remover componente da área' },
    { key: Permission.AREAVISTORIADA_VINCULAR_COMPONENTE, label: 'Vincular componente à área' },
  ],
  Componentes: [
    { key: Permission.COMPONENTE_CREATE, label: 'Criar componentes' },
    { key: Permission.COMPONENTE_READ, label: 'Visualizar componentes' },
    { key: Permission.COMPONENTE_UPDATE, label: 'Editar componentes' },
    { key: Permission.COMPONENTE_DELETE, label: 'Excluir componentes' },
  ],
  Sintomas: [
    { key: Permission.SINTOMA_CREATE, label: 'Criar sintomas' },
    { key: Permission.SINTOMA_READ, label: 'Visualizar sintomas' },
    { key: Permission.SINTOMA_UPDATE, label: 'Editar sintomas' },
    { key: Permission.SINTOMA_DELETE, label: 'Excluir sintomas' },
  ],
  'Matriz de Criticidade': [
    { key: Permission.MATRIZCRITICIDADE_CREATE, label: 'Criar matriz de criticidade' },
    { key: Permission.MATRIZCRITICIDADE_READ, label: 'Visualizar matriz de criticidade' },
    { key: Permission.MATRIZCRITICIDADE_UPDATE, label: 'Editar matriz de criticidade' },
    { key: Permission.MATRIZCRITICIDADE_DELETE, label: 'Excluir matriz de criticidade' },
  ],
};

export const ALL_PERMISSIONS = Object.values(Permission);
