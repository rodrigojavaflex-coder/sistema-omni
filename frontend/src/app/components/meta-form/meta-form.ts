import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../base/base-form.component';
import { MetaService } from '../../services/meta.service';
import { DepartamentoService } from '../../services/departamento.service';
import { AuthService } from '../../services/auth.service';
import { CreateMetaDto, UpdateMetaDto } from '../../models/meta.model';
import { Departamento } from '../../models/departamento.model';
import { Usuario } from '../../models/usuario.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-meta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './meta-form.html',
  styleUrls: ['./meta-form.css']
})
export class MetaFormComponent extends BaseFormComponent<CreateMetaDto | UpdateMetaDto> implements OnInit {
  departamentos: Departamento[] = [];

  constructor(
    private fb: FormBuilder,
    private metaService: MetaService,
    private departamentoService: DepartamentoService,
    private authService: AuthService,
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
    this.loadDepartamentosUsuario();
    super.ngOnInit();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nomeDaMeta: ['', [Validators.required, Validators.maxLength(200)]],
      departamentoId: ['', [Validators.required]],
      descricaoDetalhada: ['', [Validators.required]],
      prazoFinal: ['', [Validators.required]],
      meta: [null, [Validators.required, Validators.pattern(/^-?\d+$/)]],
    });
  }

  protected buildFormData(): CreateMetaDto | UpdateMetaDto {
    const formValue = this.form.value;
    const metaValue = formValue.meta !== null && formValue.meta !== undefined ? Number(formValue.meta) : undefined;

    return {
      nomeDaMeta: formValue.nomeDaMeta,
      departamentoId: formValue.departamentoId,
      descricaoDetalhada: formValue.descricaoDetalhada,
      prazoFinal: formValue.prazoFinal,
      meta: metaValue,
    };
  }

  protected async saveEntity(data: CreateMetaDto): Promise<void> {
    await firstValueFrom(this.metaService.create(data));
  }

  protected async updateEntity(id: string, data: UpdateMetaDto): Promise<void> {
    await firstValueFrom(this.metaService.update(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const meta = await firstValueFrom(this.metaService.getById(id));
    this.form.patchValue({
      nomeDaMeta: meta.nomeDaMeta,
      departamentoId: meta.departamentoId,
      descricaoDetalhada: meta.descricaoDetalhada,
      prazoFinal: meta.prazoFinal,
      meta: meta.meta ?? null,
    });
  }

  protected override getListRoute(): string {
    return '/meta';
  }

  private async loadDepartamentosUsuario(): Promise<void> {
    const user: Usuario = await this.authService.getProfile();
    const ids = user?.departamentos?.map((d: any) => d.id) || [];
    if (!ids.length) {
      this.departamentos = [];
      return;
    }
    const all = await firstValueFrom(this.departamentoService.getAll());
    this.departamentos = all.filter((d) => ids.includes(d.id));
  }
}
