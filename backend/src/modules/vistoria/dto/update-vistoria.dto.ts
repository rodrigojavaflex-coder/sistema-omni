import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class UpdateVistoriaDto {
  @ApiPropertyOptional({ description: 'ID do veículo', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  idveiculo?: string;

  @ApiPropertyOptional({ description: 'ID do motorista', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  idmotorista?: string;

  @ApiPropertyOptional({ description: 'ID do tipo de vistoria', format: 'uuid' })
  @IsUUID()
  @IsOptional()
  idtipovistoria?: string;

  @ApiPropertyOptional({ description: 'Odômetro informado', example: 12345.6 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(9999999)
  @IsOptional()
  odometro?: number;

  @ApiPropertyOptional({ description: 'Percentual de bateria', example: 85 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  porcentagembateria?: number;

  @ApiPropertyOptional({ description: 'Data/hora da vistoria (ISO)' })
  @IsDateString()
  @IsOptional()
  datavistoria?: string;
}
