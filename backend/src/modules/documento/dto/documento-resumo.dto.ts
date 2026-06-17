import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusDocumento } from '../../../common/enums/status-documento.enum';

class TipoDocumentoResumoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;
}

class DepartamentoResumoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nomeDepartamento: string;
}

class ResponsavelResumoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;
}

export class DocumentoResumoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nomeDocumento: string;

  @ApiProperty({ type: TipoDocumentoResumoDto })
  tipoDocumento: TipoDocumentoResumoDto;

  @ApiProperty({ type: DepartamentoResumoDto })
  departamento: DepartamentoResumoDto;

  @ApiProperty({ type: ResponsavelResumoDto })
  responsavel: ResponsavelResumoDto;

  @ApiProperty({ enum: StatusDocumento })
  status: StatusDocumento;

  @ApiProperty()
  nomeArquivo: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  tamanho: number;

  @ApiProperty()
  compartilhamentoAtivo: boolean;

  @ApiPropertyOptional()
  compartilhamentoExpiraEm?: Date | null;

  @ApiPropertyOptional()
  tokenPublico?: string | null;

  @ApiProperty()
  criadoEm: Date;

  @ApiProperty()
  atualizadoEm: Date;
}

export class DocumentoPublicoResumoDto {
  @ApiProperty()
  nomeDocumento: string;

  @ApiProperty()
  nomeArquivo: string;

  @ApiProperty({ description: 'Nome do tipo de documento (para nome padrão do arquivo)' })
  tipoDocumento: string;

  @ApiProperty({ description: 'Nome do departamento (para nome padrão do arquivo)' })
  departamento: string;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  tamanho: number;
}
