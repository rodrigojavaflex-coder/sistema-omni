export interface MapaAvariaPonto {
  xPct: number;
  yPct: number;
}

export interface MapaAvariaMarca {
  xPct: number;
  yPct: number;
  /** Índice exibido no círculo (`1.1`, `1.2`…). */
  rotulo: string;
  /** Número da OS (numeroIrregularidade) para a legenda. */
  numeroOs?: number | null;
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
  /** Ordem do ponto (0-based) dentro da irregularidade. */
  ordem?: number;
}

export interface IrregularidadeMarcacao {
  idVista: string;
  descricaoVista: string;
  posXPct: number;
  posYPct: number;
  ordem?: number;
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
