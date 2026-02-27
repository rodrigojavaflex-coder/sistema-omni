import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BaseListComponent } from '../base-list.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { HistoricoAuditoriaComponent } from '../historico-auditoria/historico-auditoria.component';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';
import {
  AreaVistoriada,
  AreaComponente,
  SetAreaComponentesDto,
  CreateAreaVistoriadaDto,
  UpdateAreaVistoriadaDto,
  ComponenteComArea,
} from '../../models/area-vistoriada.model';
import { AreaVistoriadaService } from '../../services/area-vistoriada.service';
import { ModeloVeiculoService } from '../../services/modelo-veiculo.service';
import { ComponenteService } from '../../services/componente.service';
import { ModeloVeiculo } from '../../models/modelo-veiculo.model';
import { Componente } from '../../models/componente.model';
import { Permission } from '../../models/usuario.model';
import { NotificationService } from '../../services/notification.service';
import { MatrizCriticidadeService } from '../../services/matriz-criticidade.service';
import { SintomaService } from '../../services/sintoma.service';
import { ConfiguracaoService } from '../../services/configuracao.service';
import { environment } from '../../../environments/environment';
import {
  MatrizCriticidade,
  CreateMatrizCriticidadeDto,
  UpdateMatrizCriticidadeDto,
  GravidadeCriticidade,
} from '../../models/matriz-criticidade.model';
import { Sintoma } from '../../models/sintoma.model';

@Component({
  selector: 'app-area-vistoriada-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ConfirmationModalComponent,
    HistoricoAuditoriaComponent,
    MultiSelectComponent,
  ],
  templateUrl: './area-vistoriada-list.html',
  styleUrls: ['./area-vistoriada-list.css'],
})
export class AreaVistoriadaListComponent extends BaseListComponent<AreaVistoriada> implements OnInit {
  private areaService = inject(AreaVistoriadaService);
  private modeloService = inject(ModeloVeiculoService);
  private componenteService = inject(ComponenteService);
  private matrizService = inject(MatrizCriticidadeService);
  private sintomaService = inject(SintomaService);
  private configuracaoService = inject(ConfiguracaoService);
  private notificationService = inject(NotificationService);

  allItems: AreaVistoriada[] = [];
  modelos: ModeloVeiculo[] = [];

  /** Filtros multi-seleção */
  filterAreasSelected: string[] = [];
  filterModelosSelected: string[] = [];
  filterAtivoSelected: string[] = [];
  filterSintomasSelected: string[] = [];
  filterGravidadesSelected: string[] = [];
  /** Filtro de componentes por matriz: todos, só com matriz, só sem matriz (cards e relatório PDF) */
  filterComponentesMatriz: 'todos' | 'com_matriz' | 'sem_matriz' = 'todos';

  /** Por componente da área expandida: sintomas e gravidades presentes na matriz (para filtros) */
  componentMatrizSintomaIds = new Map<string, Set<string>>();
  componentMatrizGravidades = new Map<string, Set<string>>();

  canCreate = this.authService.hasPermission(Permission.AREAVISTORIADA_CREATE);
  canEdit = this.authService.hasPermission(Permission.AREAVISTORIADA_UPDATE);
  canDelete = this.authService.hasPermission(Permission.AREAVISTORIADA_DELETE);
  canAudit = this.authService.hasPermission(Permission.AREAVISTORIADA_READ);
  canCreateComponente = this.authService.hasPermission(Permission.COMPONENTE_CREATE);
  canRemoveComponenteDaArea = this.authService.hasPermission(Permission.AREAVISTORIADA_REMOVER_COMPONENTE);
  canVincularComponente = this.authService.hasPermission(Permission.AREAVISTORIADA_VINCULAR_COMPONENTE);
  canCreateMatriz = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_CREATE);
  canEditMatriz = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_UPDATE);
  canDeleteMatriz = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_DELETE);
  canReadMatriz = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_READ);
  canAuditComponente = this.authService.hasPermission(Permission.COMPONENTE_READ);
  canAuditMatriz = this.authService.hasPermission(Permission.MATRIZCRITICIDADE_READ);

  showAuditModal = false;
  selectedItemForAudit: AreaVistoriada | null = null;
  showComponenteAuditModal = false;
  selectedComponenteForAudit: Componente | null = null;
  showMatrizAuditModal = false;
  selectedMatrizForAudit: MatrizCriticidade | null = null;

  // Nova área (modal)
  showNovaAreaModal = false;
  novoAreaNome = '';
  novoAreaAtivo = true;
  novoAreaModelosSelecionados: string[] = [];
  savingArea = false;

  // Modal Editar Área
  showEditarAreaModal = false;
  editAreaModalId: string | null = null;
  editAreaModalNome = '';
  editAreaModalAtivo = true;
  editAreaModalModelosSelecionados: string[] = [];
  savingEditArea = false;

  // Reordenar áreas (drag)
  savingOrder = false;

  // Área expandida (componentes)
  expandedAreaId: string | null = null;
  expandedAreaNome = '';
  expandedComponenteId: string | null = null;
  componentes: Componente[] = [];
  componentesSelecionados = new Map<string, { ordem: number }>();
  /** Quantidade de matriz por componente (da área expandida); usado pelo filtro "somente sem matriz" */
  areaComponenteMatrizCount = new Map<string, number>();
  loadingComponentes = false;
  savingComponente = false;
  // Modal Editar Componente
  showEditarComponenteModal = false;
  componenteToEdit: Componente | null = null;
  editComponenteModalNome = '';
  editComponenteModalAtivo = true;
  savingEditComponente = false;

  // Modal Vincular Componente
  showVincularModal = false;
  areaParaVincular: AreaVistoriada | null = null;
  componentesComAreaList: ComponenteComArea[] = [];
  filterVincularNome = '';
  onlySemArea = false;
  loadingVincular = false;
  savingVincular = false;
  showRemoveFromAreaConfirm = false;
  componenteToRemoveFromArea: ComponenteComArea | null = null;
  showDeleteComponenteModal = false;
  componenteToDelete: Componente | null = null;
  savingComponentesArea = false;

  // Modal Novo Componente (por área)
  showNovoComponenteModal = false;
  novoComponenteModalNome = '';
  novoComponenteModalAtivo = true;
  savingNovoComponente = false;

  // Modal Matriz de Criticidade (por componente)
  showMatrizModal = false;
  componenteParaMatriz: Componente | null = null;
  matrizList: MatrizCriticidade[] = [];
  loadingMatriz = false;
  sintomas: Sintoma[] = [];
  gravidades: GravidadeCriticidade[] = ['VERDE', 'AMARELO', 'VERMELHO'];
  showNovoMatrizForm = false;
  novoMatrizIdsintoma = '';
  novoMatrizGravidade: GravidadeCriticidade = 'VERDE';
  novoMatrizExigeFoto = true;
  novoMatrizPermiteAudio = true;
  savingNovoMatriz = false;
  showEditarMatrizModal = false;
  matrizToEdit: MatrizCriticidade | null = null;
  editMatrizIdsintoma = '';
  editMatrizGravidade: GravidadeCriticidade = 'VERDE';
  editMatrizExigeFoto = false;
  editMatrizPermiteAudio = false;
  savingEditarMatriz = false;
  showDeleteMatrizModal = false;
  matrizToDelete: MatrizCriticidade | null = null;

  override ngOnInit(): void {
    this.loadModelos();
    this.loadSintomasForFilter();
    super.ngOnInit();
  }

  private loadSintomasForFilter(): void {
    this.sintomaService.getAll(true).subscribe({
      next: (list) => (this.sintomas = list),
      error: () => (this.sintomas = []),
    });
  }

  protected override loadItems(): void {
    this.loading = true;
    this.error = '';
    const ativoParsed = this.parseAtivoFromFilter();
    this.areaService.getAll(undefined, ativoParsed).subscribe({
      next: (items) => {
        this.allItems = items;
        this.items = this.applyFilters(items);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar áreas vistoriadas';
        this.loading = false;
      },
    });
  }

  private parseAtivoFromFilter(): boolean | undefined {
    if (!this.filterAtivoSelected?.length) return undefined;
    const hasAtivo = this.filterAtivoSelected.includes('Ativo');
    const hasInativo = this.filterAtivoSelected.includes('Inativo');
    if (hasAtivo && hasInativo) return undefined;
    if (hasAtivo) return true;
    if (hasInativo) return false;
    return undefined;
  }

  protected override deleteItem(id: string) {
    return this.areaService.delete(id);
  }

  protected override getId(item: AreaVistoriada): string {
    return item.id;
  }

  get modeloOptions(): string[] {
    return this.modelos.map((m) => m.nome);
  }

  getStatusLabel(item: AreaVistoriada): string {
    return item.ativo ? 'Ativo' : 'Inativo';
  }

  /** Ordem da área para exibição no card (sempre a partir de 1) */
  getAreaOrdem(area: AreaVistoriada, index: number): number {
    const stored = area.ordemVisual;
    if (stored != null && stored >= 1) return stored;
    return index + 1;
  }

  getModelosLabel(area: AreaVistoriada): string {
    const list = this.getModelosList(area);
    return list.length === 0 ? '—' : list.join(', ');
  }

  /** Lista de nomes dos modelos da área (para exibir em colunas no card) */
  getModelosList(area: AreaVistoriada): string[] {
    if (!area.modelos?.length) return [];
    return area.modelos
      .map((am) => this.modelos.find((m) => m.id === am.idModelo)?.nome ?? am.idModelo)
      .filter((nome): nome is string => !!nome);
  }

  private loadModelos(): void {
    this.modeloService.getAll(true).subscribe({
      next: (items) => {
        this.modelos = items;
      },
    });
  }

  private applyFilters(items: AreaVistoriada[]): AreaVistoriada[] {
    let list = items;
    if (this.filterAreasSelected?.length > 0) {
      const set = new Set(this.filterAreasSelected);
      list = list.filter((item) => set.has(item.nome));
    }
    if (this.filterModelosSelected?.length > 0) {
      const modelSet = new Set(this.filterModelosSelected);
      list = list.filter((item) => {
        const nomes = this.getModelosList(item);
        return nomes.some((n) => modelSet.has(n));
      });
    }
    return list;
  }

  get areaOptions(): string[] {
    return this.allItems.map((a) => a.nome).sort((a, b) => a.localeCompare(b));
  }

  get sintomaOptionsForFilter(): string[] {
    return this.sintomas.map((s) => s.descricao).sort((a, b) => a.localeCompare(b));
  }

  readonly gravidadeOptionsForFilter: string[] = ['VERDE', 'AMARELO', 'VERMELHO'];

  private getModeloIdsFromNames(names: string[]): string[] {
    if (!names.length) return [];
    const mapNomeId = new Map(this.modelos.map((m) => [m.nome, m.id]));
    return names.map((nome) => mapNomeId.get(nome)).filter((id): id is string => !!id);
  }

  openNovaAreaModal(): void {
    this.novoAreaNome = '';
    this.novoAreaAtivo = true;
    this.novoAreaModelosSelecionados = [];
    this.showNovaAreaModal = true;
  }

  closeNovaAreaModal(): void {
    this.showNovaAreaModal = false;
  }

  // ——— Área: adicionar (ordem = posição no final da lista) ———
  async addAreaFromModal(): Promise<void> {
    const nome = this.novoAreaNome?.trim() ?? '';
    if (!nome) {
      this.notificationService.warning('Informe a descrição da área.');
      return;
    }
    if (!this.novoAreaModelosSelecionados?.length) {
      this.notificationService.warning('Selecione pelo menos um modelo.');
      return;
    }
    this.savingArea = true;
    try {
      const dto: CreateAreaVistoriadaDto = {
        nome,
        ordem_visual: this.items.length + 1,
        ativo: this.novoAreaAtivo,
        modelos: this.getModeloIdsFromNames(this.novoAreaModelosSelecionados),
      };
      await firstValueFrom(this.areaService.create(dto));
      this.notificationService.success('Área adicionada.');
      this.novoAreaNome = '';
      this.novoAreaAtivo = true;
      this.novoAreaModelosSelecionados = [];
      this.closeNovaAreaModal();
      this.loadItems();
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao adicionar área');
    } finally {
      this.savingArea = false;
    }
  }

  // ——— Área: editar no modal ———
  openEditarAreaModal(area: AreaVistoriada, event?: Event): void {
    event?.stopPropagation();
    this.editAreaModalId = area.id;
    this.editAreaModalNome = area.nome;
    this.editAreaModalAtivo = area.ativo;
    this.editAreaModalModelosSelecionados =
      area.modelos?.map((am) => this.modelos.find((m) => m.id === am.idModelo)?.nome ?? am.idModelo).filter(Boolean) ?? [];
    this.showEditarAreaModal = true;
  }

  closeEditarAreaModal(): void {
    this.showEditarAreaModal = false;
    this.editAreaModalId = null;
  }

  async saveAreaFromModal(): Promise<void> {
    if (!this.editAreaModalId) return;
    const nome = (this.editAreaModalNome ?? '').trim();
    if (!nome) {
      this.notificationService.warning('Informe a descrição da área.');
      return;
    }
    if (!this.editAreaModalModelosSelecionados?.length) {
      this.notificationService.warning('Selecione pelo menos um modelo.');
      return;
    }
    this.savingEditArea = true;
    try {
      const dto: UpdateAreaVistoriadaDto = {
        nome,
        ativo: this.editAreaModalAtivo,
        modelos: this.getModeloIdsFromNames(this.editAreaModalModelosSelecionados),
      };
      await firstValueFrom(this.areaService.update(this.editAreaModalId, dto));
      this.notificationService.success('Área atualizada.');
      this.closeEditarAreaModal();
      this.loadItems();
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao atualizar área');
    } finally {
      this.savingEditArea = false;
    }
  }

  // ——— Reordenar áreas (drag and drop) ———
  onAreaDrop(event: CdkDragDrop<AreaVistoriada[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    // Nova referência para o Angular detectar a mudança e atualizar os cards
    this.items = [...this.items];
    this.persistAreaOrder();
  }

  private async persistAreaOrder(): Promise<void> {
    this.savingOrder = true;
    try {
      await Promise.all(
        this.items.map((area, index) =>
          firstValueFrom(this.areaService.update(area.id, { ordem_visual: index + 1 })),
        ),
      );
      this.notificationService.success('Ordem das áreas atualizada.');
      // Atualizar ordemVisual nos itens exibidos e em allItems para filtros/exportação
      this.items.forEach((area, index) => {
        area.ordemVisual = index + 1;
      });
      this.allItems.forEach((a) => {
        const inItems = this.items.find((i) => i.id === a.id);
        if (inItems) a.ordemVisual = inItems.ordemVisual;
      });
      this.allItems.sort((a, b) => (a.ordemVisual ?? 0) - (b.ordemVisual ?? 0));
      this.items = [...this.items];
      this.allItems = [...this.allItems];
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao salvar ordem');
      this.loadItems();
    } finally {
      this.savingOrder = false;
    }
  }

  onDelete(item: AreaVistoriada): void {
    this.confirmDelete(item, `Excluir a área "${item.nome}"?`);
  }

  // ——— Expandir: componentes da área ———
  toggleComponentes(area: AreaVistoriada): void {
    if (this.expandedAreaId === area.id) {
      this.expandedAreaId = null;
      this.expandedComponenteId = null;
      this.componenteParaMatriz = null;
      this.matrizList = [];
      return;
    }
    this.expandedAreaId = area.id;
    this.expandedAreaNome = area.nome;
    this.expandedComponenteId = null;
    this.componenteParaMatriz = null;
    this.loadComponentesForArea(area.id);
  }

  isExpanded(area: AreaVistoriada): boolean {
    return this.expandedAreaId === area.id;
  }

  isComponenteExpanded(comp: Componente): boolean {
    return this.expandedComponenteId === comp.id;
  }

  async toggleComponente(comp: Componente): Promise<void> {
    if (this.expandedComponenteId === comp.id) {
      this.expandedComponenteId = null;
      this.componenteParaMatriz = null;
      this.matrizList = [];
      this.closeNovoMatrizForm();
      return;
    }
    this.expandedComponenteId = comp.id;
    this.componenteParaMatriz = comp;
    this.showNovoMatrizForm = false;
    await this.loadSintomas();
    await this.loadMatrizForComponente();
  }

  private async loadComponentesForArea(areaId: string): Promise<void> {
    this.loadingComponentes = true;
    this.componentesSelecionados.clear();
    this.areaComponenteMatrizCount.clear();
    this.componentMatrizSintomaIds.clear();
    this.componentMatrizGravidades.clear();
    try {
      const [compList, areaComp] = await Promise.all([
        firstValueFrom(this.componenteService.getAll()),
        firstValueFrom(this.areaService.listComponentes(areaId)),
      ]);
      this.componentes = compList;
      areaComp.forEach((item) => {
        this.componentesSelecionados.set(item.idComponente, { ordem: Math.max(1, item.ordemVisual ?? 0) });
      });
      if (areaComp.length > 0) {
        const matrizArrays = await firstValueFrom(
          forkJoin(areaComp.map((ac) => this.matrizService.getAll(ac.idComponente))),
        );
        areaComp.forEach((ac, i) => {
          const list = matrizArrays[i] ?? [];
          this.areaComponenteMatrizCount.set(ac.idComponente, list.length);
          this.componentMatrizSintomaIds.set(ac.idComponente, new Set(list.map((m) => m.idSintoma)));
          this.componentMatrizGravidades.set(ac.idComponente, new Set(list.map((m) => m.gravidade)));
        });
      }
    } finally {
      this.loadingComponentes = false;
    }
  }

  /** Componentes vinculados à área, ordenados por ordem visual; respeita filtros matriz, sintomas e gravidade */
  get componentesDaAreaOrdenados(): Componente[] {
    let list = this.componentes
      .filter((c) => this.componentesSelecionados.has(c.id))
      .sort(
        (a, b) =>
          (this.componentesSelecionados.get(a.id)?.ordem ?? 0) -
          (this.componentesSelecionados.get(b.id)?.ordem ?? 0),
      );
    if (this.filterComponentesMatriz === 'com_matriz') {
      list = list.filter((c) => (this.areaComponenteMatrizCount.get(c.id) ?? 0) > 0);
    } else if (this.filterComponentesMatriz === 'sem_matriz') {
      list = list.filter((c) => (this.areaComponenteMatrizCount.get(c.id) ?? 0) === 0);
    }
    if (this.filterSintomasSelected?.length > 0) {
      const ids = new Set(
        this.sintomas.filter((s) => this.filterSintomasSelected.includes(s.descricao)).map((s) => s.id),
      );
      if (ids.size > 0) {
        list = list.filter((c) => {
          const compSintomas = this.componentMatrizSintomaIds.get(c.id);
          return compSintomas && [...compSintomas].some((id) => ids.has(id));
        });
      }
    }
    if (this.filterGravidadesSelected?.length > 0) {
      const gravSet = new Set(this.filterGravidadesSelected);
      list = list.filter((c) => {
        const compGrav = this.componentMatrizGravidades.get(c.id);
        return compGrav && [...compGrav].some((g) => gravSet.has(g));
      });
    }
    return list;
  }

  /** Ordem do componente na área (1, 2, 3...) para exibir na grid e no relatório; valor do banco. */
  getOrdemComponente(comp: Componente): number {
    return this.componentesSelecionados.get(comp.id)?.ordem ?? 1;
  }

  isComponenteSelected(componenteId: string): boolean {
    return this.componentesSelecionados.has(componenteId);
  }

  /** Reordenar componentes por drag-drop (mesma lógica das áreas) */
  onComponenteDrop(event: CdkDragDrop<Componente[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const list = [...this.componentesDaAreaOrdenados];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    list.forEach((c, idx) => this.componentesSelecionados.set(c.id, { ordem: idx + 1 }));
    this.saveComponentesArea();
  }

  /** Abre confirmação para remover componente da área (pela lista expandida) */
  openRemoveFromAreaConfirmFromList(comp: Componente, event?: Event): void {
    event?.stopPropagation();
    if (!this.expandedAreaId || !this.expandedAreaNome) return;
    this.componenteToRemoveFromArea = {
      id: comp.id,
      nome: comp.nome,
      ativo: comp.ativo,
      idArea: this.expandedAreaId,
      nomeArea: this.expandedAreaNome,
    };
    this.showRemoveFromAreaConfirm = true;
  }

  /** Remover componente da área (desvincular, não excluir) — chamado após confirmação ou direto se já confirmado */
  removeComponenteDaArea(componenteId: string, event?: Event): void {
    event?.stopPropagation();
    this.componentesSelecionados.delete(componenteId);
    this.saveComponentesArea();
  }

  private getNextOrdemComponente(): number {
    if (this.componentesSelecionados.size === 0) return 1;
    const max = Math.max(...Array.from(this.componentesSelecionados.values()).map((item) => item.ordem));
    return max + 1;
  }

  private buildComponentesPayload(): SetAreaComponentesDto {
    const ordenados = Array.from(this.componentesSelecionados.entries())
      .map(([idcomponente, data]) => ({ idcomponente, ordem: data.ordem }))
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
    return {
      componentes: ordenados.map((item, idx) => ({ idcomponente: item.idcomponente, ordem_visual: idx + 1 })),
    };
  }

  async saveComponentesArea(): Promise<void> {
    if (!this.expandedAreaId) return;
    this.savingComponentesArea = true;
    try {
      await firstValueFrom(this.areaService.setComponentes(this.expandedAreaId, this.buildComponentesPayload()));
      this.notificationService.success('Componentes da área salvos.');
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao salvar componentes');
    } finally {
      this.savingComponentesArea = false;
    }
  }

  // ——— Modal Vincular Componente ———
  async openVincularModal(area: AreaVistoriada, event?: Event): Promise<void> {
    event?.stopPropagation();
    if (!this.canVincularComponente) return;
    this.areaParaVincular = area;
    this.filterVincularNome = '';
    this.onlySemArea = false;
    if (this.expandedAreaId !== area.id) {
      this.expandedAreaId = area.id;
      this.expandedAreaNome = area.nome;
      await this.loadComponentesForArea(area.id);
    }
    this.showVincularModal = true;
    this.loadComponentesComArea();
  }

  closeVincularModal(): void {
    this.showVincularModal = false;
    this.areaParaVincular = null;
    this.componentesComAreaList = [];
  }

  async loadComponentesComArea(): Promise<void> {
    this.loadingVincular = true;
    try {
      this.componentesComAreaList = await firstValueFrom(this.areaService.getComponentesWithArea());
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao carregar componentes');
    } finally {
      this.loadingVincular = false;
    }
  }

  get componentesComAreaFiltrados(): ComponenteComArea[] {
    let list = this.componentesComAreaList;
    const nome = (this.filterVincularNome ?? '').trim().toLowerCase();
    if (nome) {
      list = list.filter((c) => c.nome.toLowerCase().includes(nome));
    }
    if (this.onlySemArea) {
      list = list.filter((c) => !c.idArea);
    }
    return list;
  }

  /** Verifica se o componente já está vinculado à área atual */
  isComponenteJaVinculado(comp: ComponenteComArea): boolean {
    if (!this.areaParaVincular) return false;
    return this.componentesSelecionados.has(comp.id);
  }

  async vincularComponente(comp: ComponenteComArea, event?: Event): Promise<void> {
    event?.stopPropagation();
    if (!this.areaParaVincular) return;
    if (comp.idArea) return;
    if (this.componentesSelecionados.has(comp.id)) {
      this.notificationService.warning('Componente já está vinculado a esta área.');
      return;
    }
    const areaId = this.areaParaVincular.id;
    this.savingVincular = true;
    try {
      this.componentesSelecionados.set(comp.id, { ordem: this.getNextOrdemComponente() });
      await firstValueFrom(
        this.areaService.setComponentes(areaId, this.buildComponentesPayload()),
      );
      this.closeVincularModal();
      if (this.expandedAreaId === areaId) {
        try {
          await this.loadComponentesForArea(areaId);
        } catch {
          // Falha só ao atualizar a lista; o vínculo já foi feito
        }
      }
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao vincular componente');
    } finally {
      this.savingVincular = false;
    }
  }

  openRemoveFromAreaConfirm(comp: ComponenteComArea, event?: Event): void {
    event?.stopPropagation();
    this.componenteToRemoveFromArea = comp;
    this.showRemoveFromAreaConfirm = true;
  }

  closeRemoveFromAreaConfirm(): void {
    this.showRemoveFromAreaConfirm = false;
    this.componenteToRemoveFromArea = null;
  }

  get removeFromAreaConfirmMessage(): string {
    if (!this.componenteToRemoveFromArea) return '';
    const c = this.componenteToRemoveFromArea;
    return `Remover o componente "${c.nome}" da área "${c.nomeArea ?? ''}"? O componente não é excluído do sistema.`;
  }

  async confirmRemoveFromArea(): Promise<void> {
    const comp = this.componenteToRemoveFromArea;
    const areaId = comp?.idArea ?? null;
    if (!comp || !areaId) return;
    this.savingVincular = true;
    try {
      const areaComp = await firstValueFrom(this.areaService.listComponentes(areaId));
      const novos = areaComp
        .filter((ac) => ac.idComponente !== comp.id)
        .map((ac, idx) => ({ idcomponente: ac.idComponente, ordem_visual: idx + 1 }));
      await firstValueFrom(this.areaService.setComponentes(areaId, { componentes: novos }));
      this.notificationService.success(`Componente removido da área.`);
      this.closeRemoveFromAreaConfirm();
      await this.loadComponentesComArea();
      if (this.expandedAreaId === areaId) {
        await this.loadComponentesForArea(areaId);
      }
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao remover componente da área');
    } finally {
      this.savingVincular = false;
    }
  }

  // ——— Novo Componente (modal, com permissão) ———
  openNovoComponenteModal(area: AreaVistoriada, event?: Event): void {
    event?.stopPropagation();
    if (!this.canCreateComponente) return;
    if (this.expandedAreaId !== area.id) {
      this.expandedAreaId = area.id;
      this.expandedAreaNome = area.nome;
      this.loadComponentesForArea(area.id);
    }
    this.novoComponenteModalNome = '';
    this.novoComponenteModalAtivo = true;
    this.showNovoComponenteModal = true;
  }

  closeNovoComponenteModal(): void {
    this.showNovoComponenteModal = false;
    this.novoComponenteModalNome = '';
    this.novoComponenteModalAtivo = true;
  }

  async addComponenteFromModal(): Promise<void> {
    const nome = this.novoComponenteModalNome?.trim() ?? '';
    if (!nome) {
      this.notificationService.warning('Informe o nome do componente.');
      return;
    }
    if (!this.expandedAreaId) return;
    this.savingNovoComponente = true;
    try {
      const created = await firstValueFrom(
        this.componenteService.create({ nome, ativo: this.novoComponenteModalAtivo }),
      );
      this.componentesSelecionados.set(created.id, { ordem: this.getNextOrdemComponente() });
      await firstValueFrom(
        this.areaService.setComponentes(this.expandedAreaId, this.buildComponentesPayload()),
      );
      this.notificationService.success('Componente criado e vinculado à área.');
      this.closeNovoComponenteModal();
      await this.loadComponentesForArea(this.expandedAreaId);
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao criar componente');
    } finally {
      this.savingNovoComponente = false;
    }
  }

  openEditarComponenteModal(componente: Componente, event?: Event): void {
    event?.stopPropagation();
    this.componenteToEdit = componente;
    this.editComponenteModalNome = componente.nome;
    this.editComponenteModalAtivo = componente.ativo;
    this.showEditarComponenteModal = true;
  }

  closeEditarComponenteModal(): void {
    this.showEditarComponenteModal = false;
    this.componenteToEdit = null;
  }

  async saveComponenteFromModal(): Promise<void> {
    if (!this.componenteToEdit) return;
    const nome = (this.editComponenteModalNome ?? '').trim();
    if (!nome) {
      this.notificationService.warning('Informe o nome do componente.');
      return;
    }
    this.savingEditComponente = true;
    try {
      await firstValueFrom(
        this.componenteService.update(this.componenteToEdit.id, {
          nome,
          ativo: this.editComponenteModalAtivo,
        }),
      );
      this.notificationService.success('Componente atualizado.');
      this.closeEditarComponenteModal();
      if (this.expandedAreaId) await this.loadComponentesForArea(this.expandedAreaId);
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao atualizar componente');
    } finally {
      this.savingEditComponente = false;
    }
  }

  openDeleteComponente(componente: Componente): void {
    this.componenteToDelete = componente;
    this.showDeleteComponenteModal = true;
  }

  closeDeleteComponenteModal(): void {
    this.showDeleteComponenteModal = false;
    this.componenteToDelete = null;
  }

  async confirmDeleteComponente(): Promise<void> {
    if (!this.componenteToDelete) return;
    const id = this.componenteToDelete.id;
    try {
      await firstValueFrom(this.componenteService.delete(id));
      this.componentesSelecionados.delete(id);
      this.notificationService.success('Componente excluído.');
      if (this.expandedAreaId) this.loadComponentesForArea(this.expandedAreaId);
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao excluir componente');
    } finally {
      this.closeDeleteComponenteModal();
    }
  }

  get deleteComponenteModalMessage(): string {
    if (!this.componenteToDelete) return '';
    return `Excluir o componente "${this.componenteToDelete.nome}"?`;
  }

  // ——— Modal Matriz de Criticidade (por componente) ———
  async openMatrizModal(comp: Componente, event?: Event): Promise<void> {
    event?.stopPropagation();
    if (!this.canReadMatriz && !this.canCreateMatriz && !this.canEditMatriz) return;
    this.componenteParaMatriz = comp;
    this.showNovoMatrizForm = false;
    this.showMatrizModal = true;
    await this.loadSintomas();
    await this.loadMatrizForComponente();
  }

  closeMatrizModal(): void {
    this.showMatrizModal = false;
    this.componenteParaMatriz = null;
    this.matrizList = [];
    this.closeNovoMatrizForm();
    this.closeEditarMatrizModal();
    this.closeDeleteMatrizModal();
  }

  private async loadSintomas(): Promise<void> {
    try {
      this.sintomas = await firstValueFrom(this.sintomaService.getAll(true));
    } catch {
      this.sintomas = [];
    }
  }

  private async loadMatrizForComponente(): Promise<void> {
    if (!this.componenteParaMatriz) return;
    this.loadingMatriz = true;
    try {
      this.matrizList = await firstValueFrom(
        this.matrizService.getAll(this.componenteParaMatriz.id),
      );
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao carregar matriz');
      this.matrizList = [];
    } finally {
      this.loadingMatriz = false;
    }
  }

  getSintomaDescricao(id: string): string {
    return this.sintomas.find((s) => s.id === id)?.descricao ?? id;
  }

  /** Sintomas ainda não usados na matriz do componente (para Nova matriz) */
  get sintomasDisponiveisNovaMatriz(): Sintoma[] {
    const idsUsados = new Set(this.matrizList.map((m) => m.idSintoma));
    return this.sintomas.filter((s) => !idsUsados.has(s.id));
  }

  /** Sintomas disponíveis ao editar matriz (inclui o atual; exclui os já usados em outras linhas) */
  get sintomasDisponiveisEditarMatriz(): Sintoma[] {
    if (!this.matrizToEdit) return this.sintomas;
    const idsUsadosEmOutras = new Set(
      this.matrizList.filter((m) => m.id !== this.matrizToEdit!.id).map((m) => m.idSintoma),
    );
    return this.sintomas.filter(
      (s) => s.id === this.matrizToEdit!.idSintoma || !idsUsadosEmOutras.has(s.id),
    );
  }

  openNovoMatrizForm(): void {
    this.novoMatrizIdsintoma = '';
    this.novoMatrizGravidade = 'VERDE';
    this.novoMatrizExigeFoto = true;
    this.novoMatrizPermiteAudio = true;
    this.showNovoMatrizForm = true;
  }

  closeNovoMatrizForm(): void {
    this.showNovoMatrizForm = false;
  }

  async addMatriz(): Promise<void> {
    if (!this.componenteParaMatriz || !this.novoMatrizIdsintoma?.trim()) {
      this.notificationService.warning('Selecione o sintoma.');
      return;
    }
    this.savingNovoMatriz = true;
    try {
      const dto: CreateMatrizCriticidadeDto = {
        idcomponente: this.componenteParaMatriz.id,
        idsintoma: this.novoMatrizIdsintoma,
        gravidade: this.novoMatrizGravidade,
        exige_foto: !!this.novoMatrizExigeFoto,
        permite_audio: !!this.novoMatrizPermiteAudio,
      };
      await firstValueFrom(this.matrizService.create(dto));
      this.notificationService.success('Matriz adicionada.');
      this.closeNovoMatrizForm();
      await this.loadMatrizForComponente();
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao adicionar matriz');
    } finally {
      this.savingNovoMatriz = false;
    }
  }

  openEditarMatrizModal(matriz: MatrizCriticidade, event?: Event): void {
    event?.stopPropagation();
    this.matrizToEdit = matriz;
    this.editMatrizIdsintoma = matriz.idSintoma;
    this.editMatrizGravidade = matriz.gravidade;
    this.editMatrizExigeFoto = matriz.exigeFoto;
    this.editMatrizPermiteAudio = matriz.permiteAudio;
    this.showEditarMatrizModal = true;
  }

  closeEditarMatrizModal(): void {
    this.showEditarMatrizModal = false;
    this.matrizToEdit = null;
  }

  async saveEditarMatriz(): Promise<void> {
    if (!this.matrizToEdit || !this.editMatrizIdsintoma?.trim()) {
      this.notificationService.warning('Selecione o sintoma.');
      return;
    }
    this.savingEditarMatriz = true;
    try {
      const dto: UpdateMatrizCriticidadeDto = {
        idsintoma: this.editMatrizIdsintoma,
        gravidade: this.editMatrizGravidade,
        exige_foto: !!this.editMatrizExigeFoto,
        permite_audio: !!this.editMatrizPermiteAudio,
      };
      await firstValueFrom(this.matrizService.update(this.matrizToEdit.id, dto));
      this.notificationService.success('Matriz atualizada.');
      this.closeEditarMatrizModal();
      await this.loadMatrizForComponente();
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao atualizar matriz');
    } finally {
      this.savingEditarMatriz = false;
    }
  }

  openDeleteMatrizModal(matriz: MatrizCriticidade, event?: Event): void {
    event?.stopPropagation();
    this.matrizToDelete = matriz;
    this.showDeleteMatrizModal = true;
  }

  closeDeleteMatrizModal(): void {
    this.showDeleteMatrizModal = false;
    this.matrizToDelete = null;
  }

  get deleteMatrizModalMessage(): string {
    if (!this.matrizToDelete) return '';
    const s = this.getSintomaDescricao(this.matrizToDelete.idSintoma);
    return `Excluir a matriz (Sintoma: ${s}, Gravidade: ${this.matrizToDelete.gravidade})?`;
  }

  async confirmDeleteMatriz(): Promise<void> {
    if (!this.matrizToDelete) return;
    try {
      await firstValueFrom(this.matrizService.delete(this.matrizToDelete.id));
      this.notificationService.success('Matriz excluída.');
      this.closeDeleteMatrizModal();
      await this.loadMatrizForComponente();
    } catch (err: any) {
      this.notificationService.error(err?.error?.message ?? 'Erro ao excluir matriz');
    }
  }

  onFilterChange(): void {
    this.loadItems();
  }

  clearFilters(): void {
    this.filterAreasSelected = [];
    this.filterModelosSelected = [];
    this.filterAtivoSelected = [];
    this.filterSintomasSelected = [];
    this.filterGravidadesSelected = [];
    this.filterComponentesMatriz = 'todos';
    this.loadItems();
  }

  openAuditModal(item: AreaVistoriada): void {
    this.selectedItemForAudit = item;
    this.showAuditModal = true;
  }

  closeAuditModal(): void {
    this.showAuditModal = false;
    this.selectedItemForAudit = null;
  }

  openComponenteAuditModal(comp: Componente, event?: Event): void {
    event?.stopPropagation();
    this.selectedComponenteForAudit = comp;
    this.showComponenteAuditModal = true;
  }

  closeComponenteAuditModal(): void {
    this.showComponenteAuditModal = false;
    this.selectedComponenteForAudit = null;
  }

  openMatrizAuditModal(matriz: MatrizCriticidade, event?: Event): void {
    event?.stopPropagation();
    this.selectedMatrizForAudit = matriz;
    this.showMatrizAuditModal = true;
  }

  closeMatrizAuditModal(): void {
    this.showMatrizAuditModal = false;
    this.selectedMatrizForAudit = null;
  }

  /** Monta o texto do mapa da área para o PDF. Primeira linha: Área e Status; segunda linha: Modelos. Sem separador |. */
  private buildMapContent(
    areas: AreaVistoriada[],
    compsAndMatrizPerArea: Array<{ comps: AreaComponente[]; matrizArrays: MatrizCriticidade[][] }>
  ): string {
    const lines: string[] = [];

    // Resumo dos filtros aplicados (2 linhas em linha)
    const areasLabel =
      this.filterAreasSelected && this.filterAreasSelected.length > 0
        ? this.filterAreasSelected.join(', ')
        : 'Todas';
    const modelosLabel =
      this.filterModelosSelected && this.filterModelosSelected.length > 0
        ? this.filterModelosSelected.join(', ')
        : 'Todos';
    let statusLabel = 'Todos';
    if (this.filterAtivoSelected && this.filterAtivoSelected.length === 1) {
      statusLabel = this.filterAtivoSelected[0];
    } else if (this.filterAtivoSelected && this.filterAtivoSelected.length === 2) {
      statusLabel = 'Todos';
    }
    const sintomasLabel =
      this.filterSintomasSelected && this.filterSintomasSelected.length > 0
        ? this.filterSintomasSelected.join(', ')
        : 'Todos Sintomas';
    const gravidadesLabel =
      this.filterGravidadesSelected && this.filterGravidadesSelected.length > 0
        ? this.filterGravidadesSelected.join(', ')
        : 'Todas Gravidades';
    let componentesLabel = 'Todos componentes';
    if (this.filterComponentesMatriz === 'com_matriz') {
      componentesLabel = 'Somente com configuração de matriz';
    } else if (this.filterComponentesMatriz === 'sem_matriz') {
      componentesLabel = 'Somente sem configuração de matriz';
    }

    const filtrosLinha = `Filtros aplicados: Áreas: ${areasLabel}, Modelos: ${modelosLabel}, Status: ${statusLabel}, Sintomas: ${sintomasLabel}, Gravidade: ${gravidadesLabel}, Componentes: ${componentesLabel}`;
    lines.push(filtrosLinha);
    lines.push('');

    areas.forEach((area, idx) => {
      const modelosLabel = this.getModelosLabel(area);
      const statusArea = this.getStatusLabel(area);
      lines.push(`${idx + 1}. ${area.nome}  Status: ${statusArea}`);
      lines.push(`Modelos: ${modelosLabel}`);
      const { comps, matrizArrays } = compsAndMatrizPerArea[idx] ?? { comps: [], matrizArrays: [] };
      comps.forEach((ac, j) => {
        const matrizList = matrizArrays[j] ?? [];
        if (this.filterComponentesMatriz === 'com_matriz' && matrizList.length === 0) return;
        if (this.filterComponentesMatriz === 'sem_matriz' && matrizList.length > 0) return;
        const ordem = ac.ordemVisual != null ? Math.max(1, ac.ordemVisual) : j + 1;
        const nomeComp = ac.componente?.nome ?? 'Componente';
        const statusComp = ac.componente?.ativo ? 'Ativo' : 'Inativo';
        const semMatriz = matrizList.length === 0;
        const compLine = `    ${ordem}. ${nomeComp}  Status: ${statusComp}${semMatriz ? '  (sem matriz configurada)' : ''}`;
        lines.push(compLine);
        matrizList.forEach((m) => {
          const sintoma = m.sintoma?.descricao ?? '—';
          const exigeFoto = m.exigeFoto ? 'Sim' : 'Não';
          const permiteAudio = m.permiteAudio ? 'Sim' : 'Não';
          lines.push(`        ${sintoma}  Gravidade: ${m.gravidade}  Exige foto: ${exigeFoto}  Permite áudio: ${permiteAudio}`);
        });
      });
      lines.push('');
    });
    return lines.join('\n');
  }

  override exportToPDF(): void {
    this.loading = true;
    this.loadAllItemsForExport()
      .pipe(
        switchMap((areas) => {
          if (areas.length === 0) {
            const exportData = { headers: [] as string[], data: [] as any[][], headerContent: '' };
            return of({ exportData });
          }
          return forkJoin(
            areas.map((area) =>
              this.areaService.listComponentes(area.id).pipe(
                switchMap((comps) => {
                  if (comps.length === 0) {
                    return of({ comps, matrizArrays: [] as MatrizCriticidade[][] });
                  }
                  return forkJoin(comps.map((c) => this.matrizService.getAll(c.idComponente))).pipe(
                    map((matrizArrays) => ({ comps, matrizArrays }))
                  );
                })
              )
            )
          ).pipe(
            map((compsAndMatrizPerArea) => {
              const exportData = {
                headers: [],
                data: [],
                headerContent: this.buildMapContent(areas, compsAndMatrizPerArea),
              };
              return { exportData };
            })
          );
        })
      )
      .subscribe({
        next: ({ exportData }) => {
          const fileName = this.getExportFileName();
          const backendBase = environment.apiUrl.replace(/\/api\/?$/, '') || '';
          const baseUrl = backendBase || (typeof window !== 'undefined' ? window.location.origin : '');
          this.configuracaoService.getConfiguracao().subscribe({
            next: (config) => {
              const logoPath = config?.logoRelatorio;
              const logoUrl = logoPath
                ? (logoPath.startsWith('http') ? logoPath : baseUrl + (logoPath.startsWith('/') ? logoPath : '/' + logoPath))
                : undefined;
              this.exportService.exportToPDF({ ...exportData, logoUrl }, fileName, 'Mapa das Áreas').subscribe({
                next: () => (this.loading = false),
                error: (err) => {
                  console.error('Erro ao exportar para PDF:', err);
                  this.errorModalService.show('Erro ao exportar para PDF');
                  this.loading = false;
                },
              });
            },
            error: () => {
              this.exportService.exportToPDF(exportData, fileName, 'Mapa das Áreas').subscribe({
                next: () => (this.loading = false),
                error: (err) => {
                  console.error('Erro ao exportar para PDF:', err);
                  this.errorModalService.show('Erro ao exportar para PDF');
                  this.loading = false;
                },
              });
            },
          });
        },
        error: (err) => {
          console.error('Erro ao carregar dados para exportação:', err);
          this.errorModalService.show('Erro ao carregar dados para exportação');
          this.loading = false;
        },
      });
  }

  protected loadAllItemsForExport(): import('rxjs').Observable<AreaVistoriada[]> {
    return of(this.applyFilters(this.allItems));
  }

  protected getExportDataExcel(items: AreaVistoriada[]): { headers: string[]; data: any[][] } {
    return {
      headers: ['Descrição', 'Ordem', 'Status'],
      data: items.map((item) => [item.nome, item.ordemVisual, this.getStatusLabel(item)]),
    };
  }

  protected getExportDataPDF(items: AreaVistoriada[]): { headers: string[]; data: any[][] } {
    return this.getExportDataExcel(items);
  }

  protected getExportFileName(): string {
    return 'areas-vistoriadas';
  }

  protected getTableDisplayName(): string {
    return 'Áreas Vistoriadas';
  }
}
