
export interface Configuracao {
  id: string;
  nomeCliente?: string;
  logoRelatorio?: string;
  // Configurações de Auditoria
  auditarConsultas: boolean;
  auditarLoginLogOff: boolean;
  auditarCriacao: boolean;
  auditarAlteracao: boolean;
  auditarExclusao: boolean;
  auditarSenhaAlterada: boolean;
  tempoFluxoConfig?: TempoFluxoConfig;
  emailEnvioConfig?: EmailEnvioConfig;
  criadoEm: string;
  atualizadoEm: string;
}

export type FluxoTelaConfiguracao = 'tratamento' | 'manutencao' | 'validacaoFinal';

export interface TempoFaixaConfig {
  minHoras: number;
  maxHoras: number | null;
  label: string;
  corHex: string;
  mostrarCor: boolean;
  mostrarRotulo: boolean;
  ativo: boolean;
}

export interface TempoFluxoConfig {
  tratamento: TempoFaixaConfig[];
  manutencao: TempoFaixaConfig[];
  validacaoFinal: TempoFaixaConfig[];
}

export interface CreateConfiguracaoDto {
  nomeCliente?: string;
  logoRelatorio?: string;
  // Configurações de Auditoria
  auditarConsultas?: boolean;
  auditarLoginLogOff?: boolean;
  auditarCriacao?: boolean;
  auditarAlteracao?: boolean;
  auditarExclusao?: boolean;
  auditarSenhaAlterada?: boolean;
  tempoFluxoConfig?: TempoFluxoConfig;
  emailEnvioConfig?: EmailEnvioConfig;
}

export interface EmailEnvioConfig {
  ativo: boolean;
  host: string;
  porta: number;
  usuario?: string;
  senha?: string;
  usarTls: boolean;
  remetenteNome?: string;
  remetenteEmail?: string;
  assuntoPadrao?: string;
}

export interface UpdateConfiguracaoDto extends Partial<CreateConfiguracaoDto> {}
