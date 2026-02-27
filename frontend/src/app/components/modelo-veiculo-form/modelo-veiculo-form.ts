import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  ModeloVeiculo,
  CreateModeloVeiculoDto,
  UpdateModeloVeiculoDto,
} from '../../models/modelo-veiculo.model';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';

@Component({
  selector: 'app-modelo-veiculo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modelo-veiculo-form.html',
  styleUrls: ['./modelo-veiculo-form.css'],
})
export class ModeloVeiculoFormComponent
  extends BaseFormComponent<CreateModeloVeiculoDto | UpdateModeloVeiculoDto>
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private modeloService: ModeloVeiculoService,
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
      nome: ['', [Validators.required, Validators.maxLength(80)]],
      ativo: [true],
    });
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

  protected async updateEntity(id: string, data: UpdateModeloVeiculoDto): Promise<void> {
    await firstValueFrom(this.modeloService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const modelo: ModeloVeiculo = await firstValueFrom(this.modeloService.getById(id));
    this.form.patchValue({
      nome: modelo.nome,
      ativo: modelo.ativo,
    });
  }

  protected override getListRoute(): string {
    return '/modelos-veiculo';
  }
}
