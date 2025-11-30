import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDepartamentoDto {
  @IsString({ message: 'Nome do departamento deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do departamento é obrigatório' })
  @MaxLength(150, { message: 'Nome do departamento não pode exceder 150 caracteres' })
  @MinLength(2, { message: 'Nome do departamento deve ter pelo menos 2 caracteres' })
  nomeDepartamento: string;
}
