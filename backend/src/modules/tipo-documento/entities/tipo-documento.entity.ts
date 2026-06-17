import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('tipos_documento')
@Index(['nome'], { unique: true })
export class TipoDocumento extends BaseEntity {
  @ApiProperty({ description: 'Nome do tipo de documento', example: 'POP' })
  @Column({ type: 'varchar', length: 150, nullable: false })
  nome: string;

  @ApiProperty({ description: 'Descrição opcional do tipo' })
  @Column({ type: 'text', nullable: true })
  descricao?: string | null;

  @ApiProperty({ description: 'Indica se o tipo está ativo', default: true })
  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  static override get nomeAmigavel(): string {
    return 'Tipo de Documento';
  }
}
