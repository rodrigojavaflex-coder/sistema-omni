import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MarcacaoPontoDto } from './irregularidade-marcacao.dto';

export class ReclassificarIrregularidadeDto {
  @ApiProperty({ description: 'ID da área de destino', format: 'uuid' })
  @IsUUID('4')
  idarea: string;

  @ApiProperty({ description: 'ID do componente de destino', format: 'uuid' })
  @IsUUID('4')
  idcomponente: string;

  @ApiProperty({ description: 'ID do sintoma de destino', format: 'uuid' })
  @IsUUID('4')
  idsintoma: string;

  @ApiProperty({
    description: 'Observação opcional da reclassificação',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({
    description:
      'Pontos no mapa (mesma vista, 1–10). Preferir sobre idVista/pos únicos.',
    type: [MarcacaoPontoDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => MarcacaoPontoDto)
  marcacoes?: MarcacaoPontoDto[];

  @ApiProperty({
    description:
      'Vista do modelo (obrigatória se o sintoma destino exige mapa e não há marcação)',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID('4')
  idVista?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  posXPct?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  posYPct?: number;
}
