import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Vistoria } from './vistoria.entity';
import { AreaVistoriada } from './area-vistoriada.entity';
import { Componente } from './componente.entity';
import { Sintoma } from './sintoma.entity';
import { IrregularidadeMidia } from './irregularidade-midia.entity';
import { IrregularidadeMarcacao } from './irregularidade-marcacao.entity';
import { StatusIrregularidade } from '../../../common/enums/status-irregularidade.enum';
import { OrigemRegistroIrregularidade } from '../../../common/enums/origem-vistoria.enum';
import { ModeloVeiculoVista } from '../../veiculo/entities/modelo-veiculo-vista.entity';

@Entity('irregularidades')
@Index('IDX_IRREGULARIDADE_VISTORIA', ['idVistoria'])
@Index('IDX_IRREGULARIDADE_STATUS', ['statusAtual'])
@Index('IDX_IRREGULARIDADE_EMPRESA_MANUT', ['idEmpresaManutencao'])
@Index('UQ_IRREGULARIDADE_NUMERO', ['numeroIrregularidade'], { unique: true })
export class Irregularidade extends BaseEntity {
  static get nomeAmigavel(): string {
    return 'Irregularidade';
  }

  @ApiProperty({ description: 'Vistoria vinculada', type: () => Vistoria })
  @ManyToOne(() => Vistoria, (vistoria) => vistoria.irregularidades, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'idvistoria' })
  vistoria: Vistoria;

  @ApiProperty({ description: 'ID da vistoria', format: 'uuid' })
  @Column({ name: 'idvistoria', type: 'uuid' })
  idVistoria: string;

  @ApiProperty({
    description: 'Número único da irregularidade (ano + sequencial)',
    example: 20261,
  })
  @Column({
    name: 'numero_irregularidade',
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) => Number(value),
    },
  })
  numeroIrregularidade: number;

  @ApiProperty({ description: 'Área vinculada', type: () => AreaVistoriada })
  @ManyToOne(() => AreaVistoriada, { nullable: false })
  @JoinColumn({ name: 'idarea' })
  area: AreaVistoriada;

  @ApiProperty({ description: 'ID da área', format: 'uuid' })
  @Column({ name: 'idarea', type: 'uuid' })
  idArea: string;

  @ApiProperty({ description: 'Componente vinculado', type: () => Componente })
  @ManyToOne(() => Componente, { nullable: false })
  @JoinColumn({ name: 'idcomponente' })
  componente: Componente;

  @ApiProperty({ description: 'ID do componente', format: 'uuid' })
  @Column({ name: 'idcomponente', type: 'uuid' })
  idComponente: string;

  @ApiProperty({ description: 'Sintoma vinculado', type: () => Sintoma })
  @ManyToOne(() => Sintoma, { nullable: false })
  @JoinColumn({ name: 'idsintoma' })
  sintoma: Sintoma;

  @ApiProperty({ description: 'ID do sintoma', format: 'uuid' })
  @Column({ name: 'idsintoma', type: 'uuid' })
  idSintoma: string;

  @ApiProperty({ description: 'Observação', required: false })
  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao?: string;

  @ApiProperty({ description: 'Irregularidade resolvida', default: false })
  @Column({ name: 'resolvido', type: 'boolean', default: false })
  resolvido: boolean;

  @ApiProperty({
    description: 'Status atual da irregularidade',
    enum: StatusIrregularidade,
    default: StatusIrregularidade.REGISTRADA,
  })
  @Column({
    name: 'status_atual',
    type: 'varchar',
    length: 30,
    default: StatusIrregularidade.REGISTRADA,
  })
  statusAtual: StatusIrregularidade;

  @ApiProperty({
    description: 'Empresa de manutenção responsável',
    format: 'uuid',
    required: false,
  })
  @Column({ name: 'idempresa_manutencao', type: 'uuid', nullable: true })
  idEmpresaManutencao?: string;

  @ApiProperty({
    description: 'Motivo de cancelamento',
    required: false,
  })
  @Column({ name: 'motivo_cancelamento', type: 'text', nullable: true })
  motivoCancelamento?: string;

  @ApiProperty({
    description: 'Motivo de não procede',
    required: false,
  })
  @Column({ name: 'motivo_nao_procede', type: 'text', nullable: true })
  motivoNaoProcede?: string;

  @ApiProperty({
    description: 'Data/hora de início da manutenção',
    required: false,
  })
  @Column({ name: 'iniciada_manutencao_em', type: 'timestamp', nullable: true })
  iniciadaManutencaoEm?: Date;

  @ApiProperty({
    description: 'Data/hora de conclusão da manutenção',
    required: false,
  })
  @Column({
    name: 'concluida_manutencao_em',
    type: 'timestamp',
    nullable: true,
  })
  concluidaManutencaoEm?: Date;

  @ApiProperty({
    description: 'Data/hora da validação final',
    required: false,
  })
  @Column({ name: 'validada_em', type: 'timestamp', nullable: true })
  validadaEm?: Date;

  @ApiProperty({
    description: 'Mídias vinculadas (imagens e áudios)',
    type: () => [IrregularidadeMidia],
  })
  @OneToMany(() => IrregularidadeMidia, (midia) => midia.irregularidade, {
    cascade: true,
  })
  midias?: IrregularidadeMidia[];

  @ApiProperty({
    description: 'Origem do registro (null = mobile)',
    enum: OrigemRegistroIrregularidade,
    required: false,
  })
  @Column({ name: 'origem_registro', type: 'varchar', length: 20, nullable: true })
  origemRegistro?: OrigemRegistroIrregularidade | null;

  @ApiProperty({
    description: 'Irregularidade com conclusão controlada por integração de OS',
    default: false,
  })
  @Column({
    name: 'controle_integracao_api',
    type: 'boolean',
    default: false,
  })
  controleIntegracaoApi: boolean;

  @ApiProperty({ description: 'os_orig ativo na integração externa', required: false })
  @Column({ name: 'os_orig_atual', type: 'varchar', length: 80, nullable: true })
  osOrigAtual?: string | null;

  @ApiProperty({ description: 'Número da OS no sistema externo (ativo)', required: false })
  @Column({ name: 'num_os_externo_atual', type: 'integer', nullable: true })
  numOsExternoAtual?: number | null;

  @ApiProperty({ description: 'Último erro de integração de OS', required: false })
  @Column({ name: 'ultimo_erro_integracao', type: 'text', nullable: true })
  ultimoErroIntegracao?: string | null;

  @Column({
    name: 'ultimo_erro_integracao_em',
    type: 'timestamp',
    nullable: true,
  })
  ultimoErroIntegracaoEm?: Date | null;

  @ManyToOne(() => ModeloVeiculoVista, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_vista' })
  vista?: ModeloVeiculoVista | null;

  @ApiProperty({
    description: 'Vista do modelo onde a irregularidade foi marcada',
    format: 'uuid',
    required: false,
  })
  @Column({ name: 'id_vista', type: 'uuid', nullable: true })
  idVista?: string | null;

  @ApiProperty({ description: 'Posição X percentual (0-100)', required: false })
  @Column({
    name: 'pos_x_pct',
    type: 'numeric',
    precision: 6,
    scale: 3,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value,
      from: (value: string | number | null) =>
        value === null || value === undefined ? null : Number(value),
    },
  })
  posXPct?: number | null;

  @ApiProperty({ description: 'Posição Y percentual (0-100)', required: false })
  @Column({
    name: 'pos_y_pct',
    type: 'numeric',
    precision: 6,
    scale: 3,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value,
      from: (value: string | number | null) =>
        value === null || value === undefined ? null : Number(value),
    },
  })
  posYPct?: number | null;

  /** Pontos do mapa (mesma vista; fonte canônica após migration 174570). */
  @OneToMany(
    () => IrregularidadeMarcacao,
    (marcacao) => marcacao.irregularidade,
    { cascade: true },
  )
  marcacoes?: IrregularidadeMarcacao[];
}
