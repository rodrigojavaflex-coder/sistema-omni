import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrigemOcorrencia } from './entities/origem-ocorrencia.entity';
import { CreateOrigemOcorrenciaDto } from './dto/create-origem-ocorrencia.dto';
import { UpdateOrigemOcorrenciaDto } from './dto/update-origem-ocorrencia.dto';

@Injectable()
export class OrigemOcorrenciaService {
  constructor(
    @InjectRepository(OrigemOcorrencia)
    private readonly repository: Repository<OrigemOcorrencia>,
  ) {}

  async create(dto: CreateOrigemOcorrenciaDto): Promise<OrigemOcorrencia> {
    const descricaoNorm = dto.descricao.trim();
    const existente = await this.repository.findOne({
      where: { descricao: descricaoNorm },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe uma origem de ocorrência com a descrição "${descricaoNorm}"`,
      );
    }
    const entidade = this.repository.create({ descricao: descricaoNorm });
    return this.repository.save(entidade);
  }

  async findAll(): Promise<OrigemOcorrencia[]> {
    return this.repository.find({
      order: { descricao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<OrigemOcorrencia> {
    const entidade = await this.repository.findOne({ where: { id } });
    if (!entidade) {
      throw new NotFoundException('Origem da ocorrência não encontrada');
    }
    return entidade;
  }

  async update(
    id: string,
    dto: UpdateOrigemOcorrenciaDto,
  ): Promise<OrigemOcorrencia> {
    const entidade = await this.findOne(id);
    if (dto.descricao !== undefined) {
      const descricaoNorm = dto.descricao.trim();
      const existente = await this.repository.findOne({
        where: { descricao: descricaoNorm },
      });
      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Já existe outra origem com a descrição "${descricaoNorm}"`,
        );
      }
      entidade.descricao = descricaoNorm;
    }
    return this.repository.save(entidade);
  }

  async remove(id: string): Promise<void> {
    const entidade = await this.findOne(id);
    await this.repository.remove(entidade);
  }
}
