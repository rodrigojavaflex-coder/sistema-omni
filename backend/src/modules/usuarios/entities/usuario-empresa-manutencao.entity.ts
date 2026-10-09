import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { EmpresaTerceira } from '../../empresa-terceira/entities/empresa-terceira.entity';
import { Usuario } from './usuario.entity';

@Entity('usuariosEmpresasManutencao')
@Unique('UQ_usuariosEmpresasManutencao_usuario_empresa', [
  'usuarioId',
  'empresaId',
])
export class UsuarioEmpresaManutencao extends BaseEntity {
  @ManyToOne(() => Usuario, (usuario) => usuario.empresasManutencaoVinculos, {
    eager: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Column({ type: 'uuid', nullable: false })
  usuarioId: string;

  @ManyToOne(() => EmpresaTerceira, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empresaId' })
  empresa: EmpresaTerceira;

  @Column({ type: 'uuid', nullable: false })
  empresaId: string;
}
