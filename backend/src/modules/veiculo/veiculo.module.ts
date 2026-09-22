import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculoService } from './veiculo.service.js';
import { VeiculoController } from './veiculo.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Veiculo } from './entities/veiculo.entity';
import { ModeloVeiculo } from './entities/modelo-veiculo.entity';
import { ModeloVeiculoVista } from './entities/modelo-veiculo-vista.entity';
import { VistaVeiculo } from './entities/vista-veiculo.entity';
import { ModeloVeiculoService } from './modelo-veiculo.service';
import { ModeloVeiculoController } from './modelo-veiculo.controller';
import { ModeloVeiculoVistaService } from './modelo-veiculo-vista.service';
import { VistaVeiculoService } from './vista-veiculo.service';
import { VistasVeiculoController } from './vistas-veiculo.controller';
import { Irregularidade } from '../vistoria/entities/irregularidade.entity';
import { IrregularidadeMarcacao } from '../vistoria/entities/irregularidade-marcacao.entity';
import { MatrizCriticidade } from '../vistoria/entities/matriz-criticidade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Veiculo,
      ModeloVeiculo,
      ModeloVeiculoVista,
      VistaVeiculo,
      Irregularidade,
      IrregularidadeMarcacao,
      IrregularidadeMarcacao,
      MatrizCriticidade,
    ]),
    JwtModule,
    ConfigModule,
  ],
  providers: [
    VeiculoService,
    ModeloVeiculoService,
    ModeloVeiculoVistaService,
    VistaVeiculoService,
  ],
  controllers: [
    VeiculoController,
    ModeloVeiculoController,
    VistasVeiculoController,
  ],
  exports: [
    VeiculoService,
    ModeloVeiculoService,
    ModeloVeiculoVistaService,
    VistaVeiculoService,
  ],
})
export class VeiculoModule {}
