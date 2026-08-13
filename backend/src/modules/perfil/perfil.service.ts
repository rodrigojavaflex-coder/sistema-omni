import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '../../common/enums/permission.enum';
import { buildPermissionCatalog } from '../../common/utils/permission-catalog.util';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Perfil } from './entities/perfil.entity';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { BiAcessoService } from '../bi-acesso/bi-acesso.service';

export type PerfilUsuarioVinculado = {
  id: string;
  nome: string;
  empresaLabel: string | null;
};

export type PerfilComEstatisticas = Perfil & {
  totalUsuarios: number;
  usuariosVinculados: PerfilUsuarioVinculado[];
};

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly biAcessoService: BiAcessoService,
  ) {}

  private async resolveAllowedPermissionKeys(): Promise<Set<string>> {
    const staticKeys = Object.values(Permission);
    const biKeys = await this.biAcessoService.getAllPermissionKeys();
    return new Set<string>([...staticKeys, ...biKeys]);
  }

  private async sanitizePermissions(input: string[]): Promise<string[]> {
    const allowed = await this.resolveAllowedPermissionKeys();
    const normalized = Array.from(
      new Set((input || []).map((item) => item?.trim())),
    ).filter((item): item is string => !!item);
    const invalid = normalized.filter((item) => !allowed.has(item));
    if (invalid.length) {
      throw new BadRequestException(
        `Permissões inválidas informadas: ${invalid.join(', ')}`,
      );
    }
    return normalized;
  }

  async create(createDto: CreatePerfilDto): Promise<Perfil> {
    const permissoes = await this.sanitizePermissions(createDto.permissoes);
    const perfil = this.perfilRepository.create({
      ...createDto,
      permissoes,
    });
    return this.perfilRepository.save(perfil);
  }

  async findAll(): Promise<PerfilComEstatisticas[]> {
    const perfis = await this.perfilRepository.find({
      order: { nomePerfil: 'ASC' },
      relations: { usuarios: { empresa: true } },
    });

    const allowedPermissionKeys = await this.resolveAllowedPermissionKeys();
    let cleaned = false;

    for (const perfil of perfis) {
      const originalLength = perfil.permissoes?.length || 0;
      const cleanedPermissions =
        perfil.permissoes?.filter((p) => allowedPermissionKeys.has(p)) || [];

      if (originalLength !== cleanedPermissions.length) {
        perfil.permissoes = cleanedPermissions;
        cleaned = true;
      }
    }

    if (cleaned) {
      await this.perfilRepository.save(perfis);
    }

    return perfis.map(({ usuarios, ...perfil }) => {
      const usuariosVinculados = (usuarios ?? [])
        .map((u) => ({
          id: u.id,
          nome: u.nome,
          empresaLabel: u.empresa?.descricao ?? null,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      return {
        ...perfil,
        totalUsuarios: usuariosVinculados.length,
        usuariosVinculados,
      };
    });
  }

  async findOne(id: string): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOne({ where: { id } });
    if (!perfil) {
      throw new NotFoundException(`Perfil com id ${id} não encontrado`);
    }

    // Limpar permissões obsoletas (que não existem mais no enum)
    const allowedPermissionKeys = await this.resolveAllowedPermissionKeys();
    const originalLength = perfil.permissoes?.length || 0;
    const cleanedPermissions =
      perfil.permissoes?.filter((p) => allowedPermissionKeys.has(p)) || [];

    // Se houve remoção de permissões obsoletas, atualizar no banco
    if (originalLength !== cleanedPermissions.length) {
      perfil.permissoes = cleanedPermissions;
      await this.perfilRepository.save(perfil);
    }

    return perfil;
  }

  async update(id: string, updateDto: UpdatePerfilDto): Promise<Perfil> {
    const perfil = await this.findOne(id);
    const dataToUpdate: UpdatePerfilDto = { ...updateDto };
    if (updateDto.permissoes) {
      dataToUpdate.permissoes = await this.sanitizePermissions(
        updateDto.permissoes,
      );
    }
    Object.assign(perfil, dataToUpdate);
    return this.perfilRepository.save(perfil);
  }

  async remove(id: string): Promise<void> {
    const perfil = await this.findOne(id);
    await this.perfilRepository.remove(perfil);
  }

  /**
   * Adiciona o perfil à lista de perfis de cada usuário informado (sem remover vínculos existentes).
   */
  async vincularUsuarios(
    perfilId: string,
    usuarioIds: string[],
  ): Promise<PerfilComEstatisticas> {
    const perfil = await this.findOne(perfilId);
    const uniqueIds = Array.from(new Set(usuarioIds.filter(Boolean)));

    const usuarios = await this.usuarioRepository.find({
      where: { id: In(uniqueIds) },
      relations: { perfis: true },
    });

    if (usuarios.length !== uniqueIds.length) {
      throw new NotFoundException('Um ou mais usuários não foram encontrados');
    }

    for (const usuario of usuarios) {
      const idsAtuais = new Set((usuario.perfis ?? []).map((p) => p.id));
      if (!idsAtuais.has(perfil.id)) {
        usuario.perfis = [...(usuario.perfis ?? []), perfil];
      }
    }

    await this.usuarioRepository.save(usuarios);

    const atualizado = (await this.findAll()).find((p) => p.id === perfilId);
    if (!atualizado) {
      throw new NotFoundException(`Perfil com id ${perfilId} não encontrado`);
    }
    return atualizado;
  }

  /**
   * Remove o perfil da lista de perfis de cada usuário informado.
   */
  async desvincularUsuarios(
    perfilId: string,
    usuarioIds: string[],
  ): Promise<PerfilComEstatisticas> {
    const perfil = await this.findOne(perfilId);
    const uniqueIds = Array.from(new Set(usuarioIds.filter(Boolean)));

    const usuarios = await this.usuarioRepository.find({
      where: { id: In(uniqueIds) },
      relations: { perfis: true },
    });

    if (usuarios.length !== uniqueIds.length) {
      throw new NotFoundException('Um ou mais usuários não foram encontrados');
    }

    for (const usuario of usuarios) {
      const perfisAtuais = usuario.perfis ?? [];
      const vinculado = perfisAtuais.some((p) => p.id === perfil.id);
      if (!vinculado) {
        throw new BadRequestException(
          `O usuário "${usuario.nome}" não está vinculado a este perfil`,
        );
      }
      const restantes = perfisAtuais.filter((p) => p.id !== perfil.id);
      if (restantes.length === 0) {
        throw new BadRequestException(
          `O usuário "${usuario.nome}" deve permanecer com ao menos um perfil`,
        );
      }
      usuario.perfis = restantes;
    }

    await this.usuarioRepository.save(usuarios);

    const atualizado = (await this.findAll()).find((p) => p.id === perfilId);
    if (!atualizado) {
      throw new NotFoundException(`Perfil com id ${perfilId} não encontrado`);
    }
    return atualizado;
  }

  /**
   * Gera dados formatados para impressão de perfil
   */
  async getPrintData(id: string): Promise<{
    nomePerfil: string;
    printedAt: Date;
    users: string[];
    groups: { group: string; permissions: string[] }[];
  }> {
    const perfil = await this.findOne(id);
    const biPermissionItems = await this.biAcessoService.getPermissionItems();
    const catalog = buildPermissionCatalog({
      'BI — Acesso': biPermissionItems.map((item) => ({
        key: item.key,
        label: item.label,
      })),
    });
    const selected = new Set(perfil.permissoes);

    const groups = catalog.modules.flatMap((mod) =>
      mod.groups
        .map((group) => ({
          group: `${mod.label} — ${group.label}`,
          permissions: group.permissions
            .filter((item) => selected.has(item.key))
            .map((item) => item.label),
        }))
        .filter((g) => g.permissions.length > 0),
    );
    // Listar usuários vinculados ao perfil
    const usuarios = await this.usuarioRepository
      .createQueryBuilder('usuario')
      .innerJoin('usuario.perfis', 'perfil', 'perfil.id = :perfilId', {
        perfilId: id,
      })
      .select(['usuario.nome'])
      .getMany();
    const users = usuarios.map((u) => u.nome);

    return {
      nomePerfil: perfil.nomePerfil,
      printedAt: new Date(),
      users,
      groups,
    };
  }
}
