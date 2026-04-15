import { GravidadeCriticidade } from './matriz-criticidade.model';

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
  vistoriadorNome?: string;
  motoristaNome?: string;
  gravidade?: GravidadeCriticidade;
  quantidadeFotos?: number;
  quantidadeAudios?: number;
  fotos?: IrregularidadeMidiaFluxoItem[];
  audios?: IrregularidadeMidiaFluxoItem[];
  criadoEm: string;
  atualizadoEm: string;
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

export interface ListarIrregularidadeFiltros {
  idVeiculo?: string;
  gravidade?: GravidadeCriticidade[];
  dataInicio?: string;
  dataFim?: string;
}

export interface IniciarManutencaoPayload {
  idEmpresaManutencao: string;
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

