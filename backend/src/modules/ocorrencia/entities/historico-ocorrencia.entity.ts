import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Ocorrencia } from './ocorrencia.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { StatusOcorrencia } from '../../../common/enums/status-ocorrencia.enum';

@Entity('historicoocorrencias')
@Index(['idOcorrencia'])
@Index(['dataAlteracao'])
export class HistoricoOcorrencia extends BaseEntity {
  @ManyToOne(() => Ocorrencia, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idOcorrencia' })
  ocorrencia: Ocorrencia;

  @Column({ type: 'uuid', nullable: false })
  idOcorrencia: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  statusAnterior?: StatusOcorrencia;

  @Column({ type: 'varchar', length: 20, nullable: false })
  statusNovo: StatusOcorrencia;

  @Column({ type: 'timestamp', nullable: false })
  dataAlteracao: Date;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @ManyToOne(() => Usuario, { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'idUsuario' })
  usuario?: Usuario;

  @Column({ type: 'uuid', nullable: true })
  idUsuario?: string;

  static get nomeAmigavel(): string {
    return 'Histórico de Ocorrência';
  }
}
