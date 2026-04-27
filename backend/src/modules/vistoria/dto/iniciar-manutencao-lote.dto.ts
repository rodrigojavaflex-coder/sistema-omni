import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class IniciarManutencaoLoteDto {
  @ApiProperty({
    description: 'IDs das irregularidades selecionadas',
    type: [String],
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  idsIrregularidades: string[];

  @ApiProperty({
    description: 'Empresa responsável pela manutenção',
    format: 'uuid',
  })
  @IsUUID('4')
  idEmpresaManutencao: string;
}

