import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmpresaTerceiraDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(300, { message: 'Descrição não pode ter mais de 300 caracteres' })
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Emails para relatório não pode ter mais de 2000 caracteres' })
  emailsRelatorio?: string;

  @IsOptional()
  @IsBoolean({ message: 'Campo empresa de manutenção deve ser verdadeiro ou falso' })
  ehEmpresaManutencao?: boolean;
}
