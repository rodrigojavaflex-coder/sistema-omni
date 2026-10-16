import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('os_externa_status_eventos')
@Index('IDX_os_ext_status_evt_num_os', ['numOsExterno'])
@Index('UQ_os_ext_status_evt_natural', [
  'integrador',
  'numOsExterno',
  'statusBrt',
  'dataEventoBrt',
], { unique: true })
export class OsExternaStatusEvento extends BaseEntity {
  @ApiProperty({ default: 'BRT' })
  @Column({ name: 'integrador', type: 'varchar', length: 30, default: 'BRT' })
  integrador: string;

  @Column({ name: 'os_orig', type: 'varchar', length: 80 })
  osOrig: string;

  @Column({ name: 'num_os_externo', type: 'integer' })
  numOsExterno: number;

  @Column({ name: 'status_brt', type: 'varchar', length: 80 })
  statusBrt: string;

  @Column({ name: 'comentario', type: 'text', nullable: true })
  comentario?: string | null;

  @Column({ name: 'data_evento_brt', type: 'timestamp', nullable: true })
  dataEventoBrt?: Date | null;

  @Column({
    name: 'recebido_em',
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
  })
  recebidoEm: Date;
}
