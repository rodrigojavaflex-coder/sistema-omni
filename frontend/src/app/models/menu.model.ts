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
  title: 'Sistema de Gestão de Transporte',
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
          requiredPermissions: [Permission.AUDIT_VIEW, Permission.AUDIT_MANAGE],
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
        }
      ]
    },
    {
      label: 'Relatórios',
      route: '/reports',
      icon: 'feather-bar-chart-2',
      requiredPermissions: [Permission.REPORTS_VIEW, Permission.REPORTS_EXPORT],
      order: 3
    }
  ]
};