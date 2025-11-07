import { Sexo } from './sexo.enum';
import { Terceirizado } from './terceirizado.enum';
import { Status } from './status.enum';

export interface Motorista {
  id: string;
  nome: string;
  matricula: string;
  dataNascimento: string;
  dataHabilitacao: string;
  validadeDaHabilitacao: string;
  dataAdmissao: string;
  dataCursoTransporte?: string;
  dataExameToxicologico?: string;
  email?: string;
  cpf: string;
  identidade?: string;
  sexo?: Sexo;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  telefone?: string;
  celular?: string;
  terceirizado?: Terceirizado;
  status: Status;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateMotoristaDto {
  nome: string;
  matricula: string;
  dataNascimento: string;
  dataHabilitacao: string;
  validadeDaHabilitacao: string;
  dataAdmissao: string;
  dataCursoTransporte?: string;
  dataExameToxicologico?: string;
  email?: string;
  cpf: string;
  identidade?: string;
  sexo?: Sexo;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  telefone?: string;
  celular?: string;
  terceirizado?: Terceirizado;
  status?: Status;
}

export interface UpdateMotoristaDto extends Partial<CreateMotoristaDto> {}
