import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePerfilDto } from './create-perfil.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePerfilDto extends PartialType(
  OmitType(CreatePerfilDto, ['permissoes'] as const),
) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissoes?: string[];
}
