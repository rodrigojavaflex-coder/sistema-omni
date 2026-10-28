import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';
import { GravidadeCriticidade } from '../../../common/enums/gravidade-criticidade.enum';

export class RelatorioResumoGestaoOsDto {
  @ApiPropertyOptional({
    description:
      'ANALITICA = detalhe por veículo + tabela resumo; SINTETICA = somente tabela resumo',
    enum: ['ANALITICA', 'SINTETICA'],
    default: 'ANALITICA',
  })
  @IsOptional()
  @IsIn(['ANALITICA', 'SINTETICA'])
  tipoImpressao?: 'ANALITICA' | 'SINTETICA';

  @ApiPropertyOptional({
    description:
      'Tela de origem (define a permissão :print_resumo exigida)',
    enum: ['tratamento', 'manutencao', 'validacao-final', 'gestao-os'],
    default: 'gestao-os',
  })
  @IsOptional()
  @IsIn(['tratamento', 'manutencao', 'validacao-final', 'gestao-os'])
  origemTela?: 'tratamento' | 'manutencao' | 'validacao-final' | 'gestao-os';

  @ApiPropertyOptional({
    description: 'Status a incluir (vazio = todos)',
    enum: StatusIrregularidade,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(StatusIrregularidade, { each: true })
  status?: StatusIrregularidade[];

  @ApiPropertyOptional({ description: 'ID do veículo', format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  idVeiculo?: string;

  @ApiPropertyOptional({
    description: 'ID da empresa de manutenção',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  idEmpresaManutencao?: string;

  @ApiPropertyOptional({
    description: 'Gravidades',
    enum: GravidadeCriticidade,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(GravidadeCriticidade, { each: true })
  gravidade?: GravidadeCriticidade[];

  @ApiPropertyOptional({ description: 'Data início (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  dataInicio?: string;

  @ApiPropertyOptional({ description: 'Data fim (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  dataFim?: string;

  @ApiPropertyOptional({
    description: 'Referência do período',
    enum: ['CRIADO_EM', 'ENTRADA_STATUS'],
  })
  @IsOptional()
  @IsIn(['CRIADO_EM', 'ENTRADA_STATUS'])
  referenciaPeriodo?: 'CRIADO_EM' | 'ENTRADA_STATUS';

  @ApiPropertyOptional({
    description:
      'Tempo mínimo na etapa atual em horas (ENTRADA_STATUS)',
    minimum: 0,
    maximum: 87600,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(87600)
  tempoEtapaHorasMin?: number;

  @ApiPropertyOptional({
    description:
      'Tempo máximo na etapa atual em horas (ENTRADA_STATUS)',
    minimum: 0,
    maximum: 87600,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(87600)
  tempoEtapaHorasMax?: number;

  @ApiPropertyOptional({ description: 'Trecho numérico da OS' })
  @IsOptional()
  @IsString()
  ordemServico?: string;

  @ApiPropertyOptional({ description: 'Trecho da OS OMNI (ERP)' })
  @IsOptional()
  @IsString()
  erpCodigoPedido?: string;

  @ApiPropertyOptional({ description: 'Trecho da OS BRT' })
  @IsOptional()
  @IsString()
  numOsExterno?: string;

  @ApiPropertyOptional({ description: 'Trecho do número da vistoria' })
  @IsOptional()
  @IsString()
  numeroVistoria?: string;

  @ApiPropertyOptional({
    description: 'Origem do registro',
    enum: ['SOS_WEB', 'MOBILE'],
  })
  @IsOptional()
  @IsIn(['SOS_WEB', 'MOBILE'])
  origemRegistro?: 'SOS_WEB' | 'MOBILE';

  @ApiPropertyOptional({ description: 'ID da área', format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  idArea?: string;

  @ApiPropertyOptional({ description: 'ID do componente', format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  idComponente?: string;

  @ApiPropertyOptional({ description: 'ID do sintoma', format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  idSintoma?: string;
}
