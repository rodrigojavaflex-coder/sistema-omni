import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateEmpresaTerceiraDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(300, { message: 'Descrição não pode ter mais de 300 caracteres' })
  descricao: string;
}
