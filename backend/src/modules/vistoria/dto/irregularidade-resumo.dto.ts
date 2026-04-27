import { ApiProperty } from '@nestjs/swagger';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';
import { GravidadeCriticidade } from '../../../common/enums/gravidade-criticidade.enum';

export class IrregularidadeMidiaResumoDto {
  @ApiProperty({ description: 'ID da mídia', format: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Nome do arquivo' })
  nomeArquivo: string;

  @ApiProperty({ description: 'Mime type da mídia' })
  mimeType: string;

  @ApiProperty({ description: 'Conteúdo em base64' })
  dadosBase64: string;
}

export class IrregularidadeResumoDto {
  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'ID da vistoria associada à irregularidade',
    format: 'uuid',
    required: false,
  })
  idvistoria?: string;

  @ApiProperty({
    description: 'Número único da irregularidade (ano + sequencial)',
    example: 20261,
  })
  numeroIrregularidade: number;

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

  @ApiProperty({
    description: 'Status atual da irregularidade',
    enum: StatusIrregularidade,
  })
  statusAtual: StatusIrregularidade;

  @ApiProperty({ description: 'Atualizado em' })
  atualizadoEm: string;

  @ApiProperty({ description: 'Criado em' })
  criadoEm: string;

  @ApiProperty({
    description: 'Data de entrada no status atual da irregularidade',
    required: false,
  })
  entradaStatusEm?: string;

  @ApiProperty({
    description: 'ID do veículo da vistoria associada',
    format: 'uuid',
    required: false,
  })
  idVeiculo?: string;

  @ApiProperty({
    description: 'Gravidade da irregularidade pela matriz de criticidade',
    enum: GravidadeCriticidade,
    required: false,
  })
  gravidade?: GravidadeCriticidade;

  @ApiProperty({ description: 'Descrição do veículo', required: false })
  veiculoDescricao?: string;

  @ApiProperty({ description: 'Placa do veículo', required: false })
  veiculoPlaca?: string;

  @ApiProperty({ description: 'Modelo do veículo', required: false })
  veiculoModelo?: string;

  @ApiProperty({ description: 'Nome do vistoriador', required: false })
  vistoriadorNome?: string;

  @ApiProperty({ description: 'Nome do motorista', required: false })
  motoristaNome?: string;

  @ApiProperty({ description: 'Quantidade de fotos', required: false })
  quantidadeFotos?: number;

  @ApiProperty({ description: 'Quantidade de áudios', required: false })
  quantidadeAudios?: number;

  @ApiProperty({
    description: 'Fotos da irregularidade',
    required: false,
    type: () => [IrregularidadeMidiaResumoDto],
  })
  fotos?: IrregularidadeMidiaResumoDto[];

  @ApiProperty({
    description: 'Áudios da irregularidade',
    required: false,
    type: () => [IrregularidadeMidiaResumoDto],
  })
  audios?: IrregularidadeMidiaResumoDto[];
}
