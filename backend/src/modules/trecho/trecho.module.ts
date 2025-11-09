import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TrechoService } from './trecho.service';
import { TrechoController } from './trecho.controller';
import { Trecho } from './entities/trecho.entity';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trecho]),
    JwtModule,
    ConfigModule,
    forwardRef(() => AuditoriaModule),
  ],
  controllers: [TrechoController],
  providers: [TrechoService],
  exports: [TrechoService],
})
export class TrechoModule {}
