import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaTerceiraDto } from './create-empresa-terceira.dto';

export class UpdateEmpresaTerceiraDto extends PartialType(
  CreateEmpresaTerceiraDto,
) {}
