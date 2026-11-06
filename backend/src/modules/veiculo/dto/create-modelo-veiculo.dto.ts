import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateModeloVeiculoDto {
  @ApiProperty({ description: 'Nome do modelo', maxLength: 80 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada do modelo',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  descricaoDetalhada?: string | null;

  @ApiProperty({ description: 'Modelo ativo', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description: 'Km por 1% (GNV/Elétrico)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999.99)
  kmPorPercentual?: number | null;

  @ApiProperty({
    description: 'Km por litro (Diesel)',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(9999.99)
  kmPorLitro?: number | null;
}
