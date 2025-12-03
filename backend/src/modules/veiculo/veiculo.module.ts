import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoService } from './veiculo.service.js';
import { VeiculoController } from './veiculo.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Veiculo } from './entities/veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo]), JwtModule, ConfigModule],
  providers: [VeiculoService],
  controllers: [VeiculoController],
  exports: [VeiculoService],
})
export class VeiculoModule {}
