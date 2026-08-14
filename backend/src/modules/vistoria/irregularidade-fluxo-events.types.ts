import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';

export type IrregularidadeFluxoStreamEvent =
  | IrregularidadeFluxoChangedEvent
  | IrregularidadeVistoriaFinalizadaEvent
  | IrregularidadeFluxoHeartbeatEvent;

export interface IrregularidadeFluxoChangedEvent {
  type: 'FLUXO_CHANGED';
  irregularidadeId: string;
  statusAnterior: StatusIrregularidade;
  statusNovo: StatusIrregularidade;
  idEmpresaManutencao?: string;
}

export interface IrregularidadeVistoriaFinalizadaEvent {
  type: 'VISTORIA_FINALIZADA';
  vistoriaId: string;
  irregularidadeIds: string[];
}

export interface IrregularidadeFluxoHeartbeatEvent {
  type: 'HEARTBEAT';
}
