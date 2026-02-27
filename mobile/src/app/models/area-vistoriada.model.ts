export interface AreaVistoriada {
  id: string;
  nome: string;
  ordemVisual?: number;
  ativo?: boolean;
}

export interface AreaComponente {
  id: string;
  idArea: string;
  idComponente: string;
  ordemVisual?: number;
  componente?: { id: string; nome: string; ativo?: boolean };
}
