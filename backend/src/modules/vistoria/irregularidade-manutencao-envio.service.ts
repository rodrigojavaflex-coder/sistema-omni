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
  ) {}

  usesIntegracaoApi(empresa: EmpresaTerceira): boolean {
    return this.brtOsIntegrationService.usesBrtIntegration(empresa);
  }

  /**
   * Empresa BRT: a seleção deve incluir todas as elegíveis de cada vistoria tocada.
   */
  async assertSelecaoCompletaVistoriasBrt(
    selecionadas: Irregularidade[],
  ): Promise<void> {
    const porVistoria = this.agruparPorVistoria(selecionadas);
    for (const [idVistoria, grupo] of porVistoria) {
      const elegiveis = await this.irregularidadeRepository.find({
        where: {
          idVistoria,
          statusAtual: In(STATUS_ENVIO_MANUTENCAO),
        },
        select: ['id', 'numeroIrregularidade'],
      });
      const selecionadosIds = new Set(grupo.map((item) => item.id));
      const faltantes = elegiveis.filter((item) => !selecionadosIds.has(item.id));
      if (faltantes.length > 0 || elegiveis.length !== grupo.length) {
        const numeroVistoria =
          grupo[0]?.vistoria?.numeroVistoria ??
          (await this.resolverNumeroVistoria(idVistoria));
        throw new BadRequestException(
          `A vistoria ${numeroVistoria} tem ${elegiveis.length} irregularidade(s) elegível(is) para envio à BRT; ` +
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

    if (this.usesIntegracaoApi(empresa)) {
      await this.assertSelecaoCompletaVistoriasBrt(irregularidades);
      const empresaComToken =
        await this.empresaTerceiraService.findOneForIntegracao(empresa.id);

      const grupos = [...this.agruparPorVistoria(irregularidades).values()];
      for (const grupo of grupos) {
        const outcome = await this.tentarEnvioBrtGrupo(
          empresaComToken,
          grupo,
          ctx,
        );
        if (outcome.ok) {
          enviadasEntidades.push(...outcome.irregularidades);
        } else {
          falhas.push(...outcome.falhas);
        }
      }

      let emailEnviado = false;
      if (enviadasEntidades.length > 0 && empresa.enviarEmailRelatorio) {
        ctx.assertEmailConfigIfNeeded(empresa, configuracao);
        const mail = await ctx.sendRelatorioEmail(
          empresa,
          ctx.buildResumoRelatorio(
            empresa,
            enviadasEntidades,
            emitidoEm,
            ctx.actor?.nome,
          ),
          enviadasEntidades,
          configuracao,
        );
        emailEnviado = mail.enviado;
      }

      const resumo = ctx.buildResumoRelatorio(
        empresa,
        enviadasEntidades.length > 0 ? enviadasEntidades : irregularidades,
        emitidoEm,
        ctx.actor?.nome,
      );
      const html = ctx.buildHtmlRelatorio(
        resumo,
        enviadasEntidades.length > 0 ? enviadasEntidades : irregularidades,
      );

      return {
        resumo,
        html,
        totalEnviadas: enviadasEntidades.length,
        emailEnviado,
        falhas: falhas.length > 0 ? falhas : undefined,
      };
    }

    if (empresa.enviarEmailRelatorio) {
      ctx.assertEmailConfigIfNeeded(empresa, configuracao);
      const resumoPre = ctx.buildResumoRelatorio(
        empresa,
        irregularidades,
        emitidoEm,
        ctx.actor?.nome,
      );
      const mail = await ctx.sendRelatorioEmail(
        empresa,
        resumoPre,
        irregularidades,
        configuracao,
      );
      if (!mail.enviado && configuracao?.emailEnvioConfig?.ativo) {
        throw new BadRequestException(
          'Não foi possível enviar o relatório por e-mail. Nenhuma irregularidade foi encaminhada.',
        );
      }
    }

    enviadasEntidades = await this.transicionarLegado(
      irregularidades,
      empresa.id,
      ctx,
    );

    const resumo = ctx.buildResumoRelatorio(
      empresa,
      enviadasEntidades,
      emitidoEm,
      ctx.actor?.nome,
    );
    const html = ctx.buildHtmlRelatorio(resumo, enviadasEntidades);

    return {
      resumo,
      html,
      totalEnviadas: enviadasEntidades.length,
      emailEnviado: empresa.enviarEmailRelatorio,
      falhas: undefined,
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

    if (this.usesIntegracaoApi(empresa)) {
      await this.assertSelecaoCompletaVistoriasBrt([irregularidade]);
      const outcome = await this.tentarEnvioBrtGrupo(
        empresa,
        [irregularidade],
        ctx,
      );
      if (!outcome.ok) {
        throw new BadRequestException(outcome.falhas[0]?.mensagem ?? 'Falha na integração BRT');
      }
      return outcome.irregularidades[0];
    }

    if (empresa.enviarEmailRelatorio) {
      ctx.assertEmailConfigIfNeeded(empresa, configuracao);
      const emitidoEm = new Date();
      const resumo = ctx.buildResumoRelatorio(
        empresa,
        [irregularidade],
        emitidoEm,
        ctx.actor?.nome,
      );
      await ctx.sendRelatorioEmail(
        empresa,
        resumo,
        [irregularidade],
        configuracao,
      );
    }

    const [saved] = await this.transicionarLegado(
      [irregularidade],
      idEmpresaManutencao,
      ctx,
    );
    return saved;
  }

  private async tentarEnvioBrtGrupo(
    empresa: EmpresaTerceira,
    irregularidades: Irregularidade[],
    ctx: ManutencaoEnvioContext,
  ): Promise<
    | { ok: true; irregularidades: Irregularidade[] }
    | { ok: false; falhas: EnvioManutencaoFalhaItemDto[] }
  > {
    const grupo = [...irregularidades].sort(
      (a, b) =>
        (a.numeroIrregularidade ?? 0) - (b.numeroIrregularidade ?? 0),
    );
    const numeroVistoria = grupo[0]?.vistoria?.numeroVistoria;
    const statusPorId = new Map(
      grupo.map((item) => [item.id, item.statusAtual] as const),
    );

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

    const saved = await this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        const repo = manager.getRepository(Irregularidade);
        const osRepo = manager.getRepository(IrregularidadeOsExterna);
        const persisted: Irregularidade[] = [];
        const iniciadaEm = new Date();

        for (const item of grupo) {
          const entity = await repo.findOne({ where: { id: item.id } });
          if (!entity) {
            throw new NotFoundException('Irregularidade não encontrada');
          }
          const statusOrigem =
            statusPorId.get(item.id) ?? entity.statusAtual;
          entity.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
          entity.idEmpresaManutencao = empresa.id;
          entity.iniciadaManutencaoEm = iniciadaEm;
          entity.resolvido = false;
          entity.controleIntegracaoApi = true;
          entity.osOrigAtual = osOrig;
          entity.numOsExternoAtual = result.numOs;
          entity.ultimoErroIntegracao = null;
          entity.ultimoErroIntegracaoEm = null;
          const savedItem = await repo.save(entity);
          persisted.push(savedItem);

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
            statusOrigem,
            statusDestino: StatusIrregularidade.EM_MANUTENCAO,
            acao: result.duplicada
              ? 'enviar_api_os_duplicada'
              : 'enviar_api_os',
            idUsuario: ctx.actor?.id,
            idEmpresaEvento: empresa.id,
            observacao: `os_orig=${osOrig}; numOs=${result.numOs}; vistoria=${numeroVistoria}; grupo=${grupo.length}`,
          });
          await ctx.registrarHistorico(manager, {
            idIrregularidade: savedItem.id,
            statusOrigem: StatusIrregularidade.EM_MANUTENCAO,
            statusDestino: StatusIrregularidade.EM_MANUTENCAO,
            acao: 'iniciar_manutencao',
            idUsuario: ctx.actor?.id,
            idEmpresaEvento: empresa.id,
          });
        }
        return persisted;
      },
    );

    return { ok: true, irregularidades: saved };
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

  /**
   * Quantidade de ciclos de OS com sucesso já registrados para a base numeroVistoria
   * (inclui legado 1:1 quando os_orig coincidia com o número da vistoria).
   */
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

  private async transicionarLegado(
    irregularidades: Irregularidade[],
    idEmpresaManutencao: string,
    ctx: ManutencaoEnvioContext,
  ): Promise<Irregularidade[]> {
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      const saved: Irregularidade[] = [];
      for (const irregularidade of irregularidades) {
        const statusOrigem = irregularidade.statusAtual;
        irregularidade.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
        irregularidade.idEmpresaManutencao = idEmpresaManutencao;
        irregularidade.iniciadaManutencaoEm = new Date();
        irregularidade.resolvido = false;
        irregularidade.controleIntegracaoApi = false;
        irregularidade.ultimoErroIntegracao = null;
        irregularidade.ultimoErroIntegracaoEm = null;
        const item = await manager.getRepository(Irregularidade).save(irregularidade);
        await ctx.registrarHistorico(manager, {
          idIrregularidade: item.id,
          statusOrigem,
          statusDestino: StatusIrregularidade.EM_MANUTENCAO,
          acao: 'iniciar_manutencao',
          idUsuario: ctx.actor?.id,
          idEmpresaEvento: idEmpresaManutencao,
        });
        saved.push(item);
      }
      return saved;
    });
  }
}
