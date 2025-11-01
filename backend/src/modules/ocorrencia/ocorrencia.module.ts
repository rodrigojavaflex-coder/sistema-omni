import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { OcorrenciaService } from './ocorrencia.service';
import { OcorrenciaController } from './ocorrencia.controller';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { VeiculoModule } from '../veiculo/veiculo.module';
import { MotoristaModule } from '../motorista/motorista.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ocorrencia]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
    forwardRef(() => VeiculoModule),
    forwardRef(() => MotoristaModule),
  ],
  controllers: [OcorrenciaController],
  providers: [OcorrenciaService],
  exports: [OcorrenciaService],
})
export class OcorrenciaModule {}
