export interface MapaAvariaMarca {
  xPct: number;
  yPct: number;
  rotulo: string;
  resolvido?: boolean;
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

export interface IrregularidadeMarcacao {
  idVista: string;
  descricaoVista: string;
  posXPct: number;
  posYPct: number;
}
