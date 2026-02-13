import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CategoriaOcorrencia } from './entities/categoria-ocorrencia.entity';
import { CategoriaOcorrenciaService } from './categoria-ocorrencia.service';
import { CategoriaOcorrenciaController } from './categoria-ocorrencia.controller';
import { OrigemOcorrenciaModule } from '../origem-ocorrencia/origem-ocorrencia.module';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaOcorrencia]),
    JwtModule,
    ConfigModule,
    OrigemOcorrenciaModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [CategoriaOcorrenciaController],
  providers: [CategoriaOcorrenciaService],
  exports: [CategoriaOcorrenciaService],
})
export class CategoriaOcorrenciaModule {}
