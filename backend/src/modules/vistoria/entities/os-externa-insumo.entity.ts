import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('os_externa_insumos')
@Index('IDX_os_ext_insumos_num_os', ['numOsExterno'])
export class OsExternaInsumo extends BaseEntity {
  @ApiProperty({ default: 'BRT' })
  @Column({ name: 'integrador', type: 'varchar', length: 30, default: 'BRT' })
  integrador: string;

  @Column({ name: 'os_orig', type: 'varchar', length: 80, nullable: true })
  osOrig?: string | null;

  @Column({ name: 'num_os_externo', type: 'integer' })
  numOsExterno: number;

  @Column({ name: 'nome_insumo', type: 'varchar', length: 300 })
  nomeInsumo: string;

  @Column({
    name: 'quantidade',
    type: 'numeric',
    precision: 12,
    scale: 3,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined ? null : Number(v),
    },
  })
  quantidade?: number | null;

  @Column({
    name: 'valor',
    type: 'numeric',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: {
      to: (v?: number | null) => v,
      from: (v?: string | null) =>
        v === null || v === undefined ? null : Number(v),
    },
  })
  valor?: number | null;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string | null;

  @Column({ name: 'data_alteracao_brt', type: 'timestamp', nullable: true })
  dataAlteracaoBrt?: Date | null;

  @Column({
    name: 'sincronizado_em',
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
  })
  sincronizadoEm: Date;
}
