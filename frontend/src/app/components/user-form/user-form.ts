import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CreateUsuarioDto, UpdateUsuarioDto, Perfil } from '../../models/usuario.model';
import { BaseFormComponent } from '../base/base-form.component';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectComponent],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent extends BaseFormComponent<CreateUsuarioDto | UpdateUsuarioDto> implements OnInit {
  availableProfiles: Perfil[] = [];
  departamentos: Departamento[] = [];
  departamentosSelecionados: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private departamentoService: DepartamentoService,
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
    this.loadProfiles();
    this.loadDepartamentos();
    super.ngOnInit();
    this.checkPasswordValidator();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(300)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      senha: ['', []],
      ativo: [true],
      perfilId: ['', Validators.required],
    });
  }

  private checkPasswordValidator(): void {
    const senhaControl = this.form.get('senha');
    if (!senhaControl) return;

    if (this.editMode) {
      senhaControl.clearValidators();
    } else {
      senhaControl.setValidators([Validators.required, Validators.minLength(6)]);
    }
    senhaControl.updateValueAndValidity();
  }

  private checkEditMode(): void {
    this.checkPasswordValidator();
  }

  private loadProfiles(): void {
    this.userService.getProfiles().subscribe({
      next: (profiles) => {
        this.availableProfiles = profiles;
        // Após carregar perfis, prosseguir com checagem de modo (create/edit)
        this.checkEditMode();
      },
      error: (error) => {
        console.error('Erro ao carregar perfis:', error);
        // Mesmo em caso de erro, verificar modo de edição
        this.checkEditMode();
      }
    });
  }

  protected buildFormData(): CreateUsuarioDto | UpdateUsuarioDto {
    const formValue = this.form.value;
    const data: any = {
      nome: formValue.nome,
      email: formValue.email,
      ativo: formValue.ativo,
      perfilId: formValue.perfilId,
      departamentoIds: this.getDepartamentoIdsSelecionados(),
    };
    if (formValue.senha) {
      data.senha = formValue.senha;
    }
    return data;
  }

  protected async saveEntity(data: CreateUsuarioDto): Promise<void> {
    await firstValueFrom(this.userService.createUser(data));
  }

  protected async updateEntity(id: string, data: UpdateUsuarioDto): Promise<void> {
    await firstValueFrom(this.userService.updateUser(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const user = await firstValueFrom(this.userService.getUserById(id));
    this.form.patchValue({
      nome: user?.nome || '',
      email: user?.email || '',
      ativo: user?.ativo ?? true,
      perfilId: user?.perfil?.id || '',
    });
    this.departamentosSelecionados =
      user?.departamentos?.map((d) => d.nomeDepartamento) || [];
    this.checkPasswordValidator();
  }

  protected override getListRoute(): string {
    return '/users';
  }

  private async loadDepartamentos(): Promise<void> {
    try {
      this.departamentos = await firstValueFrom(this.departamentoService.getAll());
    } catch (error) {
      console.error('Erro ao carregar departamentos', error);
    }
  }

  private getDepartamentoIdsSelecionados(): string[] {
    if (!this.departamentosSelecionados.length) return [];
    const mapNomeId = new Map(this.departamentos.map((d) => [d.nomeDepartamento, d.id]));
    return this.departamentosSelecionados
      .map((nome) => mapNomeId.get(nome))
      .filter((id): id is string => !!id);
  }

  get departamentoOptions(): string[] {
    return this.departamentos.map((d) => d.nomeDepartamento);
  }
}
