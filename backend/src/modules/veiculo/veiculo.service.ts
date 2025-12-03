import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
import { FindVeiculoDto } from './dto/find-veiculo.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../../common/dto/paginated-response.dto';

@Injectable()
export class VeiculoService {
  private readonly logger = new Logger(VeiculoService.name);

  constructor(
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
  ) {}

  async create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo> {
    // Verificar unicidade de descrição e placa em uma query
    await this.validateUnique(
      createVeiculoDto.descricao,
      createVeiculoDto.placa,
    );

    const veiculo = this.veiculoRepository.create(
      createVeiculoDto as unknown as Veiculo,
    );
    return this.veiculoRepository.save(veiculo);
  }

  private async validateUnique(
    descricao: string,
    placa: string,
    excludeId?: string,
  ): Promise<void> {
    const query = this.veiculoRepository
      .createQueryBuilder('v')
      .where('v.descricao = :descricao OR v.placa = :placa', {
        descricao,
        placa,
      });

    if (excludeId) {
      query.andWhere('v.id != :excludeId', { excludeId });
    }

    const existing = await query.getMany();

    for (const veiculo of existing) {
      if (veiculo.descricao === descricao) {
        throw new ConflictException(
          `Já existe um veículo com a descrição: "${descricao}"`,
        );
      }
      if (veiculo.placa === placa) {
        throw new ConflictException(
          `Já existe um veículo com a placa: ${placa}`,
        );
      }
    }
  }

  async findAll(
    findVeiculoDto: FindVeiculoDto,
  ): Promise<PaginatedResponseDto<Veiculo>> {
    const {
      page = 1,
      limit = 10,
      descricao,
      placa,
      ano,
      marca,
      modelo,
      combustivel,
      status,
      marcaDaCarroceria,
      modeloDaCarroceria,
    } = findVeiculoDto as any;

    this.logger.debug('🔍 VEICULO FINDALL - Filtros recebidos:', {
      page,
      limit,
      descricao,
      placa,
      ano,
      marca,
      modelo,
      combustivel,
      status,
      marcaDaCarroceria,
      modeloDaCarroceria,
    });

    const query = this.veiculoRepository.createQueryBuilder('v');

    if (descricao) {
      query.andWhere('v.descricao ILIKE :descricao', {
        descricao: `%${descricao}%`,
      });
    }

    if (placa) {
      query.andWhere('v.placa ILIKE :placa', { placa: `%${placa}%` });
    }

    if (ano) {
      query.andWhere('v.ano = :ano', { ano });
    }

    if (marca) {
      query.andWhere('v.marca ILIKE :marca', { marca: `%${marca}%` });
    }

    if (modelo) {
      query.andWhere('v.modelo ILIKE :modelo', { modelo: `%${modelo}%` });
    }

    if (combustivel) {
      query.andWhere('v.combustivel = :combustivel', { combustivel });
    }

    if (status) {
      this.logger.debug('✅ Aplicando filtro de STATUS:', status);
      query.andWhere('v.status = :status', { status });
    }

    if (marcaDaCarroceria) {
      this.logger.debug(
        '✅ Aplicando filtro de MARCA CARROCERIA:',
        marcaDaCarroceria,
      );
      query.andWhere('v.marcaDaCarroceria ILIKE :marcaDaCarroceria', {
        marcaDaCarroceria: `%${marcaDaCarroceria}%`,
      });
    }

    if (modeloDaCarroceria) {
      this.logger.debug(
        '✅ Aplicando filtro de MODELO CARROCERIA:',
        modeloDaCarroceria,
      );
      query.andWhere('v.modeloDaCarroceria ILIKE :modeloDaCarroceria', {
        modeloDaCarroceria: `%${modeloDaCarroceria}%`,
      });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('v.atualizadoEm', 'DESC')
      .getManyAndCount();

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(items, meta);
  }

  async findOne(id: string): Promise<Veiculo> {
    const entity = await this.veiculoRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Veículo com ID ${id} não encontrado`);
    }
    return entity;
  }

  async update(
    id: string,
    updateVeiculoDto: UpdateVeiculoDto,
  ): Promise<Veiculo> {
    const entity = await this.findOne(id);

    // Verificar unicidade apenas para campos que estão sendo alterados
    if (updateVeiculoDto.descricao || updateVeiculoDto.placa) {
      const descricaoToCheck = updateVeiculoDto.descricao || entity.descricao;
      const placaToCheck = updateVeiculoDto.placa || entity.placa;

      // Só validar se algum dos campos foi realmente alterado
      if (
        updateVeiculoDto.descricao !== entity.descricao ||
        updateVeiculoDto.placa !== entity.placa
      ) {
        await this.validateUnique(descricaoToCheck, placaToCheck, id);
      }
    }

    Object.assign(entity, updateVeiculoDto as any);

    return this.veiculoRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.veiculoRepository.remove(entity);
  }
}
