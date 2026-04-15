import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ValidacaoFinalIrregularidadeDto {
  @ApiProperty({
    description: 'Observação da validação final',
    required: false,
  })
  @IsOptional()
  @IsString()
  observacao?: string;
}

