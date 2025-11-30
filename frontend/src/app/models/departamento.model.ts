export interface Departamento {
  id: string;
  nomeDepartamento: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateDepartamentoDto {
  nomeDepartamento: string;
}

export interface UpdateDepartamentoDto {
  nomeDepartamento?: string;
}
