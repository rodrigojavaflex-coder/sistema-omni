import { PartialType } from '@nestjs/swagger';
import { CreateMatrizCriticidadeDto } from './create-matriz-criticidade.dto';

export class UpdateMatrizCriticidadeDto extends PartialType(CreateMatrizCriticidadeDto) {}
