import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  CreateCategoriaOcorrenciaDto,
  UpdateCategoriaOcorrenciaDto,
  CategoriaOcorrencia,
} from '../../models/categoria-ocorrencia.model';
import { CategoriaOcorrenciaService } from '../../services/categoria-ocorrencia.service';
import { OrigemOcorrenciaService } from '../../services/origem-ocorrencia.service';
import { OrigemOcorrencia } from '../../models/origem-ocorrencia.model';

@Component({
  selector: 'app-categoria-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-ocorrencia-form.html',
  styleUrls: ['./categoria-ocorrencia-form.css'],
})
export class CategoriaOcorrenciaFormComponent
  extends BaseFormComponent<
    CreateCategoriaOcorrenciaDto | UpdateCategoriaOcorrenciaDto
  >
  implements OnInit
{
  private origemService = inject(OrigemOcorrenciaService);

  origens: OrigemOcorrencia[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaOcorrenciaService,
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
    this.origemService.getAll().subscribe((list) => (this.origens = list));
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(300)]],
      idOrigem: ['', Validators.required],
      responsavel: ['', Validators.maxLength(300)],
    });
  }

  protected buildFormData(): CreateCategoriaOcorrenciaDto | UpdateCategoriaOcorrenciaDto {
    const v = this.form.value;
    const data: CreateCategoriaOcorrenciaDto = {
      descricao: v.descricao,
      idOrigem: v.idOrigem,
    };
    if (v.responsavel) data.responsavel = v.responsavel;
    return data;
  }

  protected async saveEntity(data: CreateCategoriaOcorrenciaDto): Promise<void> {
    await firstValueFrom(this.categoriaService.create(data));
  }

  protected async updateEntity(
    id: string,
    data: UpdateCategoriaOcorrenciaDto,
  ): Promise<void> {
    await firstValueFrom(this.categoriaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const item: CategoriaOcorrencia = await firstValueFrom(
      this.categoriaService.getById(id),
    );
    this.form.patchValue({
      descricao: item.descricao,
      idOrigem: item.idOrigem,
      responsavel: item.responsavel ?? '',
    });
  }

  protected override getListRoute(): string {
    return '/categoria-ocorrencia';
  }
}
