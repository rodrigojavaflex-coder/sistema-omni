import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Sexo } from '../../../common/enums/sexo.enum';
import { Terceirizado } from '../../../common/enums/terceirizado.enum';
import { Status } from '../../../common/enums/status.enum';

@Entity('motoristas')
export class Motorista extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  matricula: string;

  @Column({ type: 'date', nullable: false })
  dataNascimento: Date;

  @Column({ type: 'date', nullable: false })
  dataHabilitacao: Date;

  @Column({ type: 'date', nullable: false })
  dataAdmissao: Date;

  @Column({ type: 'date', nullable: true })
  dataCursoTransporte: Date;

  @Column({ type: 'date', nullable: true })
  dataExameToxicologico: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 14, nullable: false, unique: true })
  cpf: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  identidade: string;

  @Column({
    type: 'enum',
    enum: Sexo,
    nullable: true
  })
  sexo: Sexo;

  @Column({ type: 'varchar', length: 300, nullable: true })
  endereco: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  celular: string;

  @Column({
    type: 'enum',
    enum: Terceirizado,
    nullable: true
  })
  terceirizado: Terceirizado;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ATIVO,
    nullable: false
  })
  status: Status;
}
