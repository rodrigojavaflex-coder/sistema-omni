import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from '../../veiculo/entities/veiculo.entity';
import { Motorista } from '../../motorista/entities/motorista.entity';
import { TipoVistoria } from './tipo-vistoria.entity';
import { StatusVistoria } from '../../../common/enums/status-vistoria.enum';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('vistorias')
@Index('IDX_VISTORIA_DATA', ['datavistoria'])
export class Vistoria extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Vistoria';
  }

  @ApiProperty({ description: 'Veículo vinculado' })
  @ManyToOne(() => Veiculo, { nullable: false, eager: true })
  @JoinColumn({ name: 'idveiculo' })
  veiculo: Veiculo;

  @ApiProperty({ description: 'ID do veículo', format: 'uuid' })
  @Column({ name: 'idveiculo', type: 'uuid' })
  idVeiculo: string;

  @ApiProperty({ description: 'Motorista vinculado' })
  @ManyToOne(() => Motorista, { nullable: false, eager: true })
  @JoinColumn({ name: 'idmotorista' })
  motorista: Motorista;

  @ApiProperty({ description: 'ID do motorista', format: 'uuid' })
  @Column({ name: 'idmotorista', type: 'uuid' })
  idMotorista: string;

  @ApiProperty({ description: 'Tipo de vistoria vinculado' })
  @ManyToOne(() => TipoVistoria, { nullable: false, eager: true })
  @JoinColumn({ name: 'idtipovistoria' })
  tipoVistoria: TipoVistoria;

  @ApiProperty({ description: 'ID do tipo de vistoria', format: 'uuid' })
  @Column({ name: 'idtipovistoria', type: 'uuid' })
  idTipoVistoria: string;

  @ApiProperty({ description: 'Usuário vinculado' })
  @ManyToOne(() => Usuario, { nullable: false, eager: false })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ApiProperty({ description: 'ID do usuário', format: 'uuid' })
  @Column({ name: 'idusuario', type: 'uuid' })
  idUsuario: string;

  @ApiProperty({ description: 'Odômetro informado', example: 12345.6 })
  @Column({
    name: 'odometro',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  odometro: number;

  @ApiProperty({ description: 'Percentual de bateria', example: 85 })
  @Column({
    name: 'porcentagembateria',
    type: 'numeric',
    precision: 5,
    scale: 2,
  })
  porcentagembateria: number;

  @ApiProperty({ description: 'Data/hora da vistoria' })
  @Column({ name: 'datavistoria', type: 'timestamp' })
  datavistoria: Date;

  @ApiProperty({ description: 'Tempo total da vistoria (minutos)' })
  @Column({ name: 'tempo', type: 'integer' })
  tempo: number;

  @ApiProperty({ description: 'Observação geral da vistoria', required: false })
  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao?: string;

  @ApiProperty({
    description: 'Status da vistoria',
    enum: StatusVistoria,
    default: StatusVistoria.EM_ANDAMENTO,
  })
  @Column({
    name: 'status',
    type: 'enum',
    enum: StatusVistoria,
    default: StatusVistoria.EM_ANDAMENTO,
  })
  status: StatusVistoria;
}
