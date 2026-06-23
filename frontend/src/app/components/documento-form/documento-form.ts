import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  DOCUMENTO_MAX_FILE_SIZE_BYTES,
  DocumentoResumo,
  STATUS_DOCUMENTO_LABELS,
  StatusDocumento,
  UpdateDocumentoPayload,
} from '../../models/documento.model';
import { DocumentoService } from '../../services/documento.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { DepartamentoService } from '../../services/departamento.service';
import { TipoDocumento } from '../../models/tipo-documento.model';
import { Departamento } from '../../models/departamento.model';
import { UsuarioAutocompleteComponent } from '../shared/usuario-autocomplete/usuario-autocomplete.component';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';
import { copyTextToClipboard } from '../../utils/clipboard.util';
import {
  buildDocumentoDownloadFileName,
  triggerBlobDownload,
} from '../../utils/documento-file-name.util';

@Component({
  selector: 'app-documento-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UsuarioAutocompleteComponent,
  ],
  templateUrl: './documento-form.html',
  styleUrls: ['./documento-form.css'],
})
export class DocumentoFormComponent
  extends BaseFormComponent<UpdateDocumentoPayload>
  implements OnInit, OnDestroy
{
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly documentoService = inject(DocumentoService);
  private readonly tipoDocumentoService = inject(TipoDocumentoService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  readonly statusLabels = STATUS_DOCUMENTO_LABELS;
  readonly statusOptions = Object.values(StatusDocumento);
  readonly maxFileSizeLabel = '25 MB';

  tiposDocumento: TipoDocumento[] = [];
  departamentos: Departamento[] = [];
  documentoAtual: DocumentoResumo | null = null;

  selectedFile: File | null = null;
  selectedFileName = '';
  selectedFilePreviewUrl: string | null = null;
  arquivoAtual = '';
  arquivoAtualMimeType = '';
  compartilhamentoExpiraEm = '';
  publicLink = '';
  sharingLoading = false;
  copyFeedback = false;
  downloadingArquivo = false;

  canCompartilhar = false;
  canReplaceFile = true;

  /** Arquivo já enviado (edição) ou selecionado no input (novo cadastro). */
  get hasArquivoParaCompartilhar(): boolean {
    return !!this.selectedFile || (!!this.editMode && !!this.arquivoAtual);
  }

  get compartilhamentoDisponivel(): boolean {
    return (
      this.canCompartilhar &&
      this.hasArquivoParaCompartilhar &&
      this.form.get('status')?.value === StatusDocumento.ATIVO
    );
  }

  constructor(router: Router) {
    super(router);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    this.canCompartilhar = this.authService.hasPermission(
      Permission.DOCUMENTO_COMPARTILHAR,
    );
    void this.loadLookups();
    super.ngOnInit();
  }

  override ngOnDestroy(): void {
    this.revokePreviewUrl();
    super.ngOnDestroy();
  }

  private async loadLookups(): Promise<void> {
    try {
      const [tipos, departamentos] = await Promise.all([
        firstValueFrom(this.tipoDocumentoService.getAll(undefined, true)),
        firstValueFrom(this.departamentoService.getAll()),
      ]);
      this.tiposDocumento = tipos;
      this.departamentos = departamentos;
    } catch {
      this.handleError(null, 'Erro ao carregar listas auxiliares');
    }
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nomeDocumento: ['', [Validators.required, Validators.maxLength(300)]],
      detalhesDocumento: ['', [Validators.maxLength(2000)]],
      tipoDocumentoId: ['', [Validators.required]],
      departamentoId: ['', [Validators.required]],
      responsavelId: ['', [Validators.required]],
      status: [StatusDocumento.ATIVO, [Validators.required]],
    });
  }

  protected buildFormData(): UpdateDocumentoPayload {
    const detalhes = this.form.value.detalhesDocumento?.trim() ?? '';
    return {
      nomeDocumento: this.form.value.nomeDocumento,
      detalhesDocumento: detalhes.length > 0 ? detalhes : null,
      tipoDocumentoId: this.form.value.tipoDocumentoId,
      departamentoId: this.form.value.departamentoId,
      responsavelId: this.form.value.responsavelId,
      status: this.form.value.status,
    };
  }

  protected async saveEntity(data: UpdateDocumentoPayload): Promise<void> {
    await this.createDocument(data);
  }

  private async createDocument(
    data: UpdateDocumentoPayload,
  ): Promise<DocumentoResumo> {
    if (!this.selectedFile) {
      this.notificationService.warning('Selecione um arquivo para upload');
      throw new Error('Arquivo obrigatório');
    }
    if (this.selectedFile.size > DOCUMENTO_MAX_FILE_SIZE_BYTES) {
      this.notificationService.warning('Arquivo excede o limite de 25 MB');
      throw new Error('Arquivo grande demais');
    }

    return firstValueFrom(
      this.documentoService.create({
        nomeDocumento: data.nomeDocumento ?? this.form.value.nomeDocumento,
        detalhesDocumento:
          data.detalhesDocumento ?? this.form.value.detalhesDocumento ?? undefined,
        tipoDocumentoId: data.tipoDocumentoId ?? this.form.value.tipoDocumentoId,
        departamentoId: data.departamentoId ?? this.form.value.departamentoId,
        responsavelId: data.responsavelId ?? this.form.value.responsavelId,
        status: data.status ?? this.form.value.status,
        arquivo: this.selectedFile,
      }),
    );
  }

  /** Garante documento persistido antes de ativar/regenerar/desativar link. */
  private async ensureDocumentSaved(): Promise<string> {
    if (this.entityId) {
      return this.entityId;
    }

    this.submitted = true;
    if (this.form.invalid) {
      this.markAllAsTouched();
      this.showValidationError();
      throw new Error('Formulário inválido');
    }

    const created = await this.createDocument(this.buildFormData());
    this.entityId = created.id;
    this.editMode = true;
    this.documentoAtual = created;
    this.arquivoAtual = created.nomeArquivo;
    this.arquivoAtualMimeType = created.mimeType;
    this.clearSelectedFile();
    this.router.navigate(['/documento/edit', created.id], { replaceUrl: true });
    return created.id;
  }

  protected async updateEntity(
    id: string,
    data: UpdateDocumentoPayload,
  ): Promise<void> {
    await firstValueFrom(this.documentoService.update(id, data));
    if (this.selectedFile) {
      if (this.selectedFile.size > DOCUMENTO_MAX_FILE_SIZE_BYTES) {
        this.notificationService.warning('Arquivo excede o limite de 25 MB');
        throw new Error('Arquivo grande demais');
      }
      await firstValueFrom(
        this.documentoService.replaceArquivo(id, this.selectedFile),
      );
    }
  }

  protected async loadEntityById(id: string): Promise<void> {
    const documento = await firstValueFrom(this.documentoService.getById(id));
    this.documentoAtual = documento;
    this.arquivoAtual = documento.nomeArquivo;
    this.arquivoAtualMimeType = documento.mimeType;
    this.syncPublicLink(documento);
    this.compartilhamentoExpiraEm = documento.compartilhamentoExpiraEm
      ? documento.compartilhamentoExpiraEm.slice(0, 16)
      : '';

    this.canReplaceFile =
      documento.status !== StatusDocumento.OBSOLETO &&
      documento.status !== StatusDocumento.ARQUIVADO;

    this.form.patchValue({
      nomeDocumento: documento.nomeDocumento,
      detalhesDocumento: documento.detalhesDocumento ?? '',
      tipoDocumentoId: documento.tipoDocumento.id,
      departamentoId: documento.departamento.id,
      responsavelId: documento.responsavel.id,
      status: documento.status,
    });

    if (!this.canReplaceFile) {
      this.form.disable();
      this.form.get('status')?.enable();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) {
      return;
    }
    if (file.size > DOCUMENTO_MAX_FILE_SIZE_BYTES) {
      this.notificationService.warning('Arquivo excede o limite de 25 MB');
      input.value = '';
      return;
    }
    this.setSelectedFile(file);
  }

  openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  removeSelectedFile(): void {
    this.clearSelectedFile();
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  getFileKindLabel(mimeType: string, fileName?: string): string {
    const mime = mimeType.toLowerCase();
    if (mime.includes('pdf')) return 'PDF';
    if (mime.includes('word') || mime.includes('msword')) return 'DOC';
    if (mime.includes('sheet') || mime.includes('excel')) return 'XLS';
    if (mime.startsWith('image/')) return 'IMG';
    const ext = fileName?.split('.').pop()?.toUpperCase();
    return ext && ext.length <= 5 ? ext : 'ARQ';
  }

  isImageMime(mimeType: string): boolean {
    return mimeType.toLowerCase().startsWith('image/');
  }

  private setSelectedFile(file: File): void {
    this.revokePreviewUrl();
    this.selectedFile = file;
    this.selectedFileName = file.name;
    if (this.isImageMime(file.type)) {
      this.selectedFilePreviewUrl = URL.createObjectURL(file);
    }
  }

  private clearSelectedFile(): void {
    this.revokePreviewUrl();
    this.selectedFile = null;
    this.selectedFileName = '';
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private revokePreviewUrl(): void {
    if (this.selectedFilePreviewUrl) {
      URL.revokeObjectURL(this.selectedFilePreviewUrl);
      this.selectedFilePreviewUrl = null;
    }
  }

  async ativarCompartilhamento(): Promise<void> {
    if (!this.compartilhamentoDisponivel) {
      return;
    }
    this.sharingLoading = true;
    try {
      const id = await this.ensureDocumentSaved();
      const payload = this.compartilhamentoExpiraEm
        ? { compartilhamentoExpiraEm: new Date(this.compartilhamentoExpiraEm).toISOString() }
        : {};
      const updated = await firstValueFrom(
        this.documentoService.ativarCompartilhamento(id, payload),
      );
      this.documentoAtual = updated;
      this.syncPublicLink(updated);
      this.showSuccess('Link público ativado');
    } catch (error) {
      if ((error as Error)?.message !== 'Formulário inválido') {
        this.handleError(error, 'Erro ao ativar compartilhamento');
      }
    } finally {
      this.sharingLoading = false;
    }
  }

  async desativarCompartilhamento(): Promise<void> {
    if (!this.entityId) {
      return;
    }
    this.sharingLoading = true;
    try {
      const updated = await firstValueFrom(
        this.documentoService.desativarCompartilhamento(this.entityId),
      );
      this.documentoAtual = updated;
      this.publicLink = '';
      this.showSuccess('Link público desativado');
    } catch (error) {
      this.handleError(error, 'Erro ao desativar compartilhamento');
    } finally {
      this.sharingLoading = false;
    }
  }

  async regenerarCompartilhamento(): Promise<void> {
    if (!this.entityId) {
      return;
    }
    this.sharingLoading = true;
    try {
      const payload = this.compartilhamentoExpiraEm
        ? { compartilhamentoExpiraEm: new Date(this.compartilhamentoExpiraEm).toISOString() }
        : {};
      const updated = await firstValueFrom(
        this.documentoService.regenerarCompartilhamento(this.entityId, payload),
      );
      this.documentoAtual = updated;
      this.syncPublicLink(updated);
      this.showSuccess('Link público regenerado');
    } catch (error) {
      this.handleError(error, 'Erro ao regenerar link');
    } finally {
      this.sharingLoading = false;
    }
  }

  async copyPublicLink(): Promise<void> {
    if (!this.publicLink) {
      return;
    }
    const copied = await copyTextToClipboard(this.publicLink);
    if (!copied) {
      this.notificationService.error('Não foi possível copiar o link');
      return;
    }
    this.copyFeedback = true;
    setTimeout(() => {
      this.copyFeedback = false;
    }, 2000);
  }

  get arquivoExibicaoNome(): string {
    const original = this.selectedFileName || this.arquivoAtual;
    if (!original) {
      return '';
    }
    return this.buildArquivoNomePadrao(original);
  }

  async downloadArquivoAtual(): Promise<void> {
    if (!this.entityId || !this.arquivoAtual) {
      return;
    }

    this.downloadingArquivo = true;
    try {
      const blob = await firstValueFrom(
        this.documentoService.downloadArquivo(this.entityId),
      );
      triggerBlobDownload(blob, this.buildArquivoNomePadrao(this.arquivoAtual));
    } catch (error) {
      this.handleError(error, 'Erro ao baixar arquivo');
    } finally {
      this.downloadingArquivo = false;
    }
  }

  private buildArquivoNomePadrao(nomeArquivoOriginal: string): string {
    const tipo = this.tiposDocumento.find(
      (item) => item.id === this.form.getRawValue().tipoDocumentoId,
    );
    const departamento = this.departamentos.find(
      (item) => item.id === this.form.getRawValue().departamentoId,
    );

    return buildDocumentoDownloadFileName({
      nomeDocumento: this.form.getRawValue().nomeDocumento || '',
      tipoDocumento: tipo?.nome || '',
      departamento: departamento?.nomeDepartamento || '',
      nomeArquivoOriginal,
    });
  }

  protected override getListRoute(): string {
    return '/documento';
  }

  private syncPublicLink(documento: DocumentoResumo): void {
    this.publicLink =
      documento.compartilhamentoAtivo && documento.tokenPublico
        ? this.documentoService.buildPublicLink(documento.tokenPublico)
        : '';
  }
}
