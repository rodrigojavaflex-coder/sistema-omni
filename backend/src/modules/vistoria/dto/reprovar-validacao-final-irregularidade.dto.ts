import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReprovarValidacaoFinalIrregularidadeDto {
  @ApiProperty({
    description: 'Observação obrigatória da reprovação final',
  })
  @IsString()
  @IsNotEmpty()
  observacao: string;
}

