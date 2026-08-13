import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegracaoManutencaoEmpresa } from '../../common/enums/integracao-manutencao-empresa.enum';
import { EmpresaTerceira } from './entities/empresa-terceira.entity';
import { CreateEmpresaTerceiraDto } from './dto/create-empresa-terceira.dto';
import { UpdateEmpresaTerceiraDto } from './dto/update-empresa-terceira.dto';
import {
  EmpresaTerceiraResponse,
  normalizeIntegracaoManutencao,
  toEmpresaTerceiraResponse,
} from './empresa-terceira.mapper';
import {
  stripIntegracaoFromCreateDto,
  stripIntegracaoFromUpdateDto,
} from './empresa-terceira-integracao.util';

export type EmpresaTerceiraAccessOptions = {
  includeIntegracaoConfig?: boolean;
};

@Injectable()
export class EmpresaTerceiraService {
  constructor(
    @InjectRepository(EmpresaTerceira)
    private readonly repository: Repository<EmpresaTerceira>,
  ) {}

  private normalizeEmailsRelatorio(input?: string): string | undefined {
    if (!input) {
      return undefined;
    }
    const emails = input
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean);
    if (emails.length === 0) {
      return undefined;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidos = emails.filter((email) => !emailRegex.test(email));
    if (invalidos.length > 0) {
      throw new BadRequestException(
        `E-mails inválidos para relatório: ${invalidos.join(', ')}`,
      );
    }
    return emails.join(', ');
  }

  private assertIntegracaoBrt(dto: {
    integracaoManutencao?: IntegracaoManutencaoEmpresa;
    ehEmpresaManutencao?: boolean;
    brtTenEmp?: string;
    brtToken?: string;
    brtNomSol?: string;
  }): void {
    if (dto.integracaoManutencao !== IntegracaoManutencaoEmpresa.BRT_OS) {
      return;
    }
    if (dto.ehEmpresaManutencao === false) {
      throw new BadRequestException(
        'Integração BRT exige empresa marcada como manutenção',
      );
    }
    if (!dto.brtTenEmp?.trim()) {
      throw new BadRequestException(
        'Informe o tenant BRT para integração de OS',
      );
    }
    if (!dto.brtNomSol?.trim()) {
      throw new BadRequestException(
        'Informe o solicitante para integração de OS',
      );
    }
  }

  async create(
    dto: CreateEmpresaTerceiraDto,
    options?: EmpresaTerceiraAccessOptions,
  ): Promise<EmpresaTerceiraResponse> {
    const includeIntegracao = options?.includeIntegracaoConfig === true;
    const effectiveDto = includeIntegracao
      ? dto
      : stripIntegracaoFromCreateDto(dto);
    const descricaoNorm = effectiveDto.descricao.trim();
    const existente = await this.repository.findOne({
      where: { descricao: descricaoNorm },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe uma empresa terceira com a descrição "${descricaoNorm}"`,
      );
    }
    this.assertIntegracaoBrt({
      integracaoManutencao: effectiveDto.integracaoManutencao,
      ehEmpresaManutencao: effectiveDto.ehEmpresaManutencao,
      brtTenEmp: effectiveDto.brtTenEmp,
      brtToken: effectiveDto.brtToken,
      brtNomSol: effectiveDto.brtNomSol,
    });
    if (
      effectiveDto.integracaoManutencao === IntegracaoManutencaoEmpresa.BRT_OS &&
      !effectiveDto.brtToken?.trim()
    ) {
      throw new BadRequestException(
        'Informe o token BRT para integração de OS',
      );
    }
    const entidade = this.repository.create({
      descricao: descricaoNorm,
      emailsRelatorio: this.normalizeEmailsRelatorio(effectiveDto.emailsRelatorio),
      ehEmpresaManutencao: !!effectiveDto.ehEmpresaManutencao,
      integracaoManutencao: normalizeIntegracaoManutencao(
        effectiveDto.integracaoManutencao,
      ),
      enviarEmailRelatorio:
        effectiveDto.enviarEmailRelatorio !== undefined
          ? !!effectiveDto.enviarEmailRelatorio
          : true,
      brtUrlBase: effectiveDto.brtUrlBase?.trim() || undefined,
      brtTenEmp: effectiveDto.brtTenEmp?.trim() || undefined,
      brtToken: effectiveDto.brtToken?.trim() || undefined,
      brtAmbiente: effectiveDto.brtAmbiente?.trim() || undefined,
      brtNomSol: effectiveDto.brtNomSol?.trim() || undefined,
      brtTelCtt: effectiveDto.brtTelCtt?.trim() || undefined,
      brtLocAtd: effectiveDto.brtLocAtd?.trim() || undefined,
    });
    const saved = await this.repository.save(entidade);
    return toEmpresaTerceiraResponse(saved, {
      tokenPresent: !!effectiveDto.brtToken?.trim(),
      includeIntegracaoConfig: includeIntegracao,
    });
  }

  async findAll(
    onlyManutencao = false,
    options?: EmpresaTerceiraAccessOptions,
  ): Promise<EmpresaTerceiraResponse[]> {
    const includeIntegracao = options?.includeIntegracaoConfig === true;
    const list = await this.repository.find({
      where: onlyManutencao ? { ehEmpresaManutencao: true } : {},
      order: { descricao: 'ASC' },
    });
    return list.map((item) =>
      toEmpresaTerceiraResponse(item, {
        includeIntegracaoConfig: includeIntegracao,
      }),
    );
  }

  async findOne(
    id: string,
    options?: EmpresaTerceiraAccessOptions,
  ): Promise<EmpresaTerceiraResponse> {
    const includeIntegracao = options?.includeIntegracaoConfig === true;
    const entidade = includeIntegracao
      ? await this.repository
          .createQueryBuilder('e')
          .addSelect('e.brtToken')
          .where('e.id = :id', { id })
          .getOne()
      : await this.repository.findOne({ where: { id } });
    if (!entidade) {
      throw new NotFoundException('Empresa terceira não encontrada');
    }
    return toEmpresaTerceiraResponse(entidade, {
      includeIntegracaoConfig: includeIntegracao,
      includeBrtToken: includeIntegracao,
    });
  }

  /** Carrega empresa com token BRT (uso interno integração). */
  async findOneForIntegracao(id: string): Promise<EmpresaTerceira> {
    const entidade = await this.repository
      .createQueryBuilder('e')
      .addSelect('e.brtToken')
      .where('e.id = :id', { id })
      .getOne();
    if (!entidade) {
      throw new NotFoundException('Empresa terceira não encontrada');
    }
    return entidade;
  }

  async update(
    id: string,
    dto: UpdateEmpresaTerceiraDto,
    options?: EmpresaTerceiraAccessOptions,
  ): Promise<EmpresaTerceiraResponse> {
    const includeIntegracao = options?.includeIntegracaoConfig === true;
    const effectiveDto = includeIntegracao
      ? dto
      : stripIntegracaoFromUpdateDto(dto);
    const entidade = await this.repository
      .createQueryBuilder('e')
      .addSelect('e.brtToken')
      .where('e.id = :id', { id })
      .getOne();
    if (!entidade) {
      throw new NotFoundException('Empresa terceira não encontrada');
    }
    if (effectiveDto.descricao !== undefined) {
      const descricaoNorm = effectiveDto.descricao.trim();
      const existente = await this.repository.findOne({
        where: { descricao: descricaoNorm },
      });
      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Já existe outra empresa com a descrição "${descricaoNorm}"`,
        );
      }
      entidade.descricao = descricaoNorm;
    }
    if (effectiveDto.emailsRelatorio !== undefined) {
      entidade.emailsRelatorio = this.normalizeEmailsRelatorio(
        effectiveDto.emailsRelatorio,
      );
    }
    if (effectiveDto.ehEmpresaManutencao !== undefined) {
      entidade.ehEmpresaManutencao = !!effectiveDto.ehEmpresaManutencao;
    }
    if (effectiveDto.integracaoManutencao !== undefined) {
      entidade.integracaoManutencao = normalizeIntegracaoManutencao(
        effectiveDto.integracaoManutencao,
      );
    }
    if (effectiveDto.enviarEmailRelatorio !== undefined) {
      entidade.enviarEmailRelatorio = !!effectiveDto.enviarEmailRelatorio;
    }
    if (effectiveDto.brtUrlBase !== undefined) {
      entidade.brtUrlBase = effectiveDto.brtUrlBase?.trim() || undefined;
    }
    if (effectiveDto.brtTenEmp !== undefined) {
      entidade.brtTenEmp = effectiveDto.brtTenEmp?.trim() || undefined;
    }
    if (effectiveDto.brtAmbiente !== undefined) {
      entidade.brtAmbiente = effectiveDto.brtAmbiente?.trim() || undefined;
    }
    if (effectiveDto.brtNomSol !== undefined) {
      entidade.brtNomSol = effectiveDto.brtNomSol?.trim() || undefined;
    }
    if (effectiveDto.brtTelCtt !== undefined) {
      entidade.brtTelCtt = effectiveDto.brtTelCtt?.trim() || undefined;
    }
    if (effectiveDto.brtLocAtd !== undefined) {
      entidade.brtLocAtd = effectiveDto.brtLocAtd?.trim() || undefined;
    }
    if (effectiveDto.brtToken !== undefined && effectiveDto.brtToken.trim()) {
      entidade.brtToken = effectiveDto.brtToken.trim();
    }
    this.assertIntegracaoBrt({
      integracaoManutencao: entidade.integracaoManutencao,
      ehEmpresaManutencao: entidade.ehEmpresaManutencao,
      brtTenEmp: entidade.brtTenEmp,
      brtToken: entidade.brtToken,
      brtNomSol: entidade.brtNomSol,
    });
    if (
      entidade.integracaoManutencao === IntegracaoManutencaoEmpresa.BRT_OS &&
      !entidade.brtToken?.trim()
    ) {
      throw new BadRequestException(
        'Informe o token BRT para integração de OS',
      );
    }
    const saved = await this.repository.save(entidade);
    return toEmpresaTerceiraResponse(saved, {
      includeIntegracaoConfig: includeIntegracao,
    });
  }

  async remove(id: string): Promise<void> {
    const entidade = await this.repository.findOne({ where: { id } });
    if (!entidade) {
      throw new NotFoundException('Empresa terceira não encontrada');
    }
    await this.repository.remove(entidade);
  }
}
