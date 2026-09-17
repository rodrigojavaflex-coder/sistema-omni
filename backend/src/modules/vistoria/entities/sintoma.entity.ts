import { Column, Entity, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MatrizCriticidade } from './matriz-criticidade.entity';
import { SintomaModeloResumoDto } from '../dto/sintoma-modelo.dto';

@Entity('sintomas')
@Index('IDX_SINTOMA_DESCRICAO', ['descricao'])
export class Sintoma extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Sintoma';
  }

  @ApiProperty({ description: 'Descrição do sintoma', maxLength: 150 })
  @Column({ name: 'descricao', length: 150 })
  descricao: string;

  @ApiProperty({ description: 'Sintoma ativo', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @ApiProperty({
    description: 'Exige marcação no mapa do veículo em qualquer componente',
    default: false,
  })
  @Column({ name: 'exige_marcacao_mapa', type: 'boolean', default: false })
  exigeMarcacaoMapa: boolean;

  @ApiProperty({
    description: 'Modelos de veículo e vistas (informativo, não persistido no sintoma)',
    type: () => [SintomaModeloResumoDto],
    required: false,
  })
  modelos?: SintomaModeloResumoDto[];

  @OneToMany(() => MatrizCriticidade, (matriz) => matriz.sintoma)
  matriz?: MatrizCriticidade[];
}
