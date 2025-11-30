import { Entity, ManyToOne, JoinColumn, Column, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Departamento } from './departamento.entity';

@Entity('departamentosUsuario')
@Unique(['usuarioId', 'departamentoId'])
export class DepartamentoUsuario extends BaseEntity {
  @ManyToOne(() => Usuario, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ type: 'uuid', nullable: false })
  usuarioId: string;

  @ManyToOne(() => Departamento, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'departamentoId' })
  departamento: Departamento;

  @Column({ type: 'uuid', nullable: false })
  departamentoId: string;
}
