import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Meta } from './meta.entity';

@Entity('meta_execucoes')
@Index(['metaId', 'dataRealizado'])
export class MetaExecucao extends BaseEntity {
  @ManyToOne(() => Meta, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'metaId' })
  meta: Meta;

  @Column({ type: 'uuid', nullable: false })
  metaId: string;

  @Column({ type: 'date', nullable: false })
  dataRealizado: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: false })
  valorRealizado: number;

  @Column({ type: 'text', nullable: true })
  justificativa?: string;

  static override get nomeAmigavel(): string {
    return 'Execução de Meta';
  }
}
