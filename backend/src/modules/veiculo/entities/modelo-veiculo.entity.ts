import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from './veiculo.entity';
import { ModeloVeiculoVista } from './modelo-veiculo-vista.entity';

@Entity('modelos_veiculo')
@Index('IDX_MODELO_VEICULO_NOME', ['nome'], { unique: true })
export class ModeloVeiculo extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Modelo de Veículo';
  }

  @ApiProperty({ description: 'Nome do modelo', maxLength: 80 })
  @Column({ name: 'nome', length: 80, unique: true })
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada do modelo',
    required: false,
    nullable: true,
  })
  @Column({ name: 'descricao_detalhada', type: 'text', nullable: true })
  descricaoDetalhada?: string | null;

  @ApiProperty({ description: 'Modelo ativo', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @ApiProperty({
    description: 'Km por 1% de bateria/GNV (elétrico e GNV)',
    required: false,
    nullable: true,
  })
  @Column({
    name: 'km_por_percentual',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value,
      from: (value?: string | null) =>
        value === null || value === undefined || value === ''
          ? null
          : Number(value),
    },
  })
  kmPorPercentual?: number | null;

  @ApiProperty({
    description: 'Km por litro (Diesel)',
    required: false,
    nullable: true,
  })
  @Column({
    name: 'km_por_litro',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value,
      from: (value?: string | null) =>
        value === null || value === undefined || value === ''
          ? null
          : Number(value),
    },
  })
  kmPorLitro?: number | null;

  @OneToMany(() => Veiculo, (veiculo) => veiculo.modeloVeiculo)
  veiculos?: Veiculo[];

  @ApiProperty({
    description: 'Vistas (desenhos) já gravadas no modelo',
    type: () => [ModeloVeiculoVista],
    required: false,
  })
  @OneToMany(() => ModeloVeiculoVista, (vista) => vista.modelo)
  vistas?: ModeloVeiculoVista[];
}
