import { ApiProperty } from '@nestjs/swagger';

export class SintomaVistaResumoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  idCatalogo: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  ativo: boolean;
}

export class SintomaModeloResumoDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty({ description: 'Quantidade de vistas cadastradas no modelo' })
  total: number;

  @ApiProperty({ type: [SintomaVistaResumoDto] })
  vistas: SintomaVistaResumoDto[];
}
