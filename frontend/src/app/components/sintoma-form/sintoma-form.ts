import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  Sintoma,
  CreateSintomaDto,
  UpdateSintomaDto,
  SintomaModeloResumo,
} from '../../models/sintoma.model';
import { SintomaService } from '../../services/sintoma.service';

@Component({
  selector: 'app-sintoma-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sintoma-form.html',
  styleUrls: ['./sintoma-form.css'],
})
export class SintomaFormComponent
  extends BaseFormComponent<CreateSintomaDto | UpdateSintomaDto>
  implements OnInit
{
  modelos: SintomaModeloResumo[] = [];

  constructor(
    private fb: FormBuilder,
    private sintomaService: SintomaService,
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
      descricao: ['', [Validators.required, Validators.maxLength(150)]],
      ativo: [true],
      exigeMarcacaoMapa: [false],
    });
  }

  protected override async loadData(): Promise<void> {
    this.loading = true;
    try {
      this.modelos = await firstValueFrom(this.sintomaService.getCatalogoModelos());
      if (this.editMode && this.entityId) {
        await this.loadEntityById(this.entityId);
      }
    } catch (error) {
      this.handleError(error, 'Erro ao carregar dados');
    } finally {
      this.loading = false;
    }
  }

  protected buildFormData(): CreateSintomaDto | UpdateSintomaDto {
    const formValue = this.form.value;
    return {
      descricao: formValue.descricao,
      ativo: formValue.ativo,
      exigeMarcacaoMapa: !!formValue.exigeMarcacaoMapa,
    };
  }

  protected async saveEntity(data: CreateSintomaDto): Promise<void> {
    await firstValueFrom(this.sintomaService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateSintomaDto): Promise<void> {
    await firstValueFrom(this.sintomaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const sintoma: Sintoma = await firstValueFrom(this.sintomaService.getById(id));
    this.form.patchValue({
      descricao: sintoma.descricao,
      ativo: sintoma.ativo,
      exigeMarcacaoMapa: !!sintoma.exigeMarcacaoMapa,
    });
    if (sintoma.modelos?.length) {
      this.modelos = sintoma.modelos;
    }
  }

  protected override getListRoute(): string {
    return '/sintomas';
  }
}
