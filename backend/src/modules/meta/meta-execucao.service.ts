import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaExecucao } from './entities/meta-execucao.entity';
import { Meta } from './entities/meta.entity';
import { DepartamentoUsuario } from '../departamento/entities/departamento-usuario.entity';
import { CreateMetaExecucaoDto } from './dto/create-meta-execucao.dto';
import { UpdateMetaExecucaoDto } from './dto/update-meta-execucao.dto';

@Injectable()
export class MetaExecucaoService {
  constructor(
    @InjectRepository(MetaExecucao)
    private readonly metaExecucaoRepository: Repository<MetaExecucao>,
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
    @InjectRepository(DepartamentoUsuario)
    private readonly departamentoUsuarioRepository: Repository<DepartamentoUsuario>,
  ) {}

  private async ensureMetaAccess(
    userId: string,
    metaId: string,
  ): Promise<Meta> {
    const meta = await this.metaRepository.findOne({ where: { id: metaId } });
    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    const acesso = await this.departamentoUsuarioRepository.findOne({
      where: { usuarioId: userId, departamentoId: meta.departamentoId },
    });

    if (!acesso) {
      throw new ForbiddenException('Usuário não tem acesso a esta meta');
    }

    return meta;
  }

  private async findExecucao(
    metaId: string,
    execucaoId: string,
  ): Promise<MetaExecucao> {
    const execucao = await this.metaExecucaoRepository.findOne({
      where: { id: execucaoId },
    });
    if (!execucao || execucao.metaId !== metaId) {
      throw new NotFoundException('Execução não encontrada para esta meta');
    }
    return execucao;
  }

  private normalizeDateString(dateStr: string): string {
    // Garante que a data está no formato YYYY-MM-DD (sem timezone)
    // Remove qualquer informação de timezone que possa estar presente
    const dateOnly = dateStr.split('T')[0].split(' ')[0];
    const parts = dateOnly.split('-');
    if (parts.length !== 3) return dateStr;
    
    // Valida e retorna no formato YYYY-MM-DD
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  private toLocalDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;
    // Usa a data normalizada para criar o objeto Date
    const normalized = this.normalizeDateString(dateStr);
    // Adiciona hora local para evitar problemas de timezone
    const date = new Date(`${normalized}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private formatDateString(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  }

  private assertDataDentroDoPeriodo(meta: Meta, data: string) {
    const dataExecucao = this.toLocalDate(data);
    if (!dataExecucao) {
      throw new BadRequestException(this.buildIntervalError(meta));
    }
    const inicio = this.toLocalDate(meta.inicioDaMeta);
    if (inicio && dataExecucao < inicio) {
      throw new BadRequestException(this.buildIntervalError(meta));
    }
    if (meta.prazoFinal) {
      const prazo = this.toLocalDate(meta.prazoFinal);
      if (prazo && dataExecucao > prazo) {
        throw new BadRequestException(this.buildIntervalError(meta));
      }
    }
  }

  private buildIntervalError(meta: Meta): string {
    const inicio = this.formatDateString(meta.inicioDaMeta);
    const prazo = meta.prazoFinal
      ? this.formatDateString(meta.prazoFinal)
      : 'sem prazo final definido';
    return `Data da execução deve estar entre o início da meta: ${inicio} e o prazo final: ${prazo}`;
  }

  async findAll(userId: string, metaId: string): Promise<MetaExecucao[]> {
    await this.ensureMetaAccess(userId, metaId);
    
    // Usa query raw para retornar a data como string (YYYY-MM-DD) sem conversão de timezone
    const execucoesRaw = await this.metaExecucaoRepository.query(
      `SELECT 
        id,
        "metaId",
        TO_CHAR("dataRealizado", 'YYYY-MM-DD') as "dataRealizado",
        "valorRealizado",
        "justificativa",
        "criadoEm",
        "atualizadoEm"
       FROM meta_execucoes 
       WHERE "metaId" = $1
       ORDER BY "dataRealizado" DESC, "criadoEm" DESC`,
      [metaId],
    );
    
    // Busca as execuções completas com TypeORM para ter as relações
    const execucoes = await this.metaExecucaoRepository.find({
      where: { metaId },
      order: { dataRealizado: 'DESC', criadoEm: 'DESC' },
    });
    
    // Mapeia as datas corretas das execuções raw para as execuções completas
    const execucoesMap = new Map<string, string>(
      execucoesRaw.map((e: any) => [e.id, e.dataRealizado]),
    );
    execucoes.forEach((execucao) => {
      const dataCorreta = execucoesMap.get(execucao.id);
      if (dataCorreta && typeof dataCorreta === 'string') {
        execucao.dataRealizado = dataCorreta;
      }
    });
    
    return execucoes;
  }

  async create(
    userId: string,
    metaId: string,
    dto: CreateMetaExecucaoDto,
  ): Promise<MetaExecucao> {
    const meta = await this.ensureMetaAccess(userId, metaId);
    this.assertDataDentroDoPeriodo(meta, dto.dataRealizado);
    
    // Normaliza a data para garantir que seja tratada como data local (sem timezone)
    const dataNormalizada = this.normalizeDateString(dto.dataRealizado);
    
    // Usa query SQL raw para inserir a data diretamente como DATE literal
    // Usa camelCase conforme definido na entidade (@JoinColumn({ name: 'metaId' }))
    const queryParams = [metaId, dataNormalizada, dto.valorRealizado, dto.justificativa || null];
    
    // Insere sem RETURNING para evitar conversão de timezone
    await this.metaExecucaoRepository.query(
      `INSERT INTO meta_execucoes ("metaId", "dataRealizado", "valorRealizado", "justificativa", "id", "criadoEm", "atualizadoEm")
       VALUES ($1, $2::date, $3, $4, gen_random_uuid(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      queryParams,
    );
    
    // Busca a execução criada usando query raw que retorna a data como texto (YYYY-MM-DD)
    const result = await this.metaExecucaoRepository.query(
      `SELECT 
        id,
        "metaId",
        TO_CHAR("dataRealizado", 'YYYY-MM-DD') as "dataRealizado",
        "valorRealizado",
        "justificativa",
        "criadoEm",
        "atualizadoEm"
       FROM meta_execucoes 
       WHERE "metaId" = $1 
         AND "dataRealizado" = $2::date 
         AND "valorRealizado" = $3
       ORDER BY "criadoEm" DESC 
       LIMIT 1`,
      [metaId, dataNormalizada, dto.valorRealizado],
    );
    
    if (!result || result.length === 0) {
      throw new Error('Erro ao criar execução da meta');
    }
    
    // Busca a execução criada com a relação meta usando o ID encontrado
    // Mas força a data a ser preservada como string usando query raw
    const execucaoRaw = await this.metaExecucaoRepository.query(
      `SELECT 
        e.*,
        TO_CHAR(e."dataRealizado", 'YYYY-MM-DD') as "dataRealizadoStr"
       FROM meta_execucoes e
       WHERE e.id = $1`,
      [result[0].id],
    );
    
    if (!execucaoRaw || execucaoRaw.length === 0) {
      throw new Error('Erro ao criar execução da meta');
    }
    
    // Busca a entidade completa com relação
    const execucao = await this.metaExecucaoRepository.findOne({
      where: { id: result[0].id },
      relations: ['meta'],
    });
    
    if (!execucao) {
      throw new Error('Erro ao criar execução da meta');
    }
    
    // Força a data a ser a string correta (YYYY-MM-DD) sem conversão de timezone
    execucao.dataRealizado = execucaoRaw[0].dataRealizadoStr || dataNormalizada;
    
    return execucao;
  }

  async update(
    userId: string,
    metaId: string,
    execucaoId: string,
    dto: UpdateMetaExecucaoDto,
  ): Promise<MetaExecucao> {
    const meta = await this.ensureMetaAccess(userId, metaId);
    const execucao = await this.findExecucao(metaId, execucaoId);
    if (dto.dataRealizado) {
      this.assertDataDentroDoPeriodo(meta, dto.dataRealizado);
    }
    
    // Normaliza a data se fornecida
    const dataNormalizada = dto.dataRealizado 
      ? this.normalizeDateString(dto.dataRealizado)
      : execucao.dataRealizado;
    
    // Constrói a query de atualização dinamicamente
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    if (dto.dataRealizado !== undefined) {
      updates.push(`"dataRealizado" = $${paramIndex}::date`);
      params.push(dataNormalizada);
      paramIndex++;
    }
    
    if (dto.valorRealizado !== undefined) {
      updates.push(`"valorRealizado" = $${paramIndex}`);
      params.push(dto.valorRealizado);
      paramIndex++;
    }
    
    if (dto.justificativa !== undefined) {
      updates.push(`"justificativa" = $${paramIndex}`);
      params.push(dto.justificativa || null);
      paramIndex++;
    }
    
    // Se não há nada para atualizar, retorna a execução atual
    if (updates.length === 0) {
      return execucao;
    }
    
    // Adiciona atualização de timestamp e ID para WHERE
    updates.push(`"atualizadoEm" = CURRENT_TIMESTAMP`);
    params.push(execucaoId);
    
    // Usa query SQL raw para atualizar a data diretamente
    await this.metaExecucaoRepository.query(
      `UPDATE meta_execucoes 
       SET ${updates.join(', ')}
       WHERE "id" = $${paramIndex}`,
      params,
    );
    
    // Busca a execução atualizada com a relação meta
    const updated = await this.metaExecucaoRepository.findOne({
      where: { id: execucaoId },
      relations: ['meta'],
    });
    
    if (!updated) {
      throw new Error('Erro ao atualizar execução da meta');
    }
    
    return updated;
  }

  async remove(
    userId: string,
    metaId: string,
    execucaoId: string,
  ): Promise<void> {
    await this.ensureMetaAccess(userId, metaId);
    const execucao = await this.findExecucao(metaId, execucaoId);
    await this.metaExecucaoRepository.remove(execucao);
  }
}
