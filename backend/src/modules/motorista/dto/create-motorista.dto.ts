import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsDateString, MaxLength, MinLength } from 'class-validator';
import { Sexo } from '../../../common/enums/sexo.enum';
import { Terceirizado } from '../../../common/enums/terceirizado.enum';
import { StatusMotorista } from '../../../common/enums/status-motorista.enum';

export class CreateMotoristaDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(300)
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'Matrícula é obrigatória' })
  @MaxLength(30)
  matricula: string;

  @IsDateString({}, { message: 'Data de nascimento inválida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNascimento: string;

  @IsDateString({}, { message: 'Data de habilitação inválida' })
  @IsNotEmpty({ message: 'Data de habilitação é obrigatória' })
  dataHabilitacao: string;

  @IsDateString({}, { message: 'Validade da habilitação inválida' })
  @IsNotEmpty({ message: 'Validade da habilitação é obrigatória' })
  validadeDaHabilitacao: string;

  @IsDateString({}, { message: 'Data de admissão inválida' })
  @IsNotEmpty({ message: 'Data de admissão é obrigatória' })
  dataAdmissao: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data do curso de transporte inválida' })
  dataCursoTransporte?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data do exame toxicológico inválida' })
  dataExameToxicologico?: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @MinLength(11, { message: 'CPF deve ter 11 caracteres' })
  @MaxLength(14, { message: 'CPF deve ter no máximo 14 caracteres' })
  cpf: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  identidade?: string;

  @IsEnum(Sexo, { message: 'Sexo inválido' })
  @IsOptional()
  sexo?: Sexo;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  endereco?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  bairro?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  cidade?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  cep?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  celular?: string;

  @IsEnum(Terceirizado, { message: 'Terceirizado inválido' })
  @IsOptional()
  terceirizado?: Terceirizado;

  @IsEnum(StatusMotorista, { message: 'Status inválido' })
  @IsOptional()
  status?: StatusMotorista;
}
