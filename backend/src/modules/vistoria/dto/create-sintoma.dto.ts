import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSintomaDto {
  @ApiProperty({ description: 'Descrição do sintoma', maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  descricao: string;

  @ApiProperty({ description: 'Sintoma ativo', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @ApiProperty({
    description:
      'Exige marcação no mapa do veículo para qualquer componente que use este sintoma',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  exigeMarcacaoMapa?: boolean;
}
