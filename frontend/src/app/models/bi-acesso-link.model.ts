export interface BiAcessoLink {
  id: string;
  nomeMenu: string;
  url: string;
  grupoMenu: string;
  subgrupoMenu: string;
  icone: string;
  ordem: number;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface BiAcessoMenuItem {
  id: string;
  label: string;
  externalUrl: string;
  icon: string;
  permissionKey: string;
  group: string;
  subgroup: string;
  order: number;
}

export interface CreateBiAcessoLinkDto {
  nomeMenu: string;
  url: string;
  ordem?: number;
  ativo?: boolean;
}

export type UpdateBiAcessoLinkDto = Partial<CreateBiAcessoLinkDto>;

export interface BiAcessoViewer {
  id: string;
  nomeMenu: string;
  url: string;
}
