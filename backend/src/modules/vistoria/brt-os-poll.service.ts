import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { EmpresaTerceiraService } from '../empresa-terceira/empresa-terceira.service';
import {
  BrtOsIntegrationService,
  BrtOsRegistroItem,
  normalizarSituacaoBrt,
  resolverGatilhoSituacaoBrt,
} from './brt-os-integration.service';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';
import { Irregularidade } from './entities/irregularidade.entity';
import { OsExternaInsumo } from './entities/os-externa-insumo.entity';
import { OsExternaStatusEvento } from './entities/os-externa-status-evento.entity';
import { ErpVistoriaIntegrationService } from './erp-vistoria-integration.service';

type GrupoOsAtiva = {
  numOs: number;
  osOrig: string;
  itens: Irregularidade[];
};

export type BrtBuscaStatusLoteResultado = {
  consultadas: number;
  concluidas: number;
  canceladas: number;
  falhas: Array<{ numOs: number; mensagem: string }>;
  mensagem: string;
};

export type BrtInsumoDto = {
  id: string;
  numOsExterno: number;
  osOrig?: string | null;
  nomeInsumo: string;
  quantidade?: number | null;
  valor?: number | null;
  descricao?: string | null;
  dataAlteracaoBrt?: string | null;
  sincronizadoEm: string;
};

@Injectable()
export class BrtOsPollService {
  private readonly logger = new Logger(BrtOsPollService.name);
  private emExecucao = false;

  constructor(
    private readonly empresaTerceiraService: EmpresaTerceiraService,
    private readonly brtOsIntegrationService: BrtOsIntegrationService,
    private readonly erpVistoriaIntegrationService: ErpVistoriaIntegrationService,
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(OsExternaStatusEvento)
    private readonly statusEventoRepository: Repository<OsExternaStatusEvento>,
    @InjectRepository(OsExternaInsumo)
    private readonly insumoRepository: Repository<OsExternaInsumo>,
  ) {}

  /**
   * Disparo manual (teste/operacional) para irregularidades selecionadas.
   * Não exige `brtBuscaInfoAtivo` nem respeita intervalo — só credenciais BRT da empresa.
   */
  async processarPorIrregularidadeIds(
    ids: string[],
  ): Promise<BrtBuscaStatusLoteResultado> {
    const idsUnicos = [...new Set(ids.filter(Boolean))];
    if (!idsUnicos.length) {
      throw new BadRequestException('Selecione ao menos uma irregularidade');
    }

    const itens = await this.irregularidadeRepository.find({
      where: {
        id: In(idsUnicos),
        statusAtual: StatusIrregularidade.EM_MANUTENCAO,
        controleIntegracaoApi: true,
        numOsExternoAtual: Not(IsNull()),
        osOrigAtual: Not(IsNull()),
      },
    });
    if (!itens.length) {
      throw new BadRequestException(
        'Nenhuma irregularidade selecionada possui OS BRT ativa em manutenção',
      );
    }

    const porEmpresa = new Map<string, Irregularidade[]>();
    for (const item of itens) {
      const empresaId = item.idEmpresaManutencao;
      if (!empresaId) {
        continue;
      }
      const lista = porEmpresa.get(empresaId) ?? [];
      lista.push(item);
      porEmpresa.set(empresaId, lista);
    }

    let consultadas = 0;
    let concluidas = 0;
    let canceladas = 0;
    const falhas: Array<{ numOs: number; mensagem: string }> = [];

    for (const [empresaId, lista] of porEmpresa) {
      const empresa =
        await this.empresaTerceiraService.findOneForIntegracao(empresaId);
      if (!this.brtOsIntegrationService.usesBrtIntegration(empresa)) {
        for (const g of this.agruparPorOs(lista)) {
          falhas.push({
            numOs: g.numOs,
            mensagem: 'Empresa sem integração BRT configurada',
          });
        }
        continue;
      }

      const grupos = this.agruparPorOs(lista);
      for (const grupo of grupos) {
        const antesStatus = new Map(
          grupo.itens.map((i) => [i.id, i.statusAtual] as const),
        );
        const consulta = await this.brtOsIntegrationService.consultarRegistro(
          empresa,
          grupo.numOs,
        );
        if (!consulta.ok) {
          falhas.push({ numOs: grupo.numOs, mensagem: consulta.mensagem });
          await this.registrarErroConsultaBrt(grupo, consulta.mensagem);
          continue;
        }
        consultadas += 1;
        await this.sincronizarEAplicar(empresa, grupo, consulta.data);

        const atualizados = await this.irregularidadeRepository.find({
          where: { id: In(grupo.itens.map((i) => i.id)) },
        });
        for (const atual of atualizados) {
          const antes = antesStatus.get(atual.id);
          if (
            antes === StatusIrregularidade.EM_MANUTENCAO &&
            atual.statusAtual === StatusIrregularidade.CONCLUIDA
          ) {
            concluidas += 1;
          }
          if (
            antes === StatusIrregularidade.EM_MANUTENCAO &&
            atual.statusAtual === StatusIrregularidade.REGISTRADA
          ) {
            canceladas += 1;
          }
        }
      }
    }

    const mensagem = [
      `${consultadas} OS consultada(s)`,
      concluidas ? `${concluidas} → Validação` : null,
      canceladas ? `${canceladas} → Tratamento` : null,
      falhas.length ? `${falhas.length} falha(s)` : null,
    ]
      .filter(Boolean)
      .join('; ');

    return { consultadas, concluidas, canceladas, falhas, mensagem };
  }

  async listarInsumosPorIrregularidade(id: string): Promise<BrtInsumoDto[]> {
    const item = await this.irregularidadeRepository.findOne({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    const numOs = item.numOsExternoAtual;
    if (numOs == null) {
      return [];
    }
    const rows = await this.insumoRepository.find({
      where: { integrador: 'BRT', numOsExterno: numOs },
      order: { nomeInsumo: 'ASC', dataAlteracaoBrt: 'ASC' },
    });
    return rows.map((row) => ({
      id: row.id,
      numOsExterno: row.numOsExterno,
      osOrig: row.osOrig,
      nomeInsumo: row.nomeInsumo,
      quantidade: row.quantidade ?? null,
      valor: row.valor ?? null,
      descricao: row.descricao ?? null,
      dataAlteracaoBrt: row.dataAlteracaoBrt
        ? row.dataAlteracaoBrt.toISOString()
        : null,
      sincronizadoEm: row.sincronizadoEm.toISOString(),
    }));
  }

  /**
   * Tick a cada minuto: só processa empresas com busca ativa e intervalo vencido.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async tickPoll(): Promise<void> {
    if (this.emExecucao) {
      this.logger.debug('BRT poll: tick ignorado (execução anterior em andamento)');
      return;
    }
    this.emExecucao = true;
    try {
      const empresas =
        await this.empresaTerceiraService.findEmpresasBrtBuscaAtiva();
      if (!empresas.length) {
        return;
      }
      const agora = Date.now();
      for (const empresa of empresas) {
        if (!this.intervaloVencido(empresa, agora)) {
          continue;
        }
        try {
          await this.processarEmpresa(empresa);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          this.logger.warn(
            `BRT poll falhou empresa=${empresa.id} descricao=${empresa.descricao}: ${msg}`,
          );
        } finally {
          await this.empresaTerceiraService.marcarUltimoPollBuscaInfo(
            empresa.id,
            new Date(),
          );
        }
      }
    } finally {
      this.emExecucao = false;
    }
  }

  private intervaloVencido(empresa: EmpresaTerceira, agoraMs: number): boolean {
    const minutos = Math.max(
      1,
      Math.min(1440, Number(empresa.brtBuscaInfoIntervaloMinutos ?? 10) || 10),
    );
    const ultimo = empresa.brtBuscaInfoUltimoPollEm;
    if (!ultimo) {
      return true;
    }
    const decorridoMs = agoraMs - new Date(ultimo).getTime();
    return decorridoMs >= minutos * 60_000;
  }

  private async processarEmpresa(empresa: EmpresaTerceira): Promise<void> {
    const candidatas = await this.irregularidadeRepository.find({
      where: {
        statusAtual: StatusIrregularidade.EM_MANUTENCAO,
        controleIntegracaoApi: true,
        idEmpresaManutencao: empresa.id,
        numOsExternoAtual: Not(IsNull()),
        osOrigAtual: Not(IsNull()),
      },
    });
    if (!candidatas.length) {
      this.logger.debug(
        `BRT poll empresa=${empresa.id}: nenhuma OS em manutenção para consultar`,
      );
      return;
    }

    const grupos = this.agruparPorOs(candidatas);
    this.logger.log(
      `BRT poll empresa=${empresa.id}: ${grupos.length} OS(s) para consultar`,
    );

    for (const grupo of grupos) {
      const consulta = await this.brtOsIntegrationService.consultarRegistro(
        empresa,
        grupo.numOs,
      );
      if (!consulta.ok) {
        this.logger.warn(
          `BRT poll consulta falhou numOs=${grupo.numOs} codigo=${consulta.codigoErro}: ${consulta.mensagem}`,
        );
        await this.registrarErroConsultaBrt(grupo, consulta.mensagem);
        continue;
      }
      await this.sincronizarEAplicar(empresa, grupo, consulta.data);
    }
  }

  private async registrarErroConsultaBrt(
    grupo: GrupoOsAtiva,
    mensagem: string,
  ): Promise<void> {
    const ids = grupo.itens.map((i) => i.id);
    if (!ids.length) {
      return;
    }
    await this.irregularidadeRepository.update(
      { id: In(ids) },
      {
        ultimoErroIntegracao: mensagem.slice(0, 2000),
        ultimoErroIntegracaoEm: new Date(),
      },
    );
  }

  private agruparPorOs(itens: Irregularidade[]): GrupoOsAtiva[] {
    const map = new Map<string, GrupoOsAtiva>();
    for (const item of itens) {
      const numOs = item.numOsExternoAtual;
      const osOrig = item.osOrigAtual?.trim();
      if (numOs == null || !osOrig) {
        continue;
      }
      const key = `${numOs}|${osOrig}`;
      const existente = map.get(key);
      if (existente) {
        existente.itens.push(item);
      } else {
        map.set(key, { numOs, osOrig, itens: [item] });
      }
    }
    return [...map.values()];
  }

  private async sincronizarEAplicar(
    empresa: EmpresaTerceira,
    grupo: GrupoOsAtiva,
    data: BrtOsRegistroItem,
  ): Promise<void> {
    const situacaoAtual = data.situacao?.trim() || null;
    const comentarioAtual = this.extrairComentarioSituacaoAtual(data);
    const agora = new Date();

    await this.persistirHistoricoBrt(grupo, data);
    await this.persistirInsumos(grupo, data);

    const ids = grupo.itens.map((i) => i.id);
    await this.irregularidadeRepository.update(
      { id: In(ids) },
      {
        statusBrtAtual: situacaoAtual,
        statusBrtAtualizadoEm: agora,
        statusBrtComentario: comentarioAtual,
        ultimoErroIntegracao: null,
        ultimoErroIntegracaoEm: null,
      },
    );

    const gatilho =
      resolverGatilhoSituacaoBrt(situacaoAtual) ??
      this.resolverGatilhoDoHistorico(data);

    if (gatilho === 'disponivel') {
      await this.aplicarDisponivel(
        empresa,
        grupo,
        situacaoAtual,
        comentarioAtual,
      );
      return;
    }
    if (gatilho === 'cancelado') {
      await this.aplicarCancelado(
        empresa,
        grupo,
        situacaoAtual,
        comentarioAtual,
      );
    }
  }

  /**
   * Motivo/comentário do histórico BRT para a situação atual (mais recente).
   */
  private extrairComentarioSituacaoAtual(
    data: BrtOsRegistroItem,
  ): string | null {
    const situacaoNorm = normalizarSituacaoBrt(data.situacao);
    if (!situacaoNorm) {
      return null;
    }
    const candidatos = (data.historico ?? [])
      .filter(
        (evento) =>
          normalizarSituacaoBrt(evento.situacao) === situacaoNorm &&
          !!evento.comentario?.trim(),
      )
      .map((evento) => ({
        comentario: evento.comentario!.trim(),
        data: this.parseDataBrt(evento.data_criacao)?.getTime() ?? 0,
      }))
      .sort((a, b) => b.data - a.data);
    return candidatos[0]?.comentario ?? null;
  }

  private resolverGatilhoDoHistorico(
    data: BrtOsRegistroItem,
  ): ReturnType<typeof resolverGatilhoSituacaoBrt> {
    const hist = [...(data.historico ?? [])].reverse();
    for (const evento of hist) {
      const g = resolverGatilhoSituacaoBrt(evento.situacao);
      if (g) {
        return g;
      }
    }
    return null;
  }

  private async persistirHistoricoBrt(
    grupo: GrupoOsAtiva,
    data: BrtOsRegistroItem,
  ): Promise<void> {
    const eventos = data.historico ?? [];
    for (const evento of eventos) {
      const statusBrt = evento.situacao?.trim();
      if (!statusBrt) {
        continue;
      }
      const dataEvento = this.parseDataBrt(evento.data_criacao);
      const existente = await this.statusEventoRepository.findOne({
        where: dataEvento
          ? {
              integrador: 'BRT',
              numOsExterno: grupo.numOs,
              statusBrt,
              dataEventoBrt: dataEvento,
            }
          : {
              integrador: 'BRT',
              numOsExterno: grupo.numOs,
              statusBrt,
              dataEventoBrt: IsNull(),
            },
      });
      if (existente) {
        continue;
      }
      try {
        await this.statusEventoRepository.save(
          this.statusEventoRepository.create({
            integrador: 'BRT',
            osOrig: grupo.osOrig,
            numOsExterno: grupo.numOs,
            statusBrt,
            comentario: evento.comentario?.trim() || null,
            dataEventoBrt: dataEvento,
            recebidoEm: new Date(),
          }),
        );
      } catch (err) {
        // corrida / unique: ignora
        this.logger.debug(
          `BRT poll historico duplicado numOs=${grupo.numOs} status=${statusBrt}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }
  }

  private async persistirInsumos(
    grupo: GrupoOsAtiva,
    data: BrtOsRegistroItem,
  ): Promise<void> {
    const insumos = data.insumo ?? [];
    await this.insumoRepository.delete({
      integrador: 'BRT',
      numOsExterno: grupo.numOs,
    });
    if (!insumos.length) {
      return;
    }
    const sincronizadoEm = new Date();
    const rows = insumos.map((item) =>
      this.insumoRepository.create({
        integrador: 'BRT',
        osOrig: grupo.osOrig,
        numOsExterno: grupo.numOs,
        nomeInsumo: (item.insumo ?? '').trim() || '(sem nome)',
        quantidade:
          item.quantidade === undefined || item.quantidade === null
            ? null
            : Number(item.quantidade),
        valor:
          item.valor === undefined || item.valor === null
            ? null
            : Number(item.valor),
        descricao: item.descricao?.trim() || null,
        dataAlteracaoBrt: this.parseDataBrt(item.data_alteracao),
        sincronizadoEm,
      }),
    );
    await this.insumoRepository.save(rows);
  }

  private async aplicarDisponivel(
    empresa: EmpresaTerceira,
    grupo: GrupoOsAtiva,
    situacao: string | null,
    comentario: string | null,
  ): Promise<void> {
    await this.irregularidadeRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Irregularidade);
      const histRepo = manager.getRepository(IrregularidadeHistorico);
      for (const item of grupo.itens) {
        const entity = await repo.findOne({ where: { id: item.id } });
        if (
          !entity ||
          entity.statusAtual !== StatusIrregularidade.EM_MANUTENCAO
        ) {
          continue;
        }
        const statusOrigem = entity.statusAtual;
        entity.statusAtual = StatusIrregularidade.CONCLUIDA;
        entity.concluidaManutencaoEm = new Date();
        entity.resolvido = false;
        entity.statusBrtAtual = situacao;
        entity.statusBrtAtualizadoEm = new Date();
        entity.statusBrtComentario = comentario;
        await repo.save(entity);
        await histRepo.save(
          histRepo.create({
            idIrregularidade: entity.id,
            statusOrigem,
            statusDestino: StatusIrregularidade.CONCLUIDA,
            acao: 'concluir_manutencao_integracao',
            idEmpresaEvento: empresa.id,
            dataEvento: new Date(),
            observacao: `retorno BRT situacao=${situacao ?? '?'}; numOs=${grupo.numOs}; os_orig=${grupo.osOrig}`,
          }),
        );
      }
    });
    this.logger.log(
      `BRT poll Disponível → CONCLUIDA numOs=${grupo.numOs} itens=${grupo.itens.length}`,
    );
  }

  private async aplicarCancelado(
    empresa: EmpresaTerceira,
    grupo: GrupoOsAtiva,
    situacao: string | null,
    comentario: string | null,
  ): Promise<void> {
    await this.irregularidadeRepository.manager.transaction(async (manager) => {
      const repo = manager.getRepository(Irregularidade);
      const histRepo = manager.getRepository(IrregularidadeHistorico);
      for (const item of grupo.itens) {
        const entity = await repo.findOne({ where: { id: item.id } });
        if (
          !entity ||
          entity.statusAtual !== StatusIrregularidade.EM_MANUTENCAO
        ) {
          continue;
        }
        const statusOrigem = entity.statusAtual;
        entity.statusAtual = StatusIrregularidade.REGISTRADA;
        entity.controleIntegracaoApi = false;
        entity.osOrigAtual = null;
        entity.numOsExternoAtual = null;
        entity.ultimoErroIntegracao = null;
        entity.ultimoErroIntegracaoEm = null;
        entity.statusBrtAtual = situacao;
        entity.statusBrtAtualizadoEm = new Date();
        entity.statusBrtComentario = comentario;
        entity.resolvido = false;
        this.erpVistoriaIntegrationService.limparVinculoErp(entity);
        await repo.save(entity);
        await histRepo.save(
          histRepo.create({
            idIrregularidade: entity.id,
            statusOrigem,
            statusDestino: StatusIrregularidade.REGISTRADA,
            acao: 'cancelar_retorno_brt',
            idEmpresaEvento: empresa.id,
            dataEvento: new Date(),
            observacao: `retorno BRT situacao=${situacao ?? '?'}; numOs=${grupo.numOs}; os_orig=${grupo.osOrig}`,
          }),
        );
      }
    });
    this.logger.log(
      `BRT poll Cancelado → REGISTRADA numOs=${grupo.numOs} itens=${grupo.itens.length}`,
    );
  }

  private parseDataBrt(valor?: string | null): Date | null {
    if (!valor?.trim()) {
      return null;
    }
    const normalizado = valor.trim().includes('T')
      ? valor.trim()
      : valor.trim().replace(' ', 'T');
    const d = new Date(normalizado);
    return Number.isNaN(d.getTime()) ? null : d;
  }
}
