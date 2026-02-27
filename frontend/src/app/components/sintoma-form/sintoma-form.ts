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
    });
  }

  protected buildFormData(): CreateSintomaDto | UpdateSintomaDto {
    const formValue = this.form.value;
    return {
      descricao: formValue.descricao,
      ativo: formValue.ativo,
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
    });
  }

  protected override getListRoute(): string {
    return '/sintomas';
  }
}
