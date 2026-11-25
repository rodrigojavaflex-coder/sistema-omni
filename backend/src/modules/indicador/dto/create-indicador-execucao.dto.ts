import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateIndicadorExecucaoDto {
  @ApiProperty({
    description: 'Data de referência do período (primeiro dia do mês)',
    type: String,
    format: 'date',
    example: '2026-01-01',
  })
  @IsDateString({}, { message: 'dataReferencia deve ser uma data válida' })
  @IsNotEmpty({ message: 'dataReferencia é obrigatória' })
  dataReferencia: string;

  @ApiProperty({
    description: 'Valor do indicador no período',
    type: Number,
    example: 1250000.5,
  })
  @IsNumber(
    { maxDecimalPlaces: 4 },
    { message: 'valor deve ser um número com até quatro casas decimais' },
  )
  @IsNotEmpty({ message: 'valor é obrigatório' })
  valor: number;

  @ApiProperty({
    description: 'Justificativa do lançamento/alteração',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: 'justificativa não pode exceder 1000 caracteres',
  })
  justificativa?: string;
}
