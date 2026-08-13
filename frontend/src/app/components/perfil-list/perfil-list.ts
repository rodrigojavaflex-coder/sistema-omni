import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService } from '../../services';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {
  Perfil,
  Permission,
  PermissionCatalog,
  PermissionCatalogModule,
  PerfilUsuarioVinculado,
  Usuario,
} from '../../models/usuario.model';
import { Subject, takeUntil, Observable, concat, last } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { ErrorModalService } from '../../services';
import { environment } from '../../../environments/environment';
import { BaseListComponent } from '../base-list.component';
import { UsuarioAutocompleteComponent } from '../shared/usuario-autocomplete/usuario-autocomplete.component';
import { MenuIconComponent } from '../menu-icon/menu-icon';
import { getPermissionModuleIconKey } from '../../utils/permission-menu-icons';
import {
  PerfilVincularUsuariosModalComponent,
  PerfilVincularUsuariosConfirmPayload,
} from '../perfil-vincular-usuarios-modal/perfil-vincular-usuarios-modal';

export interface PerfilModuleChip {
  moduleKey: string;
  moduleLabel: string;
  selected: number;
  total: number;
}

export type FiltroVinculoPerfil = 'todos' | 'com' | 'sem';

@Component({
  selector: 'app-perfil-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmationModalComponent,
    UsuarioAutocompleteComponent,
    MenuIconComponent,
    PerfilVincularUsuariosModalComponent,
  ],
  templateUrl: './perfil-list.html',
  styleUrls: ['./perfil-list.css'],
})
export class PerfilListComponent
  extends BaseListComponent<Perfil>
  implements OnInit, OnDestroy
{
  private perfilService = inject(PerfilService);
  private userService = inject(UserService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private errorModal: ErrorModalService = inject(ErrorModalService);

  override authService = inject(AuthService);

  permissionCatalog: PermissionCatalog | null = null;
  moduleChipsByPerfil: Record<string, PerfilModuleChip[]> = {};
  uncatalogedByPerfil: Record<string, number> = {};

  allItems: Perfil[] = [];
  filtroNome = '';
  filtroModuloKey = '';
  filtroVinculo: FiltroVinculoPerfil = 'todos';
  filtroUsuarioId: string | null = null;
  filtroUsuarioLabel = '';
  sortNome: 'asc' | 'desc' = 'asc';

  @ViewChild('usuarioAutocomplete')
  usuarioAutocomplete?: UsuarioAutocompleteComponent;

  Permission = Permission;
  deleteModalTitle = 'Confirmação de Exclusão';
  deleteModalUsuarios: string[] = [];

  vincularModalVisible = false;
  vincularPerfil: Perfil | null = null;

  @ViewChild(PerfilVincularUsuariosModalComponent)
  vincularModal?: PerfilVincularUsuariosModalComponent;

  override ngOnInit(): void {
    this.userService
      .getPermissionCatalog()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (catalog) => {
          this.permissionCatalog = catalog;
          super.ngOnInit();
        },
        error: () => {
          this.errorModal.show(
            'Erro ao carregar catálogo de permissões',
            'Erro',
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected override loadItems(): void {
    this.loading = true;
    this.perfilService
      .findAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.allItems = data;
          this.items = data;
          this.buildModuleSummaries();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.errorModal.show('Erro ao carregar perfis', 'Erro');
        },
      });
  }

  protected override deleteItem(id: string): Observable<void> {
    return this.perfilService.delete(id);
  }

  protected override getId(item: Perfil): string {
    return item.id;
  }

  editPerfil(perfil: Perfil): void {
    this.router.navigate(['/perfil/edit', perfil.id]);
  }

  duplicatePerfil(perfil: Perfil): void {
    this.router.navigate(['/perfil/new'], {
      queryParams: { copyFrom: perfil.id },
    });
  }

  openVincularUsuarios(perfil: Perfil): void {
    this.vincularPerfil = perfil;
    this.vincularModalVisible = true;
  }

  closeVincularModal(): void {
    this.vincularModalVisible = false;
    this.vincularPerfil = null;
  }

  get vincularAlreadyLinkedIds(): string[] {
    return (this.vincularPerfil?.usuariosVinculados ?? []).map((u) => u.id);
  }

  get canOpenVincularModal(): boolean {
    return (
      this.authService.hasPermission(Permission.PROFILE_ASSIGN_USERS) ||
      this.authService.hasPermission(Permission.PROFILE_UNASSIGN_USERS)
    );
  }

  get canAssignUsersInModal(): boolean {
    return this.authService.hasPermission(Permission.PROFILE_ASSIGN_USERS);
  }

  get canUnassignUsersInModal(): boolean {
    return this.authService.hasPermission(Permission.PROFILE_UNASSIGN_USERS);
  }

  onVincularUsuariosConfirm(payload: PerfilVincularUsuariosConfirmPayload): void {
    if (!this.vincularPerfil) {
      return;
    }
    const chain = this.buildVincularUsuariosRequestChain(
      this.vincularPerfil.id,
      payload,
    );
    if (!chain) {
      return;
    }
    this.vincularModal?.setSaving(true);
    this.vincularModal?.setError(null);
    chain.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.vincularModal?.setSaving(false);
        this.closeVincularModal();
        this.loadItems();
      },
      error: (err: HttpErrorResponse) => {
        this.vincularModal?.setSaving(false);
        const msg = this.resolveVincularHttpErrorMessage(err);
        this.vincularModal?.setError(msg);
      },
    });
  }

  /**
   * Desvincular antes de vincular evita estado parcial quando a remoção falha (ex.: último perfil).
   */
  private buildVincularUsuariosRequestChain(
    perfilId: string,
    payload: PerfilVincularUsuariosConfirmPayload,
  ): Observable<Perfil> | null {
    const steps: Observable<Perfil>[] = [];
    if (payload.remover.length > 0) {
      steps.push(
        this.perfilService.desvincularUsuarios(perfilId, payload.remover),
      );
    }
    if (payload.adicionar.length > 0) {
      steps.push(
        this.perfilService.vincularUsuarios(perfilId, payload.adicionar),
      );
    }
    if (steps.length === 0) {
      return null;
    }
    return concat(...steps).pipe(last());
  }

  private resolveVincularHttpErrorMessage(err: HttpErrorResponse): string {
    const fallback = 'Erro ao atualizar vínculos de usuários com o perfil';
    const body = err.error as { message?: string | string[] } | null;
    if (!body?.message) {
      return fallback;
    }
    if (typeof body.message === 'string') {
      return body.message;
    }
    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }
    return fallback;
  }

  deletePerfil(perfil: Perfil): void {
    const totalUsuarios = this.getUsuarioCount(perfil);
    if (totalUsuarios === 0) {
      this.executarExclusao(perfil);
      return;
    }

    this.deleteModalUsuarios = this.getUsuariosVinculados(perfil).map((u) =>
      this.formatUsuarioVinculadoLabel(u),
    );
    const rotuloUsuarios =
      totalUsuarios === 1
        ? '1 usuário vinculado'
        : `${totalUsuarios} usuários vinculados`;
    this.confirmDelete(
      perfil,
      `O perfil "${perfil.nomePerfil}" possui ${rotuloUsuarios}. Ao excluir, eles perderão as permissões deste perfil. Deseja continuar?`,
    );
  }

  override onDeleteConfirmed(): void {
    super.onDeleteConfirmed();
    this.deleteModalUsuarios = [];
  }

  override onDeleteCancelled(): void {
    super.onDeleteCancelled();
    this.deleteModalUsuarios = [];
  }

  private executarExclusao(perfil: Perfil): void {
    this.deleteItem(this.getId(perfil))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadItems(),
        error: (err: HttpErrorResponse) => {
          const serverMsg = err.error?.message || 'Erro ao excluir';
          this.errorModal.show(serverMsg);
        },
      });
  }

  get displayedItems(): Perfil[] {
    let list = [...this.allItems];

    const nome = this.filtroNome.trim().toLowerCase();
    if (nome) {
      list = list.filter((p) => p.nomePerfil.toLowerCase().includes(nome));
    }

    if (this.filtroModuloKey) {
      list = list.filter((p) => {
        const chip = this.moduleChipsByPerfil[p.id]?.find(
          (c) => c.moduleKey === this.filtroModuloKey,
        );
        return !!chip && chip.selected > 0;
      });
    }

    if (this.filtroVinculo === 'com') {
      list = list.filter((p) => this.getUsuarioCount(p) > 0);
    } else if (this.filtroVinculo === 'sem') {
      list = list.filter((p) => this.getUsuarioCount(p) === 0);
    }

    if (this.filtroUsuarioId) {
      list = list.filter((p) =>
        this.getUsuariosVinculados(p).some(
          (u) => u.id === this.filtroUsuarioId,
        ),
      );
    }

    list.sort((a, b) => {
      const cmp = a.nomePerfil.localeCompare(b.nomePerfil, 'pt-BR', {
        sensitivity: 'base',
      });
      return this.sortNome === 'asc' ? cmp : -cmp;
    });

    return list;
  }

  get hasActiveFilters(): boolean {
    return (
      !!this.filtroNome.trim() ||
      !!this.filtroModuloKey ||
      this.filtroVinculo !== 'todos' ||
      !!this.filtroUsuarioId
    );
  }

  toggleSortNome(): void {
    this.sortNome = this.sortNome === 'asc' ? 'desc' : 'asc';
  }

  limparFiltros(): void {
    this.filtroNome = '';
    this.filtroModuloKey = '';
    this.filtroVinculo = 'todos';
    this.limparFiltroUsuario();
  }

  onUsuarioFiltroSelected(usuario: Usuario | null): void {
    if (usuario) {
      this.filtroUsuarioId = usuario.id;
      this.filtroUsuarioLabel = this.formatUsuarioFiltroLabel(usuario);
      return;
    }
    this.filtroUsuarioId = null;
    this.filtroUsuarioLabel = '';
  }

  limparFiltroUsuario(): void {
    this.filtroUsuarioId = null;
    this.filtroUsuarioLabel = '';
    this.usuarioAutocomplete?.clearSelection();
  }

  getVinculoFiltroLabel(): string {
    if (this.filtroVinculo === 'com') {
      return 'Com usuários vinculados';
    }
    if (this.filtroVinculo === 'sem') {
      return 'Sem usuários vinculados';
    }
    return 'Todos';
  }

  formatUsuarioFiltroLabel(usuario: Usuario): string {
    const empresa = usuario.empresa?.descricao;
    return empresa ? `${usuario.nome} (${empresa})` : usuario.nome;
  }

  getModuloLabel(key: string): string {
    return (
      this.permissionCatalog?.modules.find((m) => m.key === key)?.label ?? key
    );
  }

  getModuleIconKey(moduleKey: string): string {
    return getPermissionModuleIconKey(moduleKey);
  }

  getUsuarioCount(perfil: Perfil): number {
    return perfil.totalUsuarios ?? perfil.usuariosVinculados?.length ?? 0;
  }

  getUsuariosVinculados(perfil: Perfil): PerfilUsuarioVinculado[] {
    return perfil.usuariosVinculados ?? [];
  }

  formatUsuarioVinculadoLabel(usuario: PerfilUsuarioVinculado): string {
    const empresa = usuario.empresaLabel;
    return empresa ? `${usuario.nome} (${empresa})` : usuario.nome;
  }

  getChips(perfil: Perfil): PerfilModuleChip[] {
    return this.moduleChipsByPerfil[perfil.id] ?? [];
  }

  getModulosComPermissoes(perfil: Perfil): PerfilModuleChip[] {
    return this.getChips(perfil).filter((c) => c.selected > 0);
  }

  getModulosComPermissoesCount(perfil: Perfil): number {
    return this.getModulosComPermissoes(perfil).length;
  }

  getUncatalogedCount(perfil: Perfil): number {
    return this.uncatalogedByPerfil[perfil.id] ?? 0;
  }

  private buildModuleSummaries(): void {
    if (!this.permissionCatalog) {
      return;
    }

    this.moduleChipsByPerfil = {};
    this.uncatalogedByPerfil = {};

    const cataloged = new Set<string>();
    for (const mod of this.permissionCatalog.modules) {
      for (const group of mod.groups) {
        for (const perm of group.permissions) {
          cataloged.add(perm.key);
        }
      }
    }

    for (const perfil of this.allItems) {
      const selected = new Set(perfil.permissoes || []);
      const chips: PerfilModuleChip[] = this.permissionCatalog.modules.map(
        (mod) => ({
          moduleKey: mod.key,
          moduleLabel: mod.label,
          selected: this.countSelectedInModule(mod, selected),
          total: this.countTotalInModule(mod),
        }),
      );
      this.moduleChipsByPerfil[perfil.id] = chips;
      this.uncatalogedByPerfil[perfil.id] = (perfil.permissoes || []).filter(
        (p) => !cataloged.has(p),
      ).length;
    }
  }

  private countSelectedInModule(
    mod: PermissionCatalogModule,
    selected: Set<string>,
  ): number {
    return mod.groups
      .flatMap((g) => g.permissions.map((p) => p.key))
      .filter((k) => selected.has(k)).length;
  }

  private countTotalInModule(mod: PermissionCatalogModule): number {
    return mod.groups.reduce((acc, g) => acc + g.permissions.length, 0);
  }

  printPerfil(perfil: Perfil): void {
    const printWindow = window.open(
      '',
      '_blank',
      'width=800,height=600,scrollbars=yes',
    );
    if (printWindow) {
      printWindow.document.write(
        `<!DOCTYPE html><html><head><title>Perfil - ${perfil.nomePerfil}</title>` +
          `<style>
           body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
           h1 { font-size: 18px; margin-bottom: 8px; }
           .print-date { font-size: 10px; color: #555; margin-bottom: 12px; }
           .group { margin-bottom: 6px; }
           .group strong { display: inline-block; width: 180px; vertical-align: top; }
           .users { margin-top: 12px; padding-top: 8px; border-top: 1px solid #ccc; font-weight: bold; }
        </style>` +
          `</head><body><h1>${perfil.nomePerfil}</h1>` +
          `<div class="print-date">Impresso em: ${new Date().toLocaleString('pt-BR')}</div><div id="content"></div></body></html>`,
      );
      fetch(`${environment.apiUrl}/perfil/${perfil.id}/print`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
        .then((res) => res.json())
        .then(
          (data: {
            groups: { group: string; permissions: string[] }[];
            users: string[];
          }) => {
            const container = printWindow.document.getElementById('content');
            if (container) {
              const permissionsTitle = `<h2>Permissões do perfil</h2>`;
              const groupsHtml = data.groups
                .map(
                  (g) =>
                    `<div class="group"><strong>${g.group}:</strong> ${g.permissions.join(', ')}</div>`,
                )
                .join('');
              const usersTitle =
                data.users && data.users.length
                  ? `<h2>Usuários vinculados</h2>`
                  : '';
              const usersHtml =
                data.users && data.users.length
                  ? `<div class="users">${data.users.join(', ')}</div>`
                  : '';
              container.innerHTML =
                permissionsTitle + groupsHtml + usersTitle + usersHtml;
              setTimeout(() => printWindow.print(), 100);
            }
          },
        );
    }
  }

  private buildPermissionLabelMap(): Map<string, string> {
    const map = new Map<string, string>();
    if (!this.permissionCatalog) {
      return map;
    }
    for (const mod of this.permissionCatalog.modules) {
      for (const group of mod.groups) {
        for (const perm of group.permissions) {
          map.set(perm.key, perm.label);
        }
      }
    }
    return map;
  }

  protected loadAllItemsForExport(): Observable<Perfil[]> {
    return this.perfilService.findAll();
  }

  protected getExportDataExcel(items: Perfil[]): {
    headers: string[];
    data: unknown[][];
  } {
    const mapLabels = this.buildPermissionLabelMap();
    const headers = ['Nome do Perfil', 'Permissões'];
    const data = items.map((item) => {
      const labels = item.permissoes
        .map((p) => mapLabels.get(p) || p)
        .join(', ');
      return [item.nomePerfil, labels];
    });
    return { headers, data };
  }

  protected getExportDataPDF(items: Perfil[]): {
    headers: string[];
    data: unknown[][];
  } {
    return this.getExportDataExcel(items);
  }

  protected getExportFileName(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
    return `Perfis_${dateStr}`;
  }

  protected getTableDisplayName(): string {
    return 'Perfis';
  }
}
