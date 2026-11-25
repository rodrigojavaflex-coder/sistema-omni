import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseListComponent } from '../base-list.component';
import { Indicador } from '../../models/indicador.model';
import { IndicadorService } from '../../services/indicador.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-indicador-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ConfirmationModalComponent,
    HistoricoAuditoriaComponent,
  ],
  templateUrl: './indicador-list.html',
  styleUrls: ['./indicador-list.css'],
})
export class IndicadorListComponent extends BaseListComponent<Indicador> {
  private indicadorService = inject(IndicadorService);
  private router = inject(Router);
  protected override authService = inject(AuthService);
  private fb = inject(FormBuilder);

  canAudit = false;
  canCreate = false;
  canUpdate = false;
  canDelete = false;
  showAuditModal = false;
  selectedForAudit: Indicador | null = null;
  departamentos: { id: string; nomeDepartamento: string }[] = [];
  showFilters = false;
  filterForm = this.fb.group({
    search: [''],
    departamentoId: [''],
    tipoIndicador: [''],
    ativo: [''],
  });
  private allItems: Indicador[] = [];

  protected override loadItems(): void {
    this.loading = true;
    this.indicadorService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorModalService.show('Erro ao carregar indicadores', 'Erro');
      },
    });
  }

  protected override deleteItem(id: string): Observable<unknown> {
    return this.indicadorService.delete(id);
  }

  protected override getId(item: Indicador): string {
    return item.id;
  }

  protected override loadAllItemsForExport(): Observable<Indicador[]> {
    return of(this.getFilteredItems(this.allItems));
  }

  protected override getExportDataExcel(items: Indicador[]) {
    const headers = [
      'Código',
      'Nome',
      'Departamento',
      'Unidade',
      'Tipo',
      'Ativo',
      'Ordem',
      'Registrado em',
    ];
    const data = items.map((i) => [
      i.codigoIndicador,
      i.nomeIndicador,
      i.departamento?.nomeDepartamento || '-',
      i.unidadeMedida,
      i.tipoIndicador,
      i.ativo ? 'Sim' : 'Não',
      i.ordemExibicao ?? '-',
      i.criadoEm,
    ]);
    return { headers, data };
  }

  protected override getExportDataPDF(items: Indicador[]) {
    return this.getExportDataExcel(items);
  }

  protected override getExportFileName(): string {
    return 'indicadores';
  }

  protected override getTableDisplayName(): string {
    return 'Indicadores';
  }

  create(): void {
    if (!this.canCreate) return;
    this.router.navigate(['/indicador/new']);
  }

  edit(item: Indicador): void {
    if (!this.canUpdate) return;
    this.router.navigate(['/indicador/edit', item.id]);
  }

  delete(item: Indicador): void {
    if (!this.canDelete) return;
    this.confirmDelete(
      item,
      `Deseja excluir o indicador "${item.nomeIndicador}" (código ${item.codigoIndicador})?`,
    );
  }

  async desativar(item: Indicador): Promise<void> {
    if (!this.canUpdate || !item.ativo) return;
    try {
      await firstValueFrom(
        this.indicadorService.update(item.id, {
          nomeIndicador: item.nomeIndicador,
          departamentoId: item.departamentoId,
          unidadeMedida: item.unidadeMedida,
          tipoIndicador: item.tipoIndicador,
          detalheIndicador: item.detalheIndicador,
          ativo: false,
          ordemExibicao: item.ordemExibicao ?? null,
        }),
      );
      this.loadItems();
    } catch {
      this.errorModalService.show('Erro ao desativar indicador', 'Erro');
    }
  }

  async ativar(item: Indicador): Promise<void> {
    if (!this.canUpdate || item.ativo) return;
    try {
      await firstValueFrom(
        this.indicadorService.update(item.id, {
          nomeIndicador: item.nomeIndicador,
          departamentoId: item.departamentoId,
          unidadeMedida: item.unidadeMedida,
          tipoIndicador: item.tipoIndicador,
          detalheIndicador: item.detalheIndicador,
          ativo: true,
          ordemExibicao: item.ordemExibicao ?? null,
        }),
      );
      this.loadItems();
    } catch {
      this.errorModalService.show('Erro ao ativar indicador', 'Erro');
    }
  }

  override ngOnInit(): void {
    this.canAudit = this.authService.hasPermission(Permission.INDICADOR_AUDIT);
    this.canCreate = this.authService.hasPermission(Permission.INDICADOR_CREATE);
    this.canUpdate = this.authService.hasPermission(Permission.INDICADOR_UPDATE);
    this.canDelete = this.authService.hasPermission(Permission.INDICADOR_DELETE);
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadDepartamentos();
    super.ngOnInit();
  }

  openAudit(indicador: Indicador): void {
    if (!this.canAudit) return;
    this.selectedForAudit = indicador;
    this.showAuditModal = true;
  }

  closeAudit(): void {
    this.showAuditModal = false;
    this.selectedForAudit = null;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearFilters(): void {
    this.filterForm.reset({
      search: '',
      departamentoId: '',
      tipoIndicador: '',
      ativo: '',
    });
  }

  private applyFilters(): void {
    this.items = this.getFilteredItems(this.allItems);
  }

  private getFilteredItems(source: Indicador[]): Indicador[] {
    const { search, departamentoId, tipoIndicador, ativo } = this.filterForm.value;
    const term = this.normalizeText(search);
    return source.filter((item) => {
      const nome = this.normalizeText(item.nomeIndicador);
      const codigo = String(item.codigoIndicador);
      const dep = this.normalizeText(item.departamento?.nomeDepartamento);
      const matchesSearch =
        !term ||
        nome.includes(term) ||
        dep.includes(term) ||
        codigo.includes(term);
      const matchesDepartamento =
        !departamentoId || item.departamentoId === departamentoId;
      const matchesTipo =
        !tipoIndicador ||
        this.normalizeText(item.tipoIndicador).includes(
          this.normalizeText(tipoIndicador),
        );
      const matchesAtivo =
        !ativo ||
        (ativo === 'true' && item.ativo) ||
        (ativo === 'false' && !item.ativo);
      return (
        matchesSearch && matchesDepartamento && matchesTipo && matchesAtivo
      );
    });
  }

  private loadDepartamentos(): void {
    this.authService
      .getProfile()
      .then((user) => {
        this.departamentos = user?.departamentos ?? [];
      })
      .catch(() => {
        this.departamentos = [];
      });
  }

  private normalizeText(value?: string | null): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
