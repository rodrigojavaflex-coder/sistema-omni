import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class ChecklistImagemDto {
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

export class CreateChecklistItemDto {
  @ApiProperty({ description: 'ID do item vistoriado', format: 'uuid' })
  @IsUUID()
  iditemvistoriado: string;

  @ApiProperty({ description: 'Item conforme' })
  @IsBoolean()
  conforme: boolean;

  @ApiProperty({ description: 'Observação do item', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({
    description: 'Imagens do item',
    type: [ChecklistImagemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistImagemDto)
  imagens?: ChecklistImagemDto[];
}
