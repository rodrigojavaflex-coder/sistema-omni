import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from '../../veiculo/entities/veiculo.entity';
import { Motorista } from '../../motorista/entities/motorista.entity';
import { StatusVistoria } from '../../../common/enums/status-vistoria.enum';
import { StatusErpVistoria } from '../../../common/enums/status-erp-vistoria.enum';
import { OrigemVistoria } from '../../../common/enums/origem-vistoria.enum';
import { TipoVistoria } from '../../../common/enums/tipo-vistoria.enum';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Irregularidade } from './irregularidade.entity';

@Entity('vistorias')
@Index('IDX_VISTORIA_DATA', ['datavistoria'])
@Index('IDX_VISTORIA_TIPO', ['tipo'])
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

  @ApiProperty({ description: 'Usuário vinculado' })
  @ManyToOne(() => Usuario, { nullable: false, eager: false })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ApiProperty({ description: 'ID do usuário', format: 'uuid' })
  @Column({ name: 'idusuario', type: 'uuid' })
  idUsuario: string;

  @OneToMany(() => Irregularidade, (irregularidade) => irregularidade.vistoria)
  irregularidades?: Irregularidade[];

  @ApiProperty({ description: 'Odômetro informado', example: 12345.6 })
  @Column({
    name: 'odometro',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  odometro: number;

  @ApiProperty({
    description: 'Percentual de bateria ou GNV (0–100)',
    example: 85,
  })
  @Column({
    name: 'porcentagembateria',
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  porcentagembateria: number | null;

  @ApiProperty({
    description: 'Número único da vistoria (ano + sequencial, ex: 2026001)',
  })
  @Column({ name: 'numero_vistoria', type: 'integer' })
  numeroVistoria: number;

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

  @ApiProperty({
    description: 'Origem da vistoria (null = mobile)',
    enum: OrigemVistoria,
    required: false,
  })
  @Column({ name: 'origem', type: 'varchar', length: 20, nullable: true })
  origem?: OrigemVistoria | null;

  @ApiProperty({
    description: 'Tipo da vistoria',
    enum: TipoVistoria,
    default: TipoVistoria.CORRETIVA,
  })
  @Column({
    name: 'tipo',
    type: 'varchar',
    length: 20,
    default: TipoVistoria.CORRETIVA,
  })
  tipo: TipoVistoria;

  @ApiProperty({
    description: 'Status da integração ERP da capa',
    enum: StatusErpVistoria,
    default: StatusErpVistoria.NAO_APLICA,
  })
  @Column({
    name: 'erp_status',
    type: 'varchar',
    length: 20,
    default: StatusErpVistoria.NAO_APLICA,
  })
  erpStatus: StatusErpVistoria;

  @ApiProperty({
    description: 'Número da vistoria devolvido pelo ERP (codigo_pedido)',
    required: false,
  })
  @Column({ name: 'erp_numero_vistoria', type: 'varchar', length: 50, nullable: true })
  erpNumeroVistoria?: string | null;

  @ApiProperty({ description: 'Data/hora do último envio com sucesso', required: false })
  @Column({ name: 'erp_enviado_em', type: 'timestamp', nullable: true })
  erpEnviadoEm?: Date | null;

  @ApiProperty({ description: 'Último erro funcional do envio ERP', required: false })
  @Column({ name: 'erp_ultimo_erro', type: 'text', nullable: true })
  erpUltimoErro?: string | null;

  @ApiProperty({
    description: 'Elegível para envio/reenvio ao ERP (não persistido)',
    required: false,
  })
  erpElegivel?: boolean;
}
