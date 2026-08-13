import { IntegracaoManutencaoEmpresa } from '../../common/enums/integracao-manutencao-empresa.enum';
import { EmpresaTerceira } from './entities/empresa-terceira.entity';

export type EmpresaTerceiraResponse = Omit<EmpresaTerceira, 'brtToken'> & {
  brtToken?: string;
  brtTokenConfigured?: boolean;
};

export type EmpresaTerceiraResponseOptions = {
  tokenPresent?: boolean;
  includeIntegracaoConfig?: boolean;
  /** Apenas em GET por id, com permissão de configuração de integração. */
  includeBrtToken?: boolean;
};

export function toEmpresaTerceiraResponse(
  entidade: EmpresaTerceira,
  options?: EmpresaTerceiraResponseOptions,
): EmpresaTerceiraResponse {
  const includeIntegracao = options?.includeIntegracaoConfig === true;
  const includeBrtToken = options?.includeBrtToken === true;
  const configured =
    options?.tokenPresent ??
    !!(entidade.brtToken && String(entidade.brtToken).trim().length > 0);
  const { brtToken, ...rest } = entidade;
  if (!includeIntegracao) {
    const {
      integracaoManutencao: _i,
      brtUrlBase: _u,
      brtTenEmp: _t,
      brtAmbiente: _a,
      brtNomSol: _n,
      brtTelCtt: _tel,
      brtLocAtd: _loc,
      ...publicFields
    } = rest;
    return publicFields as EmpresaTerceiraResponse;
  }
  const response: EmpresaTerceiraResponse = {
    ...rest,
    brtTokenConfigured: configured,
  };
  if (includeBrtToken && brtToken?.trim()) {
    response.brtToken = brtToken.trim();
  }
  return response;
}

export function normalizeIntegracaoManutencao(
  value?: IntegracaoManutencaoEmpresa,
): IntegracaoManutencaoEmpresa {
  if (!value) {
    return IntegracaoManutencaoEmpresa.NENHUMA;
  }
  return value;
}
