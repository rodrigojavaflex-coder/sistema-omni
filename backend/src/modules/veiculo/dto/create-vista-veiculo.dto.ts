import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVistaVeiculoDto {
  @ApiProperty({ description: 'Descrição da vista / parte', maxLength: 80 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  descricao: string;

  @ApiProperty({ description: 'Vista ativa', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({ description: 'Ordem visual', required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ordem?: number;
}
