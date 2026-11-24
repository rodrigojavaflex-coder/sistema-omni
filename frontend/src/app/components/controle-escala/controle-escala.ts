import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, from, of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ControleEscalaService } from '../../services/controle-escala.service';
import { ConfiguracaoService } from '../../services/configuracao.service';
import {
  AutonomiaResumoView,
  EscalaPainelItem,
  EscalaPainelResponse,
  EscalaTurno,
  OsRetencaoResponse,
} from '../../models/controle-escala.model';
import { Permission } from '../../models/usuario.model';
import { exigePercentualNivel } from '../../models/combustivel.enum';
import { Veiculo } from '../../models/veiculo.model';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { ErrorModalService } from '../../services/error-modal.service';

export interface TurnoGrupoView {
  grupo: string;
  alocacao: string | null;
  tarefa: string | null;
  tipoViagem: string | null;
  km: number | null;
  numeroViagem: string | null;
}

export type EscalaAlertaFiltro =
  | ''
  | 'retido'
  | 'carregamento'
  | 'conflito';

export type EscalaSortColumn =
  | 'veiculo'
  | 'turno'
  | 'inicio'
  | 'fim'
  | 'ateLargada'
  | 'entreTurnos'
  | 'kmTurno'
  | 'kmDia'
  | 'grupo'
  | 'alocacao'
  | 'tarefa'
  | 'tipo'
  | 'pct'
  | 'telemetria'
  | 'sistema'
  | 'alertas';

export interface EscalaTurnoRow {
  key: string;
  item: EscalaPainelItem;
  turnoChave: string;
  turnoRotulo: string;
  kmTurno: number;
  horarioInicio: string | null;
  horarioFim: string | null;
  grupos: TurnoGrupoView[];
  alertaAutonomiaTurno: boolean;
  /** Mesmo veículo OMNI em mais de uma linha INFOBUS no mesmo turno. */
  alertaConflitoVeiculoTurno: boolean;
  /** Tempo restante até o início do turno (largada). */
  tempoAteLargada: string | null;
  /** Intervalo do fim deste turno até o início do próximo (mesmo veículo). */
  tempoEntreTurnos: string | null;
}

export interface ConflitoVeiculoLinhaView {
  prefixo: string;
  descricao: string;
  combustivel: string;
  placa: string | null;
  substituido: boolean;
  horarioInicio: string | null;
  horarioFim: string | null;
  grupos: string;
  alocacoes: string;
  tarefas: string;
}

export interface ConflitoVeiculoResumoView {
  idVeiculo: string;
  veiculo: string;
  placa: string | null;
  combustivel: string | null;
  turnoChave: string;
  turnoRotulo: string;
  linhas: ConflitoVeiculoLinhaView[];
}

@Component({
  selector: 'app-controle-escala',
  standalone: true,
  imports: [CommonModule, FormsModule, VeiculoAutocompleteComponent],
  templateUrl: './controle-escala.html',
  styleUrls: ['./controle-escala.css'],
})
export class ControleEscalaComponent implements OnInit, OnDestroy {
  private readonly escalaService = inject(ControleEscalaService);
  private readonly configuracaoService = inject(ConfiguracaoService);
  private readonly authService = inject(AuthService);
  private readonly errorModalService = inject(ErrorModalService);

  readonly canSync = this.authService.hasPermission(Permission.CONTROLE_ESCALA_SYNC);
  readonly canTrocarVeiculo = this.authService.hasPermission(
    Permission.CONTROLE_ESCALA_TROCAR_VEICULO,
  );

  data = this.hojeIso();
  /** Turno obrigatório — sem seleção a grade não exibe. */
  turnoFiltro = signal('');
  /** Mesmo padrão da tela Tratamento: filtro por id do veículo via autocomplete. */
  veiculoFiltroId = signal('');
  combustivelFiltro = signal('');
  grupoFiltro = signal('');
  alocacaoFiltro = signal('');
  tarefaFiltro = signal('');
  tipoFiltro = signal('');
  /** Filtro de alertas: retido | carregamento | conflito (veículo em 2+ linhas). */
  alertaFiltro = signal<EscalaAlertaFiltro>('');
  sortColumn = signal<EscalaSortColumn>('veiculo');
  sortDir = signal<'asc' | 'desc'>('asc');
  loading = signal(false);
  syncing = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  painel = signal<EscalaPainelResponse | null>(null);
  /** Tick para recalcular «até largada» sem recarregar o painel. */
  private readonly agoraMs = signal(Date.now());
  private agoraTimer: ReturnType<typeof setInterval> | null = null;

  showRetencaoModal = signal(false);
  loadingRetencao = signal(false);
  printingRetencao = signal(false);
  retencao = signal<OsRetencaoResponse | null>(null);

  showAutonomiaModal = signal(false);
  autonomiaResumo = signal<AutonomiaResumoView | null>(null);

  showConflitoModal = signal(false);
  conflitoResumo = signal<ConflitoVeiculoResumoView | null>(null);

  showTrocaVeiculoModal = signal(false);
  trocaVeiculoLoading = signal(false);
  trocaVeiculoItem = signal<EscalaPainelItem | null>(null);
  trocaVeiculoIdSelecionado = signal<string | null>(null);
  printingEscala = signal(false);
  printingCarregamento = signal(false);
  /** Prefixo INFOBUS em refresh pontual de telemetria. */
  refreshingTelemetriaPrefixo = signal<string | null>(null);

  readonly opcoesTurno = computed(() => {
    const set = new Set<string>();
    for (const item of this.painel()?.itens ?? []) {
      for (const t of item.turnos ?? []) {
        set.add(this.chaveTurno(t));
      }
      if (!(item.turnos ?? []).length) {
        set.add('Sem turno');
      }
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true }),
    );
  });

  readonly opcoesCombustivel = computed(() => {
    const set = new Set<string>();
    for (const item of this.painel()?.itens ?? []) {
      const c = item.combustivel?.trim();
      if (c) {
        set.add(c);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  });

  readonly opcoesGrupo = computed(() => {
    const set = new Set<string>();
    for (const item of this.painel()?.itens ?? []) {
      for (const t of item.turnos ?? []) {
        const nome = (t.grupo ?? '').trim();
        if (nome) {
          set.add(nome);
        }
      }
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true }),
    );
  });

  readonly opcoesAlocacao = computed(() => {
    const set = new Set<string>();
    for (const item of this.painel()?.itens ?? []) {
      for (const t of item.turnos ?? []) {
        const nome = (t.alocacao ?? '').trim();
        if (nome) {
          set.add(nome);
        }
      }
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true }),
    );
  });

  readonly opcoesTarefa = computed(() => {
    const set = new Set<string>();
    for (const item of this.painel()?.itens ?? []) {
      for (const t of item.turnos ?? []) {
        const nome = (t.tarefa ?? '').trim();
        if (nome) {
          set.add(nome);
        }
      }
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true }),
    );
  });

  readonly opcoesTipo = computed(() => {
    const set = new Set<string>();
    for (const item of this.painel()?.itens ?? []) {
      for (const t of item.turnos ?? []) {
        const nome = (t.tipoViagem ?? '').trim();
        if (nome) {
          set.add(nome);
        }
      }
    }
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, 'pt-BR', { numeric: true }),
    );
  });

  /** Uma linha por (veículo × turno); exige turno selecionado. */
  readonly linhasTabela = computed((): EscalaTurnoRow[] => {
    const agora = this.agoraMs();
    const dataEscala = this.data;
    const itens = this.painel()?.itens ?? [];
    const turnoFiltro = this.turnoFiltro();
    const veiculoFiltroId = this.veiculoFiltroId();
    const combustivelFiltro = this.combustivelFiltro();
    const grupoFiltro = this.grupoFiltro();
    const alocacaoFiltro = this.alocacaoFiltro();
    const tarefaFiltro = this.tarefaFiltro();
    const tipoFiltro = this.tipoFiltro();
    const alertaFiltro = this.alertaFiltro();
    const sortColumn = this.sortColumn();
    const sortDir = this.sortDir();

    if (!turnoFiltro) {
      return [];
    }

    // Conflito usa o universo completo do turno (antes dos demais filtros).
    const idsConflito = this.idsVeiculoEmConflitoNoTurno(itens, turnoFiltro);
    const rows: EscalaTurnoRow[] = [];

    for (const item of itens) {
      const porTurno = new Map<string, EscalaTurno[]>();
      const turnos = item.turnos ?? [];
      if (!turnos.length) {
        porTurno.set('Sem turno', []);
      } else {
        for (const t of turnos) {
          const chave = this.chaveTurno(t);
          const lista = porTurno.get(chave) ?? [];
          lista.push(t);
          porTurno.set(chave, lista);
        }
      }

      const chaves = Array.from(porTurno.keys()).sort((a, b) =>
        a.localeCompare(b, 'pt-BR', { numeric: true }),
      );

      const rowsVeiculo: EscalaTurnoRow[] = [];
      for (const chave of chaves) {
        const turnosDoGrupo = porTurno.get(chave) ?? [];
        const grupos = this.gruposUnicosDoTurno(turnosDoGrupo);
        const kmTurno = turnosDoGrupo.reduce(
          (acc, t) =>
            acc + (t.km != null && Number.isFinite(Number(t.km)) ? Number(t.km) : 0),
          0,
        );
        const { inicio, fim } = this.horariosDoTurno(turnosDoGrupo);
        const alertaAutonomiaTurno = this.avaliarAutonomiaTurno(item, kmTurno);
        const idVeiculo = item.idVeiculo?.trim() || '';
        rowsVeiculo.push({
          key: `${item.prefixo}::${chave}`,
          item,
          turnoChave: chave,
          turnoRotulo: this.rotuloTurno(chave),
          kmTurno,
          horarioInicio: inicio,
          horarioFim: fim,
          grupos,
          alertaAutonomiaTurno,
          alertaConflitoVeiculoTurno:
            !!idVeiculo && idsConflito.has(idVeiculo) && chave === turnoFiltro,
          tempoAteLargada: this.rotuloTempoAteLargada(
            dataEscala,
            inicio,
            fim,
            agora,
          ),
          tempoEntreTurnos: null,
        });
      }

      rowsVeiculo.sort((a, b) =>
        this.compararHorarioTurno(
          a.horarioInicio,
          b.horarioInicio,
          a.turnoChave,
          b.turnoChave,
        ),
      );
      // Intervalo usa a sequência completa do veículo (mesmo com filtro de turno).
      this.aplicarTempoEntreTurnos(rowsVeiculo, dataEscala);

      for (const row of rowsVeiculo) {
        if (row.turnoChave !== turnoFiltro) {
          continue;
        }
        if (veiculoFiltroId && row.item.idVeiculo !== veiculoFiltroId) {
          continue;
        }
        if (
          combustivelFiltro &&
          (row.item.combustivel ?? '') !== combustivelFiltro
        ) {
          continue;
        }
        if (grupoFiltro && !row.grupos.some((g) => g.grupo === grupoFiltro)) {
          continue;
        }
        if (
          alocacaoFiltro &&
          !row.grupos.some((g) => (g.alocacao ?? '') === alocacaoFiltro)
        ) {
          continue;
        }
        if (
          tarefaFiltro &&
          !row.grupos.some((g) => (g.tarefa ?? '') === tarefaFiltro)
        ) {
          continue;
        }
        if (
          tipoFiltro &&
          !row.grupos.some((g) => (g.tipoViagem ?? '') === tipoFiltro)
        ) {
          continue;
        }
        rows.push(row);
      }
    }

    let filtradas = rows;
    if (alertaFiltro === 'retido') {
      filtradas = rows.filter((r) => r.item.alertaRetidoNaEscala);
    } else if (alertaFiltro === 'carregamento') {
      filtradas = rows.filter((r) => r.alertaAutonomiaTurno);
    } else if (alertaFiltro === 'conflito') {
      filtradas = rows.filter((r) => r.alertaConflitoVeiculoTurno);
    }

    return this.ordenarLinhasTabela(filtradas, sortColumn, sortDir);
  });

  onDataChange(valor: string): void {
    this.data = valor || this.hojeIso();
    this.turnoFiltro.set('');
    this.carregar();
  }

  onTurnoFiltroChange(valor: string): void {
    this.turnoFiltro.set((valor ?? '').trim());
  }

  onVeiculoSelected(veiculo: Veiculo): void {
    this.veiculoFiltroId.set(veiculo.id);
  }

  onVeiculoFiltroIdChange(valor: string | null): void {
    this.veiculoFiltroId.set(valor?.trim() || '');
  }

  onCombustivelFiltroChange(valor: string): void {
    this.combustivelFiltro.set(valor ?? '');
  }

  onGrupoFiltroChange(valor: string): void {
    this.grupoFiltro.set(valor ?? '');
  }

  onAlocacaoFiltroChange(valor: string): void {
    this.alocacaoFiltro.set(valor ?? '');
  }

  onTarefaFiltroChange(valor: string): void {
    this.tarefaFiltro.set(valor ?? '');
  }

  onTipoFiltroChange(valor: string): void {
    this.tipoFiltro.set(valor ?? '');
  }

  onAlertaFiltroChange(valor: string): void {
    const v = (valor ?? '').trim();
    if (v === 'retido' || v === 'carregamento' || v === 'conflito') {
      this.alertaFiltro.set(v);
      return;
    }
    this.alertaFiltro.set('');
  }

  ordenarPor(coluna: EscalaSortColumn): void {
    if (this.sortColumn() === coluna) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
      return;
    }
    this.sortColumn.set(coluna);
    this.sortDir.set('asc');
  }

  ariaSort(coluna: EscalaSortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== coluna) {
      return 'none';
    }
    return this.sortDir() === 'asc' ? 'ascending' : 'descending';
  }

  ngOnInit(): void {
    this.carregar();
    this.agoraTimer = setInterval(() => this.agoraMs.set(Date.now()), 30_000);
  }

  ngOnDestroy(): void {
    if (this.agoraTimer != null) {
      clearInterval(this.agoraTimer);
      this.agoraTimer = null;
    }
  }

  carregar(): void {
    if (!this.data?.trim()) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.escalaService.getPainel(this.data).subscribe({
      next: (res) => {
        this.painel.set(res);
        this.sanitizarFiltros();
        this.garantirTurnoSelecionado();
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.painel.set(null);
        this.turnoFiltro.set('');
        this.error.set(
          err?.error?.message || err?.message || 'Erro ao carregar o painel.',
        );
      },
    });
  }

  sincronizarEscala(): void {
    if (!this.canSync || this.syncing() || this.refreshingTelemetriaPrefixo()) {
      return;
    }
    this.syncing.set(true);
    this.error.set(null);
    this.success.set(null);
    this.escalaService.syncEscala(this.data).subscribe({
      next: (res) => {
        this.syncing.set(false);
        this.success.set(
          `Escala atualizada: ${res.upserts} veículo(s), ${res.semVinculo} sem vínculo OMNI.`,
        );
        this.carregar();
      },
      error: (err) => {
        this.syncing.set(false);
        this.error.set(
          err?.error?.message || err?.message || 'Falha ao sincronizar escala.',
        );
      },
    });
  }

  sincronizarTelemetria(): void {
    if (!this.canSync || this.syncing() || this.refreshingTelemetriaPrefixo()) {
      return;
    }
    this.syncing.set(true);
    this.error.set(null);
    this.success.set(null);
    this.escalaService.syncTelemetria().subscribe({
      next: (res) => {
        this.syncing.set(false);
        this.success.set(
          `Telemetria sincronizada: ${res.upserts} veículo(s), ${res.semVinculo} sem vínculo OMNI.`,
        );
        this.carregar();
      },
      error: (err) => {
        this.syncing.set(false);
        this.error.set(
          err?.error?.message ||
            err?.message ||
            'Falha ao sincronizar telemetria.',
        );
      },
    });
  }

  atualizarTelemetriaVeiculo(item: EscalaPainelItem, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    const prefixoLinha = (item.prefixo ?? '').trim();
    // Após troca manual, BRT usa o prefixo do veículo OMNI atual (descricao),
    // não o prefixo INFOBUS da linha (ex.: 1220 → 1001).
    const prefixoBrt = this.prefixoTelemetriaBrt(item);
    if (
      !this.canSync ||
      !prefixoBrt ||
      this.syncing() ||
      this.refreshingTelemetriaPrefixo()
    ) {
      return;
    }
    this.refreshingTelemetriaPrefixo.set(prefixoLinha || prefixoBrt);
    this.error.set(null);
    this.success.set(null);
    this.escalaService
      .syncTelemetria({
        prefixo: prefixoBrt,
        idVeiculo: item.idVeiculo ?? undefined,
      })
      .subscribe({
        next: (res) => {
          this.refreshingTelemetriaPrefixo.set(null);
          if (res.encontrado === false || res.upserts < 1) {
            this.errorModalService.show(
              `Nenhuma telemetria retornada pela BRT para o veículo ${item.descricao || prefixoBrt}.`,
              'Atenção',
            );
            return;
          }
          this.success.set(
            `Telemetria atualizada: ${item.descricao || prefixoBrt}.`,
          );
          this.carregar();
        },
        error: (err) => {
          this.refreshingTelemetriaPrefixo.set(null);
          this.errorModalService.show(
            err?.error?.message ||
              err?.message ||
              'Falha ao atualizar telemetria do veículo.',
            'Erro',
          );
        },
      });
  }

  /** Prefixo usado na BRT: veículo OMNI atual se houver substituição; senão prefixo INFOBUS. */
  private prefixoTelemetriaBrt(item: EscalaPainelItem): string {
    const prefixoLinha = this.normalizarPrefixoLocal(item.prefixo);
    if (item.veiculoSubstituidoManual) {
      const doVeiculo = this.normalizarPrefixoLocal(item.descricao);
      return doVeiculo || prefixoLinha;
    }
    return prefixoLinha;
  }

  private normalizarPrefixoLocal(
    valor: string | number | null | undefined,
  ): string {
    return String(valor ?? '')
      .trim()
      .replace(/^0+(?=\d)/, '');
  }

  chaveTurno(t: EscalaTurno): string {
    const nome = t.nomeTurno?.trim();
    if (nome) {
      return nome;
    }
    return 'Sem turno';
  }

  rotuloTurno(chave: string): string {
    return chave === 'Sem turno' ? 'Sem turno' : `Turno ${chave}`;
  }

  abrirOsRetencao(item: EscalaPainelItem, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (!item.idVeiculo || !item.alertaRetidoNaEscala) {
      return;
    }
    this.showRetencaoModal.set(true);
    this.loadingRetencao.set(true);
    this.retencao.set(null);
    this.escalaService.getOsRetencao(item.idVeiculo).subscribe({
      next: (res) => {
        this.retencao.set(res);
        this.loadingRetencao.set(false);
      },
      error: (err) => {
        this.loadingRetencao.set(false);
        this.showRetencaoModal.set(false);
        this.errorModalService.show(
          err?.error?.message ||
            err?.message ||
            'Não foi possível carregar as OS que retêm o veículo.',
          'Erro',
        );
      },
    });
  }

  fecharOsRetencao(): void {
    if (this.printingRetencao()) {
      return;
    }
    this.showRetencaoModal.set(false);
    this.retencao.set(null);
    this.loadingRetencao.set(false);
  }

  fmtDataHoraSync(valor: string | null | undefined): string {
    if (!valor?.trim()) {
      return '—';
    }
    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) {
      return valor;
    }
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Status da leitura de telemetria do veículo (dataHora da BRT).
   * ≤10 min: ok; >10 e ≤30: warn vermelho; >30: DESATUALIZADO; sem dado: SEM TELEMETRIA.
   */
  statusTelemetriaVeiculo(item: EscalaPainelItem): {
    texto: string;
    nivel: 'ok' | 'warn' | 'critico' | 'sem';
  } {
    void this.agoraMs();
    const raw = item.dataHoraTelemetria?.trim();
    if (!raw) {
      return { texto: 'SEM TELEMETRIA', nivel: 'sem' };
    }
    const ts = new Date(raw).getTime();
    if (Number.isNaN(ts)) {
      return { texto: 'SEM TELEMETRIA', nivel: 'sem' };
    }
    const minutos = Math.max(0, Math.floor((Date.now() - ts) / 60_000));
    if (minutos > 30) {
      return { texto: 'DESATUALIZADO', nivel: 'critico' };
    }
    if (minutos > 10) {
      return {
        texto: `Atualizado a ${minutos} min`,
        nivel: 'warn',
      };
    }
    return {
      texto: `Atualizado a ${minutos} min`,
      nivel: 'ok',
    };
  }

  imprimirRelatorioEscala(): void {
    const rows = this.linhasTabela();
    if (!rows.length || this.printingEscala() || this.printingCarregamento()) {
      return;
    }

    const win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) {
      this.errorModalService.show(
        'Não foi possível abrir o relatório. Verifique o bloqueio de pop-ups.',
        'Atenção',
      );
      return;
    }

    this.printingEscala.set(true);
    win.document.open();
    win.document.write(
      '<html><body><p style="font-family:Arial,sans-serif;padding:24px;color:#64748b">Carregando relatório...</p></body></html>',
    );

    this.carregarLogoRelatorio$().subscribe({
      next: (logoUrl) => {
        try {
          const html = this.montarHtmlRelatorioEscala(rows, logoUrl);
          win.document.open();
          win.document.write(html);
          win.document.close();
          win.focus();
        } catch (err) {
          win.close();
          this.errorModalService.show(
            err instanceof Error
              ? err.message
              : 'Não foi possível gerar o relatório da escala.',
            'Erro',
          );
        } finally {
          this.printingEscala.set(false);
        }
      },
      error: () => {
        try {
          const html = this.montarHtmlRelatorioEscala(rows, null);
          win.document.open();
          win.document.write(html);
          win.document.close();
          win.focus();
        } finally {
          this.printingEscala.set(false);
        }
      },
    });
  }

  imprimirPrevisaoCarregamento(): void {
    if (
      this.printingEscala() ||
      this.printingCarregamento() ||
      !this.turnoFiltro()
    ) {
      return;
    }
    const rows = this.linhasTabela().filter((r) =>
      exigePercentualNivel(r.item.combustivel),
    );
    if (!rows.length) {
      this.errorModalService.show(
        'Não há veículos GNV/Elétrico no turno selecionado para previsão de carregamento.',
        'Atenção',
      );
      return;
    }

    const win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) {
      this.errorModalService.show(
        'Não foi possível abrir o relatório. Verifique o bloqueio de pop-ups.',
        'Atenção',
      );
      return;
    }

    this.printingCarregamento.set(true);
    win.document.open();
    win.document.write(
      '<html><body><p style="font-family:Arial,sans-serif;padding:24px;color:#64748b">Carregando previsão...</p></body></html>',
    );

    this.carregarLogoRelatorio$().subscribe({
      next: (logoUrl) => {
        try {
          const html = this.montarHtmlPrevisaoCarregamento(rows, logoUrl);
          win.document.open();
          win.document.write(html);
          win.document.close();
          win.focus();
        } catch (err) {
          win.close();
          this.errorModalService.show(
            err instanceof Error
              ? err.message
              : 'Não foi possível gerar a previsão de carregamento.',
            'Erro',
          );
        } finally {
          this.printingCarregamento.set(false);
        }
      },
      error: () => {
        try {
          const html = this.montarHtmlPrevisaoCarregamento(rows, null);
          win.document.open();
          win.document.write(html);
          win.document.close();
          win.focus();
        } finally {
          this.printingCarregamento.set(false);
        }
      },
    });
  }

  abrirTrocaVeiculo(item: EscalaPainelItem, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (!this.canTrocarVeiculo || !item.idEscalaDia) {
      return;
    }
    this.trocaVeiculoItem.set(item);
    this.trocaVeiculoIdSelecionado.set(item.idVeiculo);
    this.showTrocaVeiculoModal.set(true);
  }

  fecharTrocaVeiculo(): void {
    if (this.trocaVeiculoLoading()) {
      return;
    }
    this.showTrocaVeiculoModal.set(false);
    this.trocaVeiculoItem.set(null);
    this.trocaVeiculoIdSelecionado.set(null);
  }

  onTrocaVeiculoSelected(veiculo: Veiculo): void {
    this.trocaVeiculoIdSelecionado.set(veiculo.id);
  }

  onTrocaVeiculoIdChange(valor: string | null): void {
    this.trocaVeiculoIdSelecionado.set(valor?.trim() || null);
  }

  confirmarTrocaVeiculo(): void {
    const item = this.trocaVeiculoItem();
    const idNovo = this.trocaVeiculoIdSelecionado()?.trim() || '';
    if (!item?.idEscalaDia || !idNovo || this.trocaVeiculoLoading()) {
      return;
    }
    if (item.idVeiculo && item.idVeiculo === idNovo) {
      this.fecharTrocaVeiculo();
      return;
    }

    this.trocaVeiculoLoading.set(true);
    this.escalaService.trocarVeiculo(item.idEscalaDia, idNovo).subscribe({
      next: () => {
        this.trocaVeiculoLoading.set(false);
        this.fecharTrocaVeiculo();
        this.success.set(
          'Veículo atualizado em todos os turnos desta escala do dia. O próximo sync manterá a substituição. Se o veículo já estiver em outra linha no mesmo turno, a grade sinalizará o conflito.',
        );
        this.carregar();
      },
      error: (err) => {
        this.trocaVeiculoLoading.set(false);
        this.errorModalService.show(
          err?.error?.message ||
            err?.message ||
            'Não foi possível trocar o veículo da escala.',
          'Erro',
        );
      },
    });
  }

  abrirAutonomiaResumo(row: EscalaTurnoRow, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (!row.alertaAutonomiaTurno) {
      return;
    }
    this.autonomiaResumo.set(this.montarAutonomiaResumo(row));
    this.showAutonomiaModal.set(true);
  }

  fecharAutonomiaResumo(): void {
    this.showAutonomiaModal.set(false);
    this.autonomiaResumo.set(null);
  }

  abrirConflitoVeiculo(row: EscalaTurnoRow, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (!row.alertaConflitoVeiculoTurno || !row.item.idVeiculo) {
      return;
    }
    const resumo = this.montarConflitoVeiculoResumo(row);
    if (!resumo.linhas.length) {
      return;
    }
    this.conflitoResumo.set(resumo);
    this.showConflitoModal.set(true);
  }

  fecharConflitoVeiculo(): void {
    this.showConflitoModal.set(false);
    this.conflitoResumo.set(null);
  }

  private montarConflitoVeiculoResumo(
    row: EscalaTurnoRow,
  ): ConflitoVeiculoResumoView {
    const idVeiculo = (row.item.idVeiculo ?? '').trim();
    const turnoChave = row.turnoChave;
    const itens = this.painel()?.itens ?? [];
    const linhas: ConflitoVeiculoLinhaView[] = [];

    for (const item of itens) {
      if ((item.idVeiculo ?? '').trim() !== idVeiculo) {
        continue;
      }
      const turnos = item.turnos ?? [];
      const chaves = turnos.length
        ? new Set(turnos.map((t) => this.chaveTurno(t)))
        : new Set(['Sem turno']);
      if (!chaves.has(turnoChave)) {
        continue;
      }
      const grupo = turnos.filter((t) => this.chaveTurno(t) === turnoChave);
      const { inicio, fim } = this.horariosDoTurno(grupo);
      const gruposTurno = this.gruposUnicosDoTurno(grupo);
      linhas.push({
        prefixo: item.prefixo,
        descricao: item.descricao || item.prefixo,
        combustivel: item.combustivel || '—',
        placa: item.placa ?? null,
        substituido: !!item.veiculoSubstituidoManual,
        horarioInicio: inicio,
        horarioFim: fim,
        grupos: gruposTurno.map((g) => g.grupo).join(', ') || '—',
        alocacoes:
          [...new Set(gruposTurno.map((g) => g.alocacao).filter(Boolean))].join(
            ', ',
          ) || '—',
        tarefas:
          [...new Set(gruposTurno.map((g) => g.tarefa).filter(Boolean))].join(
            ', ',
          ) || '—',
      });
    }

    linhas.sort((a, b) =>
      a.prefixo.localeCompare(b.prefixo, 'pt-BR', { numeric: true }),
    );

    return {
      idVeiculo,
      veiculo: row.item.descricao || row.item.prefixo,
      placa: row.item.placa ?? null,
      combustivel: row.item.combustivel ?? null,
      turnoChave,
      turnoRotulo: row.turnoRotulo,
      linhas,
    };
  }

  /** Relatório resumido (HTML) no padrão do Tratamento, com logo da configuração. */
  imprimirOsRetencao(): void {
    const dados = this.retencao();
    if (!dados?.itens?.length || this.printingRetencao()) {
      return;
    }

    const win = window.open('', '_blank', 'width=1024,height=768');
    if (!win) {
      this.errorModalService.show(
        'Não foi possível abrir o relatório. Verifique o bloqueio de pop-ups.',
        'Atenção',
      );
      return;
    }

    this.printingRetencao.set(true);
    win.document.open();
    win.document.write(
      '<html><body><p style="font-family:Arial,sans-serif;padding:24px;color:#64748b">Carregando relatório...</p></body></html>',
    );

    this.carregarLogoRelatorio$().subscribe({
      next: (logoUrl) => {
        try {
          const html = this.montarHtmlRelatorioRetencao(dados, logoUrl);
          win.document.open();
          win.document.write(html);
          win.document.close();
          win.focus();
        } catch (err) {
          win.close();
          this.errorModalService.show(
            err instanceof Error
              ? err.message
              : 'Não foi possível gerar o relatório resumido.',
            'Erro',
          );
        } finally {
          this.printingRetencao.set(false);
        }
      },
      error: () => {
        try {
          const html = this.montarHtmlRelatorioRetencao(dados, null);
          win.document.open();
          win.document.write(html);
          win.document.close();
          win.focus();
        } finally {
          this.printingRetencao.set(false);
        }
      },
    });
  }

  rotuloStatusRetencao(status: string): string {
    switch (status) {
      case 'EM_MANUTENCAO':
        return 'Manutenção';
      case 'CONCLUIDA':
        return 'Validação';
      default:
        return status || '—';
    }
  }

  private montarAutonomiaResumo(row: EscalaTurnoRow): AutonomiaResumoView {
    const item = row.item;
    const tele = item.telemetria;
    const omni = item.calculoOmni;
    const motivos = this.montarMotivosAutonomia(item, row.kmTurno);
    return {
      veiculo: item.descricao || item.prefixo || 'Veículo',
      placa: item.placa,
      combustivel: item.combustivel,
      turnoRotulo: row.turnoRotulo,
      kmTurno: row.kmTurno,
      kmDia: item.kmEscala,
      bateriaPct: item.bateriaPct,
      kmPorPercentualModelo: item.kmPorPercentualModelo,
      telemetriaKm: tele.autonomiaKm,
      telemetria100Km: tele.autonomia100Km,
      sistemaKm: omni.autonomiaKm,
      sistema100Km: omni.autonomia100Km,
      tempoAteLargada: row.tempoAteLargada,
      tempoEntreTurnos: row.tempoEntreTurnos,
      motivos,
    };
  }

  private aplicarTempoEntreTurnos(
    rowsVeiculo: EscalaTurnoRow[],
    dataEscala: string,
  ): void {
    // Intervalo fica no turno atual: fim(N) → início(N+1). Último turno = —.
    for (let i = 0; i < rowsVeiculo.length; i += 1) {
      const atual = rowsVeiculo[i];
      const proximo = rowsVeiculo[i + 1];
      if (!proximo) {
        atual.tempoEntreTurnos = null;
        continue;
      }
      atual.tempoEntreTurnos = this.rotuloTempoEntreTurnos(
        dataEscala,
        atual.horarioFim,
        proximo.horarioInicio,
        atual.horarioInicio,
      );
    }
  }

  private compararHorarioTurno(
    a: string | null,
    b: string | null,
    chaveA: string,
    chaveB: string,
  ): number {
    const ma = this.minutosDoDia(a);
    const mb = this.minutosDoDia(b);
    if (ma != null && mb != null && ma !== mb) {
      return ma - mb;
    }
    if (ma != null && mb == null) {
      return -1;
    }
    if (ma == null && mb != null) {
      return 1;
    }
    return chaveA.localeCompare(chaveB, 'pt-BR', { numeric: true });
  }

  private minutosDoDia(hora: string | null | undefined): number | null {
    const m = hora?.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!m) {
      return null;
    }
    return Number(m[1]) * 60 + Number(m[2]);
  }

  private parseDataHora(
    dataIso: string,
    hora: string | null | undefined,
  ): Date | null {
    const minutos = this.minutosDoDia(hora);
    if (minutos == null || !/^\d{4}-\d{2}-\d{2}$/.test(dataIso)) {
      return null;
    }
    const [y, mo, d] = dataIso.split('-').map(Number);
    const dt = new Date(y, mo - 1, d, Math.floor(minutos / 60), minutos % 60, 0, 0);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  private ajustarFimTurno(inicio: Date, fim: Date): Date {
    if (fim.getTime() <= inicio.getTime()) {
      const adjusted = new Date(fim);
      adjusted.setDate(adjusted.getDate() + 1);
      return adjusted;
    }
    return fim;
  }

  private fmtDuracao(ms: number): string {
    const totalMin = Math.max(0, Math.floor(ms / 60_000));
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) {
      return `${h}h ${String(m).padStart(2, '0')}min`;
    }
    return `${m} min`;
  }

  private rotuloTempoAteLargada(
    dataEscala: string,
    horarioInicio: string | null,
    horarioFim: string | null,
    agoraMs: number,
  ): string | null {
    const inicio = this.parseDataHora(dataEscala, horarioInicio);
    if (!inicio) {
      return null;
    }
    const fimRaw = this.parseDataHora(dataEscala, horarioFim);
    const fim = fimRaw ? this.ajustarFimTurno(inicio, fimRaw) : null;
    const diff = inicio.getTime() - agoraMs;
    if (diff > 0) {
      return this.fmtDuracao(diff);
    }
    if (fim && agoraMs <= fim.getTime()) {
      return 'Em andamento';
    }
    return 'Encerrado';
  }

  /**
   * Intervalo fim(turno N) → início(turno N+1) na mesma data da escala.
   * Virada de dia só ajusta o *fim* do turno anterior quando fim < início daquele turno
   * (ex.: 17:30 → 01:48). Não empurra o início do próximo turno para o dia seguinte.
   */
  private rotuloTempoEntreTurnos(
    dataEscala: string,
    fimAnterior: string | null,
    inicioAtual: string | null,
    inicioAnterior?: string | null,
  ): string | null {
    const inicioPrev = this.parseDataHora(dataEscala, inicioAnterior ?? null);
    const fimRaw = this.parseDataHora(dataEscala, fimAnterior);
    const inicio = this.parseDataHora(dataEscala, inicioAtual);
    if (!fimRaw || !inicio) {
      return null;
    }
    const fim =
      inicioPrev != null ? this.ajustarFimTurno(inicioPrev, fimRaw) : fimRaw;
    const diff = inicio.getTime() - fim.getTime();
    if (diff < 0) {
      return `Sobreposição (${this.fmtDuracao(-diff)})`;
    }
    if (diff === 0) {
      return '0 min';
    }
    return this.fmtDuracao(diff);
  }

  private montarMotivosAutonomia(
    item: EscalaPainelItem,
    kmTurno: number,
  ): string[] {
    const motivos: string[] = [];
    const tele = item.telemetria;
    const omni = item.calculoOmni;

    if (
      tele.disponivel &&
      tele.autonomiaKm != null &&
      tele.autonomiaKm < kmTurno
    ) {
      motivos.push(
        `Telemetria (${this.fmtKm(tele.autonomiaKm)}) menor que o KM do turno (${this.fmtKm(kmTurno)}).`,
      );
    } else if (!tele.disponivel) {
      motivos.push('Telemetria indisponível para o cálculo deste turno.');
    }

    if (
      omni.disponivel &&
      omni.autonomiaKm != null &&
      omni.autonomiaKm < kmTurno
    ) {
      motivos.push(
        `Sistema (${this.fmtKm(omni.autonomiaKm)}) menor que o KM do turno (${this.fmtKm(kmTurno)}).`,
      );
    } else if (!omni.disponivel) {
      motivos.push('Cálculo do sistema indisponível para este turno.');
    }

    if (item.bateriaPct != null) {
      motivos.push(`Nível atual da bateria/carga: ${item.bateriaPct}%.`);
    }
    if (item.kmPorPercentualModelo != null) {
      motivos.push(
        `Fator do modelo: ${item.kmPorPercentualModelo} km por %.`,
      );
    }

    if (!motivos.length) {
      motivos.push(
        'Autonomia insuficiente para o KM previsto neste turno.',
      );
    }
    return motivos;
  }

  private carregarLogoRelatorio$() {
    return this.configuracaoService.getLogoRelatorio().pipe(
      switchMap((res) => {
        if (res.dataUrl) {
          return of(res.dataUrl);
        }
        const url = this.montarUrlLogo(res.logoRelatorio);
        if (!url) {
          return of(null as string | null);
        }
        return from(
          fetch(url)
            .then(async (response) => {
              if (!response.ok) {
                return url;
              }
              const blob = await response.blob();
              return await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result ?? url));
                reader.onerror = () => resolve(url);
                reader.readAsDataURL(blob);
              });
            })
            .catch(() => url),
        );
      }),
      catchError(() => of(null as string | null)),
    );
  }

  private montarUrlLogo(path?: string | null): string | null {
    const raw = path?.trim();
    if (!raw) {
      return null;
    }
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) {
      return raw;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const rel = raw.startsWith('/') ? raw : `/${raw}`;
    return `${origin}${rel}`;
  }

  private montarHtmlRelatorioRetencao(
    dados: OsRetencaoResponse,
    logoUrl: string | null,
  ): string {
    const veiculo = this.escapeHtml(dados.descricao || 'Veículo');
    const placa = dados.placa ? this.escapeHtml(dados.placa) : '';
    const veiculoTitulo = placa
      ? `Veículo: ${veiculo} ${placa}`
      : `Veículo: ${veiculo}`;
    const user = this.authService.getCurrentUser();
    const emitidoPor = this.escapeHtml(
      user?.nome?.trim() || user?.email?.trim() || '—',
    );
    const dataEmissao = this.escapeHtml(
      new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
    const rodapeEmissor = `Emissão: ${dataEmissao} · Usuário: ${emitidoPor}`;
    const logoHtml = logoUrl
      ? `<img class="logo" src="${logoUrl}" alt="Logo" />`
      : '<span class="logo-placeholder"></span>';
    const rows = dados.itens
      .map((os, idx) => {
        const classificacao = [
          os.nomeArea || '—',
          os.nomeComponente || '—',
          os.descricaoSintoma || '—',
        ]
          .map((v) => this.escapeHtml(v))
          .join(' / ');
        const numeros: string[] = [
          `OS: ${os.numeroIrregularidade}`,
        ];
        if (os.erpCodigoPedido?.trim()) {
          numeros.push(`OMNI: ${this.escapeHtml(os.erpCodigoPedido.trim())}`);
        }
        if (os.numOsExternoAtual != null) {
          numeros.push(`BRT: ${os.numOsExternoAtual}`);
        }
        if (os.statusBrtAtual?.trim()) {
          numeros.push(`Status BRT: ${this.escapeHtml(os.statusBrtAtual.trim())}`);
        }
        if (os.osOrigAtual?.trim()) {
          numeros.push(`os_orig: ${this.escapeHtml(os.osOrigAtual.trim())}`);
        }
        numeros.push(`Vistoria: ${os.numeroVistoria ?? '—'}`);
        const zebra = idx % 2 === 1 ? ' class="zebra"' : '';
        return `<tr${zebra}>
          <td class="col-numeros">${numeros.map((l) => `<div>${l}</div>`).join('')}</td>
          <td>${this.escapeHtml(this.rotuloStatusRetencao(os.statusAtual))}</td>
          <td>${this.escapeHtml(os.nomeEmpresa || '—')}</td>
          <td class="col-area">${classificacao}</td>
          <td class="col-desc">${this.escapeHtml(os.observacao?.trim() || '—')}</td>
        </tr>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório de Pendências do Veículo</title>
  <style>
    @page { size: A4; margin: 12mm 10mm 14mm; }
    * { box-sizing: border-box; }
    body {
      font-family: Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      font-size: 7pt;
      padding: 0 0 28pt;
    }
    .topo { margin-bottom: 8pt; }
    .header-brand {
      display: grid;
      grid-template-columns: 100pt 1fr 100pt;
      align-items: center;
      column-gap: 6pt;
    }
    .logo, .logo-placeholder {
      width: 100pt;
      height: 32pt;
      object-fit: contain;
      object-position: left center;
    }
    .header-brand h1 {
      margin: 0;
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
      text-align: center;
      line-height: 1.2;
    }
    .topo-sub {
      text-align: center;
      margin: 4pt 0 0;
      color: #475569;
      font-size: 7.5pt;
      font-weight: 400;
    }
    .veiculo-box {
      border: 0.8pt solid #94a3b8;
      border-radius: 4pt;
      padding: 6pt 8pt;
      margin-top: 8pt;
    }
    .veiculo-titulo {
      margin: 0 0 4pt;
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    col.col-w-num { width: 16%; }
    col.col-w-status { width: 10%; }
    col.col-w-empresa { width: 14%; }
    col.col-w-area { width: 28%; }
    col.col-w-desc { width: 32%; }
    thead th {
      font-size: 7pt;
      font-weight: 700;
      color: #334155;
      text-align: left;
      padding: 3pt 4pt 4pt;
      border: none;
      border-bottom: 0.5pt solid #cbd5e1;
      vertical-align: bottom;
      text-transform: none;
      letter-spacing: 0;
      background: transparent;
    }
    tbody td {
      font-size: 7pt;
      color: #1e293b;
      padding: 3pt 4pt;
      border: none;
      border-bottom: 0.4pt solid #e2e8f0;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      line-height: 1.35;
    }
    tbody tr.zebra td { background: #f1f5f9; }
    .col-numeros div { margin: 0; }
    .col-area, .col-desc { white-space: pre-wrap; }
    .rodape {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 6pt;
      font-size: 7pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      gap: 8pt;
    }
    @media print {
      .topo { page-break-after: avoid; }
      thead { display: table-header-group; }
      tr { break-inside: avoid; page-break-inside: avoid; }
      tbody tr.zebra td {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="topo">
    <div class="header-brand">
      ${logoHtml}
      <h1>Relatório de Pendências do Veículo</h1>
      <span></span>
    </div>
    <p class="topo-sub">OS retendo o veículo · ${dados.total} OS</p>
  </div>
  <div class="veiculo-box">
    <p class="veiculo-titulo">${veiculoTitulo}</p>
    <table>
      <colgroup>
        <col class="col-w-num" />
        <col class="col-w-status" />
        <col class="col-w-empresa" />
        <col class="col-w-area" />
        <col class="col-w-desc" />
      </colgroup>
      <thead>
        <tr>
          <th>OS</th>
          <th>Status</th>
          <th>Empresa</th>
          <th>Classificação</th>
          <th>Descrição do problema</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <div class="rodape">
    <span>${rodapeEmissor} · ${dados.total} OS</span>
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 400);
    };
  </script>
</body>
</html>`;
  }

  private montarHtmlRelatorioEscala(
    rows: EscalaTurnoRow[],
    logoUrl: string | null,
  ): string {
    const dataEscala = this.escapeHtml(this.fmtDataBr(this.data));
    const user = this.authService.getCurrentUser();
    const emitidoPor = this.escapeHtml(
      user?.nome?.trim() || user?.email?.trim() || '—',
    );
    const dataEmissao = this.escapeHtml(
      new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
    const filtros: string[] = [];
    if (this.turnoFiltro()) {
      filtros.push(`Turno: ${this.rotuloTurno(this.turnoFiltro())}`);
    }
    if (this.combustivelFiltro()) {
      filtros.push(`Combustível: ${this.combustivelFiltro()}`);
    }
    if (this.grupoFiltro()) {
      filtros.push(`Grupo: ${this.grupoFiltro()}`);
    }
    if (this.alocacaoFiltro()) {
      filtros.push(`Alocação: ${this.alocacaoFiltro()}`);
    }
    if (this.tarefaFiltro()) {
      filtros.push(`Tarefa: ${this.tarefaFiltro()}`);
    }
    if (this.tipoFiltro()) {
      filtros.push(`Tipo: ${this.tipoFiltro()}`);
    }
    if (this.alertaFiltro() === 'retido') {
      filtros.push('Alerta: Retido');
    } else if (this.alertaFiltro() === 'carregamento') {
      filtros.push('Alerta: Carregamento');
    } else if (this.alertaFiltro() === 'conflito') {
      filtros.push('Alerta: Veículo em mais de uma linha');
    }
    const filtrosTxt = filtros.length
      ? filtros.map((f) => this.escapeHtml(f)).join(' · ')
      : 'Sem filtros adicionais';
    const logoHtml = logoUrl
      ? `<img class="logo" src="${logoUrl}" alt="Logo" />`
      : '<span class="logo-placeholder"></span>';

    const grupos = this.agruparLinhasRelatorioPorTurno(rows);
    const secoesHtml = grupos
      .map((grupo, grupoIdx) => {
        const bodyRows = grupo.linhas
          .map((row, idx) => {
            const alertas: string[] = [];
            if (row.item.alertaRetidoNaEscala) {
              alertas.push(`RETIDO (${row.item.qtdOsVermelhas})`);
            }
            if (row.alertaAutonomiaTurno) {
              alertas.push('Carregar antes de largar');
            }
            if (row.alertaConflitoVeiculoTurno) {
              alertas.push('Veículo em mais de uma linha');
            }
            if (!alertas.length) {
              alertas.push('OK');
            }
            const tarefaTxt =
              [
                ...new Set(
                  row.grupos
                    .map((g) => (g.tarefa ?? '').trim())
                    .filter((t) => t.length > 0),
                ),
              ]
                .map((t) => this.escapeHtml(t))
                .join(', ') || '—';
            const alocacaoGrupoTxt =
              row.grupos
                .map((g) => {
                  const aloc = (g.alocacao ?? '').trim();
                  const nome = (g.grupo ?? '').trim();
                  if (aloc && nome) {
                    return this.escapeHtml(`${aloc} · ${nome}`);
                  }
                  if (aloc) {
                    return this.escapeHtml(aloc);
                  }
                  if (nome) {
                    return this.escapeHtml(nome);
                  }
                  return null;
                })
                .filter((v): v is string => v != null)
                .join(', ') || '—';
            const zebra = idx % 2 === 1 ? ' class="zebra"' : '';
            const substituido = row.item.veiculoSubstituidoManual
              ? `<div class="muted">substituído (${this.escapeHtml(row.item.prefixo)})</div>`
              : '';
            return `<tr${zebra}>
          <td>${this.escapeHtml(row.item.descricao || row.item.prefixo)} . ${this.escapeHtml(row.item.combustivel || '—')}${substituido}</td>
          <td>${tarefaTxt}</td>
          <td>${this.escapeHtml(this.fmtHora(row.horarioInicio))}</td>
          <td>${this.escapeHtml(this.fmtHora(row.horarioFim))}</td>
          <td>${this.escapeHtml(row.tempoAteLargada || '—')}</td>
          <td>${this.escapeHtml(row.tempoEntreTurnos || '—')}</td>
          <td>${this.escapeHtml(this.fmtKm(row.kmTurno))}</td>
          <td>${alocacaoGrupoTxt}</td>
          <td>${this.escapeHtml(alertas.join(' · '))}</td>
        </tr>`;
          })
          .join('');
        const breakClass = grupoIdx > 0 ? ' turno-secao turno-secao--quebra' : 'turno-secao';
        return `<section class="${breakClass}">
    <h2 class="turno-titulo">${this.escapeHtml(grupo.rotulo)} · ${grupo.linhas.length} veículo(s)</h2>
    <table>
      <thead>
        <tr>
          <th>Veículo</th>
          <th>Tarefa</th>
          <th>Início</th>
          <th>Fim</th>
          <th>Até largada</th>
          <th>Entre turnos</th>
          <th>KM turno</th>
          <th>Alocação Grupo</th>
          <th>Alertas</th>
        </tr>
      </thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </section>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório de Controle de Escala</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 8mm 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      font-size: 8pt;
      padding: 0 0 24pt;
    }
    .topo { margin-bottom: 8pt; }
    .header-brand {
      display: grid;
      grid-template-columns: 100pt 1fr 100pt;
      align-items: center;
      column-gap: 6pt;
    }
    .logo, .logo-placeholder {
      width: 100pt;
      height: 32pt;
      object-fit: contain;
      object-position: left center;
    }
    .header-brand h1 {
      margin: 0;
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
      text-align: center;
    }
    .topo-sub {
      text-align: center;
      margin: 4pt 0 0;
      color: #475569;
      font-size: 7.5pt;
    }
    .turno-secao { margin-top: 10pt; }
    .turno-secao--quebra {
      break-before: page;
      page-break-before: always;
    }
    .turno-titulo {
      margin: 0 0 6pt;
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1pt solid #cbd5e1;
      padding-bottom: 3pt;
    }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    thead th {
      font-size: 7pt;
      font-weight: 700;
      color: #334155;
      text-align: left;
      padding: 3pt 3pt;
      border-bottom: 0.5pt solid #cbd5e1;
      vertical-align: bottom;
    }
    thead th:nth-child(1) { width: 14%; }
    thead th:nth-child(2) { width: 12%; }
    thead th:nth-child(3),
    thead th:nth-child(4) { width: 6%; }
    thead th:nth-child(5),
    thead th:nth-child(6) { width: 9%; }
    thead th:nth-child(7) { width: 7%; }
    thead th:nth-child(8) { width: 20%; }
    thead th:nth-child(9) { width: 17%; }
    tbody td {
      font-size: 7pt;
      color: #1e293b;
      padding: 3pt 3pt;
      border-bottom: 0.4pt solid #e2e8f0;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      line-height: 1.3;
    }
    tbody tr.zebra td { background: #f1f5f9; }
    .muted { color: #64748b; font-size: 6.5pt; margin-top: 1pt; }
    .rodape {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 4pt;
      font-size: 7pt;
      color: #64748b;
    }
    @media print {
      thead { display: table-header-group; }
      tr { break-inside: avoid; page-break-inside: avoid; }
      .turno-secao--quebra {
        break-before: page;
        page-break-before: always;
      }
      tbody tr.zebra td {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="topo">
    <div class="header-brand">
      ${logoHtml}
      <h1>Relatório de Controle de Escala</h1>
      <span></span>
    </div>
    <p class="topo-sub">Data: ${dataEscala} · ${rows.length} linha(s) · ${grupos.length} turno(s)</p>
    <p class="topo-sub">${filtrosTxt}</p>
  </div>
  ${secoesHtml}
  <div class="rodape">
    Emissão: ${dataEmissao} · Usuário: ${emitidoPor} · ${rows.length} linha(s)
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 400);
    };
  </script>
</body>
</html>`;
  }

  private montarHtmlPrevisaoCarregamento(
    rows: EscalaTurnoRow[],
    logoUrl: string | null,
  ): string {
    const agoraMs = Date.now();
    const dataEscala = this.escapeHtml(this.fmtDataBr(this.data));
    const turnoRotulo = this.escapeHtml(
      this.rotuloTurno(this.turnoFiltro() || rows[0]?.turnoChave || ''),
    );
    const user = this.authService.getCurrentUser();
    const emitidoPor = this.escapeHtml(
      user?.nome?.trim() || user?.email?.trim() || '—',
    );
    const dataEmissao = this.escapeHtml(
      new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    );
    const logoHtml = logoUrl
      ? `<img class="logo" src="${logoUrl}" alt="Logo" />`
      : '<span class="logo-placeholder"></span>';

    const previsoes = rows.map((row) =>
      this.calcularPrevisaoCarregamento(row, agoraMs),
    );
    const qtdCarregar = previsoes.filter(
      (p) =>
        p.telemetria.precisaCarregar || p.omni.precisaCarregar,
    ).length;

    const bodyRows = previsoes
      .map((p, idx) => {
        const zebra = idx % 2 === 1 ? ' class="zebra"' : '';
        const alertas: string[] = [];
        if (p.retido) {
          alertas.push(`RETIDO (${p.qtdOsVermelhas})`);
        }
        alertas.push(p.telemetriaStatus);
        return `<tr${zebra}>
          <td>
            ${this.escapeHtml(p.veiculo)} . ${this.escapeHtml(p.combustivel)}
            ${p.substituido ? `<div class="muted">substituído (${this.escapeHtml(p.prefixo)})</div>` : ''}
          </td>
          <td>${p.bateriaPct != null ? `${p.bateriaPct}%` : '—'}</td>
          <td>${this.escapeHtml(p.faseRotulo)}
            <div class="muted">${this.escapeHtml(p.progressoTxt)}</div>
          </td>
          <td>${this.escapeHtml(this.fmtKm(p.kmTurno))}</td>
          <td>${this.escapeHtml(this.fmtKm(p.kmFeito))}</td>
          <td>${this.escapeHtml(this.fmtKm(p.kmRestante))}</td>
          <td>
            ${this.escapeHtml(this.fmtKm(p.telemetria.autonomiaKm))}
            <div class="${p.telemetria.precisaCarregar ? 'risco' : 'ok'}">${this.escapeHtml(p.telemetria.resumo)}</div>
          </td>
          <td>
            ${this.escapeHtml(this.fmtKm(p.omni.autonomiaKm))}
            <div class="${p.omni.precisaCarregar ? 'risco' : 'ok'}">${this.escapeHtml(p.omni.resumo)}</div>
          </td>
          <td>${this.escapeHtml(alertas.join(' · '))}</td>
        </tr>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Previsão de Carregamento</title>
  <style>
    @page { size: A4 portrait; margin: 10mm 8mm 12mm; }
    * { box-sizing: border-box; }
    body {
      font-family: Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      font-size: 8pt;
      padding: 0 0 24pt;
    }
    .topo { margin-bottom: 8pt; }
    .header-brand {
      display: grid;
      grid-template-columns: 100pt 1fr 100pt;
      align-items: center;
      column-gap: 6pt;
    }
    .logo, .logo-placeholder {
      width: 100pt;
      height: 32pt;
      object-fit: contain;
      object-position: left center;
    }
    .header-brand h1 {
      margin: 0;
      font-size: 12pt;
      font-weight: 700;
      text-align: center;
    }
    .topo-sub {
      text-align: center;
      margin: 4pt 0 0;
      color: #475569;
      font-size: 7.5pt;
    }
    .legenda {
      margin: 6pt 0 8pt;
      padding: 5pt 7pt;
      border: 0.5pt solid #cbd5e1;
      border-radius: 4pt;
      background: #f8fafc;
      font-size: 7pt;
      color: #334155;
    }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    thead th {
      font-size: 6.5pt;
      font-weight: 700;
      color: #334155;
      text-align: left;
      padding: 3pt;
      border-bottom: 0.5pt solid #cbd5e1;
      vertical-align: bottom;
    }
    tbody td {
      font-size: 7pt;
      color: #1e293b;
      padding: 3pt;
      border-bottom: 0.4pt solid #e2e8f0;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      line-height: 1.3;
    }
    tbody tr.zebra td { background: #f1f5f9; }
    .muted { color: #64748b; font-size: 6.5pt; margin-top: 1pt; }
    .risco { color: #b91c1c; font-weight: 700; font-size: 6.5pt; margin-top: 1pt; }
    .ok { color: #15803d; font-weight: 600; font-size: 6.5pt; margin-top: 1pt; }
    .rodape {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 4pt;
      font-size: 7pt;
      color: #64748b;
    }
    @media print {
      thead { display: table-header-group; }
      tr { break-inside: avoid; page-break-inside: avoid; }
      tbody tr.zebra td,
      .risco, .ok {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="topo">
    <div class="header-brand">
      ${logoHtml}
      <h1>Previsão de Carregamento</h1>
      <span></span>
    </div>
    <p class="topo-sub">Data: ${dataEscala} · ${turnoRotulo} · ${previsoes.length} veículo(s) GNV/Elétrico</p>
    <p class="topo-sub">Com necessidade de carga (alguma fonte): ${qtdCarregar}</p>
  </div>
  <div class="legenda">
    Progresso linear no tempo do turno (sem GPS). KM restante = KM turno × tempo restante / duração.
    Autonomia Telemetria (BRT) e Sistema (OMNI = % atual × km/% do modelo). Diesel não entra neste relatório.
  </div>
  <table>
    <thead>
      <tr>
        <th>Veículo</th>
        <th>% Atual</th>
        <th>Status turno</th>
        <th>KM turno</th>
        <th>KM feito</th>
        <th>KM restante</th>
        <th>Telemetria</th>
        <th>Sistema</th>
        <th>Alertas</th>
      </tr>
    </thead>
    <tbody>${bodyRows}</tbody>
  </table>
  <div class="rodape">
    Emissão: ${dataEmissao} · Usuário: ${emitidoPor} · ${previsoes.length} veículo(s)
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 400);
    };
  </script>
</body>
</html>`;
  }

  private calcularPrevisaoCarregamento(
    row: EscalaTurnoRow,
    agoraMs: number,
  ): {
    veiculo: string;
    prefixo: string;
    combustivel: string;
    substituido: boolean;
    bateriaPct: number | null;
    retido: boolean;
    qtdOsVermelhas: number;
    telemetriaStatus: string;
    faseRotulo: string;
    progressoTxt: string;
    kmTurno: number;
    kmFeito: number;
    kmRestante: number;
    telemetria: {
      autonomiaKm: number | null;
      precisaCarregar: boolean;
      resumo: string;
    };
    omni: {
      autonomiaKm: number | null;
      precisaCarregar: boolean;
      resumo: string;
    };
  } {
    const progresso = this.calcularProgressoTurnoLinear(
      this.data,
      row.horarioInicio,
      row.horarioFim,
      agoraMs,
    );
    const kmTurno = row.kmTurno;
    const kmFeito = Math.round(kmTurno * progresso.fracaoDecorrida * 10) / 10;
    const kmRestante =
      Math.round(kmTurno * (1 - progresso.fracaoDecorrida) * 10) / 10;
    const fator = row.item.kmPorPercentualModelo;
    const tele = this.avaliarFonteCarregamento(
      row.item.telemetria,
      kmRestante,
      fator,
      'Telemetria',
    );
    const omni = this.avaliarFonteCarregamento(
      row.item.calculoOmni,
      kmRestante,
      fator,
      'Sistema',
    );
    const st = this.statusTelemetriaVeiculo(row.item);

    return {
      veiculo: row.item.descricao || row.item.prefixo,
      prefixo: row.item.prefixo,
      combustivel: row.item.combustivel || '—',
      substituido: !!row.item.veiculoSubstituidoManual,
      bateriaPct: row.item.bateriaPct,
      retido: !!row.item.alertaRetidoNaEscala,
      qtdOsVermelhas: row.item.qtdOsVermelhas,
      telemetriaStatus: st.texto,
      faseRotulo: progresso.faseRotulo,
      progressoTxt: progresso.detalhe,
      kmTurno,
      kmFeito,
      kmRestante,
      telemetria: tele,
      omni,
    };
  }

  private calcularProgressoTurnoLinear(
    dataEscala: string,
    horarioInicio: string | null,
    horarioFim: string | null,
    agoraMs: number,
  ): {
    fase: 'antes' | 'andamento' | 'encerrado' | 'sem_horario';
    faseRotulo: string;
    fracaoDecorrida: number;
    detalhe: string;
  } {
    const inicio = this.parseDataHora(dataEscala, horarioInicio);
    const fimRaw = this.parseDataHora(dataEscala, horarioFim);
    if (!inicio || !fimRaw) {
      return {
        fase: 'sem_horario',
        faseRotulo: 'Sem horário',
        fracaoDecorrida: 0,
        detalhe: 'Horário do turno indisponível — KM restante = KM turno',
      };
    }
    const fim = this.ajustarFimTurno(inicio, fimRaw);
    const duracao = fim.getTime() - inicio.getTime();
    if (duracao <= 0) {
      return {
        fase: 'sem_horario',
        faseRotulo: 'Sem horário',
        fracaoDecorrida: 0,
        detalhe: 'Duração inválida — KM restante = KM turno',
      };
    }
    if (agoraMs < inicio.getTime()) {
      const falta = this.fmtDuracao(inicio.getTime() - agoraMs);
      return {
        fase: 'antes',
        faseRotulo: 'Antes da largada',
        fracaoDecorrida: 0,
        detalhe: `Falta ${falta} para iniciar · 0% decorrido`,
      };
    }
    if (agoraMs >= fim.getTime()) {
      return {
        fase: 'encerrado',
        faseRotulo: 'Encerrado',
        fracaoDecorrida: 1,
        detalhe: 'Turno encerrado · 100% decorrido',
      };
    }
    const feitoMs = agoraMs - inicio.getTime();
    const faltaMs = fim.getTime() - agoraMs;
    const fracao = Math.min(1, Math.max(0, feitoMs / duracao));
    const pct = Math.round(fracao * 100);
    return {
      fase: 'andamento',
      faseRotulo: 'Em andamento',
      fracaoDecorrida: fracao,
      detalhe: `Feito ${this.fmtDuracao(feitoMs)} · falta ${this.fmtDuracao(faltaMs)} · ${pct}% decorrido`,
    };
  }

  private avaliarFonteCarregamento(
    fonte: { autonomiaKm: number | null; disponivel: boolean },
    kmRestante: number,
    kmPorPercentual: number | null | undefined,
    rotulo: string,
  ): {
    autonomiaKm: number | null;
    precisaCarregar: boolean;
    resumo: string;
  } {
    if (!fonte.disponivel || fonte.autonomiaKm == null) {
      return {
        autonomiaKm: null,
        precisaCarregar: false,
        resumo: `${rotulo} indisponível`,
      };
    }
    const autonomia = fonte.autonomiaKm;
    if (kmRestante <= 0) {
      return {
        autonomiaKm: autonomia,
        precisaCarregar: false,
        resumo: 'Turno encerrado — sem KM restante',
      };
    }
    if (autonomia >= kmRestante) {
      const sobra = Math.round((autonomia - kmRestante) * 10) / 10;
      return {
        autonomiaKm: autonomia,
        precisaCarregar: false,
        resumo: `Suficiente (sobra ${this.fmtKm(sobra)})`,
      };
    }
    const deficit = Math.round((kmRestante - autonomia) * 10) / 10;
    let resumo = `Carregar — falta ${this.fmtKm(deficit)}`;
    if (
      kmPorPercentual != null &&
      Number.isFinite(kmPorPercentual) &&
      kmPorPercentual > 0
    ) {
      const pct = Math.ceil(deficit / kmPorPercentual);
      resumo += ` (~${pct}%)`;
    }
    return {
      autonomiaKm: autonomia,
      precisaCarregar: true,
      resumo,
    };
  }

  /** Agrupa linhas do relatório por turno (ordem de horário / rótulo). */
  private agruparLinhasRelatorioPorTurno(
    rows: EscalaTurnoRow[],
  ): Array<{ chave: string; rotulo: string; linhas: EscalaTurnoRow[] }> {
    const mapa = new Map<
      string,
      { chave: string; rotulo: string; linhas: EscalaTurnoRow[] }
    >();
    for (const row of rows) {
      const chave = row.turnoChave || 'Sem turno';
      let grupo = mapa.get(chave);
      if (!grupo) {
        grupo = {
          chave,
          rotulo: row.turnoRotulo || this.rotuloTurno(chave),
          linhas: [],
        };
        mapa.set(chave, grupo);
      }
      grupo.linhas.push(row);
    }

    return Array.from(mapa.values()).sort((a, b) => {
      const ha = a.linhas[0]?.horarioInicio ?? null;
      const hb = b.linhas[0]?.horarioInicio ?? null;
      return this.compararHorarioTurno(ha, hb, a.chave, b.chave);
    });
  }

  private escapeHtml(valor: string): string {
    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  fmtKm(valor: number | null | undefined): string {
    if (valor == null || !Number.isFinite(valor)) {
      return '—';
    }
    return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
  }

  private avaliarAutonomiaTurno(
    item: EscalaPainelItem,
    kmTurno: number,
  ): boolean {
    if (!exigePercentualNivel(item.combustivel) || !(kmTurno > 0)) {
      return false;
    }
    const tele = item.telemetria;
    const omni = item.calculoOmni;
    return (
      (tele.disponivel &&
        tele.autonomiaKm != null &&
        tele.autonomiaKm < kmTurno) ||
      (omni.disponivel && omni.autonomiaKm != null && omni.autonomiaKm < kmTurno)
    );
  }

  private sanitizarFiltros(): void {
    if (
      this.turnoFiltro() &&
      !this.opcoesTurno().includes(this.turnoFiltro())
    ) {
      this.turnoFiltro.set('');
    }
    if (
      this.combustivelFiltro() &&
      !this.opcoesCombustivel().includes(this.combustivelFiltro())
    ) {
      this.combustivelFiltro.set('');
    }
    if (
      this.grupoFiltro() &&
      !this.opcoesGrupo().includes(this.grupoFiltro())
    ) {
      this.grupoFiltro.set('');
    }
    if (
      this.alocacaoFiltro() &&
      !this.opcoesAlocacao().includes(this.alocacaoFiltro())
    ) {
      this.alocacaoFiltro.set('');
    }
    if (
      this.tarefaFiltro() &&
      !this.opcoesTarefa().includes(this.tarefaFiltro())
    ) {
      this.tarefaFiltro.set('');
    }
    if (
      this.tipoFiltro() &&
      !this.opcoesTipo().includes(this.tipoFiltro())
    ) {
      this.tipoFiltro.set('');
    }
  }

  /** Após carregar o painel, garante um turno (o primeiro) selecionado. */
  private garantirTurnoSelecionado(): void {
    const opcoes = this.opcoesTurno();
    if (!opcoes.length) {
      this.turnoFiltro.set('');
      return;
    }
    const atual = this.turnoFiltro();
    if (!atual || !opcoes.includes(atual)) {
      this.turnoFiltro.set(opcoes[0]);
    }
  }

  /**
   * IDs OMNI que aparecem em mais de uma escala (prefixo/idEscalaDia) no turno.
   */
  private idsVeiculoEmConflitoNoTurno(
    itens: EscalaPainelItem[],
    turnoChave: string,
  ): Set<string> {
    const contagem = new Map<string, number>();
    for (const item of itens) {
      const id = item.idVeiculo?.trim();
      if (!id) {
        continue;
      }
      const turnos = item.turnos ?? [];
      const chaves = turnos.length
        ? new Set(turnos.map((t) => this.chaveTurno(t)))
        : new Set(['Sem turno']);
      if (!chaves.has(turnoChave)) {
        continue;
      }
      contagem.set(id, (contagem.get(id) ?? 0) + 1);
    }
    const conflito = new Set<string>();
    for (const [id, qtd] of contagem) {
      if (qtd > 1) {
        conflito.add(id);
      }
    }
    return conflito;
  }

  private ordenarLinhasTabela(
    rows: EscalaTurnoRow[],
    coluna: EscalaSortColumn,
    dir: 'asc' | 'desc',
  ): EscalaTurnoRow[] {
    const fator = dir === 'asc' ? 1 : -1;
    const sorted = [...rows];
    sorted.sort((a, b) => {
      const cmp = this.compararValorSort(a, b, coluna);
      if (cmp !== 0) {
        return cmp * fator;
      }
      const va = (a.item.descricao || a.item.prefixo || '').toString();
      const vb = (b.item.descricao || b.item.prefixo || '').toString();
      return va.localeCompare(vb, 'pt-BR', { numeric: true });
    });
    return sorted;
  }

  private compararValorSort(
    a: EscalaTurnoRow,
    b: EscalaTurnoRow,
    coluna: EscalaSortColumn,
  ): number {
    switch (coluna) {
      case 'veiculo':
        return (a.item.descricao || a.item.prefixo || '').localeCompare(
          b.item.descricao || b.item.prefixo || '',
          'pt-BR',
          { numeric: true },
        );
      case 'turno':
        return a.turnoRotulo.localeCompare(b.turnoRotulo, 'pt-BR', {
          numeric: true,
        });
      case 'inicio':
        return this.compararHorarioTurno(
          a.horarioInicio,
          b.horarioInicio,
          a.turnoChave,
          b.turnoChave,
        );
      case 'fim':
        return this.compararHorarioTurno(
          a.horarioFim,
          b.horarioFim,
          a.turnoChave,
          b.turnoChave,
        );
      case 'ateLargada':
        return (a.tempoAteLargada || '').localeCompare(
          b.tempoAteLargada || '',
          'pt-BR',
          { numeric: true },
        );
      case 'entreTurnos':
        return (a.tempoEntreTurnos || '').localeCompare(
          b.tempoEntreTurnos || '',
          'pt-BR',
          { numeric: true },
        );
      case 'kmTurno':
        return a.kmTurno - b.kmTurno;
      case 'kmDia':
        return (a.item.kmEscala ?? 0) - (b.item.kmEscala ?? 0);
      case 'grupo':
        return a.grupos
          .map((g) => g.grupo)
          .join(',')
          .localeCompare(b.grupos.map((g) => g.grupo).join(','), 'pt-BR', {
            numeric: true,
          });
      case 'alocacao':
        return a.grupos
          .map((g) => g.alocacao ?? '')
          .join(',')
          .localeCompare(
            b.grupos.map((g) => g.alocacao ?? '').join(','),
            'pt-BR',
            { numeric: true },
          );
      case 'tarefa':
        return a.grupos
          .map((g) => g.tarefa ?? '')
          .join(',')
          .localeCompare(
            b.grupos.map((g) => g.tarefa ?? '').join(','),
            'pt-BR',
            { numeric: true },
          );
      case 'tipo':
        return a.grupos
          .map((g) => g.tipoViagem ?? '')
          .join(',')
          .localeCompare(
            b.grupos.map((g) => g.tipoViagem ?? '').join(','),
            'pt-BR',
            { numeric: true },
          );
      case 'pct':
        return (a.item.bateriaPct ?? -1) - (b.item.bateriaPct ?? -1);
      case 'telemetria':
        return (
          (a.item.telemetria.autonomiaKm ?? -1) -
          (b.item.telemetria.autonomiaKm ?? -1)
        );
      case 'sistema':
        return (
          (a.item.calculoOmni.autonomiaKm ?? -1) -
          (b.item.calculoOmni.autonomiaKm ?? -1)
        );
      case 'alertas':
        return this.pesoAlertas(a) - this.pesoAlertas(b);
      default:
        return 0;
    }
  }

  private pesoAlertas(row: EscalaTurnoRow): number {
    let n = 0;
    if (row.item.alertaRetidoNaEscala) {
      n += 4;
    }
    if (row.alertaAutonomiaTurno) {
      n += 2;
    }
    if (row.alertaConflitoVeiculoTurno) {
      n += 1;
    }
    return n;
  }

  /** Grupos distintos do turno; KM somado por grupo (+ alocação/tarefa/tipo). */
  private gruposUnicosDoTurno(turnos: EscalaTurno[]): TurnoGrupoView[] {
    const map = new Map<string, TurnoGrupoView>();
    for (const t of turnos) {
      const nome = (t.grupo ?? '').trim() || '—';
      const alocacao = (t.alocacao ?? '').trim() || null;
      const tarefa = (t.tarefa ?? '').trim() || null;
      const tipoViagem = (t.tipoViagem ?? '').trim() || null;
      const chave = `${nome}::${alocacao ?? ''}::${tarefa ?? ''}::${tipoViagem ?? ''}`;
      const atual = map.get(chave);
      const km = t.km != null && Number.isFinite(Number(t.km)) ? Number(t.km) : null;
      if (!atual) {
        map.set(chave, {
          grupo: nome,
          alocacao,
          tarefa,
          tipoViagem,
          km,
          numeroViagem: t.numeroViagem?.trim() || null,
        });
      } else if (km != null) {
        atual.km = (atual.km ?? 0) + km;
      }
    }
    return Array.from(map.values());
  }

  private horariosDoTurno(turnos: EscalaTurno[]): {
    inicio: string | null;
    fim: string | null;
  } {
    let inicio: string | null = null;
    let fim: string | null = null;
    for (const t of turnos) {
      const hi = t.horarioInicio?.trim() || null;
      const hf = t.horarioFim?.trim() || null;
      if (hi && (inicio == null || hi < inicio)) {
        inicio = hi;
      }
      if (hf && (fim == null || hf > fim)) {
        fim = hf;
      }
    }
    return { inicio, fim };
  }

  /** ISO `yyyy-MM-dd` → `dd/MM/yyyy`. */
  fmtDataBr(valor: string | null | undefined): string {
    const raw = (valor ?? '').trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
    if (!m) {
      return raw || '—';
    }
    return `${m[3]}/${m[2]}/${m[1]}`;
  }

  fmtHora(valor: string | null | undefined): string {
    if (!valor?.trim()) {
      return '—';
    }
    const v = valor.trim();
    // Exibe HH:mm quando vier HH:mm:ss
    return /^\d{2}:\d{2}:\d{2}$/.test(v) ? v.slice(0, 5) : v;
  }


  private hojeIso(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
