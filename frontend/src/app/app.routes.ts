import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { UserListComponent } from './components/user-list/user-list';
import { UserFormComponent } from './components/user-form/user-form';
import { AuditoriaComponent } from './components/auditoria/auditoria';
import { authGuard } from './guards/auth.guard';
import { ConfiguracaoComponent } from './modules/configuracao/configuracao.component';
import { HomeComponent } from './components/home/home';
import { ChangePasswordComponent } from './components/change-password/change-password';
import { PerfilListComponent } from './components/perfil-list/perfil-list';
import { PerfilFormComponent } from './components/perfil-form/perfil-form';

export const routes: Routes = [
  // Rota de configuração
  {
    path: 'configuracao',
    component: ConfiguracaoComponent,
    canActivate: [authGuard]
  },
  // Rota de login (sem guard)
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Rotas protegidas
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/:id/change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard]
  },
  {
    path: 'auditoria',
    component: AuditoriaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'veiculo',
    loadComponent: () => import('./components/veiculo-list/veiculo-list').then(m => m.VeiculoListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'veiculo/new',
    loadComponent: () => import('./components/veiculo-form/veiculo-form').then(m => m.VeiculoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'veiculo/edit/:id',
    loadComponent: () => import('./components/veiculo-form/veiculo-form').then(m => m.VeiculoFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de motorista com lazy loading
  {
    path: 'motorista',
    loadComponent: () => import('./components/motorista-list/motorista-list').then(m => m.MotoristaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'motorista/new',
    loadComponent: () => import('./components/motorista-form/motorista-form').then(m => m.MotoristaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'motorista/edit/:id',
    loadComponent: () => import('./components/motorista-form/motorista-form').then(m => m.MotoristaFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de ocorrência com lazy loading
  {
    path: 'ocorrencia',
    loadComponent: () => import('./components/ocorrencia-list/ocorrencia-list').then(m => m.OcorrenciaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ocorrencia/new',
    loadComponent: () => import('./components/ocorrencia-form/ocorrencia-form').then(m => m.OcorrenciaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'ocorrencia/edit/:id',
    loadComponent: () => import('./components/ocorrencia-form/ocorrencia-form').then(m => m.OcorrenciaFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de perfil: paths específicos antes da rota geral para evitar conflitos de prefixo
  {
    path: 'perfil/new',
    component: PerfilFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'perfil/edit/:id',
    component: PerfilFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    component: PerfilListComponent,
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  
  // Home padrão
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  // Rota wildcard
  {
    path: '**',
    redirectTo: ''
  }
];
