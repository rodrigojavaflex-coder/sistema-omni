import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { VeiculoModule } from './modules/veiculo';
import { MotoristaModule } from './modules/motorista/motorista.module';
import { OcorrenciaModule } from './modules/ocorrencia/ocorrencia.module';
import { ConfiguracaoModule } from './modules/configuracao/configuracao.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { SharedModule } from './common/shared.module';
import { AuditoriaInterceptor } from './common/interceptors/auditoria.interceptor';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import googleMapsConfig from './config/google-maps.config';
import { Configuracao } from './modules/configuracao/entities/configuracao.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, googleMapsConfig],
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),
      UsuariosModule,
      // VEICULO MODULE
      VeiculoModule,
      // MOTORISTA MODULE
      MotoristaModule,
      // OCORRENCIA MODULE
      OcorrenciaModule,
  AuthModule,
  // Shared (global guards/providers)
  SharedModule,
    AuditoriaModule,
  ConfiguracaoModule,
  PerfilModule,
    TypeOrmModule.forFeature([Configuracao]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditoriaInterceptor,
    },
  ],
})
export class AppModule {}
