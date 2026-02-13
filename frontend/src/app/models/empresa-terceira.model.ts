export interface EmpresaTerceira {
  id: string;
  descricao: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateEmpresaTerceiraDto {
  descricao: string;
}

export interface UpdateEmpresaTerceiraDto
  extends Partial<CreateEmpresaTerceiraDto> {}
