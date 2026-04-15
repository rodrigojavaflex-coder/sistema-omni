import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelarIrregularidadeDto {
  @ApiProperty({
    description: 'Motivo do cancelamento',
    example: 'Irregularidade informada por engano',
  })
  @IsString()
  @IsNotEmpty()
  motivo: string;
}

