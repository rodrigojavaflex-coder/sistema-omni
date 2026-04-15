import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IniciarManutencaoIrregularidadeDto {
  @ApiProperty({
    description: 'Empresa responsável pela manutenção',
    format: 'uuid',
  })
  @IsUUID('4')
  idEmpresaManutencao: string;
}

