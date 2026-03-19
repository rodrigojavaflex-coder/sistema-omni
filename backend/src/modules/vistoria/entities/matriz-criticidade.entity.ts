import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Componente } from './componente.entity';
import { Sintoma } from './sintoma.entity';
import { GravidadeCriticidade } from '../../../common/enums/gravidade-criticidade.enum';

@Entity('matriz_criticidade')
@Index('IDX_MATRIZ_COMPONENTE', ['idComponente'])
@Index('IDX_MATRIZ_SINTOMA', ['idSintoma'])
export class MatrizCriticidade extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Matriz de Criticidade';
  }

  @ApiProperty({ description: 'Componente vinculado', type: () => Componente })
  @ManyToOne(() => Componente, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idcomponente' })
  componente: Componente;

  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @Column({ name: 'idcomponente', type: 'uuid' })
  idComponente: string;

  @ApiProperty({ description: 'Sintoma vinculado', type: () => Sintoma })
  @ManyToOne(() => Sintoma, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idsintoma' })
  sintoma: Sintoma;

  @ApiProperty({ description: 'ID do sintoma', format: 'uuid' })
  @Column({ name: 'idsintoma', type: 'uuid' })
  idSintoma: string;

  @ApiProperty({ description: 'Gravidade', enum: GravidadeCriticidade })
  @Column({
    name: 'gravidade',
    type: 'enum',
    enum: GravidadeCriticidade,
  })
  gravidade: GravidadeCriticidade;

  @ApiProperty({ description: 'Exige foto', default: false })
  @Column({ name: 'exige_foto', type: 'boolean', default: false })
  exigeFoto: boolean;

  @ApiProperty({ description: 'Permite áudio', default: false })
  @Column({ name: 'permite_audio', type: 'boolean', default: false })
  permiteAudio: boolean;
}
