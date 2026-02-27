import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateComponenteDto {
  @ApiProperty({ description: 'Nome do componente', maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ description: 'Componente ativo', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
