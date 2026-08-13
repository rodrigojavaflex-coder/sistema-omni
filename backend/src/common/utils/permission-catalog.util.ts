import {
  ALL_PERMISSIONS,
  PERMISSION_GROUPS,
} from '../enums/permission.enum';
import {
  DYNAMIC_PERMISSION_GROUP_KEYS,
  PERMISSION_MODULE_CONFIG,
} from '../constants/permission-modules';

export interface PermissionCatalogItem {
  key: string;
  label: string;
}

export interface PermissionCatalogGroup {
  key: string;
  label: string;
  permissions: PermissionCatalogItem[];
}

export interface PermissionCatalogModule {
  key: string;
  label: string;
  groups: PermissionCatalogGroup[];
}

export interface PermissionCatalogResponse {
  modules: PermissionCatalogModule[];
  totalPermissions: number;
}

const dynamicGroupSet = new Set<string>(DYNAMIC_PERMISSION_GROUP_KEYS);

/** Garante cobertura 100% do enum estático e dos grupos no catálogo. */
export function assertPermissionCatalogIntegrity(): void {
  const groupedKeys = Object.values(PERMISSION_GROUPS)
    .flat()
    .map((item) => item.key);
  const groupedSet = new Set(groupedKeys);

  for (const perm of ALL_PERMISSIONS) {
    if (!groupedSet.has(perm)) {
      throw new Error(
        `Permissão "${perm}" não está em PERMISSION_GROUPS — atualize o catálogo.`,
      );
    }
  }

  if (groupedKeys.length !== groupedSet.size) {
    throw new Error(
      'PERMISSION_GROUPS contém permissões duplicadas — revise o catálogo.',
    );
  }

  const moduleGroupKeys = PERMISSION_MODULE_CONFIG.flatMap((m) => m.groupKeys);
  const moduleGroupSet = new Set(moduleGroupKeys);
  const allGroupNames = Object.keys(PERMISSION_GROUPS);

  for (const groupName of allGroupNames) {
    if (!moduleGroupSet.has(groupName)) {
      throw new Error(
        `Grupo "${groupName}" não está em PERMISSION_MODULE_CONFIG.`,
      );
    }
  }

  if (moduleGroupKeys.length !== moduleGroupSet.size) {
    throw new Error(
      'PERMISSION_MODULE_CONFIG referencia o mesmo grupo mais de uma vez.',
    );
  }

  for (const key of moduleGroupSet) {
    if (dynamicGroupSet.has(key)) {
      continue;
    }
    if (!PERMISSION_GROUPS[key as keyof typeof PERMISSION_GROUPS]) {
      throw new Error(
        `Grupo "${key}" em PERMISSION_MODULE_CONFIG não existe em PERMISSION_GROUPS.`,
      );
    }
  }
}

function resolveGroupPermissions(
  groupKey: string,
  dynamicByGroup: Map<string, PermissionCatalogItem[]>,
): PermissionCatalogItem[] {
  if (dynamicGroupSet.has(groupKey)) {
    return dynamicByGroup.get(groupKey) ?? [];
  }
  return (
    PERMISSION_GROUPS[groupKey as keyof typeof PERMISSION_GROUPS] ?? []
  ).map((item) => ({
    key: item.key,
    label: item.label,
  }));
}

export function buildPermissionCatalog(
  dynamicGroups: Record<string, PermissionCatalogItem[]> = {},
): PermissionCatalogResponse {
  const dynamicByGroup = new Map(Object.entries(dynamicGroups));

  const modules: PermissionCatalogModule[] = PERMISSION_MODULE_CONFIG.map(
    (moduleConfig) => ({
      key: moduleConfig.key,
      label: moduleConfig.label,
      groups: moduleConfig.groupKeys.map((groupKey) => ({
        key: groupKey,
        label: groupKey,
        permissions: resolveGroupPermissions(groupKey, dynamicByGroup),
      })),
    }),
  );

  const catalogedKeys = new Set(
    modules.flatMap((mod) =>
      mod.groups.flatMap((g) => g.permissions.map((p) => p.key)),
    ),
  );

  return {
    modules,
    totalPermissions: catalogedKeys.size,
  };
}

/** Mapa permissão → módulo (para resumo na listagem). */
export function buildPermissionToModuleMap(
  catalog: PermissionCatalogResponse,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const mod of catalog.modules) {
    for (const group of mod.groups) {
      for (const perm of group.permissions) {
        map.set(perm.key, mod.key);
      }
    }
  }
  return map;
}
