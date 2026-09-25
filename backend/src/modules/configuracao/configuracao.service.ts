import { existsSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuracao } from './entities/configuracao.entity';
import { CreateConfiguracaoDto } from './dto/create-configuracao.dto';
import { UpdateConfiguracaoDto } from './dto/update-configuracao.dto';
import { MobileVersaoMinimaDto } from './dto/mobile-versao-minima.dto';
import { AuditoriaService } from '../../common/services/auditoria.service';
import { AuditAction } from '../../common/enums/auditoria.enum';
import {
  EmailEnvioConfig,
  ErpVistoriaConfig,
  TempoFaixaConfig,
  TempoFluxoConfig,
} from './entities/configuracao.entity';
import { MobileAppVersionGuard } from '../../common/guards/mobile-app-version.guard';
import { isValidSemver } from '../../common/utils/semver.util';
import { loadMobileAppVersionsCatalog, removeMobileAppVersionFromCatalog, MobileAppVersionEntry } from '../../common/utils/mobile-app-versions.util';

@Injectable()
export class ConfiguracaoService {
  constructor(
    @InjectRepository(Configuracao)
    private readonly configuracaoRepository: Repository<Configuracao>,
    private readonly auditoriaService: AuditoriaService,
    @Optional()
    private readonly mobileAppVersionGuard?: MobileAppVersionGuard,
  ) {}

  private normalizeOdometroDiffMaxKm(
    input: unknown,
  ): number | null | undefined {
    if (input === undefined) {
      return undefined;
    }
    if (input === null || input === '') {
      return null;
    }
    const n = Number(input);
    if (!Number.isInteger(n) || n < 1 || n > 999999) {
      throw new BadRequestException(
        'Diferença máxima entre odômetros deve ser um número inteiro entre 1 e 999999.',
      );
    }
    return n;
  }

  private normalizeMobileVersaoMinima(
    input: unknown,
  ): string | null | undefined {
    if (input === undefined) {
      return undefined;
    }
    if (input === null || input === '') {
      return null;
    }
    const texto = String(input).trim();
    if (!texto) {
      return null;
    }
    if (!isValidSemver(texto)) {
      throw new BadRequestException(
        'Versão mínima do app deve estar no formato x.y.z (ex.: 1.3.9).',
      );
    }
    return texto;
  }

  private invalidateMobileVersionCache(): void {
    this.mobileAppVersionGuard?.invalidateCache();
  }

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

  private normalizeTempoFluxoConfig(
    input?: unknown,
  ): TempoFluxoConfig | undefined {
    if (!input) {
      return undefined;
    }
    const source = input as Partial<TempoFluxoConfig>;

    const normalizeFaixas = (
      faixas: unknown,
      tela: string,
    ): TempoFaixaConfig[] => {
      if (!Array.isArray(faixas)) {
        return [];
      }

      const normalized = faixas.map((f, index) => {
        const faixa = (f ?? {}) as Partial<TempoFaixaConfig>;
        const minHoras = Number(faixa.minHoras);
        const maxHorasRaw = faixa.maxHoras;
        const maxHoras =
          maxHorasRaw === null || maxHorasRaw === undefined
            ? null
            : Number(maxHorasRaw);

        if (!Number.isFinite(minHoras) || minHoras < 0) {
          throw new BadRequestException(
            `Faixa inválida em ${tela}[${index}]: minHoras deve ser número >= 0`,
          );
        }
        if (
          maxHoras !== null &&
          (!Number.isFinite(maxHoras) || maxHoras <= minHoras)
        ) {
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

      const ativos = normalized
        .filter((f) => f.ativo)
        .sort((a, b) => a.minHoras - b.minHoras);
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

  private normalizeEmailEnvioConfig(
    input?: unknown,
  ): EmailEnvioConfig | undefined {
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
        throw new BadRequestException(
          'Host SMTP é obrigatório quando envio de e-mail está ativo.',
        );
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

  private isApiKeyMascarada(valor?: string): boolean {
    const texto = (valor ?? '').trim();
    return !texto || /^\*+$/.test(texto);
  }

  private chaveErpValida(valor?: string): string {
    const texto = (valor ?? '').trim();
    if (this.isApiKeyMascarada(texto)) {
      return '';
    }
    return texto;
  }

  private normalizeErpVistoriaConfig(
    input: unknown,
    anterior?: ErpVistoriaConfig,
  ): ErpVistoriaConfig | undefined {
    if (!input) {
      return undefined;
    }
    const source = input as Partial<ErpVistoriaConfig>;
    const ativo = !!source.ativo;
    const url = (source.url ?? '').toString().trim();
    const tenant =
      (source.tenant ?? '').toString().trim() || 'SISTEMA_VISTORIA';
    const apiKeyInformada = this.chaveErpValida(
      (source.apiKey ?? '').toString(),
    );
    const apiKeyAnterior = this.chaveErpValida(anterior?.apiKey);
    const apiKey = apiKeyInformada || apiKeyAnterior;
    const localAbertura = Number(source.localAbertura);
    const tipoPedido = Number(source.tipoPedido);
    const timeoutMs = Number(source.timeoutMs);
    const mensagemErroPadrao = (source.mensagemErroPadrao ?? '')
      .toString()
      .trim();

    if (ativo) {
      if (!url) {
        throw new BadRequestException(
          'URL do ERP é obrigatória quando o envio está ativo.',
        );
      }
      if (!tenant) {
        throw new BadRequestException(
          'Tenant do ERP é obrigatório quando o envio está ativo.',
        );
      }
      if (!apiKey) {
        throw new BadRequestException(
          'API Key do ERP é obrigatória quando o envio está ativo.',
        );
      }
    }

    return {
      ativo,
      url,
      tenant,
      apiKey: apiKey || undefined,
      localAbertura: localAbertura === 0 ? 0 : 1,
      tipoPedido: tipoPedido === 1 ? 1 : 0,
      mensagemErroPadrao: mensagemErroPadrao || undefined,
      timeoutMs:
        Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 30000,
    };
  }

  private mascararConfig(config: Configuracao): Configuracao {
    const temLogoBytes = !!(
      config.logoRelatorioBytes && config.logoRelatorioBytes.length > 0
    );
    const base: Configuracao = {
      ...config,
      logoRelatorio: temLogoBytes
        ? 'db'
        : config.logoRelatorio?.trim() || null,
      logoRelatorioBytes: undefined,
      logoRelatorioMime: undefined,
    };
    if (!config.erpVistoriaConfig) {
      return base;
    }
    const apiKey = this.chaveErpValida(config.erpVistoriaConfig.apiKey);
    return {
      ...base,
      erpVistoriaConfig: {
        ...config.erpVistoriaConfig,
        apiKey: '',
        apiKeyConfigured: !!apiKey,
      },
    };
  }

  private aplicarLogoArquivo(
    config: Configuracao,
    file?: Express.Multer.File | null,
  ): void {
    if (!file?.buffer?.length) {
      return;
    }
    config.logoRelatorioBytes = Buffer.from(file.buffer);
    config.logoRelatorioMime = file.mimetype?.trim() || 'image/png';
    config.logoRelatorio = 'db';
  }

  async create(
    dto: CreateConfiguracaoDto,
    userId?: string,
    logoFile?: Express.Multer.File | null,
  ): Promise<Configuracao> {
    const defaultTempoFluxo = this.buildDefaultTempoFluxoConfig();
    const odometroDiffMaxKm = this.normalizeOdometroDiffMaxKm(
      dto.odometroDiffMaxKm,
    );
    const mobileVersaoMinima = this.normalizeMobileVersaoMinima(
      dto.mobileVersaoMinima,
    );
    const normalizedDto: CreateConfiguracaoDto = {
      ...dto,
      tempoFluxoConfig:
        this.normalizeTempoFluxoConfig(dto.tempoFluxoConfig) ??
        defaultTempoFluxo,
      emailEnvioConfig: this.normalizeEmailEnvioConfig(dto.emailEnvioConfig),
      ...(odometroDiffMaxKm !== undefined
        ? { odometroDiffMaxKm }
        : {}),
      ...(mobileVersaoMinima !== undefined
        ? { mobileVersaoMinima }
        : {}),
    };
    // Não persistir path legado via multipart; bytes vêm no arquivo.
    delete normalizedDto.logoRelatorio;
    if (dto.erpVistoriaConfig === undefined) {
      delete normalizedDto.erpVistoriaConfig;
    }

    // Busca se já existe configuração (só pode haver uma)
    let config = await this.configuracaoRepository.findOne({ where: {} });
    if (config) {
      if (dto.erpVistoriaConfig !== undefined) {
        normalizedDto.erpVistoriaConfig = this.normalizeErpVistoriaConfig(
          dto.erpVistoriaConfig,
          config.erpVistoriaConfig,
        );
      }
      const dadosAnteriores = this.mascararConfig({ ...config });
      Object.assign(config, normalizedDto);
      this.aplicarLogoArquivo(config, logoFile);

      const configuracaoAtualizada =
        await this.configuracaoRepository.save(config);

      await this.auditoriaService.createLog({
        acao: AuditAction.UPDATE,
        descricao: `Configuração do sistema atualizada`,
        usuarioId: userId,
        entidade: 'configuracoes',
        entidadeId: config.id,
        dadosAnteriores,
        dadosNovos: this.mascararConfig({
          ...normalizedDto,
          logoRelatorio: logoFile?.buffer?.length ? 'db' : config.logoRelatorio,
        } as Configuracao),
      });

      this.invalidateMobileVersionCache();
      return this.withMobileCatalog(configuracaoAtualizada);
    } else {
      if (dto.erpVistoriaConfig !== undefined) {
        normalizedDto.erpVistoriaConfig = this.normalizeErpVistoriaConfig(
          dto.erpVistoriaConfig,
        );
      }
      config = this.configuracaoRepository.create(normalizedDto);
      this.aplicarLogoArquivo(config, logoFile);
      const novaConfig = await this.configuracaoRepository.save(config);

      await this.auditoriaService.createLog({
        acao: AuditAction.CREATE,
        descricao: `Nova configuração do sistema criada`,
        usuarioId: userId,
        entidade: 'configuracoes',
        entidadeId: config.id,
        dadosNovos: this.mascararConfig({
          ...normalizedDto,
          logoRelatorio: logoFile?.buffer?.length ? 'db' : undefined,
        } as Configuracao),
      });

      this.invalidateMobileVersionCache();
      return this.withMobileCatalog(novaConfig);
    }
  }

  async findOne(): Promise<
    Configuracao & { mobileVersoesCatalogo: MobileAppVersionEntry[] }
  > {
    const config = await this.configuracaoRepository.findOne({ where: {} });
    if (!config) throw new NotFoundException('Configuração não encontrada');
    if (!config.tempoFluxoConfig) {
      config.tempoFluxoConfig = this.buildDefaultTempoFluxoConfig();
      await this.configuracaoRepository.save(config);
    }
    return this.withMobileCatalog(config);
  }

  async findMobileVersaoMinima(): Promise<MobileVersaoMinimaDto> {
    const config = await this.configuracaoRepository.findOne({ where: {} });
    const raw = config?.mobileVersaoMinima?.trim() || null;
    const versaoMinima = raw && isValidSemver(raw) ? raw : null;
    return {
      versaoMinima,
      bloqueioAtivo: !!versaoMinima,
      versoes: loadMobileAppVersionsCatalog(),
    };
  }

  async removeMobileVersaoCatalogo(
    version: string,
    userId?: string,
  ): Promise<{
    mobileVersoesCatalogo: MobileAppVersionEntry[];
    mobileVersaoMinima: string | null;
  }> {
    if (!isValidSemver(version.trim())) {
      throw new BadRequestException(
        'Versão inválida. Use o formato x.y.z (ex.: 1.3.9).',
      );
    }

    let catalogo: MobileAppVersionEntry[];
    try {
      catalogo = removeMobileAppVersionFromCatalog(version);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(msg);
    }

    const config = await this.configuracaoRepository.findOne({ where: {} });
    let mobileVersaoMinima = config?.mobileVersaoMinima?.trim() || null;
    if (mobileVersaoMinima === version.trim()) {
      if (config) {
        const dadosAnteriores = { mobileVersaoMinima: config.mobileVersaoMinima };
        config.mobileVersaoMinima = null;
        await this.configuracaoRepository.save(config);
        await this.auditoriaService.createLog({
          acao: AuditAction.UPDATE,
          descricao: `Versão mínima do app limpa ao remover ${version} do catálogo`,
          usuarioId: userId,
          entidade: 'configuracoes',
          entidadeId: config.id,
          dadosAnteriores,
          dadosNovos: { mobileVersaoMinima: null },
        });
      }
      mobileVersaoMinima = null;
      this.invalidateMobileVersionCache();
    }

    await this.auditoriaService.createLog({
      acao: AuditAction.DELETE,
      descricao: `Versão ${version} removida do catálogo do app mobile`,
      usuarioId: userId,
      entidade: 'configuracoes',
      entidadeId: config?.id,
      dadosNovos: { versaoRemovida: version, catalogo },
    });

    return { mobileVersoesCatalogo: catalogo, mobileVersaoMinima };
  }

  async findLogoRelatorio(): Promise<{
    logoRelatorio: string | null;
    dataUrl: string | null;
  }> {
    const config = await this.configuracaoRepository.findOne({ where: {} });
    if (!config) {
      return { logoRelatorio: null, dataUrl: null };
    }

    const fromDb = this.buildLogoDataUrlFromBytes(config);
    if (fromDb) {
      return { logoRelatorio: 'db', dataUrl: fromDb };
    }

    // Migração pontual: se ainda houver arquivo em disco, importa para bytea
    const imported = this.tryImportLogoFromDisk(config);
    if (imported) {
      config.logoRelatorioBytes = imported.bytes;
      config.logoRelatorioMime = imported.mime;
      config.logoRelatorio = 'db';
      await this.configuracaoRepository.save(config);
      return {
        logoRelatorio: 'db',
        dataUrl: `data:${imported.mime};base64,${imported.bytes.toString('base64')}`,
      };
    }

    return {
      logoRelatorio: config.logoRelatorio?.trim() || null,
      dataUrl: null,
    };
  }

  async findErpApiKey(): Promise<{ configurada: boolean; apiKey: string }> {
    const config = await this.configuracaoRepository.findOne({ where: {} });
    const apiKey = this.chaveErpValida(config?.erpVistoriaConfig?.apiKey);
    return {
      configurada: !!apiKey,
      apiKey,
    };
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
    return config.tempoFluxoConfig;
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
    logoFile?: Express.Multer.File | null,
  ): Promise<Configuracao> {
    const config = await this.configuracaoRepository.findOne({ where: { id } });
    if (!config) throw new NotFoundException('Configuração não encontrada');

    const odometroDiffMaxKm = this.normalizeOdometroDiffMaxKm(
      dto.odometroDiffMaxKm,
    );
    const mobileVersaoMinima = this.normalizeMobileVersaoMinima(
      dto.mobileVersaoMinima,
    );
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
      erpVistoriaConfig:
        dto.erpVistoriaConfig === undefined
          ? undefined
          : this.normalizeErpVistoriaConfig(
              dto.erpVistoriaConfig,
              config.erpVistoriaConfig,
            ),
      ...(odometroDiffMaxKm !== undefined
        ? { odometroDiffMaxKm }
        : {}),
      ...(mobileVersaoMinima !== undefined
        ? { mobileVersaoMinima }
        : {}),
    };
    delete normalizedDto.logoRelatorio;

    const dadosAnteriores = this.mascararConfig({ ...config });
    Object.assign(config, normalizedDto);
    this.aplicarLogoArquivo(config, logoFile);
    const configuracaoAtualizada =
      await this.configuracaoRepository.save(config);

    await this.auditoriaService.createLog({
      acao: AuditAction.UPDATE,
      descricao: `Configuração do sistema atualizada via PUT`,
      usuarioId: userId,
      entidade: 'configuracoes',
      entidadeId: id,
      dadosAnteriores,
      dadosNovos: this.mascararConfig({
        ...configuracaoAtualizada,
        ...normalizedDto,
        logoRelatorio: logoFile?.buffer?.length
          ? 'db'
          : configuracaoAtualizada.logoRelatorio,
      } as Configuracao),
    });

    this.invalidateMobileVersionCache();
    return this.withMobileCatalog(configuracaoAtualizada);
  }

  private withMobileCatalog(
    config: Configuracao,
  ): Configuracao & { mobileVersoesCatalogo: MobileAppVersionEntry[] } {
    return {
      ...this.mascararConfig(config),
      mobileVersoesCatalogo: loadMobileAppVersionsCatalog(),
    };
  }

  private buildLogoDataUrlFromBytes(config: Configuracao): string | null {
    const raw = config.logoRelatorioBytes;
    if (!raw || (Buffer.isBuffer(raw) ? raw.length === 0 : !raw)) {
      return null;
    }
    const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
    if (!buf.length) {
      return null;
    }
    const mime = config.logoRelatorioMime?.trim() || 'image/png';
    return `data:${mime};base64,${buf.toString('base64')}`;
  }

  private tryImportLogoFromDisk(
    config: Configuracao,
  ): { bytes: Buffer; mime: string } | null {
    const abs = this.resolveLogoRelatorioPath(config.logoRelatorio);
    if (!abs) {
      return null;
    }
    try {
      const bytes = readFileSync(abs);
      if (!bytes.length) {
        return null;
      }
      const ext = extname(abs).toLowerCase();
      const mime =
        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
      return { bytes, mime };
    } catch {
      return null;
    }
  }

  private resolveLogoRelatorioPath(
    logoRelatorio?: string | null,
  ): string | null {
    if (!logoRelatorio?.trim() || logoRelatorio.trim() === 'db') {
      return null;
    }
    const raw = logoRelatorio.trim();
    if (/^https?:\/\//i.test(raw)) {
      return null;
    }
    let rel = raw.replace(/^\/+/, '');
    if (rel.toLowerCase().startsWith('uploads/')) {
      rel = rel.slice('uploads/'.length);
    }
    if (!rel) {
      return null;
    }
    const abs = join(process.cwd(), 'uploads', rel);
    return existsSync(abs) ? abs : null;
  }
}
