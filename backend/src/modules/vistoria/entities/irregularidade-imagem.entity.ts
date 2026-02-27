import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Irregularidade } from './irregularidade.entity';

@Entity('irregularidades_imagens')
@Index('IDX_IRREGULARIDADE_IMAGEM_IRREG', ['idIrregularidade'])
export class IrregularidadeImagem extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Imagem da Irregularidade';
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

  @ApiProperty({ description: 'Irregularidade vinculada', type: () => Irregularidade })
  @ManyToOne(() => Irregularidade, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idirregularidade' })
  irregularidade: Irregularidade;

  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  @Column({ name: 'idirregularidade', type: 'uuid' })
  idIrregularidade: string;
}
