import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';

/** Um ponto no mapa (0–100%). */
export class MarcacaoPontoDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  idVista: string;

  @ApiProperty({ description: 'Posição X percentual (0-100)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  posXPct: number;

  @ApiProperty({ description: 'Posição Y percentual (0-100)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  posYPct: number;
}

export class IrregularidadeMarcacaoDto {
  @ApiProperty({ format: 'uuid' })
  idVista: string;

  @ApiProperty()
  descricaoVista: string;

  @ApiProperty({ description: 'Posição X percentual (0-100)' })
  posXPct: number;

  @ApiProperty({ description: 'Posição Y percentual (0-100)' })
  posYPct: number;

  @ApiProperty({
    description: 'Ordem do ponto na vista (0-based); rótulo 1.1, 1.2… no overlay',
    required: false,
  })
  ordem?: number;
}

export class VistaMarcacaoItemDto {
  @ApiProperty({ format: 'uuid' })
  idIrregularidade: string;

  @ApiProperty()
  numeroIrregularidade: number;

  @ApiProperty({ format: 'uuid' })
  idsintoma: string;

  @ApiProperty({ required: false })
  descricaoSintoma?: string;

  @ApiProperty({ enum: StatusIrregularidade })
  statusAtual: StatusIrregularidade;

  @ApiProperty()
  resolvido: boolean;

  @ApiProperty()
  posXPct: number;

  @ApiProperty()
  posYPct: number;

  @ApiProperty({
    description: 'Ordem do ponto (0-based) dentro da irregularidade',
  })
  ordem: number;
}

/** Campos opcionais de marcação em create/update/reclassificar. */
export class MarcacaoInputFields {
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
    description: 'Vista do modelo (legado / com posXPct+posYPct únicos)',
    format: 'uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  idVista?: string;

  @ApiProperty({
    description: 'Posição X percentual (legado, 1 ponto)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  posXPct?: number;

  @ApiProperty({
    description: 'Posição Y percentual (legado, 1 ponto)',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(100)
  posYPct?: number;
}
