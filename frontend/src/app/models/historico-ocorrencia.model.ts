import { StatusOcorrencia } from './status-ocorrencia.enum';

export interface HistoricoOcorrencia {
  id: string;
  idOcorrencia: string;
  statusAnterior?: StatusOcorrencia;
  statusNovo: StatusOcorrencia;
  dataAlteracao: Date;
  observacao?: string;
  idUsuario?: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface UpdateStatusOcorrenciaDto {
  status: StatusOcorrencia;
  observacao?: string;
}

export interface OcorrenciaStats {
  registrada: number;
  emAnalise: number;
  concluida: number;
  tempoMedioConclusaoDias: number | null;
}
