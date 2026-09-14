export enum Combustivel {
  DIESEL_S_500 = 'Diesel S-500',
  DIESEL_S_10 = 'Diesel S-10',
  ELETRICO = 'Eletrico',
  GNV = 'GNV (Gás Natural)',
}

export const ROTULO_COLUNA_PERCENTUAL_NIVEL = 'Bateria/GNV';

export function exigePercentualNivel(
  combustivel?: string | null,
): boolean {
  return (
    combustivel === Combustivel.ELETRICO || combustivel === Combustivel.GNV
  );
}

export function rotuloPercentualNivel(
  combustivel?: string | null,
  opcoes?: { prefixoPercentual?: boolean },
): string {
  const comPercentual = opcoes?.prefixoPercentual !== false;
  if (combustivel === Combustivel.GNV) {
    return comPercentual ? '% GNV (Gás Natural)' : 'GNV (Gás Natural)';
  }
  return comPercentual ? '% Bateria' : 'Bateria';
}

export function mensagemPercentualNivelObrigatorio(
  combustivel?: string | null,
): string {
  if (combustivel === Combustivel.GNV) {
    return 'Informe o percentual de GNV (0 a 100) para veículo GNV (Gás Natural).';
  }
  return 'Informe a bateria (0 a 100) para veículo elétrico.';
}
