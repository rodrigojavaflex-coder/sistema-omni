import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoService } from './veiculo.service.js';
import { VeiculoController } from './veiculo.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Veiculo } from './entities/veiculo.entity';
import { ModeloVeiculo } from './entities/modelo-veiculo.entity';
import { ModeloVeiculoService } from './modelo-veiculo.service';
import { ModeloVeiculoController } from './modelo-veiculo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo, ModeloVeiculo]), JwtModule, ConfigModule],
  providers: [VeiculoService, ModeloVeiculoService],
  controllers: [VeiculoController, ModeloVeiculoController],
  exports: [VeiculoService, ModeloVeiculoService],
})
export class VeiculoModule {}
