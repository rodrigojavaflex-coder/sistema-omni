export interface ModeloVeiculo {
  id: string;
  nome: string;
  descricaoDetalhada?: string | null;
  ativo: boolean;
  /** Km por 1% (GNV/Elétrico) */
  kmPorPercentual?: number | null;
  /** Km por litro (Diesel) */
  kmPorLitro?: number | null;
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
  descricaoDetalhada?: string | null;
  ativo?: boolean;
  kmPorPercentual?: number | null;
  kmPorLitro?: number | null;
}

export interface UpdateModeloVeiculoDto extends Partial<CreateModeloVeiculoDto> {}
