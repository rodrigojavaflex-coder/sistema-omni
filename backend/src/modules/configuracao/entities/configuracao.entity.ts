import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

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
}

@Entity('configuracoes')
export class Configuracao extends BaseEntity {
  /**
   * Nome amigável da entidade para uso em logs de auditoria
   */
  static get nomeAmigavel(): string {
    return 'configuração';
  }

  @Column({ nullable: true })
  nomeCliente: string;

  /** Legado: caminho em disco (`/uploads/...`) ou marcador `db` quando a logo está em bytea. */
  @Column({ type: 'varchar', nullable: true })
  logoRelatorio?: string | null;

  @Column({ name: 'logo_relatorio_bytes', type: 'bytea', nullable: true })
  logoRelatorioBytes?: Buffer | null;

  @Column({ name: 'logo_relatorio_mime', type: 'varchar', length: 100, nullable: true })
  logoRelatorioMime?: string | null;

  // Configurações de Auditoria
  @Column({ default: true })
  auditarConsultas: boolean;

  @Column({ default: true })
  auditarLoginLogOff: boolean;

  @Column({ default: true })
  auditarCriacao: boolean;

  @Column({ default: true })
  auditarAlteracao: boolean;

  @Column({ default: true })
  auditarExclusao: boolean;

  @Column({ default: true })
  auditarSenhaAlterada: boolean;

  @Column({ type: 'jsonb', nullable: true })
  tempoFluxoConfig?: TempoFluxoConfig;

  @Column({ type: 'jsonb', nullable: true })
  emailEnvioConfig?: EmailEnvioConfig;

  @Column({ type: 'jsonb', nullable: true })
  erpVistoriaConfig?: ErpVistoriaConfig;
}
