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

  @Column({ nullable: true })
  logoRelatorio: string; // Caminho/URL da imagem

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
}
