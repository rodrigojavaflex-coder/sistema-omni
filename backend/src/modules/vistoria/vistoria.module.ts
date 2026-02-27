import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Vistoria } from './entities/vistoria.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { Motorista } from '../motorista/entities/motorista.entity';
import { VistoriaController } from './vistoria.controller';
import { VistoriaService } from './vistoria.service';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { AreaModelo } from './entities/area-modelo.entity';
import { Componente } from './entities/componente.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { Sintoma } from './entities/sintoma.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeImagem } from './entities/irregularidade-imagem.entity';
import { ModeloVeiculo } from '../veiculo/entities/modelo-veiculo.entity';
import { AreaVistoriadaService } from './area-vistoriada.service';
import { AreaComponenteService } from './area-componente.service';
import { ComponenteService } from './componente.service';
import { SintomaService } from './sintoma.service';
import { MatrizCriticidadeService } from './matriz-criticidade.service';
import { IrregularidadeService } from './irregularidade.service';
import { AreasVistoriadasController } from './areas-vistoriadas.controller';
import { ComponentesController } from './componentes.controller';
import { SintomasController } from './sintomas.controller';
import { MatrizCriticidadeController } from './matriz-criticidade.controller';
import { IrregularidadesController } from './irregularidades.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vistoria,
      AreaVistoriada,
      AreaModelo,
      Componente,
      AreaComponente,
      Sintoma,
      MatrizCriticidade,
      Irregularidade,
      IrregularidadeImagem,
      ModeloVeiculo,
      Veiculo,
      Motorista,
      Usuario,
    ]),
    AuthModule,
  ],
  controllers: [
    VistoriaController,
    AreasVistoriadasController,
    ComponentesController,
    SintomasController,
    MatrizCriticidadeController,
    IrregularidadesController,
  ],
  providers: [
    VistoriaService,
    AreaVistoriadaService,
    AreaComponenteService,
    ComponenteService,
    SintomaService,
    MatrizCriticidadeService,
    IrregularidadeService,
  ],
})
export class VistoriaModule {}
