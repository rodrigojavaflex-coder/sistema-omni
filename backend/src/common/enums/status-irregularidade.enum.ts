export enum StatusIrregularidade {
  REGISTRADA = 'REGISTRADA',
  /** Reprovada na validação final; aguarda reenvio para manutenção (retrabalho/garantia). */
  RETRABALHO_GARANTIA = 'RETRABALHO_GARANTIA',
  CANCELADA = 'CANCELADA',
  EM_MANUTENCAO = 'EM_MANUTENCAO',
  NAO_PROCEDE = 'NAO_PROCEDE',
  CONCLUIDA = 'CONCLUIDA',
  VALIDADA = 'VALIDADA',
}
