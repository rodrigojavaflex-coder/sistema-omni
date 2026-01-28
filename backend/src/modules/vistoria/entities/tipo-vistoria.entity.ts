import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tiposvistoria')
@Index('IDX_TIPOVISTORIA_DESCRICAO', ['descricao'], { unique: true })
export class TipoVistoria extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Tipo de Vistoria';
  }

  @ApiProperty({ description: 'Descrição do tipo de vistoria' })
  @Column({ name: 'descricao', length: 300 })
  descricao: string;

  @ApiProperty({ description: 'Tipo de vistoria ativo', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;
}
