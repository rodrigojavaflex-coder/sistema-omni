import {
  Entity,
  Column,
  Index,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Perfil } from '../../perfil/entities/perfil.entity';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DepartamentoUsuario } from '../../departamento/entities/departamento-usuario.entity';
import { EmpresaTerceira } from '../../empresa-terceira/entities/empresa-terceira.entity';
import { UsuarioEmpresaManutencao } from './usuario-empresa-manutencao.entity';

@Entity('usuarios')
@Index(['email'], { unique: true })
export class Usuario extends BaseEntity {
  /**
   * Nome amigável da entidade para uso em logs de auditoria
   */
  static get nomeAmigavel(): string {
    return 'usuário';
  }

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @Column({ length: 100 })
  nome: string;

  @ApiProperty({
    description: 'Email único do usuário',
    example: 'joao@email.com',
  })
  @Column({ unique: true, length: 100 })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (hash)',
    example: 'hashed-password',
  })
  @Column({ nullable: false })
  senha: string;

  @ApiProperty({
    description: 'Status ativo do usuário',
    example: true,
    default: true,
  })
  @Column({ default: true })
  ativo: boolean;

  @ApiProperty({ description: 'Perfis do usuário', type: () => [Perfil] })
  @ManyToMany(() => Perfil, (perfil) => perfil.usuarios, { eager: true })
  @JoinTable({
    name: 'usuarios_perfis',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'perfil_id', referencedColumnName: 'id' },
  })
  perfis: Perfil[];

  @OneToMany(() => DepartamentoUsuario, (du) => du.usuario, {
    cascade: false,
    eager: false,
  })
  departamentosUsuario?: DepartamentoUsuario[];

  @ApiProperty({
    description:
      'Empresa legada (1ª vinculada). Preferir empresasManutencao / idsEmpresasManutencao.',
    required: false,
    type: () => EmpresaTerceira,
  })
  @ManyToOne(() => EmpresaTerceira, { nullable: true, eager: false })
  @JoinColumn({ name: 'idEmpresa' })
  empresa?: EmpresaTerceira | null;

  @ApiProperty({
    description:
      'ID da empresa legada (sincronizado com a 1ª de idsEmpresasManutencao)',
    required: false,
    format: 'uuid',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  idEmpresa?: string | null;

  @OneToMany(
    () => UsuarioEmpresaManutencao,
    (vinculo) => vinculo.usuario,
    { cascade: false },
  )
  empresasManutencaoVinculos?: UsuarioEmpresaManutencao[];

  /** Empresas de manutenção vinculadas (populadas em serviços/auth). */
  empresasManutencao?: { id: string; descricao: string }[];

  /** IDs das empresas de manutenção vinculadas (populados em serviços/auth). */
  idsEmpresasManutencao?: string[];

  @ApiProperty({
    description: 'Tema preferido do usuário',
    example: 'Claro',
    default: 'Claro',
    enum: ['Claro', 'Escuro'],
  })
  @Column({ default: 'Claro', length: 10 })
  tema: string;

  @ApiProperty({
    description: 'IDs dos atalhos personalizados da tela inicial (null = padrão do sistema)',
    required: false,
    type: [String],
    nullable: true,
  })
  @Column({ name: 'atalhos_home', type: 'jsonb', nullable: true })
  atalhosHome: string[] | null;
}
