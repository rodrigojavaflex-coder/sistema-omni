import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Indicador } from './indicador.entity';

@Entity('indicador_execucoes')
@Unique('UQ_indicador_execucao_periodo', ['indicadorId', 'dataReferencia'])
@Index(['indicadorId', 'dataReferencia'])
export class IndicadorExecucao extends BaseEntity {
  @ManyToOne(() => Indicador, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'indicadorId' })
  indicador: Indicador;

  @Column({ type: 'uuid', nullable: false })
  indicadorId: string;

  @Column({ type: 'date', nullable: false })
  dataReferencia: string;

  @Column({ type: 'numeric', precision: 18, scale: 4, nullable: false })
  valor: number;

  @Column({ type: 'text', nullable: true })
  justificativa?: string | null;

  static override get nomeAmigavel(): string {
    return 'Execução de Indicador';
  }
}
