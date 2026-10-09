import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class RelatorioIrregularidadesLoteDto {
  @ApiProperty({
    description: 'IDs das irregularidades selecionadas para o relatório PDF',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  idsIrregularidades: string[];
}
