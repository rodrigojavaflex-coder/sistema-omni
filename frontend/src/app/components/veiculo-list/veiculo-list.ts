import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeiculoService } from '../../services';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Veiculo, FindVeiculoDto, Combustivel, StatusVeiculo } from '../../models';
import { Permission } from '../../models/usuario.model';
import { PaginatedResponse } from '../../models/usuario.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { BaseListComponent } from '../base-list.component';
import { PlacaPipe } from '../../pipes/placa.pipe';

@Component({
  selector: 'app-veiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent, PlacaPipe],
  templateUrl: './veiculo-list.html',
  styleUrls: ['./veiculo-list.css']
})
export class VeiculoListComponent extends BaseListComponent<Veiculo> implements OnInit {
  private veiculoService = inject(VeiculoService);
  private router = inject(Router);

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  descricaoFilter = '';
  placaFilter = '';
  anoFilter: number | null = null;
  marcaFilter = '';
  modeloFilter = '';
  combustivelFilter = '';
  statusFilter = '';
  marcaCarroceriaFilter = '';
  modeloCarroceriaFilter = '';

  combustivelOptions = Object.values(Combustivel);
  statusOptions = Object.values(StatusVeiculo);

  filterTimeout: any = null;

  deleteModalTitle = 'Confirmação de Exclusão';

  // Modal de auditoria
  showAuditModal = false;
  selectedItemForAudit: Veiculo | null = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  loadItems() {
    this.loading = true;

    const filters: FindVeiculoDto = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    if (this.descricaoFilter.trim()) {
      filters.descricao = this.descricaoFilter.trim();
    }
    if (this.placaFilter.trim()) {
      filters.placa = this.placaFilter.trim();
    }
    if (this.anoFilter && this.anoFilter >= 1900) {
      filters.ano = this.anoFilter;
    }
    if (this.marcaFilter.trim()) {
      filters.marca = this.marcaFilter.trim();
    }
    if (this.modeloFilter.trim()) {
      filters.modelo = this.modeloFilter.trim();
    }
    if (this.combustivelFilter) {
      filters.combustivel = this.combustivelFilter;
    }
    if (this.statusFilter) {
      filters.status = this.statusFilter as StatusVeiculo;
    }
    if (this.marcaCarroceriaFilter.trim()) {
      filters.marcaDaCarroceria = this.marcaCarroceriaFilter.trim();
    }
    if (this.modeloCarroceriaFilter.trim()) {
      filters.modeloDaCarroceria = this.modeloCarroceriaFilter.trim();
    }

    this.veiculoService.getVeiculos(filters).subscribe({
      next: (response: PaginatedResponse<Veiculo>) => {
        this.items = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar itens:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  onFilterChange() {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadItems();
    }, 500);
  }

  clearFilters() {
    this.descricaoFilter = '';
    this.placaFilter = '';
    this.anoFilter = null;
    this.marcaFilter = '';
    this.modeloFilter = '';
    this.combustivelFilter = '';
    this.statusFilter = '';
    this.marcaCarroceriaFilter = '';
    this.modeloCarroceriaFilter = '';
    this.currentPage = 1;
    this.loadItems();
  }

  editItem(item: Veiculo): void {
    this.router.navigate(['/veiculo/edit', item.id]);
  }

  /** Abre modal para confirmação da exclusão do veículo */
  deleteVehicle(item: Veiculo): void {
    this.confirmDelete(item, `Tem certeza que deseja excluir o veículo "${item.descricao}"?`);
  }

  /** Implementação do método abstrato de exclusão (chama o service) */
  protected override deleteItem(id: string) {
    return this.veiculoService.delete(id);
  }

  protected override getId(item: Veiculo): string {
    return item.id;
  }

  createItem(): void {
    this.router.navigate(['/veiculo/new']);
  }

  openAuditHistory(item: Veiculo): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  canCreate(): boolean { return this.authService.hasPermission(Permission.VEICULO_CREATE); }
  canRead(): boolean { return this.authService.hasPermission(Permission.VEICULO_READ); }
  canEdit(): boolean { return this.authService.hasPermission(Permission.VEICULO_UPDATE); }
  canDelete(): boolean { return this.authService.hasPermission(Permission.VEICULO_DELETE); }
  canAudit(): boolean { return this.authService.hasPermission(Permission.VEICULO_AUDIT); }
  /** Fechar modal de auditoria */
  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  /** Implementação dos métodos de exportação */
  protected loadAllItemsForExport(): Observable<Veiculo[]> {
    return new Observable<Veiculo[]>(observer => {
      const allItems: Veiculo[] = [];
      let currentPage = 1;
      const pageLimit = 100; // Limite máximo aceito pelo backend

      const loadPage = () => {
        const filters: FindVeiculoDto = {
          page: currentPage,
          limit: pageLimit,
        };

        if (this.descricaoFilter.trim()) {
          filters.descricao = this.descricaoFilter.trim();
        }
        if (this.placaFilter.trim()) {
          filters.placa = this.placaFilter.trim();
        }
        if (this.anoFilter && this.anoFilter >= 1900) {
          filters.ano = this.anoFilter;
        }
        if (this.marcaFilter.trim()) {
          filters.marca = this.marcaFilter.trim();
        }
        if (this.modeloFilter.trim()) {
          filters.modelo = this.modeloFilter.trim();
        }
        if (this.combustivelFilter) {
          filters.combustivel = this.combustivelFilter;
        }
        if (this.statusFilter) {
          filters.status = this.statusFilter as StatusVeiculo;
        }
        if (this.marcaCarroceriaFilter.trim()) {
          filters.marcaDaCarroceria = this.marcaCarroceriaFilter.trim();
        }
        if (this.modeloCarroceriaFilter.trim()) {
          filters.modeloDaCarroceria = this.modeloCarroceriaFilter.trim();
        }

        this.veiculoService.getVeiculos(filters).subscribe({
          next: (response: PaginatedResponse<Veiculo>) => {
            allItems.push(...response.data);
            
            // Se ainda há mais páginas, continua buscando
            if (currentPage < response.meta.totalPages) {
              currentPage++;
              loadPage();
            } else {
              // Terminou de buscar todas as páginas
              observer.next(allItems);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      };

      loadPage();
    });
  }

  protected getExportDataExcel(items: Veiculo[]): { headers: string[], data: any[][] } {
    const headers = ['N° do Veiculo', 'Placa', 'Ano', 'Chassi', 'Marca', 'Modelo', 'Combustível', 'Status', 'Marca Carroceria', 'Modelo Carroceria'];
    const data = items.map(item => [
      item.descricao,
      item.placa,
      item.ano,
      item.chassi,
      item.marca,
      item.modelo,
      item.combustivel,
      item.status || '',
      item.marcaDaCarroceria || '',
      item.modeloDaCarroceria || ''
    ]);
    return { headers, data };
  }

  protected getExportDataPDF(items: Veiculo[]): { headers: string[], data: any[][] } {
    const headers = ['N° do Veiculo', 'Placa', 'Ano', 'Chassi', 'Marca', 'Modelo', 'Combustível', 'Status', 'Marca Carroceria', 'Modelo Carroceria'];
    const data = items.map(item => [
      item.descricao,
      item.placa,
      item.ano,
      item.chassi,
      item.marca,
      item.modelo,
      item.combustivel,
      item.status || '',
      item.marcaDaCarroceria || '',
      item.modeloDaCarroceria || ''
    ]);
    return { headers, data };
  }

  protected getExportFileName(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
    return `Veiculos_${dateStr}`;
  }

  protected getTableDisplayName(): string {
    return 'Veículos';
  }
}
