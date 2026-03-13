import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vistoria } from './vistoria.entity';
import { AreaVistoriada } from './area-vistoriada.entity';
import { Componente } from './componente.entity';
import { Sintoma } from './sintoma.entity';
import { IrregularidadeMidia } from './irregularidade-midia.entity';

@Entity('irregularidades')
@Index('IDX_IRREGULARIDADE_VISTORIA', ['idVistoria'])
export class Irregularidade extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Irregularidade';
  }

  @ApiProperty({ description: 'Vistoria vinculada', type: () => Vistoria })
  @ManyToOne(() => Vistoria, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idvistoria' })
  vistoria: Vistoria;

  @ApiProperty({ description: 'ID da vistoria', format: 'uuid' })
  @Column({ name: 'idvistoria', type: 'uuid' })
  idVistoria: string;

  @ApiProperty({ description: 'Área vinculada', type: () => AreaVistoriada })
  @ManyToOne(() => AreaVistoriada, { nullable: false })
  @JoinColumn({ name: 'idarea' })
  area: AreaVistoriada;

  @ApiProperty({ description: 'ID da área', format: 'uuid' })
  @Column({ name: 'idarea', type: 'uuid' })
  idArea: string;

  @ApiProperty({ description: 'Componente vinculado', type: () => Componente })
  @ManyToOne(() => Componente, { nullable: false })
  @JoinColumn({ name: 'idcomponente' })
  componente: Componente;

  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @Column({ name: 'idcomponente', type: 'uuid' })
  idComponente: string;

  @ApiProperty({ description: 'Sintoma vinculado', type: () => Sintoma })
  @ManyToOne(() => Sintoma, { nullable: false })
  @JoinColumn({ name: 'idsintoma' })
  sintoma: Sintoma;

  @ApiProperty({ description: 'ID do sintoma', format: 'uuid' })
  @Column({ name: 'idsintoma', type: 'uuid' })
  idSintoma: string;

  @ApiProperty({ description: 'Observação', required: false })
  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao?: string;

  @ApiProperty({ description: 'Irregularidade resolvida', default: false })
  @Column({ name: 'resolvido', type: 'boolean', default: false })
  resolvido: boolean;

  @ApiProperty({ description: 'Mídias vinculadas (imagens e áudios)', type: () => [IrregularidadeMidia] })
  @OneToMany(() => IrregularidadeMidia, (midia) => midia.irregularidade, {
    cascade: true,
  })
  midias?: IrregularidadeMidia[];
}
