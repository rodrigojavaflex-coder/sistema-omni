import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeiculoService } from '../../services';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Veiculo, FindVeiculoDto } from '../../models/veiculo.model';
import { Permission } from '../../models/usuario.model';
import { PaginatedResponse } from '../../models/usuario.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { BaseListComponent } from '../base-list.component';

@Component({
  selector: 'app-veiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './veiculo-list.html',
  styleUrls: ['./veiculo-list.css']
})
export class VeiculoListComponent extends BaseListComponent<Veiculo> implements OnInit {
  private veiculoService = inject(VeiculoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  descricaoFilter = '';
  placaFilter = '';
  anoFilter?: number;

  deleteModalTitle = 'Confirmação de Exclusão';

  // Modal de auditoria
  showAuditModal = false;
  selectedItemForAudit: Veiculo | null = null;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';
    const filters: FindVeiculoDto = { page: this.currentPage, limit: this.pageSize };

    if (this.descricaoFilter.trim()) filters.descricao = this.descricaoFilter.trim();
    if (this.placaFilter.trim()) filters.placa = this.placaFilter.trim();
    if (this.anoFilter) filters.ano = this.anoFilter;

    this.veiculoService.getVeiculos(filters).subscribe({
      next: (response: PaginatedResponse<Veiculo>) => {
        this.items = response.data;
        this.totalItems = response.meta.total;
        this.totalPages = response.meta.totalPages;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        if (err?.status === 403) {
          this.errorModalService.show('Acesso negado: usuário não possui permissão para este recurso', 'Acesso negado');
        } else {
          this.errorModalService.show('Erro ao carregar veículos', 'Erro');
        }
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadItems();
  }

  clearFilters(): void {
    this.descricaoFilter = '';
    this.placaFilter = '';
    this.anoFilter = undefined;
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
}
