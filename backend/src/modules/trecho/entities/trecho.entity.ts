import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('trechos')
export class Trecho extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    unique: true,
  })
  descricao: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: true,
  })
  area: any;

  static get nomeAmigavel(): string {
    return 'Trecho';
  }
}
