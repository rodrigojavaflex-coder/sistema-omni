import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OcorrenciaService } from '../../services/ocorrencia.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { OrigemOcorrenciaService } from '../../services/origem-ocorrencia.service';
import { CategoriaOcorrenciaService } from '../../services/categoria-ocorrencia.service';
import { Ocorrencia, FindOcorrenciaDto, OcorrenciaListResponse } from '../../models/ocorrencia.model';
import { OrigemOcorrencia } from '../../models/origem-ocorrencia.model';
import { CategoriaOcorrencia } from '../../models/categoria-ocorrencia.model';
import { TipoOcorrencia } from '../../models/tipo-ocorrencia.enum';
import { StatusOcorrencia } from '../../models/status-ocorrencia.enum';
import { HistoricoOcorrencia, UpdateStatusOcorrenciaDto } from '../../models/historico-ocorrencia.model';
import { Linha } from '../../models/linha.enum';
import { Arco } from '../../models/arco.enum';
import { SentidoVia } from '../../models/sentido-via.enum';
import { TipoLocal } from '../../models/tipo-local.enum';
import { Culpabilidade } from '../../models/culpabilidade.enum';
import { SimNao } from '../../models/sim-nao.enum';
import { Terceirizado } from '../../models/terceirizado.enum';
import { Veiculo, Motorista } from '../../models';
import { Permission } from '../../models/usuario.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { MotoristaAutocompleteComponent } from '../shared/motorista-autocomplete/motorista-autocomplete.component';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';
import { BaseListComponent } from '../base-list.component';
import { ExportDataTransformer } from './export-data-transformer';

@Component({
  selector: 'app-ocorrencia-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ConfirmationModalComponent, 
    HistoricoAuditoriaComponent,
    VeiculoAutocompleteComponent,
    MotoristaAutocompleteComponent,
    MultiSelectComponent
  ],
  templateUrl: './ocorrencia-list.html',
  styleUrls: ['./ocorrencia-list.css']
})
export class OcorrenciaListComponent extends BaseListComponent<Ocorrencia> implements OnInit {
  private ocorrenciaService = inject(OcorrenciaService);
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService);
  private origemService = inject(OrigemOcorrenciaService);
  private categoriaService = inject(CategoriaOcorrenciaService);
  private router = inject(Router);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Estado de expansão de filtros
  showAdvancedFilters = false;

  // Filtros básicos
  numeroOcorrenciaFilter = '';
  statusFilter: string[] = [];
  tipoFilter: string[] = [];
  linhaFilter: string[] = [];
  dataInicioFilter = '';
  dataFimFilter = '';
  veiculoFilter = '';
  motoristaFilter = '';

  // Filtros avançados
  arcoFilter: string[] = [];
  sentidoViaFilter: string[] = [];
  tipoLocalFilter: string[] = [];
  culpabilidadeFilter: string[] = [];
  houveVitimasFilter: string[] = [];
  terceirizadoFilter: string[] = [];
  origemFilter: string[] = [];
  classificacaoFilter: string[] = [];

  // Opções de filtros básicos
  statusOptions = Object.values(StatusOcorrencia);
  tipoOptions = Object.values(TipoOcorrencia);
  linhaOptions = Object.values(Linha);

  // Opções de filtros avançados
  arcoOptions = Object.values(Arco);
  sentidoViaOptions = Object.values(SentidoVia);
  tipoLocalOptions = Object.values(TipoLocal);
  culpabilidadeOptions = Object.values(Culpabilidade);
  houveVitimasOptions = Object.values(SimNao);
  terceirizadoOptions = Object.values(Terceirizado);
  origemOptions: string[] = [];
  classificacaoOptions: string[] = [];

  filterTimeout: any = null;

  deleteModalTitle = 'Confirmação de Exclusão';

  // Modal de auditoria
  showAuditModal = false;
  selectedItemForAudit: Ocorrencia | null = null;

  // Modal de status/histórico (só histórico)
  showStatusModal = false;
  selectedOcorrenciaForStatus: Ocorrencia | null = null;
  historico: HistoricoOcorrencia[] = [];
  isLoadingHistorico = false;
  editingObservacaoId: string | null = null;
  editingObservacaoTexto = '';

  // Modal de novo status (status + observação)
  showNovoStatusModal = false;
  novoStatus: StatusOcorrencia | null = null;
  observacaoStatus = '';
  isSavingStatus = false;

  private origensList: OrigemOcorrencia[] = [];
  private categoriasList: CategoriaOcorrencia[] = [];

  override ngOnInit(): void {
    super.ngOnInit();
    this.origemService.getAll().subscribe((list) => {
      this.origensList = list;
      this.origemOptions = list.map((o) => o.descricao);
    });
    this.categoriaService.getAll().subscribe((list) => {
      this.categoriasList = list;
      this.classificacaoOptions = list.map((c) => c.descricao);
    });
  }

  loadItems(): void {
    this.loading = true;

    const filters: FindOcorrenciaDto = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    if (this.tipoFilter.length > 0) {
      filters.tipo = this.tipoFilter;
    }
    if (this.linhaFilter.length > 0) {
      filters.linha = this.linhaFilter;
    }
    if (this.dataInicioFilter) {
      filters.dataInicio = this.dataInicioFilter;
    }
    if (this.dataFimFilter) {
      filters.dataFim = this.dataFimFilter;
    }
    if (this.numeroOcorrenciaFilter?.trim()) {
      filters.numero = this.numeroOcorrenciaFilter.trim();
    }
    if (this.statusFilter.length > 0) {
      filters.status = this.statusFilter;
    }
    if (this.veiculoFilter) {
      filters.idVeiculo = this.veiculoFilter;
    }
    if (this.motoristaFilter) {
      filters.idMotorista = this.motoristaFilter;
    }
    if (this.arcoFilter.length > 0) {
      filters.arco = this.arcoFilter;
    }
    if (this.sentidoViaFilter.length > 0) {
      filters.sentidoVia = this.sentidoViaFilter;
    }
    if (this.tipoLocalFilter.length > 0) {
      filters.tipoLocal = this.tipoLocalFilter;
    }
    if (this.culpabilidadeFilter.length > 0) {
      filters.culpabilidade = this.culpabilidadeFilter;
    }
    if (this.houveVitimasFilter.length > 0) {
      filters.houveVitimas = this.houveVitimasFilter;
    }
    if (this.terceirizadoFilter.length > 0) {
      filters.terceirizado = this.terceirizadoFilter;
    }
    if (this.origemFilter.length > 0) {
      filters.idOrigem = this.origemFilter.map(
        (d) => this.origensList.find((o) => o.descricao === d)?.id
      ).filter((id): id is string => !!id);
    }
    if (this.classificacaoFilter.length > 0) {
      filters.idCategoria = this.classificacaoFilter.map(
        (d) => this.categoriasList.find((c) => c.descricao === d)?.id
      ).filter((id): id is string => !!id);
    }

    this.ocorrenciaService.getOcorrencias(filters).subscribe({
      next: (response: OcorrenciaListResponse) => {
        this.items = response.data || [];
        this.totalItems = response.total || 0;
        this.totalPages = Math.ceil((response.total || 0) / this.itemsPerPage);
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar ocorrências:', error);
        this.items = [];
        this.totalItems = 0;
        this.totalPages = 0;
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  onFilterChange(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadItems();
    }, 500);
  }

  clearFilters(): void {
    this.numeroOcorrenciaFilter = '';
    this.statusFilter = [];
    this.tipoFilter = [];
    this.linhaFilter = [];
    this.dataInicioFilter = '';
    this.dataFimFilter = '';
    this.veiculoFilter = '';
    this.motoristaFilter = '';
    this.arcoFilter = [];
    this.sentidoViaFilter = [];
    this.tipoLocalFilter = [];
    this.culpabilidadeFilter = [];
    this.houveVitimasFilter = [];
    this.terceirizadoFilter = [];
    this.origemFilter = [];
    this.classificacaoFilter = [];
    this.onFilterChange();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  // Callbacks dos autocompletes
  onVeiculoSelected(veiculo: Veiculo): void {
    this.veiculoFilter = veiculo.id;
    this.onFilterChange();
  }

  onMotoristaSelected(motorista: Motorista): void {
    this.motoristaFilter = motorista.id;
    this.onFilterChange();
  }

  createItem(): void {
    this.router.navigate(['/ocorrencia/new']);
  }

  editItem(item: Ocorrencia): void {
    this.router.navigate(['/ocorrencia/edit', item.id]);
  }

  confirmDeleteItem(item: Ocorrencia): void {
    this.confirmDelete(
      item,
      `Tem certeza que deseja excluir a ocorrência de ${item.tipo} do dia ${this.formatDate(item.dataHora)}?`
    );
  }

  protected deleteItem(id: string): Observable<any> {
    return this.ocorrenciaService.delete(id);
  }

  protected getId(item: Ocorrencia): string {
    return item.id;
  }

  openAuditModal(item: Ocorrencia): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  canCreate(): boolean {
    return this.authService.hasPermission(Permission.OCORRENCIA_CREATE);
  }

  canUpdate(): boolean {
    return this.authService.hasPermission(Permission.OCORRENCIA_UPDATE);
  }

  canDelete(): boolean {
    return this.authService.hasPermission(Permission.OCORRENCIA_DELETE);
  }

  canAudit(): boolean {
    return this.authService.hasPermission(Permission.OCORRENCIA_AUDIT);
  }

  canUpdateStatus(): boolean {
    return this.authService.hasPermission(Permission.OCORRENCIA_UPDATE_STATUS);
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'status-badge status-badge-default';
    
    switch (status) {
      case StatusOcorrencia.REGISTRADA:
        return 'status-badge status-badge-registrada';
      case StatusOcorrencia.EM_ANALISE:
        return 'status-badge status-badge-em-analise';
      case StatusOcorrencia.CONCLUIDA:
        return 'status-badge status-badge-concluida';
      default:
        return 'status-badge status-badge-default';
    }
  }

  /** Dias corridos: não concluída = abertura até hoje; concluída = abertura até dataConclusao */
  getDias(item: Ocorrencia): number | string {
    const abertura = new Date(item.dataHora).getTime();
    const fim = item.status === StatusOcorrencia.CONCLUIDA && item.dataConclusao
      ? new Date(item.dataConclusao).getTime()
      : Date.now();
    const dias = Math.floor((fim - abertura) / (24 * 60 * 60 * 1000));
    return dias >= 0 ? dias : '-';
  }

  getAvailableStatuses(): StatusOcorrencia[] {
    const currentStatus = this.selectedOcorrenciaForStatus?.status;
    const allStatuses = Object.values(StatusOcorrencia);
    
    // Excluir "Registrada" (só para nova ocorrência)
    let filtered = allStatuses.filter(s => s !== StatusOcorrencia.REGISTRADA);
    
    // Excluir o status atual, exceto se for "Em Análise"
    // (sempre permitir registrar "Em Análise" novamente antes da conclusão)
    if (currentStatus && currentStatus !== StatusOcorrencia.EM_ANALISE) {
      filtered = filtered.filter(s => s !== currentStatus);
    }
    
    // Garantir que "Em Análise" está sempre presente
    if (!filtered.includes(StatusOcorrencia.EM_ANALISE)) {
      filtered.push(StatusOcorrencia.EM_ANALISE);
    }
    
    return filtered;
  }

  startEditObservacao(item: HistoricoOcorrencia): void {
    this.editingObservacaoId = item.id;
    this.editingObservacaoTexto = item.observacao || '';
  }

  cancelEditObservacao(): void {
    this.editingObservacaoId = null;
    this.editingObservacaoTexto = '';
  }

  saveObservacao(item: HistoricoOcorrencia): void {
    if (!this.editingObservacaoId) return;

    this.ocorrenciaService.updateHistoricoObservacao(
      this.selectedOcorrenciaForStatus!.id,
      this.editingObservacaoId,
      this.editingObservacaoTexto.trim() || undefined
    ).subscribe({
      next: () => {
        // Atualizar o item no histórico local
        const historicoItem = this.historico.find(h => h.id === this.editingObservacaoId);
        if (historicoItem) {
          historicoItem.observacao = this.editingObservacaoTexto.trim() || undefined;
        }
        this.cancelEditObservacao();
      },
      error: (error) => {
        alert('Erro ao atualizar observação: ' + (error.error?.message || error.message));
      },
    });
  }

  openStatusModal(item: Ocorrencia): void {
    this.selectedOcorrenciaForStatus = item;
    this.historico = [];
    this.isLoadingHistorico = true;
    this.showStatusModal = true;
    this.showNovoStatusModal = false;

    this.ocorrenciaService.getHistorico(item.id).subscribe({
      next: (historico) => {
        this.historico = historico;
        this.isLoadingHistorico = false;
      },
      error: () => {
        this.isLoadingHistorico = false;
      },
    });
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.showNovoStatusModal = false;
    this.selectedOcorrenciaForStatus = null;
    this.historico = [];
    this.novoStatus = null;
    this.observacaoStatus = '';
    this.cancelEditObservacao();
  }

  openNovoStatusModal(): void {
    this.novoStatus = null;
    this.observacaoStatus = '';
    this.showNovoStatusModal = true;
  }

  closeNovoStatusModal(): void {
    this.showNovoStatusModal = false;
    this.novoStatus = null;
    this.observacaoStatus = '';
  }

  saveStatus(): void {
    if (!this.selectedOcorrenciaForStatus || !this.novoStatus) {
      return;
    }

    this.isSavingStatus = true;
    const dto: UpdateStatusOcorrenciaDto = {
      status: this.novoStatus,
      observacao: this.observacaoStatus.trim() || undefined,
    };

    this.ocorrenciaService
      .updateStatus(this.selectedOcorrenciaForStatus.id, dto)
      .subscribe({
        next: () => {
          this.isSavingStatus = false;
          this.closeNovoStatusModal();
          // Atualizar status exibido e recarregar histórico no modal
          this.selectedOcorrenciaForStatus!.status = this.novoStatus!;
          this.ocorrenciaService.getHistorico(this.selectedOcorrenciaForStatus!.id).subscribe({
            next: (historico) => {
              this.historico = historico;
            },
          });
          this.loadItems();
        },
        error: (error) => {
          this.isSavingStatus = false;
          alert('Erro ao atualizar status: ' + (error.error?.message || error.message));
        },
      });
  }

  // Métodos de exportação
  protected loadAllItemsForExport(): Observable<Ocorrencia[]> {
    const filters: FindOcorrenciaDto = {
      page: 1,
      limit: 100000
    };

    if (this.numeroOcorrenciaFilter?.trim()) filters.numero = this.numeroOcorrenciaFilter.trim();
    if (this.tipoFilter.length > 0) filters.tipo = this.tipoFilter;
    if (this.linhaFilter.length > 0) filters.linha = this.linhaFilter;
    if (this.dataInicioFilter) filters.dataInicio = this.dataInicioFilter;
    if (this.dataFimFilter) filters.dataFim = this.dataFimFilter;
    if (this.veiculoFilter) filters.idVeiculo = this.veiculoFilter;
    if (this.motoristaFilter) filters.idMotorista = this.motoristaFilter;
    if (this.arcoFilter.length > 0) filters.arco = this.arcoFilter;
    if (this.sentidoViaFilter.length > 0) filters.sentidoVia = this.sentidoViaFilter;
    if (this.tipoLocalFilter.length > 0) filters.tipoLocal = this.tipoLocalFilter;
    if (this.culpabilidadeFilter.length > 0) filters.culpabilidade = this.culpabilidadeFilter;
    if (this.houveVitimasFilter.length > 0) filters.houveVitimas = this.houveVitimasFilter;
    if (this.terceirizadoFilter.length > 0) filters.terceirizado = this.terceirizadoFilter;
    if (this.origemFilter.length > 0) {
      filters.idOrigem = this.origemFilter.map(
        (d) => this.origensList.find((o) => o.descricao === d)?.id
      ).filter((id): id is string => !!id);
    }
    if (this.classificacaoFilter.length > 0) {
      filters.idCategoria = this.classificacaoFilter.map(
        (d) => this.categoriasList.find((c) => c.descricao === d)?.id
      ).filter((id): id is string => !!id);
    }

    return new Observable(observer => {
      this.ocorrenciaService.getOcorrencias(filters).subscribe({
        next: (response) => {
          observer.next(response.data);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  protected getExportDataExcel(items: Ocorrencia[]): { headers: string[], data: any[][] } {
    const headers = ExportDataTransformer.getExcelHeaders();
    
    const data = items.map(item => 
      ExportDataTransformer.transformOcorrenciaToExcelRow(item)
    );

    return { headers, data };
  }

  protected getExportDataPDF(items: Ocorrencia[]): { headers: string[], data: any[][] } {
    return this.getExportDataExcel(items);
  }

  protected getExportFileName(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    return `Ocorrencias_${dateStr}`;
  }

  protected getTableDisplayName(): string {
    return 'Ocorrências';
  }
}

