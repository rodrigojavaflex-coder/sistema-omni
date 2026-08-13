export interface EmpresaTerceira {
  id: string;
  descricao: string;
  emailsRelatorio?: string;
  ehEmpresaManutencao: boolean;
  integracaoManutencao?: 'NENHUMA' | 'BRT_OS';
  enviarEmailRelatorio?: boolean;
  brtUrlBase?: string;
  brtTenEmp?: string;
  brtAmbiente?: string;
  brtNomSol?: string;
  brtTelCtt?: string;
  brtLocAtd?: string;
  brtToken?: string;
  brtTokenConfigured?: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateEmpresaTerceiraDto {
  descricao: string;
  emailsRelatorio?: string;
  ehEmpresaManutencao?: boolean;
  integracaoManutencao?: 'NENHUMA' | 'BRT_OS';
  enviarEmailRelatorio?: boolean;
  brtUrlBase?: string;
  brtTenEmp?: string;
  brtToken?: string;
  brtAmbiente?: string;
  brtNomSol?: string;
  brtTelCtt?: string;
  brtLocAtd?: string;
}

export interface UpdateEmpresaTerceiraDto
  extends Partial<CreateEmpresaTerceiraDto> {}
