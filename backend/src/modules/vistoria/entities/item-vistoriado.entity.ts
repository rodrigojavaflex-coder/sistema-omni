import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('itensvistoriados')
@Index('IDX_ITEMVISTORIADO_SEQUENCIA', ['sequencia'])
@Index('IDX_ITEMVISTORIADO_TIPOSVISTORIAS', ['tiposVistorias'])
export class ItemVistoriado extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Item Vistoriado';
  }

  @ApiProperty({ description: 'Descrição do item', maxLength: 300 })
  @Column({ name: 'descricao', length: 300 })
  descricao: string;

  @ApiProperty({ description: 'Sequência do item no checklist' })
  @Column({ name: 'sequencia', type: 'integer' })
  sequencia: number;

  @ApiProperty({
    description: 'Tipos de vistoria vinculados ao item',
    type: [String],
  })
  @Column('uuid', { name: 'tiposvistorias', array: true })
  tiposVistorias: string[];

  @ApiProperty({ description: 'Foto obrigatória quando não conforme', default: false })
  @Column({ name: 'obrigafoto', type: 'boolean', default: false })
  obrigafoto: boolean;

  @ApiProperty({ description: 'Item ativo', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;
}
