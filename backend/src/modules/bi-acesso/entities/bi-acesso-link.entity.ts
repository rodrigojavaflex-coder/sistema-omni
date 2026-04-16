import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('bi_acesso_links')
export class BiAcessoLink extends BaseEntity {
  @ApiProperty({
    description: 'Nome exibido no menu para o link de BI',
    example: 'Painel de Performance',
  })
  @Column({ length: 120 })
  nomeMenu: string;

  @ApiProperty({
    description: 'URL externa do dashboard de BI',
    example: 'https://app.powerbi.com/view?r=...',
  })
  @Column({ length: 1024 })
  url: string;

  @ApiProperty({
    description: 'Grupo de topo do menu para organização',
    example: 'Gestão',
    default: 'Gestão',
  })
  @Column({ length: 80, default: 'Gestão' })
  grupoMenu: string;

  @ApiProperty({
    description: 'Subgrupo do menu onde os links de BI serão exibidos',
    example: 'BI',
    default: 'BI',
  })
  @Column({ length: 80, default: 'BI' })
  subgrupoMenu: string;

  @ApiProperty({
    description: 'Ícone do item de menu (nome do ícone feather)',
    example: 'feather-pie-chart',
    default: 'feather-pie-chart',
  })
  @Column({ length: 80, default: 'feather-pie-chart' })
  icone: string;

  @ApiProperty({
    description: 'Ordem de exibição no menu',
    example: 1,
    default: 1,
  })
  @Column({ type: 'int', default: 1 })
  ordem: number;

  @ApiProperty({
    description: 'Indica se o link está ativo para aparecer no menu',
    example: true,
    default: true,
  })
  @Column({ default: true })
  ativo: boolean;
}
