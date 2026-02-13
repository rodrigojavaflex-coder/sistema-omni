import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  CreateEmpresaTerceiraDto,
  UpdateEmpresaTerceiraDto,
  EmpresaTerceira,
} from '../../models/empresa-terceira.model';
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';

@Component({
  selector: 'app-empresa-terceira-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa-terceira-form.html',
  styleUrls: ['./empresa-terceira-form.css'],
})
export class EmpresaTerceiraFormComponent
  extends BaseFormComponent<
    CreateEmpresaTerceiraDto | UpdateEmpresaTerceiraDto
  >
  implements OnInit
{
  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaTerceiraService,
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

  protected buildFormData(): CreateEmpresaTerceiraDto | UpdateEmpresaTerceiraDto {
    return { descricao: this.form.value.descricao };
  }

  protected async saveEntity(data: CreateEmpresaTerceiraDto): Promise<void> {
    await firstValueFrom(this.empresaService.create(data));
  }

  protected async updateEntity(
    id: string,
    data: UpdateEmpresaTerceiraDto,
  ): Promise<void> {
    await firstValueFrom(this.empresaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const item: EmpresaTerceira = await firstValueFrom(
      this.empresaService.getById(id),
    );
    this.form.patchValue({ descricao: item.descricao });
  }

  protected override getListRoute(): string {
    return '/empresa-terceira';
  }
}
