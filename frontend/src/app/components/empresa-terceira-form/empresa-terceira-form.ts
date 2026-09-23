import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
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
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-empresa-terceira-form',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './empresa-terceira-form.html',
  styleUrls: ['./empresa-terceira-form.css'],
})
export class EmpresaTerceiraFormComponent
  extends BaseFormComponent<
    CreateEmpresaTerceiraDto | UpdateEmpresaTerceiraDto
  >
  implements OnInit
{
  brtTokenConfigured = false;
  showBrtToken = false;
  brtTokenLoading = false;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaTerceiraService,
    private authService: AuthService,
    private route: ActivatedRoute,
    router: Router,
  ) {
    super(router);
  }

  get podeConfigurarIntegracao(): boolean {
    return this.authService.hasPermission(
      Permission.EMPRESATERCIRA_INTEGRACAO_CONFIG,
    );
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
      emailsRelatorio: ['', [Validators.maxLength(2000)]],
      ehEmpresaManutencao: [false],
      integracaoManutencao: ['NENHUMA'],
      enviarEmailRelatorio: [true],
      brtUrlBase: [''],
      brtTenEmp: [''],
      brtToken: [''],
      brtAmbiente: [''],
      brtAllowInsecureTls: [false],
      brtNomSol: ['', [Validators.maxLength(200)]],
      brtTelCtt: ['', [Validators.maxLength(40)]],
      brtLocAtd: ['', [Validators.maxLength(500)]],
    });
  }

  protected buildFormData(): CreateEmpresaTerceiraDto | UpdateEmpresaTerceiraDto {
    const raw = this.form.value;
    const payload: CreateEmpresaTerceiraDto = {
      descricao: raw.descricao,
      emailsRelatorio: raw.emailsRelatorio || undefined,
      ehEmpresaManutencao: !!raw.ehEmpresaManutencao,
      enviarEmailRelatorio: !!raw.enviarEmailRelatorio,
    };
    if (this.podeConfigurarIntegracao) {
      payload.integracaoManutencao = raw.integracaoManutencao || 'NENHUMA';
      payload.brtUrlBase = raw.brtUrlBase?.trim() || undefined;
      payload.brtTenEmp = raw.brtTenEmp?.trim() || undefined;
      payload.brtAmbiente = raw.brtAmbiente?.trim() || undefined;
      payload.brtAllowInsecureTls = !!raw.brtAllowInsecureTls;
      payload.brtNomSol = raw.brtNomSol?.trim() || undefined;
      payload.brtTelCtt = raw.brtTelCtt?.trim() || undefined;
      payload.brtLocAtd = raw.brtLocAtd?.trim() || undefined;
      if (raw.brtToken?.trim()) {
        payload.brtToken = raw.brtToken.trim();
      }
    }
    return payload;
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
    this.brtTokenConfigured = !!item.brtTokenConfigured;
    this.form.patchValue({
      descricao: item.descricao,
      emailsRelatorio: item.emailsRelatorio ?? '',
      ehEmpresaManutencao: !!item.ehEmpresaManutencao,
      enviarEmailRelatorio: item.enviarEmailRelatorio !== false,
    });
    if (this.podeConfigurarIntegracao) {
      this.form.patchValue({
        integracaoManutencao: item.integracaoManutencao ?? 'NENHUMA',
        brtUrlBase: item.brtUrlBase ?? '',
        brtTenEmp: item.brtTenEmp ?? '',
        brtToken: item.brtToken ?? '',
        brtAmbiente: item.brtAmbiente ?? '',
        brtAllowInsecureTls: !!item.brtAllowInsecureTls,
        brtNomSol: item.brtNomSol ?? '',
        brtTelCtt: item.brtTelCtt ?? '',
        brtLocAtd: item.brtLocAtd ?? '',
      });
      this.showBrtToken = false;
    }
  }

  async onBrtTokenFocus(): Promise<void> {
    if (
      !this.editMode ||
      !this.entityId ||
      !this.podeConfigurarIntegracao ||
      this.brtTokenLoading
    ) {
      return;
    }
    this.brtTokenLoading = true;
    try {
      const item = await firstValueFrom(
        this.empresaService.getById(this.entityId),
      );
      this.brtTokenConfigured = !!item.brtTokenConfigured;
      if (item.brtToken?.trim()) {
        this.form.patchValue(
          { brtToken: item.brtToken.trim() },
          { emitEvent: false },
        );
      }
    } finally {
      this.brtTokenLoading = false;
    }
  }

  toggleBrtTokenVisibility(): void {
    this.showBrtToken = !this.showBrtToken;
  }

  protected override getListRoute(): string {
    return '/empresa-terceira';
  }
}
