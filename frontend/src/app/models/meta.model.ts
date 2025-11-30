export interface Meta {
  id: string;
  nomeDaMeta: string;
  departamentoId: string;
  departamento?: { id: string; nomeDepartamento: string };
  descricaoDetalhada?: string;
  prazoFinal?: string;
  meta?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateMetaDto {
  nomeDaMeta: string;
  departamentoId: string;
  descricaoDetalhada?: string;
  prazoFinal?: string;
  meta?: number;
}

export interface UpdateMetaDto extends Partial<CreateMetaDto> {}
