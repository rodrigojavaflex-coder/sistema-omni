import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class AtivarCompartilhamentoDto {
  @ApiPropertyOptional({
    description: 'Data/hora de expiração opcional do link público (ISO 8601)',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsISO8601({}, { message: 'Data de expiração inválida' })
  compartilhamentoExpiraEm?: string;
}
