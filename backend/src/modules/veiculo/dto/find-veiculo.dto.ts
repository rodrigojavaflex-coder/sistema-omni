import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsPositive, Min, Max, IsEnum } from 'class-validator';
import { StatusVeiculo } from '../../../common/enums/status-veiculo.enum';

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

  @ApiProperty({ required: false, description: 'Marca' })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiProperty({ required: false, description: 'Modelo' })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiProperty({ required: false, description: 'Combustível' })
  @IsOptional()
  @IsString()
  combustivel?: string;

  @ApiProperty({ required: false, description: 'Status', enum: StatusVeiculo })
  @IsOptional()
  @IsEnum(StatusVeiculo)
  status?: StatusVeiculo;

  @ApiProperty({ required: false, description: 'Marca da carroceria' })
  @IsOptional()
  @IsString()
  marcaDaCarroceria?: string;

  @ApiProperty({ required: false, description: 'Modelo da carroceria' })
  @IsOptional()
  @IsString()
  modeloDaCarroceria?: string;

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
