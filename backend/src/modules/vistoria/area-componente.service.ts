import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { AreaComponente } from './entities/area-componente.entity';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { Componente } from './entities/componente.entity';
import { SetAreaComponentesDto } from './dto/set-area-componentes.dto';

@Injectable()
export class AreaComponenteService {
  constructor(
    @InjectRepository(AreaComponente)
    private readonly areaComponenteRepository: Repository<AreaComponente>,
    @InjectRepository(AreaVistoriada)
    private readonly areaRepository: Repository<AreaVistoriada>,
    @InjectRepository(Componente)
    private readonly componenteRepository: Repository<Componente>,
  ) {}

  async listByArea(areaId: string): Promise<AreaComponente[]> {
    await this.ensureArea(areaId);
    return this.areaComponenteRepository.find({
      where: { idArea: areaId },
      relations: ['componente'],
      order: { ordemVisual: 'ASC' },
    });
  }

  async setByArea(areaId: string, dto: SetAreaComponentesDto): Promise<void> {
    await this.ensureArea(areaId);
    if (dto.componentes.length === 0) {
      await this.areaComponenteRepository.delete({ idArea: areaId });
      return;
    }

    const ids = dto.componentes.map((item) => item.idcomponente);
    const componentes = await this.componenteRepository.findBy({ id: In(ids) });
    if (componentes.length !== ids.length) {
      throw new NotFoundException('Um ou mais componentes não encontrados');
    }

    await this.areaComponenteRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(AreaComponente);
      for (const item of dto.componentes) {
        await repo.delete({ idComponente: item.idcomponente, idArea: Not(areaId) });
      }
      await repo.delete({ idArea: areaId });

      const itens = dto.componentes.map((item) =>
        repo.create({
          idArea: areaId,
          idComponente: item.idcomponente,
          ordemVisual: item.ordem_visual ?? 0,
        }),
      );
      await repo.save(itens);
    });
  }

  private async ensureArea(areaId: string): Promise<void> {
    const area = await this.areaRepository.findOne({ where: { id: areaId } });
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }
  }

  /**
   * Lista todos os componentes com a área em que estão vinculados (se houver).
   * Um componente aparece no máximo em uma área (regra de negócio).
   */
  async listComponentesWithArea(): Promise<
    Array<{
      id: string;
      nome: string;
      ativo: boolean;
      idArea: string | null;
      nomeArea: string | null;
    }>
  > {
    const rows = await this.areaComponenteRepository
      .createQueryBuilder('ac')
      .select([
        'c.id AS id',
        'c.nome AS nome',
        'c.ativo AS ativo',
        'a.id AS "idArea"',
        'a.nome AS "nomeArea"',
      ])
      .innerJoin('ac.componente', 'c')
      .leftJoin('ac.area', 'a')
      .orderBy('c.nome', 'ASC')
      .getRawMany();

    const withArea = rows.map((r: any) => ({
      id: r.id,
      nome: r.nome,
      ativo: r.ativo,
      idArea: r.idArea ?? null,
      nomeArea: r.nomeArea ?? null,
    }));

    const linkedIds = new Set(withArea.map((r) => r.id));
    const allComponentes = await this.componenteRepository.find({
      order: { nome: 'ASC' },
    });
    const semArea = allComponentes
      .filter((c) => !linkedIds.has(c.id))
      .map((c) => ({
        id: c.id,
        nome: c.nome,
        ativo: c.ativo,
        idArea: null as string | null,
        nomeArea: null as string | null,
      }));

    const combined = [...withArea, ...semArea].sort((a, b) =>
      a.nome.localeCompare(b.nome),
    );
    return combined;
  }
}
