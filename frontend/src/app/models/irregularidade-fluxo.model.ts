import { GravidadeCriticidade } from './matriz-criticidade.model';

export enum OrigemRegistroIrregularidade {
  SOS_WEB = 'SOS_WEB',
}

export enum StatusIrregularidade {
  REGISTRADA = 'REGISTRADA',
  RETRABALHO_GARANTIA = 'RETRABALHO_GARANTIA',
  CANCELADA = 'CANCELADA',
  EM_MANUTENCAO = 'EM_MANUTENCAO',
  NAO_PROCEDE = 'NAO_PROCEDE',
  CONCLUIDA = 'CONCLUIDA',
  VALIDADA = 'VALIDADA',
}

export interface IrregularidadeFluxoItem {
  id: string;
  idvistoria?: string;
  numeroVistoria?: number;
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
  empresaManutencaoDescricao?: string;
  idVeiculo?: string;
  veiculoDescricao?: string;
  veiculoPlaca?: string;
  veiculoModelo?: string;
  veiculoCombustivel?: string;
  veiculoModeloId?: string;
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
  controleIntegracaoApi?: boolean;
  osOrigAtual?: string;
  numOsExternoAtual?: number | null;
  ultimoErroIntegracao?: string;
  ultimoErroIntegracaoEm?: string;
  erpCodigoPedido?: string;
  erpUltimoErro?: string;
  marcacao?: {
    idVista: string;
    descricaoVista: string;
    posXPct: number;
    posYPct: number;
    ordem?: number;
  } | null;
  marcacoes?: Array<{
    idVista: string;
    descricaoVista: string;
    posXPct: number;
    posYPct: number;
    ordem?: number;
  }>;
  exigeMarcacaoMapa?: boolean;
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
  /** Empresa de manutenção (obrigatório em Manutenção/Validação). */
  idEmpresaManutencao?: string;
  origemRegistro?: FiltroOrigemRegistro;
  /** Trecho numérico da OS (numeroIrregularidade) para busca parcial. */
  ordemServico?: string;
  /** Trecho da OS OMNI / pedido ERP (`erp_codigo_pedido`). */
  erpCodigoPedido?: string;
  /** Trecho da OS BRT (`num_os_externo_atual`). */
  numOsExterno?: string;
  /** Trecho do número da vistoria (`vistorias.numero_vistoria`). */
  numeroVistoria?: string;
  idArea?: string;
  idComponente?: string;
  idSintoma?: string;
  gravidade?: GravidadeCriticidade[];
  dataInicio?: string;
  dataFim?: string;
  referenciaPeriodo?: ReferenciaPeriodoIrregularidade;
  page?: number;
  limit?: number;
}

export interface IrregularidadeFluxoPaginated {
  data: IrregularidadeFluxoItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
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
  erpCodigoPedido?: string;
  numOsExternoAtual?: number | null;
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
  impressaoEnviada?: boolean;
  impressaoErro?: string;
  falhas?: EnvioManutencaoFalhaItem[];
}

export interface EnvioManutencaoFalhaItem {
  id: string;
  numeroIrregularidade?: number;
  codigoErro?: string;
  mensagem: string;
  httpStatus?: number;
}

export interface ReclassificarPayload {
  idarea: string;
  idcomponente: string;
  idsintoma: string;
  observacao?: string;
  marcacoes?: Array<{
    idVista: string;
    posXPct: number;
    posYPct: number;
  }>;
  idVista?: string;
  posXPct?: number;
  posYPct?: number;
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

