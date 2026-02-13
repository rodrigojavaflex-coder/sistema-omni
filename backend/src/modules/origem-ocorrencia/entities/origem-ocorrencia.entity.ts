import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('origensocorrencia')
@Index('IDX_ORIGEMOCORRENCIA_DESCRICAO', ['descricao'], { unique: true })
export class OrigemOcorrencia extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  descricao: string;

  static get nomeAmigavel(): string {
    return 'Origem da Ocorrência';
  }
}
