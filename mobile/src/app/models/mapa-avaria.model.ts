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
  /** Ordem do ponto (0-based) dentro da irregularidade. */
  ordem?: number;
}

export interface MapaAvariaMarca {
  xPct: number;
  yPct: number;
  /** Índice exibido no círculo (`1.1`, `1.2`…). */
  rotulo: string;
  /** Número da OS (numeroIrregularidade) para a legenda. */
  numeroOs?: number | null;
}

/** Rascunho/confirmado: vários pontos na mesma vista. */
export interface MarcaMapa {
  idVista: string;
  pontos: Array<{ posXPct: number; posYPct: number }>;
}

/** Input do mapa: aceita `pontos[]` ou legado de um único ponto. */
export interface MarcaMapaInicial {
  idVista: string;
  posXPct?: number;
  posYPct?: number;
  pontos?: Array<{ posXPct: number; posYPct: number }>;
}

export const MARCACOES_MAX = 10;

/** Rótulo do círculo: índice da irregularidade na vista + ponto (`1.1`, `2.1`…). */
export function rotuloCirculoMarcacao(indiceOs: number, ordem: number): string {
  return `${indiceOs}.${Math.max(0, ordem) + 1}`;
}

export function formatarLegendaOsMarcas(marcas: MapaAvariaMarca[]): string {
  const partes = marcas
    .map((marca) => {
      if (!marca.numeroOs) {
        return null;
      }
      return `${marca.rotulo}:${marca.numeroOs}`;
    })
    .filter((parte): parte is string => !!parte);
  if (partes.length === 0) {
    return '';
  }
  if (partes.length === 1) {
    return `OS: ${partes[0]}`;
  }
  const ultimo = partes[partes.length - 1];
  const anteriores = partes.slice(0, -1).join(', ');
  return `OS: ${anteriores} e ${ultimo}`;
}
