import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Perfil } from '../perfil/entities/perfil.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Perfil,
      Departamento,
      DepartamentoUsuario,
      EmpresaTerceira,
    ]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
