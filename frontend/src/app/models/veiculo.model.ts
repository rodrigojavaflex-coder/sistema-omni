import { Combustivel } from './combustivel.enum';

export enum StatusVeiculo {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
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
  status?: StatusVeiculo;
  marcaDaCarroceria?: string;
  modeloDaCarroceria?: string;
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
  status?: StatusVeiculo;
  marcaDaCarroceria?: string;
  modeloDaCarroceria?: string;
}

export interface UpdateVeiculoDto extends Partial<CreateVeiculoDto> {}

export interface FindVeiculoDto {
  page?: number;
  limit?: number;
  descricao?: string;
  placa?: string;
  ano?: number;
  marca?: string;
  modelo?: string;
  combustivel?: string;
  status?: StatusVeiculo;
  marcaDaCarroceria?: string;
  modeloDaCarroceria?: string;
}
