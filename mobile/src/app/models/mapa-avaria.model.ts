export interface ModeloVeiculoVista {
  id: string;
  idCatalogo: string;
  descricao: string;
  ordem: number;
  mimeType: string;
  nomeArquivo: string;
  tamanho: number;
  ativo: boolean;
  atualizadoEm: string;
}

export interface VistaMarcacaoApi {
  idIrregularidade: string;
  numeroIrregularidade: number;
  idsintoma: string;
  descricaoSintoma?: string;
  statusAtual: string;
  resolvido: boolean;
  posXPct: number;
  posYPct: number;
}

export interface MarcaMapa {
  idVista: string;
  posXPct: number;
  posYPct: number;
}
