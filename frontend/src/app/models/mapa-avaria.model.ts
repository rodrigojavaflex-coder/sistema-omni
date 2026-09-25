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

/** Extrai o índice da irregularidade de um rótulo `1.2` → `1`. */
function extrairIndiceOsDoRotulo(rotulo: string): number | null {
  const match = /^(\d+)\./.exec(rotulo?.trim() || '');
  if (!match) {
    return null;
  }
  const indice = Number(match[1]);
  return Number.isFinite(indice) && indice > 0 ? indice : null;
}

/** Legenda condensada: `OS: 1.X:20261, 2.X:20262 e 3.X:20263`. */
export function formatarLegendaOsMarcas(marcas: MapaAvariaMarca[]): string {
  const porIndice = new Map<number, number>();
  for (const marca of marcas) {
    if (!marca.numeroOs) {
      continue;
    }
    const indice = extrairIndiceOsDoRotulo(marca.rotulo);
    if (indice == null || porIndice.has(indice)) {
      continue;
    }
    porIndice.set(indice, marca.numeroOs);
  }
  const partes = Array.from(porIndice.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([indice, numeroOs]) => `${indice}.X:${numeroOs}`);
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
