import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('password_reset_throttle')
export class PasswordResetThrottle {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  emailFingerprint: string;

  @Column({ type: 'timestamp' })
  ultimaSolicitacao: Date;
}
