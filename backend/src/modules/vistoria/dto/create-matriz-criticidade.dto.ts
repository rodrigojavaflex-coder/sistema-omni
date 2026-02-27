import { ApiProperty } from '@nestjs/swagger';
import {
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

  @ApiProperty({ description: 'Permite áudio', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  permite_audio?: boolean;
}
