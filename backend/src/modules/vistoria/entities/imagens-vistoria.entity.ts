import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ChecklistVistoria } from './checklist-vistoria.entity';

@Entity('imagensvistoria')
export class ImagensVistoria extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Imagem da Vistoria';
  }

  @ApiProperty({ description: 'Nome do arquivo' })
  @Column({ name: 'nome_arquivo', length: 255 })
  nomeArquivo: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  @Column({ name: 'tamanho', type: 'bigint' })
  tamanho: number;

  @ApiProperty({ description: 'Conteúdo do arquivo' })
  @Column({ name: 'dados_bytea', type: 'bytea' })
  dadosBytea: Buffer;

  @ApiProperty({ description: 'Checklist vinculado', type: () => ChecklistVistoria })
  @ManyToOne(() => ChecklistVistoria, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idchecklistvistoria' })
  checklist: ChecklistVistoria;

  @ApiProperty({ description: 'ID do checklist', format: 'uuid' })
  @Column({ name: 'idchecklistvistoria', type: 'uuid' })
  idChecklistVistoria: string;
}
