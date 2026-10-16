import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { IntegracaoManutencaoEmpresa } from '../../common/enums/integracao-manutencao-empresa.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import {
  ErpBuscaInfoModoConclusao,
  ErpVistoriaConfig,
} from '../configuracao/entities/configuracao.entity';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';
import { Irregularidade } from './entities/irregularidade.entity';
import {
  ErpResultadoConsulta,
  ErpVistoriaIntegrationService,
} from './erp-vistoria-integration.service';

type GrupoPedidoErp = {
  codigoPedido: string;
  itens: Irregularidade[];
};

export type ErpBuscaStatusLoteResultado = {
  consultadas: number;
  concluidas: number;
  validadas: number;
  falhas: Array<{ codigoPedido: string; mensagem: string }>;
  mensagem: string;
};

@Injectable()
export class ErpOsPollService {
  private readonly logger = new Logger(ErpOsPollService.name);
  private emExecucao = false;

  constructor(
    private readonly erpVistoriaIntegrationService: ErpVistoriaIntegrationService,
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(EmpresaTerceira)
    private readonly empresaRepository: Repository<EmpresaTerceira>,
  ) {}

  /**
   * Disparo manual (Manutenção): exige busca ativa na config.
   * Não respeita intervalo — só credenciais + empresas NENHUMA da allowlist.
   */
  async processarPorIrregularidadeIds(
    ids: string[],
  ): Promise<ErpBuscaStatusLoteResultado> {
    const config =
      await this.erpVistoriaIntegrationService.carregarConfigPublica();
    if (!config?.buscaInfoAtivo) {
      throw new BadRequestException(
        'Busca de informações ERP está desativada na Configuração',
      );
    }

    const idsUnicos = [...new Set(ids.filter(Boolean))];
    if (!idsUnicos.length) {
      throw new BadRequestException('Selecione ao menos uma irregularidade');
    }

    const empresaIdsElegiveis = await this.resolverEmpresaIdsElegiveis(config);
    if (!empresaIdsElegiveis.length) {
      throw new BadRequestException(
        'Nenhuma empresa NENHUMA configurada para a busca ERP',
      );
    }

    const itens = await this.irregularidadeRepository.find({
      where: {
        id: In(idsUnicos),
        statusAtual: StatusIrregularidade.EM_MANUTENCAO,
        erpCodigoPedido: Not(IsNull()),
        idEmpresaManutencao: In(empresaIdsElegiveis),
      },
    });
    if (!itens.length) {
      throw new BadRequestException(
        'Nenhuma irregularidade selecionada possui pedido ERP ativo em manutenção (empresa NENHUMA na busca)',
      );
    }

    return this.processarGrupos(
      this.agruparPorPedido(itens),
      this.resolverModo(config),
    );
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async tickPoll(): Promise<void> {
    if (this.emExecucao) {
      this.logger.debug(
        'ERP poll: tick ignorado (execução anterior em andamento)',
      );
      return;
    }
    this.emExecucao = true;
    try {
      const config =
        await this.erpVistoriaIntegrationService.carregarConfigPublica();
      if (!config?.buscaInfoAtivo) {
        return;
      }
      if (!this.intervaloVencido(config, Date.now())) {
        return;
      }
      try {
        const empresaIds = await this.resolverEmpresaIdsElegiveis(config);
        if (!empresaIds.length) {
          this.logger.debug(
            'ERP poll: busca ativa sem empresas NENHUMA elegíveis',
          );
          return;
        }
        const candidatas = await this.irregularidadeRepository.find({
          where: {
            statusAtual: StatusIrregularidade.EM_MANUTENCAO,
            erpCodigoPedido: Not(IsNull()),
            idEmpresaManutencao: In(empresaIds),
          },
        });
        if (!candidatas.length) {
          this.logger.debug(
            'ERP poll: nenhuma OS em manutenção com pedido ERP',
          );
          return;
        }
        const grupos = this.agruparPorPedido(candidatas);
        this.logger.log(`ERP poll: ${grupos.length} pedido(s) para consultar`);
        await this.processarGrupos(grupos, this.resolverModo(config));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.warn(`ERP poll falhou: ${msg}`);
      } finally {
        await this.erpVistoriaIntegrationService.marcarUltimoPollBuscaInfo(
          new Date(),
        );
      }
    } finally {
      this.emExecucao = false;
    }
  }

  private async processarGrupos(
    grupos: GrupoPedidoErp[],
    modo: ErpBuscaInfoModoConclusao,
  ): Promise<ErpBuscaStatusLoteResultado> {
    let consultadas = 0;
    let concluidas = 0;
    let validadas = 0;
    const falhas: Array<{ codigoPedido: string; mensagem: string }> = [];

    for (const grupo of grupos) {
      const consulta =
        await this.erpVistoriaIntegrationService.consultarResultado(
          grupo.codigoPedido,
        );
      if (!consulta.ok) {
        falhas.push({
          codigoPedido: grupo.codigoPedido,
          mensagem: consulta.mensagem,
        });
        await this.registrarErroConsulta(grupo, consulta.mensagem);
        continue;
      }
      consultadas += 1;
      await this.sincronizarEAplicar(grupo, consulta.data, modo);

      if (consulta.data.concluida) {
        const atualizados = await this.irregularidadeRepository.find({
          where: { id: In(grupo.itens.map((i) => i.id)) },
        });
        for (const atual of atualizados) {
          if (atual.statusAtual === StatusIrregularidade.CONCLUIDA) {
            concluidas += 1;
          }
          if (atual.statusAtual === StatusIrregularidade.VALIDADA) {
            validadas += 1;
          }
        }
      }
    }

    const mensagem = [
      `${consultadas} pedido(s) consultado(s)`,
      concluidas ? `${concluidas} → Validação` : null,
      validadas ? `${validadas} → Validada` : null,
      falhas.length ? `${falhas.length} falha(s)` : null,
    ]
      .filter(Boolean)
      .join('; ');

    return { consultadas, concluidas, validadas, falhas, mensagem };
  }

  private async sincronizarEAplicar(
    grupo: GrupoPedidoErp,
    data: ErpResultadoConsulta,
    modo: ErpBuscaInfoModoConclusao,
  ): Promise<void> {
    if (!data.concluida) {
      await this.irregularidadeRepository.update(
        { id: In(grupo.itens.map((i) => i.id)) },
        {
          erpUltimoErro: null,
        },
      );
      return;
    }

    await this.aplicarConclusao(grupo, data, modo);
  }

  private async aplicarConclusao(
    grupo: GrupoPedidoErp,
    data: ErpResultadoConsulta,
    modo: ErpBuscaInfoModoConclusao,
  ): Promise<void> {
    const resumoServicos = this.montarResumoServicos(data);
    const observacaoBase = [
      `retorno ERP concluida=true`,
      `codigo_pedido=${data.codigo_pedido}`,
      data.data_conclusao ? `data_conclusao=${data.data_conclusao}` : null,
      resumoServicos ? `servicos=${resumoServicos}` : null,
    ]
      .filter(Boolean)
      .join('; ');

    await this.irregularidadeRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Irregularidade);
      const histRepo = manager.getRepository(IrregularidadeHistorico);
      const agora = new Date();

      for (const item of grupo.itens) {
        const entity = await repo.findOne({ where: { id: item.id } });
        if (
          !entity ||
          entity.statusAtual !== StatusIrregularidade.EM_MANUTENCAO
        ) {
          continue;
        }

        entity.statusAtual = StatusIrregularidade.CONCLUIDA;
        entity.concluidaManutencaoEm = agora;
        entity.resolvido = false;
        entity.erpUltimoErro = null;
        await repo.save(entity);
        await histRepo.save(
          histRepo.create({
            idIrregularidade: entity.id,
            statusOrigem: StatusIrregularidade.EM_MANUTENCAO,
            statusDestino: StatusIrregularidade.CONCLUIDA,
            acao: 'concluir_manutencao_integracao_erp',
            idEmpresaEvento: entity.idEmpresaManutencao ?? undefined,
            dataEvento: agora,
            observacao: observacaoBase,
          }),
        );

        if (modo === 'CONCLUIR_E_VALIDAR') {
          entity.statusAtual = StatusIrregularidade.VALIDADA;
          entity.validadaEm = agora;
          entity.resolvido = true;
          await repo.save(entity);
          await histRepo.save(
            histRepo.create({
              idIrregularidade: entity.id,
              statusOrigem: StatusIrregularidade.CONCLUIDA,
              statusDestino: StatusIrregularidade.VALIDADA,
              acao: 'validar_final_integracao_erp',
              idEmpresaEvento: entity.idEmpresaManutencao ?? undefined,
              dataEvento: agora,
              observacao: `auto-validação ERP; ${observacaoBase}`,
            }),
          );
        }
      }
    });

    this.logger.log(
      `ERP poll concluída codigo=${grupo.codigoPedido} itens=${grupo.itens.length} modo=${modo}`,
    );
  }

  private montarResumoServicos(data: ErpResultadoConsulta): string {
    const lista = data.servicos_executados ?? [];
    if (!lista.length) {
      return '';
    }
    return lista
      .slice(0, 8)
      .map((s) => {
        const desc = (s.descricao ?? '').trim() || '(sem descrição)';
        const sistema = (s.sistema ?? '').trim();
        return sistema ? `${desc} (${sistema})` : desc;
      })
      .join(' | ');
  }

  private async registrarErroConsulta(
    grupo: GrupoPedidoErp,
    mensagem: string,
  ): Promise<void> {
    const ids = grupo.itens.map((i) => i.id);
    if (!ids.length) {
      return;
    }
    await this.irregularidadeRepository.update(
      { id: In(ids) },
      {
        erpUltimoErro: mensagem.slice(0, 2000),
      },
    );
  }

  private agruparPorPedido(itens: Irregularidade[]): GrupoPedidoErp[] {
    const map = new Map<string, GrupoPedidoErp>();
    for (const item of itens) {
      const codigo = item.erpCodigoPedido?.trim();
      if (!codigo) {
        continue;
      }
      const existente = map.get(codigo);
      if (existente) {
        existente.itens.push(item);
      } else {
        map.set(codigo, { codigoPedido: codigo, itens: [item] });
      }
    }
    return [...map.values()];
  }

  /**
   * Allowlist da config ∩ empresas manutenção com integração NENHUMA.
   */
  private async resolverEmpresaIdsElegiveis(
    config: ErpVistoriaConfig,
  ): Promise<string[]> {
    const idsConfig = [
      ...new Set(
        (config.buscaInfoEmpresaIds ?? [])
          .map((id) => String(id ?? '').trim())
          .filter(Boolean),
      ),
    ];
    if (!idsConfig.length) {
      return [];
    }
    const empresas = await this.empresaRepository.find({
      where: {
        id: In(idsConfig),
        ehEmpresaManutencao: true,
        integracaoManutencao: IntegracaoManutencaoEmpresa.NENHUMA,
      },
      select: ['id'],
    });
    return empresas.map((e) => e.id);
  }

  private resolverModo(config: ErpVistoriaConfig): ErpBuscaInfoModoConclusao {
    return config.buscaInfoModoConclusao === 'CONCLUIR_E_VALIDAR'
      ? 'CONCLUIR_E_VALIDAR'
      : 'SOMENTE_CONCLUIR';
  }

  private intervaloVencido(
    config: ErpVistoriaConfig,
    agoraMs: number,
  ): boolean {
    const minutos = Math.max(
      1,
      Math.min(1440, Number(config.buscaInfoIntervaloMinutos ?? 10) || 10),
    );
    const ultimo = config.buscaInfoUltimoPollEm;
    if (!ultimo) {
      return true;
    }
    const decorridoMs = agoraMs - new Date(ultimo).getTime();
    return decorridoMs >= minutos * 60_000;
  }
}
