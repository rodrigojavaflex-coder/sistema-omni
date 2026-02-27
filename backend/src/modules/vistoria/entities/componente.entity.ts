import { Column, Entity, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AreaComponente } from './area-componente.entity';
import { MatrizCriticidade } from './matriz-criticidade.entity';

@Entity('componentes')
@Index('IDX_COMPONENTE_NOME', ['nome'])
export class Componente extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Componente';
  }

  @ApiProperty({ description: 'Nome do componente', maxLength: 100 })
  @Column({ name: 'nome', length: 100 })
  nome: string;

  @ApiProperty({ description: 'Componente ativo', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;

  @OneToMany(() => AreaComponente, (areaComponente) => areaComponente.componente)
  areas?: AreaComponente[];

  @OneToMany(() => MatrizCriticidade, (matriz) => matriz.componente)
  matriz?: MatrizCriticidade[];
}
