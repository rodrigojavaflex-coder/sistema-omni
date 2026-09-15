import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class EnviarErpVistoriaDto {
  @ApiProperty({
    description: 'IDs das vistorias (capa) a enviar ao ERP',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  ids: string[];
}
