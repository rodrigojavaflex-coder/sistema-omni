import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateCategoriaOcorrenciaDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(300, { message: 'Descrição não pode ter mais de 300 caracteres' })
  descricao: string;

  @IsUUID('4', { message: 'ID da origem inválido' })
  @IsNotEmpty({ message: 'Origem é obrigatória' })
  idOrigem: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  responsavel?: string;
}
