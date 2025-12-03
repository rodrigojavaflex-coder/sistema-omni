import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Departamento } from './entities/departamento.entity';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  async create(dto: CreateDepartamentoDto): Promise<Departamento> {
    const departamento = this.departamentoRepository.create(dto);
    return this.departamentoRepository.save(departamento);
  }

  findAll(nome?: string): Promise<Departamento[]> {
    const where = nome ? { nomeDepartamento: ILike(`%${nome}%`) } : {};
    return this.departamentoRepository.find({
      where,
      order: { nomeDepartamento: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Departamento> {
    const departamento = await this.departamentoRepository.findOne({
      where: { id },
    });
    if (!departamento) {
      throw new NotFoundException(`Departamento com id ${id} não encontrado`);
    }
    return departamento;
  }

  async update(id: string, dto: UpdateDepartamentoDto): Promise<Departamento> {
    const departamento = await this.findOne(id);
    Object.assign(departamento, dto);
    return this.departamentoRepository.save(departamento);
  }

  async remove(id: string): Promise<void> {
    const departamento = await this.findOne(id);
    await this.departamentoRepository.remove(departamento);
  }
}
