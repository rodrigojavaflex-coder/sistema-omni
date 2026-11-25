import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndicadorExecucao } from './entities/indicador-execucao.entity';
import { Indicador } from './entities/indicador.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { CreateIndicadorExecucaoDto } from './dto/create-indicador-execucao.dto';
import { UpdateIndicadorExecucaoDto } from './dto/update-indicador-execucao.dto';

@Injectable()
export class IndicadorExecucaoService {
  constructor(
    @InjectRepository(IndicadorExecucao)
    private readonly execucaoRepository: Repository<IndicadorExecucao>,
    @InjectRepository(Indicador)
    private readonly indicadorRepository: Repository<Indicador>,
    @InjectRepository(DepartamentoUsuario)
    private readonly departamentoUsuarioRepository: Repository<DepartamentoUsuario>,
  ) {}

  private normalizeDateString(dateStr: string): string {
    const dateOnly = dateStr.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  }

  /** Padroniza para o 1º dia do mês (RN-IND-005). */
  private toFirstDayOfMonth(dateStr: string): string {
    const normalized = this.normalizeDateString(dateStr);
    const [year, month] = normalized.split('-');
    if (!year || !month) {
      throw new BadRequestException('dataReferencia inválida');
    }
    return `${year}-${month}-01`;
  }

  private async ensureIndicadorAccess(
    userId: string,
    indicadorId: string,
  ): Promise<Indicador> {
    const indicador = await this.indicadorRepository.findOne({
      where: { id: indicadorId },
    });
    if (!indicador) {
      throw new NotFoundException('Indicador não encontrado');
    }
    const acesso = await this.departamentoUsuarioRepository.findOne({
      where: {
        usuarioId: userId,
        departamentoId: indicador.departamentoId,
      },
    });
    if (!acesso) {
      throw new ForbiddenException('Usuário não tem acesso a este indicador');
    }
    return indicador;
  }

  private async findExecucao(
    indicadorId: string,
    execucaoId: string,
  ): Promise<IndicadorExecucao> {
    const execucao = await this.execucaoRepository.findOne({
      where: { id: execucaoId },
    });
    if (!execucao || execucao.indicadorId !== indicadorId) {
      throw new NotFoundException(
        'Execução não encontrada para este indicador',
      );
    }
    return execucao;
  }

  async findAll(
    userId: string,
    indicadorId: string,
  ): Promise<IndicadorExecucao[]> {
    await this.ensureIndicadorAccess(userId, indicadorId);

    const raw = await this.execucaoRepository.query(
      `SELECT
        id,
        "indicadorId",
        TO_CHAR("dataReferencia", 'YYYY-MM-DD') as "dataReferencia",
        valor,
        justificativa,
        "criadoEm",
        "atualizadoEm"
       FROM indicador_execucoes
       WHERE "indicadorId" = $1
       ORDER BY "dataReferencia" DESC, "criadoEm" DESC`,
      [indicadorId],
    );

    return (raw as IndicadorExecucao[]).map((row) => ({
      ...row,
      valor: Number(row.valor),
    }));
  }

  async create(
    userId: string,
    indicadorId: string,
    dto: CreateIndicadorExecucaoDto,
  ): Promise<IndicadorExecucao> {
    const indicador = await this.ensureIndicadorAccess(userId, indicadorId);
    if (!indicador.ativo) {
      throw new BadRequestException(
        'Não é possível lançar em indicador inativo',
      );
    }

    const dataReferencia = this.toFirstDayOfMonth(dto.dataReferencia);

    const existente = await this.execucaoRepository.query(
      `SELECT id FROM indicador_execucoes
       WHERE "indicadorId" = $1 AND "dataReferencia" = $2::date
       LIMIT 1`,
      [indicadorId, dataReferencia],
    );
    if (existente?.length) {
      throw new ConflictException(
        'Já existe lançamento para este indicador neste período',
      );
    }

    await this.execucaoRepository.query(
      `INSERT INTO indicador_execucoes
        ("indicadorId", "dataReferencia", valor, justificativa, id, "criadoEm", "atualizadoEm")
       VALUES ($1, $2::date, $3, $4, gen_random_uuid(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [indicadorId, dataReferencia, dto.valor, dto.justificativa || null],
    );

    const result = await this.execucaoRepository.query(
      `SELECT
        id,
        "indicadorId",
        TO_CHAR("dataReferencia", 'YYYY-MM-DD') as "dataReferencia",
        valor,
        justificativa,
        "criadoEm",
        "atualizadoEm"
       FROM indicador_execucoes
       WHERE "indicadorId" = $1 AND "dataReferencia" = $2::date
       ORDER BY "criadoEm" DESC
       LIMIT 1`,
      [indicadorId, dataReferencia],
    );

    if (!result?.length) {
      throw new Error('Erro ao criar execução do indicador');
    }

    return {
      ...result[0],
      valor: Number(result[0].valor),
    } as IndicadorExecucao;
  }

  async update(
    userId: string,
    indicadorId: string,
    execucaoId: string,
    dto: UpdateIndicadorExecucaoDto,
  ): Promise<IndicadorExecucao> {
    await this.ensureIndicadorAccess(userId, indicadorId);
    const execucao = await this.findExecucao(indicadorId, execucaoId);

    const dataReferencia = dto.dataReferencia
      ? this.toFirstDayOfMonth(dto.dataReferencia)
      : this.normalizeDateString(String(execucao.dataReferencia));

    if (dto.dataReferencia) {
      const conflito = await this.execucaoRepository.query(
        `SELECT id FROM indicador_execucoes
         WHERE "indicadorId" = $1 AND "dataReferencia" = $2::date AND id <> $3
         LIMIT 1`,
        [indicadorId, dataReferencia, execucaoId],
      );
      if (conflito?.length) {
        throw new ConflictException(
          'Já existe lançamento para este indicador neste período',
        );
      }
    }

    const updates: string[] = [];
    const params: Array<string | number | null> = [];
    let paramIndex = 1;

    if (dto.dataReferencia !== undefined) {
      updates.push(`"dataReferencia" = $${paramIndex}::date`);
      params.push(dataReferencia);
      paramIndex++;
    }
    if (dto.valor !== undefined) {
      updates.push(`valor = $${paramIndex}`);
      params.push(dto.valor);
      paramIndex++;
    }
    if (dto.justificativa !== undefined) {
      updates.push(`justificativa = $${paramIndex}`);
      params.push(dto.justificativa || null);
      paramIndex++;
    }

    if (!updates.length) {
      return execucao;
    }

    updates.push(`"atualizadoEm" = CURRENT_TIMESTAMP`);
    params.push(execucaoId);

    await this.execucaoRepository.query(
      `UPDATE indicador_execucoes
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}`,
      params,
    );

    const updated = await this.execucaoRepository.query(
      `SELECT
        id,
        "indicadorId",
        TO_CHAR("dataReferencia", 'YYYY-MM-DD') as "dataReferencia",
        valor,
        justificativa,
        "criadoEm",
        "atualizadoEm"
       FROM indicador_execucoes
       WHERE id = $1`,
      [execucaoId],
    );

    if (!updated?.length) {
      throw new Error('Erro ao atualizar execução do indicador');
    }

    return {
      ...updated[0],
      valor: Number(updated[0].valor),
    } as IndicadorExecucao;
  }

  async remove(
    userId: string,
    indicadorId: string,
    execucaoId: string,
  ): Promise<void> {
    await this.ensureIndicadorAccess(userId, indicadorId);
    const execucao = await this.findExecucao(indicadorId, execucaoId);
    await this.execucaoRepository.remove(execucao);
  }
}
