import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';

export interface ExportData {
  headers: string[];
  data: any[][];
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private authService = inject(AuthService);

  /**
   * Exporta dados para Excel usando XLSX (já é ESM)
   */
  exportToExcel(data: ExportData, fileName: string): Observable<void> {
    return from(this.performExcelExport(data, fileName));
  }

  /**
   * Exporta dados para PDF usando lazy loading do jsPDF
   */
  exportToPDF(data: ExportData, fileName: string, tableName: string): Observable<void> {
    return from(this.performPDFExport(data, fileName, tableName));
  }

  private async performExcelExport(data: ExportData, fileName: string): Promise<void> {
    try {
      // XLSX já é ESM, pode ser importado normalmente
      const XLSX = await import('xlsx');

      // Criar worksheet com cabeçalhos e dados
      const ws = XLSX.utils.aoa_to_sheet([
        data.headers,
        ...data.data
      ]);

      // Auto-ajustar largura das colunas
      const colWidths = data.headers.map((header, i) => {
        const maxLength = Math.max(
          header.length,
          ...data.data.map(row => String(row[i] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      // Criar workbook e adicionar worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');

      // Salvar arquivo
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      throw new Error('Erro ao exportar para Excel');
    }
  }

  private async performPDFExport(data: ExportData, fileName: string, tableName: string): Promise<void> {
    try {
      // Lazy loading das bibliotecas pesadas apenas quando necessário
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ]);

      // Criar documento PDF
      const doc = new jsPDF({
        orientation: data.headers.length > 5 ? 'landscape' : 'portrait',
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
        head: [data.headers],
        body: data.data,
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
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      throw new Error('Erro ao exportar para PDF');
    }
  }
}