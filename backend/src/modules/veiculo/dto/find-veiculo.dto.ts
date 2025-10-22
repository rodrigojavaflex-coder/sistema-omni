import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class FindVeiculoDto {
  @ApiProperty({ required: false, description: 'Descrição' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({ required: false, description: 'Placa' })
  @IsOptional()
  @IsString()
  placa?: string;

  @ApiProperty({ required: false, description: 'Ano' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1900)
  ano?: number;

  @ApiProperty({
    minimum: 1,
    default: 1,
    description: 'Número da página',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    minimum: 1,
    maximum: 100,
    default: 10,
    description: 'Quantidade de itens por página',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
