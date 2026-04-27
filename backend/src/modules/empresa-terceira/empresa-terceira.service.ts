import {
  BadRequestException,
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

  private normalizeEmailsRelatorio(input?: string): string | undefined {
    if (!input) {
      return undefined;
    }
    const emails = input
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    if (emails.length === 0) {
      return undefined;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidos = emails.filter((email) => !emailRegex.test(email));
    if (invalidos.length > 0) {
      throw new BadRequestException(
        `E-mails inválidos para relatório: ${invalidos.join(', ')}`,
      );
    }
    return emails.join(', ');
  }

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
    const entidade = this.repository.create({
      descricao: descricaoNorm,
      emailsRelatorio: this.normalizeEmailsRelatorio(dto.emailsRelatorio),
      ehEmpresaManutencao: !!dto.ehEmpresaManutencao,
    });
    return this.repository.save(entidade);
  }

  async findAll(onlyManutencao = false): Promise<EmpresaTerceira[]> {
    return this.repository.find({
      where: onlyManutencao ? { ehEmpresaManutencao: true } : {},
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
    if (dto.emailsRelatorio !== undefined) {
      entidade.emailsRelatorio = this.normalizeEmailsRelatorio(dto.emailsRelatorio);
    }
    if (dto.ehEmpresaManutencao !== undefined) {
      entidade.ehEmpresaManutencao = !!dto.ehEmpresaManutencao;
    }
    return this.repository.save(entidade);
  }

  async remove(id: string): Promise<void> {
    const entidade = await this.findOne(id);
    await this.repository.remove(entidade);
  }
}
