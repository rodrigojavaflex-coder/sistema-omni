import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../base/base-form.component';
import { IndicadorService } from '../../services/indicador.service';
import { DepartamentoService } from '../../services/departamento.service';
import { AuthService } from '../../services/auth.service';
import {
  CreateIndicadorDto,
  UpdateIndicadorDto,
  TIPO_INDICADOR_SUGESTOES,
  UNIDADE_MEDIDA_SUGESTOES,
} from '../../models/indicador.model';
import { Departamento } from '../../models/departamento.model';
import { Usuario } from '../../models/usuario.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-indicador-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './indicador-form.html',
  styleUrls: ['./indicador-form.css'],
})
export class IndicadorFormComponent
  extends BaseFormComponent<CreateIndicadorDto | UpdateIndicadorDto>
  implements OnInit
{
  departamentos: Departamento[] = [];
  unidadeSugestoes = UNIDADE_MEDIDA_SUGESTOES;
  tipoSugestoes = TIPO_INDICADOR_SUGESTOES;
  codigoIndicador: number | null = null;

  constructor(
    private fb: FormBuilder,
    private indicadorService: IndicadorService,
    private departamentoService: DepartamentoService,
    private authService: AuthService,
    private route: ActivatedRoute,
    router: Router,
  ) {
    super(router);
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    void this.loadDepartamentosUsuario();
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nomeIndicador: ['', [Validators.required, Validators.maxLength(200)]],
      departamentoId: ['', [Validators.required]],
      unidadeMedida: ['', [Validators.required, Validators.maxLength(50)]],
      tipoIndicador: ['', [Validators.required, Validators.maxLength(30)]],
      detalheIndicador: [''],
      ativo: [true, [Validators.required]],
      ordemExibicao: [null, [Validators.min(0)]],
    });
  }

  protected buildFormData(): CreateIndicadorDto | UpdateIndicadorDto {
    const formValue = this.form.value;
    const detalheRaw = formValue.detalheIndicador;
    const detalheIndicador =
      detalheRaw !== null &&
      detalheRaw !== undefined &&
      String(detalheRaw).trim() !== ''
        ? String(detalheRaw).trim()
        : null;
    const ordem =
      formValue.ordemExibicao !== null &&
      formValue.ordemExibicao !== undefined &&
      formValue.ordemExibicao !== ''
        ? Number(formValue.ordemExibicao)
        : null;

    if (this.editMode) {
      return {
        nomeIndicador: String(formValue.nomeIndicador).trim(),
        departamentoId: formValue.departamentoId,
        unidadeMedida: String(formValue.unidadeMedida).trim(),
        tipoIndicador: String(formValue.tipoIndicador).trim(),
        detalheIndicador,
        ativo: !!formValue.ativo,
        ordemExibicao: ordem,
      } as UpdateIndicadorDto;
    }

    return {
      nomeIndicador: String(formValue.nomeIndicador).trim(),
      departamentoId: formValue.departamentoId,
      unidadeMedida: String(formValue.unidadeMedida).trim(),
      tipoIndicador: String(formValue.tipoIndicador).trim(),
      detalheIndicador,
      ativo: formValue.ativo ?? true,
      ordemExibicao: ordem,
    } as CreateIndicadorDto;
  }

  protected async saveEntity(data: CreateIndicadorDto): Promise<void> {
    await firstValueFrom(this.indicadorService.create(data));
  }

  protected async updateEntity(
    id: string,
    data: UpdateIndicadorDto,
  ): Promise<void> {
    await firstValueFrom(this.indicadorService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const indicador = await firstValueFrom(this.indicadorService.getById(id));
    this.codigoIndicador = indicador.codigoIndicador;
    this.form.patchValue({
      nomeIndicador: indicador.nomeIndicador,
      departamentoId: indicador.departamentoId,
      unidadeMedida: indicador.unidadeMedida,
      tipoIndicador: indicador.tipoIndicador,
      detalheIndicador: indicador.detalheIndicador ?? '',
      ativo: indicador.ativo,
      ordemExibicao: indicador.ordemExibicao ?? null,
    });
  }

  protected override getListRoute(): string {
    return '/indicador';
  }

  private async loadDepartamentosUsuario(): Promise<void> {
    const user: Usuario = await this.authService.getProfile();
    const ids = user?.departamentos?.map((d) => d.id) || [];
    if (!ids.length) {
      this.departamentos = [];
      return;
    }
    const all = await firstValueFrom(this.departamentoService.getAll());
    this.departamentos = all.filter((d) => ids.includes(d.id));
  }
}
