import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfiguracaoService } from '../../services/configuracao.service';
import { AuthService } from '../../services/auth.service';
import {
  FluxoTelaConfiguracao,
  TempoFaixaConfig,
  TempoFluxoConfig,
} from '../../models/configuracao.model';
import { Permission } from '../../models/usuario.model';

@Component({
  selector: 'app-configuracao-tempo-fluxo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracao-tempo-fluxo.component.html',
  styleUrls: ['./configuracao-tempo-fluxo.component.css'],
})
export class ConfiguracaoTempoFluxoComponent implements OnInit {
  private configuracaoService = inject(ConfiguracaoService);
  private authService = inject(AuthService);

  loading = false;
  error: string | null = null;
  success: string | null = null;
  abaFluxoSelecionada: FluxoTelaConfiguracao = 'tratamento';
  tempoFluxoConfig: TempoFluxoConfig = this.getDefaultTempoFluxoConfig();

  canCreateFaixa = this.authService.hasPermission(Permission.CONFIGURACAO_TEMPO_FLUXO_CREATE);
  canUpdateFaixa = this.authService.hasPermission(Permission.CONFIGURACAO_TEMPO_FLUXO_UPDATE);
  canDeleteFaixa = this.authService.hasPermission(Permission.CONFIGURACAO_TEMPO_FLUXO_DELETE);

  ngOnInit(): void {
    this.loading = true;
    this.configuracaoService.getTempoFluxoConfig().subscribe({
      next: (config) => {
        this.tempoFluxoConfig = this.normalizeTempoFluxoConfig(config);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Não foi possível carregar a configuração de tempo do fluxo.';
      },
    });
  }

  salvar(): void {
    if (!this.canSave) {
      this.error = 'Você não possui permissão para salvar alterações nesta configuração.';
      return;
    }

    this.error = null;
    this.success = null;

    const erros = this.validarTempoFluxoConfig();
    if (erros.length) {
      this.error = `Configuração inválida: ${erros[0]}`;
      return;
    }

    this.loading = true;
    this.configuracaoService.updateTempoFluxoConfig(this.tempoFluxoConfig).subscribe({
      next: (config) => {
        this.tempoFluxoConfig = this.normalizeTempoFluxoConfig(config);
        this.loading = false;
        this.success = 'Configuração de tempo do fluxo salva com sucesso!';
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message ||
          'Não foi possível salvar a configuração de tempo do fluxo.';
      },
    });
  }

  getAbasFluxo(): Array<{ id: FluxoTelaConfiguracao; label: string }> {
    return [
      { id: 'tratamento', label: 'Tratamento' },
      { id: 'manutencao', label: 'Manutenção' },
      { id: 'validacaoFinal', label: 'Validação Final' },
    ];
  }

  getFaixasAtuais(): TempoFaixaConfig[] {
    return this.tempoFluxoConfig[this.abaFluxoSelecionada] ?? [];
  }

  adicionarFaixa(): void {
    if (!this.canCreateFaixa) return;
    const faixas = this.getFaixasAtuais();
    const ultimoMax = faixas.length > 0 ? (faixas[faixas.length - 1].maxHoras ?? 0) : 0;
    faixas.push({
      minHoras: ultimoMax,
      maxHoras: null,
      label: '',
      corHex: '#64748b',
      mostrarCor: false,
      mostrarRotulo: false,
      ativo: true,
    });
  }

  removerFaixa(index: number): void {
    if (!this.canDeleteFaixa) return;
    const faixas = this.getFaixasAtuais();
    faixas.splice(index, 1);
  }

  restaurarPadrao(): void {
    if (!this.canUpdateFaixa) return;
    this.tempoFluxoConfig = this.getDefaultTempoFluxoConfig();
    this.error = null;
    this.success = null;
  }

  get canSave(): boolean {
    return this.canCreateFaixa || this.canUpdateFaixa || this.canDeleteFaixa;
  }

  getErrosTempoDaAbaAtual(): string[] {
    const tela =
      this.abaFluxoSelecionada === 'tratamento'
        ? 'Tratamento'
        : this.abaFluxoSelecionada === 'manutencao'
          ? 'Manutenção'
          : 'Validação Final';
    return this.validarFaixas(this.getFaixasAtuais(), tela);
  }

  private getDefaultTempoFluxoConfig(): TempoFluxoConfig {
    const base: TempoFaixaConfig[] = [
      {
        minHoras: 0,
        maxHoras: 24,
        label: '',
        corHex: '#64748b',
        mostrarCor: false,
        mostrarRotulo: false,
        ativo: true,
      },
      {
        minHoras: 24,
        maxHoras: 72,
        label: 'Atenção',
        corHex: '#f59e0b',
        mostrarCor: true,
        mostrarRotulo: true,
        ativo: true,
      },
      {
        minHoras: 72,
        maxHoras: null,
        label: 'Crítico',
        corHex: '#ef4444',
        mostrarCor: true,
        mostrarRotulo: true,
        ativo: true,
      },
    ];

    const clone = () => base.map((f) => ({ ...f }));
    return {
      tratamento: clone(),
      manutencao: clone(),
      validacaoFinal: clone(),
    };
  }

  private normalizeTempoFluxoConfig(input?: TempoFluxoConfig): TempoFluxoConfig {
    if (!input) {
      return this.getDefaultTempoFluxoConfig();
    }

    const normalizeFaixas = (faixas: TempoFaixaConfig[] | undefined): TempoFaixaConfig[] => {
      if (!Array.isArray(faixas) || faixas.length === 0) {
        return [];
      }
      return faixas.map((faixa) => ({
        minHoras: Number(faixa.minHoras) || 0,
        maxHoras:
          faixa.maxHoras === null || faixa.maxHoras === undefined ? null : Number(faixa.maxHoras),
        label: (faixa.label ?? '').toString(),
        corHex: faixa.corHex || '#64748b',
        mostrarCor: !!faixa.mostrarCor,
        mostrarRotulo: !!faixa.mostrarRotulo,
        ativo: faixa.ativo === undefined ? true : !!faixa.ativo,
      }));
    };

    const normalized: TempoFluxoConfig = {
      tratamento: normalizeFaixas(input.tratamento),
      manutencao: normalizeFaixas(input.manutencao),
      validacaoFinal: normalizeFaixas(input.validacaoFinal),
    };

    if (
      !normalized.tratamento.length ||
      !normalized.manutencao.length ||
      !normalized.validacaoFinal.length
    ) {
      return this.getDefaultTempoFluxoConfig();
    }
    return normalized;
  }

  private validarTempoFluxoConfig(): string[] {
    const erros: string[] = [];
    erros.push(...this.validarFaixas(this.tempoFluxoConfig.tratamento, 'Tratamento'));
    erros.push(...this.validarFaixas(this.tempoFluxoConfig.manutencao, 'Manutenção'));
    erros.push(...this.validarFaixas(this.tempoFluxoConfig.validacaoFinal, 'Validação Final'));
    return erros;
  }

  private validarFaixas(faixas: TempoFaixaConfig[], tela: string): string[] {
    const erros: string[] = [];
    if (!Array.isArray(faixas) || faixas.length === 0) {
      return [`${tela}: adicione ao menos uma faixa.`];
    }

    const ativas: Array<{ faixa: TempoFaixaConfig; index: number }> = [];
    for (let i = 0; i < faixas.length; i++) {
      const faixa = faixas[i];
      const min = Number(faixa.minHoras);
      const max =
        faixa.maxHoras === null || faixa.maxHoras === undefined ? null : Number(faixa.maxHoras);

      if (!Number.isFinite(min) || min < 0) {
        erros.push(`${tela}: faixa ${i + 1} com início inválido.`);
      }
      if (max !== null && (!Number.isFinite(max) || max <= min)) {
        erros.push(`${tela}: faixa ${i + 1} com fim inválido (deve ser maior que início).`);
      }
      if (faixa.mostrarRotulo && !(faixa.label || '').trim()) {
        erros.push(`${tela}: faixa ${i + 1} marcada para exibir rótulo, mas sem texto.`);
      }
      if (faixa.mostrarCor && !/^#[0-9A-Fa-f]{6}$/.test((faixa.corHex || '').trim())) {
        erros.push(`${tela}: faixa ${i + 1} com cor inválida.`);
      }
      if (faixa.ativo) {
        ativas.push({ faixa, index: i });
      }
    }

    if (ativas.length === 0) {
      erros.push(`${tela}: mantenha pelo menos uma faixa ativa.`);
      return erros;
    }

    const ordenadas = ativas
      .map((item) => ({
        index: item.index,
        min: Number(item.faixa.minHoras),
        max:
          item.faixa.maxHoras === null || item.faixa.maxHoras === undefined
            ? null
            : Number(item.faixa.maxHoras),
      }))
      .sort((a, b) => a.min - b.min);

    for (let i = 1; i < ordenadas.length; i++) {
      const prev = ordenadas[i - 1];
      const curr = ordenadas[i];
      if (prev.max === null || curr.min < prev.max) {
        erros.push(
          `${tela}: faixas ${prev.index + 1} e ${curr.index + 1} estão sobrepostas.`,
        );
      }
    }

    return erros;
  }
}
