import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Departamento } from '../../departamento/entities/departamento.entity';
import { IndicadorExecucao } from './indicador-execucao.entity';

@Entity('indicadores')
@Index(['nomeIndicador'])
@Index(['departamentoId'])
export class Indicador extends BaseEntity {
  @Column({ type: 'int', nullable: false, unique: true })
  codigoIndicador: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  nomeIndicador: string;

  @ManyToOne(() => Departamento, { eager: true, nullable: false })
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento;

  @Column({ type: 'uuid', nullable: false })
  departamentoId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  unidadeMedida: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  tipoIndicador: string;

  @Column({ type: 'text', nullable: true })
  detalheIndicador?: string | null;

  @Column({ type: 'boolean', nullable: false, default: true })
  ativo: boolean;

  @Column({ type: 'int', nullable: true })
  ordemExibicao?: number | null;

  @OneToMany(() => IndicadorExecucao, (execucao) => execucao.indicador)
  execucoes?: IndicadorExecucao[];

  static override get nomeAmigavel(): string {
    return 'Indicador';
  }
}
