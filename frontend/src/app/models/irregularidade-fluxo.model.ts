import { GravidadeCriticidade } from './matriz-criticidade.model';

export enum OrigemRegistroIrregularidade {
  SOS_WEB = 'SOS_WEB',
}

export enum StatusIrregularidade {
  REGISTRADA = 'REGISTRADA',
  CANCELADA = 'CANCELADA',
  EM_MANUTENCAO = 'EM_MANUTENCAO',
  NAO_PROCEDE = 'NAO_PROCEDE',
  CONCLUIDA = 'CONCLUIDA',
  VALIDADA = 'VALIDADA',
}

export interface IrregularidadeFluxoItem {
  id: string;
  numeroIrregularidade?: number;
  idarea: string;
  idcomponente: string;
  idsintoma: string;
  nomeArea?: string;
  nomeComponente?: string;
  descricaoSintoma?: string;
  observacao?: string;
  statusAtual: StatusIrregularidade;
  idEmpresaManutencao?: string;
  idVeiculo?: string;
  veiculoDescricao?: string;
  veiculoPlaca?: string;
  veiculoModelo?: string;
  vistoriadorNome?: string;
  motoristaNome?: string;
  gravidade?: GravidadeCriticidade;
  quantidadeFotos?: number;
  quantidadeAudios?: number;
  fotos?: IrregularidadeMidiaFluxoItem[];
  audios?: IrregularidadeMidiaFluxoItem[];
  criadoEm: string;
  entradaStatusEm?: string;
  atualizadoEm: string;
  origemRegistro?: OrigemRegistroIrregularidade;
}

export interface IrregularidadeMidiaFluxoItem {
  id: string;
  nomeArquivo: string;
  mimeType: string;
  dadosBase64: string;
}

export interface IrregularidadeHistoricoItem {
  id: string;
  statusOrigem?: StatusIrregularidade;
  statusDestino: StatusIrregularidade;
  acao: string;
  dataEvento: string;
  idUsuario?: string;
  usuarioNome?: string;
  observacao?: string;
  tempoEtapaMs?: number;
}

/** Campo temporal usado com dataInicio/dataFim na listagem por status (espelha a coluna "Registrado"). */
export type ReferenciaPeriodoIrregularidade = 'CRIADO_EM' | 'ENTRADA_STATUS';

export type FiltroOrigemRegistro = 'SOS_WEB' | 'MOBILE';

export interface ListarIrregularidadeFiltros {
  idVeiculo?: string;
  origemRegistro?: FiltroOrigemRegistro;
  /** Trecho numérico da O.S. para busca parcial no backend (ex.: `2026`). */
  ordemServico?: string;
  gravidade?: GravidadeCriticidade[];
  dataInicio?: string;
  dataFim?: string;
  referenciaPeriodo?: ReferenciaPeriodoIrregularidade;
}

export interface IniciarManutencaoPayload {
  idEmpresaManutencao: string;
}

export interface IniciarManutencaoLotePayload {
  idsIrregularidades: string[];
  idEmpresaManutencao: string;
}

export interface RelatorioManutencaoResumoItem {
  id: string;
  ordemServico: number;
  irregularidade: string;
  observacao?: string;
  totalImagens: number;
}

export interface RelatorioManutencaoResumoVeiculo {
  veiculo: string;
  placa?: string;
  modelo?: string;
  itens: RelatorioManutencaoResumoItem[];
}

export interface RelatorioManutencaoResumo {
  emitidoEm: string;
  emitidoPor?: string;
  empresa: string;
  totalIrregularidades: number;
  totalVeiculos: number;
  totalAnexos: number;
  porVeiculo: RelatorioManutencaoResumoVeiculo[];
}

export interface RelatorioManutencaoPreview {
  resumo: RelatorioManutencaoResumo;
  html: string;
}

export interface RelatorioManutencaoExecucao extends RelatorioManutencaoPreview {
  totalEnviadas: number;
  emailEnviado: boolean;
}

export interface ReclassificarPayload {
  idarea: string;
  idcomponente: string;
  idsintoma: string;
  observacao?: string;
}

export interface CancelarPayload {
  motivo: string;
}

export interface NaoProcedePayload {
  motivoNaoProcede: string;
  observacao?: string;
}

export interface ValidacaoFinalPayload {
  observacao?: string;
}

export interface ReprovarFinalPayload {
  observacao: string;
}

