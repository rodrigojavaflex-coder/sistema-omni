import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Combustivel } from '../../../common/enums/combustivel.enum';
import { StatusVeiculo } from '../../../common/enums/status-veiculo.enum';
import { ModeloVeiculo } from './modelo-veiculo.entity';

@Entity('veiculos')
@Index('IDX_VEICULO_DESCRICAO', ['descricao'], { unique: true })
@Index('IDX_VEICULO_PLACA', ['placa'], { unique: true })
export class Veiculo extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'veículo';
  }

  @ApiProperty({ description: 'Descrição do veículo', example: 'Caminhão 3/4' })
  @Column({ length: 30, unique: true })
  descricao: string;

  @ApiProperty({ description: 'Placa do veículo', example: 'ABC1D23' })
  @Column({ length: 10, unique: true })
  placa: string;

  @ApiProperty({ description: 'Ano do veículo', example: 2020 })
  @Column('int')
  ano: number;

  @ApiProperty({
    description: 'Número do chassi',
    example: '9BWZZZ377VT004251',
  })
  @Column({ length: 30 })
  chassi: string;

  @ApiProperty({ description: 'Marca do veículo', example: 'Volkswagen' })
  @Column({ length: 50 })
  marca: string;

  @ApiProperty({ description: 'Modelo do veículo (legado)', example: 'Delivery' })
  @Column({ name: 'modelo', type: 'varchar', length: 50, nullable: true })
  modeloLegado: string | null;

  @ApiProperty({ description: 'Modelo vinculado' })
  @ManyToOne(() => ModeloVeiculo, { nullable: true, eager: true })
  @JoinColumn({ name: 'idmodelo' })
  modeloVeiculo: ModeloVeiculo;

  @ApiProperty({ description: 'ID do modelo', format: 'uuid' })
  @Column({ name: 'idmodelo', type: 'uuid', nullable: true })
  idModelo: string | null;

  @ApiProperty({ description: 'Tipo de combustível', enum: Combustivel })
  @Column({ length: 30 })
  combustivel: Combustivel;

  @ApiProperty({
    description: 'Status do veículo',
    enum: StatusVeiculo,
    default: StatusVeiculo.ATIVO,
  })
  @Column({ length: 20, default: StatusVeiculo.ATIVO })
  status: StatusVeiculo;

  @ApiProperty({ description: 'Marca da carroceria', example: 'Marcopolo' })
  @Column({ length: 50, nullable: true })
  marcaDaCarroceria: string;

  @ApiProperty({ description: 'Modelo da carroceria', example: 'Volare' })
  @Column({ length: 50, nullable: true })
  modeloDaCarroceria: string;
}
