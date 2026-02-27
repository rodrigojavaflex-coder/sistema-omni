import { PartialType } from '@nestjs/swagger';
import { CreateSintomaDto } from './create-sintoma.dto';

export class UpdateSintomaDto extends PartialType(CreateSintomaDto) {}
