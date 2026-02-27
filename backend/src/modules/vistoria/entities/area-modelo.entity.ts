import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AreaVistoriada } from './area-vistoriada.entity';
import { ModeloVeiculo } from '../../veiculo/entities/modelo-veiculo.entity';

@Entity('areas_modelos')
@Index('IDX_AREA_MODELO_AREA', ['idArea'])
@Index('IDX_AREA_MODELO_MODELO', ['idModelo'])
export class AreaModelo extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Modelo da Área Vistoriada';
  }

  @ApiProperty({ description: 'Área vinculada', type: () => AreaVistoriada })
  @ManyToOne(() => AreaVistoriada, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idarea' })
  area: AreaVistoriada;

  @ApiProperty({ description: 'ID da área', format: 'uuid' })
  @Column({ name: 'idarea', type: 'uuid' })
  idArea: string;

  @ApiProperty({ description: 'Modelo vinculado', type: () => ModeloVeiculo })
  @ManyToOne(() => ModeloVeiculo, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idmodelo' })
  modelo: ModeloVeiculo;

  @ApiProperty({ description: 'ID do modelo', format: 'uuid' })
  @Column({ name: 'idmodelo', type: 'uuid' })
  idModelo: string;
}
