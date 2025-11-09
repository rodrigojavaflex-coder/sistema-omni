import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Motorista } from './entities/motorista.entity';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';

@Injectable()
export class MotoristaService {
  constructor(
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
  ) {}

  async create(createMotoristaDto: CreateMotoristaDto): Promise<Motorista> {
    // Verifica se já existe motorista com o CPF
    const existenteByCpf = await this.motoristaRepository.findOne({
      where: { cpf: createMotoristaDto.cpf }
    });

    if (existenteByCpf) {
      throw new ConflictException('Já existe um motorista cadastrado com este CPF');
    }

    // Verifica se já existe motorista com a matrícula
    const existenteByMatricula = await this.motoristaRepository.findOne({
      where: { matricula: createMotoristaDto.matricula }
    });

    if (existenteByMatricula) {
      throw new ConflictException('Já existe um motorista cadastrado com esta matrícula');
    }

    const motorista = this.motoristaRepository.create(createMotoristaDto);
    return await this.motoristaRepository.save(motorista);
  }

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string,
    nome?: string,
    matricula?: string,
    cpf?: string,
    status?: string
  ): Promise<{ data: Motorista[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    let query = this.motoristaRepository
      .createQueryBuilder('motorista')
      .take(limit)
      .skip(skip)
      .orderBy('motorista.atualizadoEm', 'DESC');

    const conditions: string[] = [];
    const parameters: any = {};

    // Filtro por nome
    if (nome) {
      const nomeNormalized = this.normalizeText(nome);
      conditions.push(`LOWER(TRANSLATE(motorista.nome, 
        'ÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇáàãâäéèêëíìîïóòõôöúùûüç',
        'AAAAAEEEEIIIIOOOOOUUUUCaaaaaeeeeiiiioooooouuuuc'
      )) LIKE :nome`);
      parameters.nome = `%${nomeNormalized}%`;
    }

    // Filtro por matrícula
    if (matricula) {
      conditions.push('LOWER(motorista.matricula) LIKE :matricula');
      parameters.matricula = `%${matricula.toLowerCase()}%`;
    }

    // Filtro por CPF
    if (cpf) {
      const cpfOnlyNumbers = cpf.replace(/\D/g, '');
      conditions.push('motorista.cpf LIKE :cpf');
      parameters.cpf = `%${cpfOnlyNumbers}%`;
    }

    // Filtro por status
    if (status) {
      conditions.push('motorista.status = :status');
      parameters.status = status;
    }

    // Busca geral (se fornecida e não há filtros específicos de nome, matricula ou cpf)
    if (search && !nome && !matricula && !cpf) {
      const searchLower = search.toLowerCase();
      const searchOnlyNumbers = search.replace(/\D/g, '');
      
      // Monta condições baseado no tipo de busca
      const searchConditions: string[] = [
        'LOWER(motorista.nome) ILIKE :search',
        'LOWER(motorista.matricula) ILIKE :search'
      ];
      
      parameters.search = `%${searchLower}%`;
      
      // Só adiciona busca por CPF se houver números
      if (searchOnlyNumbers && searchOnlyNumbers.length > 0) {
        searchConditions.push('motorista.cpf ILIKE :searchNumbers');
        parameters.searchNumbers = `%${searchOnlyNumbers}%`;
      }
      
      conditions.push(`(${searchConditions.join(' OR ')})`);
    }

    // Aplica as condições
    if (conditions.length > 0) {
      query = query.where(conditions.join(' AND '), parameters);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  async findOne(id: string): Promise<Motorista> {
    const motorista = await this.motoristaRepository.findOne({
      where: { id }
    });

    if (!motorista) {
      throw new NotFoundException('Motorista não encontrado');
    }

    return motorista;
  }

  async update(id: string, updateMotoristaDto: UpdateMotoristaDto): Promise<Motorista> {
    const motorista = await this.findOne(id);

    // Verifica se o CPF já existe em outro motorista
    if (updateMotoristaDto.cpf && updateMotoristaDto.cpf !== motorista.cpf) {
      const existenteByCpf = await this.motoristaRepository.findOne({
        where: { cpf: updateMotoristaDto.cpf }
      });

      if (existenteByCpf && existenteByCpf.id !== id) {
        throw new ConflictException('Já existe outro motorista cadastrado com este CPF');
      }
    }

    // Verifica se a matrícula já existe em outro motorista
    if (updateMotoristaDto.matricula && updateMotoristaDto.matricula !== motorista.matricula) {
      const existenteByMatricula = await this.motoristaRepository.findOne({
        where: { matricula: updateMotoristaDto.matricula }
      });

      if (existenteByMatricula && existenteByMatricula.id !== id) {
        throw new ConflictException('Já existe outro motorista cadastrado com esta matrícula');
      }
    }

    Object.assign(motorista, updateMotoristaDto);
    return await this.motoristaRepository.save(motorista);
  }

  async remove(id: string): Promise<void> {
    const motorista = await this.findOne(id);
    await this.motoristaRepository.remove(motorista);
  }
}
