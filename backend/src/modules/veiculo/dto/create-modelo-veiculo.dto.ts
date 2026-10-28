import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateModeloVeiculoDto {
  @ApiProperty({ description: 'Nome do modelo', maxLength: 80 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  nome: string;

  @ApiProperty({
    description: 'Descrição detalhada do modelo',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  descricaoDetalhada?: string | null;

  @ApiProperty({ description: 'Modelo ativo', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
