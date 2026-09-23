import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IntegracaoManutencaoEmpresa } from '../../../common/enums/integracao-manutencao-empresa.enum';

export class CreateEmpresaTerceiraDto {
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(300, { message: 'Descrição não pode ter mais de 300 caracteres' })
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Emails para relatório não pode ter mais de 2000 caracteres',
  })
  emailsRelatorio?: string;

  @IsOptional()
  @IsBoolean({
    message: 'Campo empresa de manutenção deve ser verdadeiro ou falso',
  })
  ehEmpresaManutencao?: boolean;

  @IsOptional()
  @IsEnum(IntegracaoManutencaoEmpresa)
  integracaoManutencao?: IntegracaoManutencaoEmpresa;

  @IsOptional()
  @IsBoolean()
  enviarEmailRelatorio?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  brtUrlBase?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  brtTenEmp?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  brtToken?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  brtAmbiente?: string;

  @IsOptional()
  @IsBoolean()
  brtAllowInsecureTls?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  brtNomSol?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  brtTelCtt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  brtLocAtd?: string;
}
