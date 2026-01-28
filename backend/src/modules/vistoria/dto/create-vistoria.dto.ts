import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateVistoriaDto {
  @ApiProperty({ description: 'ID do usuário', format: 'uuid' })
  @IsUUID()
  idusuario: string;

  @ApiProperty({ description: 'ID do veículo', format: 'uuid' })
  @IsUUID()
  idveiculo: string;

  @ApiProperty({ description: 'ID do motorista', format: 'uuid' })
  @IsUUID()
  idmotorista: string;

  @ApiProperty({ description: 'Odômetro informado', example: 12345.6 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  odometro: number;

  @ApiProperty({ description: 'Percentual de bateria', example: 85 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentagembateria: number;

  @ApiProperty({ description: 'ID do tipo de vistoria', format: 'uuid' })
  @IsUUID()
  idtipovistoria: string;

  @ApiProperty({ description: 'Data/hora da vistoria (ISO)' })
  @IsDateString()
  datavistoria: string;
}
