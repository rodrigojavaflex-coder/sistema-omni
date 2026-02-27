export interface Veiculo {
  id: string;
  descricao: string;
  placa: string;
  status: string;
  combustivel?: string;
  modelo?: string | null;
  idModelo?: string;
  modeloVeiculo?: { id: string; nome: string };
}
