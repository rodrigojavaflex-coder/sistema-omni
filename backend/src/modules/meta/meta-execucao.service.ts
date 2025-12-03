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

  private toLocalDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr) return null;
    const normalized = `${dateStr}T00:00:00`;
    const date = new Date(normalized);
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
    return this.metaExecucaoRepository.find({
      where: { metaId },
      order: { dataRealizado: 'DESC', criadoEm: 'DESC' },
    });
  }

  async create(
    userId: string,
    metaId: string,
    dto: CreateMetaExecucaoDto,
  ): Promise<MetaExecucao> {
    const meta = await this.ensureMetaAccess(userId, metaId);
    this.assertDataDentroDoPeriodo(meta, dto.dataRealizado);
    const execucao = this.metaExecucaoRepository.create({
      ...dto,
      metaId,
      meta,
    });
    return this.metaExecucaoRepository.save(execucao);
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
    Object.assign(execucao, {
      dataRealizado: dto.dataRealizado ?? execucao.dataRealizado,
      valorRealizado: dto.valorRealizado ?? execucao.valorRealizado,
      justificativa: dto.justificativa ?? execucao.justificativa,
    });
    return this.metaExecucaoRepository.save(execucao);
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
