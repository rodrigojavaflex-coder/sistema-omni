import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ModeloVeiculo } from './modelo-veiculo.entity';
import { VistaVeiculo } from './vista-veiculo.entity';

@Entity('modelo_veiculo_vistas')
@Index('IDX_MODELO_VEICULO_VISTA_MODELO', ['idModelo'])
@Index('UQ_MODELO_VEICULO_VISTA_CATALOGO', ['idModelo', 'idCatalogo'], {
  unique: true,
})
export class ModeloVeiculoVista extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Vista do modelo de veículo';
  }

  @ManyToOne(() => ModeloVeiculo, (modelo) => modelo.vistas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'idmodelo' })
  modelo: ModeloVeiculo;

  @ApiProperty({ description: 'ID do modelo', format: 'uuid' })
  @Column({ name: 'idmodelo', type: 'uuid' })
  idModelo: string;

  @ManyToOne(() => VistaVeiculo, (catalogo) => catalogo.modelos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_catalogo' })
  catalogo: VistaVeiculo;

  @ApiProperty({ description: 'ID da vista no catálogo', format: 'uuid' })
  @Column({ name: 'id_catalogo', type: 'uuid' })
  idCatalogo: string;

  @ApiProperty({ description: 'Descrição copiada do catálogo', maxLength: 80 })
  @Column({ name: 'descricao', length: 80 })
  descricao: string;

  @ApiProperty({ description: 'Ordem visual', example: 0 })
  @Column({ name: 'ordem', type: 'integer', default: 0 })
  ordem: number;

  @ApiProperty({ description: 'Mime type' })
  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @ApiProperty({ description: 'Nome do arquivo' })
  @Column({ name: 'nome_arquivo', length: 255 })
  nomeArquivo: string;

  @ApiProperty({ description: 'Tamanho em bytes' })
  @Column({ name: 'tamanho', type: 'bigint' })
  tamanho: number;

  @Column({ name: 'dados_bytea', type: 'bytea', select: false })
  dadosBytea: Buffer;

  @ApiProperty({ description: 'Vista ativa', default: true })
  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;
}
