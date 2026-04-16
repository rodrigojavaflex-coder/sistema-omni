import { Permission } from './usuario.model';

export interface MenuItem {
  label: string;
  title?: string; // tooltip (ex.: nome completo quando o label é abreviado)
  route?: string;
  externalUrl?: string;
  icon: string;
  requiredPermissions: string[];
  isSubmenu?: boolean;
  submenuItems?: MenuItem[];
  parentMenu?: string;
  order?: number;
}

export interface MenuConfig {
  title: string;
  items: MenuItem[];
}

export const MENU_CONFIGURATION: MenuConfig = {
  title: 'Gestão e Controle',
  items: [
    {
      label: 'Administração',
      icon: 'feather-settings',
      requiredPermissions: [],
      isSubmenu: true,
      order: 1,
      submenuItems: [
       {
          label: 'Auditoria',
          route: '/auditoria',
          icon: 'feather-search',
          requiredPermissions: [Permission.AUDIT_VIEW],
          parentMenu: 'Administração'
        },
        {
          label: 'Configuração do Sistema',
          route: '/configuracao',
          icon: 'feather-settings',
          requiredPermissions: [Permission.CONFIGURACAO_ACCESS],
          parentMenu: 'Administração'
        },
        {
          label: 'Configuração Tempo Fluxo',
          route: '/configuracao/tempo-fluxo',
          icon: 'feather-activity',
          requiredPermissions: [Permission.CONFIGURACAO_TEMPO_FLUXO_ACCESS],
          parentMenu: 'Administração'
        },
        {
          label: 'BI - Cadastro',
          route: '/bi-acesso-links',
          icon: 'feather-pie-chart',
          requiredPermissions: [
            Permission.BI_ACESSO_LINK_READ,
            Permission.BI_ACESSO_LINK_CREATE,
            Permission.BI_ACESSO_LINK_UPDATE,
            Permission.BI_ACESSO_LINK_DELETE,
          ],
          parentMenu: 'Administração'
        },
        {
          label: 'Usuários',
          route: '/users',
          icon: 'feather-users',
          requiredPermissions: [
            Permission.USER_CREATE, 
            Permission.USER_READ, 
            Permission.USER_UPDATE, 
            Permission.USER_DELETE
          ],
          parentMenu: 'Administração'
        },
        {
          label: 'Perfil',
          route: '/perfil',
          icon: 'feather-shield',
          requiredPermissions: [
            Permission.PROFILE_CREATE,
            Permission.PROFILE_READ,
            Permission.PROFILE_UPDATE,
            Permission.PROFILE_DELETE
          ],
          parentMenu: 'Administração'
        },
        {
          label: 'Departamentos',
          route: '/departamento',
          icon: 'feather-briefcase',
          requiredPermissions: [
            Permission.DEPARTAMENTO_CREATE,
            Permission.DEPARTAMENTO_READ,
            Permission.DEPARTAMENTO_UPDATE,
            Permission.DEPARTAMENTO_DELETE
          ],
          parentMenu: 'Administração'
        }       
      ]
    },
    {
      label: 'Cadastros',
      icon: 'feather-database',
      requiredPermissions: [],
      isSubmenu: true,
      order: 2,
      submenuItems: [
        {
          label: 'Gerais',
          icon: 'feather-grid',
          requiredPermissions: [],
          isSubmenu: true,
          parentMenu: 'Cadastros',
          submenuItems: [
            {
              label: 'Motoristas',
              route: '/motorista',
              icon: 'feather-user',
              requiredPermissions: [
                Permission.MOTORISTA_CREATE,
                Permission.MOTORISTA_READ,
                Permission.MOTORISTA_UPDATE,
                Permission.MOTORISTA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Veículos',
              route: '/veiculo',
              icon: 'feather-truck',
              requiredPermissions: [
                Permission.VEICULO_CREATE,
                Permission.VEICULO_READ,
                Permission.VEICULO_UPDATE,
                Permission.VEICULO_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Modelos de Veículo',
              route: '/modelos-veiculo',
              icon: 'feather-layers',
              requiredPermissions: [
                Permission.MODELOVEICULO_CREATE,
                Permission.MODELOVEICULO_READ,
                Permission.MODELOVEICULO_UPDATE,
                Permission.MODELOVEICULO_DELETE
              ],
              parentMenu: 'Cadastros'
            },
          ]
        },
        {
          label: 'Ocorrência',
          icon: 'feather-alert-circle',
          requiredPermissions: [],
          isSubmenu: true,
          parentMenu: 'Cadastros',
          submenuItems: [
            {
              label: 'Ocorrências',
              route: '/ocorrencia',
              icon: 'feather-alert-circle',
              requiredPermissions: [
                Permission.OCORRENCIA_CREATE,
                Permission.OCORRENCIA_READ,
                Permission.OCORRENCIA_UPDATE,
                Permission.OCORRENCIA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Trechos',
              route: '/trechos',
              icon: 'feather-layers',
              requiredPermissions: [
                Permission.TRECHO_CREATE,
                Permission.TRECHO_READ,
                Permission.TRECHO_UPDATE,
                Permission.TRECHO_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Origem',
              title: 'Origem da Ocorrência',
              route: '/origem-ocorrencia',
              icon: 'feather-archive',
              requiredPermissions: [
                Permission.ORIGEMOCORRENCIA_CREATE,
                Permission.ORIGEMOCORRENCIA_READ,
                Permission.ORIGEMOCORRENCIA_UPDATE,
                Permission.ORIGEMOCORRENCIA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Categoria',
              title: 'Categoria da Ocorrência',
              route: '/categoria-ocorrencia',
              icon: 'feather-tag',
              requiredPermissions: [
                Permission.CATEGORIAOCORRENCIA_CREATE,
                Permission.CATEGORIAOCORRENCIA_READ,
                Permission.CATEGORIAOCORRENCIA_UPDATE,
                Permission.CATEGORIAOCORRENCIA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Empresas',
              title: 'Empresas Terceiras',
              route: '/empresa-terceira',
              icon: 'feather-briefcase',
              requiredPermissions: [
                Permission.EMPRESATERCIRA_CREATE,
                Permission.EMPRESATERCIRA_READ,
                Permission.EMPRESATERCIRA_UPDATE,
                Permission.EMPRESATERCIRA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
          ]
        },
        {
          label: 'Vistoria',
          icon: 'feather-check',
          requiredPermissions: [],
          isSubmenu: true,
          parentMenu: 'Cadastros',
          submenuItems: [
            {
              label: 'Áreas Vistoriadas',
              route: '/areas-vistoriadas',
              icon: 'feather-grid',
              requiredPermissions: [
                Permission.AREAVISTORIADA_CREATE,
                Permission.AREAVISTORIADA_READ,
                Permission.AREAVISTORIADA_UPDATE,
                Permission.AREAVISTORIADA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Componentes',
              route: '/componentes',
              icon: 'feather-layers',
              requiredPermissions: [
                Permission.COMPONENTE_CREATE,
                Permission.COMPONENTE_READ,
                Permission.COMPONENTE_UPDATE,
                Permission.COMPONENTE_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Sintomas',
              route: '/sintomas',
              icon: 'feather-activity',
              requiredPermissions: [
                Permission.SINTOMA_CREATE,
                Permission.SINTOMA_READ,
                Permission.SINTOMA_UPDATE,
                Permission.SINTOMA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Matriz',
              route: '/matriz-criticidade',
              icon: 'feather-grid',
              requiredPermissions: [
                Permission.MATRIZCRITICIDADE_CREATE,
                Permission.MATRIZCRITICIDADE_READ,
                Permission.MATRIZCRITICIDADE_UPDATE,
                Permission.MATRIZCRITICIDADE_DELETE
              ],
              parentMenu: 'Cadastros'
            },
          ]
        },
        {
          label: 'Metas',
          icon: 'feather-target',
          requiredPermissions: [],
          isSubmenu: true,
          parentMenu: 'Cadastros',
          submenuItems: [
            {
              label: 'Metas',
              route: '/meta',
              icon: 'feather-target',
              requiredPermissions: [
                Permission.META_CREATE,
                Permission.META_READ,
                Permission.META_UPDATE,
                Permission.META_DELETE,
              ],
              parentMenu: 'Cadastros'
            },
          ]
        },
      ]
    },
    {
      label: 'Gestão',
      icon: 'feather-briefcase',
      requiredPermissions: [],
      isSubmenu: true,
      order: 3,
      submenuItems: [
        {
          label: 'Fluxo Vistoria',
          icon: 'feather-check-square',
          requiredPermissions: [],
          isSubmenu: true,
          parentMenu: 'Gestão',
          submenuItems: [
            {
              label: 'Vistorias',
              route: '/vistorias',
              icon: 'feather-check-square',
              requiredPermissions: [Permission.VISTORIA_WEB_READ],
              parentMenu: 'Gestão'
            },
            {
              label: 'Tratamento',
              route: '/irregularidades/tratamento',
              icon: 'feather-activity',
              requiredPermissions: [Permission.IRREGULARIDADE_TRATAMENTO_READ],
              parentMenu: 'Gestão'
            },
            {
              label: 'Manutenção',
              route: '/irregularidades/manutencao',
              icon: 'feather-settings',
              requiredPermissions: [Permission.IRREGULARIDADE_MANUTENCAO_READ],
              parentMenu: 'Gestão'
            },
            {
              label: 'Validação',
              route: '/irregularidades/validacao-final',
              icon: 'feather-check',
              requiredPermissions: [Permission.IRREGULARIDADE_VALIDACAO_FINAL_READ],
              parentMenu: 'Gestão'
            }
          ]
        },
        {
          label: 'BI',
          icon: 'feather-pie-chart',
          requiredPermissions: [],
          isSubmenu: true,
          parentMenu: 'Gestão',
          submenuItems: [],
        },
        {
          label: 'Painel de Metas',
          route: '/meta/dashboard',
          icon: 'feather-activity',
          requiredPermissions: [Permission.META_EXECUCAO_READ],
          parentMenu: 'Gestão'
        },
        {
          label: 'Painel de Ocorrências',
          route: '/ocorrencia/painel',
          icon: 'feather-bar-chart-2',
          requiredPermissions: [Permission.OCORRENCIA_PAINEL_VIEW],
          parentMenu: 'Gestão'
        }
      ]
    },
    {
      label: 'Relatórios',
      route: '/reports',
      icon: 'feather-bar-chart-2',
      requiredPermissions: [Permission.REPORTS_VIEW],
      order: 4
    }
  ]
};
