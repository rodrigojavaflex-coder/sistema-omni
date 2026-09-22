import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Irregularidade } from './irregularidade.entity';
import { ModeloVeiculoVista } from '../../veiculo/entities/modelo-veiculo-vista.entity';

@Entity('irregularidades_marcacoes')
export class IrregularidadeMarcacao extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'marcação de irregularidade';
  }

  @ManyToOne(() => Irregularidade, (i) => i.marcacoes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_irregularidade' })
  irregularidade?: Irregularidade;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'id_irregularidade', type: 'uuid' })
  idIrregularidade: string;

  @ManyToOne(() => ModeloVeiculoVista, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_vista' })
  vista?: ModeloVeiculoVista;

  @ApiProperty({ format: 'uuid' })
  @Column({ name: 'id_vista', type: 'uuid' })
  idVista: string;

  @ApiProperty({ description: 'Posição X percentual (0-100)' })
  @Column({
    name: 'pos_x_pct',
    type: 'numeric',
    precision: 6,
    scale: 3,
    transformer: {
      to: (value?: number | null) => value,
      from: (value: string | number | null) =>
        value === null || value === undefined ? null : Number(value),
    },
  })
  posXPct: number;

  @ApiProperty({ description: 'Posição Y percentual (0-100)' })
  @Column({
    name: 'pos_y_pct',
    type: 'numeric',
    precision: 6,
    scale: 3,
    transformer: {
      to: (value?: number | null) => value,
      from: (value: string | number | null) =>
        value === null || value === undefined ? null : Number(value),
    },
  })
  posYPct: number;

  @ApiProperty({ description: 'Ordem do ponto na vista (0-based)' })
  @Column({ name: 'ordem', type: 'smallint', default: 0 })
  ordem: number;
}
