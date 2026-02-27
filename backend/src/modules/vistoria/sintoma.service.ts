import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sintoma } from './entities/sintoma.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { CreateSintomaDto } from './dto/create-sintoma.dto';
import { UpdateSintomaDto } from './dto/update-sintoma.dto';

@Injectable()
export class SintomaService {
  constructor(
    @InjectRepository(Sintoma)
    private readonly sintomaRepository: Repository<Sintoma>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizCriticidadeRepository: Repository<MatrizCriticidade>,
  ) {}

  async create(dto: CreateSintomaDto): Promise<Sintoma> {
    const sintoma = this.sintomaRepository.create({
      descricao: dto.descricao,
      ativo: dto.ativo ?? true,
    });
    return this.sintomaRepository.save(sintoma);
  }

  async findAll(ativo?: boolean): Promise<Sintoma[]> {
    const where: Record<string, unknown> = {};
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    return this.sintomaRepository.find({ where, order: { descricao: 'ASC' } });
  }

  async findOne(id: string): Promise<Sintoma> {
    const sintoma = await this.sintomaRepository.findOne({ where: { id } });
    if (!sintoma) {
      throw new NotFoundException('Sintoma não encontrado');
    }
    return sintoma;
  }

  async update(id: string, dto: UpdateSintomaDto): Promise<Sintoma> {
    const sintoma = await this.findOne(id);
    const updated = this.sintomaRepository.merge(sintoma, {
      descricao: dto.descricao ?? sintoma.descricao,
      ativo: dto.ativo ?? sintoma.ativo,
    });
    return this.sintomaRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const sintoma = await this.findOne(id);
    const countMatriz = await this.matrizCriticidadeRepository.count({
      where: { idSintoma: id },
    });
    if (countMatriz > 0) {
      throw new BadRequestException(
        'Não é possível excluir o sintoma pois existem registros na matriz de criticidade. Remova ou altere as matrizes antes de excluir.',
      );
    }
    await this.sintomaRepository.remove(sintoma);
  }
}
