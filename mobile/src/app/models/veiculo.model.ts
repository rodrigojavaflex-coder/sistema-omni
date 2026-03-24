export interface Veiculo {
  id: string;
  descricao: string;
  placa: string;
  status: string;
  combustivel?: string;
  idModelo?: string;
  modeloVeiculo?: { id: string; nome: string };
}
