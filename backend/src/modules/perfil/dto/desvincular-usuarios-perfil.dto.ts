import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class DesvincularUsuariosPerfilDto {
  @ApiProperty({
    description: 'IDs dos usuários que terão o perfil removido',
    type: [String],
    example: ['uuid-usuario-1'],
  })
  @IsArray({ message: 'usuarioIds deve ser uma lista de IDs' })
  @ArrayNotEmpty({ message: 'Selecione ao menos um usuário' })
  @IsUUID('4', { each: true, message: 'Cada usuário deve ser um UUID válido' })
  usuarioIds: string[];
}
