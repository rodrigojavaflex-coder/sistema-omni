import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Meta } from './entities/meta.entity';
import { MetaExecucao } from './entities/meta-execucao.entity';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { PolaridadeMeta } from './enums/polaridade-meta.enum';
import { UnidadeMeta } from './enums/unidade-meta.enum';
import { IndicadorMeta } from './enums/indicador-meta.enum';

export interface MetaDashboardItem {
  id: string;
  tituloDaMeta: string;
  departamentoId: string;
  departamentoNome: string;
  inicioDaMeta: string | null;
  prazoFinal: string | null;
  valorMeta: number | null;
  polaridade: PolaridadeMeta;
  unidade: UnidadeMeta;
  indicador: IndicadorMeta;
  totalExecutado: number;
  totalExecucoes: number;
  totalMesesIntervalo: number;
  mediaExecucaoMesAtivo: number;
  statusAtualMeta: number;
  progressoPercentual: number;
  ultimaExecucaoEm: string | null;
}

type DashboardQueryRow = {
  id: string;
  tituloDaMeta: string;
  departamentoId: string;
  departamentoNome: string;
  inicioDaMeta: string | null;
  prazoFinal: string | null;
  valorPlanejado: string | null;
  polaridade: string | null;
  unidade: string | null;
  indicador: string | null;
  totalExecutado: string | null;
  totalExecucoes: string | null;
  ultimaExecucaoEm: string | null;
};

type MetaUpdateFields = {
  tituloDaMeta?: string;
  descricaoDetalhada?: string;
  polaridade?: PolaridadeMeta;
  prazoFinal?: string;
  valorMeta?: number;
  unidade?: UnidadeMeta;
  indicador?: IndicadorMeta;
  inicioDaMeta?: string;
};

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
    @InjectRepository(MetaExecucao)
    private readonly metaExecucaoRepository: Repository<MetaExecucao>,
    @InjectRepository(DepartamentoUsuario)
    private readonly departamentoUsuarioRepository: Repository<DepartamentoUsuario>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  private async assertAccess(userId: string, departamentoId: string) {
    const acesso = await this.departamentoUsuarioRepository.findOne({
      where: { usuarioId: userId, departamentoId },
    });
    if (!acesso) {
      throw new ForbiddenException(
        'Usuário não tem acesso a este departamento',
      );
    }
  }

  async create(userId: string, dto: CreateMetaDto): Promise<Meta> {
    await this.assertAccess(userId, dto.departamentoId);
    const meta = this.metaRepository.create(dto);
    return this.metaRepository.save(meta);
  }

  async findAll(userId: string): Promise<Meta[]> {
    const deps = await this.departamentoUsuarioRepository.find({
      where: { usuarioId: userId },
      select: ['departamentoId'],
    });
    const ids = deps.map((d) => d.departamentoId);
    if (ids.length === 0) return [];
    return this.metaRepository.find({
      where: { departamentoId: In(ids) },
      order: { prazoFinal: 'ASC', tituloDaMeta: 'ASC' },
    });
  }

  async getDashboard(userId: string): Promise<MetaDashboardItem[]> {
    const deps = await this.departamentoUsuarioRepository.find({
      where: { usuarioId: userId },
      select: ['departamentoId'],
    });
    const ids = deps.map((d) => d.departamentoId);
    if (!ids.length) return [];

    const rows = await this.metaRepository
      .createQueryBuilder('meta')
      .leftJoin('meta.departamento', 'departamento')
      .leftJoin('meta.execucoes', 'execucao')
      .where('meta.departamentoId IN (:...ids)', { ids })
      .select('meta.id', 'id')
      .addSelect('meta.tituloDaMeta', 'tituloDaMeta')
      .addSelect('meta.departamentoId', 'departamentoId')
      .addSelect('departamento.nomeDepartamento', 'departamentoNome')
      .addSelect('meta.inicioDaMeta', 'inicioDaMeta')
      .addSelect('meta.prazoFinal', 'prazoFinal')
      .addSelect('meta.valorMeta', 'valorPlanejado')
      .addSelect('meta.polaridade', 'polaridade')
      .addSelect('meta.unidade', 'unidade')
      .addSelect('meta.indicador', 'indicador')
      .addSelect('COALESCE(SUM(execucao.valorRealizado), 0)', 'totalExecutado')
      .addSelect('COUNT(execucao.id)', 'totalExecucoes')
      .addSelect('MAX(execucao.dataRealizado)', 'ultimaExecucaoEm')
      .groupBy('meta.id')
      .addGroupBy('meta.tituloDaMeta')
      .addGroupBy('meta.departamentoId')
      .addGroupBy('meta.inicioDaMeta')
      .addGroupBy('meta.prazoFinal')
      .addGroupBy('meta.valorMeta')
      .addGroupBy('meta.polaridade')
      .addGroupBy('meta.unidade')
      .addGroupBy('meta.indicador')
      .addGroupBy('departamento.nomeDepartamento')
      .orderBy('meta.prazoFinal', 'ASC', 'NULLS LAST')
      .addOrderBy('meta.tituloDaMeta', 'ASC')
      .getRawMany<DashboardQueryRow>();

    const monthlyMap = await this.loadMonthlyExecutions(
      rows.map((row) => row.id),
    );
    const lastExecutionMap = await this.loadLastExecution(
      rows.map((row) => row.id),
    );

    return rows.map((row) => {
      const valorPlanejado =
        row.valorPlanejado !== null && row.valorPlanejado !== undefined
          ? Number(row.valorPlanejado)
          : null;
      const totalExecutado = Number(row.totalExecutado ?? 0);
      const totalExecucoesNum = Number(row.totalExecucoes ?? 0);
      const indicador =
        (row.indicador as IndicadorMeta) ?? IndicadorMeta.RESULTADO_ACUMULADO;
      const polaridade =
        (row.polaridade as PolaridadeMeta) ?? PolaridadeMeta.MAIOR_MELHOR;
      const unidade = (row.unidade as UnidadeMeta) ?? UnidadeMeta.PORCENTAGEM;
      const mesesIntervalo = this.countMonthsInInterval(
        row.inicioDaMeta,
        row.prazoFinal,
      );
      const monthlyInfo = monthlyMap.get(row.id) ?? { sum: 0, months: 0 };
      const mediaExecucaoMesAtivo =
        monthlyInfo.months > 0 ? monthlyInfo.sum / monthlyInfo.months : 0;
      const mesesSemExecucao = Math.max(mesesIntervalo - monthlyInfo.months, 0);
      
      let statusAtualMeta: number;
      
      // Tratamento específico para PROGRESSO
      if (indicador === IndicadorMeta.PROGRESSO) {
        // Para progresso, usa o último lançamento
        statusAtualMeta = lastExecutionMap.get(row.id) ?? 0;
      } else if (indicador === IndicadorMeta.POR_MEDIA && mesesIntervalo > 0) {
        // Mantém lógica original do POR_MEDIA
        statusAtualMeta = totalExecutado / mesesIntervalo;
      } else {
        // Mantém lógica original do RESULTADO_ACUMULADO
        statusAtualMeta = totalExecutado;
      }

      // Esta parte só afeta POR_MEDIA (mantém lógica original)
      if (
        indicador === IndicadorMeta.POR_MEDIA &&
        mesesIntervalo > 0 &&
        polaridade === PolaridadeMeta.MENOR_MELHOR &&
        valorPlanejado !== null
      ) {
        const totalProjetado =
          totalExecutado + mesesSemExecucao * valorPlanejado;
        statusAtualMeta = totalProjetado / mesesIntervalo;
      }
      
      // Determina a referência para cálculo do progresso
      let referencia: number;
      if (indicador === IndicadorMeta.PROGRESSO) {
        // Para progresso, compara último lançamento com meta
        referencia = statusAtualMeta; // que já é o último lançamento
      } else if (indicador === IndicadorMeta.POR_MEDIA) {
        // Mantém lógica original do POR_MEDIA
        referencia = statusAtualMeta;
      } else {
        // Mantém lógica original do RESULTADO_ACUMULADO
        referencia = totalExecutado;
      }
      
      // Cálculo do progresso percentual
      const progressoPercentual =
        totalExecucoesNum === 0
          ? 0
          : this.calculateProgressPercentual(
              valorPlanejado,
              referencia,
              polaridade,
            );

      return {
        id: row.id,
        tituloDaMeta: row.tituloDaMeta,
        departamentoId: row.departamentoId,
        departamentoNome: row.departamentoNome,
        inicioDaMeta: row.inicioDaMeta,
        prazoFinal: row.prazoFinal,
        valorMeta: valorPlanejado,
        polaridade,
        unidade,
        indicador,
        totalExecutado,
        totalExecucoes: totalExecucoesNum,
        totalMesesIntervalo: mesesIntervalo,
        mediaExecucaoMesAtivo,
        statusAtualMeta,
        progressoPercentual,
        ultimaExecucaoEm: row.ultimaExecucaoEm,
      };
    });
  }

  async findOne(userId: string, id: string): Promise<Meta> {
    const meta = await this.metaRepository.findOne({ where: { id } });
    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }
    await this.assertAccess(userId, meta.departamentoId);
    return meta;
  }

  async update(userId: string, id: string, dto: UpdateMetaDto): Promise<Meta> {
    const meta = await this.findOne(userId, id);
    if (dto.departamentoId) {
      await this.assertAccess(userId, dto.departamentoId);
      meta.departamentoId = dto.departamentoId;
      const dep = await this.departamentoRepository.findOne({
        where: { id: dto.departamentoId },
      });
      meta.departamento = dep || meta.departamento;
    }
    const {
      tituloDaMeta,
      descricaoDetalhada,
      polaridade: dtoPolaridade,
      prazoFinal,
      valorMeta,
      unidade,
      indicador,
      inicioDaMeta,
    } = dto as MetaUpdateFields;

    if (tituloDaMeta !== undefined && tituloDaMeta !== null) {
      meta.tituloDaMeta = tituloDaMeta;
    }
    if (descricaoDetalhada !== undefined && descricaoDetalhada !== null) {
      meta.descricaoDetalhada = descricaoDetalhada;
    }
    if (dtoPolaridade !== undefined && dtoPolaridade !== null) {
      meta.polaridade = dtoPolaridade;
    }
    if (prazoFinal !== undefined && prazoFinal !== null) {
      meta.prazoFinal = prazoFinal;
    }
    if (valorMeta !== undefined && valorMeta !== null) {
      meta.valorMeta = valorMeta;
    }
    if (unidade !== undefined && unidade !== null) {
      meta.unidade = unidade;
    }
    if (indicador !== undefined && indicador !== null) {
      meta.indicador = indicador;
    }
    if (inicioDaMeta !== undefined && inicioDaMeta !== null) {
      meta.inicioDaMeta = inicioDaMeta;
    }
    return this.metaRepository.save(meta);
  }

  async remove(userId: string, id: string): Promise<void> {
    const meta = await this.findOne(userId, id);
    await this.metaRepository.remove(meta);
  }

  private async loadMonthlyExecutions(
    metaIds: string[],
  ): Promise<Map<string, { sum: number; months: number }>> {
    const result = new Map<string, { sum: number; months: number }>();
    if (!metaIds.length) {
      return result;
    }

    const execucoes = await this.metaExecucaoRepository.find({
      where: { metaId: In(metaIds) },
      select: ['metaId', 'dataRealizado', 'valorRealizado'],
    });

    const accumulator = new Map<
      string,
      { sum: number; monthsSet: Set<string> }
    >();

    for (const execucao of execucoes) {
      if (!execucao.metaId || !execucao.dataRealizado) continue;

      const date = new Date(`${execucao.dataRealizado}T00:00:00`);
      if (Number.isNaN(date.getTime())) continue;

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`;
      const entry = accumulator.get(execucao.metaId) ?? {
        sum: 0,
        monthsSet: new Set<string>(),
      };

      entry.sum += Number(execucao.valorRealizado ?? 0);
      entry.monthsSet.add(monthKey);
      accumulator.set(execucao.metaId, entry);
    }

    accumulator.forEach((value, metaId) => {
      result.set(metaId, {
        sum: value.sum,
        months: value.monthsSet.size,
      });
    });

    return result;
  }

  private async loadLastExecution(
    metaIds: string[],
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>();
    if (!metaIds.length) {
      return result;
    }

    // Busca todas as execuções para as metas ordenando por dataRealizado desc e criadoEm desc
    const execucoes = await this.metaExecucaoRepository.find({
      where: { metaId: In(metaIds) },
      select: ['metaId', 'dataRealizado', 'valorRealizado'],
      order: { dataRealizado: 'DESC', criadoEm: 'DESC' },
    });

    // Processa para pegar apenas a última execução de cada meta
    const processed = new Set<string>();
    for (const execucao of execucoes) {
      if (
        execucao.metaId &&
        !processed.has(execucao.metaId) &&
        execucao.valorRealizado !== null
      ) {
        result.set(execucao.metaId, Number(execucao.valorRealizado));
        processed.add(execucao.metaId);
      }
    }

    return result;
  }

  private countMonthsInInterval(
    inicioDaMeta?: string | null,
    prazoFinal?: string | null,
  ): number {
    if (!inicioDaMeta) return 1;

    const parseDate = (
      date: string | Date,
    ): { year: number; month: number } | null => {
      if (!date) return null;

      if (date instanceof Date) {
        if (Number.isNaN(date.getTime())) return null;
        return {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        };
      }

      const normalized = date.split('T')[0];
      const [yearStr, monthStr] = normalized.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);
      if (
        Number.isNaN(year) ||
        Number.isNaN(month) ||
        month < 1 ||
        month > 12
      ) {
        return null;
      }
      return { year, month };
    };

    const inicio = parseDate(inicioDaMeta);
    if (!inicio) return 1;

    const prazoRef = prazoFinal ?? new Date().toISOString().split('T')[0];
    const fim = parseDate(prazoRef);
    if (!fim) return 1;

    const totalMeses =
      (fim.year - inicio.year) * 12 + (fim.month - inicio.month) + 1;
    return Math.max(totalMeses, 1);
  }

  private calculateProgressPercentual(
    valorMeta: number | null,
    valorRealizado: number,
    polaridade: PolaridadeMeta,
  ): number {
    if (!valorMeta || valorMeta <= 0) {
      if (polaridade === PolaridadeMeta.MENOR_MELHOR) {
        return valorRealizado <= 0 ? 100 : 0;
      }
      return valorRealizado > 0 ? 100 : 0;
    }

    if (polaridade === PolaridadeMeta.MENOR_MELHOR) {
      if (valorRealizado <= 0) return 100;
      const ratio = valorMeta / valorRealizado;
      return Math.max(0, Math.min(100, Math.round(ratio * 100)));
    }

    return Math.min(100, Math.round((valorRealizado / valorMeta) * 100));
  }
}
