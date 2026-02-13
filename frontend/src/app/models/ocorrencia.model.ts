import { TipoOcorrencia } from './tipo-ocorrencia.enum';
import { Linha } from './linha.enum';
import { Arco } from './arco.enum';
import { SentidoVia } from './sentido-via.enum';
import { TipoLocal } from './tipo-local.enum';
import { Culpabilidade } from './culpabilidade.enum';
import { SimNao } from './sim-nao.enum';
import { Sexo } from './sexo.enum';
import { Veiculo } from './veiculo.model';
import { Motorista } from './motorista.model';
import { Trecho } from './trecho.model';

export interface Ocorrencia {
  id: string;
  dataHora: Date;
  veiculo: Veiculo;
  idVeiculo: string;
  motorista: Motorista;
  idMotorista: string;
  trecho?: Trecho;
  idTrecho?: string;
  tipo: TipoOcorrencia;
  descricao: string;
  observacoesTecnicas?: string;
  linha?: Linha;
  arco?: Arco;
  sentidoVia?: SentidoVia;
  tipoLocal?: TipoLocal;
  localDetalhado?: string;
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };
  culpabilidade?: Culpabilidade;
  informacoesTerceiros?: string;
  aberturaPAP?: string;
  boletimOcorrencia?: string;
  houveVitimas: SimNao;
  numVitimasComLesoes?: number;
  numVitimasFatais?: number;
  nomeDaVitima?: string;
  documentoDaVitima?: string;
  dataNascimentoDaVitima?: Date;
  sexoDaVitima?: Sexo;
  nomeDaMaeDaVitima?: string;
  informacoesVitimas?: string;
  enderecoVitimas?: string;
  informacoesTestemunhas?: string;
  idOrigem?: string;
  idCategoria?: string;
  processoSei?: string;
  numeroOrcamento?: string;
  valorDoOrcamento?: number;
  idEmpresaDoMotorista?: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface CreateOcorrenciaDto {
  dataHora: string;
  idVeiculo: string;
  idMotorista: string;
  idTrecho?: string;
  idOrigem: string;
  idCategoria: string;
  processoSei?: string;
  numeroOrcamento?: string;
  valorDoOrcamento?: number;
  idEmpresaDoMotorista: string;
  tipo: TipoOcorrencia;
  descricao: string;
  observacoesTecnicas?: string;
  linha?: Linha;
  arco?: Arco;
  sentidoVia?: SentidoVia;
  tipoLocal?: TipoLocal;
  localDetalhado?: string;
  localizacao?: {
    type: 'Point';
    coordinates: [number, number];
  };
  culpabilidade?: Culpabilidade;
  informacoesTerceiros?: string;
  aberturaPAP?: string;
  boletimOcorrencia?: string;
  houveVitimas: SimNao;
  numVitimasComLesoes?: number;
  numVitimasFatais?: number;
  nomeDaVitima?: string;
  documentoDaVitima?: string;
  dataNascimentoDaVitima?: Date;
  sexoDaVitima?: Sexo;
  nomeDaMaeDaVitima?: string;
  informacoesVitimas?: string;
  enderecoVitimas?: string;
  informacoesTestemunhas?: string;
}

export interface UpdateOcorrenciaDto extends Partial<CreateOcorrenciaDto> {}

export interface FindOcorrenciaDto {
  page?: number;
  limit?: number;
  tipo?: string[];
  linha?: string[];
  dataInicio?: string;
  dataFim?: string;
  idVeiculo?: string;
  idMotorista?: string;
  arco?: string[];
  sentidoVia?: string[];
  tipoLocal?: string[];
  culpabilidade?: string[];
  houveVitimas?: string[];
  terceirizado?: string[];
}

export interface OcorrenciaListResponse {
  data: Ocorrencia[];
  total: number;
  page: number;
  limit: number;
}
