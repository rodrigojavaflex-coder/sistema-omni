import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { createTransport, Transporter } from 'nodemailer';
import { IsNull, MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { PasswordResetOtp } from './entities/password-reset-otp.entity';
import { PasswordResetThrottle } from './entities/password-reset-throttle.entity';
import { PasswordResetConfirmDto } from './dto/password-reset-confirm.dto';
import { Configuracao, EmailEnvioConfig } from '../configuracao/entities/configuracao.entity';
import { AuditoriaService } from '../../common/services/auditoria.service';
import { AuditAction } from '../../common/enums/auditoria.enum';

const GENERIC_REQUEST_MSG =
  'Se o e-mail estiver cadastrado, enviaremos um código de verificação.';

@Injectable()
export class PasswordResetService {
  private configCache: { data: Configuracao | null; fetchedAt: number } = {
    data: null,
    fetchedAt: 0,
  };
  private readonly configCacheTtlMs = 60 * 1000;

  constructor(
    @InjectRepository(PasswordResetOtp)
    private readonly otpRepository: Repository<PasswordResetOtp>,
    @InjectRepository(PasswordResetThrottle)
    private readonly throttleRepository: Repository<PasswordResetThrottle>,
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    @InjectRepository(Configuracao)
    private readonly configuracaoRepository: Repository<Configuracao>,
    private readonly configService: ConfigService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  private get hmacSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'default-secret-key';
  }

  private get otpTtlMin(): number {
    return parseInt(
      this.configService.get<string>('PASSWORD_RESET_OTP_TTL_MIN') || '15',
      10,
    );
  }

  private get cooldownSec(): number {
    return parseInt(
      this.configService.get<string>('PASSWORD_RESET_REQUEST_COOLDOWN_SEC') || '60',
      10,
    );
  }

  private get maxPerHour(): number {
    return parseInt(
      this.configService.get<string>('PASSWORD_RESET_MAX_PER_HOUR') || '5',
      10,
    );
  }

  private get maxOtpAttempts(): number {
    return parseInt(
      this.configService.get<string>('PASSWORD_RESET_MAX_OTP_ATTEMPTS') || '5',
      10,
    );
  }

  private emailFingerprint(email: string): string {
    const norm = email.trim().toLowerCase();
    return createHmac('sha256', this.hmacSecret).update(`fp:${norm}`).digest('hex');
  }

  private hashOtpCode(userId: string, code: string): string {
    return createHmac('sha256', this.hmacSecret)
      .update(`otp:${userId}:${code}`)
      .digest('hex');
  }

  private safeCompareCode(expectedHex: string, userId: string, code: string): boolean {
    const actual = this.hashOtpCode(userId, code);
    try {
      return timingSafeEqual(Buffer.from(expectedHex, 'utf8'), Buffer.from(actual, 'utf8'));
    } catch {
      return false;
    }
  }

  private generateOtpCode(): string {
    return String(randomInt(0, 1_000_000)).padStart(6, '0');
  }

  private async getConfiguracao(): Promise<Configuracao | null> {
    const now = Date.now();
    if (
      this.configCache.fetchedAt > 0 &&
      now - this.configCache.fetchedAt < this.configCacheTtlMs
    ) {
      return this.configCache.data;
    }
    const config = await this.configuracaoRepository.findOne({ where: {} });
    this.configCache = { data: config, fetchedAt: now };
    return config;
  }

  private buildTransport(
    emailConfig: EmailEnvioConfig,
  ): { transport: Transporter; from: string } {
    if (!emailConfig?.ativo) {
      throw new Error('Envio de e-mail não está habilitado nas configurações do sistema.');
    }
    if (!emailConfig.host || !emailConfig.porta) {
      throw new Error('Configuração de e-mail inválida: host/porta.');
    }
    const fromAddress = emailConfig.remetenteEmail?.trim();
    if (!fromAddress) {
      throw new Error('Configuração de e-mail: remetente não informado.');
    }
    const fromName = emailConfig.remetenteNome?.trim();
    const from = fromName ? `"${fromName}" <${fromAddress}>` : fromAddress;
    const transport = createTransport({
      host: emailConfig.host,
      port: Number(emailConfig.porta),
      secure: Number(emailConfig.porta) === 465,
      requireTLS: !!emailConfig.usarTls,
      connectionTimeout: 45_000,
      greetingTimeout: 30_000,
      socketTimeout: 45_000,
      auth:
        emailConfig.usuario && emailConfig.senha
          ? { user: emailConfig.usuario, pass: emailConfig.senha }
          : undefined,
    });
    return { transport, from };
  }

  async requestPasswordReset(
    emailRaw: string,
  ): Promise<{ message: string }> {
    const email = emailRaw.trim().toLowerCase();
    const fingerprint = this.emailFingerprint(email);

    const th = await this.throttleRepository.findOne({
      where: { emailFingerprint: fingerprint },
    });
    const now = new Date();
    if (th) {
      const deltaMs = now.getTime() - new Date(th.ultimaSolicitacao).getTime();
      if (deltaMs < this.cooldownSec * 1000) {
        throw new HttpException(
          'Muitas solicitações. Aguarde um momento antes de tentar novamente.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user || !user.ativo) {
      await this.upsertThrottle(fingerprint, now);
      return { message: GENERIC_REQUEST_MSG };
    }

    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recent = await this.otpRepository
      .createQueryBuilder('o')
      .where('o.usuarioId = :uid', { uid: user.id })
      .andWhere('o.criadoEm > :h', { h: oneHourAgo })
      .getCount();
    if (recent >= this.maxPerHour) {
      throw new HttpException(
        'Muitas solicitações. Aguarde um momento antes de tentar novamente.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const configuracao = await this.getConfiguracao();
    const emailConfig = configuracao?.emailEnvioConfig;
    if (!emailConfig?.ativo) {
      await this.upsertThrottle(fingerprint, now);
      return { message: GENERIC_REQUEST_MSG };
    }

    const code = this.generateOtpCode();
    const codeHash = this.hashOtpCode(user.id, code);
    const expira = new Date(now.getTime() + this.otpTtlMin * 60 * 1000);

    try {
      const { transport, from } = this.buildTransport(emailConfig);
      await transport.sendMail({
        from,
        to: user.email,
        subject: 'Código para redefinir a senha',
        html: `
          <p>Olá, ${this.escapeHtml(user.nome)}.</p>
          <p>Seu código de verificação (válido por ${this.otpTtlMin} minutos) é:</p>
          <p style="font-size:22px;font-weight:bold;letter-spacing:2px;">${this.escapeHtml(code)}</p>
          <p>Se você não solicitou a redefinição, ignore este e-mail.</p>
        `,
        text: `Código: ${code} (válido por ${this.otpTtlMin} minutos). Se não foi você, ignore.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[password-reset] Falha ao enviar e-mail:', msg);
      await this.upsertThrottle(fingerprint, new Date());
      return { message: GENERIC_REQUEST_MSG };
    }

    await this.upsertThrottle(fingerprint, now);
    await this.otpRepository.manager.transaction(async (em) => {
      await em
        .getRepository(PasswordResetOtp)
        .createQueryBuilder()
        .delete()
        .from(PasswordResetOtp)
        .where('"usuarioId" = :uid', { uid: user.id })
        .andWhere('"usadoEm" IS NULL')
        .execute();
      const row = em.getRepository(PasswordResetOtp).create({
        usuarioId: user.id,
        codeHash,
        expiraEm: expira,
        tentativasFalha: 0,
        usadoEm: null,
      });
      await em.getRepository(PasswordResetOtp).save(row);
    });

    return { message: GENERIC_REQUEST_MSG };
  }

  private escapeHtml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private async upsertThrottle(
    fingerprint: string,
    when: Date,
  ): Promise<void> {
    await this.throttleRepository.upsert(
      { emailFingerprint: fingerprint, ultimaSolicitacao: when },
      ['emailFingerprint'],
    );
  }

  async confirmPasswordReset(
    dto: PasswordResetConfirmDto,
    request?: { ip?: string; [key: string]: unknown },
  ): Promise<{ message: string }> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('As senhas não conferem');
    }

    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.ativo) {
      throw new BadRequestException('Código inválido ou expirado. Solicite um novo código.');
    }

    const otp = await this.otpRepository.findOne({
      where: {
        usuarioId: user.id,
        usadoEm: IsNull(),
        expiraEm: MoreThan(new Date()),
      },
      order: { criadoEm: 'DESC' },
    });

    if (!otp) {
      throw new BadRequestException('Código inválido ou expirado. Solicite um novo código.');
    }

    if (otp.tentativasFalha >= this.maxOtpAttempts) {
      throw new HttpException(
        'Muitas tentativas com este código. Solicite um novo.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!this.safeCompareCode(otp.codeHash, user.id, dto.code)) {
      otp.tentativasFalha += 1;
      await this.otpRepository.save(otp);
      if (otp.tentativasFalha >= this.maxOtpAttempts) {
        throw new HttpException(
          'Muitas tentativas com este código. Solicite um novo.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new BadRequestException('Código inválido ou expirado. Solicite um novo código.');
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(dto.newPassword, saltRounds);
    user.senha = hashed;
    await this.otpRepository.manager.transaction(async (em) => {
      await em.getRepository(Usuario).save(user);
      otp.usadoEm = new Date();
      await em.getRepository(PasswordResetOtp).save(otp);
    });

    const config = await this.getConfiguracao();
    if (config?.auditarSenhaAlterada !== false) {
      await this.auditoriaService.createLog({
        acao: AuditAction.CHANGE_PASSWORD,
        usuarioId: user.id,
        descricao: 'Senha redefinida via código enviado por e-mail (recuperação de acesso).',
        request: request,
      });
    }

    return { message: 'Senha alterada com sucesso. Você já pode fazer login.' };
  }
}
