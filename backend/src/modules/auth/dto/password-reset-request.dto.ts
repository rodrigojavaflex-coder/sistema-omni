import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty({ description: 'E-mail de login (login do usuário)', example: 'usuario@exemplo.com' })
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(100)
  email: string;
}
