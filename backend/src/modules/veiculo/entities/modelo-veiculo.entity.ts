import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from './veiculo.entity';

@Entity('modelos_veiculo')
@Index('IDX_MODELO_VEICULO_NOME', ['nome'], { unique: true })
export class ModeloVeiculo extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Modelo de Veículo';
  }

  @ApiProperty({ description: 'Nome do modelo', maxLength: 80 })
  @Column({ name: 'nome', length: 80, unique: true })
  nome: string;

  @ApiProperty({ description: 'Modelo ativo', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @OneToMany(() => Veiculo, (veiculo) => veiculo.modeloVeiculo)
  veiculos?: Veiculo[];
}
