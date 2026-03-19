import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'configuracoes',
    loadComponent: () =>
      import('./pages/configuracoes/configuracoes.page').then(m => m.ConfiguracoesPage),
    canActivate: [authGuard],
  },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./pages/sobre/sobre.page').then(m => m.SobrePage),
    canActivate: [authGuard],
  },
  {
    path: 'vistoria/inicio',
    loadComponent: () =>
      import('./pages/vistoria/vistoria-inicio.page').then(m => m.VistoriaInicioPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['vistoria_mobile:create'] },
  },
  {
    path: 'vistoria/areas',
    loadComponent: () =>
      import('./pages/vistoria/vistoria-areas.page').then(m => m.VistoriaAreasPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['vistoria_mobile:create'] },
  },
  {
    path: 'vistoria/areas/:areaId',
    loadComponent: () =>
      import('./pages/vistoria/vistoria-componentes.page').then(m => m.VistoriaComponentesPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['vistoria_mobile:create'] },
  },
  {
    path: 'vistoria/areas/:areaId/componentes/:componenteId',
    loadComponent: () =>
      import('./pages/vistoria/vistoria-irregularidade.page').then(m => m.VistoriaIrregularidadePage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['vistoria_mobile:create'] },
  },
  {
    path: 'vistoria/finalizar',
    loadComponent: () =>
      import('./pages/vistoria/vistoria-finalizar.page').then(m => m.VistoriaFinalizarPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['vistoria_mobile:create'] },
  },
  {
    path: 'vistoria/historico-veiculo',
    loadComponent: () =>
      import('./pages/vistoria/vistoria-historico-veiculo.page').then(
        m => m.VistoriaHistoricoVeiculoPage,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['vistoria_web_historico_veiculo:read'] },
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
