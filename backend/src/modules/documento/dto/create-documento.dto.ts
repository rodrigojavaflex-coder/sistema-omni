import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { StatusDocumento } from '../../../common/enums/status-documento.enum';

export class CreateDocumentoDto {
  @ApiProperty({ example: 'POP Segurança' })
  @IsString()
  @IsNotEmpty({ message: 'Nome do documento é obrigatório' })
  @MaxLength(300)
  nomeDocumento: string;

  @ApiPropertyOptional({ description: 'Detalhes complementares do documento' })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Detalhes do documento não pode exceder 2000 caracteres' })
  detalhesDocumento?: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { message: 'Tipo de documento inválido' })
  tipoDocumentoId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { message: 'Departamento inválido' })
  departamentoId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { message: 'Responsável inválido' })
  responsavelId: string;

  @ApiPropertyOptional({ enum: StatusDocumento, default: StatusDocumento.ATIVO })
  @IsOptional()
  @IsEnum(StatusDocumento)
  status?: StatusDocumento;
}
