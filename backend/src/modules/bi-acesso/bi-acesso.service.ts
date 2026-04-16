import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BiAcessoLink } from './entities/bi-acesso-link.entity';
import { CreateBiAcessoLinkDto } from './dto/create-bi-acesso-link.dto';
import { UpdateBiAcessoLinkDto } from './dto/update-bi-acesso-link.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';

export interface BiPermissionItem {
  key: string;
  label: string;
}

export interface BiMenuItemDto {
  id: string;
  label: string;
  externalUrl: string;
  icon: string;
  permissionKey: string;
  group: string;
  subgroup: string;
  order: number;
}

export interface BiAcessoViewerDto {
  id: string;
  nomeMenu: string;
  url: string;
}

@Injectable()
export class BiAcessoService {
  constructor(
    @InjectRepository(BiAcessoLink)
    private readonly biAcessoRepository: Repository<BiAcessoLink>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly configService: ConfigService,
  ) {}

  private getAllowedDomains(): string[] {
    const configured =
      this.configService.get<string>('BI_ALLOWED_DOMAINS') ||
      process.env.BI_ALLOWED_DOMAINS ||
      'app.powerbi.com,powerbi.com';

    return configured
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  private isHostAllowed(hostname: string, allowedDomains: string[]): boolean {
    const host = hostname.toLowerCase();
    return allowedDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
  }

  private validateBiUrl(rawUrl: string): void {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new BadRequestException('URL de BI inválida');
    }

    if (parsed.protocol !== 'https:') {
      throw new BadRequestException('A URL de BI deve usar HTTPS');
    }

    const allowedDomains = this.getAllowedDomains();
    if (!this.isHostAllowed(parsed.hostname, allowedDomains)) {
      throw new BadRequestException(
        `Domínio não permitido para BI. Permitidos: ${allowedDomains.join(', ')}`,
      );
    }
  }

  buildPermissionKey(linkId: string): string {
    return `bi_link:${linkId}`;
  }

  async create(dto: CreateBiAcessoLinkDto): Promise<BiAcessoLink> {
    this.validateBiUrl(dto.url);
    const entity = this.biAcessoRepository.create({
      ...dto,
      grupoMenu: 'Gestão',
      subgrupoMenu: 'BI',
      icone: 'feather-pie-chart',
      ordem: dto.ordem || 1,
      ativo: dto.ativo ?? true,
    });
    return this.biAcessoRepository.save(entity);
  }

  async findAll(includeInactive = true): Promise<BiAcessoLink[]> {
    return this.biAcessoRepository.find({
      where: includeInactive ? {} : { ativo: true },
      order: { ordem: 'ASC', nomeMenu: 'ASC' },
    });
  }

  async findOne(id: string): Promise<BiAcessoLink> {
    const link = await this.biAcessoRepository.findOne({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Link BI com ID ${id} não encontrado`);
    }
    return link;
  }

  async update(id: string, dto: UpdateBiAcessoLinkDto): Promise<BiAcessoLink> {
    const link = await this.findOne(id);
    if (dto.url) {
      this.validateBiUrl(dto.url);
    }
    Object.assign(link, dto);
    return this.biAcessoRepository.save(link);
  }

  async remove(id: string): Promise<void> {
    const link = await this.findOne(id);
    await this.biAcessoRepository.remove(link);
  }

  async getPermissionItems(): Promise<BiPermissionItem[]> {
    const links = await this.biAcessoRepository.find({
      order: { ordem: 'ASC', nomeMenu: 'ASC' },
    });
    return links.map((link) => ({
      key: this.buildPermissionKey(link.id),
      label: `Acessar BI: ${link.nomeMenu}`,
    }));
  }

  async getAllPermissionKeys(): Promise<string[]> {
    const links = await this.biAcessoRepository.find({
      select: ['id'],
    });
    return links.map((link) => this.buildPermissionKey(link.id));
  }

  async getMenuForPermissions(permissions: string[]): Promise<BiMenuItemDto[]> {
    if (!permissions.length) {
      return [];
    }

    const links = await this.biAcessoRepository.find({
      where: { ativo: true },
      order: { ordem: 'ASC', nomeMenu: 'ASC' },
    });

    return links
      .filter((link) => permissions.includes(this.buildPermissionKey(link.id)))
      .map((link) => ({
        id: link.id,
        label: link.nomeMenu,
        externalUrl: link.url,
        icon: link.icone,
        permissionKey: this.buildPermissionKey(link.id),
        group: link.grupoMenu,
        subgroup: link.subgrupoMenu,
        order: link.ordem,
      }));
  }

  async getMenuForUser(userId: string | undefined): Promise<BiMenuItemDto[]> {
    if (!userId) {
      return [];
    }

    const user = await this.usuarioRepository.findOne({
      where: { id: userId, ativo: true },
      relations: ['perfis'],
    });

    const permissions = Array.from(
      new Set((user?.perfis || []).flatMap((perfil) => perfil.permissoes || [])),
    ) as string[];
    return this.getMenuForPermissions(permissions);
  }

  async getAccessibleLinkForUser(
    linkId: string,
    userId: string | undefined,
  ): Promise<BiAcessoViewerDto> {
    if (!userId) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const user = await this.usuarioRepository.findOne({
      where: { id: userId, ativo: true },
      relations: ['perfis'],
    });

    if (!user) {
      throw new ForbiddenException('Usuário inválido');
    }

    const permissionKey = this.buildPermissionKey(linkId);
    const permissions = Array.from(
      new Set((user.perfis || []).flatMap((perfil) => perfil.permissoes || [])),
    ) as string[];
    if (!permissions.includes(permissionKey)) {
      throw new ForbiddenException('Usuário sem permissão para esse link BI');
    }

    const link = await this.biAcessoRepository.findOne({
      where: { id: linkId, ativo: true },
    });

    if (!link) {
      throw new NotFoundException('Link BI não encontrado ou inativo');
    }

    return {
      id: link.id,
      nomeMenu: link.nomeMenu,
      url: link.url,
    };
  }
}
