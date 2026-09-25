import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsObject,
  IsInt,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EmailEnvioConfig,
  ErpVistoriaConfig,
} from '../entities/configuracao.entity';

export class CreateConfiguracaoDto {
  @ApiPropertyOptional({
    description: 'Nome do cliente',
    example: 'Farmácia XYZ',
  })
  @IsOptional()
  @IsString()
  nomeCliente?: string;

  @ApiPropertyOptional({
    description:
      'Legado: caminho da logo. Preferir upload multipart; a imagem é persistida em bytea.',
    example: 'db',
  })
  @IsOptional()
  @IsString()
  logoRelatorio?: string;

  @ApiPropertyOptional({
    description: 'Auditar consultas (operações READ)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  auditarConsultas?: boolean;

  @ApiPropertyOptional({
    description: 'Auditar login e logout',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  auditarLoginLogOff?: boolean;

  @ApiPropertyOptional({
    description: 'Auditar criações (operações CREATE)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  auditarCriacao?: boolean;

  @ApiPropertyOptional({
    description: 'Auditar alterações (operações UPDATE)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  auditarAlteracao?: boolean;

  @ApiPropertyOptional({
    description: 'Auditar exclusões (operações DELETE)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  auditarExclusao?: boolean;

  @ApiPropertyOptional({
    description: 'Auditar alterações de senha',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  auditarSenhaAlterada?: boolean;

  @ApiPropertyOptional({
    description:
      'Configuração de faixas de tempo por tela do fluxo (tratamento, manutencao, validacaoFinal)',
  })
  @IsOptional()
  @IsObject()
  tempoFluxoConfig?: any;

  @ApiPropertyOptional({
    description: 'Configuração SMTP para envio de e-mails de relatório',
  })
  @IsOptional()
  @IsObject()
  emailEnvioConfig?: EmailEnvioConfig;

  @ApiPropertyOptional({
    description: 'Configuração da integração ERP de vistoria',
  })
  @IsOptional()
  @IsObject()
  erpVistoriaConfig?: ErpVistoriaConfig;

  @ApiPropertyOptional({
    description:
      'Diferença máxima (km) entre odômetros do veículo. Null/omitido = padrão 500.',
    example: 500,
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999999)
  odometroDiffMaxKm?: number | null;

  @ApiPropertyOptional({
    description:
      'Versão mínima do app mobile (semver x.y.z). Null/vazio = não bloqueia apps antigos.',
    example: '1.3.9',
  })
  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== undefined && value !== '')
  @IsString()
  mobileVersaoMinima?: string | null;
}
