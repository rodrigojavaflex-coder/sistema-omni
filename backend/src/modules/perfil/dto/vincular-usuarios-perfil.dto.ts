import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class VincularUsuariosPerfilDto {
  @ApiProperty({
    description: 'IDs dos usuários que receberão o perfil (adição ao vínculo existente)',
    type: [String],
    example: ['uuid-usuario-1', 'uuid-usuario-2'],
  })
  @IsArray({ message: 'usuarioIds deve ser uma lista de IDs' })
  @ArrayNotEmpty({ message: 'Selecione ao menos um usuário' })
  @IsUUID('4', { each: true, message: 'Cada usuário deve ser um UUID válido' })
  usuarioIds: string[];
}
