import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { VistaVeiculo } from '../../models/vista-veiculo.model';
import { VistaVeiculoService } from '../../services/vista-veiculo.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-vista-veiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './vista-veiculo-list.html',
  styleUrls: ['./vista-veiculo-list.css'],
})
export class VistaVeiculoListComponent extends BaseListComponent<VistaVeiculo> {
  private vistaService = inject(VistaVeiculoService);
  private router = inject(Router);

  allItems: VistaVeiculo[] = [];
  filterDescricao = '';
  filterAtivo = '';

  canCreate = this.authService.hasPermission(Permission.VISTAVEICULO_CREATE);
  canEdit = this.authService.hasPermission(Permission.VISTAVEICULO_UPDATE);
  canDelete = this.authService.hasPermission(Permission.VISTAVEICULO_DELETE);
  canAudit = this.authService.hasPermission(Permission.VISTAVEICULO_READ);

  showAuditModal = false;
  selectedItemForAudit: VistaVeiculo | null = null;

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    const ativoParsed =
      this.filterAtivo === ''
        ? undefined
        : this.filterAtivo === 'true' || this.filterAtivo === '1';

    this.vistaService.getAll(ativoParsed).subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar vistas do veículo';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.vistaService.delete(id);
  }

  protected override getId(item: VistaVeiculo): string {
    return item.id;
  }

  onFilterChange(): void {
    this.items = this.applyFilters(this.allItems);
  }

  clearFilters(): void {
    this.filterDescricao = '';
    this.filterAtivo = '';
    this.items = this.applyFilters(this.allItems);
  }

  onNew(): void {
    this.router.navigate(['/vistas-veiculo/new']);
  }

  onEdit(item: VistaVeiculo): void {
    this.router.navigate(['/vistas-veiculo/edit', item.id]);
  }

  onDelete(item: VistaVeiculo): void {
    this.confirmDelete(item, `Deseja realmente excluir a vista "${item.descricao}"?`);
  }

  openAuditModal(item: VistaVeiculo): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getStatusLabel(item: VistaVeiculo): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  protected loadAllItemsForExport(): Observable<VistaVeiculo[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: VistaVeiculo[]): { headers: string[]; data: string[][] } {
    return {
      headers: ['Descrição', 'Ordem', 'Status'],
      data: items.map((item) => [item.descricao, String(item.ordem), this.getStatusLabel(item)]),
    };
  }

  protected getExportDataPDF(items: VistaVeiculo[]): { headers: string[]; data: string[][] } {
    return {
      headers: ['Descrição', 'Ordem', 'Status'],
      data: items.map((item) => [item.descricao, String(item.ordem), this.getStatusLabel(item)]),
    };
  }

  protected getExportFileName(): string {
    return 'vistas-veiculo';
  }

  protected getTableDisplayName(): string {
    return 'Vistas do veículo';
  }

  private applyFilters(items: VistaVeiculo[]): VistaVeiculo[] {
    const term = this.filterDescricao.trim().toLowerCase();
    const status = this.filterAtivo;

    return items.filter((item) => {
      const matchesDescricao = !term || item.descricao.toLowerCase().includes(term);
      const matchesStatus =
        !status || (status === 'true' ? item.ativo : !item.ativo);
      return matchesDescricao && matchesStatus;
    });
  }
}
