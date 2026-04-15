import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NaoProcedeIrregularidadeDto {
  @ApiProperty({
    description: 'Motivo técnico para marcar como não procede',
  })
  @IsString()
  @IsNotEmpty()
  motivoNaoProcede: string;

  @ApiProperty({
    description: 'Observação adicional opcional',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacao?: string;
}

