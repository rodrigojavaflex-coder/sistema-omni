export interface VistoriaResumo {
  id: string;
  idVeiculo: string;
  idMotorista: string;
  idUsuario?: string;
  odometro: number;
  porcentagembateria: number;
  datavistoria: string;
  tempo: number;
  observacao?: string;
  status?: string;
  veiculo?: { descricao?: string; placa?: string };
  motorista?: { nome?: string; matricula?: string };
  tipoVistoria?: { descricao?: string };
}

export interface ChecklistItemResumo {
  iditemvistoriado: string;
  descricaoItem?: string;
  sequencia?: number;
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
