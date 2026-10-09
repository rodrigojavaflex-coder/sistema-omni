import { ForbiddenException } from '@nestjs/common';
import { Permission } from '../enums/permission.enum';
import { StatusIrregularidade } from '../enums/status-irregularidade.enum';

/** Permissões :read de acesso às telas do fluxo de irregularidades. */
export const IRREGULARIDADE_FLUXO_READ_PERMISSIONS: Permission[] = [
  Permission.IRREGULARIDADE_TRATAMENTO_READ,
  Permission.IRREGULARIDADE_MANUTENCAO_READ,
  Permission.IRREGULARIDADE_VALIDACAO_FINAL_READ,
  Permission.IRREGULARIDADE_GESTAO_OS_READ,
];

/** Permissões :print do relatório PDF por tela do fluxo. */
export const IRREGULARIDADE_FLUXO_PRINT_PERMISSIONS: Permission[] = [
  Permission.IRREGULARIDADE_TRATAMENTO_PRINT,
  Permission.IRREGULARIDADE_MANUTENCAO_PRINT,
  Permission.IRREGULARIDADE_VALIDACAO_FINAL_PRINT,
  Permission.IRREGULARIDADE_GESTAO_OS_READ,
];

/** Status cuja listagem operacional exige filtro de empresa (exceto Gestão OS). */
export const STATUS_ESCOPO_EMPRESA: StatusIrregularidade[] = [
  StatusIrregularidade.EM_MANUTENCAO,
  StatusIrregularidade.CONCLUIDA,
  StatusIrregularidade.VALIDADA,
];

export function getReadPermissionForStatus(
  status: StatusIrregularidade,
): Permission {
  switch (status) {
    case StatusIrregularidade.REGISTRADA:
    case StatusIrregularidade.RETRABALHO_GARANTIA:
    case StatusIrregularidade.CANCELADA:
    case StatusIrregularidade.NAO_PROCEDE:
      return Permission.IRREGULARIDADE_TRATAMENTO_READ;
    case StatusIrregularidade.EM_MANUTENCAO:
      return Permission.IRREGULARIDADE_MANUTENCAO_READ;
    case StatusIrregularidade.CONCLUIDA:
    case StatusIrregularidade.VALIDADA:
      return Permission.IRREGULARIDADE_VALIDACAO_FINAL_READ;
    default:
      return Permission.IRREGULARIDADE_TRATAMENTO_READ;
  }
}

export function getPrintPermissionForStatus(
  status: StatusIrregularidade,
): Permission {
  switch (status) {
    case StatusIrregularidade.REGISTRADA:
    case StatusIrregularidade.RETRABALHO_GARANTIA:
    case StatusIrregularidade.CANCELADA:
    case StatusIrregularidade.NAO_PROCEDE:
      return Permission.IRREGULARIDADE_TRATAMENTO_PRINT;
    case StatusIrregularidade.EM_MANUTENCAO:
      return Permission.IRREGULARIDADE_MANUTENCAO_PRINT;
    case StatusIrregularidade.CONCLUIDA:
    case StatusIrregularidade.VALIDADA:
      return Permission.IRREGULARIDADE_VALIDACAO_FINAL_PRINT;
    default:
      return Permission.IRREGULARIDADE_TRATAMENTO_PRINT;
  }
}

export function getRequiredReadPermissionsForStatuses(
  statuses: StatusIrregularidade[],
): Permission[] {
  const effective =
    statuses.length > 0 ? statuses : [StatusIrregularidade.REGISTRADA];
  return Array.from(
    new Set(effective.map((status) => getReadPermissionForStatus(status))),
  );
}

export function getRequiredPrintPermissionsForStatuses(
  statuses: StatusIrregularidade[],
): Permission[] {
  const effective =
    statuses.length > 0 ? statuses : [StatusIrregularidade.REGISTRADA];
  return Array.from(
    new Set(effective.map((status) => getPrintPermissionForStatus(status))),
  );
}

export function collectUserPermissions(
  perfis: Array<{ permissoes?: string[] }> | undefined,
): Set<string> {
  return new Set(
    (perfis ?? [])
      .flatMap((perfil) => perfil.permissoes ?? [])
      .map((permission) => permission.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function userHasPermission(
  userPermissions: Set<string>,
  permission: Permission,
): boolean {
  return userPermissions.has(permission.toLowerCase());
}

export function assertUserHasAllPermissions(
  userPermissions: Set<string>,
  required: Permission[],
): void {
  const missing = required.filter(
    (permission) => !userPermissions.has(permission.toLowerCase()),
  );
  if (missing.length === 0) {
    return;
  }
  throw new ForbiddenException(
    `Acesso negado. Permissões necessárias: ${missing.join(', ')}`,
  );
}
