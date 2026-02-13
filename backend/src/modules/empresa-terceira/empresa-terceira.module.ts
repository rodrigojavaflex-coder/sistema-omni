import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmpresaTerceira } from './entities/empresa-terceira.entity';
import { EmpresaTerceiraService } from './empresa-terceira.service';
import { EmpresaTerceiraController } from './empresa-terceira.controller';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmpresaTerceira]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [EmpresaTerceiraController],
  providers: [EmpresaTerceiraService],
  exports: [EmpresaTerceiraService],
})
export class EmpresaTerceiraModule {}
