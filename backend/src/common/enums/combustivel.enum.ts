export enum Combustivel {
  DIESEL_S_500 = 'Diesel S-500',
  DIESEL_S_10 = 'Diesel S-10',
  ELETRICO = 'Eletrico',
  GNV = 'GNV (Gás Natural)',
}

export function exigePercentualNivel(
  combustivel?: string | null,
): boolean {
  return (
    combustivel === Combustivel.ELETRICO || combustivel === Combustivel.GNV
  );
}

export function mensagemPercentualNivelObrigatorio(
  combustivel?: string | null,
): string {
  if (combustivel === Combustivel.GNV) {
    return 'Percentual de GNV é obrigatório para veículo GNV (Gás Natural)';
  }
  return 'Percentual de bateria é obrigatório para veículo elétrico';
}
