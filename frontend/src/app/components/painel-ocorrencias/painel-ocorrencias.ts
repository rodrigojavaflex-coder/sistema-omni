import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OcorrenciaService } from '../../services/ocorrencia.service';
import { OcorrenciaStats } from '../../models/historico-ocorrencia.model';
import { TipoOcorrencia } from '../../models/tipo-ocorrencia.enum';
import { Linha } from '../../models/linha.enum';
import { Arco } from '../../models/arco.enum';
import { SentidoVia } from '../../models/sentido-via.enum';
import { TipoLocal } from '../../models/tipo-local.enum';
import { Culpabilidade } from '../../models/culpabilidade.enum';
import { SimNao } from '../../models/sim-nao.enum';
import { Terceirizado } from '../../models/terceirizado.enum';
import { OrigemOcorrencia } from '../../models/origem-ocorrencia.model';
import { CategoriaOcorrencia } from '../../models/categoria-ocorrencia.model';
import { OrigemOcorrenciaService } from '../../services/origem-ocorrencia.service';
import { CategoriaOcorrenciaService } from '../../services/categoria-ocorrencia.service';
import { MultiSelectComponent } from '../shared/multi-select/multi-select.component';
import { VeiculoAutocompleteComponent } from '../shared/veiculo-autocomplete/veiculo-autocomplete.component';
import { MotoristaAutocompleteComponent } from '../shared/motorista-autocomplete/motorista-autocomplete.component';
import { Veiculo, Motorista } from '../../models';

@Component({
  selector: 'app-painel-ocorrencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectComponent,
    VeiculoAutocompleteComponent,
    MotoristaAutocompleteComponent,
  ],
  templateUrl: './painel-ocorrencias.html',
  styleUrls: ['./painel-ocorrencias.css'],
})
export class PainelOcorrenciasComponent implements OnInit {
  private ocorrenciaService = inject(OcorrenciaService);
  private origemService = inject(OrigemOcorrenciaService);
  private categoriaService = inject(CategoriaOcorrenciaService);

  stats: OcorrenciaStats = {
    registrada: 0,
    emAnalise: 0,
    concluida: 0,
    tempoMedioConclusaoDias: null,
  };
  isLoadingStats = false;

  // Filtros (mesmos da lista de ocorrências, exceto Nº ocorrência)
  showFilters = false;
  dataInicioFilter = '';
  dataFimFilter = '';
  linhaFilter: string[] = [];
  tipoFilter: string[] = [];
  veiculoFilter = '';
  motoristaFilter = '';
  arcoFilter: string[] = [];
  sentidoViaFilter: string[] = [];
  tipoLocalFilter: string[] = [];
  culpabilidadeFilter: string[] = [];
  houveVitimasFilter: string[] = [];
  terceirizadoFilter: string[] = [];
  origemFilter: string[] = [];
  categoriaFilter: string[] = [];

  // Opções de filtros
  linhaOptions = Object.values(Linha);
  tipoOptions = Object.values(TipoOcorrencia);
  arcoOptions = Object.values(Arco);
  sentidoViaOptions = Object.values(SentidoVia);
  tipoLocalOptions = Object.values(TipoLocal);
  culpabilidadeOptions = Object.values(Culpabilidade);
  houveVitimasOptions = Object.values(SimNao);
  terceirizadoOptions = Object.values(Terceirizado);
  origemOptions: string[] = [];
  categoriaOptions: string[] = [];

  private origensList: OrigemOcorrencia[] = [];
  private categoriasList: CategoriaOcorrencia[] = [];

  ngOnInit(): void {
    const year = new Date().getFullYear();
    this.dataInicioFilter = `${year}-01-01`;
    this.dataFimFilter = `${year}-12-31`;
    this.loadOrigins();
    this.loadCategories();
    this.loadStats();
  }

  loadOrigins(): void {
    this.origemService.getAll().subscribe((list) => {
      this.origensList = list;
      this.origemOptions = list.map((o) => o.descricao);
    });
  }

  loadCategories(): void {
    this.categoriaService.getAll().subscribe((list) => {
      this.categoriasList = list;
      this.categoriaOptions = list.map((c) => c.descricao);
    });
  }

  onVeiculoSelected(veiculo: Veiculo): void {
    this.veiculoFilter = veiculo.id;
    this.onFilterChange();
  }

  onMotoristaSelected(motorista: Motorista): void {
    this.motoristaFilter = motorista.id;
    this.onFilterChange();
  }

  loadStats(): void {
    this.isLoadingStats = true;

    const idOrigem =
      this.origemFilter.length > 0
        ? (this.origemFilter
            .map((d) => this.origensList.find((o) => o.descricao === d)?.id)
            .filter(Boolean) as string[])
        : undefined;

    const idCategoria =
      this.categoriaFilter.length > 0
        ? (this.categoriaFilter
            .map((d) => this.categoriasList.find((c) => c.descricao === d)?.id)
            .filter(Boolean) as string[])
        : undefined;

    this.ocorrenciaService
      .getStats(
        this.dataInicioFilter || undefined,
        this.dataFimFilter || undefined,
        this.linhaFilter.length > 0 ? this.linhaFilter : undefined,
        this.tipoFilter.length > 0 ? this.tipoFilter : undefined,
        idOrigem,
        idCategoria,
        this.veiculoFilter || undefined,
        this.motoristaFilter || undefined,
        this.arcoFilter.length > 0 ? this.arcoFilter : undefined,
        this.sentidoViaFilter.length > 0 ? this.sentidoViaFilter : undefined,
        this.tipoLocalFilter.length > 0 ? this.tipoLocalFilter : undefined,
        this.culpabilidadeFilter.length > 0 ? this.culpabilidadeFilter : undefined,
        this.houveVitimasFilter.length > 0 ? this.houveVitimasFilter : undefined,
        this.terceirizadoFilter.length > 0 ? this.terceirizadoFilter : undefined,
      )
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.isLoadingStats = false;
        },
        error: () => {
          this.isLoadingStats = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadStats();
  }

  clearFilters(): void {
    this.dataInicioFilter = '';
    this.dataFimFilter = '';
    this.linhaFilter = [];
    this.tipoFilter = [];
    this.veiculoFilter = '';
    this.motoristaFilter = '';
    this.arcoFilter = [];
    this.sentidoViaFilter = [];
    this.tipoLocalFilter = [];
    this.culpabilidadeFilter = [];
    this.houveVitimasFilter = [];
    this.terceirizadoFilter = [];
    this.origemFilter = [];
    this.categoriaFilter = [];
    this.loadStats();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
