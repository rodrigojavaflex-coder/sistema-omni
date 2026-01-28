export interface Perfil {
  id: string;
  nomePerfil: string;
  permissoes?: string[] | string;
  descricao?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  tema?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Usuario;
  access_token?: string;
  refresh_token?: string;
}
