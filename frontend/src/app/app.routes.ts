import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { PasswordRedefinirComponent } from './components/password-redefinir/password-redefinir';
import { UserListComponent } from './components/user-list/user-list';
import { UserFormComponent } from './components/user-form/user-form';
import { AuditoriaComponent } from './components/auditoria/auditoria';
import { authGuard } from './guards/auth.guard';
import { permissionGuard } from './guards/permission.guard';
import { changePasswordGuard } from './guards/change-password.guard';
import { Permission } from './models/usuario.model';
import { RoutePermissions } from './config/route-permissions';
import { ConfiguracaoComponent } from './modules/configuracao/configuracao.component';
import { ConfiguracaoTempoFluxoComponent } from './modules/configuracao-tempo-fluxo/configuracao-tempo-fluxo.component';
import { HomeComponent } from './components/home/home';
import { ChangePasswordComponent } from './components/change-password/change-password';
import { PerfilListComponent } from './components/perfil-list/perfil-list';
import { PerfilFormComponent } from './components/perfil-form/perfil-form';
import { BiAcessoLinkListComponent } from './components/bi-acesso-link-list/bi-acesso-link-list';
import { BiAcessoViewerComponent } from './components/bi-acesso-viewer/bi-acesso-viewer';

export const routes: Routes = [
  {
    path: 'configuracao',
    component: ConfiguracaoComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.CONFIGURACAO_ACCESS] },
  },
  {
    path: 'configuracao/tempo-fluxo',
    component: ConfiguracaoTempoFluxoComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.CONFIGURACAO_TEMPO_FLUXO_ACCESS] },
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'redefinir-senha',
    component: PasswordRedefinirComponent,
  },
  {
    path: 'documentos/publico/:token',
    loadComponent: () =>
      import('./components/documento-publico/documento-publico').then(
        (m) => m.DocumentoPublicoComponent,
      ),
  },

  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.users.list] },
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.users.create] },
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.users.update] },
  },
  {
    path: 'users/:id/change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard, changePasswordGuard],
  },
  {
    path: 'auditoria',
    component: AuditoriaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.auditoria.list] },
  },
  {
    path: 'bi-acesso-links',
    component: BiAcessoLinkListComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.biAcessoLinks.list] },
  },
  {
    path: 'bi-acesso/view/:id',
    component: BiAcessoViewerComponent,
    canActivate: [authGuard, permissionGuard],
    data: { dynamicPermissionParam: 'id' },
  },
  {
    path: 'veiculo',
    loadComponent: () =>
      import('./components/veiculo-list/veiculo-list').then(
        (m) => m.VeiculoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.veiculo.list] },
  },
  {
    path: 'veiculo/new',
    loadComponent: () =>
      import('./components/veiculo-form/veiculo-form').then(
        (m) => m.VeiculoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.veiculo.create] },
  },
  {
    path: 'veiculo/edit/:id',
    loadComponent: () =>
      import('./components/veiculo-form/veiculo-form').then(
        (m) => m.VeiculoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.veiculo.update] },
  },
  {
    path: 'modelos-veiculo',
    loadComponent: () =>
      import('./components/modelo-veiculo-list/modelo-veiculo-list').then(
        (m) => m.ModeloVeiculoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.modeloVeiculo.list] },
  },
  {
    path: 'modelos-veiculo/new',
    loadComponent: () =>
      import('./components/modelo-veiculo-form/modelo-veiculo-form').then(
        (m) => m.ModeloVeiculoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.modeloVeiculo.create] },
  },
  {
    path: 'modelos-veiculo/edit/:id',
    loadComponent: () =>
      import('./components/modelo-veiculo-form/modelo-veiculo-form').then(
        (m) => m.ModeloVeiculoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.modeloVeiculo.update] },
  },
  {
    path: 'motorista',
    loadComponent: () =>
      import('./components/motorista-list/motorista-list').then(
        (m) => m.MotoristaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.motorista.list] },
  },
  {
    path: 'motorista/new',
    loadComponent: () =>
      import('./components/motorista-form/motorista-form').then(
        (m) => m.MotoristaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.motorista.create] },
  },
  {
    path: 'motorista/edit/:id',
    loadComponent: () =>
      import('./components/motorista-form/motorista-form').then(
        (m) => m.MotoristaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.motorista.update] },
  },
  {
    path: 'ocorrencia',
    loadComponent: () =>
      import('./components/ocorrencia-list/ocorrencia-list').then(
        (m) => m.OcorrenciaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.ocorrencia.list] },
  },
  {
    path: 'ocorrencia/new',
    loadComponent: () =>
      import('./components/ocorrencia-form/ocorrencia-form').then(
        (m) => m.OcorrenciaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.ocorrencia.create] },
  },
  {
    path: 'ocorrencia/edit/:id',
    loadComponent: () =>
      import('./components/ocorrencia-form/ocorrencia-form').then(
        (m) => m.OcorrenciaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.ocorrencia.update] },
  },
  {
    path: 'origem-ocorrencia',
    loadComponent: () =>
      import('./components/origem-ocorrencia-list/origem-ocorrencia-list').then(
        (m) => m.OrigemOcorrenciaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.origemOcorrencia.list] },
  },
  {
    path: 'origem-ocorrencia/new',
    loadComponent: () =>
      import('./components/origem-ocorrencia-form/origem-ocorrencia-form').then(
        (m) => m.OrigemOcorrenciaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.origemOcorrencia.create] },
  },
  {
    path: 'origem-ocorrencia/edit/:id',
    loadComponent: () =>
      import('./components/origem-ocorrencia-form/origem-ocorrencia-form').then(
        (m) => m.OrigemOcorrenciaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.origemOcorrencia.update] },
  },
  {
    path: 'categoria-ocorrencia',
    loadComponent: () =>
      import('./components/categoria-ocorrencia-list/categoria-ocorrencia-list').then(
        (m) => m.CategoriaOcorrenciaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.categoriaOcorrencia.list] },
  },
  {
    path: 'categoria-ocorrencia/new',
    loadComponent: () =>
      import('./components/categoria-ocorrencia-form/categoria-ocorrencia-form').then(
        (m) => m.CategoriaOcorrenciaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.categoriaOcorrencia.create] },
  },
  {
    path: 'categoria-ocorrencia/edit/:id',
    loadComponent: () =>
      import('./components/categoria-ocorrencia-form/categoria-ocorrencia-form').then(
        (m) => m.CategoriaOcorrenciaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.categoriaOcorrencia.update] },
  },
  {
    path: 'empresa-terceira',
    loadComponent: () =>
      import('./components/empresa-terceira-list/empresa-terceira-list').then(
        (m) => m.EmpresaTerceiraListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.empresaTerceira.list] },
  },
  {
    path: 'empresa-terceira/new',
    loadComponent: () =>
      import('./components/empresa-terceira-form/empresa-terceira-form').then(
        (m) => m.EmpresaTerceiraFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.empresaTerceira.create] },
  },
  {
    path: 'empresa-terceira/edit/:id',
    loadComponent: () =>
      import('./components/empresa-terceira-form/empresa-terceira-form').then(
        (m) => m.EmpresaTerceiraFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.empresaTerceira.update] },
  },
  {
    path: 'trechos',
    loadComponent: () =>
      import('./components/trecho-form/trecho-form').then(
        (m) => m.TrechoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.trecho.list] },
  },
  {
    path: 'trechos/new',
    loadComponent: () =>
      import('./components/trecho-form/trecho-form').then(
        (m) => m.TrechoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.trecho.create] },
  },
  {
    path: 'trechos/edit/:id',
    loadComponent: () =>
      import('./components/trecho-form/trecho-form').then(
        (m) => m.TrechoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.trecho.update] },
  },
  {
    path: 'areas-vistoriadas',
    loadComponent: () =>
      import('./components/area-vistoriada-list/area-vistoriada-list').then(
        (m) => m.AreaVistoriadaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.areaVistoriada.list] },
  },
  {
    path: 'componentes',
    loadComponent: () =>
      import('./components/componente-list/componente-list').then(
        (m) => m.ComponenteListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.componente.list] },
  },
  {
    path: 'componentes/new',
    loadComponent: () =>
      import('./components/componente-form/componente-form').then(
        (m) => m.ComponenteFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.componente.create] },
  },
  {
    path: 'componentes/edit/:id',
    loadComponent: () =>
      import('./components/componente-form/componente-form').then(
        (m) => m.ComponenteFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.componente.update] },
  },
  {
    path: 'sintomas',
    loadComponent: () =>
      import('./components/sintoma-list/sintoma-list').then(
        (m) => m.SintomaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.sintoma.list] },
  },
  {
    path: 'sintomas/new',
    loadComponent: () =>
      import('./components/sintoma-form/sintoma-form').then(
        (m) => m.SintomaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.sintoma.create] },
  },
  {
    path: 'sintomas/edit/:id',
    loadComponent: () =>
      import('./components/sintoma-form/sintoma-form').then(
        (m) => m.SintomaFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.sintoma.update] },
  },
  {
    path: 'matriz-criticidade',
    loadComponent: () =>
      import('./components/matriz-criticidade-list/matriz-criticidade-list').then(
        (m) => m.MatrizCriticidadeListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.matrizCriticidade.list] },
  },
  {
    path: 'matriz-criticidade/new',
    loadComponent: () =>
      import('./components/matriz-criticidade-form/matriz-criticidade-form').then(
        (m) => m.MatrizCriticidadeFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.matrizCriticidade.create] },
  },
  {
    path: 'matriz-criticidade/edit/:id',
    loadComponent: () =>
      import('./components/matriz-criticidade-form/matriz-criticidade-form').then(
        (m) => m.MatrizCriticidadeFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.matrizCriticidade.update] },
  },
  {
    path: 'vistorias',
    loadComponent: () =>
      import('./components/vistoria-list/vistoria-list').then(
        (m) => m.VistoriaListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.VISTORIA_WEB_READ] },
  },
  {
    path: 'irregularidades/tratamento',
    loadComponent: () =>
      import('./components/irregularidade-fluxo-list/irregularidade-fluxo-list').then(
        (m) => m.IrregularidadeFluxoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.IRREGULARIDADE_TRATAMENTO_READ],
      modo: 'tratamento',
    },
  },
  {
    path: 'irregularidades/manutencao',
    loadComponent: () =>
      import('./components/irregularidade-fluxo-list/irregularidade-fluxo-list').then(
        (m) => m.IrregularidadeFluxoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.IRREGULARIDADE_MANUTENCAO_READ],
      modo: 'manutencao',
    },
  },
  {
    path: 'irregularidades/validacao-final',
    loadComponent: () =>
      import('./components/irregularidade-fluxo-list/irregularidade-fluxo-list').then(
        (m) => m.IrregularidadeFluxoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: {
      permissions: [Permission.IRREGULARIDADE_VALIDACAO_FINAL_READ],
      modo: 'validacao-final',
    },
  },
  {
    path: 'perfil/new',
    component: PerfilFormComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.PROFILE_CREATE] },
  },
  {
    path: 'perfil/edit/:id',
    component: PerfilFormComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.PROFILE_UPDATE] },
  },
  {
    path: 'perfil',
    component: PerfilListComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.PROFILE_READ] },
    pathMatch: 'full',
  },
  {
    path: 'departamento',
    loadComponent: () =>
      import('./components/departamento-list/departamento-list').then(
        (m) => m.DepartamentoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.departamento.list] },
  },
  {
    path: 'departamento/new',
    loadComponent: () =>
      import('./components/departamento-form/departamento-form').then(
        (m) => m.DepartamentoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.departamento.create] },
  },
  {
    path: 'departamento/edit/:id',
    loadComponent: () =>
      import('./components/departamento-form/departamento-form').then(
        (m) => m.DepartamentoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.departamento.update] },
  },
  {
    path: 'tipo-documento',
    loadComponent: () =>
      import('./components/tipo-documento-list/tipo-documento-list').then(
        (m) => m.TipoDocumentoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.tipoDocumento.list] },
  },
  {
    path: 'tipo-documento/new',
    loadComponent: () =>
      import('./components/tipo-documento-form/tipo-documento-form').then(
        (m) => m.TipoDocumentoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.tipoDocumento.create] },
  },
  {
    path: 'tipo-documento/edit/:id',
    loadComponent: () =>
      import('./components/tipo-documento-form/tipo-documento-form').then(
        (m) => m.TipoDocumentoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.tipoDocumento.update] },
  },
  {
    path: 'documento',
    loadComponent: () =>
      import('./components/documento-list/documento-list').then(
        (m) => m.DocumentoListComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.documento.list] },
  },
  {
    path: 'documento/new',
    loadComponent: () =>
      import('./components/documento-form/documento-form').then(
        (m) => m.DocumentoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.documento.create] },
  },
  {
    path: 'documento/edit/:id',
    loadComponent: () =>
      import('./components/documento-form/documento-form').then(
        (m) => m.DocumentoFormComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.documento.update] },
  },
  {
    path: 'meta',
    loadComponent: () =>
      import('./components/meta-list/meta-list').then((m) => m.MetaListComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.meta.list] },
  },
  {
    path: 'meta/dashboard',
    loadComponent: () =>
      import('./components/meta-dashboard/meta-dashboard').then(
        (m) => m.MetaDashboardComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.META_EXECUCAO_READ] },
  },
  {
    path: 'meta/new',
    loadComponent: () =>
      import('./components/meta-form/meta-form').then((m) => m.MetaFormComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.meta.create] },
  },
  {
    path: 'meta/edit/:id',
    loadComponent: () =>
      import('./components/meta-form/meta-form').then((m) => m.MetaFormComponent),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [...RoutePermissions.meta.update] },
  },
  {
    path: 'ocorrencia/painel',
    loadComponent: () =>
      import('./components/painel-ocorrencias/painel-ocorrencias').then(
        (m) => m.PainelOcorrenciasComponent,
      ),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: [Permission.OCORRENCIA_PAINEL_VIEW] },
  },

  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
