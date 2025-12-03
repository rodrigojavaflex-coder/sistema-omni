import { Component, OnInit, inject } from '@angular/core';
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
  contextExecucao: MetaExecucao | null = null;
  private ignoreNextOutsideEvent = false;

  execucaoForm = this.fb.group({
    dataRealizado: ['', Validators.required],
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
    this.execucaoForm.reset({
      dataRealizado: '',
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
    this.execucaoForm.reset({
      dataRealizado: execucao.dataRealizado,
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
    const payload: CreateMetaExecucaoDto = {
      dataRealizado: formValue.dataRealizado || '',
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
    const data = new Date(execucao.dataRealizado).toLocaleDateString('pt-BR');
    this.deleteModalMessage = `Deseja excluir a execução realizada em ${data}?`;
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
}

