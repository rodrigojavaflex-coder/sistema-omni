import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Irregularidade } from './irregularidade.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';

@Entity('irregularidade_historico')
@Index(['idIrregularidade', 'dataEvento'])
@Index(['statusDestino', 'dataEvento'])
export class IrregularidadeHistorico extends BaseEntity {
  @ManyToOne(() => Irregularidade, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idIrregularidade' })
  irregularidade: Irregularidade;

  @Column({ type: 'uuid', nullable: false })
  idIrregularidade: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  statusOrigem?: StatusIrregularidade;

  @Column({ type: 'varchar', length: 30, nullable: false })
  statusDestino: StatusIrregularidade;

  @Column({ type: 'varchar', length: 60, nullable: false })
  acao: string;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'idUsuario' })
  usuario?: Usuario;

  @Column({ type: 'uuid', nullable: true })
  idUsuario?: string;

  @Column({ type: 'uuid', nullable: true })
  idEmpresaEvento?: string;

  @Column({ type: 'timestamp', nullable: false })
  dataEvento: Date;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  correlationId?: string;
}

