export enum PolaridadeMeta {
  MAIOR_MELHOR = 'MAIOR_MELHOR',
  MENOR_MELHOR = 'MENOR_MELHOR',
}

export const POLARIDADE_META_LABELS: Record<PolaridadeMeta, string> = {
  [PolaridadeMeta.MAIOR_MELHOR]: 'Mais é melhor',
  [PolaridadeMeta.MENOR_MELHOR]: 'Menos é melhor',
};

export enum UnidadeMeta {
  PORCENTAGEM = 'PORCENTAGEM',
  DIAS = 'DIAS',
  HORAS = 'HORAS',
  VALOR = 'VALOR',
  QUANTIDADE = 'QUANTIDADE',
}

export const UNIDADE_META_LABELS: Record<UnidadeMeta, string> = {
  [UnidadeMeta.PORCENTAGEM]: 'Porcentagem %',
  [UnidadeMeta.DIAS]: 'Dias',
  [UnidadeMeta.HORAS]: 'Horas',
  [UnidadeMeta.VALOR]: 'Valor R$',
  [UnidadeMeta.QUANTIDADE]: 'Quantidade',
};

export enum IndicadorMeta {
  RESULTADO_ACUMULADO = 'RESULTADO_ACUMULADO',
  POR_MEDIA = 'POR_MEDIA',
  PROGRESSO = 'PROGRESSO',
}

export const INDICADOR_META_LABELS: Record<IndicadorMeta, string> = {
  [IndicadorMeta.RESULTADO_ACUMULADO]: 'Resultado Acumulado',
  [IndicadorMeta.POR_MEDIA]: 'Por Média',
  [IndicadorMeta.PROGRESSO]: 'Progresso',
};

export interface Meta {
  id: string;
  tituloDaMeta: string;
  polaridade: PolaridadeMeta;
  unidade: UnidadeMeta;
  indicador: IndicadorMeta;
  departamentoId: string;
  departamento?: { id: string; nomeDepartamento: string };
  descricaoDetalhada?: string;
  inicioDaMeta: string;
  prazoFinal?: string;
  valorMeta?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateMetaDto {
  tituloDaMeta: string;
  polaridade: PolaridadeMeta;
  unidade: UnidadeMeta;
  indicador: IndicadorMeta;
  departamentoId: string;
  descricaoDetalhada?: string;
  inicioDaMeta: string;
  prazoFinal?: string;
  valorMeta?: number;
}

export interface UpdateMetaDto extends Partial<CreateMetaDto> {}

export interface MetaExecucao {
  id: string;
  metaId: string;
  dataRealizado: string;
  valorRealizado: number;
  justificativa?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateMetaExecucaoDto {
  dataRealizado: string;
  valorRealizado: number;
  justificativa?: string;
}

export interface UpdateMetaExecucaoDto extends Partial<CreateMetaExecucaoDto> {}

export interface MetaDashboardCard {
  id: string;
  tituloDaMeta: string;
  departamentoId: string;
  departamentoNome: string;
  inicioDaMeta: string | null;
  prazoFinal?: string | null;
  valorMeta?: number | null;
  polaridade: PolaridadeMeta;
  unidade: UnidadeMeta;
  indicador: IndicadorMeta;
  totalExecutado: number;
  totalExecucoes: number;
  totalMesesIntervalo: number;
  mediaExecucaoMesAtivo: number;
  statusAtualMeta: number;
  progressoPercentual: number;
  ultimaExecucaoEm?: string | null;
}
