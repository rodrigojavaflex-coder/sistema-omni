import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('departamentos')
@Index(['nomeDepartamento'], { unique: true })
export class Departamento extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  nomeDepartamento: string;

  static override get nomeAmigavel(): string {
    return 'Departamento';
  }
}
