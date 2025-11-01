import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OcorrenciaService } from '../../services/ocorrencia.service';
import { VeiculoService } from '../../services/veiculo.service';
import { MotoristaService } from '../../services/motorista.service';
import { Ocorrencia, FindOcorrenciaDto, OcorrenciaListResponse } from '../../models/ocorrencia.model';
import { TipoOcorrencia } from '../../models/tipo-ocorrencia.enum';
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
  private router = inject(Router);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Estado de expansão de filtros
  showAdvancedFilters = false;

  // Filtros básicos
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

  // Opções de filtros básicos
  tipoOptions = Object.values(TipoOcorrencia);
  linhaOptions = Object.values(Linha);

  // Opções de filtros avançados
  arcoOptions = Object.values(Arco);
  sentidoViaOptions = Object.values(SentidoVia);
  tipoLocalOptions = Object.values(TipoLocal);
  culpabilidadeOptions = Object.values(Culpabilidade);
  houveVitimasOptions = Object.values(SimNao);
  terceirizadoOptions = Object.values(Terceirizado);

  filterTimeout: any = null;

  deleteModalTitle = 'Confirmação de Exclusão';

  // Modal de auditoria
  showAuditModal = false;
  selectedItemForAudit: Ocorrencia | null = null;

  override ngOnInit(): void {
    super.ngOnInit();
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

  // Métodos de exportação
  protected loadAllItemsForExport(): Observable<Ocorrencia[]> {
    const filters: FindOcorrenciaDto = {
      page: 1,
      limit: 100000
    };

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

