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
    description: 'Empresa vinculada ao usuário',
    required: false,
    type: () => EmpresaTerceira,
  })
  @ManyToOne(() => EmpresaTerceira, { nullable: true, eager: false })
  @JoinColumn({ name: 'idEmpresa' })
  empresa?: EmpresaTerceira;

  @ApiProperty({
    description: 'ID da empresa vinculada ao usuário',
    required: false,
    format: 'uuid',
  })
  @Column({ type: 'uuid', nullable: true })
  idEmpresa?: string;

  @ApiProperty({
    description: 'Tema preferido do usuário',
    example: 'Claro',
    default: 'Claro',
    enum: ['Claro', 'Escuro'],
  })
  @Column({ default: 'Claro', length: 10 })
  tema: string;
}
