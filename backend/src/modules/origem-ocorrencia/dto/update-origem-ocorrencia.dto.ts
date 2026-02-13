import { PartialType } from '@nestjs/mapped-types';
import { CreateOrigemOcorrenciaDto } from './create-origem-ocorrencia.dto';

export class UpdateOrigemOcorrenciaDto extends PartialType(
  CreateOrigemOcorrenciaDto,
) {}
