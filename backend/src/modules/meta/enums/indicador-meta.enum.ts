export enum IndicadorMeta {
  RESULTADO_ACUMULADO = 'RESULTADO_ACUMULADO',
  POR_MEDIA = 'POR_MEDIA',
  PROGRESSO = 'PROGRESSO',
  INDICE_ACUMULADO = 'INDICE_ACUMULADO',
}

export const INDICADOR_META_LABEL: Record<IndicadorMeta, string> = {
  [IndicadorMeta.RESULTADO_ACUMULADO]: 'Resultado Acumulado',
  [IndicadorMeta.POR_MEDIA]: 'Por Média',
  [IndicadorMeta.PROGRESSO]: 'Progresso',
  [IndicadorMeta.INDICE_ACUMULADO]: 'Indice acumulado',
};
