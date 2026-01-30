export interface Vistoria {
  id: string;
  idUsuario?: string;
  idVeiculo: string;
  idMotorista: string;
  idTipoVistoria: string;
  odometro: number;
  porcentagembateria?: number | null;
  datavistoria: string;
  tempo: number;
  observacao?: string;
  status?: string;
  veiculo?: { descricao?: string; placa?: string; combustivel?: string };
  motorista?: { nome?: string; matricula?: string };
  tipoVistoria?: { descricao?: string };
}

export interface ChecklistImagemPayload {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
}

export interface ChecklistItemPayload {
  iditemvistoriado: string;
  conforme: boolean;
  observacao?: string;
  imagens?: ChecklistImagemPayload[];
}

export interface ChecklistItemResumo {
  iditemvistoriado: string;
  conforme: boolean;
  observacao?: string;
  atualizadoEm: string;
}

export interface ChecklistImagemResumoItem {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
}

export interface ChecklistImagemResumo {
  iditemvistoriado: string;
  imagens: ChecklistImagemResumoItem[];
}
