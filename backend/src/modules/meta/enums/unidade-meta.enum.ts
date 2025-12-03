export enum UnidadeMeta {
  PORCENTAGEM = 'PORCENTAGEM',
  DIAS = 'DIAS',
  HORAS = 'HORAS',
  VALOR = 'VALOR',
  QUANTIDADE = 'QUANTIDADE',
}

export const UNIDADE_META_LABEL: Record<UnidadeMeta, string> = {
  [UnidadeMeta.PORCENTAGEM]: 'Porcentagem %',
  [UnidadeMeta.DIAS]: 'Dias',
  [UnidadeMeta.HORAS]: 'Horas',
  [UnidadeMeta.VALOR]: 'Valor R$',
  [UnidadeMeta.QUANTIDADE]: 'Quantidade',
};
