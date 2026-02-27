import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModeloVeiculo } from './entities/modelo-veiculo.entity';
import { CreateModeloVeiculoDto } from './dto/create-modelo-veiculo.dto';
import { UpdateModeloVeiculoDto } from './dto/update-modelo-veiculo.dto';

@Injectable()
export class ModeloVeiculoService {
  constructor(
    @InjectRepository(ModeloVeiculo)
    private readonly modeloRepository: Repository<ModeloVeiculo>,
  ) {}

  async create(dto: CreateModeloVeiculoDto): Promise<ModeloVeiculo> {
    const modelo = this.modeloRepository.create({
      nome: dto.nome,
      ativo: dto.ativo ?? true,
    });
    return this.modeloRepository.save(modelo);
  }

  async findAll(ativo?: boolean): Promise<ModeloVeiculo[]> {
    const where: Record<string, unknown> = {};
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    return this.modeloRepository.find({ where, order: { nome: 'ASC' } });
  }

  async findOne(id: string): Promise<ModeloVeiculo> {
    const modelo = await this.modeloRepository.findOne({ where: { id } });
    if (!modelo) {
      throw new NotFoundException('Modelo de veículo não encontrado');
    }
    return modelo;
  }

  async update(id: string, dto: UpdateModeloVeiculoDto): Promise<ModeloVeiculo> {
    const modelo = await this.findOne(id);
    const updated = this.modeloRepository.merge(modelo, {
      nome: dto.nome ?? modelo.nome,
      ativo: dto.ativo ?? modelo.ativo,
    });
    return this.modeloRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const modelo = await this.findOne(id);
    await this.modeloRepository.remove(modelo);
  }
}
