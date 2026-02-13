import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { CategoriaOcorrencia } from '../../models/categoria-ocorrencia.model';
import { CategoriaOcorrenciaService } from '../../services/categoria-ocorrencia.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-categoria-ocorrencia-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './categoria-ocorrencia-list.html',
  styleUrls: ['./categoria-ocorrencia-list.css'],
})
export class CategoriaOcorrenciaListComponent extends BaseListComponent<CategoriaOcorrencia> {
  private categoriaService = inject(CategoriaOcorrenciaService);
  private router = inject(Router);

  allItems: CategoriaOcorrencia[] = [];
  filterDescricao = '';
  canCreate = this.authService.hasPermission(Permission.CATEGORIAOCORRENCIA_CREATE);
  canEdit = this.authService.hasPermission(Permission.CATEGORIAOCORRENCIA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.CATEGORIAOCORRENCIA_DELETE);

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';
    this.categoriaService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar categorias';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.categoriaService.delete(id);
  }

  protected override getId(item: CategoriaOcorrencia): string {
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
    this.router.navigate(['/categoria-ocorrencia/new']);
  }

  onEdit(item: CategoriaOcorrencia): void {
    this.router.navigate(['/categoria-ocorrencia/edit', item.id]);
  }

  onDelete(item: CategoriaOcorrencia): void {
    this.confirmDelete(item, `Excluir a categoria "${item.descricao}"?`);
  }

  getOrigemDescricao(item: CategoriaOcorrencia): string {
    return item.origem?.descricao ?? '-';
  }

  protected loadAllItemsForExport(): Observable<CategoriaOcorrencia[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(
    items: CategoriaOcorrencia[],
  ): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição', 'Origem', 'Responsável'],
      data: items.map((i) => [
        i.descricao,
        this.getOrigemDescricao(i),
        i.responsavel ?? '',
      ]),
    };
  }

  protected getExportDataPDF(
    items: CategoriaOcorrencia[],
  ): { headers: string[]; data: any[][] } {
    return this.getExportDataExcel(items);
  }

  protected getExportFileName(): string {
    return 'categorias-ocorrencia';
  }

  protected getTableDisplayName(): string {
    return 'Categoria da Ocorrência';
  }

  private applyFilters(items: CategoriaOcorrencia[]): CategoriaOcorrencia[] {
    const term = this.filterDescricao.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (i) =>
        i.descricao.toLowerCase().includes(term) ||
        (i.origem?.descricao?.toLowerCase().includes(term) ?? false),
    );
  }
}
