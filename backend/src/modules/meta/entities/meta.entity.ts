import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Departamento } from '../../departamento/entities/departamento.entity';

@Entity('metas')
@Index(['nomeDaMeta'])
@Index(['prazoFinal'])
export class Meta extends BaseEntity {
  @Column({ type: 'varchar', length: 200, nullable: false })
  nomeDaMeta: string;

  @ManyToOne(() => Departamento, { eager: true, nullable: false })
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento;

  @Column({ type: 'uuid', nullable: false })
  departamentoId: string;

  @Column({ type: 'text', nullable: true })
  descricaoDetalhada?: string;

  @Column({ type: 'date', nullable: true })
  prazoFinal?: string;

  @Column({ type: 'integer', nullable: true })
  meta?: number;

  static override get nomeAmigavel(): string {
    return 'Meta';
  }
}
