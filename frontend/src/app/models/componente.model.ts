export interface Componente {
  id: string;
  nome: string;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateComponenteDto {
  nome: string;
  ativo?: boolean;
}

export interface UpdateComponenteDto extends Partial<CreateComponenteDto> {}
