import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ReclassificarIrregularidadeDto {
  @ApiProperty({ description: 'ID da área de destino', format: 'uuid' })
  @IsUUID('4')
  idarea: string;

  @ApiProperty({ description: 'ID do componente de destino', format: 'uuid' })
  @IsUUID('4')
  idcomponente: string;

  @ApiProperty({ description: 'ID do sintoma de destino', format: 'uuid' })
  @IsUUID('4')
  idsintoma: string;

  @ApiProperty({
    description: 'Observação opcional da reclassificação',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacao?: string;
}

