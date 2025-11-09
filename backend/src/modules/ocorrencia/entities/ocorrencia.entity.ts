import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { TipoOcorrencia } from '../../../common/enums/tipo-ocorrencia.enum';
import { Linha } from '../../../common/enums/linha.enum';
import { Arco } from '../../../common/enums/arco.enum';
import { SentidoVia } from '../../../common/enums/sentido-via.enum';
import { TipoLocal } from '../../../common/enums/tipo-local.enum';
import { Culpabilidade } from '../../../common/enums/culpabilidade.enum';
import { SimNao } from '../../../common/enums/sim-nao.enum';
import { Sexo } from '../../../common/enums/sexo.enum';
import { Veiculo } from '../../veiculo/entities/veiculo.entity';
import { Motorista } from '../../motorista/entities/motorista.entity';
import { Trecho } from '../../trecho/entities/trecho.entity';

@Entity('ocorrencias')
@Index(['dataHora'])
@Index(['tipo'])
@Index(['linha'])
export class Ocorrencia extends BaseEntity {
  @Column({ type: 'timestamp', nullable: false })
  dataHora: Date;

  @ManyToOne(() => Veiculo, { nullable: false, eager: true })
  @JoinColumn({ name: 'idVeiculo' })
  veiculo: Veiculo;

  @Column({ type: 'uuid', nullable: false })
  idVeiculo: string;

  @ManyToOne(() => Motorista, { nullable: false, eager: true })
  @JoinColumn({ name: 'idMotorista' })
  motorista: Motorista;

  @Column({ type: 'uuid', nullable: false })
  idMotorista: string;

  @ManyToOne(() => Trecho, { nullable: true, eager: true })
  @JoinColumn({ name: 'idTrecho' })
  trecho?: Trecho;

  @Column({ type: 'uuid', nullable: true })
  idTrecho?: string;

  @Column({
    type: 'enum',
    enum: TipoOcorrencia,
    nullable: false
  })
  tipo: TipoOcorrencia;

  @Column({ type: 'text', nullable: false })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  observacoesTecnicas: string;

  @Column({
    type: 'enum',
    enum: Linha,
    nullable: true
  })
  linha: Linha;

  @Column({
    type: 'enum',
    enum: Arco,
    nullable: true
  })
  arco: Arco;

  @Column({
    type: 'enum',
    enum: SentidoVia,
    nullable: true
  })
  sentidoVia: SentidoVia;

  @Column({
    type: 'enum',
    enum: TipoLocal,
    nullable: true
  })
  tipoLocal: TipoLocal;

  @Column({ type: 'varchar', length: 400, nullable: true })
  localDetalhado: string;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true
  })
  localizacao: any; // GeoJSON Point: { type: 'Point', coordinates: [longitude, latitude] }

  @Column({
    type: 'enum',
    enum: Culpabilidade,
    nullable: true
  })
  culpabilidade: Culpabilidade;

  @Column({ type: 'text', nullable: true })
  informacoesTerceiros: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  aberturaPAP: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  boletimOcorrencia: string;

  @Column({
    type: 'enum',
    enum: SimNao,
    nullable: false
  })
  houveVitimas: SimNao;

  @Column({ type: 'integer', nullable: true, default: 0 })
  numVitimasComLesoes: number;

  @Column({ type: 'integer', nullable: true, default: 0 })
  numVitimasFatais: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  nomeDaVitima: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  documentoDaVitima: string;

  @Column({ type: 'date', nullable: true })
  dataNascimentoDaVitima: Date;

  @Column({
    type: 'enum',
    enum: Sexo,
    nullable: true
  })
  sexoDaVitima: Sexo;

  @Column({ type: 'varchar', length: 150, nullable: true })
  nomeDaMaeDaVitima: string;

  @Column({ type: 'text', nullable: true })
  informacoesVitimas: string;

  @Column({ type: 'text', nullable: true })
  enderecoVitimas: string;

  @Column({ type: 'text', nullable: true })
  informacoesTestemunhas: string;

  static get nomeAmigavel(): string {
    return 'Ocorrência';
  }
}
