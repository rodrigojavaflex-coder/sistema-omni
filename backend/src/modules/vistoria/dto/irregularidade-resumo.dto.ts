import { ApiProperty } from '@nestjs/swagger';

export class IrregularidadeResumoDto {
  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'ID da área', format: 'uuid' })
  idarea: string;

  @ApiProperty({ description: 'Nome da área' })
  nomeArea?: string;

  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  idcomponente: string;

  @ApiProperty({ description: 'Nome do componente' })
  nomeComponente?: string;

  @ApiProperty({ description: 'ID do sintoma', format: 'uuid' })
  idsintoma: string;

  @ApiProperty({ description: 'Descrição do sintoma' })
  descricaoSintoma?: string;

  @ApiProperty({ description: 'Observação', required: false })
  observacao?: string;

  @ApiProperty({ description: 'Irregularidade resolvida' })
  resolvido: boolean;

  @ApiProperty({ description: 'Atualizado em' })
  atualizadoEm: string;
}
