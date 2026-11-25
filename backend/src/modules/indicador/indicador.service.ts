import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Indicador } from './entities/indicador.entity';
import { IndicadorExecucao } from './entities/indicador-execucao.entity';
import { CreateIndicadorDto } from './dto/create-indicador.dto';
import { UpdateIndicadorDto } from './dto/update-indicador.dto';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { Departamento } from '../departamento/entities/departamento.entity';

export interface IndicadorDashboardItem {
  id: string;
  codigoIndicador: number;
  nomeIndicador: string;
  departamentoId: string;
  departamentoNome: string;
  unidadeMedida: string;
  tipoIndicador: string;
  ativo: boolean;
  ordemExibicao: number | null;
  ultimoValor: number | null;
  ultimoPeriodo: string | null;
  totalMesesAno: number;
  somaAno: number;
  mediaAno: number;
  totalExecucoes: number;
}

@Injectable()
export class IndicadorService {
  constructor(
    @InjectRepository(Indicador)
    private readonly indicadorRepository: Repository<Indicador>,
    @InjectRepository(IndicadorExecucao)
    private readonly execucaoRepository: Repository<IndicadorExecucao>,
    @InjectRepository(DepartamentoUsuario)
    private readonly departamentoUsuarioRepository: Repository<DepartamentoUsuario>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
  ) {}

  private normalizeText(value?: string | null): string | null {
    if (value == null) return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }

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

  private async nextCodigoIndicador(): Promise<number> {
    const rows: Array<{ nextval: string | number }> =
      await this.indicadorRepository.query(
        `SELECT nextval('indicadores_codigo_seq') AS nextval`,
      );
    return Number(rows[0]?.nextval);
  }

  async create(userId: string, dto: CreateIndicadorDto): Promise<Indicador> {
    await this.assertAccess(userId, dto.departamentoId);
    const codigoIndicador = await this.nextCodigoIndicador();
    const indicador = this.indicadorRepository.create({
      codigoIndicador,
      nomeIndicador: dto.nomeIndicador.trim(),
      departamentoId: dto.departamentoId,
      unidadeMedida: dto.unidadeMedida.trim(),
      tipoIndicador: dto.tipoIndicador.trim(),
      detalheIndicador: this.normalizeText(dto.detalheIndicador),
      ativo: dto.ativo ?? true,
      ordemExibicao: dto.ordemExibicao ?? null,
    });
    return this.indicadorRepository.save(indicador);
  }

  async findAll(userId: string): Promise<Indicador[]> {
    const deps = await this.departamentoUsuarioRepository.find({
      where: { usuarioId: userId },
      select: ['departamentoId'],
    });
    const ids = deps.map((d) => d.departamentoId);
    if (ids.length === 0) return [];
    return this.indicadorRepository.find({
      where: { departamentoId: In(ids) },
      order: { ordemExibicao: 'ASC', codigoIndicador: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Indicador> {
    const indicador = await this.indicadorRepository.findOne({ where: { id } });
    if (!indicador) {
      throw new NotFoundException('Indicador não encontrado');
    }
    await this.assertAccess(userId, indicador.departamentoId);
    return indicador;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateIndicadorDto,
  ): Promise<Indicador> {
    const indicador = await this.findOne(userId, id);
    if (dto.departamentoId) {
      await this.assertAccess(userId, dto.departamentoId);
      indicador.departamentoId = dto.departamentoId;
      const dep = await this.departamentoRepository.findOne({
        where: { id: dto.departamentoId },
      });
      indicador.departamento = dep || indicador.departamento;
    }
    indicador.nomeIndicador = dto.nomeIndicador.trim();
    indicador.unidadeMedida = dto.unidadeMedida.trim();
    indicador.tipoIndicador = dto.tipoIndicador.trim();
    indicador.detalheIndicador = this.normalizeText(dto.detalheIndicador);
    indicador.ativo = dto.ativo;
    indicador.ordemExibicao =
      dto.ordemExibicao === undefined ? indicador.ordemExibicao : dto.ordemExibicao;
    return this.indicadorRepository.save(indicador);
  }

  async remove(userId: string, id: string): Promise<void> {
    const indicador = await this.findOne(userId, id);
    const total = await this.execucaoRepository.count({
      where: { indicadorId: id },
    });
    if (total > 0) {
      throw new BadRequestException(
        'Indicador possui lançamentos e não pode ser excluído. Desative-o para retirá-lo do uso.',
      );
    }
    await this.indicadorRepository.remove(indicador);
  }

  async getDashboard(
    userId: string,
    ano?: number,
  ): Promise<IndicadorDashboardItem[]> {
    const indicadores = await this.findAll(userId);
    if (!indicadores.length) return [];

    const ids = indicadores.map((i) => i.id);
    const execucoes = await this.execucaoRepository.find({
      where: { indicadorId: In(ids) },
      order: { dataReferencia: 'DESC' },
    });

    const byIndicador = new Map<string, IndicadorExecucao[]>();
    for (const exec of execucoes) {
      const list = byIndicador.get(exec.indicadorId) ?? [];
      list.push(exec);
      byIndicador.set(exec.indicadorId, list);
    }

    const anoRef = ano ?? new Date().getFullYear();

    return indicadores
      .slice()
      .sort((a, b) => {
        const oa = a.ordemExibicao ?? Number.MAX_SAFE_INTEGER;
        const ob = b.ordemExibicao ?? Number.MAX_SAFE_INTEGER;
        if (oa !== ob) return oa - ob;
        return a.codigoIndicador - b.codigoIndicador;
      })
      .map((ind) => {
        const list = byIndicador.get(ind.id) ?? [];
        const doAno = list.filter((e) => {
          const y = String(e.dataReferencia).slice(0, 4);
          return y === String(anoRef);
        });
        const ultimo =
          (doAno.length ? doAno[0] : null) ?? (list[0] ?? null);
        const somaAno = doAno.reduce((acc, e) => acc + Number(e.valor ?? 0), 0);
        const meses = new Set(
          doAno.map((e) => String(e.dataReferencia).slice(0, 7)),
        );
        const totalMesesAno = meses.size;
        return {
          id: ind.id,
          codigoIndicador: ind.codigoIndicador,
          nomeIndicador: ind.nomeIndicador,
          departamentoId: ind.departamentoId,
          departamentoNome: ind.departamento?.nomeDepartamento ?? '',
          unidadeMedida: ind.unidadeMedida,
          tipoIndicador: ind.tipoIndicador,
          ativo: ind.ativo,
          ordemExibicao: ind.ordemExibicao ?? null,
          ultimoValor: ultimo ? Number(ultimo.valor) : null,
          ultimoPeriodo: ultimo ? String(ultimo.dataReferencia) : null,
          totalMesesAno,
          somaAno,
          mediaAno: totalMesesAno > 0 ? somaAno / totalMesesAno : 0,
          totalExecucoes: list.length,
        };
      });
  }
}
