import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  AreaVistoriada,
  CreateAreaVistoriadaDto,
  UpdateAreaVistoriadaDto,
  SetAreaComponentesDto,
  AreaComponente,
} from '../../models/area-vistoriada.model';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { ModeloVeiculo } from '../../models/modelo-veiculo.model';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';
import { ComponenteService } from '../../services/componente.service';
import { Componente } from '../../models/componente.model';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-area-vistoriada-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MultiSelectComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './area-vistoriada-form.html',
  styleUrls: ['./area-vistoriada-form.css'],
})
export class AreaVistoriadaFormComponent
  extends BaseFormComponent<CreateAreaVistoriadaDto | UpdateAreaVistoriadaDto>
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private areaService: AreaVistoriadaService,
    private modeloService: ModeloVeiculoService,
    private componenteService: ComponenteService,
    private route: ActivatedRoute,
    router: Router,
  ) {
    super(router);
  }

  modelos: ModeloVeiculo[] = [];
  modelosSelecionados: string[] = [];
  componentes: Componente[] = [];
  componentesSelecionados = new Map<string, { ordem: number }>();

  componenteEditId: string | null = null;
  componenteForm!: FormGroup;
  savingComponente = false;

  novoComponenteNome = '';
  novoComponenteAtivo = true;

  showDeleteComponenteModal = false;
  componenteToDelete: Componente | null = null;

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    this.loadModelos();
    this.loadComponentes();
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      ordem_visual: [0, [Validators.min(0)]],
      ativo: [true],
    });
    this.componenteForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      ativo: [true],
    });
  }

  protected buildFormData(): CreateAreaVistoriadaDto | UpdateAreaVistoriadaDto {
    const formValue = this.form.value;
    return {
      nome: formValue.nome,
      ordem_visual: Number(formValue.ordem_visual ?? 0),
      ativo: formValue.ativo,
      modelos: this.getModeloIdsSelecionados(),
    };
  }

  protected async saveEntity(data: CreateAreaVistoriadaDto): Promise<void> {
    const area = await firstValueFrom(this.areaService.create(data));
    const payload = this.buildComponentesPayload();
    if (payload.componentes.length > 0) {
      await firstValueFrom(this.areaService.setComponentes(area.id, payload));
    }
  }

  protected async updateEntity(id: string, data: UpdateAreaVistoriadaDto): Promise<void> {
    await firstValueFrom(this.areaService.update(id, data));
    const payload = this.buildComponentesPayload();
    await firstValueFrom(this.areaService.setComponentes(id, payload));
  }

  protected async loadEntityById(id: string): Promise<void> {
    await firstValueFrom(this.modeloService.getAll(true)).then((items) => {
      this.modelos = items;
    });
    const [area, areaComponentes] = await Promise.all([
      firstValueFrom(this.areaService.getById(id)),
      firstValueFrom(this.areaService.listComponentes(id)),
    ]);
    this.form.patchValue({
      nome: area.nome,
      ordem_visual: area.ordemVisual ?? 0,
      ativo: area.ativo,
    });
    this.modelosSelecionados =
      area.modelos?.map((am) => this.modelos.find((m) => m.id === am.idModelo)?.nome ?? am.idModelo).filter(Boolean) ?? [];
    this.hidratarComponentesSelecionados(areaComponentes);
  }

  protected override getListRoute(): string {
    return '/areas-vistoriadas';
  }

  get modeloOptions(): string[] {
    return this.modelos.map((m) => m.nome);
  }

  private loadModelos(): void {
    this.modeloService.getAll(true).subscribe({
      next: (items) => {
        this.modelos = items;
      },
    });
  }

  private getModeloIdsSelecionados(): string[] {
    if (!this.modelosSelecionados.length) return [];
    const mapNomeId = new Map(this.modelos.map((m) => [m.nome, m.id]));
    return this.modelosSelecionados.map((nome) => mapNomeId.get(nome)).filter((id): id is string => !!id);
  }

  private loadComponentes(): void {
    this.componenteService.getAll().subscribe({
      next: (items) => {
        this.componentes = items;
      },
    });
  }

  private hidratarComponentesSelecionados(itens: AreaComponente[]): void {
    this.componentesSelecionados.clear();
    itens.forEach((item) => {
      this.componentesSelecionados.set(item.idComponente, { ordem: item.ordemVisual ?? 0 });
    });
  }

  isComponenteSelected(componenteId: string): boolean {
    return this.componentesSelecionados.has(componenteId);
  }

  toggleComponente(componenteId: string): void {
    if (this.componentesSelecionados.has(componenteId)) {
      this.componentesSelecionados.delete(componenteId);
      return;
    }
    const ordem = this.getNextOrdemComponente();
    this.componentesSelecionados.set(componenteId, { ordem });
  }

  updateOrdemComponente(componenteId: string, value: string): void {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    const current = this.componentesSelecionados.get(componenteId);
    if (!current) return;
    this.componentesSelecionados.set(componenteId, { ordem: Math.max(0, Math.floor(parsed)) });
  }

  private getNextOrdemComponente(): number {
    if (this.componentesSelecionados.size === 0) return 1;
    const max = Math.max(...Array.from(this.componentesSelecionados.values()).map((item) => item.ordem));
    return max + 1;
  }

  private buildComponentesPayload(): SetAreaComponentesDto {
    return {
      componentes: Array.from(this.componentesSelecionados.entries())
        .map(([idcomponente, data]) => ({
          idcomponente,
          ordem_visual: data.ordem,
        }))
        .sort((a, b) => (a.ordem_visual ?? 0) - (b.ordem_visual ?? 0)),
    };
  }

  get deleteComponenteModalMessage(): string {
    if (!this.componenteToDelete) return '';
    return `Excluir o componente "${this.componenteToDelete.nome}"? Esta ação não pode ser desfeita.`;
  }

  async addComponenteInGrid(): Promise<void> {
    const nome = this.novoComponenteNome?.trim() ?? '';
    if (!nome) {
      this.notificationService.warning('Informe o nome do componente.');
      return;
    }
    this.savingComponente = true;
    try {
      await firstValueFrom(this.componenteService.create({ nome, ativo: this.novoComponenteAtivo }));
      this.notificationService.success('Componente adicionado.');
      this.novoComponenteNome = '';
      this.novoComponenteAtivo = true;
      this.loadComponentes();
    } catch (err) {
      this.handleError(err, 'Erro ao adicionar componente');
    } finally {
      this.savingComponente = false;
    }
  }

  openEditarComponente(componente: Componente): void {
    this.componenteEditId = componente.id;
    this.componenteForm.patchValue({
      nome: componente.nome,
      ativo: componente.ativo,
    });
  }

  cancelEditComponente(): void {
    this.componenteEditId = null;
  }

  async saveComponenteInGrid(): Promise<void> {
    if (this.componenteForm.invalid) {
      this.componenteForm.markAllAsTouched();
      this.notificationService.warning('Preencha o nome do componente.');
      return;
    }
    if (!this.componenteEditId) return;
    this.savingComponente = true;
    const value = this.componenteForm.value;
    const nome = value.nome ?? '';
    const ativo = value.ativo ?? true;
    try {
      await firstValueFrom(this.componenteService.update(this.componenteEditId, { nome, ativo }));
      this.notificationService.success('Componente atualizado.');
      this.componenteEditId = null;
      this.loadComponentes();
    } catch (err) {
      this.handleError(err, 'Erro ao salvar componente');
    } finally {
      this.savingComponente = false;
    }
  }

  openDeleteComponente(componente: Componente): void {
    this.componenteToDelete = componente;
    this.showDeleteComponenteModal = true;
  }

  closeDeleteComponenteModal(): void {
    this.showDeleteComponenteModal = false;
    this.componenteToDelete = null;
  }

  async confirmDeleteComponente(): Promise<void> {
    if (!this.componenteToDelete) return;
    const id = this.componenteToDelete.id;
    try {
      await firstValueFrom(this.componenteService.delete(id));
      this.componentesSelecionados.delete(id);
      this.loadComponentes();
      this.notificationService.success('Componente excluído.');
    } catch (err) {
      this.handleError(err, 'Erro ao excluir componente');
    } finally {
      this.closeDeleteComponenteModal();
    }
  }

  isComponenteFieldInvalid(field: string): boolean {
    const c = this.componenteForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  getComponenteFieldError(field: string): string {
    const c = this.componenteForm.get(field);
    if (!c || !c.errors) return '';
    const e = c.errors;
    if (e['required']) return 'Campo obrigatório';
    if (e['maxlength']) return `Máximo de ${e['maxlength'].requiredLength} caracteres`;
    return 'Campo inválido';
  }
}
