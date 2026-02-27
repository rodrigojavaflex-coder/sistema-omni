import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateIrregularidadeDto {
  @ApiProperty({ description: 'ID da área', format: 'uuid' })
  @IsUUID()
  idarea: string;

  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @IsUUID()
  idcomponente: string;

  @ApiProperty({ description: 'ID do sintoma', format: 'uuid' })
  @IsUUID()
  idsintoma: string;

  @ApiProperty({ description: 'Observação', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
