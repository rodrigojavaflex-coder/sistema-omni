import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTipoDocumentoDto {
  @ApiProperty({ example: 'POP' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(150, { message: 'Nome não pode ter mais de 150 caracteres' })
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
