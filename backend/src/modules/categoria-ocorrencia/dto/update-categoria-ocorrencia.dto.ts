import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaOcorrenciaDto } from './create-categoria-ocorrencia.dto';

export class UpdateCategoriaOcorrenciaDto extends PartialType(
  CreateCategoriaOcorrenciaDto,
) {}
