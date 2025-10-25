import { Module, Global } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsGuard } from './guards/permissions.guard';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { Perfil } from '../modules/perfil/entities/perfil.entity';
import { Configuracao } from '../modules/configuracao/entities/configuracao.entity';

@Global()
@Module({
  imports: [
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([Usuario, Perfil, Configuracao]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class SharedModule {}
