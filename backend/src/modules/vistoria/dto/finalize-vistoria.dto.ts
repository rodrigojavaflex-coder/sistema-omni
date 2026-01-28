import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FinalizeVistoriaDto {
  @ApiProperty({ description: 'Tempo total da vistoria (minutos)' })
  @IsInt()
  @Min(1)
  tempo: number;

  @ApiProperty({ description: 'Observação geral', required: false })
  @IsOptional()
  @IsString()
  observacao?: string;
}
