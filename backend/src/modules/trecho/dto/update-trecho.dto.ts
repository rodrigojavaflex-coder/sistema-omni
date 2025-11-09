import { PartialType } from '@nestjs/mapped-types';
import { CreateTrechoDto } from './create-trecho.dto';

export class UpdateTrechoDto extends PartialType(CreateTrechoDto) {}
