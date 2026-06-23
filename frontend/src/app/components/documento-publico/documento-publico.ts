import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentoService } from '../../services/documento.service';
import { DocumentoPublicoResumo } from '../../models/documento.model';
import { getFileKindLabel } from '../../utils/documento-file.util';
import { ExcelPreviewTableComponent } from '../excel-preview-table/excel-preview-table';
import {
  DocumentoPreviewResult,
  ExcelPreviewSheet,
  buildDocumentoPreview,
  revokeDocumentoPreview,
} from '../../utils/documento-preview.util';
import {
  buildDocumentoDownloadFileName,
  triggerBlobDownload,
} from '../../utils/documento-file-name.util';

@Component({
  selector: 'app-documento-publico',
  standalone: true,
  imports: [CommonModule, ExcelPreviewTableComponent],
  templateUrl: './documento-publico.html',
  styleUrls: ['./documento-publico.css'],
})
export class DocumentoPublicoComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly documentoService = inject(DocumentoService);
  private readonly sanitizer = inject(DomSanitizer);

  loading = true;
  previewLoading = false;
  error: string | null = null;
  previewError: string | null = null;
  documento: DocumentoPublicoResumo | null = null;
  preview: DocumentoPreviewResult | null = null;
  activeExcelSheetIndex = 0;
  downloading = false;
  private token = '';
  private fileBlob: Blob | null = null;

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!this.token) {
      this.loading = false;
      this.error = 'Link inválido';
      return;
    }
    void this.loadDocumento();
  }

  ngOnDestroy(): void {
    this.clearPreview();
  }

  get fileKindLabel(): string {
    if (!this.documento) {
      return 'ARQ';
    }
    return getFileKindLabel(this.documento.mimeType, this.documento.nomeArquivo);
  }

  get arquivoExibicaoNome(): string {
    if (!this.documento) {
      return '';
    }
    return buildDocumentoDownloadFileName({
      nomeDocumento: this.documento.nomeDocumento,
      tipoDocumento: this.documento.tipoDocumento,
      departamento: this.documento.departamento,
      nomeArquivoOriginal: this.documento.nomeArquivo,
    });
  }

  get previewObjectUrl(): SafeResourceUrl | null {
    if (!this.preview?.objectUrl) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.preview.objectUrl);
  }

  get previewHtml(): SafeHtml | null {
    if (!this.preview?.htmlContent) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(this.preview.htmlContent);
  }

  get activeExcelSheet(): ExcelPreviewSheet | null {
    if (!this.preview?.excelSheets?.length) {
      return null;
    }
    return this.preview.excelSheets[this.activeExcelSheetIndex] ?? this.preview.excelSheets[0];
  }

  selectExcelSheet(index: number): void {
    if (!this.preview?.excelSheets?.length) {
      return;
    }
    const safeIndex = Math.max(0, Math.min(index, this.preview.excelSheets.length - 1));
    this.activeExcelSheetIndex = safeIndex;
  }

  onExcelSheetSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectExcelSheet(Number(select.value));
  }

  private async loadDocumento(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.documento = await firstValueFrom(
        this.documentoService.getPublico(this.token),
      );
      await this.loadPreview();
    } catch (error: unknown) {
      this.documento = null;
      this.clearPreview();
      const status = (error as { status?: number })?.status;
      if (status === 403) {
        this.error = 'Link indisponível ou expirado';
      } else if (status === 404) {
        this.error = 'Documento não encontrado';
      } else if (status === 429) {
        this.error = 'Muitas tentativas. Aguarde e tente novamente.';
      } else {
        this.error = 'Não foi possível carregar o documento';
      }
    } finally {
      this.loading = false;
    }
  }

  private async loadPreview(): Promise<void> {
    if (!this.documento || !this.token) {
      return;
    }

    this.previewLoading = true;
    this.previewError = null;
    this.clearPreview();

    try {
      const blob = await firstValueFrom(
        this.documentoService.downloadPublico(this.token),
      );
      this.fileBlob = blob;
      this.preview = await buildDocumentoPreview(
        blob,
        this.documento.mimeType,
        this.documento.nomeArquivo,
      );
      this.activeExcelSheetIndex = 0;
    } catch {
      this.previewError = 'Não foi possível gerar a pré-visualização. Você ainda pode baixar o arquivo.';
    } finally {
      this.previewLoading = false;
    }
  }

  async download(): Promise<void> {
    if (!this.token || !this.documento) {
      return;
    }

    this.downloading = true;
    try {
      if (this.fileBlob) {
        this.triggerDownload(this.fileBlob);
        return;
      }

      const blob = await firstValueFrom(
        this.documentoService.downloadPublico(this.token),
      );
      this.fileBlob = blob;
      this.triggerDownload(blob);
    } catch {
      this.error = 'Erro ao baixar o arquivo';
    } finally {
      this.downloading = false;
    }
  }

  formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleString('pt-BR');
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private triggerDownload(blob: Blob): void {
    if (!this.documento) {
      return;
    }

    const filename = buildDocumentoDownloadFileName({
      nomeDocumento: this.documento.nomeDocumento,
      tipoDocumento: this.documento.tipoDocumento,
      departamento: this.documento.departamento,
      nomeArquivoOriginal: this.documento.nomeArquivo,
    });
    triggerBlobDownload(blob, filename);
  }

  private clearPreview(): void {
    revokeDocumentoPreview(this.preview);
    this.preview = null;
    this.activeExcelSheetIndex = 0;
  }
}
