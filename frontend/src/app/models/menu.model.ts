import { Permission } from './usuario.model';

export interface MenuItem {
  label: string;
  route?: string;
  icon: string;
  requiredPermissions: Permission[];
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
          label: 'Configuração',
          route: '/configuracao',
          icon: 'feather-settings',
          requiredPermissions: [Permission.CONFIGURACAO_ACCESS],
          parentMenu: 'Administração'
        }, {
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
              label: 'Tipo de Vistoria',
              route: '/tipo-vistoria',
              icon: 'feather-check',
              requiredPermissions: [
                Permission.TIPOVISTORIA_CREATE,
                Permission.TIPOVISTORIA_READ,
                Permission.TIPOVISTORIA_UPDATE,
                Permission.TIPOVISTORIA_DELETE
              ],
              parentMenu: 'Cadastros'
            },
            {
              label: 'Itens Vistoriados',
              route: '/item-vistoriado',
              icon: 'feather-check-square',
              requiredPermissions: [
                Permission.ITEMVISTORIADO_CREATE,
                Permission.ITEMVISTORIADO_READ,
                Permission.ITEMVISTORIADO_UPDATE,
                Permission.ITEMVISTORIADO_DELETE
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
          label: 'Vistorias',
          route: '/vistorias',
          icon: 'feather-check-square',
          requiredPermissions: [Permission.VISTORIA_WEB_READ],
          parentMenu: 'Gestão'
        },
        {
          label: 'Painel de Metas',
          route: '/meta/dashboard',
          icon: 'feather-activity',
          requiredPermissions: [Permission.META_EXECUCAO_READ],
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
