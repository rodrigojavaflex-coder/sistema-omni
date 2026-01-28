import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoVistoria } from './entities/tipo-vistoria.entity';
import { ItemVistoriado } from './entities/item-vistoriado.entity';
import { Vistoria } from './entities/vistoria.entity';
import { ChecklistVistoria } from './entities/checklist-vistoria.entity';
import { ImagensVistoria } from './entities/imagens-vistoria.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { Motorista } from '../motorista/entities/motorista.entity';
import { TipoVistoriaController } from './tipo-vistoria.controller';
import { ItemVistoriadoController } from './item-vistoriado.controller';
import { TipoVistoriaService } from './tipo-vistoria.service';
import { ItemVistoriadoService } from './item-vistoriado.service';
import { VistoriaController } from './vistoria.controller';
import { VistoriaService } from './vistoria.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TipoVistoria,
      ItemVistoriado,
      Vistoria,
      ChecklistVistoria,
      ImagensVistoria,
      Veiculo,
      Motorista,
      Usuario,
    ]),
    AuthModule,
  ],
  controllers: [
    TipoVistoriaController,
    ItemVistoriadoController,
    VistoriaController,
  ],
  providers: [TipoVistoriaService, ItemVistoriadoService, VistoriaService],
})
export class VistoriaModule {}
