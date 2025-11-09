import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseFormComponent } from '../base/base-form.component';
import { TrechoService } from '../../services/trecho.service';
import { CreateTrechoDto, UpdateTrechoDto, GeoJSONPolygon, Trecho } from '../../models/trecho.model';
import { MapaPoligonoComponent } from '../shared/mapa-poligono/mapa-poligono.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal';
import { firstValueFrom, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-trecho-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MapaPoligonoComponent, ConfirmationModalComponent],
  templateUrl: './trecho-form.html',
  styleUrls: ['./trecho-form.css']
})
export class TrechoFormComponent extends BaseFormComponent<CreateTrechoDto | UpdateTrechoDto> implements OnInit, OnDestroy {
  @ViewChild(MapaPoligonoComponent) mapaPoligonoComponent?: MapaPoligonoComponent;
  @ViewChild('mapaPoligonoRef') mapaPoligonoRef?: MapaPoligonoComponent;
  
  // Estados de modo
  modo: 'visualizacao' | 'edicao' | 'novo' = 'visualizacao'; // visualizacao | edicao | novo
  editingAreaPoligono: GeoJSONPolygon | null = null; // Polygon em edição/novo
  
  // Visualização: múltiplas áreas
  selectedAreas: Map<string, GeoJSONPolygon> = new Map(); // ID -> GeoJSON de áreas em visualização
  checkedTrechos: Set<string> = new Set(); // IDs dos trechos selecionados (checkbox)
  
  // Cache para evitar loop infinito no template
  poligonosExtrasCache: GeoJSONPolygon[] = [];
  nomesPoligonosCache: string[] = [];
  
  // Edição: um trecho
  editingTrechoId: string | null = null; // ID do trecho em edição
  editingDescricao: string = ''; // Descrição em edição inline
  
  // Novo: adicionando novo
  newTrechoDescricao: string = ''; // Descrição do novo trecho

  // Propriedades da lista
  items: Trecho[] = [];
  loadingList: boolean = false;
  errorList: string = '';
  filterDescricao: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalItems: number = 0;
  
  // Para delete
  showDeleteModal: boolean = false;
  deleteModalMessage: string = '';
  itemToDelete: Trecho | null = null;

  // Permissions
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  protected filterSubject = new Subject<string>();
  protected override destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private trechoService: TrechoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    router: Router
  ) {
    super(router);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    
    // Carregar lista de trechos
    this.loadTrechos();
    
    // Setup filtro com debounce
    this.filterSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadTrechos();
    });
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    super.ngOnDestroy?.();
  }

  protected initializeForm(): void {
    // Não vamos usar formulário reactivo nessa versão
    // A edição será inline na grid
  }

  protected buildFormData(): CreateTrechoDto | UpdateTrechoDto {
    // Não usado
    return {} as CreateTrechoDto;
  }

  protected async saveEntity(data: CreateTrechoDto | UpdateTrechoDto): Promise<void> {
    // Não usado
  }

  protected async updateEntity(id: string, data: CreateTrechoDto | UpdateTrechoDto): Promise<void> {
    // Não usado
  }

  protected async loadEntityById(id: string): Promise<void> {
    // Não usado
  }

  // ===== MÉTODOS DA LISTA =====
  async loadTrechos(): Promise<void> {
    try {
      this.loadingList = true;
      this.errorList = '';
      
      const response = await firstValueFrom(
        this.trechoService.getAll(
          this.currentPage,
          this.pageSize,
          this.filterDescricao || undefined
        )
      );

      this.items = response.data || [];
      this.totalItems = response.total || 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    } catch (error: any) {
      this.errorList = error?.message || 'Erro ao carregar trechos';
      console.error('Erro ao carregar trechos:', error);
    } finally {
      this.loadingList = false;
    }
  }

  onFilterChange(): void {
    this.filterSubject.next(this.filterDescricao);
  }

  clearFilters(): void {
    this.filterDescricao = '';
    this.currentPage = 1;
    this.loadTrechos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTrechos();
  }

  // ===== CHECKBOX PARA VISUALIZAR MÚLTIPLAS ÁREAS =====
  toggleTrechoVisualizacao(trecho: Trecho): void {
    if (this.checkedTrechos.has(trecho.id)) {
      this.checkedTrechos.delete(trecho.id);
      this.selectedAreas.delete(trecho.id);
    } else {
      this.checkedTrechos.add(trecho.id);
      if (trecho.area) {
        this.selectedAreas.set(trecho.id, trecho.area);
        // Fazer zoom no polígono recém-adicionado
        if (this.mapaPoligonoRef && trecho.area) {
          setTimeout(() => {
            this.mapaPoligonoRef?.zoomEmPoligono(trecho.area as GeoJSONPolygon);
          }, 100);
        }
      }
    }
    
    // Forçar atualização manual dos polígonos extras com nomes
    const extrasArray = Array.from(this.selectedAreas.values());
    const nomesArray = Array.from(this.selectedAreas.keys()).map(id => {
      const trecho = this.items.find(t => t.id === id);
      return trecho?.descricao || 'Trecho sem nome';
    });
    
    if (this.mapaPoligonoRef) {
      this.mapaPoligonoRef.atualizarPoligonosExtrasManual(extrasArray, nomesArray);
    }
  }

  isTrechoChecked(trechoId: string): boolean {
    return this.checkedTrechos.has(trechoId);
  }

  get poligonosExtrasArray(): GeoJSONPolygon[] {
    return Array.from(this.selectedAreas.values());
  }

  // Getter para controlar se precisa atualizar extras - evita loop infinito
  get shouldUpdateExtras(): boolean {
    return this.checkedTrechos.size > 0;
  }

  // ===== MODO EDIÇÃO =====
  iniciarEdicao(trecho: Trecho): void {
    // Modo edição
    this.modo = 'edicao';
    this.editingTrechoId = trecho.id;
    this.editingDescricao = trecho.descricao;
    this.editingAreaPoligono = trecho.area ? JSON.parse(JSON.stringify(trecho.area)) : null;
    this.cdr.detectChanges();
  }

  // ===== MODO NOVO =====
  iniciarNovo(): void {
    
    // Modo novo
    this.modo = 'novo';
    this.editingTrechoId = null;
    this.newTrechoDescricao = '';
    this.editingAreaPoligono = null;
    this.cdr.detectChanges();
  }

  // Quando o mapa emite o polígono em edição/novo
  onAreaSelected(area: GeoJSONPolygon | null): void {
    if (this.modo === 'edicao' || this.modo === 'novo') {
      this.editingAreaPoligono = area;
    }
  }

  // ===== SALVAR EM EDIÇÃO OU NOVO =====
  async salvarTrecho(): Promise<void> {
    if (this.modo === 'edicao' && this.editingTrechoId) {
      // Validar
      if (!this.editingDescricao || !this.editingAreaPoligono) {
        alert('Preencha a descrição e desenhe a área no mapa');
        return;
      }

      try {
        this.loading = true;
        const data: UpdateTrechoDto = {
          descricao: this.editingDescricao,
          area: this.editingAreaPoligono
        };
        await firstValueFrom(this.trechoService.update(this.editingTrechoId, data));
        this.showSuccess('Trecho atualizado com sucesso');
        this.modo = 'visualizacao';
        
        // Manter o trecho editado marcado na visualização
        this.checkedTrechos.add(this.editingTrechoId);
        this.selectedAreas.set(this.editingTrechoId, this.editingAreaPoligono);
        
        this.editingTrechoId = null;
        this.editingAreaPoligono = null;
        
        // Atualizar mapa com polígonos mantidos + editado
        await this.loadTrechos();
        this.atualizarVisualizacaoMapa();
      } catch (error: any) {
        this.handleError(error, 'Erro ao atualizar trecho');
      } finally {
        this.loading = false;
      }
    } else if (this.modo === 'novo') {
      // Validar
      if (!this.newTrechoDescricao || !this.editingAreaPoligono) {
        alert('Preencha a descrição e desenhe a área no mapa');
        return;
      }

      try {
        this.loading = true;
        const data: CreateTrechoDto = {
          descricao: this.newTrechoDescricao,
          area: this.editingAreaPoligono
        };
        const trechoNovo = await firstValueFrom(this.trechoService.create(data));
        this.showSuccess('Trecho criado com sucesso');
        this.modo = 'visualizacao';
        
        // Manter o novo trecho marcado na visualização
        this.checkedTrechos.add(trechoNovo.id);
        if (trechoNovo.area) {
          this.selectedAreas.set(trechoNovo.id, trechoNovo.area);
        }
        
        this.newTrechoDescricao = '';
        this.editingAreaPoligono = null;
        
        // Atualizar mapa com polígonos mantidos + novo
        await this.loadTrechos();
        this.atualizarVisualizacaoMapa();
      } catch (error: any) {
        this.handleError(error, 'Erro ao criar trecho');
      } finally {
        this.loading = false;
      }
    }
  }

  // Atualiza a visualização no mapa com todos os polígonos selecionados
  private atualizarVisualizacaoMapa(): void {
    const extrasArray = Array.from(this.selectedAreas.values());
    const nomesArray = Array.from(this.selectedAreas.keys()).map(id => {
      const trecho = this.items.find(t => t.id === id);
      return trecho?.descricao || 'Trecho sem nome';
    });
    
    if (this.mapaPoligonoRef) {
      this.mapaPoligonoRef.atualizarPoligonosExtrasManual(extrasArray, nomesArray);
    }
  }

  // ===== CANCELAR EDIÇÃO OU NOVO =====
  cancelarEdicao(): void {
    this.modo = 'visualizacao';
    this.editingTrechoId = null;
    this.editingDescricao = '';
    this.newTrechoDescricao = '';
    this.editingAreaPoligono = null;
    
    // Restaurar visualização dos trechos selecionados
    this.atualizarVisualizacaoMapa();
    this.cdr.detectChanges();
  }

  // ===== DELETE =====
  onDelete(trecho: Trecho): void {
    this.itemToDelete = trecho;
    this.deleteModalMessage = `Deseja excluir o trecho "${trecho.descricao}"?`;
    this.showDeleteModal = true;
  }

  async onDeleteConfirmed(): Promise<void> {
    if (!this.itemToDelete) return;

    try {
      this.loading = true;
      await firstValueFrom(this.trechoService.delete(this.itemToDelete.id));
      this.showDeleteModal = false;
      this.itemToDelete = null;
      
      // Limpar área e polígonos do mapa após deletar
      this.checkedTrechos.clear();
      this.selectedAreas.clear();
      if (this.mapaPoligonoRef) {
        this.mapaPoligonoRef.atualizarPoligonosExtrasManual([], []);
      }
      
      this.loadTrechos();
    } catch (error: any) {
      console.error('Erro ao excluir trecho:', error);
      this.handleError(error, 'Erro ao excluir trecho');
    } finally {
      this.loading = false;
    }
  }

  onDeleteCancelled(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  override getListRoute(): string {
    return '/trechos';
  }
}
