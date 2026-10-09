import {
  Injectable,
  ConflictException,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Perfil } from '../perfil/entities/perfil.entity';
import * as bcrypt from 'bcrypt';
import { Departamento } from '../departamento/entities/departamento.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Usuario } from './entities/usuario.entity';
import { UsuarioEmpresaManutencao } from './entities/usuario-empresa-manutencao.entity';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FindUsuariosDto } from './dto/find-usuarios.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../../common/dto/paginated-response.dto';
import {
  HOME_SHORTCUT_ID_SET,
  HOME_SHORTCUTS_MAX,
  isBiHomeShortcutId,
  extractBiLinkIdFromShortcutId,
} from '../../common/constants/home-shortcut-ids';
import { BiAcessoService } from '../bi-acesso/bi-acesso.service';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository(DepartamentoUsuario)
    private readonly departamentoUsuarioRepository: Repository<DepartamentoUsuario>,
    @InjectRepository(EmpresaTerceira)
    private readonly empresaTerceiraRepository: Repository<EmpresaTerceira>,
    @InjectRepository(UsuarioEmpresaManutencao)
    private readonly usuarioEmpresaManutencaoRepository: Repository<UsuarioEmpresaManutencao>,
    private readonly biAcessoService: BiAcessoService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    this.logger.debug('UserService.create called with:', createUsuarioDto);
    try {
      // Verificar se já existe um usuário com este email
      const existingUser = await this.usuarioRepository.findOneBy({
        email: createUsuarioDto.email,
      });
      if (existingUser) {
        throw new ConflictException(
          `Já existe um usuário cadastrado com este email: ${existingUser.nome} (${existingUser.email})`,
        );
      }

      // Hash da senha antes de salvar
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        createUsuarioDto.senha || 'Ro112543*',
        saltRounds,
      );

      const perfilIds = Array.from(
        new Set(createUsuarioDto.perfilIds || []),
      ).filter(Boolean);
      const perfis = await this.perfilRepository.find({
        where: { id: In(perfilIds) },
      });
      if (!perfis.length || perfis.length !== perfilIds.length) {
        throw new NotFoundException(
          'Um ou mais perfis informados não foram encontrados',
        );
      }
      const idsEmpresas = this.resolveIdsEmpresasManutencaoInput(
        createUsuarioDto.idsEmpresasManutencao,
        createUsuarioDto.idEmpresa,
      );

      const userData = {
        nome: createUsuarioDto.nome,
        email: createUsuarioDto.email,
        senha: hashedPassword,
        ativo: createUsuarioDto.ativo ?? true,
        tema: createUsuarioDto.tema || 'Claro',
        perfis,
      };

      this.logger.debug('Processed user data:', {
        ...userData,
        password: '[HASHED]',
      });

      const user = this.usuarioRepository.create(userData);
      this.logger.debug('User entity created:', {
        ...user,
        password: '[HASHED]',
      });

      const savedUser = await this.usuarioRepository.save(user);

      if (createUsuarioDto.departamentoIds?.length) {
        await this.syncDepartamentos(
          savedUser.id,
          createUsuarioDto.departamentoIds,
        );
      }

      await this.syncEmpresasManutencao(savedUser.id, idsEmpresas);

      this.logger.log('User saved successfully:', {
        id: savedUser.id,
        name: savedUser.nome,
        email: savedUser.email,
      });

      return this.findOne(savedUser.id);
    } catch (error) {
      this.logger.error('Error creating user:', error);

      // Se já capturamos o erro de unicidade acima, re-lançar
      if (error instanceof ConflictException) {
        throw error;
      }

      // Verificar se é um erro de violação de constraint de unicidade do banco
      if (
        error.code === '23505' ||
        error.message?.includes(
          'duplicate key value violates unique constraint',
        )
      ) {
        // Buscar o usuário existente para mostrar informações na mensagem
        try {
          const existingUser = await this.usuarioRepository.findOneBy({
            email: createUsuarioDto.email,
          });
          if (existingUser) {
            throw new ConflictException(
              `Já existe um usuário cadastrado com este email: ${existingUser.nome} (${existingUser.email})`,
            );
          }
        } catch (findError) {
          // Se não conseguir buscar o usuário, usar mensagem genérica
          this.logger.warn(
            'Não foi possível buscar usuário existente:',
            findError,
          );
        }
        throw new ConflictException(
          'Já existe um usuário cadastrado com este email',
        );
      }

      this.logger.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async findAll(
    findUsuariosDto: FindUsuariosDto,
  ): Promise<PaginatedResponseDto<Usuario>> {
    const { page = 1, limit = 10, nome, email } = findUsuariosDto;

    const queryBuilder = this.usuarioRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.perfis', 'perfis')
      .leftJoinAndSelect('user.departamentosUsuario', 'du')
      .leftJoinAndSelect('du.departamento', 'departamento')
      .distinct(true);

    if (nome) {
      queryBuilder.andWhere('user.nome ILIKE :nome', { nome: `%${nome}%` });
    }

    if (email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.criadoEm', 'DESC')
      .getManyAndCount();

    users.forEach((u: any) => {
      if (u.departamentosUsuario) {
        u.departamentos = u.departamentosUsuario.map(
          (du: any) => du.departamento,
        );
      }
    });
    await this.hydrateEmpresasManutencao(users);

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(users, meta);
  }

  async findOne(id: string): Promise<Usuario> {
    // Carregar usuário incluindo os perfis para disponibilizar permissões consolidadas
    const user = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['perfis', 'empresa'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const departamentosUsuario = await this.departamentoUsuarioRepository.find({
      where: { usuarioId: id },
      relations: ['departamento'],
    });
    (user as any).departamentos = departamentosUsuario.map(
      (du) => du.departamento,
    );
    await this.hydrateEmpresasManutencao([user]);

    return user;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const user = await this.findOne(id);

    // Se está alterando o email, verificar se já não existe outro usuário com esse email
    if (updateUsuarioDto.email && updateUsuarioDto.email !== user.email) {
      const existingUser = await this.usuarioRepository.findOneBy({
        email: updateUsuarioDto.email,
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `Já existe um usuário cadastrado com este email: ${existingUser.nome} (${existingUser.email})`,
        );
      }
    }

    // Se está alterando a senha, fazer hash
    if (updateUsuarioDto.senha) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        updateUsuarioDto.senha,
        saltRounds,
      );
      user.senha = hashedPassword;
    }

    // Atualizar outras propriedades
    if (updateUsuarioDto.nome !== undefined) user.nome = updateUsuarioDto.nome;
    if (updateUsuarioDto.email !== undefined)
      user.email = updateUsuarioDto.email;
    if (updateUsuarioDto.ativo !== undefined)
      user.ativo = updateUsuarioDto.ativo;
    if (updateUsuarioDto.perfilIds !== undefined) {
      const perfilIds = Array.from(
        new Set(updateUsuarioDto.perfilIds || []),
      ).filter(Boolean);
      const perfis = await this.perfilRepository.find({
        where: { id: In(perfilIds) },
      });
      if (!perfis.length || perfis.length !== perfilIds.length) {
        throw new NotFoundException(
          'Um ou mais perfis informados não foram encontrados',
        );
      }
      user.perfis = perfis;
    }
    if (updateUsuarioDto.tema !== undefined) user.tema = updateUsuarioDto.tema;

    const shouldSyncEmpresas =
      updateUsuarioDto.idsEmpresasManutencao !== undefined ||
      updateUsuarioDto.idEmpresa !== undefined;
    const idsEmpresasUpdate = shouldSyncEmpresas
      ? this.resolveIdsEmpresasManutencaoInput(
          updateUsuarioDto.idsEmpresasManutencao,
          updateUsuarioDto.idEmpresa,
        )
      : null;

    try {
      await this.usuarioRepository.save(user);
      if (updateUsuarioDto.departamentoIds) {
        await this.syncDepartamentos(id, updateUsuarioDto.departamentoIds);
      }
      if (idsEmpresasUpdate !== null) {
        await this.syncEmpresasManutencao(id, idsEmpresasUpdate);
      }
      return this.findOne(id);
    } catch (error) {
      // Verificar se é um erro de violação de constraint de unicidade do banco
      if (
        error.code === '23505' ||
        error.message?.includes(
          'duplicate key value violates unique constraint',
        )
      ) {
        // Buscar o usuário existente para mostrar informações na mensagem
        try {
          const existingUser = await this.usuarioRepository.findOneBy({
            email: updateUsuarioDto.email,
          });
          if (existingUser && existingUser.id !== id) {
            throw new ConflictException(
              `Já existe um usuário cadastrado com este email: ${existingUser.nome} (${existingUser.email})`,
            );
          }
        } catch (findError) {
          // Se não conseguir buscar o usuário, usar mensagem genérica
          this.logger.warn(
            'Não foi possível buscar usuário existente:',
            findError,
          );
        }
        throw new ConflictException(
          'Já existe um usuário cadastrado com este email',
        );
      }
      throw error;
    }
  }

  async sanitizeAtalhosHomeIds(
    atalhosHome: string[],
    userId: string,
  ): Promise<string[]> {
    const allowedBiLinkIds = new Set(
      (await this.biAcessoService.getMenuForUser(userId)).map((item) => item.id),
    );

    const seen = new Set<string>();
    const result: string[] = [];
    for (const id of atalhosHome) {
      if (typeof id !== 'string') continue;
      const trimmed = id.trim();
      if (!trimmed || seen.has(trimmed)) continue;

      if (HOME_SHORTCUT_ID_SET.has(trimmed)) {
        seen.add(trimmed);
        result.push(trimmed);
      } else if (isBiHomeShortcutId(trimmed)) {
        const linkId = extractBiLinkIdFromShortcutId(trimmed);
        if (linkId && allowedBiLinkIds.has(linkId)) {
          seen.add(trimmed);
          result.push(trimmed);
        }
      }

      if (result.length >= HOME_SHORTCUTS_MAX) break;
    }
    return result;
  }

  async updateAtalhosHome(id: string, atalhosHome: string[]): Promise<Usuario> {
    const user = await this.findOne(id);
    user.atalhosHome = await this.sanitizeAtalhosHomeIds(atalhosHome, id);

    try {
      return await this.usuarioRepository.save(user);
    } catch (error) {
      this.logger.error('Erro ao atualizar atalhos da home:', error);
      throw error;
    }
  }

  async updateTema(id: string, tema: string): Promise<Usuario> {
    const user = await this.findOne(id);

    // Validar tema
    if (!['Claro', 'Escuro'].includes(tema)) {
      throw new ConflictException('Tema deve ser Claro ou Escuro');
    }

    user.tema = tema;

    try {
      return await this.usuarioRepository.save(user);
    } catch (error) {
      this.logger.error('Erro ao atualizar tema do usuário:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usuarioRepository.remove(user);
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findOne(id);

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(currentPassword, user.senha);
    if (!isPasswordValid) {
      throw new ConflictException('Senha atual incorreta');
    }

    // Hash da nova senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    user.senha = hashedPassword;

    try {
      await this.usuarioRepository.save(user);
      this.logger.log('Senha atualizada com sucesso', { userId: user.id });
    } catch (error) {
      this.logger.error('Erro ao atualizar senha:', error);
      throw error;
    }
  }
  /**
   * Listar perfis disponíveis
   */
  async getProfiles(): Promise<Perfil[]> {
    return this.perfilRepository.find();
  }

  private async syncDepartamentos(
    userId: string,
    departamentoIds: string[],
  ): Promise<void> {
    const uniqueIds = Array.from(new Set(departamentoIds)).filter(Boolean);

    if (!uniqueIds.length) {
      await this.departamentoUsuarioRepository.delete({ usuarioId: userId });
      return;
    }

    const existentes = await this.departamentoRepository.find({
      where: { id: In(uniqueIds) },
      select: ['id'],
    });
    const existentesIds = new Set(existentes.map((d) => d.id));
    const validIds = uniqueIds.filter((id) => existentesIds.has(id));

    await this.departamentoUsuarioRepository.delete({ usuarioId: userId });

    const links = validIds.map((departamentoId) =>
      this.departamentoUsuarioRepository.create({
        usuarioId: userId,
        departamentoId,
      }),
    );
    if (links.length) {
      await this.departamentoUsuarioRepository.save(links);
    }
  }

  /**
   * Preferir `idsEmpresasManutencao`; `idEmpresa` legado vira lista de 0/1 item.
   */
  private resolveIdsEmpresasManutencaoInput(
    idsEmpresasManutencao?: string[],
    idEmpresa?: string | null,
  ): string[] {
    if (idsEmpresasManutencao !== undefined) {
      return Array.from(new Set(idsEmpresasManutencao)).filter(Boolean);
    }
    if (idEmpresa === null || idEmpresa === '') {
      return [];
    }
    if (idEmpresa) {
      return [idEmpresa];
    }
    return [];
  }

  private async syncEmpresasManutencao(
    userId: string,
    empresaIds: string[],
  ): Promise<void> {
    const uniqueIds = Array.from(new Set(empresaIds)).filter(Boolean);

    if (!uniqueIds.length) {
      await this.usuarioEmpresaManutencaoRepository.delete({ usuarioId: userId });
      await this.usuarioRepository.update(userId, { idEmpresa: null });
      return;
    }

    const empresas = await this.empresaTerceiraRepository.find({
      where: { id: In(uniqueIds), ehEmpresaManutencao: true },
      select: ['id'],
    });
    const validIds = empresas.map((e) => e.id);
    if (validIds.length !== uniqueIds.length) {
      throw new BadRequestException(
        'Uma ou mais empresas não existem ou não são de manutenção (ehEmpresaManutencao)',
      );
    }

    await this.usuarioEmpresaManutencaoRepository.delete({ usuarioId: userId });
    const links = validIds.map((empresaId) =>
      this.usuarioEmpresaManutencaoRepository.create({
        usuarioId: userId,
        empresaId,
      }),
    );
    await this.usuarioEmpresaManutencaoRepository.save(links);

    // Legado: idEmpresa = primeira vinculada (compatibilidade)
    const primeira = validIds[0];
    await this.usuarioRepository.update(userId, { idEmpresa: primeira });
  }

  async hydrateEmpresasManutencao(users: Usuario[]): Promise<void> {
    if (!users.length) {
      return;
    }
    const userIds = users.map((u) => u.id);
    const vinculos = await this.usuarioEmpresaManutencaoRepository.find({
      where: { usuarioId: In(userIds) },
      relations: ['empresa'],
      order: { criadoEm: 'ASC' },
    });
    const byUser = new Map<string, UsuarioEmpresaManutencao[]>();
    for (const v of vinculos) {
      const list = byUser.get(v.usuarioId) ?? [];
      list.push(v);
      byUser.set(v.usuarioId, list);
    }
    for (const user of users) {
      const list = byUser.get(user.id) ?? [];
      user.empresasManutencao = list
        .filter((v) => v.empresa)
        .map((v) => ({
          id: v.empresa.id,
          descricao: v.empresa.descricao,
        }));
      user.idsEmpresasManutencao = user.empresasManutencao.map((e) => e.id);
      if (!user.empresa && user.empresasManutencao[0]) {
        user.empresa = {
          id: user.empresasManutencao[0].id,
          descricao: user.empresasManutencao[0].descricao,
        } as EmpresaTerceira;
        user.idEmpresa = user.empresasManutencao[0].id;
      }
    }
  }
}
