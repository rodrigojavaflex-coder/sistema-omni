import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IntegracaoManutencaoEmpresa } from '../../../common/enums/integracao-manutencao-empresa.enum';

@Entity('empresasterceiras')
@Index('IDX_EMPRESATERCIRA_DESCRICAO', ['descricao'], { unique: true })
export class EmpresaTerceira extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: false })
  descricao: string;

  @Column({
    name: 'eh_empresa_manutencao',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  ehEmpresaManutencao: boolean;

  @Column({ name: 'emails_relatorio', type: 'text', nullable: true })
  emailsRelatorio?: string;

  @ApiProperty({ enum: IntegracaoManutencaoEmpresa })
  @Column({
    name: 'integracao_manutencao',
    type: 'varchar',
    length: 20,
    default: IntegracaoManutencaoEmpresa.NENHUMA,
  })
  integracaoManutencao: IntegracaoManutencaoEmpresa;

  @Column({
    name: 'enviar_email_relatorio',
    type: 'boolean',
    default: true,
  })
  enviarEmailRelatorio: boolean;

  @Column({ name: 'brt_url_base', type: 'varchar', length: 500, nullable: true })
  brtUrlBase?: string;

  @Column({ name: 'brt_ten_emp', type: 'varchar', length: 120, nullable: true })
  brtTenEmp?: string;

  @Column({ name: 'brt_token', type: 'text', nullable: true, select: false })
  brtToken?: string;

  @Column({ name: 'brt_ambiente', type: 'varchar', length: 20, nullable: true })
  brtAmbiente?: string;

  @ApiProperty({
    description: 'Nome do solicitante enviado à API BRT',
    required: false,
  })
  @Column({ name: 'brt_nom_sol', type: 'varchar', length: 200, nullable: true })
  brtNomSol?: string;

  @ApiProperty({
    description: 'Telefone de contato enviado à API BRT',
    required: false,
  })
  @Column({ name: 'brt_tel_ctt', type: 'varchar', length: 40, nullable: true })
  brtTelCtt?: string;

  @ApiProperty({
    description: 'Local de atendimento enviado à API BRT',
    required: false,
  })
  @Column({ name: 'brt_loc_atd', type: 'varchar', length: 500, nullable: true })
  brtLocAtd?: string;

  static get nomeAmigavel(): string {
    return 'Empresa Terceira';
  }
}
