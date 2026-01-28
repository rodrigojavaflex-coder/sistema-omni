import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { TipoVistoria } from '../../models/tipo-vistoria.model';
import { TipoVistoriaService } from '../../services/tipo-vistoria.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-tipo-vistoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './tipo-vistoria-list.html',
  styleUrls: ['./tipo-vistoria-list.css'],
})
export class TipoVistoriaListComponent extends BaseListComponent<TipoVistoria> {
  private tipoVistoriaService = inject(TipoVistoriaService);
  private router = inject(Router);

  allItems: TipoVistoria[] = [];

  filterDescricao = '';
  filterAtivo = '';

  canCreate = this.authService.hasPermission(Permission.TIPOVISTORIA_CREATE);
  canEdit = this.authService.hasPermission(Permission.TIPOVISTORIA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.TIPOVISTORIA_DELETE);
  canAudit = this.authService.hasPermission(Permission.TIPOVISTORIA_AUDIT);

  showAuditModal = false;
  selectedItemForAudit: TipoVistoria | null = null;

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    this.tipoVistoriaService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar tipos de vistoria';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.tipoVistoriaService.delete(id);
  }

  protected override getId(item: TipoVistoria): string {
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
    this.router.navigate(['/tipo-vistoria/new']);
  }

  onEdit(item: TipoVistoria): void {
    this.router.navigate(['/tipo-vistoria/edit', item.id]);
  }

  onDelete(item: TipoVistoria): void {
    this.confirmDelete(item, `Deseja realmente excluir o tipo "${item.descricao}"?`);
  }

  openAuditModal(item: TipoVistoria): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getStatusLabel(item: TipoVistoria): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  protected loadAllItemsForExport(): Observable<TipoVistoria[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: TipoVistoria[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição', 'Status'],
      data: items.map((item) => [item.descricao, this.getStatusLabel(item)]),
    };
  }

  protected getExportDataPDF(items: TipoVistoria[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição', 'Status'],
      data: items.map((item) => [item.descricao, this.getStatusLabel(item)]),
    };
  }

  protected getExportFileName(): string {
    return 'tipos-vistoria';
  }

  protected getTableDisplayName(): string {
    return 'Tipos de Vistoria';
  }

  private applyFilters(items: TipoVistoria[]): TipoVistoria[] {
    const term = this.filterDescricao.trim().toLowerCase();
    const status = this.filterAtivo;

    return items.filter((item) => {
      const matchesDescricao =
        !term || item.descricao.toLowerCase().includes(term);
      const matchesStatus =
        !status || (status === 'true' ? item.ativo : !item.ativo);

      return matchesDescricao && matchesStatus;
    });
  }
}
