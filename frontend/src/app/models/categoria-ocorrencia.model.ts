import { OrigemOcorrencia } from './origem-ocorrencia.model';

export interface CategoriaOcorrencia {
  id: string;
  descricao: string;
  idOrigem: string;
  origem?: OrigemOcorrencia;
  responsavel?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateCategoriaOcorrenciaDto {
  descricao: string;
  idOrigem: string;
  responsavel?: string;
}

export interface UpdateCategoriaOcorrenciaDto
  extends Partial<CreateCategoriaOcorrenciaDto> {}
