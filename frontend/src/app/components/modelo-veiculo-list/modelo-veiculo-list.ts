import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { ModeloVeiculo } from '../../models/modelo-veiculo.model';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-modelo-veiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './modelo-veiculo-list.html',
  styleUrls: ['./modelo-veiculo-list.css'],
})
export class ModeloVeiculoListComponent extends BaseListComponent<ModeloVeiculo> {
  private modeloService = inject(ModeloVeiculoService);
  private router = inject(Router);

  allItems: ModeloVeiculo[] = [];
  filterNome = '';
  filterAtivo = '';

  canCreate = this.authService.hasPermission(Permission.MODELOVEICULO_CREATE);
  canEdit = this.authService.hasPermission(Permission.MODELOVEICULO_UPDATE);
  canDelete = this.authService.hasPermission(Permission.MODELOVEICULO_DELETE);
  canAudit = this.authService.hasPermission(Permission.MODELOVEICULO_READ);

  showAuditModal = false;
  selectedItemForAudit: ModeloVeiculo | null = null;

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    const ativoParsed =
      this.filterAtivo === ''
        ? undefined
        : this.filterAtivo === 'true' || this.filterAtivo === '1';

    this.modeloService.getAll(ativoParsed).subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar modelos de veículo';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.modeloService.delete(id);
  }

  protected override getId(item: ModeloVeiculo): string {
    return item.id;
  }

  onFilterChange(): void {
    this.items = this.applyFilters(this.allItems);
  }

  clearFilters(): void {
    this.filterNome = '';
    this.filterAtivo = '';
    this.items = this.applyFilters(this.allItems);
  }

  onNew(): void {
    this.router.navigate(['/modelos-veiculo/new']);
  }

  onEdit(item: ModeloVeiculo): void {
    this.router.navigate(['/modelos-veiculo/edit', item.id]);
  }

  onDelete(item: ModeloVeiculo): void {
    this.confirmDelete(item, `Deseja realmente excluir o modelo "${item.nome}"?`);
  }

  openAuditModal(item: ModeloVeiculo): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getStatusLabel(item: ModeloVeiculo): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  protected loadAllItemsForExport(): Observable<ModeloVeiculo[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: ModeloVeiculo[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Nome', 'Status'],
      data: items.map((item) => [item.nome, this.getStatusLabel(item)]),
    };
  }

  protected getExportDataPDF(items: ModeloVeiculo[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Nome', 'Status'],
      data: items.map((item) => [item.nome, this.getStatusLabel(item)]),
    };
  }

  protected getExportFileName(): string {
    return 'modelos-veiculo';
  }

  protected getTableDisplayName(): string {
    return 'Modelos de Veículo';
  }

  private applyFilters(items: ModeloVeiculo[]): ModeloVeiculo[] {
    const term = this.filterNome.trim().toLowerCase();
    const status = this.filterAtivo;

    return items.filter((item) => {
      const matchesNome = !term || item.nome.toLowerCase().includes(term);
      const matchesStatus =
        !status || (status === 'true' ? item.ativo : !item.ativo);
      return matchesNome && matchesStatus;
    });
  }
}
