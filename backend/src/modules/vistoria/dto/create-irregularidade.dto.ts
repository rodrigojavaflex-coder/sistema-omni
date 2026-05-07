import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/** Normaliza entrada de texto antes de validar obrigatoriedade (espaços não contam). */
function trimLeadingTrailingWhitespace(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

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

  @ApiProperty({
    description:
      'Descrição do problema relatada pelo vistoriador (obrigatória; espaços só nas extremidades são ignorados).',
    example: 'Vazamento de óleo visível próximo ao cárter.',
  })
  @Transform(({ value }) => trimLeadingTrailingWhitespace(value))
  @IsString({ message: 'A descrição do problema deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição do problema é obrigatória.' })
  observacao: string;
}
