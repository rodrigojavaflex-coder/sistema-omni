export interface ModeloVeiculo {
  id: string;
  nome: string;
  ativo: boolean;
  vistas?: ModeloVeiculoVista[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface ModeloVeiculoVista {
  id: string;
  idCatalogo: string;
  descricao: string;
  ordem: number;
  mimeType: string;
  nomeArquivo: string;
  tamanho: number;
  ativo: boolean;
  atualizadoEm: string;
}

export interface CreateModeloVeiculoDto {
  nome: string;
  ativo?: boolean;
}

export interface UpdateModeloVeiculoDto extends Partial<CreateModeloVeiculoDto> {}
