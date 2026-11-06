import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ConfiguracaoModule } from '../configuracao/configuracao.module';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Irregularidade } from '../vistoria/entities/irregularidade.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { BrtTempoRealClient } from './brt-tempo-real.client';
import { EscalaController } from './escala.controller';
import { EscalaService } from './escala.service';
import { VeiculoEscalaDia } from './entities/veiculo-escala-dia.entity';
import { VeiculoTelemetriaAtual } from './entities/veiculo-telemetria-atual.entity';
import { InfobusKmClient } from './infobus-km.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VeiculoEscalaDia,
      VeiculoTelemetriaAtual,
      Veiculo,
      Irregularidade,
      EmpresaTerceira,
    ]),
    ConfiguracaoModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [EscalaController],
  providers: [EscalaService, InfobusKmClient, BrtTempoRealClient],
  exports: [EscalaService],
})
export class EscalaModule {}
