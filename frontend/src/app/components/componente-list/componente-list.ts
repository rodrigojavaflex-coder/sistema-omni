import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { Componente } from '../../models/componente.model';
import { ComponenteService } from '../../services/componente.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-componente-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './componente-list.html',
  styleUrls: ['./componente-list.css'],
})
export class ComponenteListComponent extends BaseListComponent<Componente> {
  private componenteService = inject(ComponenteService);
  private router = inject(Router);

  allItems: Componente[] = [];
  filterNome = '';
  filterAtivo = '';

  canCreate = this.authService.hasPermission(Permission.COMPONENTE_CREATE);
  canEdit = this.authService.hasPermission(Permission.COMPONENTE_UPDATE);
  canDelete = this.authService.hasPermission(Permission.COMPONENTE_DELETE);
  canAudit = this.authService.hasPermission(Permission.COMPONENTE_READ);

  showAuditModal = false;
  selectedItemForAudit: Componente | null = null;

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    const ativoParsed =
      this.filterAtivo === ''
        ? undefined
        : this.filterAtivo === 'true' || this.filterAtivo === '1';

    this.componenteService.getAll(ativoParsed).subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar componentes';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.componenteService.delete(id);
  }

  protected override getId(item: Componente): string {
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
    this.router.navigate(['/componentes/new']);
  }

  onEdit(item: Componente): void {
    this.router.navigate(['/componentes/edit', item.id]);
  }

  onDelete(item: Componente): void {
    this.confirmDelete(item, `Deseja realmente excluir o componente "${item.nome}"?`);
  }

  openAuditModal(item: Componente): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getStatusLabel(item: Componente): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  protected loadAllItemsForExport(): Observable<Componente[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: Componente[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Nome', 'Status'],
      data: items.map((item) => [item.nome, this.getStatusLabel(item)]),
    };
  }

  protected getExportDataPDF(items: Componente[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Nome', 'Status'],
      data: items.map((item) => [item.nome, this.getStatusLabel(item)]),
    };
  }

  protected getExportFileName(): string {
    return 'componentes';
  }

  protected getTableDisplayName(): string {
    return 'Componentes';
  }

  private applyFilters(items: Componente[]): Componente[] {
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
