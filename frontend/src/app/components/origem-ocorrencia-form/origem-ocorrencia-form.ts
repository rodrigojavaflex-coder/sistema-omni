import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  CreateOrigemOcorrenciaDto,
  UpdateOrigemOcorrenciaDto,
  OrigemOcorrencia,
} from '../../models/origem-ocorrencia.model';
import { OrigemOcorrenciaService } from '../../services/origem-ocorrencia.service';

@Component({
  selector: 'app-origem-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './origem-ocorrencia-form.html',
  styleUrls: ['./origem-ocorrencia-form.css'],
})
export class OrigemOcorrenciaFormComponent
  extends BaseFormComponent<
    CreateOrigemOcorrenciaDto | UpdateOrigemOcorrenciaDto
  >
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private origemService: OrigemOcorrenciaService,
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
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(300)]],
    });
  }

  protected buildFormData(): CreateOrigemOcorrenciaDto | UpdateOrigemOcorrenciaDto {
    return { descricao: this.form.value.descricao };
  }

  protected async saveEntity(data: CreateOrigemOcorrenciaDto): Promise<void> {
    await firstValueFrom(this.origemService.create(data));
  }

  protected async updateEntity(
    id: string,
    data: UpdateOrigemOcorrenciaDto,
  ): Promise<void> {
    await firstValueFrom(this.origemService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const item: OrigemOcorrencia = await firstValueFrom(
      this.origemService.getById(id),
    );
    this.form.patchValue({ descricao: item.descricao });
  }

  protected override getListRoute(): string {
    return '/origem-ocorrencia';
  }
}
