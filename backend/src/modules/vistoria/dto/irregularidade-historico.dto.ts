import { ApiProperty } from '@nestjs/swagger';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';

export class IrregularidadeHistoricoDto {
  @ApiProperty({ description: 'ID do evento de histórico', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Status de origem',
    enum: StatusIrregularidade,
    required: false,
  })
  statusOrigem?: StatusIrregularidade;

  @ApiProperty({
    description: 'Status de destino',
    enum: StatusIrregularidade,
  })
  statusDestino: StatusIrregularidade;

  @ApiProperty({ description: 'Ação executada' })
  acao: string;

  @ApiProperty({ description: 'Data/hora do evento' })
  dataEvento: string;

  @ApiProperty({ description: 'ID do usuário que executou a ação', required: false })
  idUsuario?: string;

  @ApiProperty({ description: 'Nome do usuário que executou a ação', required: false })
  usuarioNome?: string;

  @ApiProperty({ description: 'Observação do evento', required: false })
  observacao?: string;

  @ApiProperty({
    description: 'Tempo em milissegundos que a irregularidade permaneceu nesta etapa',
    required: false,
  })
  tempoEtapaMs?: number;
}
