import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsUUID,
  IsDateString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { PolaridadeMeta } from '../enums/polaridade-meta.enum';
import { UnidadeMeta } from '../enums/unidade-meta.enum';
import { IndicadorMeta } from '../enums/indicador-meta.enum';

export class CreateMetaDto {
  @ApiProperty({ description: 'Título da meta', maxLength: 200 })
  @IsString()
  @IsNotEmpty({ message: 'tituloDaMeta é obrigatório' })
  @MaxLength(200, { message: 'tituloDaMeta não pode exceder 200 caracteres' })
  tituloDaMeta: string;

  @ApiProperty({ description: 'Departamento associado', format: 'uuid' })
  @IsUUID('4', { message: 'departamentoId inválido' })
  @IsNotEmpty({ message: 'departamentoId é obrigatório' })
  departamentoId: string;

  @ApiProperty({ description: 'Descrição detalhada', required: false })
  @IsString()
  @IsNotEmpty({ message: 'descricaoDetalhada é obrigatória' })
  descricaoDetalhada: string;

  @ApiProperty({
    description: 'Polaridade da meta',
    enum: PolaridadeMeta,
    enumName: 'PolaridadeMeta',
    example: PolaridadeMeta.MAIOR_MELHOR,
  })
  @IsEnum(PolaridadeMeta, {
    message: 'polaridade deve ser MAIOR_MELHOR ou MENOR_MELHOR',
  })
  @IsNotEmpty({ message: 'polaridade é obrigatória' })
  polaridade: PolaridadeMeta;

  @ApiProperty({
    description: 'Início da meta',
    type: String,
    format: 'date',
  })
  @IsDateString({}, { message: 'inicioDaMeta deve ser uma data válida' })
  @IsNotEmpty({ message: 'inicioDaMeta é obrigatório' })
  inicioDaMeta: string;

  @ApiProperty({
    description: 'Prazo final',
    required: false,
    type: String,
    format: 'date',
  })
  @IsDateString({}, { message: 'prazoFinal deve ser uma data válida' })
  @IsNotEmpty({ message: 'prazoFinal é obrigatório' })
  prazoFinal: string;

  @ApiProperty({
    description: 'Valor de referência da meta',
    required: false,
    type: Number,
    example: 123.45,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'valorMeta deve ser um número com até duas casas decimais' },
  )
  @IsNotEmpty({ message: 'valorMeta é obrigatório' })
  valorMeta: number;

  @ApiProperty({
    description: 'Unidade de medida da meta',
    enum: UnidadeMeta,
    enumName: 'UnidadeMeta',
    example: UnidadeMeta.PORCENTAGEM,
  })
  @IsEnum(UnidadeMeta, { message: 'unidade inválida' })
  @IsNotEmpty({ message: 'unidade é obrigatória' })
  unidade: UnidadeMeta;

  @ApiProperty({
    description: 'Indicador da meta',
    enum: IndicadorMeta,
    enumName: 'IndicadorMeta',
    example: IndicadorMeta.RESULTADO_ACUMULADO,
  })
  @IsEnum(IndicadorMeta, { message: 'indicador inválido' })
  @IsNotEmpty({ message: 'indicador é obrigatório' })
  indicador: IndicadorMeta;
}
