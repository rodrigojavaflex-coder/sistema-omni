import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { GravidadeCriticidade } from '../../../common/enums/gravidade-criticidade.enum';

export class CreateMatrizCriticidadeDto {
  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @IsUUID()
  idcomponente: string;

  @ApiProperty({ description: 'ID do sintoma', format: 'uuid' })
  @IsUUID()
  idsintoma: string;

  @ApiProperty({ description: 'Gravidade', enum: GravidadeCriticidade })
  @IsEnum(GravidadeCriticidade)
  gravidade: GravidadeCriticidade;

  @ApiProperty({ description: 'Exige foto', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  exige_foto?: boolean;

  @ApiProperty({
    description: 'Permite áudio',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  permite_audio?: boolean;

  @ApiProperty({
    description:
      'IDs do catálogo de vistas permitidas. Vazio = todas as vistas do modelo',
    required: false,
    type: [String],
    format: 'uuid',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  id_vistas?: string[];
}
