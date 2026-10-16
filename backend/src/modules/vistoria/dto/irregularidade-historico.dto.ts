import { ApiProperty } from '@nestjs/swagger';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';

export class IrregularidadeHistoricoDto {
  @ApiProperty({ description: 'ID do evento de histórico', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Origem do evento no histórico consolidado',
    enum: ['OMNI', 'BRT'],
    default: 'OMNI',
  })
  origem: 'OMNI' | 'BRT';

  @ApiProperty({
    description: 'Status de origem (fluxo OMNI)',
    enum: StatusIrregularidade,
    required: false,
  })
  statusOrigem?: StatusIrregularidade;

  @ApiProperty({
    description: 'Status de destino (fluxo OMNI); ausente em eventos só BRT',
    enum: StatusIrregularidade,
    required: false,
  })
  statusDestino?: StatusIrregularidade;

  @ApiProperty({
    description: 'Situação textual da OS na BRT (eventos origem=BRT)',
    required: false,
  })
  statusBrt?: string;

  @ApiProperty({ description: 'Ação executada' })
  acao: string;

  @ApiProperty({ description: 'Data/hora do evento' })
  dataEvento: string;

  @ApiProperty({
    description: 'ID do usuário que executou a ação',
    required: false,
  })
  idUsuario?: string;

  @ApiProperty({
    description: 'Nome do usuário que executou a ação',
    required: false,
  })
  usuarioNome?: string;

  @ApiProperty({ description: 'Observação do evento', required: false })
  observacao?: string;

  @ApiProperty({
    description:
      'Tempo em milissegundos na etapa OMNI (somente eventos origem=OMNI)',
    required: false,
  })
  tempoEtapaMs?: number;

  @ApiProperty({
    description: 'numOs BRT associado (quando aplicável)',
    required: false,
  })
  numOsExterno?: number;
}
