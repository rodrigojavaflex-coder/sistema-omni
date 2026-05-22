import { Injectable } from '@angular/core';

export interface OcorrenciaListFilterState {
  currentPage: number;
  itemsPerPage: number;
  showAdvancedFilters: boolean;
  numeroOcorrenciaFilter: string;
  statusFilter: string[];
  tipoFilter: string[];
  linhaFilter: string[];
  dataInicioFilter: string;
  dataFimFilter: string;
  veiculoFilter: string;
  motoristaFilter: string;
  arcoFilter: string[];
  sentidoViaFilter: string[];
  tipoLocalFilter: string[];
  culpabilidadeFilter: string[];
  houveVitimasFilter: string[];
  terceirizadoFilter: string[];
  origemFilter: string[];
  classificacaoFilter: string[];
}

const STORAGE_KEY = 'omni_ocorrencia_list_filters';

@Injectable({ providedIn: 'root' })
export class OcorrenciaListFilterStateService {
  save(state: OcorrenciaListFilterState): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignora falhas de quota ou ambiente sem sessionStorage
    }
  }

  load(): OcorrenciaListFilterState | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw) as OcorrenciaListFilterState;
    } catch {
      return null;
    }
  }

  clear(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  }
}
