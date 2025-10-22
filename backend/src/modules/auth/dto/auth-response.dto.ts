import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../../../common/enums/permission.enum';
import { Usuario } from '../../usuarios/entities/usuario.entity';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de refresh',
    example: 'refresh-token-string',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
    default: 'Bearer',
  })
  token_type: string = 'Bearer';

  @ApiProperty({
    description: 'Tempo de expiração em segundos',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Dados do usuário logado',
  })
  user: Usuario;
}
