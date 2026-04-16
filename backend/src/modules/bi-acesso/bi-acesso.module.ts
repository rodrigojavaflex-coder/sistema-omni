import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BiAcessoController } from './bi-acesso.controller';
import { BiAcessoService } from './bi-acesso.service';
import { BiAcessoLink } from './entities/bi-acesso-link.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BiAcessoLink, Usuario])],
  controllers: [BiAcessoController],
  providers: [BiAcessoService],
  exports: [BiAcessoService, TypeOrmModule],
})
export class BiAcessoModule {}
