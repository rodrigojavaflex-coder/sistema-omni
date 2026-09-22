export interface SosSessaoIrregularidadeResumo {
  id: string;
  numeroIrregularidade?: number;
  nomeArea: string;
  nomeComponente: string;
  descricaoSintoma: string;
  qtdFotos: number;
  qtdAudios: number;
  exigeFoto: boolean;
}

export interface SosSessaoAberta {
  id: string;
  idVeiculo: string;
  idMotorista: string;
  odometro: number;
  porcentagembateria: number | null;
  datavistoria: string;
  numeroVistoria?: number;
  veiculoDescricao?: string;
  veiculoPlaca?: string;
  veiculoCombustivel?: string;
  motoristaNome?: string;
  irregularidades: SosSessaoIrregularidadeResumo[];
}

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
  origem?: string | null;
  veiculo?: {
    descricao?: string;
    placa?: string;
    combustivel?: string;
    idModelo?: string | null;
  };
  motorista?: { nome?: string; matricula?: string };
  numeroVistoria?: number;
  erpStatus?: StatusErpVistoria;
  erpNumeroVistoria?: string | null;
  erpEnviadoEm?: string | null;
  erpUltimoErro?: string | null;
  erpElegivel?: boolean;
}

/** Resumo de irregularidade (GET /vistoria/:id/irregularidades) */
export interface IrregularidadeResumo {
  id: string;
  numeroIrregularidade?: number;
  idvistoria?: string;
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
  marcacao?: {
    idVista: string;
    descricaoVista: string;
    posXPct: number;
    posYPct: number;
    ordem?: number;
  } | null;
  marcacoes?: Array<{
    idVista: string;
    descricaoVista: string;
    posXPct: number;
    posYPct: number;
    ordem?: number;
  }>;
  exigeMarcacaoMapa?: boolean;
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

export type StatusErpVistoria = 'NAO_APLICA' | 'PENDENTE' | 'ENVIADO' | 'FALHA';

export interface ErpVistoriaStatus {
  ativo: boolean;
}

export interface EnviarErpVistoriaItem {
  id: string;
  resultado: 'ENVIADO' | 'FALHA' | 'IGNORADA';
  erpNumeroVistoria?: string;
  erro?: string;
}

export interface EnviarErpVistoriaResposta {
  enviadas: number;
  falhas: number;
  ignoradas: number;
  itens: EnviarErpVistoriaItem[];
}
