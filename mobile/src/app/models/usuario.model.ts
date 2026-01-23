export interface Perfil {
  id: number;
  nome: string;
  descricao?: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Usuario;
}
