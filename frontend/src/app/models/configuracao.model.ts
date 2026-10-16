
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

/** Modo ao detectar conclusão ERP (`concluida: true`). */
export type ErpBuscaInfoModoConclusao =
  | 'SOMENTE_CONCLUIR'
  | 'CONCLUIR_E_VALIDAR';

export interface ErpVistoriaConfig {
  ativo: boolean;
  url: string;
  tenant: string;
  apiKey?: string;
  apiKeyConfigured?: boolean;
  localAbertura: number;
  tipoPedido: number;
  mensagemErroPadrao?: string;
  timeoutMs?: number;
  /** Consulta periódica GET /vistorias/{codigo}/resultado. */
  buscaInfoAtivo?: boolean;
  /** Intervalo em minutos (1–1440). Padrão 10. */
  buscaInfoIntervaloMinutos?: number;
  /** Empresas NENHUMA elegíveis à busca. */
  buscaInfoEmpresaIds?: string[];
  /**
   * SOMENTE_CONCLUIR: Manutenção → Validação
   * CONCLUIR_E_VALIDAR: Manutenção → Validação → Validada
   */
  buscaInfoModoConclusao?: ErpBuscaInfoModoConclusao;
  buscaInfoUltimoPollEm?: string | null;
}

export interface ImpressaoManutencaoConfig {
  ativo: boolean;
  impressoraIp: string;
  impressoraPorta: number;
  timeoutMs?: number;
}

export interface Configuracao {
  id: string;
  nomeCliente?: string;
  /** Legado/path ou marcador `db` quando a logo está em bytea */
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
  erpVistoriaConfig?: ErpVistoriaConfig;
  impressaoManutencaoConfig?: ImpressaoManutencaoConfig;
  /** Null = usar padrão 500 km no backend */
  odometroDiffMaxKm?: number | null;
  /** Null/vazio = não bloqueia apps abaixo desta versão */
  mobileVersaoMinima?: string | null;
  /** Catálogo de versões geradas (somente leitura na API; não persistido na tabela) */
  mobileVersoesCatalogo?: MobileAppVersionCatalogItem[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface MobileAppVersionCatalogItem {
  version: string;
  date: string | null;
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
  erpVistoriaConfig?: ErpVistoriaConfig;
  impressaoManutencaoConfig?: ImpressaoManutencaoConfig;
  odometroDiffMaxKm?: number | null;
  mobileVersaoMinima?: string | null;
}

export interface UpdateConfiguracaoDto extends Partial<CreateConfiguracaoDto> {}
