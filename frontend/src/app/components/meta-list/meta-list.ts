import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseListComponent } from '../base-list.component';
import {
  Meta,
  POLARIDADE_META_LABELS,
  UNIDADE_META_LABELS,
  INDICADOR_META_LABELS,
  PolaridadeMeta,
  IndicadorMeta,
} from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-meta-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './meta-list.html',
  styleUrls: ['./meta-list.css']
})
export class MetaListComponent extends BaseListComponent<Meta> {
  private metaService = inject(MetaService);
  private router = inject(Router);
  protected override authService = inject(AuthService);
  private fb = inject(FormBuilder);

  canAudit = false;
  canCreate = false;
  canUpdate = false;
  canDelete = false;
  showAuditModal = false;
  selectedForAudit: Meta | null = null;
  polaridadeLabels = POLARIDADE_META_LABELS;
  unidadeLabels = UNIDADE_META_LABELS;
  indicadorLabels = INDICADOR_META_LABELS;
  polaridadeOptions = Object.entries(POLARIDADE_META_LABELS) as [PolaridadeMeta, string][];
  indicadorOptions = Object.entries(INDICADOR_META_LABELS) as [IndicadorMeta, string][];
  departamentos: { id: string; nomeDepartamento: string }[] = [];
  showFilters = false;
  filterForm = this.fb.group({
    search: [''],
    departamentoId: [''],
    polaridade: [''],
    indicador: [''],
  });
  private allItems: Meta[] = [];

  protected override loadItems(): void {
    this.loading = true;
    this.metaService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorModalService.show('Erro ao carregar metas', 'Erro');
      }
    });
  }

  protected override deleteItem(id: string): Observable<any> {
    return this.metaService.delete(id);
  }

  protected override getId(item: Meta): string {
    return item.id;
  }

  protected override loadAllItemsForExport(): Observable<Meta[]> {
    return of(this.getFilteredItems(this.allItems));
  }

  protected override getExportDataExcel(items: Meta[]) {
    const headers = [
      'Título da Meta',
      'Polaridade',
      'Unidade',
      'Indicador',
      'Início',
      'Departamento',
      'Prazo Final',
      'Meta',
      'Registrado em',
    ];
    const data = items.map(m => [
      m.tituloDaMeta,
      this.polaridadeLabels[m.polaridade] || '-',
      this.unidadeLabels[m.unidade] || '-',
      this.indicadorLabels[m.indicador] || '-',
      m.inicioDaMeta ? new Date(m.inicioDaMeta).toISOString().split('T')[0] : '-',
      m.departamento?.nomeDepartamento || '-',
      m.prazoFinal || '-',
      m.valorMeta ?? '-',
      m.criadoEm,
    ]);
    return { headers, data };
  }

  protected override getExportDataPDF(items: Meta[]) {
    const headers = [
      'Título da Meta',
      'Polaridade',
      'Unidade',
      'Indicador',
      'Início',
      'Departamento',
      'Prazo Final',
      'Meta',
      'Registrado em',
    ];
    const data = items.map(m => [
      m.tituloDaMeta,
      this.polaridadeLabels[m.polaridade] || '-',
      this.unidadeLabels[m.unidade] || '-',
      this.indicadorLabels[m.indicador] || '-',
      m.inicioDaMeta ? new Date(m.inicioDaMeta).toLocaleDateString('pt-BR') : '-',
      m.departamento?.nomeDepartamento || '-',
      m.prazoFinal || '-',
      m.valorMeta ?? '-',
      m.criadoEm,
    ]);
    return { headers, data };
  }

  protected override getExportFileName(): string {
    return 'metas';
  }

  protected override getTableDisplayName(): string {
    return 'Metas';
  }

  create(): void {
    if (!this.canCreate) return;
    this.router.navigate(['/meta/new']);
  }

  edit(item: Meta): void {
    if (!this.canUpdate) return;
    this.router.navigate(['/meta/edit', item.id]);
  }

  delete(item: Meta): void {
    if (!this.canDelete) return;
    this.confirmDelete(item, `Deseja excluir a meta "${item.tituloDaMeta}"?`);
  }

  override ngOnInit(): void {
    this.canAudit = this.authService.hasPermission(Permission.META_AUDIT);
    this.canCreate = this.authService.hasPermission(Permission.META_CREATE);
    this.canUpdate = this.authService.hasPermission(Permission.META_UPDATE);
    this.canDelete = this.authService.hasPermission(Permission.META_DELETE);
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadDepartamentos();
    super.ngOnInit();
  }

  openAudit(meta: Meta): void {
    if (!this.canAudit) return;
    this.selectedForAudit = meta;
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
      polaridade: '',
      indicador: '',
    });
  }

  private applyFilters(): void {
    this.items = this.getFilteredItems(this.allItems);
  }

  private getFilteredItems(source: Meta[]): Meta[] {
    const { search, departamentoId, polaridade, indicador } = this.filterForm.value;
    const term = this.normalizeText(search);
    return source.filter((meta) => {
      const titulo = this.normalizeText(meta.tituloDaMeta);
      const departamentoNome = this.normalizeText(meta.departamento?.nomeDepartamento);
      const matchesSearch = !term || titulo.includes(term) || departamentoNome.includes(term);
      const matchesDepartamento = !departamentoId || meta.departamentoId === departamentoId;
      const matchesPolaridade = !polaridade || meta.polaridade === polaridade;
      const matchesIndicador = !indicador || meta.indicador === indicador;
      return matchesSearch && matchesDepartamento && matchesPolaridade && matchesIndicador;
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
