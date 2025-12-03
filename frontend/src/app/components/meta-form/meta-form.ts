import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../base/base-form.component';
import { MetaService } from '../../services/meta.service';
import { DepartamentoService } from '../../services/departamento.service';
import { AuthService } from '../../services/auth.service';
import {
  CreateMetaDto,
  UpdateMetaDto,
  PolaridadeMeta,
  POLARIDADE_META_LABELS,
  UnidadeMeta,
  UNIDADE_META_LABELS,
  IndicadorMeta,
  INDICADOR_META_LABELS,
} from '../../models/meta.model';
import { Departamento } from '../../models/departamento.model';
import { Usuario } from '../../models/usuario.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-meta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './meta-form.html',
  styleUrls: ['./meta-form.css']
})
export class MetaFormComponent extends BaseFormComponent<CreateMetaDto | UpdateMetaDto> implements OnInit {
  departamentos: Departamento[] = [];
  polaridadeOpcoes = Object.values(PolaridadeMeta);
  polaridadeLabels = POLARIDADE_META_LABELS;
  unidadeOpcoes = Object.values(UnidadeMeta);
  unidadeLabels = UNIDADE_META_LABELS;
  indicadorOpcoes = Object.values(IndicadorMeta);
  indicadorLabels = INDICADOR_META_LABELS;

  constructor(
    private fb: FormBuilder,
    private metaService: MetaService,
    private departamentoService: DepartamentoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    router: Router
  ) {
    super(router);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    this.loadDepartamentosUsuario();
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      tituloDaMeta: ['', [Validators.required, Validators.maxLength(200)]],
      polaridade: ['', [Validators.required]],
      unidade: ['', [Validators.required]],
      indicador: ['', [Validators.required]],
      departamentoId: ['', [Validators.required]],
      descricaoDetalhada: ['', [Validators.required]],
      inicioDaMeta: ['', [Validators.required]],
      prazoFinal: ['', [Validators.required]],
      valorMeta: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)]],
    });
  }

  protected buildFormData(): CreateMetaDto | UpdateMetaDto {
    const formValue = this.form.value;
    const valorMeta =
      formValue.valorMeta !== null && formValue.valorMeta !== undefined && formValue.valorMeta !== ''
        ? Number(formValue.valorMeta)
        : undefined;

    return {
      tituloDaMeta: formValue.tituloDaMeta,
      polaridade: formValue.polaridade,
      unidade: formValue.unidade,
      indicador: formValue.indicador,
      departamentoId: formValue.departamentoId,
      descricaoDetalhada: formValue.descricaoDetalhada,
      inicioDaMeta: formValue.inicioDaMeta,
      prazoFinal: formValue.prazoFinal,
      valorMeta,
    };
  }

  protected async saveEntity(data: CreateMetaDto): Promise<void> {
    await firstValueFrom(this.metaService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateMetaDto): Promise<void> {
    await firstValueFrom(this.metaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const meta = await firstValueFrom(this.metaService.getById(id));
    this.form.patchValue({
      tituloDaMeta: meta.tituloDaMeta,
      polaridade: meta.polaridade,
      unidade: meta.unidade,
      indicador: meta.indicador,
      departamentoId: meta.departamentoId,
      descricaoDetalhada: meta.descricaoDetalhada,
      inicioDaMeta: meta.inicioDaMeta,
      prazoFinal: meta.prazoFinal,
      valorMeta: meta.valorMeta ?? null,
    });
  }

  protected override getListRoute(): string {
    return '/meta';
  }

  private async loadDepartamentosUsuario(): Promise<void> {
    const user: Usuario = await this.authService.getProfile();
    const ids = user?.departamentos?.map((d: any) => d.id) || [];
    if (!ids.length) {
      this.departamentos = [];
      return;
    }
    const all = await firstValueFrom(this.departamentoService.getAll());
    this.departamentos = all.filter((d) => ids.includes(d.id));
  }
}
