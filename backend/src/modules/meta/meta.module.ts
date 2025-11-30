import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';
import { Meta } from './entities/meta.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meta, DepartamentoUsuario, Departamento]),
    JwtModule,
    ConfigModule,
  ],
  controllers: [MetaController],
  providers: [MetaService],
  exports: [MetaService],
})
export class MetaModule {}
