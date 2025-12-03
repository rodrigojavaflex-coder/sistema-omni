export enum IndicadorMeta {
  RESULTADO_ACUMULADO = 'RESULTADO_ACUMULADO',
  POR_MEDIA = 'POR_MEDIA',
}

export const INDICADOR_META_LABEL: Record<IndicadorMeta, string> = {
  [IndicadorMeta.RESULTADO_ACUMULADO]: 'Resultado Acumulado',
  [IndicadorMeta.POR_MEDIA]: 'Por Média',
};
