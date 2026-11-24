export interface AutonomiaFonte {
  autonomiaKm: number | null;
  autonomia100Km: number | null;
  disponivel: boolean;
}

export interface EscalaGrupoMotorista {
  matricula?: string | number | null;
  motorista?: string | null;
  km?: number | null;
  alocacao?: string | null;
  tarefa?: string | null;
  tipoViagem?: string | null;
}

export interface EscalaGrupo {
  grupo?: string | null;
  km?: number | null;
  alocacoes?: string[];
  tarefas?: string[];
  tiposViagem?: string[];
  motoristas?: EscalaGrupoMotorista[];
}

export interface EscalaTurno {
  grupo: string | null;
  alocacao: string | null;
  tarefa: string | null;
  tipoViagem: string | null;
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
  idEscalaDia: string;
  data: string;
  prefixo: string;
  idVeiculo: string | null;
  descricao: string | null;
  placa: string | null;
  combustivel: string | null;
  veiculoSubstituidoManual: boolean;
  kmEscala: number;
  turnos: EscalaTurno[];
  /** Agregado derivado dos turnos por grupo INFOBUS. */
  grupos: EscalaGrupo[];
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

export interface TrocarVeiculoEscalaResult {
  idEscalaDia: string;
  data: string;
  prefixo: string;
  idVeiculo: string;
  descricao: string | null;
  placa: string | null;
  veiculoSubstituidoManual: boolean;
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
  ultimoSyncEscalaEm?: string | null;
  ultimoSyncTelemetriaEm?: string | null;
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
  prefixoFiltro?: string | null;
  encontrado?: boolean;
}

export interface OsRetencaoItem {
  id: string;
  numeroIrregularidade: number;
  numeroVistoria: number | null;
  statusAtual: string;
  nomeArea: string | null;
  nomeComponente: string | null;
  descricaoSintoma: string | null;
  observacao: string | null;
  criadoEm: string | null;
  erpCodigoPedido: string | null;
  numOsExternoAtual: number | null;
  statusBrtAtual: string | null;
  osOrigAtual: string | null;
  idEmpresaManutencao: string | null;
  nomeEmpresa: string | null;
}

export interface AutonomiaResumoView {
  veiculo: string;
  placa: string | null;
  combustivel: string | null;
  turnoRotulo: string;
  kmTurno: number;
  kmDia: number;
  bateriaPct: number | null;
  kmPorPercentualModelo: number | null;
  telemetriaKm: number | null;
  telemetria100Km: number | null;
  sistemaKm: number | null;
  sistema100Km: number | null;
  tempoAteLargada: string | null;
  tempoEntreTurnos: string | null;
  motivos: string[];
}

export interface OsRetencaoResponse {
  idVeiculo: string;
  descricao: string | null;
  placa: string | null;
  total: number;
  itens: OsRetencaoItem[];
}
