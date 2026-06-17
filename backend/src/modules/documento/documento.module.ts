import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Documento } from './entities/documento.entity';
import { DocumentoService } from './documento.service';
import {
  DocumentoController,
  DocumentoPublicoController,
} from './documento.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { TipoDocumento } from '../tipo-documento/entities/tipo-documento.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Documento,
      TipoDocumento,
      Departamento,
      Usuario,
    ]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [DocumentoController, DocumentoPublicoController],
  providers: [DocumentoService],
  exports: [DocumentoService],
})
export class DocumentoModule {}
