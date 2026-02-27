import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAreaVistoriadaDto {
  @ApiProperty({ description: 'Nome da área', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ description: 'Ordem visual', required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ordem_visual?: number;

  @ApiProperty({ description: 'Área ativa', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Modelos atendidos pela área',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  modelos?: string[];
}
