import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('password_reset_otp')
@Index(['usuarioId', 'criadoEm'])
export class PasswordResetOtp extends BaseEntity {
  @Column('uuid', { name: 'usuarioId' })
  usuarioId: string;

  @Column({ length: 128 })
  codeHash: string;

  @Column({ type: 'timestamp' })
  expiraEm: Date;

  @Column({ type: 'int', default: 0 })
  tentativasFalha: number;

  @Column({ type: 'timestamp', nullable: true })
  usadoEm: Date | null;
}
