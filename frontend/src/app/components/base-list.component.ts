import { Directive, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorModalService } from '../services';
import { AuthService } from '../services/auth.service';
import { ExportService, ExportData } from '../services/export.service';

/**
 * Componente base genérico para listagens com suporte a carregamento, erros, modal de exclusão e exportação.
 * Os componentes concretos devem implementar loadItems(), deleteItem(id), getId(item), getExportData() e getExportFileName().
 */
@Directive()
export abstract class BaseListComponent<T> implements OnInit {
  items: T[] = [];
  loading = false;
  error = '';
  showDeleteModal = false;
  itemToDelete: T | null = null;
  deleteModalMessage = '';

  // Serviço de modal de erro injetado uma única vez
  protected errorModalService = inject(ErrorModalService);
  protected authService = inject(AuthService);
  protected exportService = inject(ExportService);

  ngOnInit(): void {
    this.loadItems();
  }

  /** Carrega a lista de itens */
  protected abstract loadItems(): void;
  /** Executa a exclusão de um item pelo ID */
  protected abstract deleteItem(id: string): Observable<any>;
  /** Retorna o identificador de um item */
  protected abstract getId(item: T): string;
  
  /** Carrega todos os itens para exportação (com filtros aplicados, sem paginação) */
  protected abstract loadAllItemsForExport(): Observable<T[]>;
  
  /** Retorna os dados para exportação em Excel (pode ser diferente do PDF) */
  protected abstract getExportDataExcel(items: T[]): { headers: string[], data: any[][] };

  /** Retorna os dados para exportação em PDF (pode ser diferente do Excel) */
  protected abstract getExportDataPDF(items: T[]): { headers: string[], data: any[][] };
  
  /** Retorna o nome base do arquivo para exportação (sem extensão) */
  protected abstract getExportFileName(): string;
  
  /** Retorna o nome da tabela para o título do PDF */
  protected abstract getTableDisplayName(): string;

  /** Abre modal de confirmação de exclusão */
  confirmDelete(item: T, message: string): void {
    this.itemToDelete = item;
    this.deleteModalMessage = message;
    this.showDeleteModal = true;
  }

  /** Confirmação e chamada ao serviço de exclusão */
  onDeleteConfirmed(): void {
    if (!this.itemToDelete) return;
    this.deleteItem(this.getId(this.itemToDelete))
      .pipe(
        finalize(() => this.closeDeleteModal())
      )
      .subscribe({
        next: () => this.loadItems(),
        error: (err: HttpErrorResponse) => {
          const serverMsg = err.error?.message || 'Erro ao excluir';
          this.errorModalService.show(serverMsg);
        }
      });
  }

  /** Cancela exclusão e fecha modal */
  onDeleteCancelled(): void {
    this.closeDeleteModal();
  }

  private closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  /** Exporta os dados para Excel (.xlsx) */
  exportToExcel(): void {
    this.loading = true;
    this.loadAllItemsForExport().subscribe({
      next: (allItems) => {
        try {
          const exportData = this.getExportDataExcel(allItems);
          const fileName = this.getExportFileName();

          this.exportService.exportToExcel(exportData, fileName).subscribe({
            next: () => {
              this.loading = false;
            },
            error: (error) => {
              console.error('Erro ao exportar para Excel:', error);
              this.errorModalService.show('Erro ao exportar para Excel');
              this.loading = false;
            }
          });
        } catch (error) {
          console.error('Erro ao preparar dados para Excel:', error);
          this.errorModalService.show('Erro ao exportar para Excel');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados para exportação:', error);
        this.errorModalService.show('Erro ao carregar dados para exportação');
        this.loading = false;
      }
    });
  }

  /** Exporta os dados para PDF */
  exportToPDF(): void {
    this.loading = true;
    this.loadAllItemsForExport().subscribe({
      next: (allItems) => {
        try {
          const exportData = this.getExportDataPDF(allItems);
          const fileName = this.getExportFileName();
          const tableName = this.getTableDisplayName();

          this.exportService.exportToPDF(exportData, fileName, tableName).subscribe({
            next: () => {
              this.loading = false;
            },
            error: (error) => {
              console.error('Erro ao exportar para PDF:', error);
              this.errorModalService.show('Erro ao exportar para PDF');
              this.loading = false;
            }
          });
        } catch (error) {
          console.error('Erro ao preparar dados para PDF:', error);
          this.errorModalService.show('Erro ao exportar para PDF');
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar dados para exportação:', error);
        this.errorModalService.show('Erro ao carregar dados para exportação');
        this.loading = false;
      }
    });
  }
}