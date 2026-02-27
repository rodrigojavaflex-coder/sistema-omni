import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AuthService } from './auth.service';

export interface ExportData {
  headers: string[];
  data: any[][];
  /** Texto opcional exibido no topo do PDF (ex.: mapa da área) */
  headerContent?: string;
  /** URL da logo (cadastro de configuração) para relatório tipo mapa; exibida à esquerda do título */
  logoUrl?: string;
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
      if (!data || !Array.isArray(data.headers) || !Array.isArray(data.data)) {
        throw new Error('Dados inválidos para exportação');
      }

      const sanitizedTableName = String(tableName || 'Dados')
        .replace(/[<>:"/\\|?*]/g, '')
        .slice(0, 100);

      const hasMapOnly = data.headerContent && String(data.headerContent).trim() &&
        data.headers.length === 0 && data.data.length === 0;

      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ]);

      const doc = new jsPDF({
        orientation: hasMapOnly ? 'portrait' : (data.headers.length > 5 ? 'landscape' : 'portrait'),
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const maxWidth = pageWidth - margin * 2;

      const titleText = hasMapOnly ? sanitizedTableName : `Lista de ${sanitizedTableName}`;

      let logoDrawn = false;
      let logoW = 38;
      let logoH = 25;
      if (hasMapOnly && data.logoUrl) {
        try {
          const logoData = await this.loadImageAsDataUrl(data.logoUrl);
          if (logoData) {
            doc.addImage(logoData.dataUrl, logoData.format || 'PNG', margin, 10, logoW, logoH);
            logoDrawn = true;
          }
        } catch {
          // Ignora falha ao carregar logo
        }
      }

      doc.setFontSize(logoDrawn ? 22 : 16);
      const titleWidth = doc.getTextWidth(titleText);
      const titleX = logoDrawn
        ? (margin + logoW + (pageWidth - margin)) / 2 - titleWidth / 2
        : (pageWidth - titleWidth) / 2;
      const titleY = logoDrawn ? 10 + logoH / 2 + 4 : 15;
      doc.text(titleText, titleX, titleY);

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
          return String(cell).slice(0, 500);
        });
      });

      if (hasMapOnly && data.headerContent) {
        const mapStartY = logoDrawn ? 42 : 22;
        this.drawMapContentInPDF(doc, String(data.headerContent).slice(0, 8000), margin, mapStartY, maxWidth, pageHeight);
      } else {
        let tableStartY = 25;
        if (data.headerContent && String(data.headerContent).trim()) {
          doc.setFontSize(9);
          const lines = doc.splitTextToSize(String(data.headerContent).slice(0, 8000), maxWidth);
          const contentHeight = lines.length * 5;
          doc.text(lines, margin, 22);
          tableStartY = 22 + contentHeight + 6;
        }
        if (sanitizedHeaders.length > 0 || sanitizedData.length > 0) {
          autoTable(doc, {
            head: sanitizedHeaders.length ? [sanitizedHeaders] : undefined,
            body: sanitizedData.length ? sanitizedData : [],
            startY: tableStartY,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            margin: { top: tableStartY, bottom: 15 }
          });
        }
      }

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

  private async loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; format: string } | null> {
    if (!url || !url.startsWith('http')) return null;
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return null;
    const blob = await res.blob();
    const mime = blob.type || 'image/png';
    const format = mime.includes('png') ? 'PNG' : mime.includes('jpeg') || mime.includes('jpg') ? 'JPEG' : 'PNG';
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result as string, format });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Desenha o mapa das áreas no PDF com formatação tipo card e cor apenas no nome da gravidade.
   */
  private drawMapContentInPDF(
    doc: import('jspdf').jsPDF,
    content: string,
    margin: number,
    startY: number,
    maxWidth: number,
    pageHeight: number
  ): void {
    const lineHeight = 5;
    const cardPadding = 2;
    const footerMargin = 18;
    let y = startY;

    const gravidadeColors: Record<string, [number, number, number]> = {
      VERDE: [34, 197, 94],
      AMARELO: [234, 179, 8],
      VERMELHO: [239, 68, 68],
    };

    const drawLineWithGravidadeColor = (line: string, x: number, lineY: number): void => {
      const gravidadeMatch = line.match(/\b(VERDE|AMARELO|VERMELHO)\b/);
      if (!gravidadeMatch || !gravidadeColors[gravidadeMatch[1]]) {
        doc.setTextColor(0, 0, 0);
        doc.text(line, x, lineY);
        return;
      }
      const word = gravidadeMatch[1];
      const before = line.substring(0, gravidadeMatch.index);
      const after = line.substring(gravidadeMatch.index! + word.length);
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(before, x, lineY);
      let currentX = x + doc.getTextWidth(before);
      doc.setTextColor(gravidadeColors[word][0], gravidadeColors[word][1], gravidadeColors[word][2]);
      doc.text(word, currentX, lineY);
      currentX += doc.getTextWidth(word);
      doc.setTextColor(0, 0, 0);
      doc.text(after, currentX, lineY);
    };

    const lines = content.split(/\r?\n/).filter((l) => l !== undefined);

    // Bloco especial: caixa de filtros aplicados (primeira linha)
    let startIndex = 0;
    if (lines.length >= 1 && lines[0].startsWith('Filtros aplicados:')) {
      let boxY = y;
      const paddingX = 2;
      const paddingY = 2;
      const lineHeightFilter = 4;
      const prefix = 'Filtros aplicados:';
      const fullLine = lines[0];
      const rest = fullLine.replace(prefix, '').trimStart();

      doc.setFontSize(7);
      const availableWidth = maxWidth - paddingX * 2 - cardPadding * 2;
      const fullText = rest ? `${prefix} ${rest}` : prefix;
      const wrappedFilters = doc.splitTextToSize(fullText, availableWidth);
      const boxHeight = wrappedFilters.length * lineHeightFilter + paddingY * 2;

      if (boxY + boxHeight > pageHeight - footerMargin) {
        doc.addPage();
        boxY = margin + 5;
        y = boxY;
      }

      // Caixa com bordas levemente arredondadas
      doc.setDrawColor(200, 200, 200);
      (doc as any).roundedRect
        ? (doc as any).roundedRect(margin, boxY, maxWidth, boxHeight, 2, 2, 'S')
        : doc.rect(margin, boxY, maxWidth, boxHeight, 'S');

      let textY = boxY + paddingY + lineHeightFilter;
      const textX = margin + cardPadding + paddingX;

      // Desenhar linhas, mantendo "Filtros aplicados:" em negrito no começo
      wrappedFilters.forEach((wrapped: string, index: number) => {
        if (index === 0 && wrapped.startsWith(prefix)) {
          const afterPrefix = wrapped.substring(prefix.length).trimStart();
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(prefix, textX, textY);
          const prefixWidth = doc.getTextWidth(prefix + ' ');
          doc.setFont('helvetica', 'normal');
          if (afterPrefix) {
            doc.text(afterPrefix, textX + prefixWidth, textY);
          }
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(wrapped, textX, textY);
        }
        textY += lineHeightFilter;
      });

      // Espaçamento entre a caixa de filtros e a primeira área
      y = boxY + boxHeight + 5;
      startIndex = 2; // pula a linha de filtros e a linha em branco logo após
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      if (y > pageHeight - footerMargin) {
        doc.addPage();
        y = margin + 5;
      }

      const isAreaHeader = /^\d+\.\s+\S/.test(line);

      if (isAreaHeader) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        const areaLines = doc.splitTextToSize(line, maxWidth);
        areaLines.forEach((l: string) => {
          doc.text(l, margin + cardPadding, y);
          y += lineHeight;
        });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        y += 2;
        continue;
      }

      doc.setFontSize(9);
      const semMatriz = line.includes('(sem matriz configurada)');
      const wrapLines = doc.splitTextToSize(line, maxWidth);
      if (semMatriz) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(180, 80, 0);
      }
      wrapLines.forEach((wrappedLine: string) => {
        if (y > pageHeight - footerMargin) {
          doc.addPage();
          y = margin + 5;
        }
        if (semMatriz) {
          doc.text(wrappedLine, margin + cardPadding, y);
        } else {
          drawLineWithGravidadeColor(wrappedLine, margin + cardPadding, y);
        }
        y += lineHeight;
      });
      if (semMatriz) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
      }
      y += lineHeight * 0.2;
    }
  }
}