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
}

/** Resumo de irregularidade (GET /vistoria/:id/irregularidades) */
export interface IrregularidadeResumo {
  id: string;
  idarea: string;
  nomeArea?: string;
  idcomponente: string;
  nomeComponente?: string;
  idsintoma: string;
  descricaoSintoma?: string;
  observacao?: string;
  resolvido: boolean;
  statusAtual?: string;
  idEmpresaManutencao?: string;
  atualizadoEm: string;
}

export interface IrregularidadeImagemItem {
  nomeArquivo: string;
  tamanho: number;
  dadosBase64: string;
}

/** Imagens agrupadas por irregularidade (GET /vistoria/:id/irregularidades/imagens) */
export interface IrregularidadeImagemResumo {
  idirregularidade: string;
  imagens: IrregularidadeImagemItem[];
}

export interface IrregularidadeAudioItem {
  id: string;
  nomeArquivo: string;
  mimeType: string;
  dadosBase64: string;
  duracaoMs?: number | null;
}

/** Áudios por irregularidade com base64 para reprodução (GET /vistoria/:id/irregularidades/audios) */
export interface IrregularidadeAudioResumo {
  idirregularidade: string;
  audios: IrregularidadeAudioItem[];
}
