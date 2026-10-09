export interface EmpresaTerceira {
  id: string;
  descricao: string;
  emailsRelatorio?: string;
  ehEmpresaManutencao: boolean;
  /** Allowlist de combustíveis; vazio = sem restrição. */
  combustiveisAtendidos?: string[];
  /** Allowlist de IDs de área; vazio = sem restrição. */
  idsAreasAtendidas?: string[];
  integracaoManutencao?: 'NENHUMA' | 'BRT_OS';
  enviarEmailRelatorio?: boolean;
  brtUrlBase?: string;
  brtTenEmp?: string;
  brtAmbiente?: string;
  brtAllowInsecureTls?: boolean;
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
  combustiveisAtendidos?: string[];
  idsAreasAtendidas?: string[];
  integracaoManutencao?: 'NENHUMA' | 'BRT_OS';
  enviarEmailRelatorio?: boolean;
  brtUrlBase?: string;
  brtTenEmp?: string;
  brtToken?: string;
  brtAmbiente?: string;
  brtAllowInsecureTls?: boolean;
  brtNomSol?: string;
  brtTelCtt?: string;
  brtLocAtd?: string;
}

export interface UpdateEmpresaTerceiraDto
  extends Partial<CreateEmpresaTerceiraDto> {}
