export interface AreaModelo {
  id: string;
  idModelo: string;
}

export interface AreaVistoriada {
  id: string;
  nome: string;
  ordemVisual: number;
  ativo: boolean;
  modelos?: AreaModelo[];
  criadoEm?: string;
  atualizadoEm?: string;
}

export interface CreateAreaVistoriadaDto {
  nome: string;
  ordem_visual?: number;
  ativo?: boolean;
  modelos?: string[];
}

export interface UpdateAreaVistoriadaDto extends Partial<CreateAreaVistoriadaDto> {}

export interface AreaComponenteItemDto {
  idcomponente: string;
  ordem_visual?: number;
}

export interface SetAreaComponentesDto {
  componentes: AreaComponenteItemDto[];
}

export interface AreaComponente {
  id: string;
  idArea: string;
  idComponente: string;
  ordemVisual: number;
  componente?: { id: string; nome: string; ativo: boolean };
}

/** Componente com a área em que está vinculado (para modal vincular) */
export interface ComponenteComArea {
  id: string;
  nome: string;
  ativo: boolean;
  idArea: string | null;
  nomeArea: string | null;
}
