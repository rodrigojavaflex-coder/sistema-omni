import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  VistaVeiculo,
  CreateVistaVeiculoDto,
  UpdateVistaVeiculoDto,
} from '../../models/vista-veiculo.model';
import { VistaVeiculoService } from '../../services/vista-veiculo.service';

@Component({
  selector: 'app-vista-veiculo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vista-veiculo-form.html',
  styleUrls: ['./vista-veiculo-form.css'],
})
export class VistaVeiculoFormComponent
  extends BaseFormComponent<CreateVistaVeiculoDto | UpdateVistaVeiculoDto>
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private vistaService: VistaVeiculoService,
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
      descricao: ['', [Validators.required, Validators.maxLength(80)]],
      ordem: [0, [Validators.required, Validators.min(0)]],
      ativo: [true],
    });
  }

  protected buildFormData(): CreateVistaVeiculoDto | UpdateVistaVeiculoDto {
    const formValue = this.form.value;
    return {
      descricao: formValue.descricao,
      ordem: Number(formValue.ordem) || 0,
      ativo: formValue.ativo,
    };
  }

  protected async saveEntity(data: CreateVistaVeiculoDto): Promise<void> {
    await firstValueFrom(this.vistaService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateVistaVeiculoDto): Promise<void> {
    await firstValueFrom(this.vistaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const vista: VistaVeiculo = await firstValueFrom(this.vistaService.getById(id));
    this.form.patchValue({
      descricao: vista.descricao,
      ordem: vista.ordem,
      ativo: vista.ativo,
    });
  }

  protected override getListRoute(): string {
    return '/vistas-veiculo';
  }
}
