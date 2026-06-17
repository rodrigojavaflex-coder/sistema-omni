export enum StatusDocumento {
  ATIVO = 'ATIVO',
  EM_REVISAO = 'EM_REVISAO',
  OBSOLETO = 'OBSOLETO',
  ARQUIVADO = 'ARQUIVADO',
}

export const STATUS_DOCUMENTO_LABELS: Record<StatusDocumento, string> = {
  [StatusDocumento.ATIVO]: 'Ativo',
  [StatusDocumento.EM_REVISAO]: 'Em Revisão',
  [StatusDocumento.OBSOLETO]: 'Obsoleto',
  [StatusDocumento.ARQUIVADO]: 'Arquivado',
};

export interface DocumentoResumo {
  id: string;
  nomeDocumento: string;
  tipoDocumento: { id: string; nome: string };
  departamento: { id: string; nomeDepartamento: string };
  responsavel: { id: string; nome: string };
  status: StatusDocumento;
  nomeArquivo: string;
  mimeType: string;
  tamanho: number;
  compartilhamentoAtivo: boolean;
  compartilhamentoExpiraEm?: string | null;
  tokenPublico?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DocumentoPublicoResumo {
  nomeDocumento: string;
  nomeArquivo: string;
  tipoDocumento: string;
  departamento: string;
  mimeType: string;
  tamanho: number;
}

export interface CreateDocumentoPayload {
  nomeDocumento: string;
  tipoDocumentoId: string;
  departamentoId: string;
  responsavelId: string;
  status?: StatusDocumento;
  arquivo: File;
}

export interface UpdateDocumentoPayload {
  nomeDocumento?: string;
  tipoDocumentoId?: string;
  departamentoId?: string;
  responsavelId?: string;
  status?: StatusDocumento;
}

export interface DocumentoFilters {
  nome?: string;
  tipoDocumentoId?: string;
  departamentoId?: string;
  responsavelId?: string;
  status?: StatusDocumento;
}

export interface AtivarCompartilhamentoPayload {
  compartilhamentoExpiraEm?: string;
}

export const DOCUMENTO_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
