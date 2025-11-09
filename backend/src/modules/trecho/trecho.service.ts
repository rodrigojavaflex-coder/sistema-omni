import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Trecho } from './entities/trecho.entity';
import { CreateTrechoDto } from './dto/create-trecho.dto';
import { UpdateTrechoDto } from './dto/update-trecho.dto';

@Injectable()
export class TrechoService {
  constructor(
    @InjectRepository(Trecho)
    private readonly trechoRepository: Repository<Trecho>,
  ) {}

  async create(createTrechoDto: CreateTrechoDto): Promise<Trecho> {
    // Verifica se já existe trecho com a mesma descrição
    const existente = await this.trechoRepository.findOne({
      where: { descricao: createTrechoDto.descricao }
    });

    if (existente) {
      throw new ConflictException('Já existe um trecho cadastrado com esta descrição');
    }

    const trecho = this.trechoRepository.create(createTrechoDto);
    return await this.trechoRepository.save(trecho);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    descricao?: string,
    orderBy?: string,
    order?: string
  ): Promise<{ data: Trecho[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const where = {};
    if (descricao) {
      where['descricao'] = ILike(`%${descricao}%`);
    }

    // Validar parâmetros de ordenação
    const orderByField = orderBy === 'atualizadoEm' ? 'atualizadoEm' : 'criadoEm';
    const orderDirection = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const [data, total] = await this.trechoRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { [orderByField]: orderDirection }
    });

    return {
      data,
      total,
      page,
      limit
    };
  }

  async findOne(id: string): Promise<Trecho> {
    const trecho = await this.trechoRepository.findOne({ where: { id } });

    if (!trecho) {
      throw new NotFoundException(`Trecho com ID ${id} não encontrado`);
    }

    return trecho;
  }

  async findByLocation(latitude: number, longitude: number): Promise<Trecho[]> {
    try {
      // Os dados foram salvos no banco com latitude/longitude invertidos!
      // O polígono tem as coordenadas em (latitude longitude)
      // Então criamos o ponto também em (latitude longitude)
      
      const query = `
        SELECT 
          t."id",
          t."descricao",
          t."area",
          t."criadoEm",
          t."atualizadoEm"
        FROM trechos t
        WHERE t."area" IS NOT NULL
        AND ST_Contains(t."area"::geometry, ST_SetSRID(ST_Point($1, $2), 4326)::geometry)
        LIMIT 1
      `;

      return await this.trechoRepository.query(query, [latitude, longitude]);
    } catch (error: any) {
      return [];
    }
  }

  async update(id: string, updateTrechoDto: UpdateTrechoDto): Promise<Trecho> {
    const trecho = await this.findOne(id);

    // Se está atualizando a descrição, verifica se já existe outra com a mesma
    if (updateTrechoDto.descricao && updateTrechoDto.descricao !== trecho.descricao) {
      const existente = await this.trechoRepository.findOne({
        where: { descricao: updateTrechoDto.descricao }
      });

      if (existente) {
        throw new ConflictException('Já existe um trecho cadastrado com esta descrição');
      }
    }

    Object.assign(trecho, updateTrechoDto);
    return await this.trechoRepository.save(trecho);
  }

  async remove(id: string): Promise<void> {
    const trecho = await this.findOne(id);
    await this.trechoRepository.remove(trecho);
  }
}
