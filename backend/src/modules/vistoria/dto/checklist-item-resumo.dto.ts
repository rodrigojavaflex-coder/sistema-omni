import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChecklistItemResumoDto {
  @ApiProperty({ description: 'ID do item vistoriado', format: 'uuid' })
  @IsUUID()
  iditemvistoriado: string;

  @ApiProperty({ description: 'Descrição do item', required: false })
  @IsOptional()
  @IsString()
  descricaoItem?: string;

  @ApiProperty({ description: 'Sequência do item', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sequencia?: number;

  @ApiProperty({ description: 'Item conforme' })
  @IsBoolean()
  conforme: boolean;

  @ApiProperty({ description: 'Observação do item', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({ description: 'Data de atualização do item' })
  @IsDateString()
  atualizadoEm: string;
}
