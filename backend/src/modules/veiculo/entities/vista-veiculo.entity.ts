import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ModeloVeiculoVista } from './modelo-veiculo-vista.entity';

@Entity('vistas_veiculo')
@Index('IDX_VISTA_VEICULO_DESCRICAO', ['descricao'])
export class VistaVeiculo extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Vista do veículo';
  }

  @ApiProperty({ description: 'Descrição da vista / parte', maxLength: 80 })
  @Column({ name: 'descricao', length: 80 })
  descricao: string;

  @ApiProperty({ description: 'Vista ativa', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @ApiProperty({ description: 'Ordem visual', example: 0 })
  @Column({ name: 'ordem', type: 'integer', default: 0 })
  ordem: number;

  @OneToMany(() => ModeloVeiculoVista, (vista) => vista.catalogo)
  modelos?: ModeloVeiculoVista[];
}
