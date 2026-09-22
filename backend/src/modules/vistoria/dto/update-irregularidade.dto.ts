import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MarcacaoPontoDto } from './irregularidade-marcacao.dto';

/** Normaliza entrada de texto antes de validar obrigatoriedade (espaços não contam). */
function trimLeadingTrailingWhitespace(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateIrregularidadeDto {
  @ApiProperty({
    description:
      'Descrição do problema na irregularidade (obrigatória nesta atualização; espaços só nas extremidades são ignorados).',
    example: 'Barulho anormal sob aceleração acima de 60 km/h.',
  })
  @Transform(({ value }) => trimLeadingTrailingWhitespace(value))
  @IsString({ message: 'A descrição do problema deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição do problema é obrigatória.' })
  observacao: string;

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
    description: 'Vista do modelo para reposicionar a marcação',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
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
