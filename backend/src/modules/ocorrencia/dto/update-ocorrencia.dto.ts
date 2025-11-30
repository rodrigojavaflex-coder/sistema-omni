import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateOcorrenciaDto } from './create-ocorrencia.dto';

export class UpdateOcorrenciaDto extends PartialType(CreateOcorrenciaDto) {
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUUID('4', { message: 'ID do trecho inválido' })
  @IsOptional()
  idTrecho?: string;
}
