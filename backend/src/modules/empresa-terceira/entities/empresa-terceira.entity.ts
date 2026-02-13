import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('empresasterceiras')
@Index('IDX_EMPRESATERCIRA_DESCRICAO', ['descricao'], { unique: true })
export class EmpresaTerceira extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  descricao: string;

  static get nomeAmigavel(): string {
    return 'Empresa Terceira';
  }
}
