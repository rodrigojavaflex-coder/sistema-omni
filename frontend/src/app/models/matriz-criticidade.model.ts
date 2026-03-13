export type GravidadeCriticidade = 'VERDE' | 'AMARELO' | 'VERMELHO';

export interface MatrizCriticidade {
  id: string;
  idComponente: string;
  idSintoma: string;
  gravidade: GravidadeCriticidade;
  exigeFoto: boolean;
  permiteAudio: boolean;
  permiteNovaIrregularidadeSeJaExiste?: boolean;
  componente?: { id: string; nome: string };
  sintoma?: { id: string; descricao: string };
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateMatrizCriticidadeDto {
  idcomponente: string;
  idsintoma: string;
  gravidade: GravidadeCriticidade;
  exige_foto?: boolean;
  permite_audio?: boolean;
  permite_nova_irregularidade_se_ja_existe?: boolean;
}

export interface UpdateMatrizCriticidadeDto extends Partial<CreateMatrizCriticidadeDto> {}
