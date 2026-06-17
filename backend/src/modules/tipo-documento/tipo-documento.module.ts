import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TipoDocumento } from './entities/tipo-documento.entity';
import { TipoDocumentoService } from './tipo-documento.service';
import { TipoDocumentoController } from './tipo-documento.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { Documento } from '../documento/entities/documento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoDocumento, Documento]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [TipoDocumentoController],
  providers: [TipoDocumentoService],
  exports: [TipoDocumentoService],
})
export class TipoDocumentoModule {}
