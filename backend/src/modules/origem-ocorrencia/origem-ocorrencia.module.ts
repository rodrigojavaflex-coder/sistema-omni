import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { OrigemOcorrencia } from './entities/origem-ocorrencia.entity';
import { OrigemOcorrenciaService } from './origem-ocorrencia.service';
import { OrigemOcorrenciaController } from './origem-ocorrencia.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrigemOcorrencia]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [OrigemOcorrenciaController],
  providers: [OrigemOcorrenciaService],
  exports: [OrigemOcorrenciaService],
})
export class OrigemOcorrenciaModule {}
