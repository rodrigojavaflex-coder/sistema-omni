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
import { VeiculoListComponent } from './components/veiculo-list/veiculo-list';
import { VeiculoFormComponent } from './components/veiculo-form/veiculo-form';
import { MotoristaListComponent } from './components/motorista-list/motorista-list';
import { MotoristaFormComponent } from './components/motorista-form/motorista-form';

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
    component: VeiculoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'veiculo/new',
    component: VeiculoFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'veiculo/edit/:id',
    component: VeiculoFormComponent,
    canActivate: [authGuard]
  },
  // Rotas de motorista
  {
    path: 'motorista',
    component: MotoristaListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'motorista/new',
    component: MotoristaFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'motorista/edit/:id',
    component: MotoristaFormComponent,
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
