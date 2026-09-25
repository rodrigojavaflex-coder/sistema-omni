export type TipoVistoria = 'CORRETIVA' | 'PREVENTIVA' | 'SINISTRO';

export const TIPO_VISTORIA_OPCOES: { value: TipoVistoria; label: string }[] = [
  { value: 'CORRETIVA', label: 'Corretiva' },
  { value: 'PREVENTIVA', label: 'Preventiva' },
  { value: 'SINISTRO', label: 'Sinistro' },
];

export function rotuloTipoVistoria(tipo?: TipoVistoria | string | null): string {
  if (tipo === 'SINISTRO') {
    return 'Sinistro';
  }
  if (tipo === 'PREVENTIVA') {
    return 'Preventiva';
  }
  return 'Corretiva';
}
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
  tipo?: TipoVistoria;
  veiculo?: {
    descricao?: string;
    placa?: string;
    combustivel?: string;
    idModelo?: string;
    modeloVeiculo?: { id: string; nome: string };
  };
  motorista?: { nome?: string; matricula?: string };
  erpNumeroVistoria?: string | null;
}
