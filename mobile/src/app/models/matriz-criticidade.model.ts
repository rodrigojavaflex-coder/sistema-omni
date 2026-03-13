import { Sintoma } from './sintoma.model';

export type GravidadeCriticidade = 'VERDE' | 'AMARELO' | 'VERMELHO';

export interface MatrizCriticidade {
  id: string;
  idComponente: string;
  idSintoma: string;
  gravidade: GravidadeCriticidade;
  exigeFoto: boolean;
  permiteAudio: boolean;
  permiteNovaIrregularidadeSeJaExiste?: boolean;
  sintoma?: Sintoma;
}
