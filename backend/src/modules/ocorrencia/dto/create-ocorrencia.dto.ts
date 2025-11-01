import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  IsUUID,
  IsInt,
  Min,
  MaxLength,
  IsObject
} from 'class-validator';
import { TipoOcorrencia } from '../../../common/enums/tipo-ocorrencia.enum';
import { Linha } from '../../../common/enums/linha.enum';
import { Arco } from '../../../common/enums/arco.enum';
import { SentidoVia } from '../../../common/enums/sentido-via.enum';
import { TipoLocal } from '../../../common/enums/tipo-local.enum';
import { Culpabilidade } from '../../../common/enums/culpabilidade.enum';
import { SimNao } from '../../../common/enums/sim-nao.enum';

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
  @IsOptional()
  linha?: Linha;

  @IsEnum(Arco, { message: 'Arco inválido' })
  @IsOptional()
  arco?: Arco;

  @IsEnum(SentidoVia, { message: 'Sentido da via inválido' })
  @IsOptional()
  sentidoVia?: SentidoVia;

  @IsEnum(TipoLocal, { message: 'Tipo de local inválido' })
  @IsOptional()
  tipoLocal?: TipoLocal;

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
  @IsOptional()
  culpabilidade?: Culpabilidade;

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
  informacoesVitimas?: string;

  @IsString()
  @IsOptional()
  enderecoVitimas?: string;

  @IsString()
  @IsOptional()
  informacoesTestemunhas?: string;
}
