// src/app/models/combustivel.enum.ts
var Combustivel;
(function(Combustivel2) {
  Combustivel2["DIESEL_S_500"] = "Diesel S-500";
  Combustivel2["DIESEL_S_10"] = "Diesel S-10";
  Combustivel2["ELETRICO"] = "Eletrico";
  Combustivel2["GNV"] = "GNV (G\xE1s Natural)";
})(Combustivel || (Combustivel = {}));
function exigePercentualNivel(combustivel) {
  return combustivel === Combustivel.ELETRICO || combustivel === Combustivel.GNV;
}
function rotuloPercentualNivel(combustivel, opcoes) {
  const comPercentual = opcoes?.prefixoPercentual !== false;
  if (combustivel === Combustivel.GNV) {
    return comPercentual ? "% GNV (G\xE1s Natural)" : "GNV (G\xE1s Natural)";
  }
  return comPercentual ? "% Bateria" : "Bateria";
}
function mensagemPercentualNivelObrigatorio(combustivel) {
  if (combustivel === Combustivel.GNV) {
    return "Informe o percentual de GNV (0 a 100) para ve\xEDculo GNV (G\xE1s Natural).";
  }
  return "Informe a bateria (0 a 100) para ve\xEDculo el\xE9trico.";
}

export {
  exigePercentualNivel,
  rotuloPercentualNivel,
  mensagemPercentualNivelObrigatorio
};
//# sourceMappingURL=chunk-GBM6MIDD.js.map
