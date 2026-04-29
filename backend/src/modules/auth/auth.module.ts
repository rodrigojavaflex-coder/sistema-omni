import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { Configuracao } from '../configuracao/entities/configuracao.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordResetOtp } from './entities/password-reset-otp.entity';
import { PasswordResetThrottle } from './entities/password-reset-throttle.entity';
import { PasswordResetService } from './password-reset.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { ConfiguracaoModule } from '../configuracao/configuracao.module';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';

@Module({
  imports: [
    AuditoriaModule,
    ConfiguracaoModule,
    TypeOrmModule.forFeature([
      Usuario,
      DepartamentoUsuario,
      Departamento,
      PasswordResetOtp,
      PasswordResetThrottle,
      Configuracao,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'default-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '1h'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordResetService],
  exports: [AuthService, PasswordResetService, JwtModule],
})
export class AuthModule {}
