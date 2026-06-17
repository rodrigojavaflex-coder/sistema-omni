import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StatusDocumento } from '../../../common/enums/status-documento.enum';

export class FindDocumentosDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  tipoDocumentoId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  departamentoId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID('4')
  responsavelId?: string;

  @ApiPropertyOptional({ enum: StatusDocumento })
  @IsOptional()
  @IsEnum(StatusDocumento)
  status?: StatusDocumento;
}
