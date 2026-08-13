import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Irregularidade } from './irregularidade.entity';

@Entity('irregularidades_os_externas')
@Index('IDX_IRREG_OS_EXT_IRREG', ['idIrregularidade'])
export class IrregularidadeOsExterna extends BaseEntity {
  @ManyToOne(() => Irregularidade, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_irregularidade' })
  irregularidade: Irregularidade;

  @Column({ name: 'id_irregularidade', type: 'uuid' })
  idIrregularidade: string;

  @ApiProperty({
    description:
      'Identificador enviado à API externa (os_orig) = numeroIrregularidade no OMNI',
  })
  @Column({ name: 'os_orig', type: 'varchar', length: 80 })
  osOrig: string;

  @ApiProperty({ description: 'Número da OS no sistema externo (BRT)', required: false })
  @Column({ name: 'num_os_externo', type: 'integer', nullable: true })
  numOsExterno?: number | null;

  @Column({ name: 'integrador', type: 'varchar', length: 30, default: 'BRT' })
  integrador: string;

  @Column({ name: 'sucesso', type: 'boolean', default: false })
  sucesso: boolean;

  @Column({ name: 'codigo_erro', type: 'varchar', length: 80, nullable: true })
  codigoErro?: string | null;

  @Column({ name: 'mensagem_erro', type: 'text', nullable: true })
  mensagemErro?: string | null;

  @Column({ name: 'http_status', type: 'integer', nullable: true })
  httpStatus?: number | null;
}
