import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracaoService } from '../../services/configuracao.service';
import { Configuracao, MobileAppVersionCatalogItem } from '../../models/configuracao.model';

@Component({
  selector: 'app-configuracao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.css']
})
export class ConfiguracaoComponent implements OnInit {
  private configuracaoService = inject(ConfiguracaoService);
  private fb = inject(FormBuilder);

  configuracao: Configuracao | null = null;
  form: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  logoPreview: string | null = null;
  activeTab: 'sistema' | 'email' | 'erp' | 'vistoria' | 'app' = 'sistema';
  showErpApiKey = false;
  erpApiKeyConfigured = false;
  erpApiKeyLoading = false;
  removingMobileVersion: string | null = null;
  readonly odometroDiffMaxKmPadrao = 500;
  mobileVersoesCatalogo: MobileAppVersionCatalogItem[] = [];
  private readonly semverPattern = /^\d+\.\d+\.\d+$/;

  constructor() {
    this.form = this.fb.group({
      nomeCliente: ['', Validators.required],
      logoRelatorio: [null],
      // Configurações de Auditoria
      auditarConsultas: [true],
      auditarLoginLogOff: [true],
      auditarCriacao: [true],
      auditarAlteracao: [true],
      auditarExclusao: [true],
      auditarSenhaAlterada: [true],
      emailAtivo: [false],
      emailHost: [''],
      emailPorta: [587],
      emailUsuario: [''],
      emailSenha: [''],
      emailUsarTls: [true],
      emailRemetenteNome: [''],
      emailRemetenteEmail: [''],
      emailAssuntoPadrao: ['Relatório de Ordem de Serviço'],
      erpAtivo: [false],
      erpUrl: [''],
      erpTenant: ['SISTEMA_VISTORIA'],
      erpApiKey: [''],
      erpLocalAbertura: [1],
      erpTipoPedido: [0],
      erpMensagemErroPadrao: [''],
      erpTimeoutMs: [30000],
      odometroDiffMaxKm: [500],
      mobileVersaoMinima: [''],
    });
  }

  /** Opções do combo: catálogo + valor salvo se ainda não estiver na lista. */
  get mobileVersaoOpcoes(): MobileAppVersionCatalogItem[] {
    const selected = (this.form.get('mobileVersaoMinima')?.value ?? '')
      .toString()
      .trim();
    const byVersion = new Map<string, MobileAppVersionCatalogItem>();
    for (const item of this.mobileVersoesCatalogo) {
      byVersion.set(item.version, item);
    }
    if (selected && this.semverPattern.test(selected) && !byVersion.has(selected)) {
      byVersion.set(selected, { version: selected, date: null });
    }
    return Array.from(byVersion.values()).sort((a, b) =>
      this.compareSemverDesc(a.version, b.version),
    );
  }

  formatMobileVersionLabel(item: MobileAppVersionCatalogItem): string {
    const data = this.formatCatalogDate(item.date);
    return data ? `${item.version} — ${data}` : item.version;
  }

  formatCatalogDate(isoDate: string | null | undefined): string {
    const raw = isoDate?.trim();
    if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return '';
    }
    const [ano, mes, dia] = raw.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private compareSemverDesc(a: string, b: string): number {
    const pa = a.split('.').map((n) => Number.parseInt(n, 10) || 0);
    const pb = b.split('.').map((n) => Number.parseInt(n, 10) || 0);
    for (let i = 0; i < 3; i++) {
      if (pa[i] !== pb[i]) {
        return pb[i] - pa[i];
      }
    }
    return 0;
  }

  private applyCatalog(
    items: MobileAppVersionCatalogItem[] | undefined | null,
  ): void {
    this.mobileVersoesCatalogo = (items ?? []).map((item) =>
      typeof item === 'string'
        ? { version: item, date: null }
        : {
            version: item.version,
            date: item.date ?? null,
          },
    );
  }

  ngOnInit() {
    this.loading = true;
    this.configuracaoService.getConfiguracao().subscribe({
      next: (config) => {
        this.configuracao = config;
        this.applyCatalog(config.mobileVersoesCatalogo);
        this.form.patchValue({
          nomeCliente: config.nomeCliente,
          // Configurações de Auditoria
          auditarConsultas: config.auditarConsultas ?? true,
          auditarLoginLogOff: config.auditarLoginLogOff ?? true,
          auditarCriacao: config.auditarCriacao ?? true,
          auditarAlteracao: config.auditarAlteracao ?? true,
          auditarExclusao: config.auditarExclusao ?? true,
          auditarSenhaAlterada: config.auditarSenhaAlterada ?? true,
          emailAtivo: config.emailEnvioConfig?.ativo ?? false,
          emailHost: config.emailEnvioConfig?.host ?? '',
          emailPorta: config.emailEnvioConfig?.porta ?? 587,
          emailUsuario: config.emailEnvioConfig?.usuario ?? '',
          emailSenha: config.emailEnvioConfig?.senha ?? '',
          emailUsarTls: config.emailEnvioConfig?.usarTls ?? true,
          emailRemetenteNome: config.emailEnvioConfig?.remetenteNome ?? '',
          emailRemetenteEmail: config.emailEnvioConfig?.remetenteEmail ?? '',
          emailAssuntoPadrao:
            config.emailEnvioConfig?.assuntoPadrao ?? 'Relatório de Ordem de Serviço',
          erpAtivo: config.erpVistoriaConfig?.ativo ?? false,
          erpUrl: config.erpVistoriaConfig?.url ?? '',
          erpTenant: config.erpVistoriaConfig?.tenant ?? 'SISTEMA_VISTORIA',
          erpApiKey: '',
          erpLocalAbertura: config.erpVistoriaConfig?.localAbertura ?? 1,
          erpTipoPedido: config.erpVistoriaConfig?.tipoPedido ?? 0,
          erpMensagemErroPadrao: config.erpVistoriaConfig?.mensagemErroPadrao ?? '',
          erpTimeoutMs: config.erpVistoriaConfig?.timeoutMs ?? 30000,
          odometroDiffMaxKm:
            config.odometroDiffMaxKm ?? this.odometroDiffMaxKmPadrao,
          mobileVersaoMinima: config.mobileVersaoMinima ?? '',
        });
        this.showErpApiKey = false;
        this.erpApiKeyConfigured = !!config.erpVistoriaConfig?.apiKeyConfigured;
        this.aplicarLogoPreview(config.logoRelatorio);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) {
      this.form.patchValue({ logoRelatorio: file });
      const reader = new FileReader();
      reader.onload = e => this.logoPreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.error = null;
    this.success = null;
    if (this.form.invalid) {
      this.error = 'Formulário inválido. Preencha todos os campos obrigatórios.';
      return;
    }
    const erpAtivo = !!this.form.value.erpAtivo;
    const erpUrl = (this.form.value.erpUrl ?? '').trim();
    const erpTenant = (this.form.value.erpTenant ?? '').trim();
    const erpApiKey = this.chaveErpInformada(this.form.value.erpApiKey);
    if (erpAtivo && (!erpUrl || !erpTenant || (!erpApiKey && !this.erpApiKeyConfigured))) {
      this.error =
        'Com o envio ao ERP ativo, preencha URL, tenant e API Key.';
      return;
    }
    this.loading = true;
    const formData = new FormData();
    formData.append('nomeCliente', this.form.value.nomeCliente);
    if (this.form.value.logoRelatorio instanceof File) {
      formData.append('logoRelatorio', this.form.value.logoRelatorio);
    }
    // Configurações de Auditoria
    formData.append('auditarConsultas', this.form.value.auditarConsultas.toString());
    formData.append('auditarLoginLogOff', this.form.value.auditarLoginLogOff.toString());
    formData.append('auditarCriacao', this.form.value.auditarCriacao.toString());
    formData.append('auditarAlteracao', this.form.value.auditarAlteracao.toString());
    formData.append('auditarExclusao', this.form.value.auditarExclusao.toString());
    formData.append('auditarSenhaAlterada', this.form.value.auditarSenhaAlterada.toString());
    formData.append(
      'emailEnvioConfig',
      JSON.stringify({
        ativo: !!this.form.value.emailAtivo,
        host: (this.form.value.emailHost ?? '').trim(),
        porta: Number(this.form.value.emailPorta ?? 587),
        usuario: (this.form.value.emailUsuario ?? '').trim() || undefined,
        senha: (this.form.value.emailSenha ?? '').trim() || undefined,
        usarTls: !!this.form.value.emailUsarTls,
        remetenteNome: (this.form.value.emailRemetenteNome ?? '').trim() || undefined,
        remetenteEmail: (this.form.value.emailRemetenteEmail ?? '').trim() || undefined,
        assuntoPadrao: (this.form.value.emailAssuntoPadrao ?? '').trim() || undefined,
      }),
    );
    formData.append(
      'erpVistoriaConfig',
      JSON.stringify({
        ativo: erpAtivo,
        url: erpUrl,
        tenant: erpTenant || 'SISTEMA_VISTORIA',
        apiKey: erpApiKey || undefined,
        localAbertura: Number(this.form.value.erpLocalAbertura ?? 1),
        tipoPedido: Number(this.form.value.erpTipoPedido ?? 0),
        mensagemErroPadrao:
          (this.form.value.erpMensagemErroPadrao ?? '').trim() || undefined,
        timeoutMs: Number(this.form.value.erpTimeoutMs ?? 30000),
      }),
    );
    const odometroDiffRaw = this.form.value.odometroDiffMaxKm;
    if (
      odometroDiffRaw === null ||
      odometroDiffRaw === undefined ||
      odometroDiffRaw === ''
    ) {
      formData.append('odometroDiffMaxKm', '');
    } else {
      formData.append('odometroDiffMaxKm', String(Number(odometroDiffRaw)));
    }
    formData.append(
      'mobileVersaoMinima',
      (this.form.value.mobileVersaoMinima ?? '').toString().trim(),
    );
    const handleError = (err: any) => {
      this.loading = false;
      this.success = null;
      this.error = 'Erro ao salvar configuração: ' + (err?.error?.message || err?.message || err?.statusText || 'Erro desconhecido');
    };
    const handleSuccess = (config: Configuracao) => {
      this.configuracao = config;
      if (config.mobileVersoesCatalogo?.length) {
        this.applyCatalog(config.mobileVersoesCatalogo);
      }
      this.form.patchValue({
        erpApiKey: '',
        mobileVersaoMinima: config.mobileVersaoMinima ?? '',
        odometroDiffMaxKm:
          config.odometroDiffMaxKm ?? this.odometroDiffMaxKmPadrao,
      });
      this.showErpApiKey = false;
      this.erpApiKeyConfigured = !!config.erpVistoriaConfig?.apiKeyConfigured;
      this.aplicarLogoPreview(config.logoRelatorio);
      this.loading = false;
      this.error = null;
      this.success = 'Configuração salva com sucesso!';
    };
    if (this.configuracao) {
      this.configuracaoService.updateConfiguracao(this.configuracao.id, formData).subscribe({
        next: handleSuccess,
        error: handleError
      });
    } else {
      this.configuracaoService.createConfiguracao(formData).subscribe({
        next: handleSuccess,
        error: handleError
      });
    }
  }

  toggleErpApiKeyVisibility(): void {
    if (this.showErpApiKey) {
      this.showErpApiKey = false;
      return;
    }
    const atual = this.chaveErpInformada(this.form.value.erpApiKey);
    if (atual) {
      this.showErpApiKey = true;
      return;
    }
    if (!this.erpApiKeyConfigured) {
      this.showErpApiKey = true;
      return;
    }
    this.erpApiKeyLoading = true;
    this.configuracaoService.getErpApiKey().subscribe({
      next: (resposta) => {
        this.erpApiKeyConfigured = !!resposta.configurada;
        if (resposta.apiKey) {
          this.form.patchValue({ erpApiKey: resposta.apiKey });
        }
        this.showErpApiKey = true;
        this.erpApiKeyLoading = false;
      },
      error: () => {
        this.erpApiKeyLoading = false;
        this.error = 'Não foi possível carregar a API Key salva.';
        this.showErpApiKey = true;
      },
    });
  }

  private chaveErpInformada(valor?: string | null): string {
    const texto = (valor ?? '').trim();
    if (!texto || /^\*+$/.test(texto)) {
      return '';
    }
    return texto;
  }

  private aplicarLogoPreview(_logoRelatorio?: string | null): void {
    this.configuracaoService.getLogoRelatorio().subscribe({
      next: (resposta) => {
        this.logoPreview = resposta.dataUrl || null;
      },
      error: () => {
        this.logoPreview = null;
      },
    });
  }

  removerVersaoCatalogo(version: string): void {
    const alvo = version.trim();
    if (!alvo || this.removingMobileVersion) {
      return;
    }
    const confirmar = window.confirm(
      `Remover a versão ${alvo} do catálogo?\nEla deixará de aparecer no combo. Se for a versão mínima atual, o bloqueio será desativado.`,
    );
    if (!confirmar) {
      return;
    }
    this.removingMobileVersion = alvo;
    this.error = null;
    this.success = null;
    this.configuracaoService.removeMobileVersaoCatalogo(alvo).subscribe({
      next: (res) => {
        this.applyCatalog(res.mobileVersoesCatalogo);
        this.form.patchValue({
          mobileVersaoMinima: res.mobileVersaoMinima ?? '',
        });
        this.removingMobileVersion = null;
        this.success = `Versão ${alvo} removida do catálogo.`;
      },
      error: (err) => {
        this.removingMobileVersion = null;
        this.error =
          'Erro ao remover versão: ' +
          (err?.error?.message || err?.message || err?.statusText || 'Erro desconhecido');
      },
    });
  }
}
