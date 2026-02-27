import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vistoria } from './vistoria.entity';
import { AreaVistoriada } from './area-vistoriada.entity';
import { Componente } from './componente.entity';
import { Sintoma } from './sintoma.entity';
import { IrregularidadeImagem } from './irregularidade-imagem.entity';

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

  @ApiProperty({ description: 'Nome do áudio', required: false })
  @Column({ name: 'audio_nome_arquivo', type: 'varchar', length: 255, nullable: true })
  audioNomeArquivo?: string | null;

  @ApiProperty({ description: 'Mime type do áudio', required: false })
  @Column({ name: 'audio_mime_type', type: 'varchar', length: 100, nullable: true })
  audioMimeType?: string | null;

  @ApiProperty({ description: 'Tamanho do áudio em bytes', required: false })
  @Column({ name: 'audio_tamanho', type: 'bigint', nullable: true })
  audioTamanho?: number | null;

  @ApiProperty({ description: 'Duração do áudio em ms', required: false })
  @Column({ name: 'audio_duracao_ms', type: 'integer', nullable: true })
  audioDuracaoMs?: number | null;

  @ApiProperty({ description: 'Conteúdo do áudio', required: false })
  @Column({ name: 'audio_dados_bytea', type: 'bytea', nullable: true })
  audioDadosBytea?: Buffer | null;

  @ApiProperty({ description: 'Imagens vinculadas', type: () => [IrregularidadeImagem] })
  @OneToMany(() => IrregularidadeImagem, (imagem) => imagem.irregularidade, {
    cascade: true,
  })
  imagens?: IrregularidadeImagem[];
}
