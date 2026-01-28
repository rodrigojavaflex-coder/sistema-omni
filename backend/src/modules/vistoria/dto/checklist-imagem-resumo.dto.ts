import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ChecklistImagemResumoItemDto {
  @ApiProperty({ description: 'Nome do arquivo' })
  @IsString()
  @IsNotEmpty()
  nomeArquivo: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  tamanho: number;

  @ApiProperty({ description: 'Conteúdo em base64 (sem data URI)' })
  @IsString()
  @IsNotEmpty()
  dadosBase64: string;
}

export class ChecklistImagemResumoDto {
  @ApiProperty({ description: 'ID do item vistoriado', format: 'uuid' })
  @IsUUID()
  iditemvistoriado: string;

  @ApiProperty({ description: 'Imagens do item', type: [ChecklistImagemResumoItemDto] })
  @IsArray()
  imagens: ChecklistImagemResumoItemDto[];
}
