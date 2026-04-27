import { ApiProperty } from '@nestjs/swagger';

export class RelatorioManutencaoItemDto {
  @ApiProperty({ description: 'ID da irregularidade', format: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Ordem de serviço da irregularidade',
    example: 20261,
  })
  ordemServico: number;

  @ApiProperty({ description: 'Descrição da irregularidade' })
  irregularidade: string;

  @ApiProperty({ description: 'Observação', required: false })
  observacao?: string;

  @ApiProperty({ description: 'Quantidade de imagens incluídas' })
  totalImagens: number;
}

export class RelatorioManutencaoVeiculoDto {
  @ApiProperty({ description: 'Veículo' })
  veiculo: string;

  @ApiProperty({ description: 'Placa', required: false })
  placa?: string;

  @ApiProperty({ description: 'Modelo (cadastro)', required: false })
  modelo?: string;

  @ApiProperty({
    description: 'Itens do veículo',
    type: () => [RelatorioManutencaoItemDto],
  })
  itens: RelatorioManutencaoItemDto[];
}

export class RelatorioManutencaoResumoDto {
  @ApiProperty({
    description: 'Data/hora de emissão do relatório (ISO 8601)',
    example: '2026-04-16T17:35:00.000Z',
  })
  emitidoEm: string;

  @ApiProperty({
    description: 'Nome do usuário que gerou o relatório (quando autenticado)',
    required: false,
  })
  emitidoPor?: string;

  @ApiProperty({ description: 'Empresa de manutenção' })
  empresa: string;

  @ApiProperty({ description: 'Total de irregularidades' })
  totalIrregularidades: number;

  @ApiProperty({ description: 'Total de veículos' })
  totalVeiculos: number;

  @ApiProperty({ description: 'Total de anexos de imagem incluídos no relatório' })
  totalAnexos: number;

  @ApiProperty({
    description: 'Agrupamento por veículo',
    type: () => [RelatorioManutencaoVeiculoDto],
  })
  porVeiculo: RelatorioManutencaoVeiculoDto[];
}

export class RelatorioManutencaoPreviewDto {
  @ApiProperty({
    description: 'Resumo do relatório',
    type: () => RelatorioManutencaoResumoDto,
  })
  resumo: RelatorioManutencaoResumoDto;

  @ApiProperty({
    description: 'HTML completo do relatório para visualização',
  })
  html: string;
}

export class RelatorioManutencaoExecucaoDto extends RelatorioManutencaoPreviewDto {
  @ApiProperty({ description: 'Quantidade de irregularidades enviadas' })
  totalEnviadas: number;

  @ApiProperty({
    description:
      'True quando o SMTP enviou o PDF com sucesso; se o envio falhar, a operação retorna erro e nada é encaminhado para manutenção',
  })
  emailEnviado: boolean;
}

