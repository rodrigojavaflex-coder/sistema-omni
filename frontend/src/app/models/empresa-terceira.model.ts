export interface EmpresaTerceira {
  id: string;
  descricao: string;
  emailsRelatorio?: string;
  ehEmpresaManutencao: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateEmpresaTerceiraDto {
  descricao: string;
  emailsRelatorio?: string;
  ehEmpresaManutencao?: boolean;
}

export interface UpdateEmpresaTerceiraDto
  extends Partial<CreateEmpresaTerceiraDto> {}
