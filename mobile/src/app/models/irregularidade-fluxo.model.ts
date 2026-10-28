export enum StatusIrregularidade {
  REGISTRADA = 'REGISTRADA',
  RETRABALHO_GARANTIA = 'RETRABALHO_GARANTIA',
  CANCELADA = 'CANCELADA',
  EM_MANUTENCAO = 'EM_MANUTENCAO',
  NAO_PROCEDE = 'NAO_PROCEDE',
  CONCLUIDA = 'CONCLUIDA',
  VALIDADA = 'VALIDADA',
}

export interface IrregularidadeFluxoMidia {
  id: string;
  nomeArquivo: string;
  mimeType: string;
  dadosBase64: string;
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
  /** Texto da conclusão da manutenção (vindo da listagem). */
  observacaoConclusao?: string;
  statusAtual: StatusIrregularidade;
  idEmpresaManutencao?: string;
  empresaManutencaoDescricao?: string;
  idVeiculo?: string;
  veiculoDescricao?: string;
  veiculoPlaca?: string;
  gravidade?: string;
  criadoEm: string;
  entradaStatusEm?: string;
  atualizadoEm: string;
  erpCodigoPedido?: string;
  numOsExternoAtual?: number | null;
  osOrigAtual?: string;
  quantidadeFotos?: number;
  quantidadeAudios?: number;
  fotos?: IrregularidadeFluxoMidia[];
  audios?: IrregularidadeFluxoMidia[];
}

export interface IrregularidadeFluxoPaginated {
  data: IrregularidadeFluxoItem[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IrregularidadeHistoricoItem {
  id: string;
  origem?: 'OMNI' | 'BRT';
  statusOrigem?: StatusIrregularidade;
  statusDestino?: StatusIrregularidade;
  acao: string;
  dataEvento: string;
  idUsuario?: string;
  usuarioNome?: string;
  observacao?: string;
}

export interface ValidacaoFinalPayload {
  observacao?: string;
}

export interface ReprovarFinalPayload {
  observacao: string;
}
