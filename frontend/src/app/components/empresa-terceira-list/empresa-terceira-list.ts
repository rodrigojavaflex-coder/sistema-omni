import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { EmpresaTerceira } from '../../models/empresa-terceira.model';
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-empresa-terceira-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './empresa-terceira-list.html',
  styleUrls: ['./empresa-terceira-list.css'],
})
export class EmpresaTerceiraListComponent extends BaseListComponent<EmpresaTerceira> {
  private empresaService = inject(EmpresaTerceiraService);
  private router = inject(Router);

  allItems: EmpresaTerceira[] = [];
  filterDescricao = '';
  canCreate = this.authService.hasPermission(Permission.EMPRESATERCIRA_CREATE);
  canEdit = this.authService.hasPermission(Permission.EMPRESATERCIRA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.EMPRESATERCIRA_DELETE);

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';
    this.empresaService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar empresas';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.empresaService.delete(id);
  }

  protected override getId(item: EmpresaTerceira): string {
    return item.id;
  }

  onFilterChange(): void {
    this.items = this.applyFilters(this.allItems);
  }

  clearFilters(): void {
    this.filterDescricao = '';
    this.items = this.applyFilters(this.allItems);
  }

  onNew(): void {
    this.router.navigate(['/empresa-terceira/new']);
  }

  onEdit(item: EmpresaTerceira): void {
    this.router.navigate(['/empresa-terceira/edit', item.id]);
  }

  onDelete(item: EmpresaTerceira): void {
    this.confirmDelete(item, `Excluir a empresa "${item.descricao}"?`);
  }

  protected loadAllItemsForExport(): Observable<EmpresaTerceira[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(
    items: EmpresaTerceira[],
  ): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição'],
      data: items.map((i) => [i.descricao]),
    };
  }

  protected getExportDataPDF(
    items: EmpresaTerceira[],
  ): { headers: string[]; data: any[][] } {
    return this.getExportDataExcel(items);
  }

  protected getExportFileName(): string {
    return 'empresas-terceiras';
  }

  protected getTableDisplayName(): string {
    return 'Empresas Terceiras';
  }

  private applyFilters(items: EmpresaTerceira[]): EmpresaTerceira[] {
    const term = this.filterDescricao.trim().toLowerCase();
    if (!term) return items;
    return items.filter((i) => i.descricao.toLowerCase().includes(term));
  }
}
