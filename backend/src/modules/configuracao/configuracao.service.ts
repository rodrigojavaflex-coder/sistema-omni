import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracao } from './entities/configuracao.entity';
import { CreateConfiguracaoDto } from './dto/create-configuracao.dto';
import { UpdateConfiguracaoDto } from './dto/update-configuracao.dto';
import { AuditoriaService } from '../../common/services/auditoria.service';
import { AuditAction } from '../../common/enums/auditoria.enum';
import {
  EmailEnvioConfig,
  TempoFaixaConfig,
  TempoFluxoConfig,
} from './entities/configuracao.entity';

@Injectable()
export class ConfiguracaoService {
  constructor(
    @InjectRepository(Configuracao)
    private readonly configuracaoRepository: Repository<Configuracao>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  private buildDefaultTempoFluxoConfig(): TempoFluxoConfig {
    const base: TempoFaixaConfig[] = [
      {
        minHoras: 0,
        maxHoras: 24,
        label: '',
        corHex: '#64748b',
        mostrarCor: false,
        mostrarRotulo: false,
        ativo: true,
      },
      {
        minHoras: 24,
        maxHoras: 72,
        label: 'Atenção',
        corHex: '#f59e0b',
        mostrarCor: true,
        mostrarRotulo: true,
        ativo: true,
      },
      {
        minHoras: 72,
        maxHoras: null,
        label: 'Crítico',
        corHex: '#ef4444',
        mostrarCor: true,
        mostrarRotulo: true,
        ativo: true,
      },
    ];
    const clone = () => base.map((faixa) => ({ ...faixa }));
    return {
      tratamento: clone(),
      manutencao: clone(),
      validacaoFinal: clone(),
    };
  }

  private normalizeTempoFluxoConfig(input?: unknown): TempoFluxoConfig | undefined {
    if (!input) {
      return undefined;
    }
    const source = input as Partial<TempoFluxoConfig>;

    const normalizeFaixas = (faixas: unknown, tela: string): TempoFaixaConfig[] => {
      if (!Array.isArray(faixas)) {
        return [];
      }

      const normalized = faixas.map((f, index) => {
        const faixa = (f ?? {}) as Partial<TempoFaixaConfig>;
        const minHoras = Number(faixa.minHoras);
        const maxHorasRaw = faixa.maxHoras;
        const maxHoras =
          maxHorasRaw === null || maxHorasRaw === undefined ? null : Number(maxHorasRaw);

        if (!Number.isFinite(minHoras) || minHoras < 0) {
          throw new BadRequestException(
            `Faixa inválida em ${tela}[${index}]: minHoras deve ser número >= 0`,
          );
        }
        if (maxHoras !== null && (!Number.isFinite(maxHoras) || maxHoras <= minHoras)) {
          throw new BadRequestException(
            `Faixa inválida em ${tela}[${index}]: maxHoras deve ser maior que minHoras`,
          );
        }

        const corHex = (faixa.corHex ?? '#64748b').toString().trim();
        if (!/^#[0-9A-Fa-f]{6}$/.test(corHex)) {
          throw new BadRequestException(
            `Faixa inválida em ${tela}[${index}]: corHex deve estar no formato #RRGGBB`,
          );
        }

        return {
          minHoras,
          maxHoras,
          label: (faixa.label ?? '').toString().trim(),
          corHex,
          mostrarCor: !!faixa.mostrarCor,
          mostrarRotulo: !!faixa.mostrarRotulo,
          ativo: faixa.ativo === undefined ? true : !!faixa.ativo,
        };
      });

      const ativos = normalized.filter((f) => f.ativo).sort((a, b) => a.minHoras - b.minHoras);
      for (let i = 1; i < ativos.length; i++) {
        const prev = ativos[i - 1];
        const curr = ativos[i];
        if (prev.maxHoras === null || curr.minHoras < prev.maxHoras) {
          throw new BadRequestException(
            `Faixas ativas de ${tela} não podem se sobrepor (verifique os intervalos).`,
          );
        }
      }

      return normalized.sort((a, b) => a.minHoras - b.minHoras);
    };

    return {
      tratamento: normalizeFaixas(source.tratamento, 'tratamento'),
      manutencao: normalizeFaixas(source.manutencao, 'manutencao'),
      validacaoFinal: normalizeFaixas(source.validacaoFinal, 'validacaoFinal'),
    };
  }

  private normalizeEmailEnvioConfig(input?: unknown): EmailEnvioConfig | undefined {
    if (!input) {
      return undefined;
    }
    const source = input as Partial<EmailEnvioConfig>;
    const host = (source.host ?? '').toString().trim();
    const porta = Number(source.porta);
    const ativo = !!source.ativo;
    const usarTls = source.usarTls === undefined ? true : !!source.usarTls;
    const usuario = (source.usuario ?? '').toString().trim();
    const senha = (source.senha ?? '').toString().trim();
    const remetenteNome = (source.remetenteNome ?? '').toString().trim();
    const remetenteEmail = (source.remetenteEmail ?? '').toString().trim();
    const assuntoPadrao = (source.assuntoPadrao ?? '').toString().trim();

    if (ativo) {
      if (!host) {
        throw new BadRequestException('Host SMTP é obrigatório quando envio de e-mail está ativo.');
      }
      if (!Number.isFinite(porta) || porta <= 0) {
        throw new BadRequestException('Porta SMTP inválida.');
      }
      if (!remetenteEmail) {
        throw new BadRequestException(
          'E-mail do remetente é obrigatório quando envio de e-mail está ativo.',
        );
      }
    }

    return {
      ativo,
      host,
      porta: Number.isFinite(porta) && porta > 0 ? porta : 587,
      usuario: usuario || undefined,
      senha: senha || undefined,
      usarTls,
      remetenteNome: remetenteNome || undefined,
      remetenteEmail: remetenteEmail || undefined,
      assuntoPadrao: assuntoPadrao || undefined,
    };
  }

  async create(
    dto: CreateConfiguracaoDto,
    userId?: string,
  ): Promise<Configuracao> {
    const defaultTempoFluxo = this.buildDefaultTempoFluxoConfig();
    const normalizedDto: CreateConfiguracaoDto = {
      ...dto,
      tempoFluxoConfig:
        this.normalizeTempoFluxoConfig(dto.tempoFluxoConfig) ?? defaultTempoFluxo,
      emailEnvioConfig: this.normalizeEmailEnvioConfig(dto.emailEnvioConfig),
    };

    // Busca se já existe configuração (só pode haver uma)
    let config = await this.configuracaoRepository.findOne({ where: {} });
    if (config) {
      // Atualiza existente
      const dadosAnteriores = { ...config };
      Object.assign(config, normalizedDto);

      const configuracaoAtualizada =
        await this.configuracaoRepository.save(config);

      // Auditar atualização
      await this.auditoriaService.createLog({
        acao: AuditAction.UPDATE,
        descricao: `Configuração do sistema atualizada`,
        usuarioId: userId,
        entidade: 'configuracoes',
        entidadeId: config.id,
        dadosAnteriores,
        dadosNovos: normalizedDto,
      });

      return configuracaoAtualizada;
    } else {
      // Cria nova
      config = this.configuracaoRepository.create(normalizedDto);
      const novaConfig = await this.configuracaoRepository.save(config);

      // Auditar criação
      await this.auditoriaService.createLog({
        acao: AuditAction.CREATE,
        descricao: `Nova configuração do sistema criada`,
        usuarioId: userId,
        entidade: 'configuracoes',
        entidadeId: config.id,
        dadosNovos: normalizedDto,
      });

      return novaConfig;
    }
  }

  async findOne(): Promise<Configuracao> {
    const config = await this.configuracaoRepository.findOne({ where: {} });
    if (!config) throw new NotFoundException('Configuração não encontrada');
    if (!config.tempoFluxoConfig) {
      config.tempoFluxoConfig = this.buildDefaultTempoFluxoConfig();
      await this.configuracaoRepository.save(config);
    }
    return config;
  }

  async findTempoFluxoConfig(): Promise<TempoFluxoConfig> {
    let config = await this.configuracaoRepository.findOne({ where: {} });
    if (!config) {
      config = this.configuracaoRepository.create({
        tempoFluxoConfig: this.buildDefaultTempoFluxoConfig(),
        emailEnvioConfig: this.normalizeEmailEnvioConfig(undefined),
      });
      config = await this.configuracaoRepository.save(config);
      return config.tempoFluxoConfig as TempoFluxoConfig;
    }
    if (!config.tempoFluxoConfig) {
      config.tempoFluxoConfig = this.buildDefaultTempoFluxoConfig();
      await this.configuracaoRepository.save(config);
    }
    return config.tempoFluxoConfig as TempoFluxoConfig;
  }

  async updateTempoFluxoConfig(
    input: unknown,
    userId?: string,
  ): Promise<TempoFluxoConfig> {
    const normalized = this.normalizeTempoFluxoConfig(input);
    if (!normalized) {
      throw new BadRequestException('tempoFluxoConfig é obrigatório.');
    }

    let config = await this.configuracaoRepository.findOne({ where: {} });
    if (!config) {
      config = this.configuracaoRepository.create({
        tempoFluxoConfig: normalized,
      });
      const created = await this.configuracaoRepository.save(config);
      await this.auditoriaService.createLog({
        acao: AuditAction.CREATE,
        descricao: 'Configuração de tempo do fluxo criada',
        usuarioId: userId,
        entidade: 'configuracoes',
        entidadeId: created.id,
        dadosNovos: { tempoFluxoConfig: normalized },
      });
      return normalized;
    }

    const dadosAnteriores = { tempoFluxoConfig: config.tempoFluxoConfig };
    config.tempoFluxoConfig = normalized;
    await this.configuracaoRepository.save(config);
    await this.auditoriaService.createLog({
      acao: AuditAction.UPDATE,
      descricao: 'Configuração de tempo do fluxo atualizada',
      usuarioId: userId,
      entidade: 'configuracoes',
      entidadeId: config.id,
      dadosAnteriores,
      dadosNovos: { tempoFluxoConfig: normalized },
    });
    return normalized;
  }

  async update(
    id: string,
    dto: UpdateConfiguracaoDto,
    userId?: string,
  ): Promise<Configuracao> {
    const normalizedDto: UpdateConfiguracaoDto = {
      ...dto,
      tempoFluxoConfig:
        dto.tempoFluxoConfig === undefined
          ? undefined
          : this.normalizeTempoFluxoConfig(dto.tempoFluxoConfig),
      emailEnvioConfig:
        dto.emailEnvioConfig === undefined
          ? undefined
          : this.normalizeEmailEnvioConfig(dto.emailEnvioConfig),
    };

    const config = await this.configuracaoRepository.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuração não encontrada');

    const dadosAnteriores = { ...config };
    Object.assign(config, normalizedDto);
    const configuracaoAtualizada =
      await this.configuracaoRepository.save(config);

    // Auditar atualização
    await this.auditoriaService.createLog({
      acao: AuditAction.UPDATE,
      descricao: `Configuração do sistema atualizada via PUT`,
      usuarioId: userId,
      entidade: 'configuracoes',
      entidadeId: id,
      dadosAnteriores,
      dadosNovos: normalizedDto,
    });

    return configuracaoAtualizada;
  }
}
