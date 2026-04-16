import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../common/enums/permission.enum';

export class CreatePerfilDto {
  @ApiProperty({ example: 'ADMIN', description: 'Nome único do perfil' })
  @IsString()
  @IsNotEmpty()
  nomePerfil: string;

  @ApiProperty({
    isArray: true,
    enum: Permission,
    example: [Permission.PROFILE_CREATE, Permission.PROFILE_READ],
    description: 'Lista de permissões associadas ao perfil',
  })
  @IsArray()
  @IsString({ each: true })
  permissoes: string[];
}
