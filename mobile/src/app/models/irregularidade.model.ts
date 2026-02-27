export interface IrregularidadeResumo {
  id: string;
  idarea: string;
  nomeArea?: string;
  idcomponente: string;
  nomeComponente?: string;
  idsintoma: string;
  descricaoSintoma?: string;
  observacao?: string;
  resolvido: boolean;
  atualizadoEm: string;
}

export interface IrregularidadeImagemResumoItem {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
}

export interface IrregularidadeImagemResumo {
  idirregularidade: string;
  imagens: IrregularidadeImagemResumoItem[];
}
