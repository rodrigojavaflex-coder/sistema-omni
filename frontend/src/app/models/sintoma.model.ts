export interface SintomaVistaResumo {
  id: string;
  idCatalogo: string;
  descricao: string;
  ativo: boolean;
}

export interface SintomaModeloResumo {
  id: string;
  nome: string;
  ativo: boolean;
  total: number;
  vistas: SintomaVistaResumo[];
}

export interface Sintoma {
  id: string;
  descricao: string;
  ativo: boolean;
  exigeMarcacaoMapa?: boolean;
  modelos?: SintomaModeloResumo[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateSintomaDto {
  descricao: string;
  ativo?: boolean;
  exigeMarcacaoMapa?: boolean;
}

export interface UpdateSintomaDto extends Partial<CreateSintomaDto> {}
