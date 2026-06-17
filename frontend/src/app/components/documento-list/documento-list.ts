import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import {
  DocumentoResumo,
  DocumentoFilters,
  STATUS_DOCUMENTO_LABELS,
  StatusDocumento,
} from '../../models/documento.model';
import { DocumentoService } from '../../services/documento.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { DepartamentoService } from '../../services/departamento.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { BaseListComponent } from '../base-list.component';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';
import { TipoDocumento } from '../../models/tipo-documento.model';
import { Departamento } from '../../models/departamento.model';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { copyTextToClipboard } from '../../utils/clipboard.util';
import {
  buildDocumentoDownloadFileName,
  triggerBlobDownload,
} from '../../utils/documento-file-name.util';

@Component({
  selector: 'app-documento-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ConfirmationModalComponent,
    HistoricoAuditoriaComponent,
  ],
  templateUrl: './documento-list.html',
  styleUrls: ['./documento-list.css'],
})
export class DocumentoListComponent
  extends BaseListComponent<DocumentoResumo>
  implements OnInit
{
  private readonly documentoService = inject(DocumentoService);
  private readonly tipoDocumentoService = inject(TipoDocumentoService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly router = inject(Router);
  protected override authService = inject(AuthService);

  readonly statusLabels = STATUS_DOCUMENTO_LABELS;
  readonly statusOptions = Object.values(StatusDocumento);

  filterNome = '';
  filterTipoDocumentoId = '';
  filterDepartamentoId = '';
  filterStatus = '';

  tiposDocumento: TipoDocumento[] = [];
  departamentos: Departamento[] = [];

  canAudit = false;
  canCompartilhar = false;
  showAuditModal = false;
  selectedForAudit: DocumentoResumo | null = null;
  copyFeedbackId: string | null = null;

  override ngOnInit(): void {
    this.canAudit = this.authService.hasPermission(Permission.DOCUMENTO_AUDIT);
    this.canCompartilhar = this.authService.hasPermission(
      Permission.DOCUMENTO_COMPARTILHAR,
    );
    void this.loadFilters();
    super.ngOnInit();
  }

  private async loadFilters(): Promise<void> {
    try {
      const [tipos, departamentos] = await Promise.all([
        firstValueFrom(this.tipoDocumentoService.getAll(undefined, true)),
        firstValueFrom(this.departamentoService.getAll()),
      ]);
      this.tiposDocumento = tipos;
      this.departamentos = departamentos;
    } catch {
      this.errorModalService.show('Erro ao carregar filtros', 'Erro');
    }
  }

  protected override loadItems(): void {
    this.loading = true;
    const filters: DocumentoFilters = {
      nome: this.filterNome.trim() || undefined,
      tipoDocumentoId: this.filterTipoDocumentoId || undefined,
      departamentoId: this.filterDepartamentoId || undefined,
      status: (this.filterStatus as StatusDocumento) || undefined,
    };

    this.documentoService.getAll(filters).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorModalService.show('Erro ao carregar documentos', 'Erro');
      },
    });
  }

  protected override deleteItem(id: string): Observable<void> {
    return this.documentoService.delete(id);
  }

  protected override getId(item: DocumentoResumo): string {
    return item.id;
  }

  protected override loadAllItemsForExport(): Observable<DocumentoResumo[]> {
    return this.documentoService.getAll({
      nome: this.filterNome.trim() || undefined,
      tipoDocumentoId: this.filterTipoDocumentoId || undefined,
      departamentoId: this.filterDepartamentoId || undefined,
      status: (this.filterStatus as StatusDocumento) || undefined,
    });
  }

  protected override getExportDataExcel(items: DocumentoResumo[]) {
    const headers = [
      'Nome',
      'Tipo',
      'Departamento',
      'Responsável',
      'Status',
      'Arquivo',
      'Tamanho (bytes)',
    ];
    const data = items.map((item) => [
      item.nomeDocumento,
      item.tipoDocumento.nome,
      item.departamento.nomeDepartamento,
      item.responsavel.nome,
      this.statusLabels[item.status],
      item.nomeArquivo,
      item.tamanho,
    ]);
    return { headers, data };
  }

  protected override getExportDataPDF(items: DocumentoResumo[]) {
    return this.getExportDataExcel(items);
  }

  protected override getExportFileName(): string {
    return 'documentos';
  }

  protected override getTableDisplayName(): string {
    return 'Documentos';
  }

  create(): void {
    this.router.navigate(['/documento/new']);
  }

  onFilterChange(): void {
    this.loadItems();
  }

  edit(item: DocumentoResumo): void {
    this.router.navigate(['/documento/edit', item.id]);
  }

  delete(item: DocumentoResumo): void {
    this.confirmDelete(item, `Deseja excluir o documento "${item.nomeDocumento}"?`);
  }

  async download(item: DocumentoResumo): Promise<void> {
    try {
      const blob = await firstValueFrom(this.documentoService.downloadArquivo(item.id));
      const filename = buildDocumentoDownloadFileName({
        nomeDocumento: item.nomeDocumento,
        tipoDocumento: item.tipoDocumento.nome,
        departamento: item.departamento.nomeDepartamento,
        nomeArquivoOriginal: item.nomeArquivo,
      });
      triggerBlobDownload(blob, filename);
    } catch {
      this.errorModalService.show('Erro ao baixar arquivo', 'Erro');
    }
  }

  async copyLink(item: DocumentoResumo): Promise<void> {
    if (!item.tokenPublico) {
      return;
    }
    const link = this.documentoService.buildPublicLink(item.tokenPublico);
    const copied = await copyTextToClipboard(link);
    if (!copied) {
      this.errorModalService.show('Não foi possível copiar o link', 'Erro');
      return;
    }
    this.copyFeedbackId = item.id;
    setTimeout(() => {
      this.copyFeedbackId = null;
    }, 2000);
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  isLinkAtivo(item: DocumentoResumo): boolean {
    if (!item.compartilhamentoAtivo || !item.tokenPublico) {
      return false;
    }
    if (!item.compartilhamentoExpiraEm) {
      return true;
    }
    return new Date(item.compartilhamentoExpiraEm).getTime() > Date.now();
  }

  openAudit(item: DocumentoResumo): void {
    if (!this.canAudit) {
      return;
    }
    this.selectedForAudit = item;
    this.showAuditModal = true;
  }

  closeAudit(): void {
    this.showAuditModal = false;
    this.selectedForAudit = null;
  }
}
