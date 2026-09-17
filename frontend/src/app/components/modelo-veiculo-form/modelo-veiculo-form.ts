import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  ModeloVeiculo,
  ModeloVeiculoVista,
  CreateModeloVeiculoDto,
  UpdateModeloVeiculoDto,
} from '../../models/modelo-veiculo.model';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';
import { VistaVeiculoService } from '../../services/vista-veiculo.service';
import { VistaVeiculo } from '../../models/vista-veiculo.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { compressImageForUpload } from '../../utils/compress-image.util';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

interface VistaFormItem extends ModeloVeiculoVista {
  previewUrl?: string;
}

@Component({
  selector: 'app-modelo-veiculo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './modelo-veiculo-form.html',
  styleUrls: ['./modelo-veiculo-form.css'],
})
export class ModeloVeiculoFormComponent
  extends BaseFormComponent<CreateModeloVeiculoDto | UpdateModeloVeiculoDto>
  implements OnInit, OnDestroy
{
  vistas: VistaFormItem[] = [];
  catalogo: VistaVeiculo[] = [];
  novaCatalogoId = '';
  vistasLoading = false;
  vistasError = '';
  uploading = false;
  showReplaceModal = false;
  replaceTarget: VistaFormItem | null = null;
  pendingReplaceFile: File | null = null;
  previewVista: VistaFormItem | null = null;
  canEditModelo = false;
  canSaveVistas = false;
  canTrocarImagem = false;
  canInativarVista = false;
  canExcluirVista = false;

  constructor(
    private fb: FormBuilder,
    private modeloService: ModeloVeiculoService,
    private vistaVeiculoService: VistaVeiculoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    router: Router,
  ) {
    super(router);
  }

  override ngOnInit(): void {
    this.canEditModelo = this.authService.hasPermission(Permission.MODELOVEICULO_UPDATE);
    this.canSaveVistas = this.authService.hasPermission(Permission.MODELOVEICULO_VISTAS);
    this.canTrocarImagem = this.authService.hasPermission(Permission.MODELOVEICULO_VISTAS_IMAGEM);
    this.canInativarVista = this.authService.hasPermission(
      Permission.MODELOVEICULO_VISTAS_INATIVAR,
    );
    this.canExcluirVista = this.authService.hasPermission(Permission.MODELOVEICULO_VISTAS_EXCLUIR);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    super.ngOnInit();
  }

  override ngOnDestroy(): void {
    this.vistas.forEach((vista) => {
      if (vista.previewUrl) {
        URL.revokeObjectURL(vista.previewUrl);
      }
    });
    super.ngOnDestroy();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(80)]],
      ativo: [true],
    });
    if (!this.canEditModelo) {
      this.form.get('nome')?.disable();
      this.form.get('ativo')?.disable();
    }
  }

  protected buildFormData(): CreateModeloVeiculoDto | UpdateModeloVeiculoDto {
    const formValue = this.form.value;
    return {
      nome: formValue.nome,
      ativo: formValue.ativo,
    };
  }

  protected async saveEntity(data: CreateModeloVeiculoDto): Promise<void> {
    await firstValueFrom(this.modeloService.create(data));
  }

  override async onSubmit(): Promise<void> {
    if (!this.canEditModelo) {
      return;
    }
    await super.onSubmit();
  }

  protected async updateEntity(id: string, data: UpdateModeloVeiculoDto): Promise<void> {
    await firstValueFrom(this.modeloService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const modelo: ModeloVeiculo = await firstValueFrom(this.modeloService.getById(id));
    this.form.patchValue({
      nome: modelo.nome,
      ativo: modelo.ativo,
    });
    await this.carregarCatalogo();
    await this.carregarVistas(id);
  }

  protected override getListRoute(): string {
    return '/modelos-veiculo';
  }

  async onNovaVista(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !this.entityId) {
      return;
    }
    if (!this.novaCatalogoId) {
      this.vistasError = 'Selecione a vista do catálogo antes de enviar a imagem.';
      return;
    }
    this.uploading = true;
    this.vistasError = '';
    try {
      const blob = await compressImageForUpload(file);
      await firstValueFrom(
        this.modeloService.createVista(
          this.entityId,
          this.novaCatalogoId,
          blob,
          this.vistas.length,
        ),
      );
      this.novaCatalogoId = '';
      await this.carregarVistas(this.entityId);
    } catch (err: unknown) {
      this.vistasError = this.mensagemErro(err, 'Não foi possível adicionar a vista.');
    } finally {
      this.uploading = false;
    }
  }

  pedirTrocaImagem(vista: VistaFormItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    this.replaceTarget = vista;
    this.pendingReplaceFile = file;
    this.showReplaceModal = true;
  }

  async confirmarTrocaImagem(): Promise<void> {
    if (!this.entityId || !this.replaceTarget || !this.pendingReplaceFile) {
      this.cancelarTrocaImagem();
      return;
    }
    this.uploading = true;
    this.vistasError = '';
    try {
      const blob = await compressImageForUpload(this.pendingReplaceFile);
      await firstValueFrom(
        this.modeloService.replaceVistaImagem(this.entityId, this.replaceTarget.id, blob),
      );
      await this.carregarVistas(this.entityId);
    } catch (err: unknown) {
      this.vistasError = this.mensagemErro(err, 'Não foi possível substituir a imagem.');
    } finally {
      this.uploading = false;
      this.cancelarTrocaImagem();
    }
  }

  cancelarTrocaImagem(): void {
    this.showReplaceModal = false;
    this.replaceTarget = null;
    this.pendingReplaceFile = null;
  }

  abrirImagem(vista: VistaFormItem): void {
    if (!vista.previewUrl) {
      return;
    }
    this.previewVista = vista;
  }

  fecharImagem(): void {
    this.previewVista = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.previewVista) {
      this.fecharImagem();
    }
  }

  get catalogoDisponivel(): VistaVeiculo[] {
    const usados = new Set(this.vistas.map((vista) => vista.idCatalogo));
    return this.catalogo.filter((item) => !usados.has(item.id));
  }

  async alternarAtivo(vista: VistaFormItem): Promise<void> {
    if (!this.entityId) {
      return;
    }
    try {
      await firstValueFrom(
        this.modeloService.updateVista(this.entityId, vista.id, { ativo: !vista.ativo }),
      );
      await this.carregarVistas(this.entityId);
    } catch (err: unknown) {
      this.vistasError = this.mensagemErro(err, 'Não foi possível alterar o status da vista.');
    }
  }

  async excluirVista(vista: VistaFormItem): Promise<void> {
    if (!this.entityId) {
      return;
    }
    try {
      await firstValueFrom(this.modeloService.deleteVista(this.entityId, vista.id));
      await this.carregarVistas(this.entityId);
    } catch (err: unknown) {
      this.vistasError = this.mensagemErro(
        err,
        'Não é possível excluir. Inative a vista. Há irregularidades marcadas neste desenho.',
      );
    }
  }

  private async carregarCatalogo(): Promise<void> {
    try {
      this.catalogo = await firstValueFrom(this.vistaVeiculoService.getAll(true));
    } catch {
      this.catalogo = [];
      this.vistasError = 'Não foi possível carregar o catálogo de vistas.';
    }
  }

  private async carregarVistas(idModelo: string): Promise<void> {
    this.vistasLoading = true;
    try {
      const lista = await firstValueFrom(this.modeloService.listVistas(idModelo));
      this.vistas.forEach((vista) => {
        if (vista.previewUrl) {
          URL.revokeObjectURL(vista.previewUrl);
        }
      });
      this.vistas = [];
      for (const item of lista) {
        const blob = await firstValueFrom(this.modeloService.getVistaImagem(idModelo, item.id));
        this.vistas.push({
          ...item,
          previewUrl: URL.createObjectURL(blob),
        });
      }
    } catch {
      this.vistasError = 'Não foi possível carregar as vistas do modelo.';
    } finally {
      this.vistasLoading = false;
    }
  }

  private mensagemErro(err: unknown, fallback: string): string {
    const message = (err as { error?: { message?: string | string[] } })?.error?.message;
    if (Array.isArray(message)) {
      return message.join(' ');
    }
    return message || fallback;
  }
}
