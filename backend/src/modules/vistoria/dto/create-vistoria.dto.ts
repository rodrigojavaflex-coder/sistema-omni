import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TipoVistoria } from '../../../common/enums/tipo-vistoria.enum';

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
  @Max(9999999)
  odometro: number;

  @ApiProperty({
    description:
      'Percentual de bateria ou GNV (0–100); obrigatório se combustível elétrico ou GNV',
    example: 85,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  porcentagembateria?: number;

  @ApiProperty({ description: 'Data/hora da vistoria (ISO)' })
  @IsDateString()
  datavistoria: string;

  @ApiProperty({
    description: 'Tipo da vistoria',
    enum: TipoVistoria,
    default: TipoVistoria.CORRETIVA,
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoVistoria)
  tipo?: TipoVistoria;
}
