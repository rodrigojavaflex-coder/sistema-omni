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
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';
import { EmpresaTerceira } from '../../models/empresa-terceira.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectComponent],
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css']
})
export class UserFormComponent extends BaseFormComponent<CreateUsuarioDto | UpdateUsuarioDto> implements OnInit {
  availableProfiles: Perfil[] = [];
  availableEmpresas: EmpresaTerceira[] = [];
  departamentos: Departamento[] = [];
  departamentosSelecionados: string[] = [];
  perfisSelecionados: string[] = [];
  empresasManutencaoSelecionadas: string[] = [];
  /** IDs pendentes até a lista de empresas de manutenção carregar. */
  private pendingIdsEmpresasManutencao: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private departamentoService: DepartamentoService,
    private empresaService: EmpresaTerceiraService,
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
    this.loadEmpresas();
    super.ngOnInit();
    this.checkPasswordValidator();
  }

  protected initializeForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(300)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      senha: ['', []],
      ativo: [true],
      perfilIds: [[], Validators.required],
      idsEmpresasManutencao: [[] as string[]],
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
        this.form?.get('perfilIds')?.setValue(this.getPerfilIdsSelecionados());
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
    const data: UpdateUsuarioDto & { senha?: string } = {
      nome: formValue.nome,
      email: formValue.email,
      ativo: formValue.ativo,
      perfilIds: this.getPerfilIdsSelecionados(),
      idsEmpresasManutencao: this.getEmpresaIdsSelecionados(),
      departamentoIds: this.getDepartamentoIdsSelecionados(),
    };
    if (formValue.senha) {
      data.senha = formValue.senha;
    }
    return data as CreateUsuarioDto | UpdateUsuarioDto;
  }

  protected async saveEntity(data: CreateUsuarioDto): Promise<void> {
    await firstValueFrom(this.userService.createUser(data));
  }

  protected async updateEntity(id: string, data: UpdateUsuarioDto): Promise<void> {
    await firstValueFrom(this.userService.updateUser(id, data));
  }

  protected async loadEntityById(id: string): Promise<void> {
    const user = await firstValueFrom(this.userService.getUserById(id));
    const idsEmpresas =
      user?.idsEmpresasManutencao?.length
        ? user.idsEmpresasManutencao
        : user?.empresasManutencao?.map((e) => e.id) ??
          (user?.idEmpresa ? [user.idEmpresa] : []);
    this.pendingIdsEmpresasManutencao = [...idsEmpresas];
    this.form.patchValue({
      nome: user?.nome || '',
      email: user?.email || '',
      ativo: user?.ativo ?? true,
      perfilIds: user?.perfis?.map((perfil) => perfil.id) || [],
      idsEmpresasManutencao: idsEmpresas,
    });
    this.perfisSelecionados = user?.perfis?.map((perfil) => perfil.nomePerfil) || [];
    this.departamentosSelecionados =
      user?.departamentos?.map((d) => d.nomeDepartamento) || [];
    // Preferir descrições da API; se a lista local ainda não carregou, sincroniza depois.
    if (user?.empresasManutencao?.length) {
      this.empresasManutencaoSelecionadas = user.empresasManutencao.map(
        (e) => e.descricao,
      );
    } else {
      this.syncEmpresasManutencaoSelecionadas(idsEmpresas);
    }
    this.form.get('perfilIds')?.setValue(this.getPerfilIdsSelecionados());
    this.form.get('idsEmpresasManutencao')?.setValue(idsEmpresas);
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

  private loadEmpresas(): void {
    this.empresaService.getAll({ somenteManutencao: true }).subscribe({
      next: (empresas) => {
        this.availableEmpresas = empresas ?? [];
        const ids: string[] =
          this.pendingIdsEmpresasManutencao.length
            ? this.pendingIdsEmpresasManutencao
            : (this.form?.get('idsEmpresasManutencao')?.value ?? []);
        if (ids.length) {
          this.syncEmpresasManutencaoSelecionadas(ids);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar empresas de manutenção', error);
        this.availableEmpresas = [];
      },
    });
  }

  private syncEmpresasManutencaoSelecionadas(ids: string[]): void {
    if (!ids.length) {
      this.empresasManutencaoSelecionadas = [];
      return;
    }
    if (!this.availableEmpresas.length) {
      return;
    }
    this.empresasManutencaoSelecionadas = this.availableEmpresas
      .filter((e) => ids.includes(e.id))
      .map((e) => e.descricao);
    this.form?.get('idsEmpresasManutencao')?.setValue(ids);
  }

  private getDepartamentoIdsSelecionados(): string[] {
    if (!this.departamentosSelecionados.length) return [];
    const mapNomeId = new Map(this.departamentos.map((d) => [d.nomeDepartamento, d.id]));
    return this.departamentosSelecionados
      .map((nome) => mapNomeId.get(nome))
      .filter((id): id is string => !!id);
  }

  private getPerfilIdsSelecionados(): string[] {
    if (!this.perfisSelecionados.length) return [];
    const mapNomeId = new Map(this.availableProfiles.map((perfil) => [perfil.nomePerfil, perfil.id]));
    return this.perfisSelecionados
      .map((nome) => mapNomeId.get(nome))
      .filter((id): id is string => !!id);
  }

  get departamentoOptions(): string[] {
    return this.departamentos.map((d) => d.nomeDepartamento);
  }

  get perfilOptions(): string[] {
    return this.availableProfiles.map((perfil) => perfil.nomePerfil);
  }

  onPerfisSelectionChange(selected: string[]): void {
    this.perfisSelecionados = selected;
    this.form.get('perfilIds')?.setValue(this.getPerfilIdsSelecionados());
    this.form.get('perfilIds')?.markAsTouched();
    this.form.get('perfilIds')?.updateValueAndValidity();
  }

  get empresaManutencaoOptions(): string[] {
    return this.availableEmpresas.map((e) => e.descricao);
  }

  onEmpresasManutencaoSelectionChange(selected: string[]): void {
    this.empresasManutencaoSelecionadas = selected;
    this.form
      .get('idsEmpresasManutencao')
      ?.setValue(this.getEmpresaIdsSelecionados());
    this.form.get('idsEmpresasManutencao')?.markAsTouched();
  }

  private getEmpresaIdsSelecionados(): string[] {
    if (!this.empresasManutencaoSelecionadas.length) return [];
    const mapNomeId = new Map(
      this.availableEmpresas.map((e) => [e.descricao, e.id]),
    );
    return this.empresasManutencaoSelecionadas
      .map((nome) => mapNomeId.get(nome))
      .filter((id): id is string => !!id);
  }
}
