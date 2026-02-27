export interface Sintoma {
  id: string;
  descricao: string;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateSintomaDto {
  descricao: string;
  ativo?: boolean;
}

export interface UpdateSintomaDto extends Partial<CreateSintomaDto> {}
