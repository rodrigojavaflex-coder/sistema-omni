import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class ModeloVeiculoVistaResumoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  idCatalogo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  ordem: number;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  nomeArquivo: string;

  @ApiProperty()
  tamanho: number;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  atualizadoEm: string;
}

export class UpdateModeloVeiculoVistaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  ordem?: number;
}
