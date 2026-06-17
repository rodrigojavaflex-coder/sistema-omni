import { Permission } from '../models/usuario.model';

/** Permissões de rota alinhadas ao menu (`menu.model.ts`). */
export const RoutePermissions = {
  users: {
    list: [
      Permission.USER_CREATE,
      Permission.USER_READ,
      Permission.USER_UPDATE,
      Permission.USER_DELETE,
    ],
    create: [Permission.USER_CREATE],
    update: [Permission.USER_UPDATE],
  },
  auditoria: {
    list: [Permission.AUDIT_VIEW],
  },
  veiculo: {
    list: [
      Permission.VEICULO_CREATE,
      Permission.VEICULO_READ,
      Permission.VEICULO_UPDATE,
      Permission.VEICULO_DELETE,
    ],
    create: [Permission.VEICULO_CREATE],
    update: [Permission.VEICULO_UPDATE],
  },
  modeloVeiculo: {
    list: [
      Permission.MODELOVEICULO_CREATE,
      Permission.MODELOVEICULO_READ,
      Permission.MODELOVEICULO_UPDATE,
      Permission.MODELOVEICULO_DELETE,
    ],
    create: [Permission.MODELOVEICULO_CREATE],
    update: [Permission.MODELOVEICULO_UPDATE],
  },
  motorista: {
    list: [
      Permission.MOTORISTA_CREATE,
      Permission.MOTORISTA_READ,
      Permission.MOTORISTA_UPDATE,
      Permission.MOTORISTA_DELETE,
    ],
    create: [Permission.MOTORISTA_CREATE],
    update: [Permission.MOTORISTA_UPDATE],
  },
  ocorrencia: {
    list: [
      Permission.OCORRENCIA_CREATE,
      Permission.OCORRENCIA_READ,
      Permission.OCORRENCIA_UPDATE,
      Permission.OCORRENCIA_DELETE,
    ],
    create: [Permission.OCORRENCIA_CREATE],
    update: [Permission.OCORRENCIA_UPDATE],
  },
  origemOcorrencia: {
    list: [
      Permission.ORIGEMOCORRENCIA_CREATE,
      Permission.ORIGEMOCORRENCIA_READ,
      Permission.ORIGEMOCORRENCIA_UPDATE,
      Permission.ORIGEMOCORRENCIA_DELETE,
    ],
    create: [Permission.ORIGEMOCORRENCIA_CREATE],
    update: [Permission.ORIGEMOCORRENCIA_UPDATE],
  },
  categoriaOcorrencia: {
    list: [
      Permission.CATEGORIAOCORRENCIA_CREATE,
      Permission.CATEGORIAOCORRENCIA_READ,
      Permission.CATEGORIAOCORRENCIA_UPDATE,
      Permission.CATEGORIAOCORRENCIA_DELETE,
    ],
    create: [Permission.CATEGORIAOCORRENCIA_CREATE],
    update: [Permission.CATEGORIAOCORRENCIA_UPDATE],
  },
  empresaTerceira: {
    list: [
      Permission.EMPRESATERCIRA_CREATE,
      Permission.EMPRESATERCIRA_READ,
      Permission.EMPRESATERCIRA_UPDATE,
      Permission.EMPRESATERCIRA_DELETE,
    ],
    create: [Permission.EMPRESATERCIRA_CREATE],
    update: [Permission.EMPRESATERCIRA_UPDATE],
  },
  trecho: {
    list: [
      Permission.TRECHO_CREATE,
      Permission.TRECHO_READ,
      Permission.TRECHO_UPDATE,
      Permission.TRECHO_DELETE,
    ],
    create: [Permission.TRECHO_CREATE],
    update: [Permission.TRECHO_UPDATE],
  },
  areaVistoriada: {
    list: [
      Permission.AREAVISTORIADA_CREATE,
      Permission.AREAVISTORIADA_READ,
      Permission.AREAVISTORIADA_UPDATE,
      Permission.AREAVISTORIADA_DELETE,
    ],
  },
  componente: {
    list: [
      Permission.COMPONENTE_CREATE,
      Permission.COMPONENTE_READ,
      Permission.COMPONENTE_UPDATE,
      Permission.COMPONENTE_DELETE,
    ],
    create: [Permission.COMPONENTE_CREATE],
    update: [Permission.COMPONENTE_UPDATE],
  },
  sintoma: {
    list: [
      Permission.SINTOMA_CREATE,
      Permission.SINTOMA_READ,
      Permission.SINTOMA_UPDATE,
      Permission.SINTOMA_DELETE,
    ],
    create: [Permission.SINTOMA_CREATE],
    update: [Permission.SINTOMA_UPDATE],
  },
  matrizCriticidade: {
    list: [
      Permission.MATRIZCRITICIDADE_CREATE,
      Permission.MATRIZCRITICIDADE_READ,
      Permission.MATRIZCRITICIDADE_UPDATE,
      Permission.MATRIZCRITICIDADE_DELETE,
    ],
    create: [Permission.MATRIZCRITICIDADE_CREATE],
    update: [Permission.MATRIZCRITICIDADE_UPDATE],
  },
  departamento: {
    list: [
      Permission.DEPARTAMENTO_CREATE,
      Permission.DEPARTAMENTO_READ,
      Permission.DEPARTAMENTO_UPDATE,
      Permission.DEPARTAMENTO_DELETE,
    ],
    create: [Permission.DEPARTAMENTO_CREATE],
    update: [Permission.DEPARTAMENTO_UPDATE],
  },
  meta: {
    list: [
      Permission.META_CREATE,
      Permission.META_READ,
      Permission.META_UPDATE,
      Permission.META_DELETE,
    ],
    create: [Permission.META_CREATE],
    update: [Permission.META_UPDATE],
  },
  biAcessoLinks: {
    list: [
      Permission.BI_ACESSO_LINK_READ,
      Permission.BI_ACESSO_LINK_CREATE,
      Permission.BI_ACESSO_LINK_UPDATE,
      Permission.BI_ACESSO_LINK_DELETE,
    ],
  },
  tipoDocumento: {
    list: [
      Permission.TIPO_DOCUMENTO_CREATE,
      Permission.TIPO_DOCUMENTO_READ,
      Permission.TIPO_DOCUMENTO_UPDATE,
      Permission.TIPO_DOCUMENTO_DELETE,
    ],
    create: [Permission.TIPO_DOCUMENTO_CREATE],
    update: [Permission.TIPO_DOCUMENTO_UPDATE],
  },
  documento: {
    list: [
      Permission.DOCUMENTO_CREATE,
      Permission.DOCUMENTO_READ,
      Permission.DOCUMENTO_UPDATE,
      Permission.DOCUMENTO_DELETE,
    ],
    create: [Permission.DOCUMENTO_CREATE],
    update: [Permission.DOCUMENTO_UPDATE],
  },
} as const;

/** Chave de permissão dinâmica para visualização de link de BI (alinhada ao backend). */
export function buildBiLinkPermissionKey(linkId: string): string {
  return `bi_link:${linkId}`;
}
