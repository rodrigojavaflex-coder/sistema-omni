import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { Meta } from './entities/meta.entity';
import { MetaExecucao } from './entities/meta-execucao.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { MetaExecucaoController } from './meta-execucao.controller';
import { MetaExecucaoService } from './meta-execucao.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meta,
      MetaExecucao,
      DepartamentoUsuario,
      Departamento,
    ]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [MetaController, MetaExecucaoController],
  providers: [MetaService, MetaExecucaoService],
  exports: [MetaService],
})
export class MetaModule {}
