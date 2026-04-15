import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIrregularidadeDto {
  @ApiProperty({ description: 'Observação', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
