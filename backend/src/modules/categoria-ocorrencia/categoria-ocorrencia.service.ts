import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaOcorrencia } from './entities/categoria-ocorrencia.entity';
import { CreateCategoriaOcorrenciaDto } from './dto/create-categoria-ocorrencia.dto';
import { UpdateCategoriaOcorrenciaDto } from './dto/update-categoria-ocorrencia.dto';
import { OrigemOcorrenciaService } from '../origem-ocorrencia/origem-ocorrencia.service';

@Injectable()
export class CategoriaOcorrenciaService {
  constructor(
    @InjectRepository(CategoriaOcorrencia)
    private readonly repository: Repository<CategoriaOcorrencia>,
    private readonly origemService: OrigemOcorrenciaService,
  ) {}

  async create(dto: CreateCategoriaOcorrenciaDto): Promise<CategoriaOcorrencia> {
    await this.origemService.findOne(dto.idOrigem);
    const entidade = this.repository.create({
      descricao: dto.descricao.trim(),
      idOrigem: dto.idOrigem,
      responsavel: dto.responsavel?.trim() ?? undefined,
    });
    return this.repository.save(entidade);
  }

  async findAll(origemId?: string): Promise<CategoriaOcorrencia[]> {
    const qb = this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.origem', 'origem')
      .orderBy('c.descricao', 'ASC');
    if (origemId) {
      qb.andWhere('c.idOrigem = :origemId', { origemId });
    }
    return qb.getMany();
  }

  async findByOrigem(origemId: string): Promise<CategoriaOcorrencia[]> {
    return this.repository.find({
      where: { idOrigem: origemId },
      order: { descricao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CategoriaOcorrencia> {
    const entidade = await this.repository.findOne({
      where: { id },
      relations: ['origem'],
    });
    if (!entidade) {
      throw new NotFoundException('Categoria da ocorrência não encontrada');
    }
    return entidade;
  }

  async update(
    id: string,
    dto: UpdateCategoriaOcorrenciaDto,
  ): Promise<CategoriaOcorrencia> {
    const entidade = await this.findOne(id);
    if (dto.idOrigem !== undefined) {
      await this.origemService.findOne(dto.idOrigem);
      entidade.idOrigem = dto.idOrigem;
    }
    if (dto.descricao !== undefined) entidade.descricao = dto.descricao.trim();
    if (dto.responsavel !== undefined)
      entidade.responsavel = dto.responsavel?.trim() ?? null;
    return this.repository.save(entidade);
  }

  async remove(id: string): Promise<void> {
    const entidade = await this.findOne(id);
    await this.repository.remove(entidade);
  }
}
