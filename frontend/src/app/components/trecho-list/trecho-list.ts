import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { Trecho } from '../../models/trecho.model';
import { TrechoService } from '../../services/trecho.service';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-trecho-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ConfirmationModalComponent as any
  ],
  templateUrl: './trecho-list.html',
  styleUrls: ['./trecho-list.css']
})
export class TrechoListComponent extends BaseListComponent<Trecho> {
  private trechoService = inject(TrechoService);
  private router = inject(Router);

  // Filtros
  filterDescricao = '';
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // Controle de debounce para pesquisa
  private filterTimeout: any;

  // Permissões
  canCreate = this.authService.hasPermission(Permission.TRECHO_CREATE);
  canEdit = this.authService.hasPermission(Permission.TRECHO_UPDATE);
  canDelete = this.authService.hasPermission(Permission.TRECHO_DELETE);

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';

    this.trechoService.getAll(
      this.currentPage, 
      this.pageSize, 
      this.filterDescricao || undefined
    ).subscribe({
      next: (response) => {
        this.items = response.data;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar trechos';
        this.loading = false;
        console.error('Erro ao carregar trechos:', err);
      }
    });
  }

  protected override deleteItem(id: string) {
    return this.trechoService.delete(id);
  }

  protected override getId(item: Trecho): string {
    return item.id;
  }

  protected override loadAllItemsForExport(): Observable<Trecho[]> {
    // Carrega todos os itens sem paginação para exportação
    return new Observable(observer => {
      this.trechoService.getAll(1, 999999, this.filterDescricao || undefined).subscribe({
        next: (response) => {
          observer.next(response.data);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  protected override getExportDataExcel(items: Trecho[]): { headers: string[], data: any[][] } {
    const headers = ['Descrição', 'Data de Criação'];
    const data = items.map(item => [
      item.descricao,
      this.formatDate(item.criadoEm)
    ]);
    return { headers, data };
  }

  protected override getExportDataPDF(items: Trecho[]): { headers: string[], data: any[][] } {
    return this.getExportDataExcel(items);
  }

  protected override getExportFileName(): string {
    return 'trechos';
  }

  protected override getTableDisplayName(): string {
    return 'Trechos';
  }

  onFilterChange(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    
    this.filterTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadItems();
    }, 500);
  }

  clearFilters(): void {
    this.filterDescricao = '';
    this.currentPage = 1;
    this.loadItems();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadItems();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadItems();
  }

  onNew(): void {
    this.router.navigate(['/trechos/new']);
  }

  onEdit(item: Trecho): void {
    this.router.navigate(['/trechos/edit', item.id]);
  }

  onDelete(item: Trecho): void {
    this.confirmDelete(item, `Deseja realmente excluir o trecho "${item.descricao}"?`);
  }

  formatDate(date: string): string {
    if (!date) return '-';
    const dateParts = date.split('T')[0].split('-');
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  }
}
