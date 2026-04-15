import { ApiProperty } from '@nestjs/swagger';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';

export class IrregularidadeHistoricoVeiculoMidiaDto {
  @ApiProperty({ description: 'ID da mídia', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Tipo da mídia', enum: ['imagem', 'audio'] })
  tipo: 'imagem' | 'audio';

  @ApiProperty({ description: 'Nome do arquivo' })
  nomeArquivo: string;

  @ApiProperty({ description: 'Mime type do arquivo' })
  mimeType: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  tamanho: number;

  @ApiProperty({
    description: 'Conteúdo base64 da mídia (carregado sob demanda)',
    required: false,
  })
  dadosBase64?: string;

  @ApiProperty({ description: 'Duração do áudio em ms', required: false })
  duracaoMs?: number | null;
}

export class IrregularidadeHistoricoVeiculoItemDto {
  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'ID da vistoria', format: 'uuid' })
  idvistoria: string;

  @ApiProperty({ description: 'Número da vistoria', example: 2026001 })
  numeroVistoria: number;

  @ApiProperty({ description: 'Data da vistoria em ISO string' })
  datavistoria: string;

  @ApiProperty({ description: 'Status da vistoria' })
  statusVistoria: string;

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

  @ApiProperty({ description: 'Observação da irregularidade', required: false })
  observacao?: string;

  @ApiProperty({ description: 'Indica se irregularidade está resolvida' })
  resolvido: boolean;

  @ApiProperty({
    description: 'Status atual da irregularidade',
    enum: StatusIrregularidade,
  })
  statusAtual: StatusIrregularidade;

  @ApiProperty({ description: 'Data de atualização em ISO string' })
  atualizadoEm: string;

  @ApiProperty({
    description: 'Mídias vinculadas à irregularidade',
    type: [IrregularidadeHistoricoVeiculoMidiaDto],
  })
  midias: IrregularidadeHistoricoVeiculoMidiaDto[];
}

export class IrregularidadeHistoricoVeiculoDto {
  @ApiProperty({ description: 'ID do veículo', format: 'uuid' })
  idveiculo: string;

  @ApiProperty({ description: 'Descrição do veículo' })
  veiculo: string;

  @ApiProperty({ description: 'Total de irregularidades não resolvidas' })
  total: number;

  @ApiProperty({ type: [IrregularidadeHistoricoVeiculoItemDto] })
  itens: IrregularidadeHistoricoVeiculoItemDto[];
}
