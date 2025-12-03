import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import {
  Meta,
  POLARIDADE_META_LABELS,
  UNIDADE_META_LABELS,
  INDICADOR_META_LABELS,
} from '../../models/meta.model';
import { MetaService } from '../../services/meta.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-meta-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './meta-list.html',
  styleUrls: ['./meta-list.css']
})
export class MetaListComponent extends BaseListComponent<Meta> {
  private metaService = inject(MetaService);
  private router = inject(Router);
  protected override authService = inject(AuthService);

  canAudit = false;
  showAuditModal = false;
  selectedForAudit: Meta | null = null;
  polaridadeLabels = POLARIDADE_META_LABELS;
  unidadeLabels = UNIDADE_META_LABELS;
  indicadorLabels = INDICADOR_META_LABELS;

  protected override loadItems(): void {
    this.loading = true;
    this.metaService.getAll().subscribe({
      next: (items) => { this.items = items; this.loading = false; },
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
    return this.metaService.getAll();
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
    this.router.navigate(['/meta/new']);
  }

  edit(item: Meta): void {
    this.router.navigate(['/meta/edit', item.id]);
  }

  delete(item: Meta): void {
    this.confirmDelete(item, `Deseja excluir a meta "${item.tituloDaMeta}"?`);
  }

  override ngOnInit(): void {
    this.canAudit = this.authService.hasPermission(Permission.META_AUDIT);
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
}
