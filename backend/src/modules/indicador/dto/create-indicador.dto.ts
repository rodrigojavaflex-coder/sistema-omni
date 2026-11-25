import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateIndicadorDto {
  @ApiProperty({ description: 'Nome do indicador', maxLength: 200 })
  @IsString()
  @IsNotEmpty({ message: 'nomeIndicador é obrigatório' })
  @MaxLength(200, { message: 'nomeIndicador não pode exceder 200 caracteres' })
  nomeIndicador: string;

  @ApiProperty({ description: 'Departamento responsável', format: 'uuid' })
  @IsUUID('4', { message: 'departamentoId inválido' })
  @IsNotEmpty({ message: 'departamentoId é obrigatório' })
  departamentoId: string;

  @ApiProperty({
    description: 'Unidade de medida (texto livre)',
    example: 'PASSAGEIROS',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'unidadeMedida é obrigatória' })
  @MaxLength(50, { message: 'unidadeMedida não pode exceder 50 caracteres' })
  unidadeMedida: string;

  @ApiProperty({
    description: 'Tipo do indicador (texto livre)',
    example: 'QUANTIDADE',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty({ message: 'tipoIndicador é obrigatório' })
  @MaxLength(30, { message: 'tipoIndicador não pode exceder 30 caracteres' })
  tipoIndicador: string;

  @ApiProperty({
    description: 'Detalhes consolidados (definição, fonte, regra, observações)',
    required: false,
  })
  @IsOptional()
  @IsString()
  detalheIndicador?: string | null;

  @ApiProperty({ description: 'Indicador ativo', required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: 'ativo deve ser boolean' })
  ativo?: boolean;

  @ApiProperty({
    description: 'Ordem de exibição',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'ordemExibicao deve ser um inteiro' })
  @Min(0, { message: 'ordemExibicao deve ser >= 0' })
  ordemExibicao?: number | null;
}
