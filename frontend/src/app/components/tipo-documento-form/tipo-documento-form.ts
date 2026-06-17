import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  CreateTipoDocumentoDto,
  UpdateTipoDocumentoDto,
  TipoDocumento,
} from '../../models/tipo-documento.model';
import { TipoDocumentoService } from '../../services/tipo-documento.service';

@Component({
  selector: 'app-tipo-documento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tipo-documento-form.html',
  styleUrls: ['./tipo-documento-form.css'],
})
export class TipoDocumentoFormComponent
  extends BaseFormComponent<CreateTipoDocumentoDto | UpdateTipoDocumentoDto>
  implements OnInit
{
  constructor(
    private readonly fb: FormBuilder,
    private readonly tipoDocumentoService: TipoDocumentoService,
    private readonly route: ActivatedRoute,
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
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      descricao: [''],
      ativo: [true],
    });
  }

  protected buildFormData(): CreateTipoDocumentoDto | UpdateTipoDocumentoDto {
    const value = this.form.value;
    return {
      nome: value.nome,
      descricao: value.descricao || undefined,
      ativo: value.ativo,
    };
  }

  protected async saveEntity(data: CreateTipoDocumentoDto): Promise<void> {
    await firstValueFrom(this.tipoDocumentoService.create(data));
  }

  protected async updateEntity(
    id: string,
    data: UpdateTipoDocumentoDto,
  ): Promise<void> {
    await firstValueFrom(this.tipoDocumentoService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const item: TipoDocumento = await firstValueFrom(
      this.tipoDocumentoService.getById(id),
    );
    this.form.patchValue({
      nome: item.nome,
      descricao: item.descricao ?? '',
      ativo: item.ativo,
    });
  }

  protected override getListRoute(): string {
    return '/tipo-documento';
  }
}
