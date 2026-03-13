import { AreaComponente, AreaVistoriada } from './area-vistoriada.model';
import { IrregularidadeResumo } from './irregularidade.model';
import { MatrizCriticidade } from './matriz-criticidade.model';
import { Vistoria } from './vistoria.model';

export interface AreaComponenteBootstrap extends AreaComponente {
  matriz: MatrizCriticidade[];
}

export interface AreaVistoriadaBootstrap extends AreaVistoriada {
  componentes: AreaComponenteBootstrap[];
}

export interface VistoriaBootstrap {
  generatedAt: string;
  vistoria: Vistoria;
  areas: AreaVistoriadaBootstrap[];
  irregularidadesVistoria: IrregularidadeResumo[];
  pendentesVeiculo: IrregularidadeResumo[];
}
