import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  MaxLength,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoOcorrencia } from '../../../common/enums/tipo-ocorrencia.enum';
import { Linha } from '../../../common/enums/linha.enum';
import { Arco } from '../../../common/enums/arco.enum';
import { SentidoVia } from '../../../common/enums/sentido-via.enum';
import { TipoLocal } from '../../../common/enums/tipo-local.enum';
import { Culpabilidade } from '../../../common/enums/culpabilidade.enum';
import { SimNao } from '../../../common/enums/sim-nao.enum';
import { Sexo } from '../../../common/enums/sexo.enum';

export class CreateOcorrenciaDto {
  @IsDateString({}, { message: 'Data e hora inválida' })
  @IsNotEmpty({ message: 'Data e hora é obrigatória' })
  dataHora: string;

  @IsUUID('4', { message: 'ID do veículo inválido' })
  @IsNotEmpty({ message: 'Veículo é obrigatório' })
  idVeiculo: string;

  @IsUUID('4', { message: 'ID do motorista inválido' })
  @IsNotEmpty({ message: 'Motorista é obrigatório' })
  idMotorista: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUUID('4', { message: 'ID do trecho inválido' })
  @IsOptional()
  idTrecho?: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUUID('4', { message: 'ID da origem inválido' })
  @IsNotEmpty({ message: 'Origem da ocorrência é obrigatória' })
  idOrigem: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUUID('4', { message: 'ID da categoria inválido' })
  @IsNotEmpty({ message: 'Categoria da ocorrência é obrigatória' })
  idCategoria: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  processoSei?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  numeroOrcamento?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value == null ? undefined : Number(value),
  )
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor do orçamento inválido' })
  @Min(0, { message: 'Valor do orçamento não pode ser negativo' })
  valorDoOrcamento?: number;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsUUID('4', { message: 'ID da empresa inválido' })
  @IsNotEmpty({ message: 'Empresa do motorista é obrigatória' })
  idEmpresaDoMotorista: string;

  @IsEnum(TipoOcorrencia, { message: 'Tipo de ocorrência inválido' })
  @IsNotEmpty({ message: 'Tipo de ocorrência é obrigatório' })
  tipo: TipoOcorrencia;

  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;

  @IsString()
  @IsOptional()
  observacoesTecnicas?: string;

  @IsEnum(Linha, { message: 'Linha inválida' })
  @IsNotEmpty({ message: 'Linha é obrigatória' })
  linha: Linha;

  @IsEnum(Arco, { message: 'Extensão inválida' })
  @IsNotEmpty({ message: 'Extensão é obrigatória' })
  arco: Arco;

  @IsEnum(SentidoVia, { message: 'Sentido da via inválido' })
  @IsNotEmpty({ message: 'Sentido da via é obrigatório' })
  sentidoVia: SentidoVia;

  @IsEnum(TipoLocal, { message: 'Tipo de local inválido' })
  @IsNotEmpty({ message: 'Tipo de local é obrigatório' })
  tipoLocal: TipoLocal;

  @IsString()
  @IsOptional()
  @MaxLength(400)
  localDetalhado?: string;

  @IsOptional()
  @IsObject()
  localizacao?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };

  @IsEnum(Culpabilidade, { message: 'Culpabilidade inválida' })
  @IsNotEmpty({ message: 'Culpabilidade é obrigatória' })
  culpabilidade: Culpabilidade;

  @IsString()
  @IsOptional()
  informacoesTerceiros?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  aberturaPAP?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  boletimOcorrencia?: string;

  @IsEnum(SimNao, { message: 'Campo "Houve vítimas" inválido' })
  @IsNotEmpty({ message: 'Campo "Houve vítimas" é obrigatório' })
  houveVitimas: SimNao;

  @IsInt({ message: 'Número de vítimas com lesões deve ser um inteiro' })
  @Min(0, { message: 'Número de vítimas com lesões não pode ser negativo' })
  @IsOptional()
  numVitimasComLesoes?: number;

  @IsInt({ message: 'Número de vítimas fatais deve ser um inteiro' })
  @Min(0, { message: 'Número de vítimas fatais não pode ser negativo' })
  @IsOptional()
  numVitimasFatais?: number;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  nomeDaVitima?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  documentoDaVitima?: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString({}, { message: 'Informe a data de nascimento da vítima' })
  @IsOptional()
  dataNascimentoDaVitima?: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsEnum(Sexo, { message: 'Informe o gênero da vítima' })
  @IsOptional()
  sexoDaVitima?: Sexo;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  nomeDaMaeDaVitima?: string;

  @IsString()
  @IsOptional()
  informacoesVitimas?: string;

  @IsString()
  @IsOptional()
  enderecoVitimas?: string;

  @IsString()
  @IsOptional()
  informacoesTestemunhas?: string;
}
