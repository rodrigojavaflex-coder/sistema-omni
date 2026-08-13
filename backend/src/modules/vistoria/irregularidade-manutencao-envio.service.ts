import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { EmpresaTerceiraService } from '../empresa-terceira/empresa-terceira.service';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Configuracao } from '../configuracao/entities/configuracao.entity';
import { BrtOsIntegrationService } from './brt-os-integration.service';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';
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
      const empresaComToken =
        await this.empresaTerceiraService.findOneForIntegracao(empresa.id);

      for (const irregularidade of irregularidades) {
        const outcome = await this.tentarEnvioBrt(
          empresaComToken,
          irregularidade,
          ctx,
        );
        if (outcome.ok) {
          enviadasEntidades.push(outcome.irregularidade);
        } else {
          falhas.push(outcome.falha);
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
      const outcome = await this.tentarEnvioBrt(
        empresa,
        irregularidade,
        ctx,
      );
      if (!outcome.ok) {
        throw new BadRequestException(outcome.falha.mensagem);
      }
      return outcome.irregularidade;
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

  private async tentarEnvioBrt(
    empresa: EmpresaTerceira,
    irregularidade: Irregularidade,
    ctx: ManutencaoEnvioContext,
  ): Promise<
    | { ok: true; irregularidade: Irregularidade }
    | { ok: false; falha: EnvioManutencaoFalhaItemDto }
  > {
    const statusOrigem = irregularidade.statusAtual;
    let osOrig: string;
    let payload;
    try {
      const integracoesSucessoAnteriores =
        await this.osExternaRepository.count({
          where: {
            idIrregularidade: irregularidade.id,
            sucesso: true,
            codigoErro: IsNull(),
          },
        });
      osOrig = this.brtOsIntegrationService.buildOsOrig(
        irregularidade,
        integracoesSucessoAnteriores,
      );
      payload = this.brtOsIntegrationService.buildPayload(
        empresa,
        irregularidade,
        osOrig,
      );
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : String(err);
      const osOrigFallback = String(irregularidade.numeroIrregularidade ?? '');
      await this.registrarFalhaIntegracao(
        irregularidade,
        osOrigFallback,
        mensagem,
        'validacao_local',
        undefined,
      );
      return {
        ok: false,
        falha: {
          id: irregularidade.id,
          numeroIrregularidade: irregularidade.numeroIrregularidade,
          codigoErro: 'validacao_local',
          mensagem,
        },
      };
    }

    const result = await this.brtOsIntegrationService.criarOs(empresa, payload);

    if (!result.ok) {
      await this.registrarFalhaIntegracao(
        irregularidade,
        osOrig,
        result.mensagem,
        result.codigoErro,
        result.httpStatus,
      );
      await this.osExternaRepository.save(
        this.osExternaRepository.create({
          idIrregularidade: irregularidade.id,
          osOrig,
          numOsExterno: null,
          integrador: 'BRT',
          sucesso: false,
          codigoErro: result.codigoErro,
          mensagemErro: result.mensagem,
          httpStatus: result.httpStatus,
        }),
      );
      return {
        ok: false,
        falha: {
          id: irregularidade.id,
          numeroIrregularidade: irregularidade.numeroIrregularidade,
          codigoErro: result.codigoErro,
          mensagem: result.mensagem,
          httpStatus: result.httpStatus,
        },
      };
    }

    const saved = await this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        const repo = manager.getRepository(Irregularidade);
        const item = await repo.findOne({ where: { id: irregularidade.id } });
        if (!item) {
          throw new NotFoundException('Irregularidade não encontrada');
        }
        item.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
        item.idEmpresaManutencao = empresa.id;
        item.iniciadaManutencaoEm = new Date();
        item.resolvido = false;
        item.controleIntegracaoApi = true;
        item.osOrigAtual = osOrig;
        item.numOsExternoAtual = result.numOs;
        item.ultimoErroIntegracao = null;
        item.ultimoErroIntegracaoEm = null;
        const persisted = await repo.save(item);

        await manager.getRepository(IrregularidadeOsExterna).save(
          manager.getRepository(IrregularidadeOsExterna).create({
            idIrregularidade: item.id,
            osOrig,
            numOsExterno: result.numOs,
            integrador: 'BRT',
            sucesso: true,
            httpStatus: result.httpStatus,
          }),
        );

        await ctx.registrarHistorico(manager, {
          idIrregularidade: item.id,
          statusOrigem,
          statusDestino: StatusIrregularidade.EM_MANUTENCAO,
          acao: result.duplicada ? 'enviar_api_os_duplicada' : 'enviar_api_os',
          idUsuario: ctx.actor?.id,
          idEmpresaEvento: empresa.id,
          observacao: `os_orig=${osOrig}; numOs=${result.numOs}`,
        });
        await ctx.registrarHistorico(manager, {
          idIrregularidade: item.id,
          statusOrigem: StatusIrregularidade.EM_MANUTENCAO,
          statusDestino: StatusIrregularidade.EM_MANUTENCAO,
          acao: 'iniciar_manutencao',
          idUsuario: ctx.actor?.id,
          idEmpresaEvento: empresa.id,
        });
        return persisted;
      },
    );

    return { ok: true, irregularidade: saved };
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
      await this.registrarFalhaIntegracao(
        irregularidade,
        osOrig,
        result.mensagem,
        result.codigoErro,
        result.httpStatus,
      );
      await this.osExternaRepository.save(
        this.osExternaRepository.create({
          idIrregularidade: irregularidade.id,
          osOrig,
          numOsExterno: numOsCancelado,
          integrador: 'BRT',
          sucesso: false,
          codigoErro: result.codigoErro,
          mensagemErro: result.mensagem,
          httpStatus: result.httpStatus,
        }),
      );
      throw new BadRequestException(result.mensagem);
    }

    const statusOrigem = irregularidade.statusAtual;
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Irregularidade);
      const item = await repo.findOne({ where: { id: irregularidade.id } });
      if (!item) {
        throw new NotFoundException('Irregularidade não encontrada');
      }

      item.statusAtual = StatusIrregularidade.REGISTRADA;
      item.controleIntegracaoApi = false;
      item.osOrigAtual = null;
      item.numOsExternoAtual = null;
      item.ultimoErroIntegracao = null;
      item.ultimoErroIntegracaoEm = null;
      item.resolvido = false;
      const persisted = await repo.save(item);

      await ctx.registrarHistorico(manager, {
        idIrregularidade: item.id,
        statusOrigem,
        statusDestino: StatusIrregularidade.REGISTRADA,
        acao: 'cancelar_api_os',
        idUsuario: ctx.actor?.id,
        idEmpresaEvento: empresa.id,
        observacao: `os_orig=${osOrig}; numOs=${numOsCancelado}; motivo=${motivo.trim()}`,
      });

      return persisted;
    });
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
