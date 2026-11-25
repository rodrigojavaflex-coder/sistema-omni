import { PartialType } from '@nestjs/mapped-types';
import { CreateIndicadorExecucaoDto } from './create-indicador-execucao.dto';

export class UpdateIndicadorExecucaoDto extends PartialType(
  CreateIndicadorExecucaoDto,
) {}
