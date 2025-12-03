export enum PolaridadeMeta {
  MAIOR_MELHOR = 'MAIOR_MELHOR',
  MENOR_MELHOR = 'MENOR_MELHOR',
}

export const POLARIDADE_META_LABEL = {
  [PolaridadeMeta.MAIOR_MELHOR]: 'Mais é melhor',
  [PolaridadeMeta.MENOR_MELHOR]: 'Menos é melhor',
} as const;
