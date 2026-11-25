export const UNIDADE_MEDIDA_SUGESTOES = [
  'PASSAGEIROS',
  'KM',
  'R$',
  'VEICULOS',
  'VIAGENS',
  'PERCENTUAL',
] as const;

export const TIPO_INDICADOR_SUGESTOES = [
  'QUANTIDADE',
  'VALOR',
  'PERCENTUAL',
  'INDICE',
  'TAXA',
] as const;

export interface Indicador {
  id: string;
  codigoIndicador: number;
  nomeIndicador: string;
  departamentoId: string;
  departamento?: { id: string; nomeDepartamento: string };
  unidadeMedida: string;
  tipoIndicador: string;
  detalheIndicador?: string | null;
  ativo: boolean;
  ordemExibicao?: number | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateIndicadorDto {
  nomeIndicador: string;
  departamentoId: string;
  unidadeMedida: string;
  tipoIndicador: string;
  detalheIndicador?: string | null;
  ativo?: boolean;
  ordemExibicao?: number | null;
}

export interface UpdateIndicadorDto {
  nomeIndicador: string;
  departamentoId: string;
  unidadeMedida: string;
  tipoIndicador: string;
  detalheIndicador?: string | null;
  ativo: boolean;
  ordemExibicao?: number | null;
}

export interface IndicadorExecucao {
  id: string;
  indicadorId: string;
  dataReferencia: string;
  valor: number;
  justificativa?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateIndicadorExecucaoDto {
  dataReferencia: string;
  valor: number;
  justificativa?: string;
}

export interface UpdateIndicadorExecucaoDto
  extends Partial<CreateIndicadorExecucaoDto> {}

export interface IndicadorDashboardCard {
  id: string;
  codigoIndicador: number;
  nomeIndicador: string;
  departamentoId: string;
  departamentoNome: string;
  unidadeMedida: string;
  tipoIndicador: string;
  ativo: boolean;
  ordemExibicao: number | null;
  ultimoValor: number | null;
  ultimoPeriodo: string | null;
  totalMesesAno: number;
  somaAno: number;
  mediaAno: number;
  totalExecucoes: number;
}
