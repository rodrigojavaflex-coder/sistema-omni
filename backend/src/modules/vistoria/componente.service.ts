import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Componente } from './entities/componente.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { CreateComponenteDto } from './dto/create-componente.dto';
import { UpdateComponenteDto } from './dto/update-componente.dto';

@Injectable()
export class ComponenteService {
  constructor(
    @InjectRepository(Componente)
    private readonly componenteRepository: Repository<Componente>,
    @InjectRepository(AreaComponente)
    private readonly areaComponenteRepository: Repository<AreaComponente>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizCriticidadeRepository: Repository<MatrizCriticidade>,
  ) {}

  async create(dto: CreateComponenteDto): Promise<Componente> {
    const componente = this.componenteRepository.create({
      nome: dto.nome,
      ativo: dto.ativo ?? true,
    });
    return this.componenteRepository.save(componente);
  }

  async findAll(ativo?: boolean): Promise<Componente[]> {
    const where: Record<string, unknown> = {};
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    return this.componenteRepository.find({ where, order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<Componente> {
    const componente = await this.componenteRepository.findOne({ where: { id } });
    if (!componente) {
      throw new NotFoundException('Componente não encontrado');
    }
    return componente;
  }

  async update(id: string, dto: UpdateComponenteDto): Promise<Componente> {
    const componente = await this.findOne(id);
    const updated = this.componenteRepository.merge(componente, {
      nome: dto.nome ?? componente.nome,
      ativo: dto.ativo ?? componente.ativo,
    });
    return this.componenteRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const componente = await this.findOne(id);
    const [countAreas, countMatriz] = await Promise.all([
      this.areaComponenteRepository.count({ where: { idComponente: id } }),
      this.matrizCriticidadeRepository.count({ where: { idComponente: id } }),
    ]);
    if (countAreas > 0) {
      throw new BadRequestException(
        'Não é possível excluir o componente pois ele está vinculado a uma ou mais áreas. Remova o componente das áreas antes de excluir.',
      );
    }
    if (countMatriz > 0) {
      throw new BadRequestException(
        'Não é possível excluir o componente pois existem registros na matriz de criticidade. Remova ou altere as matrizes antes de excluir.',
      );
    }
    await this.componenteRepository.remove(componente);
  }
}
