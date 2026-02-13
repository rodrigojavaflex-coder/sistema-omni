import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { OrigemOcorrencia } from '../../models/origem-ocorrencia.model';
import { OrigemOcorrenciaService } from '../../services/origem-ocorrencia.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-origem-ocorrencia-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './origem-ocorrencia-list.html',
  styleUrls: ['./origem-ocorrencia-list.css'],
})
export class OrigemOcorrenciaListComponent extends BaseListComponent<OrigemOcorrencia> {
  private origemService = inject(OrigemOcorrenciaService);
  private router = inject(Router);

  allItems: OrigemOcorrencia[] = [];
  filterDescricao = '';
  canCreate = this.authService.hasPermission(Permission.ORIGEMOCORRENCIA_CREATE);
  canEdit = this.authService.hasPermission(Permission.ORIGEMOCORRENCIA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.ORIGEMOCORRENCIA_DELETE);

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';
    this.origemService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar origens';
        this.loading = false;
      },
    });
  }

  protected override deleteItem(id: string) {
    return this.origemService.delete(id);
  }

  protected override getId(item: OrigemOcorrencia): string {
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
    this.router.navigate(['/origem-ocorrencia/new']);
  }

  onEdit(item: OrigemOcorrencia): void {
    this.router.navigate(['/origem-ocorrencia/edit', item.id]);
  }

  onDelete(item: OrigemOcorrencia): void {
    this.confirmDelete(item, `Excluir a origem "${item.descricao}"?`);
  }

  protected loadAllItemsForExport(): Observable<OrigemOcorrencia[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(
    items: OrigemOcorrencia[],
  ): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição'],
      data: items.map((i) => [i.descricao]),
    };
  }

  protected getExportDataPDF(
    items: OrigemOcorrencia[],
  ): { headers: string[]; data: any[][] } {
    return this.getExportDataExcel(items);
  }

  protected getExportFileName(): string {
    return 'origens-ocorrencia';
  }

  protected getTableDisplayName(): string {
    return 'Origem da Ocorrência';
  }

  private applyFilters(items: OrigemOcorrencia[]): OrigemOcorrencia[] {
    const term = this.filterDescricao.trim().toLowerCase();
    if (!term) return items;
    return items.filter((i) => i.descricao.toLowerCase().includes(term));
  }
}
