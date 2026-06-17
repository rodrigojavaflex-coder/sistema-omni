export interface TipoDocumento {
  id: string;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateTipoDocumentoDto {
  nome: string;
  descricao?: string;
  ativo?: boolean;
}

export interface UpdateTipoDocumentoDto {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}
