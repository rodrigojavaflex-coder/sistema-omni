import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MetaService } from '../../services/meta.service';
import { MetaExecucaoService } from '../../services/meta-execucao.service';
import {
  MetaDashboardCard,
  MetaExecucao,
  POLARIDADE_META_LABELS,
  CreateMetaExecucaoDto,
  PolaridadeMeta,
  UnidadeMeta,
  UNIDADE_META_LABELS,
  INDICADOR_META_LABELS,
  IndicadorMeta,
} from '../../models/meta.model';
import { ErrorModalService } from '../../services/error-modal.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { firstValueFrom } from 'rxjs';
import { Permission } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-meta-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmationModalComponent, HistoricoAuditoriaComponent],
  templateUrl: './meta-dashboard.html',
  styleUrls: ['./meta-dashboard.css'],
})
export class MetaDashboardComponent implements OnInit {
  private metaService = inject(MetaService);
  private metaExecucaoService = inject(MetaExecucaoService);
  private fb = inject(FormBuilder);
  private errorModalService = inject(ErrorModalService);
  private authService = inject(AuthService);
  private departamentoService = inject(DepartamentoService);

  allCards: MetaDashboardCard[] = [];
  cards: MetaDashboardCard[] = [];
  cardsLoading = false;
  selectedMeta: MetaDashboardCard | null = null;

  execucoes: MetaExecucao[] = [];
  execLoading = false;
  execModalVisible = false;
  execucaoMenuVisible = false;
  execucaoMenuPosition = { x: 0, y: 0 };
  @ViewChild('execucaoMenuRef')
  execucaoMenuRef?: ElementRef<HTMLDivElement>;
  contextExecucao: MetaExecucao | null = null;
  private ignoreNextOutsideEvent = false;

  execucaoForm = this.fb.group({
    mesAno: ['', Validators.required],
    valorRealizado: [
      null as number | null,
      [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,2})?$/)],
    ],
    justificativa: ['', [Validators.maxLength(1000)]],
  });
  filtersForm = this.fb.group({
    anoExercicio: [''],
    departamentoId: [''],
  });
  formVisible = false;
  editingExecucaoId: string | null = null;

  showDeleteModal = false;
  deleteModalMessage = '';
  execucaoParaExcluir: MetaExecucao | null = null;

  showAuditModal = false;
  execucaoParaAuditoria: MetaExecucao | null = null;

  polaridadeLabels = POLARIDADE_META_LABELS;
  unidadeLabels = UNIDADE_META_LABELS;
  indicadorLabels = INDICADOR_META_LABELS;
  polaridadeEnum = PolaridadeMeta;
  indicadorEnum = IndicadorMeta;
  unidadeEnum = UnidadeMeta;
  departamentos: Departamento[] = [];
  availableYears: string[] = [];
  showFilters = false;
  appliedFilters = {
    anoExercicio: '',
    departamentoId: '',
  };
  canCreateExecucao = false;
  canUpdateExecucao = false;
  canDeleteExecucao = false;
  canAudit = false;
  mesesAnoDisponiveis: Array<{ value: string; label: string; month: number; year: number }> = [];
  private readonly colorSuccess = '#27ae60';
  private readonly colorMedium = '#2980b9';
  private readonly colorAlert = '#e74c3c';
  private readonly monthLabels = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];
  private readonly monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  private formatNumber(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  formatValorComUnidade(
    valor: number | null | undefined,
    unidade: UnidadeMeta,
  ): string {
    if (valor === null || valor === undefined) {
      return '-';
    }

    const numero = this.formatNumber(valor);

    switch (unidade) {
      case UnidadeMeta.PORCENTAGEM:
        return `${numero} %`;
      case UnidadeMeta.VALOR:
        return `R$ ${numero}`;
      case UnidadeMeta.HORAS:
        return `${numero} horas`;
      case UnidadeMeta.DIAS:
        return `${numero} dias`;
      default:
        return numero;
    }
  }

  formatPrazoFinal(date?: string | null): string {
    if (!date) return '-';
    const normalized =
      date.includes('T') || date.includes(' ')
        ? date.replace(' ', 'T')
        : `${date}T00:00:00`;
    let parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
      // tenta novamente apenas com a parte da data
      const onlyDate = normalized.split('T')[0];
      parsed = new Date(`${onlyDate}T00:00:00`);
    }
    if (Number.isNaN(parsed.getTime())) return '-';

    const month = this.monthLabels[parsed.getMonth()];
    const year = parsed.getFullYear().toString().slice(-2);
    if (!month) return '-';
    return `${month}/${year}`;
  }

  formatDataMesAno(data: string): string {
    if (!data) return '-';
    
    // Extrai apenas a parte da data (sem hora) para evitar problemas de timezone
    const dateOnly = data.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    
    if (parts.length !== 3) return '-';
    
    const ano = Number(parts[0]);
    const mes = Number(parts[1]); // mês no formato 1-12
    
    if (Number.isNaN(ano) || Number.isNaN(mes) || mes < 1 || mes > 12) {
      return '-';
    }
    
    // monthNames é indexado de 0-11, então subtrai 1
    return `${this.monthNames[mes - 1]}-${ano}`;
  }

  async ngOnInit(): Promise<void> {
    this.canCreateExecucao = this.authService.hasPermission(Permission.META_EXECUCAO_CREATE);
    this.canUpdateExecucao = this.authService.hasPermission(Permission.META_EXECUCAO_UPDATE);
    this.canDeleteExecucao = this.authService.hasPermission(Permission.META_EXECUCAO_DELETE);
    this.canAudit = this.authService.hasPermission(Permission.META_EXECUCAO_AUDIT);
    await this.loadDepartamentosUsuario();
    await this.loadCards(false);
  }

  async loadCards(preserveSelection: boolean): Promise<void> {
    this.cardsLoading = true;
    try {
      const cards = await firstValueFrom(this.metaService.getDashboardCards());
      this.allCards = cards;
      this.updateAvailableYears(cards);
      
      // Aplica o filtro do ano atual na primeira carga
      if (!preserveSelection && this.appliedFilters.anoExercicio === '') {
        const anoAtual = String(new Date().getFullYear());
        if (this.availableYears.includes(anoAtual)) {
          this.appliedFilters.anoExercicio = anoAtual;
          this.filtersForm.patchValue({ anoExercicio: anoAtual }, { emitEvent: false });
        }
      }
      
      await this.filterCards(preserveSelection, false);
    } catch (error) {
      this.errorModalService.show('Erro ao carregar painel de metas', 'Erro');
    } finally {
      this.cardsLoading = false;
    }
  }

  async selectMeta(card: MetaDashboardCard): Promise<void> {
    this.selectedMeta = card;
    this.closeExecucaoForm();
    await this.loadExecucoes(card.id);
  }

  openMetaModal(card: MetaDashboardCard): void {
    this.execModalVisible = true;
    void this.selectMeta(card);
  }

  closeExecModal(): void {
    this.execModalVisible = false;
    this.closeExecucaoForm();
    this.selectedMeta = null;
    this.execucoes = [];
    this.closeExecucaoMenu();
  }

  async loadExecucoes(metaId: string): Promise<void> {
    this.execLoading = true;
    try {
      this.execucoes = await firstValueFrom(this.metaExecucaoService.getByMeta(metaId));
    } catch (error) {
      this.errorModalService.show('Erro ao carregar execuções da meta', 'Erro');
      this.execucoes = [];
    } finally {
      this.execLoading = false;
      this.closeExecucaoMenu();
    }
  }

  refreshSelected(): void {
    if (this.selectedMeta) {
      void this.selectMeta(this.selectedMeta);
    }
  }

  refreshCardsOnly(): void {
    this.loadCards(true);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.filtersForm.patchValue(this.appliedFilters, { emitEvent: false });
    }
  }

  async onApplyFilters(): Promise<void> {
    const { anoExercicio, departamentoId } = this.filtersForm.value;
    this.appliedFilters = {
      anoExercicio: anoExercicio || '',
      departamentoId: departamentoId || '',
    };
    await this.filterCards(true, true);
  }

  async onClearFilters(): Promise<void> {
    this.filtersForm.reset({
      anoExercicio: '',
      departamentoId: '',
    });
    this.appliedFilters = { anoExercicio: '', departamentoId: '' };
    await this.filterCards(true, true);
  }

  openCreateExecucao(): void {
    this.gerarMesesAnoDisponiveis();
    this.execucaoForm.reset({
      mesAno: '',
      valorRealizado: null,
      justificativa: '',
    });
    this.editingExecucaoId = null;
    this.formVisible = true;
  }

  private async filterCards(
    preserveSelection: boolean,
    closePanel: boolean,
  ): Promise<void> {
    const { anoExercicio, departamentoId } = this.appliedFilters;
    let filtered = [...this.allCards];

    if (anoExercicio) {
      filtered = filtered.filter(
        (card) => this.extractYear(card.prazoFinal) === anoExercicio,
      );
    }

    if (departamentoId) {
      filtered = filtered.filter(
        (card) => card.departamentoId === departamentoId,
      );
    }

    this.cards = filtered;
    if (closePanel) {
      this.showFilters = false;
    }

    if (!filtered.length) {
      this.closeExecModal();
      return;
    }

    if (preserveSelection && this.selectedMeta) {
      const current = filtered.find(
        (card) => card.id === this.selectedMeta?.id,
      );
      if (current) {
        this.selectedMeta = current;
        if (this.execModalVisible) {
          await this.loadExecucoes(current.id);
        }
        return;
      }
      this.closeExecModal();
    }

    if (!preserveSelection) {
      this.selectedMeta = null;
      this.execucoes = [];
      this.execModalVisible = false;
    }
  }

  private updateAvailableYears(cards: MetaDashboardCard[]): void {
    const years = new Set<string>();
    cards.forEach((card) => {
      const year = this.extractYear(card.prazoFinal);
      if (year) {
        years.add(year);
      }
    });
    this.availableYears = Array.from(years).sort();
  }

  private extractYear(date?: string | null): string | null {
    if (!date) return null;
    const normalized = date.split('T')[0];
    const parsed = new Date(`${normalized}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return null;
    return String(parsed.getFullYear());
  }

  private async loadDepartamentosUsuario(): Promise<void> {
    try {
      const user = await this.authService.getProfile();
      const ids = user?.departamentos?.map((d: any) => d.id) || [];
      if (!ids.length) {
        this.departamentos = [];
        return;
      }
      if (!this.authService.hasPermission(Permission.DEPARTAMENTO_READ)) {
        this.departamentos = (user?.departamentos ?? []).map((dep) => ({
          ...dep,
          criadoEm: '',
          atualizadoEm: '',
        }));
        return;
      }
      const todos = await firstValueFrom(this.departamentoService.getAll());
      this.departamentos = todos.filter((dep) => ids.includes(dep.id));
    } catch (error) {
      this.departamentos = [];
    }
  }

  get hasAppliedFilters(): boolean {
    return (
      !!this.appliedFilters.anoExercicio ||
      !!this.appliedFilters.departamentoId
    );
  }

  get appliedFiltersChips(): { label: string; value: string }[] {
    const chips: { label: string; value: string }[] = [];
    if (this.appliedFilters.anoExercicio) {
      chips.push({
        label: 'Exercício',
        value: this.appliedFilters.anoExercicio,
      });
    }
    if (this.appliedFilters.departamentoId) {
      const depName =
        this.departamentos.find(
          (dep) => dep.id === this.appliedFilters.departamentoId,
        )?.nomeDepartamento ?? 'Departamento selecionado';
      chips.push({
        label: 'Departamento',
        value: depName,
      });
    }
    return chips;
  }

  editExecucao(execucao: MetaExecucao): void {
    this.gerarMesesAnoDisponiveis();
    const mesAnoValue = this.converterDataParaMesAno(execucao.dataRealizado);
    this.execucaoForm.reset({
      mesAno: mesAnoValue,
      valorRealizado: execucao.valorRealizado ?? null,
      justificativa: execucao.justificativa || '',
    });
    this.editingExecucaoId = execucao.id;
    this.formVisible = true;
  }

  closeExecucaoForm(): void {
    this.formVisible = false;
    this.editingExecucaoId = null;
    this.execucaoForm.reset();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.execucaoForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  async saveExecucao(): Promise<void> {
    if (!this.selectedMeta) return;
    if (this.execucaoForm.invalid) {
      this.execucaoForm.markAllAsTouched();
      return;
    }

    const formValue = this.execucaoForm.value;
    const dataRealizado = this.converterMesAnoParaData(formValue.mesAno || '');
    
    if (!dataRealizado) {
      this.errorModalService.show('Erro ao converter data selecionada', 'Erro');
      return;
    }

    const payload: CreateMetaExecucaoDto = {
      dataRealizado,
      valorRealizado: Number(formValue.valorRealizado),
      justificativa: formValue.justificativa?.trim() || undefined,
    };

    try {
      if (this.editingExecucaoId) {
        await firstValueFrom(
          this.metaExecucaoService.update(this.selectedMeta.id, this.editingExecucaoId, payload),
        );
      } else {
        await firstValueFrom(this.metaExecucaoService.create(this.selectedMeta.id, payload));
      }
      this.closeExecucaoForm();
      await this.loadExecucoes(this.selectedMeta.id);
      await this.loadCards(true);
    } catch (error) {
      this.errorModalService.show(
        this.getErrorMessage(error, 'Erro ao salvar execução da meta'),
        'Erro',
      );
    }
  }

  confirmDelete(execucao: MetaExecucao): void {
    this.execucaoParaExcluir = execucao;
    // Usa formatDataMesAno para evitar conversão de timezone
    const dataFormatada = this.formatDataMesAno(execucao.dataRealizado);
    // Converte para formato brasileiro (DD/MM/AAAA) se necessário
    const dateOnly = execucao.dataRealizado.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    const dataBR = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dataFormatada;
    this.deleteModalMessage = `Deseja excluir a execução realizada em ${dataBR}?`;
    this.showDeleteModal = true;
  }

  async onDeleteConfirmed(): Promise<void> {
    if (!this.selectedMeta || !this.execucaoParaExcluir) return;
    try {
      await firstValueFrom(
        this.metaExecucaoService.delete(this.selectedMeta.id, this.execucaoParaExcluir.id),
      );
      this.showDeleteModal = false;
      this.execucaoParaExcluir = null;
      await this.loadExecucoes(this.selectedMeta.id);
      await this.loadCards(true);
    } catch (error) {
      this.errorModalService.show(
        this.getErrorMessage(error, 'Erro ao excluir execução'),
        'Erro',
      );
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteModal = false;
    this.execucaoParaExcluir = null;
  }

  openAudit(execucao: MetaExecucao): void {
    if (!this.canAudit) return;
    this.execucaoParaAuditoria = execucao;
    this.showAuditModal = true;
    this.closeExecucaoMenu();
  }

  closeAudit(): void {
    this.showAuditModal = false;
    this.execucaoParaAuditoria = null;
  }

  getCardColor(card: MetaDashboardCard): string {
    const value = card.progressoPercentual;
    if (card.polaridade === PolaridadeMeta.MENOR_MELHOR) {
      if (value >= 80) return this.colorSuccess;
      if (value >= 40) return this.colorMedium;
      return this.colorAlert;
    }

    if (value >= 80) return this.colorSuccess;
    if (value >= 40) return this.colorMedium;
    return this.colorAlert;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    const rawMessage =
      (error as any)?.error?.message ??
      (error as any)?.message ??
      null;
    if (Array.isArray(rawMessage)) {
      return rawMessage.join('\n');
    }
    return typeof rawMessage === 'string' && rawMessage.trim().length
      ? rawMessage
      : fallback;
  }

  openExecucaoMenu(event: MouseEvent, execucao: MetaExecucao): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeExecucaoMenu();
    this.contextExecucao = execucao;
    this.execucaoMenuVisible = true;
    this.execucaoMenuPosition = { x: event.clientX, y: event.clientY };
    this.ignoreNextOutsideEvent = true;
    document.addEventListener('click', this.handleOutsideClick, true);
    document.addEventListener('contextmenu', this.handleOutsideClick, true);
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => this.adjustExecucaoMenuPosition());
    } else {
      setTimeout(() => this.adjustExecucaoMenuPosition(), 0);
    }
  }

  private handleOutsideClick = (): void => {
    if (this.ignoreNextOutsideEvent) {
      this.ignoreNextOutsideEvent = false;
      return;
    }
    this.closeExecucaoMenu();
  };

  closeExecucaoMenu(): void {
    if (this.execucaoMenuVisible) {
      document.removeEventListener('click', this.handleOutsideClick, true);
      document.removeEventListener('contextmenu', this.handleOutsideClick, true);
    }
    this.execucaoMenuVisible = false;
    this.contextExecucao = null;
    this.ignoreNextOutsideEvent = false;
  }

  private adjustExecucaoMenuPosition(): void {
    if (!this.execucaoMenuRef || typeof window === 'undefined') return;

    const padding = 12;
    const menu = this.execucaoMenuRef.nativeElement;
    const { width, height } = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxX = Math.max(padding, viewportWidth - width - padding);
    const maxY = Math.max(padding, viewportHeight - height - padding);

    const clampedX = Math.min(Math.max(padding, this.execucaoMenuPosition.x), maxX);
    const clampedY = Math.min(Math.max(padding, this.execucaoMenuPosition.y), maxY);

    if (
      clampedX !== this.execucaoMenuPosition.x ||
      clampedY !== this.execucaoMenuPosition.y
    ) {
      this.execucaoMenuPosition = { x: clampedX, y: clampedY };
    }
  }

  onMenuEdit(): void {
    if (this.contextExecucao) {
      this.editExecucao(this.contextExecucao);
    }
    this.closeExecucaoMenu();
  }

  onMenuDelete(): void {
    if (this.contextExecucao) {
      this.confirmDelete(this.contextExecucao);
    }
    this.closeExecucaoMenu();
  }

  onMenuAudit(): void {
    if (this.contextExecucao) {
      this.openAudit(this.contextExecucao);
    }
    this.closeExecucaoMenu();
  }

  private gerarMesesAnoDisponiveis(): void {
    if (!this.selectedMeta) {
      this.mesesAnoDisponiveis = [];
      return;
    }

    const inicio = this.selectedMeta.inicioDaMeta;
    const fim = this.selectedMeta.prazoFinal;

    if (!inicio) {
      this.mesesAnoDisponiveis = [];
      return;
    }

    // Extrai apenas a parte da data para evitar problemas de timezone
    const parseDateOnly = (dateStr: string | null | undefined): { ano: number; mes: number } | null => {
      if (!dateStr) return null;
      const dateOnly = dateStr.split('T')[0]; // Pega apenas YYYY-MM-DD
      const parts = dateOnly.split('-');
      if (parts.length !== 3) return null;
      const ano = Number(parts[0]);
      const mes = Number(parts[1]);
      if (Number.isNaN(ano) || Number.isNaN(mes)) return null;
      return { ano, mes };
    };

    const inicioParsed = parseDateOnly(inicio);
    const fimParsed = parseDateOnly(fim);

    if (!inicioParsed) {
      this.mesesAnoDisponiveis = [];
      return;
    }

    const meses: Array<{ value: string; label: string; month: number; year: number }> = [];
    
    let mesAtual = inicioParsed.mes; // mês no formato 1-12
    let anoAtual = inicioParsed.ano;

    const mesFim = fimParsed ? fimParsed.mes : new Date().getMonth() + 1;
    const anoFim = fimParsed ? fimParsed.ano : new Date().getFullYear();

    while (
      anoAtual < anoFim ||
      (anoAtual === anoFim && mesAtual <= mesFim)
    ) {
      const value = `${anoAtual}-${String(mesAtual).padStart(2, '0')}`;
      const label = `${this.monthNames[mesAtual - 1]}-${anoAtual}`;
      
      meses.push({
        value,
        label,
        month: mesAtual,
        year: anoAtual,
      });

      mesAtual++;
      if (mesAtual > 12) {
        mesAtual = 1;
        anoAtual++;
      }
    }

    this.mesesAnoDisponiveis = meses;
  }

  private converterMesAnoParaData(mesAnoValue: string): string {
    if (!mesAnoValue || !this.selectedMeta) {
      return '';
    }

    // O valor vem no formato "2026-02" (ano-mes)
    const parts = mesAnoValue.split('-');
    if (parts.length !== 2) {
      return '';
    }

    const ano = Number(parts[0]);
    const mesNumero = Number(parts[1]); // mês no formato 1-12

    if (Number.isNaN(ano) || Number.isNaN(mesNumero) || mesNumero < 1 || mesNumero > 12) {
      return '';
    }

    // Extrai apenas a parte da data (sem hora) para evitar problemas de timezone
    const parseDateOnly = (dateStr: string | null | undefined): { ano: number; mes: number; dia: number } | null => {
      if (!dateStr) return null;
      const dateOnly = dateStr.split('T')[0]; // Pega apenas YYYY-MM-DD
      const dateParts = dateOnly.split('-');
      if (dateParts.length !== 3) return null;
      const parsedAno = Number(dateParts[0]);
      const parsedMes = Number(dateParts[1]);
      const parsedDia = Number(dateParts[2]);
      if (Number.isNaN(parsedAno) || Number.isNaN(parsedMes) || Number.isNaN(parsedDia)) {
        return null;
      }
      return {
        ano: parsedAno,
        mes: parsedMes,
        dia: parsedDia,
      };
    };

    const inicioParsed = parseDateOnly(this.selectedMeta.inicioDaMeta);
    const fimParsed = parseDateOnly(this.selectedMeta.prazoFinal);

    let dia: number;

    // Verifica se é o mês de início
    if (inicioParsed && ano === inicioParsed.ano && mesNumero === inicioParsed.mes) {
      dia = inicioParsed.dia;
    }
    // Verifica se é o mês de fim
    else if (fimParsed && ano === fimParsed.ano && mesNumero === fimParsed.mes) {
      dia = fimParsed.dia;
    }
    // Caso contrário, usa o primeiro dia do mês
    else {
      dia = 1;
    }

    // Constrói a data no formato YYYY-MM-DD
    const anoStr = String(ano);
    const mesStr = String(mesNumero).padStart(2, '0');
    const diaStr = String(dia).padStart(2, '0');

    return `${anoStr}-${mesStr}-${diaStr}`;
  }

  private converterDataParaMesAno(data: string): string {
    if (!data) return '';

    // Extrai apenas a parte da data (sem hora) para evitar problemas de timezone
    const dateOnly = data.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    
    if (parts.length !== 3) return '';
    
    const ano = Number(parts[0]);
    const mes = Number(parts[1]); // mês no formato 1-12
    
    if (Number.isNaN(ano) || Number.isNaN(mes) || mes < 1 || mes > 12) {
      return '';
    }
    
    return `${ano}-${String(mes).padStart(2, '0')}`;
  }
}

