import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { IndicadorService } from './indicador.service';
import { IndicadorController } from './indicador.controller';
import { Indicador } from './entities/indicador.entity';
import { IndicadorExecucao } from './entities/indicador-execucao.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { IndicadorExecucaoController } from './indicador-execucao.controller';
import { IndicadorExecucaoService } from './indicador-execucao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Indicador,
      IndicadorExecucao,
      DepartamentoUsuario,
      Departamento,
    ]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [IndicadorController, IndicadorExecucaoController],
  providers: [IndicadorService, IndicadorExecucaoService],
  exports: [IndicadorService],
})
export class IndicadorModule {}
