import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  CreateTipoVistoriaDto,
  UpdateTipoVistoriaDto,
  TipoVistoria,
} from '../../models/tipo-vistoria.model';
import { TipoVistoriaService } from '../../services/tipo-vistoria.service';

@Component({
  selector: 'app-tipo-vistoria-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-vistoria-form.html',
  styleUrls: ['./tipo-vistoria-form.css'],
})
export class TipoVistoriaFormComponent
  extends BaseFormComponent<CreateTipoVistoriaDto | UpdateTipoVistoriaDto>
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private tipoVistoriaService: TipoVistoriaService,
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
      ativo: [true],
    });
  }

  protected buildFormData(): CreateTipoVistoriaDto | UpdateTipoVistoriaDto {
    const formValue = this.form.value;
    return {
      descricao: formValue.descricao,
      ativo: formValue.ativo,
    };
  }

  protected async saveEntity(data: CreateTipoVistoriaDto): Promise<void> {
    await firstValueFrom(this.tipoVistoriaService.create(data));
  }

  protected async updateEntity(
    id: string,
    data: UpdateTipoVistoriaDto,
  ): Promise<void> {
    await firstValueFrom(this.tipoVistoriaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const tipo: TipoVistoria = await firstValueFrom(
      this.tipoVistoriaService.getById(id),
    );

    this.form.patchValue({
      descricao: tipo.descricao,
      ativo: tipo.ativo,
    });
  }

  protected override getListRoute(): string {
    return '/tipo-vistoria';
  }
}
