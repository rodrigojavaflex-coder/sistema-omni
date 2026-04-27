import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('empresasterceiras')
@Index('IDX_EMPRESATERCIRA_DESCRICAO', ['descricao'], { unique: true })
export class EmpresaTerceira extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  descricao: string;

  @Column({
    name: 'eh_empresa_manutencao',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  ehEmpresaManutencao: boolean;

  @Column({ name: 'emails_relatorio', type: 'text', nullable: true })
  emailsRelatorio?: string;

  static get nomeAmigavel(): string {
    return 'Empresa Terceira';
  }
}
