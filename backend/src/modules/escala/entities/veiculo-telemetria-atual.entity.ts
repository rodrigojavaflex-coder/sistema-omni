import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from '../../veiculo/entities/veiculo.entity';

@Entity('veiculo_telemetria_atual')
@Index('UQ_veiculo_telemetria_prefixo', ['prefixo'], { unique: true })
@Index('IDX_veiculo_telemetria_veiculo', ['idVeiculo'])
export class VeiculoTelemetriaAtual extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'telemetria do veículo';
  }

  @ApiProperty()
  @Column({ name: 'prefixo', length: 30 })
  prefixo: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'id_veiculo', type: 'uuid', nullable: true })
  idVeiculo?: string | null;

  @ManyToOne(() => Veiculo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_veiculo' })
  veiculo?: Veiculo | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'veiculo_id_brt', type: 'int', nullable: true })
  veiculoIdBrt?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'data_hora', type: 'timestamp', nullable: true })
  dataHora?: Date | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'latitude',
    type: 'numeric',
    precision: 12,
    scale: 8,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined || v === '' ? null : Number(v),
    },
  })
  latitude?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'longitude',
    type: 'numeric',
    precision: 12,
    scale: 8,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined || v === '' ? null : Number(v),
    },
  })
  longitude?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'bateria',
    type: 'numeric',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined || v === '' ? null : Number(v),
    },
  })
  bateria?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'autonomia',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined || v === '' ? null : Number(v),
    },
  })
  autonomia?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'odometro',
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined || v === '' ? null : Number(v),
    },
  })
  odometro?: number | null;

  @ApiProperty()
  @Column({
    name: 'sincronizado_em',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sincronizadoEm: Date;
}
