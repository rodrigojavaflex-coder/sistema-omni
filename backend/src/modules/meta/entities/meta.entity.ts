import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Index,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Departamento } from '../../departamento/entities/departamento.entity';
import { PolaridadeMeta } from '../enums/polaridade-meta.enum';
import { MetaExecucao } from './meta-execucao.entity';
import { UnidadeMeta } from '../enums/unidade-meta.enum';
import { IndicadorMeta } from '../enums/indicador-meta.enum';

@Entity('metas')
@Index(['tituloDaMeta'])
@Index(['prazoFinal'])
export class Meta extends BaseEntity {
  @Column({ type: 'varchar', length: 200, nullable: false })
  tituloDaMeta: string;

  @ManyToOne(() => Departamento, { eager: true, nullable: false })
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento;

  @Column({ type: 'uuid', nullable: false })
  departamentoId: string;

  @Column({ type: 'text', nullable: true })
  descricaoDetalhada?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: PolaridadeMeta.MAIOR_MELHOR,
  })
  polaridade: PolaridadeMeta;

  @Column({ type: 'date', nullable: false })
  inicioDaMeta: string;

  @Column({ type: 'date', nullable: true })
  prazoFinal?: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, nullable: true })
  valorMeta?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: UnidadeMeta.PORCENTAGEM,
  })
  unidade: UnidadeMeta;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: IndicadorMeta.RESULTADO_ACUMULADO,
  })
  indicador: IndicadorMeta;

  @OneToMany(() => MetaExecucao, (execucao) => execucao.meta)
  execucoes?: MetaExecucao[];

  static override get nomeAmigavel(): string {
    return 'Meta';
  }
}
