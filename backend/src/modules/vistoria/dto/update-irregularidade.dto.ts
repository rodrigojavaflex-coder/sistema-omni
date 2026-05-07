import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

/** Normaliza entrada de texto antes de validar obrigatoriedade (espaços não contam). */
function trimLeadingTrailingWhitespace(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateIrregularidadeDto {
  @ApiProperty({
    description:
      'Descrição do problema na irregularidade (obrigatória nesta atualização; espaços só nas extremidades são ignorados).',
    example: 'Barulho anormal sob aceleração acima de 60 km/h.',
  })
  @Transform(({ value }) => trimLeadingTrailingWhitespace(value))
  @IsString({ message: 'A descrição do problema deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição do problema é obrigatória.' })
  observacao: string;
}
