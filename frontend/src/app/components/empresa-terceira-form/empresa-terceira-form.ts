import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BaseFormComponent } from '../base/base-form.component';
import {
  CreateEmpresaTerceiraDto,
  UpdateEmpresaTerceiraDto,
  EmpresaTerceira,
} from '../../models/empresa-terceira.model';
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';
import { Combustivel } from '../../models/combustivel.enum';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';

@Component({
  selector: 'app-empresa-terceira-form',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, FormsModule, MultiSelectComponent],
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
  combustivelOptions = Object.values(Combustivel);
  areaOptions: string[] = [];
  private areaNomeById = new Map<string, string>();
  combustiveisSelecionados: string[] = [];
  areasSelecionadas: string[] = [];
  activeTab: 'geral' | 'escopo' | 'integracao' = 'geral';
  readonly labelAreaFiltro = (id: string): string =>
    this.areaNomeById.get(id) || id;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaTerceiraService,
    private areaService: AreaVistoriadaService,
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

  setActiveTab(tab: 'geral' | 'escopo' | 'integracao'): void {
    if (tab === 'integracao' && !this.podeConfigurarIntegracao) {
      return;
    }
    this.activeTab = tab;
  }

  override ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.entityId = id;
    }
    void this.loadAreasOptions();
    super.ngOnInit();
  }

  private async loadAreasOptions(): Promise<void> {
    try {
      const areas = await firstValueFrom(this.areaService.getAll(undefined, true));
      this.areaNomeById = new Map(
        (areas ?? []).map((a) => [a.id, a.nome] as const),
      );
      this.areaOptions = (areas ?? [])
        .slice()
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map((a) => a.id);
    } catch {
      this.areaOptions = [];
      this.areaNomeById = new Map();
    }
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
      combustiveisAtendidos: !!raw.ehEmpresaManutencao
        ? [...this.combustiveisSelecionados]
        : [],
      idsAreasAtendidas: !!raw.ehEmpresaManutencao
        ? [...this.areasSelecionadas]
        : [],
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
    this.combustiveisSelecionados = [...(item.combustiveisAtendidos ?? [])];
    this.areasSelecionadas = [...(item.idsAreasAtendidas ?? [])];
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
