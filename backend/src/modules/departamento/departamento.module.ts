import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import { Departamento } from './entities/departamento.entity';
import { DepartamentoUsuario } from './entities/departamento-usuario.entity';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Departamento, DepartamentoUsuario]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [DepartamentoController],
  providers: [DepartamentoService],
  exports: [DepartamentoService],
})
export class DepartamentoModule {}
