export interface ItemVistoriado {
  id: string;
  descricao: string;
  sequencia: number;
  tiposVistorias: string[];
  obrigafoto: boolean;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateItemVistoriadoDto {
  descricao: string;
  sequencia: number;
  tiposvistorias: string[];
  obrigafoto?: boolean;
  ativo?: boolean;
}

export interface UpdateItemVistoriadoDto extends Partial<CreateItemVistoriadoDto> {}
