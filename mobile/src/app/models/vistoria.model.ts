export interface Vistoria {
  id: string;
  numeroVistoria?: number;
  idUsuario?: string;
  idVeiculo: string;
  idMotorista: string;
  odometro: number;
  porcentagembateria?: number | null;
  datavistoria: string;
  tempo: number;
  observacao?: string;
  status?: string;
  veiculo?: {
    descricao?: string;
    placa?: string;
    combustivel?: string;
    idModelo?: string;
    modeloVeiculo?: { id: string; nome: string };
  };
  motorista?: { nome?: string; matricula?: string };
}
