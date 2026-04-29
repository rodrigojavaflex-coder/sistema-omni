import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsEmail } from 'class-validator';

export class PasswordResetConfirmDto {
  @ApiProperty({ description: 'E-mail utilizado na solicitação' })
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ description: 'Código de 6 dígitos recebido por e-mail', example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'O código deve ter 6 dígitos' })
  code: string;

  @ApiProperty({
    description: 'Nova senha',
    minLength: 6,
    maxLength: 50,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
    message: 'A senha deve conter pelo menos uma letra e um número',
  })
  newPassword: string;

  @ApiProperty({ description: 'Confirmação da nova senha' })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  confirmPassword: string;
}
