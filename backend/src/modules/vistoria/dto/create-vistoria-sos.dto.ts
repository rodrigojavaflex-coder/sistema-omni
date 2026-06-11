import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateVistoriaSosDto {
  @ApiProperty({ description: 'ID do veículo', format: 'uuid' })
  @IsUUID()
  idveiculo: string;

  @ApiProperty({ description: 'ID do motorista', format: 'uuid' })
  @IsUUID()
  idmotorista: string;

  @ApiProperty({ description: 'Odômetro informado', example: 12345 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(9999999)
  odometro: number;

  @ApiProperty({ description: 'Percentual de bateria', required: false })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  porcentagembateria?: number;

  @ApiProperty({ description: 'Observação geral da vistoria', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
