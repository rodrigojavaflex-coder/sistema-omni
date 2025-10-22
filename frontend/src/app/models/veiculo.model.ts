export enum Combustivel {
  DIESEL_S_500 = 'Diesel S-500',
  DIESEL_S_10 = 'Diesel S-10',
  ELETRICO = 'Eletrico',
  GNV = 'GNV (Gás Natural)',
}

export interface Veiculo {
  id: string;
  descricao: string;
  placa: string;
  ano: number;
  chassi: string;
  marca: string;
  modelo: string;
  combustivel: Combustivel;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateVeiculoDto {
  descricao: string;
  placa: string;
  ano: number;
  chassi: string;
  marca: string;
  modelo: string;
  combustivel: Combustivel;
}

export interface UpdateVeiculoDto extends Partial<CreateVeiculoDto> {}

export interface FindVeiculoDto {
  page?: number;
  limit?: number;
  descricao?: string;
  placa?: string;
  ano?: number;
}
