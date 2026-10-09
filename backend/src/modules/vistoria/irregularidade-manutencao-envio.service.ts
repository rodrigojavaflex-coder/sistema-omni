import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { EmpresaTerceiraService } from '../empresa-terceira/empresa-terceira.service';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Configuracao } from '../configuracao/entities/configuracao.entity';
import { BrtOsIntegrationService } from './brt-os-integration.service';
import { ErpVistoriaIntegrationService } from './erp-vistoria-integration.service';
import { ImpressaoRawService } from './impressao-raw.service';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeOsExterna } from './entities/irregularidade-os-externa.entity';
import {
  EnvioManutencaoFalhaItemDto,
  RelatorioManutencaoExecucaoDto,
  RelatorioManutencaoResumoDto,
} from './dto/relatorio-manutencao.dto';

export const STATUS_ENVIO_MANUTENCAO: StatusIrregularidade[] = [
  StatusIrregularidade.REGISTRADA,
  StatusIrregularidade.RETRABALHO_GARANTIA,
  StatusIrregularidade.NAO_PROCEDE,
];

export interface ManutencaoEnvioContext {
  actor?: { id?: string; idEmpresa?: string; nome?: string };
  registrarHistorico: (
    manager: EntityManager,
    data: {
      idIrregularidade: string;
      statusOrigem?: StatusIrregularidade;
      statusDestino: StatusIrregularidade;
      acao: string;
      idUsuario?: string;
      idEmpresaEvento?: string;
      observacao?: string;
    },
  ) => Promise<void>;
  buildResumoRelatorio: (
    empresa: EmpresaTerceira,
    irregularidades: Irregularidade[],
    emitidoEm: Date,
    emitidoPor?: string | null,
  ) => RelatorioManutencaoResumoDto;
  buildHtmlRelatorio: (
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
  ) => string;
  assertEmailConfigIfNeeded: (
    empresa: EmpresaTerceira,
    configuracao: Configuracao | null,
  ) => void;
  sendRelatorioEmail: (
    empresa: EmpresaTerceira,
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
    configuracao: Configuracao | null,
  ) => Promise<{ enviado: boolean }>;
  buildPdfRelatorio: (
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
    configuracao: Configuracao | null,
  ) => Promise<Buffer>;
}

@Injectable()
export class IrregularidadeManutencaoEnvioService {
  private readonly logger = new Logger(IrregularidadeManutencaoEnvioService.name);

  constructor(
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(IrregularidadeOsExterna)
    private readonly osExternaRepository: Repository<IrregularidadeOsExterna>,
    private readonly empresaTerceiraService: EmpresaTerceiraService,
    private readonly brtOsIntegrationService: BrtOsIntegrationService,
    private readonly erpVistoriaIntegrationService: ErpVistoriaIntegrationService,
    private readonly impressaoRawService: ImpressaoRawService,
  ) {}

  usesIntegracaoApi(empresa: EmpresaTerceira): boolean {
    return this.brtOsIntegrationService.usesBrtIntegration(empresa);
  }

  assertEscopoEmpresa(
    empresa: EmpresaTerceira,
    irregularidades: Irregularidade[],
  ): void {
    this.empresaTerceiraService.assertEscopoAtendimento(
      empresa,
      irregularidades,
    );
  }

  /**
   * Empresa BRT: a seleção deve incluir todas as elegíveis **no escopo da empresa**
   * de cada vistoria tocada (OS fora do escopo ficam para outra empresa).
   */
  async assertSelecaoCompletaVistoriasBrt(
    selecionadas: Irregularidade[],
    empresa: EmpresaTerceira,
  ): Promise<void> {
    const porVistoria = this.agruparPorVistoria(selecionadas);
    for (const [idVistoria, grupo] of porVistoria) {
      const candidatas = await this.irregularidadeRepository.find({
        where: {
          idVistoria,
          statusAtual: In(STATUS_ENVIO_MANUTENCAO),
        },
        relations: ['area', 'vistoria', 'vistoria.veiculo'],
      });
      const elegiveis = candidatas.filter((item) =>
        this.empresaTerceiraService.irregularidadeNoEscopo(empresa, item),
      );
      const selecionadosIds = new Set(grupo.map((item) => item.id));
      const faltantes = elegiveis.filter((item) => !selecionadosIds.has(item.id));
      if (faltantes.length > 0 || elegiveis.length !== grupo.length) {
        const numeroVistoria =
          grupo[0]?.vistoria?.numeroVistoria ??
          (await this.resolverNumeroVistoria(idVistoria));
        throw new BadRequestException(
          `A vistoria ${numeroVistoria} tem ${elegiveis.length} irregularidade(s) elegível(is) no escopo de ${empresa.descricao} para envio à BRT; ` +
            `selecione todas (${grupo.length} selecionada(s), faltam ${faltantes.length || elegiveis.length - grupo.length}).`,
        );
      }
    }
  }

  async executarEnvioLote(
    empresa: EmpresaTerceira,
    irregularidades: Irregularidade[],
    configuracao: Configuracao | null,
    ctx: ManutencaoEnvioContext,
  ): Promise<RelatorioManutencaoExecucaoDto> {
    const emitidoEm = new Date();
    const falhas: EnvioManutencaoFalhaItemDto[] = [];
    let enviadasEntidades: Irregularidade[] = [];

    this.empresaTerceiraService.assertEscopoAtendimento(
      empresa,
      irregularidades,
    );

    const usaBrt = this.usesIntegracaoApi(empresa);
    if (usaBrt) {
      await this.assertSelecaoCompletaVistoriasBrt(irregularidades, empresa);
    }

    const erpHabilitado =
      await this.erpVistoriaIntegrationService.isEnvioHabilitado();
    if (erpHabilitado) {
      const erroConfig =
        await this.erpVistoriaIntegrationService.obterErroConfigIncompleta();
      if (erroConfig) {
        throw new BadRequestException(erroConfig);
      }
    }

    const empresaComToken = usaBrt
      ? await this.empresaTerceiraService.findOneForIntegracao(empresa.id)
      : empresa;

    const porVeiculo = this.agruparPorVeiculo(irregularidades);
    const prontosParaTransicao: Irregularidade[] = [];

    for (const [, grupoVeiculo] of porVeiculo) {
      const outcome = await this.prepararGrupoVeiculo(
        empresaComToken,
        grupoVeiculo,
        erpHabilitado,
        usaBrt,
        ctx,
      );
      if (outcome.ok) {
        prontosParaTransicao.push(...outcome.irregularidades);
      } else {
        falhas.push(...outcome.falhas);
      }
    }

    let emailEnviado = false;
    if (prontosParaTransicao.length > 0 && empresa.enviarEmailRelatorio) {
      ctx.assertEmailConfigIfNeeded(empresa, configuracao);
      const mail = await ctx.sendRelatorioEmail(
        empresa,
        ctx.buildResumoRelatorio(
          empresa,
          prontosParaTransicao,
          emitidoEm,
          ctx.actor?.nome,
        ),
        prontosParaTransicao,
        configuracao,
      );
      emailEnviado = mail.enviado;
      // Legado: e-mail obrigatório quando flag+SMTP — antes da transição.
      if (
        !usaBrt &&
        !mail.enviado &&
        configuracao?.emailEnvioConfig?.ativo
      ) {
        throw new BadRequestException(
          'Não foi possível enviar o relatório por e-mail. Nenhuma irregularidade foi encaminhada.',
        );
      }
    }

    if (prontosParaTransicao.length > 0) {
      enviadasEntidades = await this.transicionarParaManutencao(
        prontosParaTransicao,
        empresa.id,
        usaBrt,
        ctx,
      );
    }

    const itensRelatorio =
      enviadasEntidades.length > 0 ? enviadasEntidades : irregularidades;
    const resumo = ctx.buildResumoRelatorio(
      empresa,
      itensRelatorio,
      emitidoEm,
      ctx.actor?.nome,
    );
    const html = ctx.buildHtmlRelatorio(resumo, itensRelatorio);

    let impressaoEnviada: boolean | undefined;
    let impressaoErro: string | undefined;
    if (
      enviadasEntidades.length > 0 &&
      configuracao?.impressaoManutencaoConfig?.ativo
    ) {
      try {
        const pdf = await ctx.buildPdfRelatorio(
          resumo,
          enviadasEntidades,
          configuracao,
        );
        const printResult = await this.impressaoRawService.enviarPdf(
          pdf,
          configuracao.impressaoManutencaoConfig,
        );
        impressaoEnviada = printResult.enviado;
        if (!printResult.enviado) {
          impressaoErro = printResult.erro;
        }
      } catch (error) {
        impressaoEnviada = false;
        impressaoErro =
          error instanceof Error
            ? error.message
            : 'Falha ao gerar/enviar PDF para impressão';
        this.logger.warn(
          `Impressão pós-manutenção falhou (não bloqueia envio): ${impressaoErro}`,
        );
      }
    }

    return {
      resumo,
      html,
      totalEnviadas: enviadasEntidades.length,
      emailEnviado,
      impressaoEnviada,
      impressaoErro,
      falhas: falhas.length > 0 ? falhas : undefined,
    };
  }

  async executarEnvioUnitario(
    irregularidade: Irregularidade,
    idEmpresaManutencao: string,
    configuracao: Configuracao | null,
    ctx: ManutencaoEnvioContext,
  ): Promise<Irregularidade> {
    const empresa =
      await this.empresaTerceiraService.findOneForIntegracao(idEmpresaManutencao);
    if (!empresa.ehEmpresaManutencao) {
      throw new BadRequestException(
        'Empresa selecionada não está habilitada como manutenção',
      );
    }

    const resultado = await this.executarEnvioLote(
      empresa,
      [irregularidade],
      configuracao,
      ctx,
    );
    if (resultado.totalEnviadas === 0) {
      const falha = resultado.falhas?.[0];
      throw new BadRequestException(
        falha?.mensagem ?? 'Falha ao enviar irregularidade para manutenção',
      );
    }
    const atualizada = await this.irregularidadeRepository.findOne({
      where: { id: irregularidade.id },
      relations: [
        'area',
        'componente',
        'sintoma',
        'vista',
        'vistoria',
        'vistoria.veiculo',
        'midias',
      ],
    });
    if (!atualizada) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    return atualizada;
  }

  /**
   * Pipeline por veículo: ERP (se ativo) → BRT por vistoria (se empresa API).
   * Não transiciona status — o lote faz e-mail (legado) e depois a transição.
   * Sucesso/falha atômicos por veículo.
   */
  private async prepararGrupoVeiculo(
    empresa: EmpresaTerceira,
    grupoVeiculo: Irregularidade[],
    erpHabilitado: boolean,
    usaBrt: boolean,
    ctx: ManutencaoEnvioContext,
  ): Promise<
    | { ok: true; irregularidades: Irregularidade[] }
    | { ok: false; falhas: EnvioManutencaoFalhaItemDto[] }
  > {
    if (erpHabilitado) {
      const erp = await this.erpVistoriaIntegrationService.garantirEnvioGrupoVeiculo(
        grupoVeiculo,
      );
      if (!erp.ok) {
        return {
          ok: false,
          falhas: grupoVeiculo.map((item) => ({
            id: item.id,
            numeroIrregularidade: item.numeroIrregularidade,
            codigoErro: 'erp_falha',
            mensagem: erp.erro,
          })),
        };
      }
    }

    if (usaBrt) {
      const porVistoria = [...this.agruparPorVistoria(grupoVeiculo).values()];
      for (const grupoVistoria of porVistoria) {
        const brt = await this.garantirOsBrtGrupo(empresa, grupoVistoria, ctx);
        if (!brt.ok) {
          return { ok: false, falhas: brt.falhas };
        }
      }
    }

    return { ok: true, irregularidades: grupoVeiculo };
  }

  /**
   * Cria OS BRT (ou reaproveita) sem alterar status — transição fica no pipeline.
   */
  private async garantirOsBrtGrupo(
    empresa: EmpresaTerceira,
    irregularidades: Irregularidade[],
    ctx: ManutencaoEnvioContext,
  ): Promise<
    | { ok: true }
    | { ok: false; falhas: EnvioManutencaoFalhaItemDto[] }
  > {
    const grupo = [...irregularidades].sort(
      (a, b) =>
        (a.numeroIrregularidade ?? 0) - (b.numeroIrregularidade ?? 0),
    );

    const nums = new Set(
      grupo
        .map((item) => item.numOsExternoAtual)
        .filter((item): item is number => item != null),
    );
    const origs = new Set(
      grupo
        .map((item) => item.osOrigAtual?.trim())
        .filter((item): item is string => !!item),
    );
    if (
      nums.size === 1 &&
      origs.size === 1 &&
      grupo.every(
        (item) =>
          item.numOsExternoAtual != null && !!item.osOrigAtual?.trim(),
      )
    ) {
      return { ok: true };
    }

    const numeroVistoria = grupo[0]?.vistoria?.numeroVistoria;

    let osOrig: string;
    let payload;
    try {
      if (numeroVistoria === undefined || numeroVistoria === null) {
        throw new Error('Número da vistoria não informado para os_orig');
      }
      const sucessosAnteriores =
        await this.contarSucessosOsOrigVistoria(numeroVistoria);
      const forcarSufixo = grupo.some(
        (item) =>
          item.statusAtual === StatusIrregularidade.RETRABALHO_GARANTIA,
      );
      osOrig = this.brtOsIntegrationService.buildOsOrig(
        numeroVistoria,
        sucessosAnteriores,
        forcarSufixo,
      );
      payload = this.brtOsIntegrationService.buildPayloadGrupo(
        empresa,
        grupo,
        osOrig,
      );
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
      const osOrigFallback = String(numeroVistoria ?? '');
      for (const item of grupo) {
        await this.registrarFalhaIntegracao(
          item,
          osOrigFallback,
          mensagem,
          'validacao_local',
          undefined,
        );
      }
      return {
        ok: false,
        falhas: grupo.map((item) => ({
          id: item.id,
          numeroIrregularidade: item.numeroIrregularidade,
          codigoErro: 'validacao_local',
          mensagem,
        })),
      };
    }

    const result = await this.brtOsIntegrationService.criarOs(empresa, payload);

    if (!result.ok) {
      for (const item of grupo) {
        await this.registrarFalhaIntegracao(
          item,
          osOrig,
          result.mensagem,
          result.codigoErro,
          result.httpStatus,
        );
        await this.osExternaRepository.save(
          this.osExternaRepository.create({
            idIrregularidade: item.id,
            osOrig,
            numOsExterno: null,
            integrador: 'BRT',
            sucesso: false,
            codigoErro: result.codigoErro,
            mensagemErro: result.mensagem,
            httpStatus: result.httpStatus,
          }),
        );
      }
      return {
        ok: false,
        falhas: grupo.map((item) => ({
          id: item.id,
          numeroIrregularidade: item.numeroIrregularidade,
          codigoErro: result.codigoErro,
          mensagem: result.mensagem,
          httpStatus: result.httpStatus,
        })),
      };
    }

    await this.irregularidadeRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Irregularidade);
      const osRepo = manager.getRepository(IrregularidadeOsExterna);

      for (const item of grupo) {
        const entity = await repo.findOne({ where: { id: item.id } });
        if (!entity) {
          throw new NotFoundException('Irregularidade não encontrada');
        }
        entity.osOrigAtual = osOrig;
        entity.numOsExternoAtual = result.numOs;
        entity.ultimoErroIntegracao = null;
        entity.ultimoErroIntegracaoEm = null;
        const savedItem = await repo.save(entity);
        item.osOrigAtual = savedItem.osOrigAtual;
        item.numOsExternoAtual = savedItem.numOsExternoAtual;
        item.ultimoErroIntegracao = null;
        item.ultimoErroIntegracaoEm = null;

        await osRepo.save(
          osRepo.create({
            idIrregularidade: savedItem.id,
            osOrig,
            numOsExterno: result.numOs,
            integrador: 'BRT',
            sucesso: true,
            httpStatus: result.httpStatus,
          }),
        );

        await ctx.registrarHistorico(manager, {
          idIrregularidade: savedItem.id,
          statusOrigem: item.statusAtual,
          statusDestino: item.statusAtual,
          acao: result.duplicada
            ? 'enviar_api_os_duplicada'
            : 'enviar_api_os',
          idUsuario: ctx.actor?.id,
          idEmpresaEvento: empresa.id,
          observacao: `os_orig=${osOrig}; numOs=${result.numOs}; vistoria=${numeroVistoria}; grupo=${grupo.length}; pendente_transicao=true`,
        });
      }
    });

    return { ok: true };
  }

  private async transicionarParaManutencao(
    irregularidades: Irregularidade[],
    idEmpresaManutencao: string,
    controleIntegracaoApi: boolean,
    ctx: ManutencaoEnvioContext,
  ): Promise<Irregularidade[]> {
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      const saved: Irregularidade[] = [];
      const iniciadaEm = new Date();
      for (const irregularidade of irregularidades) {
        const entity = await manager
          .getRepository(Irregularidade)
          .findOne({ where: { id: irregularidade.id } });
        if (!entity) {
          throw new NotFoundException('Irregularidade não encontrada');
        }
        const statusOrigem = entity.statusAtual;
        entity.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
        entity.idEmpresaManutencao = idEmpresaManutencao;
        entity.iniciadaManutencaoEm = iniciadaEm;
        entity.resolvido = false;
        entity.controleIntegracaoApi = controleIntegracaoApi;
        entity.ultimoErroIntegracao = null;
        entity.ultimoErroIntegracaoEm = null;
        const item = await manager.getRepository(Irregularidade).save(entity);
        await ctx.registrarHistorico(manager, {
          idIrregularidade: item.id,
          statusOrigem,
          statusDestino: StatusIrregularidade.EM_MANUTENCAO,
          acao: 'iniciar_manutencao',
          idUsuario: ctx.actor?.id,
          idEmpresaEvento: idEmpresaManutencao,
        });
        // Mantém relações já hidratadas (vistoria/veículo, área, mídias etc.)
        // para o PDF/HTML pós-envio; o save acima retorna entidade sem relations.
        Object.assign(irregularidade, {
          statusAtual: item.statusAtual,
          idEmpresaManutencao: item.idEmpresaManutencao,
          iniciadaManutencaoEm: item.iniciadaManutencaoEm,
          resolvido: item.resolvido,
          controleIntegracaoApi: item.controleIntegracaoApi,
          ultimoErroIntegracao: item.ultimoErroIntegracao,
          ultimoErroIntegracaoEm: item.ultimoErroIntegracaoEm,
          erpCodigoPedido: item.erpCodigoPedido ?? irregularidade.erpCodigoPedido,
          numOsExternoAtual:
            item.numOsExternoAtual ?? irregularidade.numOsExternoAtual,
          osOrigAtual: item.osOrigAtual ?? irregularidade.osOrigAtual,
        });
        saved.push(irregularidade);
      }
      return saved;
    });
  }

  async executarCancelamentoOsBrt(
    irregularidade: Irregularidade,
    motivo: string,
    ctx: ManutencaoEnvioContext,
  ): Promise<Irregularidade> {
    if (!irregularidade.idEmpresaManutencao) {
      throw new BadRequestException(
        'Irregularidade sem empresa de manutenção vinculada',
      );
    }
    if (
      !irregularidade.controleIntegracaoApi ||
      !irregularidade.osOrigAtual?.trim() ||
      irregularidade.numOsExternoAtual == null
    ) {
      throw new BadRequestException(
        'Somente irregularidades com OS ativa na integração BRT podem ser canceladas por esta ação',
      );
    }

    const empresa = await this.empresaTerceiraService.findOneForIntegracao(
      irregularidade.idEmpresaManutencao,
    );
    if (!this.usesIntegracaoApi(empresa)) {
      throw new BadRequestException(
        'Empresa de manutenção não utiliza integração OS BRT',
      );
    }

    const osOrig = irregularidade.osOrigAtual.trim();
    const numOsCancelado = irregularidade.numOsExternoAtual;

    const grupo = await this.irregularidadeRepository.find({
      where: {
        statusAtual: StatusIrregularidade.EM_MANUTENCAO,
        controleIntegracaoApi: true,
        osOrigAtual: osOrig,
        numOsExternoAtual: numOsCancelado,
      },
    });
    if (!grupo.length) {
      throw new BadRequestException(
        'Nenhuma irregularidade ativa encontrada para a OS BRT informada',
      );
    }

    let payload;
    try {
      payload = this.brtOsIntegrationService.buildCancelarPayload(
        empresa,
        osOrig,
        motivo,
      );
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
      throw new BadRequestException(mensagem);
    }

    const result = await this.brtOsIntegrationService.cancelarOs(
      empresa,
      payload,
    );

    if (!result.ok) {
      for (const item of grupo) {
        await this.registrarFalhaIntegracao(
          item,
          osOrig,
          result.mensagem,
          result.codigoErro,
          result.httpStatus,
        );
        await this.osExternaRepository.save(
          this.osExternaRepository.create({
            idIrregularidade: item.id,
            osOrig,
            numOsExterno: numOsCancelado,
            integrador: 'BRT',
            sucesso: false,
            codigoErro: result.codigoErro,
            mensagemErro: result.mensagem,
            httpStatus: result.httpStatus,
          }),
        );
      }
      throw new BadRequestException(result.mensagem);
    }

    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Irregularidade);
      let representante: Irregularidade | null = null;

      for (const item of grupo) {
        const entity = await repo.findOne({ where: { id: item.id } });
        if (!entity) {
          continue;
        }
        const statusOrigem = entity.statusAtual;
        entity.statusAtual = StatusIrregularidade.REGISTRADA;
        entity.controleIntegracaoApi = false;
        entity.osOrigAtual = null;
        entity.numOsExternoAtual = null;
        entity.ultimoErroIntegracao = null;
        entity.ultimoErroIntegracaoEm = null;
        this.erpVistoriaIntegrationService.limparVinculoErp(entity);
        entity.resolvido = false;
        const persisted = await repo.save(entity);
        if (persisted.id === irregularidade.id) {
          representante = persisted;
        }

        await ctx.registrarHistorico(manager, {
          idIrregularidade: persisted.id,
          statusOrigem,
          statusDestino: StatusIrregularidade.REGISTRADA,
          acao: 'cancelar_api_os',
          idUsuario: ctx.actor?.id,
          idEmpresaEvento: empresa.id,
          observacao: `os_orig=${osOrig}; numOs=${numOsCancelado}; motivo=${motivo.trim()}; grupo=${grupo.length}`,
        });
      }

      if (!representante) {
        throw new NotFoundException('Irregularidade não encontrada');
      }
      return representante;
    });
  }

  private agruparPorVeiculo(
    irregularidades: Irregularidade[],
  ): Map<string, Irregularidade[]> {
    const map = new Map<string, Irregularidade[]>();
    for (const item of irregularidades) {
      const key = item.vistoria?.idVeiculo ?? item.vistoria?.veiculo?.id;
      if (!key) {
        throw new BadRequestException(
          'Irregularidade sem veículo vinculado não pode ser enviada ao ERP/manutenção',
        );
      }
      const lista = map.get(key) ?? [];
      lista.push(item);
      map.set(key, lista);
    }
    return map;
  }

  private agruparPorVistoria(
    irregularidades: Irregularidade[],
  ): Map<string, Irregularidade[]> {
    const map = new Map<string, Irregularidade[]>();
    for (const item of irregularidades) {
      const key = item.idVistoria;
      if (!key) {
        throw new BadRequestException(
          'Irregularidade sem vistoria vinculada não pode ser enviada à BRT',
        );
      }
      const lista = map.get(key) ?? [];
      lista.push(item);
      map.set(key, lista);
    }
    return map;
  }

  private async resolverNumeroVistoria(idVistoria: string): Promise<string> {
    const row = await this.irregularidadeRepository.manager
      .getRepository(Irregularidade)
      .createQueryBuilder('i')
      .innerJoin('i.vistoria', 'v')
      .select('v.numeroVistoria', 'numero')
      .where('i.idVistoria = :idVistoria', { idVistoria })
      .limit(1)
      .getRawOne<{ numero?: number }>();
    return row?.numero != null ? String(row.numero) : idVistoria.slice(0, 8);
  }

  private async contarSucessosOsOrigVistoria(
    numeroVistoria: number,
  ): Promise<number> {
    const base = String(numeroVistoria);
    const raw = await this.osExternaRepository
      .createQueryBuilder('e')
      .select('COUNT(DISTINCT e.osOrig)', 'cnt')
      .where('e.sucesso = true')
      .andWhere('e.codigoErro IS NULL')
      .andWhere('e.integrador = :integrador', { integrador: 'BRT' })
      .andWhere('(e.osOrig = :base OR e.osOrig LIKE :prefix)', {
        base,
        prefix: `${base}-%`,
      })
      .getRawOne<{ cnt?: string }>();
    return Number(raw?.cnt ?? 0);
  }

  private async registrarFalhaIntegracao(
    irregularidade: Irregularidade,
    osOrig: string,
    mensagem: string,
    codigoErro: string,
    httpStatus?: number,
  ): Promise<void> {
    irregularidade.ultimoErroIntegracao = mensagem;
    irregularidade.ultimoErroIntegracaoEm = new Date();
    await this.irregularidadeRepository.save(irregularidade);
    const mensagemLog =
      mensagem.length > 500 ? `${mensagem.slice(0, 500)}…` : mensagem;
    this.logger.warn(
      `Falha integração OS irregularidade=${irregularidade.id} numero=${irregularidade.numeroIrregularidade} os_orig=${osOrig} codigo=${codigoErro} http=${httpStatus ?? 'n/a'} mensagem=${mensagemLog}`,
    );
  }
}
