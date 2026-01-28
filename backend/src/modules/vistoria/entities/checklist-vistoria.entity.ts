import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vistoria } from './vistoria.entity';
import { ItemVistoriado } from './item-vistoriado.entity';
import { ImagensVistoria } from './imagens-vistoria.entity';

@Entity('checklistsvistoria')
export class ChecklistVistoria extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Checklist de Vistoria';
  }

  @ApiProperty({ description: 'Vistoria vinculada' })
  @ManyToOne(() => Vistoria, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idvistoria' })
  vistoria: Vistoria;

  @ApiProperty({ description: 'ID da vistoria', format: 'uuid' })
  @Column({ name: 'idvistoria', type: 'uuid' })
  idVistoria: string;

  @ApiProperty({ description: 'Item vistoriado vinculado' })
  @ManyToOne(() => ItemVistoriado, { nullable: false })
  @JoinColumn({ name: 'iditemvistoriado' })
  itemVistoriado: ItemVistoriado;

  @ApiProperty({ description: 'ID do item vistoriado', format: 'uuid' })
  @Column({ name: 'iditemvistoriado', type: 'uuid' })
  idItemVistoriado: string;

  @ApiProperty({ description: 'Item conforme', default: true })
  @Column({ name: 'conforme', type: 'boolean', default: true })
  conforme: boolean;

  @ApiProperty({ description: 'Observação do item', required: false })
  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao?: string;

  @ApiProperty({ description: 'Imagens vinculadas', type: () => [ImagensVistoria] })
  @OneToMany(() => ImagensVistoria, (imagem) => imagem.checklist, {
    cascade: true,
  })
  imagens?: ImagensVistoria[];
}
