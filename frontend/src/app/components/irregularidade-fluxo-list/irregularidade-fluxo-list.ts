import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IrregularidadeService } from '../../services/irregularidade.service';
import { EmpresaTerceiraService } from '../../services/empresa-terceira.service';
import {
  IniciarManutencaoLotePayload,
  RelatorioManutencaoExecucao,
  IrregularidadeHistoricoItem,
  IrregularidadeMidiaFluxoItem,
  IrregularidadeFluxoItem,
  RelatorioManutencaoPreview,
  StatusIrregularidade,
} from '../../models/irregularidade-fluxo.model';
import { GravidadeCriticidade } from '../../models/matriz-criticidade.model';
import { EmpresaTerceira } from '../../models/empresa-terceira.model';
import { AuthService } from '../../services/auth.service';
import { Permission } from '../../models/usuario.model';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { Veiculo } from '../../models/veiculo.model';
import { ConfiguracaoService } from '../../services/configuracao.service';
import { TempoFaixaConfig, TempoFluxoConfig } from '../../models/configuracao.model';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { VeiculoService } from '../../services/veiculo.service';
import { AreaVistoriada, AreaComponente } from '../../models/area-vistoriada.model';
import { MatrizCriticidade } from '../../models/matriz-criticidade.model';
import { firstValueFrom } from 'rxjs';

type FluxoModo = 'tratamento' | 'manutencao' | 'validacao-final';
type ModalAcao =
  | 'iniciar-manutencao'
  | 'reclassificar'
  | 'cancelar'
  | 'concluir'
  | 'nao-procede'
  | 'validar-final'
  | 'reprovar-final';

@Component({
  selector: 'app-irregularidade-fluxo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, VeiculoAutocompleteComponent],
  templateUrl: './irregularidade-fluxo-list.html',
  styleUrls: ['./irregularidade-fluxo-list.css'],
})
export class IrregularidadeFluxoListComponent implements OnInit {
  readonly StatusIrregularidade = StatusIrregularidade;

  private readonly irregularidadeService = inject(IrregularidadeService);
  private readonly empresaService = inject(EmpresaTerceiraService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly configuracaoService = inject(ConfiguracaoService);
  private readonly areaService = inject(AreaVistoriadaService);
  private readonly matrizService = inject(MatrizCriticidadeService);
  private readonly veiculoService = inject(VeiculoService);

  loading = false;
  error = '';
  items: IrregularidadeFluxoItem[] = [];
  expandedCardIds = new Set<string>();
  empresas: EmpresaTerceira[] = [];

  modo: FluxoModo = 'tratamento';
  titulo = 'Fluxo de Irregularidades';
  descricao = '';
  statusFiltro: StatusIrregularidade[] = [];
  selectedIds = new Set<string>();
  filtroVeiculoId = '';
  filtroVeiculoDescricao = '';
  filtroDataInicio = '';
  filtroDataFim = '';
  filtroGravidade = '';
  filtroStatus: StatusIrregularidade | '' = StatusIrregularidade.REGISTRADA;
  gravidadeOptions: GravidadeCriticidade[] = ['VERDE', 'AMARELO', 'VERMELHO'];
  statusOptions: StatusIrregularidade[] = Object.values(StatusIrregularidade);
  info = '';
  showActionModal = false;
  modalAcao: ModalAcao | null = null;
  selectedItemForAction: IrregularidadeFluxoItem | null = null;
  actionTargetIds: string[] = [];
  isSavingAction = false;
  modalError = '';
  modalIdArea = '';
  modalIdComponente = '';
  modalIdSintoma = '';
  modalIdEmpresaManutencao = '';
  modalObservacao = '';
  modalMotivoCancelamento = '';
  modalMotivoNaoProcede = '';
  reclassAreas: AreaVistoriada[] = [];
  reclassComponentes: Array<{ id: string; nome: string }> = [];
  reclassSintomas: Array<{ id: string; descricao: string }> = [];
  reclassAreaBusca = '';
  reclassComponenteBusca = '';
  reclassSintomaBusca = '';
  showReclassAreaOptions = false;
  showReclassComponenteOptions = false;
  showReclassSintomaOptions = false;
  reclassLoading = false;
  manutencaoPreviewLoading = false;
  manutencaoPreview: RelatorioManutencaoPreview | null = null;
  manutencaoEtapa: 'idle' | 'gerando' | 'enviando' = 'idle';
  imagemAmpliadaSrc = '';
  imagemAmpliadaTitulo = '';
  tempoFaixasAtivas: TempoFaixaConfig[] = [];
  showHistoricoModal = false;
  historicoLoading = false;
  historicoError = '';
  historicoSelecionado: IrregularidadeFluxoItem | null = null;
  historicoEventos: IrregularidadeHistoricoItem[] = [];

  canTratamentoUpdate = this.authService.hasPermission(
    Permission.IRREGULARIDADE_TRATAMENTO_UPDATE,
  );
  canManutencaoStart = this.authService.hasPermission(
    Permission.IRREGULARIDADE_MANUTENCAO_START,
  );
  canManutencaoFinish = this.authService.hasPermission(
    Permission.IRREGULARIDADE_MANUTENCAO_FINISH,
  );
  canManutencaoNaoProcede = this.authService.hasPermission(
    Permission.IRREGULARIDADE_MANUTENCAO_MARK_NOT_PROCEEDING,
  );
  canValidacaoFinalUpdate = this.authService.hasPermission(
    Permission.IRREGULARIDADE_VALIDACAO_FINAL_UPDATE,
  );

  ngOnInit(): void {
    this.modo = (this.route.snapshot.data['modo'] as FluxoModo) ?? 'tratamento';
    this.setDefaultPeriodoAtual();
    this.configureModo();
    this.loadTempoFaixas();
    if (this.modo === 'tratamento') {
      this.loadEmpresas();
    }
    this.loadItems();
  }

  private loadTempoFaixas(): void {
    this.configuracaoService.getConfiguracao().subscribe({
      next: (config) => {
        this.tempoFaixasAtivas = this.resolveFaixasByModo(config.tempoFluxoConfig);
      },
      error: () => {
        this.tempoFaixasAtivas = [];
      },
    });
  }

  private resolveFaixasByModo(config?: TempoFluxoConfig): TempoFaixaConfig[] {
    if (!config) {
      return [];
    }
    const list =
      this.modo === 'tratamento'
        ? config.tratamento
        : this.modo === 'manutencao'
          ? config.manutencao
          : config.validacaoFinal;
    if (!Array.isArray(list)) {
      return [];
    }
    return list
      .filter((faixa) => faixa?.ativo)
      .slice()
      .sort((a, b) => (a.minHoras ?? 0) - (b.minHoras ?? 0));
  }

  private configureModo(): void {
    if (this.modo === 'tratamento') {
      this.titulo = 'Tratamento de Irregularidades';
      this.descricao = '';
      this.statusFiltro = [StatusIrregularidade.REGISTRADA];
      this.filtroStatus = StatusIrregularidade.REGISTRADA;
      return;
    }
    if (this.modo === 'manutencao') {
      this.titulo = 'Manutenção';
      this.descricao =
        'Itens em manutenção da empresa logada, com ações de conclusão e não procede.';
      this.statusFiltro = [StatusIrregularidade.EM_MANUTENCAO];
      return;
    }
    this.titulo = 'Validação Final';
    this.descricao =
      'Itens concluídos ou não procede aguardando validação final ou retorno para manutenção.';
    this.statusFiltro = [StatusIrregularidade.CONCLUIDA, StatusIrregularidade.NAO_PROCEDE];
  }

  private loadEmpresas(): void {
    this.empresaService.getAll({ somenteManutencao: true }).subscribe({
      next: (empresas) => {
        this.empresas = empresas ?? [];
      },
      error: () => {
        this.empresas = [];
      },
    });
  }

  loadItems(avisoPosEmail?: string): void {
    this.loading = true;
    this.error = '';
    this.info = '';
    this.irregularidadeService
      .listarPorStatus(this.resolveStatusFiltro(), {
        idVeiculo: this.filtroVeiculoId,
        gravidade: this.filtroGravidade
          ? [this.filtroGravidade as GravidadeCriticidade]
          : undefined,
        dataInicio: this.filtroDataInicio || undefined,
        dataFim: this.filtroDataFim || undefined,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (items) => {
          this.items = (items ?? []).slice().sort((a, b) => {
            const aTime = new Date(a.criadoEm).getTime();
            const bTime = new Date(b.criadoEm).getTime();
            if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
            if (Number.isNaN(aTime)) return 1;
            if (Number.isNaN(bTime)) return -1;
            return aTime - bTime;
          });
          this.selectedIds.clear();
          if (avisoPosEmail?.trim()) {
            this.info = avisoPosEmail.trim();
          } else if (this.items.length === 0) {
            this.info = 'Nenhuma irregularidade encontrada com os filtros informados.';
          }
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erro ao carregar irregularidades.';
        },
      });
  }

  onVeiculoSelected(veiculo: Veiculo): void {
    this.filtroVeiculoId = veiculo.id;
    this.filtroVeiculoDescricao = veiculo.descricao;
    this.loadItems();
  }

  clearFilters(): void {
    this.filtroVeiculoId = '';
    this.filtroVeiculoDescricao = '';
    this.setDefaultPeriodoAtual();
    this.filtroGravidade = '';
    if (this.modo === 'tratamento') {
      this.filtroStatus = StatusIrregularidade.REGISTRADA;
    }
    this.selectedIds.clear();
    this.error = '';
    this.info = '';
    this.loadItems();
  }

  onComboFilterChange(): void {
    this.loadItems();
  }

  openCancelarModal(item: IrregularidadeFluxoItem): void {
    this.openActionModal(item, 'cancelar', [item.id]);
  }

  openReclassificarModal(item: IrregularidadeFluxoItem): void {
    this.openActionModal(item, 'reclassificar', [item.id]);
  }

  openConcluirManutencaoModal(item: IrregularidadeFluxoItem): void {
    this.openActionModal(item, 'concluir', [item.id]);
  }

  openNaoProcedeModal(item: IrregularidadeFluxoItem): void {
    this.openActionModal(item, 'nao-procede', [item.id]);
  }

  openValidarFinalModal(item: IrregularidadeFluxoItem): void {
    this.openActionModal(item, 'validar-final', [item.id]);
  }

  openReprovarFinalModal(item: IrregularidadeFluxoItem): void {
    this.openActionModal(item, 'reprovar-final', [item.id]);
  }

  openBulkActionModal(acao: ModalAcao): void {
    const ids = this.getSelectedIds();
    if (!ids.length) return;
    if (acao === 'reclassificar' && ids.length !== 1) {
      this.info = 'Para reclassificar, selecione apenas uma irregularidade.';
      return;
    }
    const first = this.items.find((item) => item.id === ids[0]);
    if (!first) return;
    this.openActionModal(first, acao, ids);
  }

  openActionModal(item: IrregularidadeFluxoItem, acao: ModalAcao, targetIds: string[]): void {
    this.selectedItemForAction = item;
    this.actionTargetIds = targetIds;
    this.modalAcao = acao;
    this.showActionModal = true;
    this.isSavingAction = false;
    this.modalError = '';
    this.modalIdEmpresaManutencao = '';
    this.modalIdArea = item.idarea;
    this.modalIdComponente = item.idcomponente;
    this.modalIdSintoma = item.idsintoma;
    this.modalObservacao = acao === 'reclassificar' ? item.observacao ?? '' : '';
    this.modalMotivoCancelamento = '';
    this.modalMotivoNaoProcede = '';
    this.manutencaoPreview = null;
    this.manutencaoPreviewLoading = false;
    this.reclassAreas = [];
    this.reclassComponentes = [];
    this.reclassSintomas = [];
    this.reclassAreaBusca = item.nomeArea ?? '';
    this.reclassComponenteBusca = item.nomeComponente ?? '';
    this.reclassSintomaBusca = item.descricaoSintoma ?? '';
    this.showReclassAreaOptions = false;
    this.showReclassComponenteOptions = false;
    this.showReclassSintomaOptions = false;
    this.reclassLoading = false;
    if (acao === 'reclassificar') {
      void this.prepareReclassificacaoOptions(item);
    }
  }

  closeActionModal(): void {
    this.showActionModal = false;
    this.modalAcao = null;
    this.selectedItemForAction = null;
    this.actionTargetIds = [];
    this.isSavingAction = false;
    this.modalError = '';
    this.manutencaoPreview = null;
    this.manutencaoPreviewLoading = false;
    this.manutencaoEtapa = 'idle';
    this.reclassAreas = [];
    this.reclassComponentes = [];
    this.reclassSintomas = [];
    this.reclassAreaBusca = '';
    this.reclassComponenteBusca = '';
    this.reclassSintomaBusca = '';
    this.showReclassAreaOptions = false;
    this.showReclassComponenteOptions = false;
    this.showReclassSintomaOptions = false;
    this.reclassLoading = false;
  }

  getModalTitle(): string {
    switch (this.modalAcao) {
      case 'iniciar-manutencao':
        return 'Enviar para manutenção';
      case 'reclassificar':
        return 'Reclassificar irregularidade';
      case 'cancelar':
        return 'Cancelar irregularidade';
      case 'concluir':
        return 'Concluir manutenção';
      case 'nao-procede':
        return 'Não Procede';
      case 'validar-final':
        return 'Validar final';
      case 'reprovar-final':
        return 'Reprovar validação final';
      default:
        return 'Ação';
    }
  }

  getModalPrimaryButtonLabel(): string {
    if (this.isSavingAction) {
      if (this.modalAcao === 'iniciar-manutencao') {
        return 'Enviando e-mail e encaminhando...';
      }
      return 'Salvando...';
    }
    switch (this.modalAcao) {
      case 'iniciar-manutencao':
        return 'Enviar manutenção';
      case 'reclassificar':
        return 'Reclassificar';
      case 'cancelar':
        return 'Cancelar irregularidade';
      case 'concluir':
        return 'Concluir';
      case 'nao-procede':
        return 'Marcar não procede';
      case 'validar-final':
        return 'Validar final';
      case 'reprovar-final':
        return 'Reprovar';
      default:
        return 'Confirmar';
    }
  }

  getModalScopeLabel(): string {
    if (this.actionTargetIds.length <= 1) {
      return '';
    }
    return `Aplicando em ${this.actionTargetIds.length} irregularidades selecionadas.`;
  }

  canSubmitActionModal(): boolean {
    if (this.isSavingAction || !this.modalAcao || !this.selectedItemForAction) return false;
    if (this.modalAcao === 'iniciar-manutencao') {
      return !!this.modalIdEmpresaManutencao && !!this.manutencaoPreview;
    }
    if (this.modalAcao === 'reclassificar') {
      return !!(
        this.modalIdArea.trim() &&
        this.modalIdComponente.trim() &&
        this.modalIdSintoma.trim()
      );
    }
    if (this.modalAcao === 'cancelar') return !!this.modalMotivoCancelamento.trim();
    if (this.modalAcao === 'concluir') return !!this.modalObservacao.trim();
    if (this.modalAcao === 'nao-procede') return !!this.modalMotivoNaoProcede.trim();
    if (this.modalAcao === 'reprovar-final') return !!this.modalObservacao.trim();
    return true;
  }

  submitActionModal(): void {
    if (!this.selectedItemForAction || !this.modalAcao || !this.canSubmitActionModal()) {
      return;
    }

    const itemIds = this.actionTargetIds.length
      ? this.actionTargetIds
      : [this.selectedItemForAction.id];
    const requests: Observable<IrregularidadeFluxoItem>[] = [];
    let fallbackError = 'Erro ao executar ação.';

    if (this.modalAcao === 'iniciar-manutencao') {
      const payload: IniciarManutencaoLotePayload = {
        idEmpresaManutencao: this.modalIdEmpresaManutencao,
        idsIrregularidades: itemIds,
      };
      this.isSavingAction = true;
      this.manutencaoEtapa = 'enviando';
      this.modalError = '';
      this.irregularidadeService
        .iniciarManutencaoLote(payload)
        .pipe(
          finalize(() => {
            this.isSavingAction = false;
            this.manutencaoEtapa = 'idle';
          }),
        )
        .subscribe({
          next: (res) => {
            this.closeActionModal();
            this.loadItems(this.buildMensagemSucessoManutencao(res));
          },
          error: (err) => {
            this.modalError =
              err?.error?.message || 'Erro ao enviar irregularidades para manutenção.';
          },
        });
      return;
    } else if (this.modalAcao === 'reclassificar') {
      for (const itemId of itemIds) {
        requests.push(
          this.irregularidadeService.reclassificar(itemId, {
            idarea: this.modalIdArea.trim(),
            idcomponente: this.modalIdComponente.trim(),
            idsintoma: this.modalIdSintoma.trim(),
            observacao: this.modalObservacao.trim() || undefined,
          }),
        );
      }
      fallbackError = 'Erro ao reclassificar irregularidade.';
    } else if (this.modalAcao === 'cancelar') {
      for (const itemId of itemIds) {
        requests.push(
          this.irregularidadeService.cancelar(itemId, {
            motivo: this.modalMotivoCancelamento.trim(),
          }),
        );
      }
      fallbackError = 'Erro ao cancelar irregularidade.';
    } else if (this.modalAcao === 'concluir') {
      for (const itemId of itemIds) {
        requests.push(
          this.irregularidadeService.concluirManutencao(itemId, {
            observacao: this.modalObservacao.trim() || undefined,
          }),
        );
      }
      fallbackError = 'Erro ao concluir manutenção.';
    } else if (this.modalAcao === 'nao-procede') {
      for (const itemId of itemIds) {
        requests.push(
          this.irregularidadeService.marcarNaoProcede(itemId, {
            motivoNaoProcede: this.modalMotivoNaoProcede.trim(),
            observacao: this.modalObservacao.trim() || undefined,
          }),
        );
      }
      fallbackError = 'Erro ao marcar não procede.';
    } else if (this.modalAcao === 'validar-final') {
      for (const itemId of itemIds) {
        requests.push(
          this.irregularidadeService.validarFinal(itemId, {
            observacao: this.modalObservacao.trim() || undefined,
          }),
        );
      }
      fallbackError = 'Erro ao validar irregularidade.';
    } else {
      for (const itemId of itemIds) {
        requests.push(
          this.irregularidadeService.reprovarFinal(itemId, {
            observacao: this.modalObservacao.trim(),
          }),
        );
      }
      fallbackError = 'Erro ao reprovar validação final.';
    }

    this.isSavingAction = true;
    this.modalError = '';
    forkJoin(requests)
      .pipe(finalize(() => (this.isSavingAction = false)))
      .subscribe({
        next: () => {
          this.closeActionModal();
          this.loadItems();
        },
        error: (err) => {
          this.modalError = err?.error?.message || fallbackError;
        },
      });
  }

  gerarPreviewManutencao(): void {
    if (!this.modalIdEmpresaManutencao) {
      this.modalError = 'Selecione a empresa de manutenção.';
      return;
    }
    if (!this.actionTargetIds.length) {
      this.modalError = 'Selecione ao menos uma irregularidade.';
      return;
    }

    this.modalError = '';
    this.manutencaoEtapa = 'gerando';
    this.manutencaoPreviewLoading = true;
    this.manutencaoPreview = null;

    this.irregularidadeService
      .previewIniciarManutencaoLote({
        idEmpresaManutencao: this.modalIdEmpresaManutencao,
        idsIrregularidades: this.actionTargetIds,
      })
      .pipe(
        finalize(() => {
          this.manutencaoPreviewLoading = false;
          this.manutencaoEtapa = 'idle';
        }),
      )
      .subscribe({
        next: (preview) => {
          this.manutencaoPreview = preview;
        },
        error: (err) => {
          this.modalError = err?.error?.message || 'Erro ao gerar pré-visualização do relatório.';
        },
      });
  }

  onEmpresaManutencaoChange(): void {
    this.manutencaoPreview = null;
    this.modalError = '';
    this.manutencaoEtapa = 'idle';
    if (this.modalIdEmpresaManutencao) {
      this.gerarPreviewManutencao();
    }
  }

  onActionModalOverlayClick(): void {
    return;
  }

  private async prepareReclassificacaoOptions(item: IrregularidadeFluxoItem): Promise<void> {
    this.reclassLoading = true;
    this.modalError = '';
    try {
      const idModelo = await this.resolveModeloVeiculoId(item.idVeiculo);
      this.reclassAreas = await firstValueFrom(this.areaService.getAll(idModelo, true));
      await this.loadComponentesByArea(this.modalIdArea, item.idcomponente);
      await this.loadSintomasByComponente(this.modalIdComponente, item.idsintoma);
      this.syncReclassLabels(item);
    } catch (err: any) {
      this.modalError =
        err?.error?.message || 'Não foi possível carregar opções de reclassificação.';
    } finally {
      this.reclassLoading = false;
    }
  }

  private async resolveModeloVeiculoId(idVeiculo?: string): Promise<string | undefined> {
    if (!idVeiculo) return undefined;
    const veiculo = await firstValueFrom(this.veiculoService.getById(idVeiculo));
    return veiculo?.idModelo;
  }

  private async loadComponentesByArea(
    idArea: string,
    keepSelectedId?: string,
  ): Promise<void> {
    this.reclassComponentes = [];
    this.reclassSintomas = [];
    if (!idArea) return;
    const vinculados = await firstValueFrom(this.areaService.listComponentes(idArea));
    this.reclassComponentes = (vinculados ?? [])
      .map((v: AreaComponente | Record<string, unknown>) => {
        const raw = v as Record<string, unknown>;
        const id = String(raw['idComponente'] ?? raw['idcomponente'] ?? '').trim();
        const componente = raw['componente'] as Record<string, unknown> | undefined;
        const nome = String(componente?.['nome'] ?? raw['nomeComponente'] ?? id).trim();
        return { id, nome };
      })
      .filter((c) => !!c.id)
      .sort((a, b) => a.nome.localeCompare(b.nome));
    if (
      keepSelectedId &&
      this.reclassComponentes.some((c) => c.id === keepSelectedId)
    ) {
      this.modalIdComponente = keepSelectedId;
    } else {
      this.modalIdComponente = '';
      this.reclassComponenteBusca = '';
      this.modalIdSintoma = '';
      this.reclassSintomaBusca = '';
    }
  }

  private async loadSintomasByComponente(
    idComponente: string,
    keepSelectedId?: string,
  ): Promise<void> {
    this.reclassSintomas = [];
    if (!idComponente) return;
    const matriz = await firstValueFrom(this.matrizService.getAll(idComponente));
    const map = new Map<string, string>();
    (matriz ?? []).forEach((m: MatrizCriticidade) => {
      if (m.idSintoma) {
        map.set(m.idSintoma, m.sintoma?.descricao ?? m.idSintoma);
      }
    });
    this.reclassSintomas = Array.from(map.entries())
      .map(([id, descricao]) => ({ id, descricao }))
      .sort((a, b) => a.descricao.localeCompare(b.descricao));
    if (
      keepSelectedId &&
      this.reclassSintomas.some((s) => s.id === keepSelectedId)
    ) {
      this.modalIdSintoma = keepSelectedId;
    } else {
      this.modalIdSintoma = '';
      this.reclassSintomaBusca = '';
    }
  }

  private syncReclassLabels(item: IrregularidadeFluxoItem): void {
    const areaAtual =
      this.reclassAreas.find((a) => a.id === this.modalIdArea)?.nome || item.nomeArea || '';
    const componenteAtual =
      this.reclassComponentes.find((c) => c.id === this.modalIdComponente)?.nome ||
      item.nomeComponente ||
      '';
    const sintomaAtual =
      this.reclassSintomas.find((s) => s.id === this.modalIdSintoma)?.descricao ||
      item.descricaoSintoma ||
      '';
    this.reclassAreaBusca = areaAtual;
    this.reclassComponenteBusca = componenteAtual;
    this.reclassSintomaBusca = sintomaAtual;
  }

  get filteredReclassAreas(): AreaVistoriada[] {
    const termo = this.reclassAreaBusca.trim().toLowerCase();
    if (!termo) return this.reclassAreas;
    return this.reclassAreas.filter((a) => a.nome.toLowerCase().includes(termo));
  }

  get filteredReclassComponentes(): Array<{ id: string; nome: string }> {
    const termo = this.reclassComponenteBusca.trim().toLowerCase();
    if (!termo) return this.reclassComponentes;
    return this.reclassComponentes.filter((c) =>
      c.nome.toLowerCase().includes(termo),
    );
  }

  get filteredReclassSintomas(): Array<{ id: string; descricao: string }> {
    const termo = this.reclassSintomaBusca.trim().toLowerCase();
    if (!termo) return this.reclassSintomas;
    return this.reclassSintomas.filter((s) =>
      s.descricao.toLowerCase().includes(termo),
    );
  }

  onReclassAreaFocus(): void {
    this.showReclassAreaOptions = true;
  }

  onReclassComponenteFocus(): void {
    if (!this.modalIdArea) return;
    this.showReclassComponenteOptions = true;
  }

  onReclassSintomaFocus(): void {
    if (!this.modalIdComponente) return;
    this.showReclassSintomaOptions = true;
  }

  onReclassAreaBlur(): void {
    setTimeout(() => (this.showReclassAreaOptions = false), 150);
  }

  onReclassComponenteBlur(): void {
    setTimeout(() => (this.showReclassComponenteOptions = false), 150);
  }

  onReclassSintomaBlur(): void {
    setTimeout(() => (this.showReclassSintomaOptions = false), 150);
  }

  selectReclassArea(area: AreaVistoriada): void {
    this.reclassAreaBusca = area.nome;
    this.modalIdArea = area.id;
    this.showReclassAreaOptions = false;
    this.modalIdComponente = '';
    this.reclassComponenteBusca = '';
    this.modalIdSintoma = '';
    this.reclassSintomaBusca = '';
    this.reclassSintomas = [];
    void this.loadComponentesByArea(this.modalIdArea).then(() => {
      this.showReclassComponenteOptions = true;
    });
  }

  selectReclassComponente(comp: { id: string; nome: string }): void {
    this.reclassComponenteBusca = comp.nome;
    this.modalIdComponente = comp.id;
    this.showReclassComponenteOptions = false;
    this.modalIdSintoma = '';
    this.reclassSintomaBusca = '';
    void this.loadSintomasByComponente(this.modalIdComponente);
  }

  selectReclassSintoma(sint: { id: string; descricao: string }): void {
    this.reclassSintomaBusca = sint.descricao;
    this.modalIdSintoma = sint.id;
    this.showReclassSintomaOptions = false;
  }

  onReclassAreaInputChange(): void {
    this.showReclassAreaOptions = true;
    const termo = this.reclassAreaBusca.trim().toLowerCase();
    const found = this.reclassAreas.find(
      (a) => a.nome.trim().toLowerCase() === termo,
    );
    this.modalIdArea = found?.id ?? '';
    this.modalIdComponente = '';
    this.reclassComponenteBusca = '';
    this.modalIdSintoma = '';
    this.reclassSintomaBusca = '';
    this.reclassSintomas = [];
    if (this.modalIdArea) {
      void this.loadComponentesByArea(this.modalIdArea);
    } else {
      this.reclassComponentes = [];
    }
  }

  onReclassComponenteInputChange(): void {
    this.showReclassComponenteOptions = !!this.modalIdArea;
    const termo = this.reclassComponenteBusca.trim().toLowerCase();
    const found = this.reclassComponentes.find(
      (c) => c.nome.trim().toLowerCase() === termo,
    );
    this.modalIdComponente = found?.id ?? '';
    this.modalIdSintoma = '';
    this.reclassSintomaBusca = '';
    if (this.modalIdComponente) {
      void this.loadSintomasByComponente(this.modalIdComponente);
    } else {
      this.reclassSintomas = [];
    }
  }

  onReclassSintomaInputChange(): void {
    this.showReclassSintomaOptions = !!this.modalIdComponente;
    const termo = this.reclassSintomaBusca.trim().toLowerCase();
    const found = this.reclassSintomas.find(
      (s) => s.descricao.trim().toLowerCase() === termo,
    );
    this.modalIdSintoma = found?.id ?? '';
  }

  visualizarPreviewRelatorio(): void {
    if (!this.modalIdEmpresaManutencao || !this.actionTargetIds.length) {
      return;
    }
    this.modalError = '';
    this.irregularidadeService
      .previewPdfIniciarManutencaoLote({
        idEmpresaManutencao: this.modalIdEmpresaManutencao,
        idsIrregularidades: this.actionTargetIds,
      })
      .subscribe({
        next: async (blob) => {
          if (!blob?.size) {
            this.modalError = 'O servidor retornou um PDF vazio.';
            return;
          }
          const head = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
          const isPdf = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
          if (!isPdf) {
            try {
              const text = await blob.text();
              const parsed = JSON.parse(text) as { message?: string };
              this.modalError = parsed?.message ?? 'Resposta inválida ao gerar o PDF.';
            } catch {
              this.modalError = 'Não foi possível abrir o PDF (arquivo corrompido ou formato inválido).';
            }
            return;
          }
          const pdfBlob =
            blob.type === 'application/pdf' ? blob : new Blob([blob], { type: 'application/pdf' });
          const url = URL.createObjectURL(pdfBlob);
          window.open(url, '_blank', 'noopener,noreferrer');
          setTimeout(() => URL.revokeObjectURL(url), 60_000);
        },
        error: (err) => {
          const body = err?.error;
          if (body instanceof Blob) {
            void body.text().then((text) => {
              try {
                const parsed = JSON.parse(text) as { message?: string };
                this.modalError = parsed?.message ?? 'Erro ao gerar visualização em PDF.';
              } catch {
                this.modalError = text || 'Erro ao gerar visualização em PDF.';
              }
            });
            return;
          }
          this.modalError = err?.error?.message || 'Erro ao gerar visualização em PDF.';
        },
      });
  }

  get hasSelectedItems(): boolean {
    return this.getSelectedIds().length > 0;
  }

  get canReclassificarSelecionado(): boolean {
    return this.getSelectedIds().length === 1;
  }

  get canShowTratamentoActions(): boolean {
    return (
      this.modo === 'tratamento' &&
      this.filtroStatus === StatusIrregularidade.REGISTRADA
    );
  }

  getSelectedIds(): string[] {
    return this.items.filter((item) => this.selectedIds.has(item.id)).map((item) => item.id);
  }

  isAllSelected(): boolean {
    return this.items.length > 0 && this.items.every((item) => this.selectedIds.has(item.id));
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.items.forEach((item) => this.selectedIds.add(item.id));
      return;
    }
    this.selectedIds.clear();
  }

  toggleItemSelection(itemId: string, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(itemId);
    } else {
      this.selectedIds.delete(itemId);
    }
  }

  onCardClick(event: MouseEvent, itemId: string): void {
    const target = event.target as HTMLElement;
    if (target.closest('button, input, select, textarea, a, label, audio, img')) {
      return;
    }
    this.toggleCardExpanded(itemId);
  }

  isCardExpanded(itemId: string): boolean {
    return this.expandedCardIds.has(itemId);
  }

  toggleCardExpanded(itemId: string): void {
    if (this.expandedCardIds.has(itemId)) {
      this.expandedCardIds.delete(itemId);
      return;
    }
    this.expandedCardIds.add(itemId);
  }

  getImageSrc(item: IrregularidadeMidiaFluxoItem): string {
    const mime = item.mimeType || 'image/jpeg';
    return `data:${mime};base64,${item.dadosBase64}`;
  }

  getAudioSrc(item: IrregularidadeMidiaFluxoItem): string {
    const mime = item.mimeType || 'audio/mpeg';
    return `data:${mime};base64,${item.dadosBase64}`;
  }

  openImagePreview(item: IrregularidadeMidiaFluxoItem): void {
    this.imagemAmpliadaSrc = this.getImageSrc(item);
    this.imagemAmpliadaTitulo = item.nomeArquivo;
  }

  closeImagePreview(): void {
    this.imagemAmpliadaSrc = '';
    this.imagemAmpliadaTitulo = '';
  }

  openHistoricoModal(item: IrregularidadeFluxoItem): void {
    this.showHistoricoModal = true;
    this.historicoSelecionado = item;
    this.historicoEventos = [];
    this.historicoError = '';
    this.historicoLoading = true;
    this.irregularidadeService.listarHistorico(item.id).subscribe({
      next: (eventos) => {
        this.historicoEventos = eventos ?? [];
        this.historicoLoading = false;
      },
      error: (err) => {
        this.historicoError = err?.error?.message || 'Erro ao carregar histórico.';
        this.historicoLoading = false;
      },
    });
  }

  closeHistoricoModal(): void {
    this.showHistoricoModal = false;
    this.historicoLoading = false;
    this.historicoError = '';
    this.historicoSelecionado = null;
    this.historicoEventos = [];
  }

  getStatusClass(status: StatusIrregularidade): string {
    switch (status) {
      case StatusIrregularidade.REGISTRADA:
        return 'status status-registrada';
      case StatusIrregularidade.EM_MANUTENCAO:
        return 'status status-manutencao';
      case StatusIrregularidade.NAO_PROCEDE:
        return 'status status-nao-procede';
      case StatusIrregularidade.CONCLUIDA:
        return 'status status-concluida';
      case StatusIrregularidade.VALIDADA:
        return 'status status-validada';
      case StatusIrregularidade.CANCELADA:
        return 'status status-cancelada';
      default:
        return 'status';
    }
  }

  getGravidadeClass(gravidade?: GravidadeCriticidade): string {
    switch (gravidade) {
      case 'VERDE':
        return 'gravidade gravidade-verde';
      case 'AMARELO':
        return 'gravidade gravidade-amarelo';
      case 'VERMELHO':
        return 'gravidade gravidade-vermelho';
      default:
        return 'gravidade';
    }
  }

  getStatusLabel(status?: StatusIrregularidade | null): string {
    if (!status) {
      return '-';
    }
    switch (status) {
      case StatusIrregularidade.REGISTRADA:
        return 'Registrada';
      case StatusIrregularidade.CANCELADA:
        return 'Cancelada';
      case StatusIrregularidade.EM_MANUTENCAO:
        return 'Em manutenção';
      case StatusIrregularidade.NAO_PROCEDE:
        return 'Não procede';
      case StatusIrregularidade.CONCLUIDA:
        return 'Concluída';
      case StatusIrregularidade.VALIDADA:
        return 'Validada';
      default:
        return status;
    }
  }

  getGravidadeLabel(gravidade: GravidadeCriticidade): string {
    switch (gravidade) {
      case 'VERDE':
        return 'Baixa (Verde)';
      case 'AMARELO':
        return 'Média (Amarelo)';
      case 'VERMELHO':
        return 'Alta (Vermelho)';
      default:
        return gravidade;
    }
  }

  getTransicaoHistorico(evento: IrregularidadeHistoricoItem): string {
    const destino = this.getStatusLabel(evento.statusDestino);
    if (!evento.statusOrigem) {
      return destino;
    }
    return `${this.getStatusLabel(evento.statusOrigem)} -> ${destino}`;
  }

  getAcaoHistoricoLabel(acao?: string | null): string {
    if (!acao) {
      return '-';
    }

    const normalizada = acao.trim().toLowerCase();
    switch (normalizada) {
      case 'registrar':
        return 'Registrar irregularidade';
      case 'reclassificar':
        return 'Reclassificar irregularidade';
      case 'cancelar':
        return 'Cancelar irregularidade';
      case 'iniciar_manutencao':
        return 'Iniciar manutenção';
      case 'concluir_manutencao':
        return 'Concluir manutenção';
      case 'marcar_nao_procede':
        return 'Marcar como não procede';
      case 'validar_final':
        return 'Validar final';
      case 'reprovar_validacao_final':
        return 'Reprovar validação final';
      default:
        return this.formatarAcaoHistoricoFallback(acao);
    }
  }

  private formatarAcaoHistoricoFallback(acao: string): string {
    const texto = acao
      .trim()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase();
    if (!texto) {
      return '-';
    }
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  formatTempoEtapa(tempoEtapaMs?: number): string {
    if (tempoEtapaMs === null || tempoEtapaMs === undefined || tempoEtapaMs < 0) {
      return '-';
    }

    const totalMinutos = Math.floor(tempoEtapaMs / 60000);
    const dias = Math.floor(totalMinutos / (24 * 60));
    const horas = Math.floor((totalMinutos % (24 * 60)) / 60);
    const minutos = totalMinutos % 60;

    if (dias > 0) {
      return `${dias}d ${horas}h`;
    }
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }

  getTempoReferencia(item: IrregularidadeFluxoItem): string {
    if (item.statusAtual === StatusIrregularidade.EM_MANUTENCAO && item.entradaStatusEm) {
      return item.entradaStatusEm;
    }
    return item.criadoEm;
  }

  getTempoDesdeRegistro(criadoEm: string): string {
    const registro = new Date(criadoEm).getTime();
    if (Number.isNaN(registro)) {
      return '-';
    }

    const diffMs = Date.now() - registro;
    if (diffMs <= 0) {
      return 'agora';
    }

    const totalMinutes = Math.floor(diffMs / 60000);
    const dias = Math.floor(totalMinutes / (60 * 24));
    const horas = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutos = totalMinutes % 60;

    if (dias > 0) {
      return `${dias}d ${horas}h`;
    }
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    if (minutos > 0) {
      return `${minutos}min`;
    }
    return 'agora';
  }

  private getTempoMeta(criadoEm: string): TempoFaixaConfig | null {
    if (!this.tempoFaixasAtivas.length) {
      return null;
    }
    const registro = new Date(criadoEm).getTime();
    if (Number.isNaN(registro)) {
      return null;
    }
    const horas = (Date.now() - registro) / (1000 * 60 * 60);
    return (
      this.tempoFaixasAtivas.find((faixa) => {
        const min = Number(faixa.minHoras ?? 0);
        const max = faixa.maxHoras === null || faixa.maxHoras === undefined ? null : Number(faixa.maxHoras);
        return horas >= min && (max === null || horas < max);
      }) ?? null
    );
  }

  getTempoRotulo(criadoEm: string): string {
    const meta = this.getTempoMeta(criadoEm);
    if (!meta || !meta.mostrarRotulo) {
      return '';
    }
    return (meta.label ?? '').trim();
  }

  getTempoStyle(criadoEm: string): Record<string, string> {
    const meta = this.getTempoMeta(criadoEm);
    if (!meta || !meta.mostrarCor) {
      return {};
    }
    return {
      color: meta.corHex || '#334155',
      borderColor: meta.corHex || '#cbd5e1',
      backgroundColor: `${meta.corHex || '#64748b'}1a`,
    };
  }

  private setDefaultPeriodoAtual(): void {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.filtroDataInicio = this.toInputDate(first);
    this.filtroDataFim = this.toInputDate(last);
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private resolveStatusFiltro(): StatusIrregularidade[] {
    if (this.modo !== 'tratamento') {
      return this.statusFiltro;
    }
    if (!this.filtroStatus) {
      return this.statusOptions;
    }
    return [this.filtroStatus];
  }

  private buildMensagemSucessoManutencao(res: RelatorioManutencaoExecucao): string {
    const total = Number(res?.totalEnviadas ?? 0);
    const totalVeiculos = Number(res?.resumo?.totalVeiculos ?? 0);
    const totalAnexos = Number(res?.resumo?.totalAnexos ?? 0);
    return `Encaminhamento concluído com sucesso: ${total} irregularidade(s) em ${totalVeiculos} veículo(s), com ${totalAnexos} anexo(s) no relatório.`;
  }
}

