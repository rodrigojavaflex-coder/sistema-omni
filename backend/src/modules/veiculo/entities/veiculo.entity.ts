import { Entity, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Combustivel } from '../../../common/enums/combustivel.enum';

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

  @ApiProperty({ description: 'Número do chassi', example: '9BWZZZ377VT004251' })
  @Column({ length: 30 })
  chassi: string;

  @ApiProperty({ description: 'Marca do veículo', example: 'Volkswagen' })
  @Column({ length: 50 })
  marca: string;

  @ApiProperty({ description: 'Modelo do veículo', example: 'Delivery' })
  @Column({ length: 50 })
  modelo: string;

  @ApiProperty({ description: 'Tipo de combustível', enum: Combustivel })
  @Column({ length: 30 })
  combustivel: Combustivel;
}
