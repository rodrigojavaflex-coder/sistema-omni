export interface ModeloVeiculo {
  id: string;
  nome: string;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateModeloVeiculoDto {
  nome: string;
  ativo?: boolean;
}

export interface UpdateModeloVeiculoDto extends Partial<CreateModeloVeiculoDto> {}
