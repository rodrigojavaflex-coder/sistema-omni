import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TrocarVeiculoEscalaDto {
  @ApiProperty({
    description: 'ID do veículo OMNI que passará a representar esta escala',
  })
  @IsUUID('4')
  @IsNotEmpty()
  idVeiculo: string;
}
