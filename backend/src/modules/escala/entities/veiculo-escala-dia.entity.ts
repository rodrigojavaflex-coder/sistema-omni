import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Veiculo } from '../../veiculo/entities/veiculo.entity';

export interface EscalaLinhaMotoristaJson {
  matricula?: string | number | null;
  motorista?: string | null;
  km?: number | null;
}

export interface EscalaLinhaJson {
  linha?: string | null;
  km?: number | null;
  motoristas?: EscalaLinhaMotoristaJson[];
}

@Entity('veiculo_escala_dia')
@Index('UQ_veiculo_escala_dia_data_prefixo', ['data', 'prefixo'], {
  unique: true,
})
@Index('IDX_veiculo_escala_dia_data', ['data'])
@Index('IDX_veiculo_escala_dia_veiculo', ['idVeiculo'])
export class VeiculoEscalaDia extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'escala do dia';
  }

  @ApiProperty({ description: 'Data da escala (YYYY-MM-DD)' })
  @Column({ name: 'data', type: 'date' })
  data: string;

  @ApiProperty({ description: 'Prefixo do veículo na INFOBUS' })
  @Column({ name: 'prefixo', length: 30 })
  prefixo: string;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'id_veiculo', type: 'uuid', nullable: true })
  idVeiculo?: string | null;

  @ManyToOne(() => Veiculo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_veiculo' })
  veiculo?: Veiculo | null;

  @ApiProperty({ description: 'KM previsto da escala' })
  @Column({
    name: 'km_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined || v === '' ? 0 : Number(v),
    },
  })
  kmTotal: number;

  @ApiProperty({ required: false })
  @Column({ name: 'linhas_json', type: 'jsonb', nullable: true })
  linhasJson?: EscalaLinhaJson[] | null;

  @ApiProperty()
  @Column({
    name: 'sincronizado_em',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sincronizadoEm: Date;
}
