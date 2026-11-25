import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndicadorService } from '../../services/indicador.service';
import { IndicadorExecucaoService } from '../../services/indicador-execucao.service';
import {
  CreateIndicadorExecucaoDto,
  IndicadorDashboardCard,
  IndicadorExecucao,
} from '../../models/indicador.model';
import { ErrorModalService } from '../../services/error-modal.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { firstValueFrom } from 'rxjs';
import { Permission } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { DepartamentoService } from '../../services/departamento.service';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-indicador-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmationModalComponent,
    HistoricoAuditoriaComponent,
  ],
  templateUrl: './indicador-dashboard.html',
  styleUrls: ['./indicador-dashboard.css'],
})
export class IndicadorDashboardComponent implements OnInit {
  private indicadorService = inject(IndicadorService);
  private execucaoService = inject(IndicadorExecucaoService);
  private fb = inject(FormBuilder);
  private errorModalService = inject(ErrorModalService);
  private authService = inject(AuthService);
  private departamentoService = inject(DepartamentoService);
  private destroyRef = inject(DestroyRef);

  allCards: IndicadorDashboardCard[] = [];
  cards: IndicadorDashboardCard[] = [];
  cardsLoading = false;
  selectedIndicador: IndicadorDashboardCard | null = null;

  execucoes: IndicadorExecucao[] = [];
  execLoading = false;
  execModalVisible = false;
  execucaoMenuVisible = false;
  execucaoMenuPosition = { x: 0, y: 0 };
  @ViewChild('execucaoMenuRef')
  execucaoMenuRef?: ElementRef<HTMLDivElement>;
  contextExecucao: IndicadorExecucao | null = null;
  private ignoreNextOutsideEvent = false;

  execucaoForm = this.fb.group({
    mesAno: ['', Validators.required],
    valor: [
      null as number | null,
      [Validators.required, Validators.pattern(/^-?\d+([.,]\d{1,4})?$/)],
    ],
    justificativa: ['', [Validators.maxLength(1000)]],
  });
  filtersForm = this.fb.group({
    anoExercicio: [String(new Date().getFullYear())],
    departamentoId: [''],
    somenteAtivos: [true],
  });
  formVisible = false;
  editingExecucaoId: string | null = null;

  showDeleteModal = false;
  deleteModalMessage = '';
  execucaoParaExcluir: IndicadorExecucao | null = null;

  showAuditModal = false;
  execucaoParaAuditoria: IndicadorExecucao | null = null;

  departamentos: Departamento[] = [];
  availableYears: string[] = [];
  showFilters = false;
  appliedFilters = {
    anoExercicio: String(new Date().getFullYear()),
    departamentoId: '',
    somenteAtivos: true,
  };
  canCreateExecucao = false;
  canUpdateExecucao = false;
  canDeleteExecucao = false;
  canAudit = false;
  mesesAnoDisponiveis: Array<{
    value: string;
    label: string;
    month: number;
    year: number;
  }> = [];
  private readonly monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  formatNumber(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  }

  formatValor(valor: number | null | undefined, unidade: string): string {
    if (valor === null || valor === undefined) return '-';
    return `${this.formatNumber(valor)} ${unidade || ''}`.trim();
  }

  formatDataMesAno(data: string): string {
    if (!data) return '-';
    const dateOnly = data.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    if (parts.length !== 3) return '-';
    const ano = Number(parts[0]);
    const mes = Number(parts[1]);
    if (Number.isNaN(ano) || Number.isNaN(mes) || mes < 1 || mes > 12) {
      return '-';
    }
    return `${this.monthNames[mes - 1]}-${ano}`;
  }

  async ngOnInit(): Promise<void> {
    this.canCreateExecucao = this.authService.hasPermission(
      Permission.INDICADOR_EXECUCAO_CREATE,
    );
    this.canUpdateExecucao = this.authService.hasPermission(
      Permission.INDICADOR_EXECUCAO_UPDATE,
    );
    this.canDeleteExecucao = this.authService.hasPermission(
      Permission.INDICADOR_EXECUCAO_DELETE,
    );
    this.canAudit = this.authService.hasPermission(
      Permission.INDICADOR_EXECUCAO_AUDIT,
    );

    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.onApplyFilters();
      });

    await this.loadDepartamentosUsuario();
    await this.loadCards(false);
  }

  async loadCards(preserveSelection: boolean): Promise<void> {
    this.cardsLoading = true;
    try {
      const ano = this.appliedFilters.anoExercicio
        ? Number(this.appliedFilters.anoExercicio)
        : undefined;
      const cards = await firstValueFrom(
        this.indicadorService.getDashboardCards(
          Number.isFinite(ano) ? ano : undefined,
        ),
      );
      this.allCards = cards;
      this.updateAvailableYears(cards);
      await this.filterCards(preserveSelection);
    } catch {
      this.errorModalService.show(
        'Erro ao carregar painel de indicadores',
        'Erro',
      );
    } finally {
      this.cardsLoading = false;
    }
  }

  async selectIndicador(card: IndicadorDashboardCard): Promise<void> {
    this.selectedIndicador = card;
    this.closeExecucaoForm();
    await this.loadExecucoes(card.id);
  }

  openIndicadorModal(card: IndicadorDashboardCard): void {
    this.execModalVisible = true;
    void this.selectIndicador(card);
  }

  closeExecModal(): void {
    this.execModalVisible = false;
    this.closeExecucaoForm();
    this.selectedIndicador = null;
    this.execucoes = [];
    this.closeExecucaoMenu();
  }

  async loadExecucoes(indicadorId: string): Promise<void> {
    this.execLoading = true;
    try {
      this.execucoes = await firstValueFrom(
        this.execucaoService.getByIndicador(indicadorId),
      );
    } catch {
      this.errorModalService.show(
        'Erro ao carregar lançamentos do indicador',
        'Erro',
      );
      this.execucoes = [];
    } finally {
      this.execLoading = false;
      this.closeExecucaoMenu();
    }
  }

  refreshCardsOnly(): void {
    void this.loadCards(true);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.filtersForm.patchValue(this.appliedFilters, { emitEvent: false });
    }
  }

  async onApplyFilters(): Promise<void> {
    const { anoExercicio, departamentoId, somenteAtivos } =
      this.filtersForm.value;
    const previousAno = this.appliedFilters.anoExercicio;
    this.appliedFilters = {
      anoExercicio: anoExercicio || '',
      departamentoId: departamentoId || '',
      somenteAtivos: !!somenteAtivos,
    };
    if (previousAno !== this.appliedFilters.anoExercicio) {
      await this.loadCards(true);
      return;
    }
    await this.filterCards(true);
  }

  async onClearFilters(): Promise<void> {
    this.filtersForm.reset({
      anoExercicio: '',
      departamentoId: '',
      somenteAtivos: false,
    });
  }

  openCreateExecucao(): void {
    if (!this.selectedIndicador?.ativo) {
      this.errorModalService.show(
        'Não é possível lançar em indicador inativo',
        'Atenção',
      );
      return;
    }
    this.gerarMesesAnoDisponiveis();
    this.execucaoForm.reset({
      mesAno: '',
      valor: null,
      justificativa: '',
    });
    this.editingExecucaoId = null;
    this.formVisible = true;
  }

  private async filterCards(preserveSelection: boolean): Promise<void> {
    const { departamentoId, somenteAtivos } = this.appliedFilters;
    let filtered = [...this.allCards];

    if (departamentoId) {
      filtered = filtered.filter((c) => c.departamentoId === departamentoId);
    }
    if (somenteAtivos) {
      filtered = filtered.filter((c) => c.ativo);
    }

    this.cards = filtered;

    if (!filtered.length) {
      this.closeExecModal();
      return;
    }

    if (preserveSelection && this.selectedIndicador) {
      const current = filtered.find(
        (c) => c.id === this.selectedIndicador?.id,
      );
      if (current) {
        this.selectedIndicador = current;
        if (this.execModalVisible) {
          await this.loadExecucoes(current.id);
        }
        return;
      }
      this.closeExecModal();
    }
  }

  private updateAvailableYears(cards: IndicadorDashboardCard[]): void {
    const years = new Set<string>();
    const current = String(new Date().getFullYear());
    years.add(current);
    cards.forEach((card) => {
      if (card.ultimoPeriodo) {
        const y = String(card.ultimoPeriodo).slice(0, 4);
        if (y) years.add(y);
      }
    });
    if (this.appliedFilters.anoExercicio) {
      years.add(this.appliedFilters.anoExercicio);
    }
    this.availableYears = Array.from(years).sort();
  }

  private async loadDepartamentosUsuario(): Promise<void> {
    try {
      const user = await this.authService.getProfile();
      const ids = user?.departamentos?.map((d) => d.id) || [];
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
    } catch {
      this.departamentos = [];
    }
  }

  get hasAppliedFilters(): boolean {
    return (
      !!this.appliedFilters.anoExercicio ||
      !!this.appliedFilters.departamentoId ||
      this.appliedFilters.somenteAtivos
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
      chips.push({ label: 'Departamento', value: depName });
    }
    if (this.appliedFilters.somenteAtivos) {
      chips.push({ label: 'Status', value: 'Somente ativos' });
    }
    return chips;
  }

  editExecucao(execucao: IndicadorExecucao): void {
    this.gerarMesesAnoDisponiveis();
    const mesAnoValue = this.converterDataParaMesAno(execucao.dataReferencia);
    this.execucaoForm.reset({
      mesAno: mesAnoValue,
      valor: execucao.valor ?? null,
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
    if (!this.selectedIndicador) return;
    if (this.execucaoForm.invalid) {
      this.execucaoForm.markAllAsTouched();
      return;
    }

    const formValue = this.execucaoForm.value;
    const dataReferencia = this.converterMesAnoParaData(formValue.mesAno || '');
    if (!dataReferencia) {
      this.errorModalService.show('Erro ao converter período selecionado', 'Erro');
      return;
    }

    const valorRaw = String(formValue.valor ?? '').replace(',', '.');
    const payload: CreateIndicadorExecucaoDto = {
      dataReferencia,
      valor: Number(valorRaw),
      justificativa: formValue.justificativa?.trim() || undefined,
    };

    try {
      if (this.editingExecucaoId) {
        await firstValueFrom(
          this.execucaoService.update(
            this.selectedIndicador.id,
            this.editingExecucaoId,
            payload,
          ),
        );
      } else {
        await firstValueFrom(
          this.execucaoService.create(this.selectedIndicador.id, payload),
        );
      }
      this.closeExecucaoForm();
      await this.loadExecucoes(this.selectedIndicador.id);
      await this.loadCards(true);
    } catch (error) {
      this.errorModalService.show(
        this.getErrorMessage(error, 'Erro ao salvar lançamento'),
        'Erro',
      );
    }
  }

  confirmDelete(execucao: IndicadorExecucao): void {
    this.execucaoParaExcluir = execucao;
    this.deleteModalMessage = `Deseja excluir o lançamento de ${this.formatDataMesAno(execucao.dataReferencia)}?`;
    this.showDeleteModal = true;
  }

  async onDeleteConfirmed(): Promise<void> {
    if (!this.selectedIndicador || !this.execucaoParaExcluir) return;
    try {
      await firstValueFrom(
        this.execucaoService.delete(
          this.selectedIndicador.id,
          this.execucaoParaExcluir.id,
        ),
      );
      this.showDeleteModal = false;
      this.execucaoParaExcluir = null;
      await this.loadExecucoes(this.selectedIndicador.id);
      await this.loadCards(true);
    } catch (error) {
      this.errorModalService.show(
        this.getErrorMessage(error, 'Erro ao excluir lançamento'),
        'Erro',
      );
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteModal = false;
    this.execucaoParaExcluir = null;
  }

  openAudit(execucao: IndicadorExecucao): void {
    if (!this.canAudit) return;
    this.execucaoParaAuditoria = execucao;
    this.showAuditModal = true;
    this.closeExecucaoMenu();
  }

  closeAudit(): void {
    this.showAuditModal = false;
    this.execucaoParaAuditoria = null;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    const rawMessage =
      (error as { error?: { message?: string | string[] }; message?: string })
        ?.error?.message ??
      (error as { message?: string })?.message ??
      null;
    if (Array.isArray(rawMessage)) return rawMessage.join('\n');
    return typeof rawMessage === 'string' && rawMessage.trim().length
      ? rawMessage
      : fallback;
  }

  openExecucaoMenu(event: MouseEvent, execucao: IndicadorExecucao): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextExecucao = execucao;
    this.execucaoMenuPosition = { x: event.clientX, y: event.clientY };
    this.execucaoMenuVisible = true;
    this.ignoreNextOutsideEvent = true;
    setTimeout(() => {
      this.ignoreNextOutsideEvent = false;
    }, 0);
  }

  closeExecucaoMenu(): void {
    this.execucaoMenuVisible = false;
    this.contextExecucao = null;
  }

  onMenuEdit(): void {
    if (!this.contextExecucao) return;
    this.editExecucao(this.contextExecucao);
    this.closeExecucaoMenu();
  }

  onMenuAudit(): void {
    if (!this.contextExecucao) return;
    this.openAudit(this.contextExecucao);
  }

  onMenuDelete(): void {
    if (!this.contextExecucao) return;
    this.confirmDelete(this.contextExecucao);
    this.closeExecucaoMenu();
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.ignoreNextOutsideEvent || !this.execucaoMenuVisible) return;
    const target = event.target as Node;
    if (this.execucaoMenuRef?.nativeElement.contains(target)) return;
    this.closeExecucaoMenu();
  }

  private gerarMesesAnoDisponiveis(): void {
    const ano =
      Number(this.appliedFilters.anoExercicio) || new Date().getFullYear();
    this.mesesAnoDisponiveis = this.monthNames.map((label, idx) => {
      const month = idx + 1;
      const value = `${ano}-${String(month).padStart(2, '0')}`;
      return { value, label: `${label}/${ano}`, month, year: ano };
    });
  }

  private converterMesAnoParaData(mesAno: string): string | null {
    if (!mesAno || !/^\d{4}-\d{2}$/.test(mesAno)) return null;
    return `${mesAno}-01`;
  }

  private converterDataParaMesAno(data: string): string {
    const dateOnly = data.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    if (parts.length < 2) return '';
    return `${parts[0]}-${parts[1]}`;
  }
}
