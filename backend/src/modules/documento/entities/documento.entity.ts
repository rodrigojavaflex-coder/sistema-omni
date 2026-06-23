import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { StatusDocumento } from '../../../common/enums/status-documento.enum';
import { TipoDocumento } from '../../tipo-documento/entities/tipo-documento.entity';
import { Departamento } from '../../departamento/entities/departamento.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('documentos')
@Index(['status'])
@Index(['tipoDocumentoId'])
@Index(['departamentoId'])
@Index(['responsavelId'])
export class Documento extends BaseEntity {
  @ApiProperty({ description: 'Nome do documento' })
  @Column({ type: 'varchar', length: 300, nullable: false })
  nomeDocumento: string;

  @ApiProperty({ description: 'Detalhes complementares do documento', required: false })
  @Column({ type: 'text', nullable: true })
  detalhesDocumento?: string | null;

  @ManyToOne(() => TipoDocumento, { eager: true, nullable: false })
  @JoinColumn({ name: 'tipoDocumentoId' })
  tipoDocumento: TipoDocumento;

  @Column({ type: 'uuid', nullable: false })
  tipoDocumentoId: string;

  @ManyToOne(() => Departamento, { eager: true, nullable: false })
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento;

  @Column({ type: 'uuid', nullable: false })
  departamentoId: string;

  @ManyToOne(() => Usuario, { eager: true, nullable: false })
  @JoinColumn({ name: 'responsavelId' })
  responsavel: Usuario;

  @Column({ type: 'uuid', nullable: false })
  responsavelId: string;

  @ApiProperty({ enum: StatusDocumento })
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    default: StatusDocumento.ATIVO,
  })
  status: StatusDocumento;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nomeArquivo: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  mimeType: string;

  @Column({ type: 'bigint', nullable: false })
  tamanho: number;

  @Column({ type: 'bytea', nullable: false, select: false })
  dadosBytea: Buffer;

  @Column({ type: 'boolean', default: false })
  compartilhamentoAtivo: boolean;

  @Index(['tokenPublico'], { unique: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  tokenPublico?: string | null;

  @Column({ type: 'timestamp', nullable: true })
  compartilhamentoExpiraEm?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  compartilhamentoGeradoEm?: Date | null;

  static override get nomeAmigavel(): string {
    return 'Documento';
  }
}
