import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { OrigemOcorrencia } from '../../origem-ocorrencia/entities/origem-ocorrencia.entity';

@Entity('categoriasocorrencia')
@Index('IDX_CATEGORIAOCORRENCIA_ORIGEM', ['idOrigem'])
export class CategoriaOcorrencia extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  descricao: string;

  @ManyToOne(() => OrigemOcorrencia, { nullable: false, eager: false })
  @JoinColumn({ name: 'idOrigem' })
  origem: OrigemOcorrencia;

  @Column({ type: 'uuid', nullable: false })
  idOrigem: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  responsavel: string | null;

  static get nomeAmigavel(): string {
    return 'Categoria da Ocorrência';
  }
}
