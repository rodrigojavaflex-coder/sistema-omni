import { ApiProperty } from '@nestjs/swagger';

export class PasswordResetMessageDto {
  @ApiProperty({ example: 'Se o e-mail estiver cadastrado, enviaremos um código de verificação.' })
  message: string;
}
