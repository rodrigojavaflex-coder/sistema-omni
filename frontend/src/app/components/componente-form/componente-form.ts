import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  Componente,
  CreateComponenteDto,
  UpdateComponenteDto,
} from '../../models/componente.model';
import { ComponenteService } from '../../services/componente.service';

@Component({
  selector: 'app-componente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './componente-form.html',
  styleUrls: ['./componente-form.css'],
})
export class ComponenteFormComponent
  extends BaseFormComponent<CreateComponenteDto | UpdateComponenteDto>
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private componenteService: ComponenteService,
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
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      ativo: [true],
    });
  }

  protected buildFormData(): CreateComponenteDto | UpdateComponenteDto {
    const formValue = this.form.value;
    return {
      nome: formValue.nome,
      ativo: formValue.ativo,
    };
  }

  protected async saveEntity(data: CreateComponenteDto): Promise<void> {
    await firstValueFrom(this.componenteService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateComponenteDto): Promise<void> {
    await firstValueFrom(this.componenteService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const componente: Componente = await firstValueFrom(this.componenteService.getById(id));
    this.form.patchValue({
      nome: componente.nome,
      ativo: componente.ativo,
    });
  }

  protected override getListRoute(): string {
    return '/componentes';
  }
}
