export interface VistaVeiculo {
  id: string;
  descricao: string;
  ativo: boolean;
  ordem: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateVistaVeiculoDto {
  descricao: string;
  ativo?: boolean;
  ordem?: number;
}

export interface UpdateVistaVeiculoDto extends Partial<CreateVistaVeiculoDto> {}
