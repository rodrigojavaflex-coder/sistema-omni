import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../base/base-form.component';
import { DepartamentoService } from '../../services/departamento.service';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from '../../models/departamento.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './departamento-form.html',
  styleUrls: ['./departamento-form.css']
})
export class DepartamentoFormComponent extends BaseFormComponent<CreateDepartamentoDto | UpdateDepartamentoDto> implements OnInit {
  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
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
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nomeDepartamento: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  protected buildFormData(): CreateDepartamentoDto | UpdateDepartamentoDto {
    const data: any = { ...this.form.value };
    return data;
  }

  protected async saveEntity(data: CreateDepartamentoDto): Promise<void> {
    await firstValueFrom(this.departamentoService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateDepartamentoDto): Promise<void> {
    await firstValueFrom(this.departamentoService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const departamento = await firstValueFrom(this.departamentoService.getById(id));
    this.form.patchValue({
      nomeDepartamento: departamento.nomeDepartamento,
    });
  }

  protected override getListRoute(): string {
    return '/departamento';
  }
}
