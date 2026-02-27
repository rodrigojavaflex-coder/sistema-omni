import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { Sintoma } from '../../models/sintoma.model';
import { SintomaService } from '../../services/sintoma.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-sintoma-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './sintoma-list.html',
  styleUrls: ['./sintoma-list.css'],
})
export class SintomaListComponent extends BaseListComponent<Sintoma> {
  private sintomaService = inject(SintomaService);
  private router = inject(Router);

  allItems: Sintoma[] = [];
  filterDescricao = '';
  filterAtivo = '';

  canCreate = this.authService.hasPermission(Permission.SINTOMA_CREATE);
  canEdit = this.authService.hasPermission(Permission.SINTOMA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.SINTOMA_DELETE);
  canAudit = this.authService.hasPermission(Permission.SINTOMA_READ);

  showAuditModal = false;
  selectedItemForAudit: Sintoma | null = null;

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    const ativoParsed =
      this.filterAtivo === ''
        ? undefined
        : this.filterAtivo === 'true' || this.filterAtivo === '1';

    this.sintomaService.getAll(ativoParsed).subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar sintomas';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.sintomaService.delete(id);
  }

  protected override getId(item: Sintoma): string {
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
    this.router.navigate(['/sintomas/new']);
  }

  onEdit(item: Sintoma): void {
    this.router.navigate(['/sintomas/edit', item.id]);
  }

  onDelete(item: Sintoma): void {
    this.confirmDelete(item, `Deseja realmente excluir o sintoma "${item.descricao}"?`);
  }

  openAuditModal(item: Sintoma): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  getStatusLabel(item: Sintoma): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  protected loadAllItemsForExport(): Observable<Sintoma[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: Sintoma[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição', 'Status'],
      data: items.map((item) => [item.descricao, this.getStatusLabel(item)]),
    };
  }

  protected getExportDataPDF(items: Sintoma[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição', 'Status'],
      data: items.map((item) => [item.descricao, this.getStatusLabel(item)]),
    };
  }

  protected getExportFileName(): string {
    return 'sintomas';
  }

  protected getTableDisplayName(): string {
    return 'Sintomas';
  }

  private applyFilters(items: Sintoma[]): Sintoma[] {
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
