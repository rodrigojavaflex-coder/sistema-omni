import { Column, Entity, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AreaModelo } from './area-modelo.entity';
import { AreaComponente } from './area-componente.entity';

@Entity('areas_vistoriadas')
@Index('IDX_AREA_VISTORIADA_NOME', ['nome'])
export class AreaVistoriada extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Área Vistoriada';
  }

  @ApiProperty({ description: 'Nome da área', maxLength: 100 })
  @Column({ name: 'nome', length: 100 })
  nome: string;

  @ApiProperty({ description: 'Ordem visual', example: 1 })
  @Column({ name: 'ordem_visual', type: 'integer', default: 0 })
  ordemVisual: number;

  @ApiProperty({ description: 'Área ativa', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @ApiProperty({
    description: 'Modelos vinculados à área',
    type: () => AreaModelo,
    isArray: true,
    required: false,
  })
  @OneToMany(() => AreaModelo, (modelo) => modelo.area, { cascade: true })
  modelos?: AreaModelo[];

  @ApiProperty({
    description: 'Componentes vinculados à área',
    type: () => AreaComponente,
    isArray: true,
    required: false,
  })
  @OneToMany(() => AreaComponente, (areaComponente) => areaComponente.area, {
    cascade: true,
  })
  componentes?: AreaComponente[];
}
