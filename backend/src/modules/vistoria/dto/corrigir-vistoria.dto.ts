import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsUUID, Max, Min } from 'class-validator';
import { TipoVistoria } from '../../../common/enums/tipo-vistoria.enum';

export class CorrigirVistoriaDto {
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
    description: 'Tipo da vistoria (não reenvia ERP/BRT)',
    enum: TipoVistoria,
  })
  @IsEnum(TipoVistoria)
  tipo: TipoVistoria;
}
