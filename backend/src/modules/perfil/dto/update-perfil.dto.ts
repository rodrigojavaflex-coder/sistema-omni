import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePerfilDto } from './create-perfil.dto';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Permission } from '../../../common/enums/permission.enum';

export class UpdatePerfilDto extends PartialType(OmitType(CreatePerfilDto, ['permissoes'] as const)) {
  @IsOptional()
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissoes?: Permission[];
}