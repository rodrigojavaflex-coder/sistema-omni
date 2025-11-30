import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Meta } from './entities/meta.entity';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
    @InjectRepository(DepartamentoUsuario)
    private readonly departamentoUsuarioRepository: Repository<DepartamentoUsuario>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  private async assertAccess(userId: string, departamentoId: string) {
    const acesso = await this.departamentoUsuarioRepository.findOne({
      where: { usuarioId: userId, departamentoId },
    });
    if (!acesso) {
      throw new ForbiddenException('Usuário não tem acesso a este departamento');
    }
  }

  async create(userId: string, dto: CreateMetaDto): Promise<Meta> {
    await this.assertAccess(userId, dto.departamentoId);
    const meta = this.metaRepository.create(dto);
    return this.metaRepository.save(meta);
  }

  async findAll(userId: string): Promise<Meta[]> {
    const deps = await this.departamentoUsuarioRepository.find({
      where: { usuarioId: userId },
      select: ['departamentoId'],
    });
    const ids = deps.map((d) => d.departamentoId);
    if (ids.length === 0) return [];
    return this.metaRepository.find({
      where: { departamentoId: In(ids) },
      order: { prazoFinal: 'ASC', nomeDaMeta: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Meta> {
    const meta = await this.metaRepository.findOne({ where: { id } });
    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }
    await this.assertAccess(userId, meta.departamentoId);
    return meta;
  }

  async update(userId: string, id: string, dto: UpdateMetaDto): Promise<Meta> {
    const meta = await this.findOne(userId, id);
    if (dto.departamentoId) {
      await this.assertAccess(userId, dto.departamentoId);
      meta.departamentoId = dto.departamentoId;
      const dep = await this.departamentoRepository.findOne({ where: { id: dto.departamentoId } });
      meta.departamento = dep || meta.departamento;
    }
    Object.assign(meta, {
      nomeDaMeta: dto.nomeDaMeta ?? meta.nomeDaMeta,
      descricaoDetalhada: dto.descricaoDetalhada ?? meta.descricaoDetalhada,
      prazoFinal: dto.prazoFinal ?? meta.prazoFinal,
      meta: dto.meta ?? meta.meta,
    });
    return this.metaRepository.save(meta);
  }

  async remove(userId: string, id: string): Promise<void> {
    const meta = await this.findOne(userId, id);
    await this.metaRepository.remove(meta);
  }
}
