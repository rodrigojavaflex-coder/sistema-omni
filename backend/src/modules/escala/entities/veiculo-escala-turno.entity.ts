import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VeiculoEscalaDia } from './veiculo-escala-dia.entity';

@Entity('veiculo_escala_turno')
@Index('IDX_veiculo_escala_turno_escala_dia', ['idEscalaDia'])
export class VeiculoEscalaTurno extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'turno da escala';
  }

  @ApiProperty()
  @Column({ name: 'id_escala_dia', type: 'uuid' })
  idEscalaDia: string;

  @ManyToOne(() => VeiculoEscalaDia, (e) => e.turnos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_escala_dia' })
  escalaDia?: VeiculoEscalaDia;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'grupo', type: 'varchar', length: 255, nullable: true })
  grupo?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'alocacao', type: 'varchar', length: 255, nullable: true })
  alocacao?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'tarefa', type: 'varchar', length: 80, nullable: true })
  tarefa?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'tipo_viagem', type: 'varchar', length: 40, nullable: true })
  tipoViagem?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'km',
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
  km?: number | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'matricula', type: 'varchar', length: 40, nullable: true })
  matricula?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'motorista', type: 'varchar', length: 255, nullable: true })
  motorista?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({ name: 'nome_turno', type: 'varchar', length: 80, nullable: true })
  nomeTurno?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'numero_viagem',
    type: 'varchar',
    length: 80,
    nullable: true,
  })
  numeroViagem?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'horario_inicio',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  horarioInicio?: string | null;

  @ApiProperty({ required: false, nullable: true })
  @Column({
    name: 'horario_fim',
    type: 'varchar',
    length: 16,
    nullable: true,
  })
  horarioFim?: string | null;

  @ApiProperty()
  @Column({ name: 'ordem', type: 'integer', default: 0 })
  ordem: number;
}
