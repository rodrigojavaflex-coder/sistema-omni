import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AreaComponenteItemDto {
  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @IsUUID()
  idcomponente: string;

  @ApiProperty({ description: 'Ordem visual', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ordem_visual?: number;
}

export class SetAreaComponentesDto {
  @ApiProperty({ description: 'Componentes vinculados', type: [AreaComponenteItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AreaComponenteItemDto)
  componentes: AreaComponenteItemDto[];
}
