import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { UserListComponent } from './components/user-list/user-list';
import { UserFormComponent } from './components/user-form/user-form';
import { AuditoriaComponent } from './components/auditoria/auditoria';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { Permission } from './models/usuario.model';
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
  // Rotas de origem da ocorrência
  {
    path: 'origem-ocorrencia',
    loadComponent: () => import('./components/origem-ocorrencia-list/origem-ocorrencia-list').then(m => m.OrigemOcorrenciaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'origem-ocorrencia/new',
    loadComponent: () => import('./components/origem-ocorrencia-form/origem-ocorrencia-form').then(m => m.OrigemOcorrenciaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'origem-ocorrencia/edit/:id',
    loadComponent: () => import('./components/origem-ocorrencia-form/origem-ocorrencia-form').then(m => m.OrigemOcorrenciaFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de categoria da ocorrência
  {
    path: 'categoria-ocorrencia',
    loadComponent: () => import('./components/categoria-ocorrencia-list/categoria-ocorrencia-list').then(m => m.CategoriaOcorrenciaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'categoria-ocorrencia/new',
    loadComponent: () => import('./components/categoria-ocorrencia-form/categoria-ocorrencia-form').then(m => m.CategoriaOcorrenciaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'categoria-ocorrencia/edit/:id',
    loadComponent: () => import('./components/categoria-ocorrencia-form/categoria-ocorrencia-form').then(m => m.CategoriaOcorrenciaFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de empresa terceira
  {
    path: 'empresa-terceira',
    loadComponent: () => import('./components/empresa-terceira-list/empresa-terceira-list').then(m => m.EmpresaTerceiraListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'empresa-terceira/new',
    loadComponent: () => import('./components/empresa-terceira-form/empresa-terceira-form').then(m => m.EmpresaTerceiraFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'empresa-terceira/edit/:id',
    loadComponent: () => import('./components/empresa-terceira-form/empresa-terceira-form').then(m => m.EmpresaTerceiraFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de trecho com lazy loading
  {
    path: 'trechos',
    loadComponent: () => import('./components/trecho-form/trecho-form').then(m => m.TrechoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trechos/new',
    loadComponent: () => import('./components/trecho-form/trecho-form').then(m => m.TrechoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'trechos/edit/:id',
    loadComponent: () => import('./components/trecho-form/trecho-form').then(m => m.TrechoFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de tipo de vistoria com lazy loading
  {
    path: 'tipo-vistoria',
    loadComponent: () => import('./components/tipo-vistoria-list/tipo-vistoria-list').then(m => m.TipoVistoriaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tipo-vistoria/new',
    loadComponent: () => import('./components/tipo-vistoria-form/tipo-vistoria-form').then(m => m.TipoVistoriaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'tipo-vistoria/edit/:id',
    loadComponent: () => import('./components/tipo-vistoria-form/tipo-vistoria-form').then(m => m.TipoVistoriaFormComponent),
    canActivate: [authGuard]
  },
  // Rotas de item vistoriado com lazy loading
  {
    path: 'item-vistoriado',
    loadComponent: () => import('./components/item-vistoriado-list/item-vistoriado-list').then(m => m.ItemVistoriadoListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'vistorias',
    loadComponent: () => import('./components/vistoria-list/vistoria-list').then(m => m.VistoriaListComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.VISTORIA_WEB_READ] }
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
  // Rotas de departamento
  {
    path: 'departamento',
    loadComponent: () => import('./components/departamento-list/departamento-list').then(m => m.DepartamentoListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamento/new',
    loadComponent: () => import('./components/departamento-form/departamento-form').then(m => m.DepartamentoFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'departamento/edit/:id',
    loadComponent: () => import('./components/departamento-form/departamento-form').then(m => m.DepartamentoFormComponent),
    canActivate: [authGuard]
  },
  // Metas
  {
    path: 'meta',
    loadComponent: () => import('./components/meta-list/meta-list').then(m => m.MetaListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'meta/dashboard',
    loadComponent: () => import('./components/meta-dashboard/meta-dashboard').then(m => m.MetaDashboardComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.META_EXECUCAO_READ] }
  },
  {
    path: 'meta/new',
    loadComponent: () => import('./components/meta-form/meta-form').then(m => m.MetaFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'meta/edit/:id',
    loadComponent: () => import('./components/meta-form/meta-form').then(m => m.MetaFormComponent),
    canActivate: [authGuard]
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
