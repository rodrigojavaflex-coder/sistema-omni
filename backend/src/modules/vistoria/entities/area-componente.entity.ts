import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AreaVistoriada } from './area-vistoriada.entity';
import { Componente } from './componente.entity';

@Entity('areas_componentes')
@Index('IDX_AREA_COMPONENTE_AREA', ['idArea'])
@Index('IDX_AREA_COMPONENTE_COMPONENTE', ['idComponente'])
export class AreaComponente extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Componente da Área';
  }

  @ApiProperty({ description: 'Área vinculada', type: () => AreaVistoriada })
  @ManyToOne(() => AreaVistoriada, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idarea' })
  area: AreaVistoriada;

  @ApiProperty({ description: 'ID da área', format: 'uuid' })
  @Column({ name: 'idarea', type: 'uuid' })
  idArea: string;

  @ApiProperty({ description: 'Componente vinculado', type: () => Componente })
  @ManyToOne(() => Componente, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idcomponente' })
  componente: Componente;

  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @Column({ name: 'idcomponente', type: 'uuid' })
  idComponente: string;

  @ApiProperty({ description: 'Ordem visual', example: 1 })
  @Column({ name: 'ordem_visual', type: 'integer', default: 0 })
  ordemVisual: number;
}
