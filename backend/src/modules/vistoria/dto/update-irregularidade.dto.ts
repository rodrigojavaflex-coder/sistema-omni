import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateIrregularidadeDto {
  @ApiProperty({ description: 'Observação', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;

  @ApiProperty({ description: 'Irregularidade resolvida', required: false })
  @IsOptional()
  @IsBoolean()
  resolvido?: boolean;
}
