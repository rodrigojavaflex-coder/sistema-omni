export interface AutonomiaFonte {
  autonomiaKm: number | null;
  autonomia100Km: number | null;
  disponivel: boolean;
}

export interface EscalaLinhaMotorista {
  matricula?: string | number | null;
  motorista?: string | null;
  km?: number | null;
}

export interface EscalaLinha {
  linha?: string | null;
  km?: number | null;
  motoristas?: EscalaLinhaMotorista[];
}

export interface EscalaTurno {
  linha: string | null;
  descricaoLinha: string | null;
  km: number | null;
  matricula: string | null;
  motorista: string | null;
  nomeTurno: string | null;
  numeroViagem: string | null;
  horarioInicio: string | null;
  horarioFim: string | null;
  ordem: number;
}

export interface EscalaPainelItem {
  data: string;
  prefixo: string;
  idVeiculo: string | null;
  descricao: string | null;
  placa: string | null;
  combustivel: string | null;
  kmEscala: number;
  turnos: EscalaTurno[];
  /** Agregado derivado dos turnos (compat). */
  linhas: EscalaLinha[];
  retido: boolean;
  qtdOsVermelhas: number;
  bateriaPct: number | null;
  telemetria: AutonomiaFonte;
  calculoOmni: AutonomiaFonte;
  alertaAutonomia: boolean;
  alertaRetidoNaEscala: boolean;
  kmPorPercentualModelo: number | null;
  dataHoraTelemetria: string | null;
  sincronizadoEscalaEm: string | null;
  sincronizadoTelemetriaEm: string | null;
}

export interface EscalaPainelResponse {
  data: string;
  total: number;
  itens: EscalaPainelItem[];
  resumo: {
    retidosNaEscala: number;
    alertaAutonomia: number;
    semVinculoVeiculo: number;
  };
}

export interface SyncEscalaResult {
  data: string;
  totalRecebidos: number;
  upserts: number;
  semVinculo: number;
}

export interface SyncTelemetriaResult {
  totalRecebidos: number;
  upserts: number;
  semVinculo: number;
  idEmpresaUsada: string;
}
