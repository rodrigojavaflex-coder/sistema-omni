import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaTerceira } from './entities/empresa-terceira.entity';
import { CreateEmpresaTerceiraDto } from './dto/create-empresa-terceira.dto';
import { UpdateEmpresaTerceiraDto } from './dto/update-empresa-terceira.dto';

@Injectable()
export class EmpresaTerceiraService {
  constructor(
    @InjectRepository(EmpresaTerceira)
    private readonly repository: Repository<EmpresaTerceira>,
  ) {}

  async create(dto: CreateEmpresaTerceiraDto): Promise<EmpresaTerceira> {
    const descricaoNorm = dto.descricao.trim();
    const existente = await this.repository.findOne({
      where: { descricao: descricaoNorm },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe uma empresa terceira com a descrição "${descricaoNorm}"`,
      );
    }
    const entidade = this.repository.create({ descricao: descricaoNorm });
    return this.repository.save(entidade);
  }

  async findAll(): Promise<EmpresaTerceira[]> {
    return this.repository.find({
      order: { descricao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<EmpresaTerceira> {
    const entidade = await this.repository.findOne({ where: { id } });
    if (!entidade) {
      throw new NotFoundException('Empresa terceira não encontrada');
    }
    return entidade;
  }

  async update(
    id: string,
    dto: UpdateEmpresaTerceiraDto,
  ): Promise<EmpresaTerceira> {
    const entidade = await this.findOne(id);
    if (dto.descricao !== undefined) {
      const descricaoNorm = dto.descricao.trim();
      const existente = await this.repository.findOne({
        where: { descricao: descricaoNorm },
      });
      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Já existe outra empresa com a descrição "${descricaoNorm}"`,
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
