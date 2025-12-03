import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateMetaExecucaoDto {
  @ApiProperty({
    description: 'Data de realização',
    type: String,
    format: 'date',
  })
  @IsDateString({}, { message: 'dataRealizado deve ser uma data válida' })
  @IsNotEmpty({ message: 'dataRealizado é obrigatório' })
  dataRealizado: string;

  @ApiProperty({ description: 'Valor realizado', type: Number, example: 45.67 })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: 'valorRealizado deve ser um número com até duas casas decimais',
    },
  )
  @IsNotEmpty({ message: 'valorRealizado é obrigatório' })
  valorRealizado: number;

  @ApiProperty({
    description: 'Justificativa',
    required: false,
    maxLength: 1000,
  })
  @IsString()
  @MaxLength(1000, {
    message: 'justificativa não pode exceder 1000 caracteres',
  })
  @IsOptional()
  justificativa?: string;
}
