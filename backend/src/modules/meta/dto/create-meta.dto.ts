import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID, IsDateString, IsInt } from 'class-validator';

export class CreateMetaDto {
  @ApiProperty({ description: 'Nome da meta', maxLength: 200 })
  @IsString()
  @IsNotEmpty({ message: 'nomeDaMeta é obrigatório' })
  @MaxLength(200, { message: 'nomeDaMeta não pode exceder 200 caracteres' })
  nomeDaMeta: string;

  @ApiProperty({ description: 'Departamento associado', format: 'uuid' })
  @IsUUID('4', { message: 'departamentoId inválido' })
  @IsNotEmpty({ message: 'departamentoId é obrigatório' })
  departamentoId: string;

  @ApiProperty({ description: 'Descrição detalhada', required: false })
  @IsString()
  @IsNotEmpty({ message: 'descricaoDetalhada é obrigatória' })
  descricaoDetalhada: string;

  @ApiProperty({ description: 'Prazo final', required: false, type: String, format: 'date' })
  @IsDateString({}, { message: 'prazoFinal deve ser uma data válida' })
  @IsNotEmpty({ message: 'prazoFinal é obrigatório' })
  prazoFinal: string;

  @ApiProperty({ description: 'Meta numérica', required: false, type: Number })
  @IsInt({ message: 'meta deve ser um número inteiro' })
  @IsNotEmpty({ message: 'meta é obrigatória' })
  meta: number;
}
