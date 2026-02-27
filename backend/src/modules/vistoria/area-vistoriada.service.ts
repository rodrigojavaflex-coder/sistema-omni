import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { AreaModelo } from './entities/area-modelo.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { CreateAreaVistoriadaDto } from './dto/create-area-vistoriada.dto';
import { UpdateAreaVistoriadaDto } from './dto/update-area-vistoriada.dto';
import { ModeloVeiculo } from '../veiculo/entities/modelo-veiculo.entity';

@Injectable()
export class AreaVistoriadaService {
  constructor(
    @InjectRepository(AreaVistoriada)
    private readonly areaRepository: Repository<AreaVistoriada>,
    @InjectRepository(AreaModelo)
    private readonly areaModeloRepository: Repository<AreaModelo>,
    @InjectRepository(AreaComponente)
    private readonly areaComponenteRepository: Repository<AreaComponente>,
    @InjectRepository(ModeloVeiculo)
    private readonly modeloRepository: Repository<ModeloVeiculo>,
  ) {}

  async create(dto: CreateAreaVistoriadaDto): Promise<AreaVistoriada> {
    return this.areaRepository.manager.transaction(async (manager) => {
      const area = manager.getRepository(AreaVistoriada).create({
        nome: dto.nome,
        ordemVisual: dto.ordem_visual ?? 0,
        ativo: dto.ativo ?? true,
      });
      const saved = await manager.getRepository(AreaVistoriada).save(area);

      if (dto.modelos?.length) {
        await this.ensureModelos(dto.modelos);
        const modelos = dto.modelos.map((idModelo) =>
          manager.getRepository(AreaModelo).create({
            idArea: saved.id,
            idModelo,
          }),
        );
        await manager.getRepository(AreaModelo).save(modelos);
      }

      return saved;
    });
  }

  async findAll(idmodelo?: string, ativo?: boolean): Promise<AreaVistoriada[]> {
    const modeloFiltro = idmodelo?.trim();
    if (!modeloFiltro) {
      const where: Record<string, unknown> = {};
      if (ativo !== undefined) {
        where.ativo = ativo;
      }
      return this.areaRepository.find({
        where,
        order: { ordemVisual: 'ASC' },
        relations: ['modelos'],
      });
    }

    let query = this.areaRepository
      .createQueryBuilder('area')
      .leftJoinAndSelect('area.modelos', 'modelos')
      .innerJoin('areas_modelos', 'am', 'am.idarea = area.id')
      .where('am.idmodelo = :idModelo', { idModelo: modeloFiltro })
      .orderBy('area.ordemVisual', 'ASC');

    if (ativo !== undefined) {
      query = query.andWhere('area.ativo = :ativo', { ativo });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<AreaVistoriada> {
    const area = await this.areaRepository.findOne({
      where: { id },
      relations: ['modelos'],
    });
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }
    return area;
  }

  async update(id: string, dto: UpdateAreaVistoriadaDto): Promise<AreaVistoriada> {
    return this.areaRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(AreaVistoriada);
      const area = await repo.findOne({ where: { id } });
      if (!area) {
        throw new NotFoundException('Área não encontrada');
      }

      const updated = repo.merge(area, {
        nome: dto.nome ?? area.nome,
        ordemVisual: dto.ordem_visual ?? area.ordemVisual,
        ativo: dto.ativo ?? area.ativo,
      });
      const saved = await repo.save(updated);

      if (dto.modelos) {
        await manager.getRepository(AreaModelo).delete({ idArea: saved.id });
        if (dto.modelos.length > 0) {
          await this.ensureModelos(dto.modelos);
          const modelos = dto.modelos.map((idModelo) =>
            manager.getRepository(AreaModelo).create({
              idArea: saved.id,
              idModelo,
            }),
          );
          await manager.getRepository(AreaModelo).save(modelos);
        }
      }

      return saved;
    });
  }

  async remove(id: string): Promise<void> {
    const area = await this.findOne(id);
    const [countComponentes, countModelos] = await Promise.all([
      this.areaComponenteRepository.count({ where: { idArea: id } }),
      this.areaModeloRepository.count({ where: { idArea: id } }),
    ]);
    if (countComponentes > 0) {
      throw new BadRequestException(
        'Não é possível excluir a área pois existem componentes vinculados. Remova os componentes da área antes de excluir.',
      );
    }
    if (countModelos > 0) {
      throw new BadRequestException(
        'Não é possível excluir a área pois existem modelos vinculados. Remova os modelos da área antes de excluir.',
      );
    }
    await this.areaRepository.remove(area);
  }

  private async ensureModelos(ids: string[]): Promise<void> {
    const modelos = await this.modeloRepository.find({ where: { id: In(ids) } });
    if (modelos.length !== ids.length) {
      throw new NotFoundException('Um ou mais modelos de veículo não encontrados');
    }
  }
}
