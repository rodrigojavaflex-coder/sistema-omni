export interface OrigemOcorrencia {
  id: string;
  descricao: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateOrigemOcorrenciaDto {
  descricao: string;
}

export interface UpdateOrigemOcorrenciaDto
  extends Partial<CreateOrigemOcorrenciaDto> {}
