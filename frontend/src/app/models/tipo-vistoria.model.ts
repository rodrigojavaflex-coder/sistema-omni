export interface TipoVistoria {
  id: string;
  descricao: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateTipoVistoriaDto {
  descricao: string;
  ativo?: boolean;
}

export interface UpdateTipoVistoriaDto extends Partial<CreateTipoVistoriaDto> {}
