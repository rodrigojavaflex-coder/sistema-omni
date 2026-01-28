import { PartialType } from '@nestjs/swagger';
import { CreateItemVistoriadoDto } from './create-item-vistoriado.dto';

export class UpdateItemVistoriadoDto extends PartialType(CreateItemVistoriadoDto) {}
