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
      // Validação de entrada para mitigar vulnerabilidades do xlsx
      if (!data || !Array.isArray(data.headers) || !Array.isArray(data.data)) {
        throw new Error('Dados inválidos para exportação');
      }

      // Validar e sanitizar headers
      const sanitizedHeaders = data.headers.map((header, index) => {
        if (header === null || header === undefined) {
          return `Coluna ${index + 1}`;
        }
        // Limitar tamanho e remover caracteres perigosos
        return String(header).slice(0, 100).replace(/[<>:"/\\|?*]/g, '');
      });

      // Validar e sanitizar dados
      const sanitizedData = data.data.map((row, rowIndex) => {
        if (!Array.isArray(row)) {
          throw new Error(`Linha ${rowIndex + 1} não é um array válido`);
        }
        return row.map((cell, cellIndex) => {
          if (cell === null || cell === undefined) {
            return '';
          }
          // Converter para string e limitar tamanho para evitar ReDoS
          const cellStr = String(cell);
          if (cellStr.length > 10000) {
            return cellStr.slice(0, 10000) + '...';
          }
          return cellStr;
        });
      });

      // XLSX já é ESM, pode ser importado normalmente
      const XLSX = await import('xlsx');

      // Criar worksheet com cabeçalhos e dados sanitizados
      const ws = XLSX.utils.aoa_to_sheet([
        sanitizedHeaders,
        ...sanitizedData
      ]);

      // Auto-ajustar largura das colunas
      const colWidths = sanitizedHeaders.map((header, i) => {
        const maxLength = Math.max(
          header.length,
          ...sanitizedData.map(row => String(row[i] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });
      ws['!cols'] = colWidths;

      // Criar workbook e adicionar worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');

      // Validar e sanitizar nome do arquivo
      const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '').slice(0, 100) || 'export';

      // Salvar arquivo
      XLSX.writeFile(wb, `${sanitizedFileName}.xlsx`);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      throw new Error('Erro ao exportar para Excel');
    }
  }

  private async performPDFExport(data: ExportData, fileName: string, tableName: string): Promise<void> {
    try {
      // Validação de entrada
      if (!data || !Array.isArray(data.headers) || !Array.isArray(data.data)) {
        throw new Error('Dados inválidos para exportação');
      }

      // Sanitizar tableName para evitar path traversal
      const sanitizedTableName = String(tableName || 'Dados')
        .replace(/[<>:"/\\|?*]/g, '')
        .slice(0, 100);

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

      // jspdf 4.0.0 mantém compatibilidade com internal, mas vamos usar API pública quando possível
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Sanitizar headers e dados
      const sanitizedHeaders = data.headers.map((header, index) => {
        if (header === null || header === undefined) {
          return `Coluna ${index + 1}`;
        }
        return String(header).slice(0, 100);
      });

      const sanitizedData = data.data.map((row) => {
        if (!Array.isArray(row)) {
          return [];
        }
        return row.map((cell) => {
          if (cell === null || cell === undefined) {
            return '';
          }
          return String(cell).slice(0, 500); // Limitar tamanho de células
        });
      });

      // Adicionar título
      doc.setFontSize(16);
      doc.text(`Lista de ${sanitizedTableName}`, 14, 15);

      // Adicionar tabela
      autoTable(doc, {
        head: [sanitizedHeaders],
        body: sanitizedData,
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

      // Sanitizar userName para evitar XSS
      const sanitizedUserName = String(userName).slice(0, 100).replace(/[<>]/g, '');

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);

        // Rodapé: Exportado em + Usuário
        const footerText = `Exportado em: ${dataExportacao} | Usuário: ${sanitizedUserName}`;
        const textWidth = doc.getTextWidth(footerText);
        const xPosition = (pageWidth - textWidth) / 2; // Centralizar

        doc.text(footerText, xPosition, pageHeight - 10);
      }

      // Validar e sanitizar nome do arquivo
      const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]/g, '').slice(0, 100) || 'export';

      // Salvar arquivo
      doc.save(`${sanitizedFileName}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error);
      throw new Error('Erro ao exportar para PDF');
    }
  }
}