import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Irregularidade } from './irregularidade.entity';

export type TipoMidia = 'imagem' | 'audio';

@Entity('irregularidades_midias')
@Index('IDX_IRREGULARIDADE_MIDIA_IRREG', ['idIrregularidade'])
export class IrregularidadeMidia extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Mídia da Irregularidade';
  }

  @ApiProperty({ description: 'Tipo da mídia', enum: ['imagem', 'audio'] })
  @Column({ name: 'tipo', type: 'varchar', length: 20 })
  tipo: TipoMidia;

  @ApiProperty({ description: 'Nome do arquivo' })
  @Column({ name: 'nome_arquivo', length: 255 })
  nomeArquivo: string;

  @ApiProperty({ description: 'Mime type' })
  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @ApiProperty({ description: 'Tamanho em bytes' })
  @Column({ name: 'tamanho', type: 'bigint' })
  tamanho: number;

  @ApiProperty({ description: 'Conteúdo do arquivo' })
  @Column({ name: 'dados_bytea', type: 'bytea' })
  dadosBytea: Buffer;

  @ApiProperty({ description: 'Duração em ms (apenas para áudio)', required: false })
  @Column({ name: 'duracao_ms', type: 'integer', nullable: true })
  duracaoMs?: number | null;

  @ApiProperty({ description: 'Irregularidade vinculada', type: () => Irregularidade })
  @ManyToOne(() => Irregularidade, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idirregularidade' })
  irregularidade: Irregularidade;

  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  @Column({ name: 'idirregularidade', type: 'uuid' })
  idIrregularidade: string;
}
