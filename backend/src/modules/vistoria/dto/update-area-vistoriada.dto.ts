import { PartialType } from '@nestjs/swagger';
import { CreateAreaVistoriadaDto } from './create-area-vistoriada.dto';

export class UpdateAreaVistoriadaDto extends PartialType(CreateAreaVistoriadaDto) {}
