import { Directive, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorModalService } from '../services';
import { AuthService } from '../services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

          // Criar worksheet com cabeçalhos e dados
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
            exportData.headers,
            ...exportData.data
          ]);

          // Auto-ajustar largura das colunas
          const colWidths = exportData.headers.map((header, i) => {
            const maxLength = Math.max(
              header.length,
              ...exportData.data.map(row => String(row[i] || '').length)
            );
            return { wch: Math.min(maxLength + 2, 50) };
          });
          ws['!cols'] = colWidths;

          // Criar workbook e adicionar worksheet
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Dados');

          // Salvar arquivo
          XLSX.writeFile(wb, `${fileName}.xlsx`);
          this.loading = false;
        } catch (error) {
          console.error('Erro ao exportar para Excel:', error);
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

          // Criar documento PDF
          const doc = new jsPDF({
            orientation: exportData.headers.length > 5 ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          // Adicionar título
          doc.setFontSize(16);
          doc.text(`Lista de ${tableName}`, 14, 15);

          // Adicionar tabela
          autoTable(doc, {
            head: [exportData.headers],
            body: exportData.data,
            startY: 25,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            margin: { top: 25, bottom: 15 }
          });

          // Adicionar rodapé em todas as páginas
          const totalPages = (doc as any).internal.getNumberOfPages();
          const dataExportacao = new Date().toLocaleString('pt-BR');
          const currentUser = this.authService.getCurrentUser();
          const userName = currentUser ? currentUser.nome : 'Usuário não identificado';

          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100);
            
            // Rodapé: Exportado em + Usuário
            const footerText = `Exportado em: ${dataExportacao} | Usuário: ${userName}`;
            const textWidth = doc.getTextWidth(footerText);
            const xPosition = (pageWidth - textWidth) / 2; // Centralizar
            
            doc.text(footerText, xPosition, pageHeight - 10);
          }

          // Salvar arquivo
          doc.save(`${fileName}.pdf`);
          this.loading = false;
        } catch (error) {
          console.error('Erro ao exportar para PDF:', error);
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