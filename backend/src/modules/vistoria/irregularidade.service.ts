import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, QueryFailedError, Repository } from 'typeorm';
import { createTransport } from 'nodemailer';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';
import { decode as decodeJpeg } from 'jpeg-js';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeMidia } from './entities/irregularidade-midia.entity';
import { Vistoria } from './entities/vistoria.entity';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { Componente } from './entities/componente.entity';
import { Sintoma } from './entities/sintoma.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { CreateIrregularidadeDto } from './dto/create-irregularidade.dto';
import { UpdateIrregularidadeDto } from './dto/update-irregularidade.dto';
import { ReclassificarIrregularidadeDto } from './dto/reclassificar-irregularidade.dto';
import { CancelarIrregularidadeDto } from './dto/cancelar-irregularidade.dto';
import { IniciarManutencaoIrregularidadeDto } from './dto/iniciar-manutencao-irregularidade.dto';
import { NaoProcedeIrregularidadeDto } from './dto/nao-procede-irregularidade.dto';
import { ValidacaoFinalIrregularidadeDto } from './dto/validacao-final-irregularidade.dto';
import { ReprovarValidacaoFinalIrregularidadeDto } from './dto/reprovar-validacao-final-irregularidade.dto';
import { IrregularidadeResumoDto } from './dto/irregularidade-resumo.dto';
import { IrregularidadeHistoricoDto } from './dto/irregularidade-historico.dto';
import { IrregularidadeImagemResumoDto } from './dto/irregularidade-imagem-resumo.dto';
import { IrregularidadeAudioResumoDto } from './dto/irregularidade-audio-resumo.dto';
import {
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../../common/dto/paginated-response.dto';
import {
  IrregularidadeHistoricoVeiculoDto,
  IrregularidadeHistoricoVeiculoItemDto,
} from './dto/irregularidade-historico-veiculo.dto';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { TipoVistoria } from '../../common/enums/tipo-vistoria.enum';
import {
  OrigemRegistroIrregularidade,
  OrigemVistoria,
} from '../../common/enums/origem-vistoria.enum';
import { Permission } from '../../common/enums/permission.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { GravidadeCriticidade } from '../../common/enums/gravidade-criticidade.enum';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';
import { IrregularidadeOsExterna } from './entities/irregularidade-os-externa.entity';
import { OsExternaStatusEvento } from './entities/os-externa-status-evento.entity';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Configuracao } from '../configuracao/entities/configuracao.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { IniciarManutencaoLoteDto } from './dto/iniciar-manutencao-lote.dto';
import { RelatorioIrregularidadesLoteDto } from './dto/relatorio-irregularidades-lote.dto';
import { RelatorioResumoGestaoOsDto } from './dto/relatorio-resumo-gestao-os.dto';
import {
  RelatorioManutencaoExecucaoDto,
  RelatorioManutencaoPreviewDto,
  RelatorioManutencaoResumoDto,
} from './dto/relatorio-manutencao.dto';
import {
  assertUserHasAllPermissions,
  collectUserPermissions,
  getRequiredPrintPermissionsForStatuses,
} from '../../common/utils/irregularidade-permissions.util';
import { IrregularidadeManutencaoEnvioService,
  ManutencaoEnvioContext,
  STATUS_ENVIO_MANUTENCAO,
} from './irregularidade-manutencao-envio.service';
import { normalizarSituacaoBrt } from './brt-os-integration.service';
import { ModeloVeiculoVistaService } from '../veiculo/modelo-veiculo-vista.service';
import {
  IrregularidadeMarcacaoDto,
  MarcacaoPontoDto,
  VistaMarcacaoItemDto,
} from './dto/irregularidade-marcacao.dto';
import { IrregularidadeMarcacao } from './entities/irregularidade-marcacao.entity';

const MARCACOES_MAX_POR_IRREGULARIDADE = 10;

type RecorteJpegPdf = {
  left: number;
  top: number;
  width: number;
  height: number;
  origW: number;
  origH: number;
};

type CirculoMapaPdf = {
  posXPct: number;
  posYPct: number;
  /** Número da OS para a legenda. */
  rotulo: string;
  /** Texto no círculo: `1.1`, `1.2`, `2.1`… */
  rotuloCirculo: string;
};

type MapaPdfVista = {
  idVista: string;
  descricao: string;
  buffer: Buffer;
  circulos: CirculoMapaPdf[];
  recorte?: RecorteJpegPdf;
};

type MapaPdfIrregularidadeLocal = {
  descricao: string;
  buffer: Buffer;
  recorte?: RecorteJpegPdf;
  /** Pontos na mesma vista. */
  pontos: Array<{ posXPct: number; posYPct: number; ordem: number }>;
};

@Injectable()
export class IrregularidadeService {
  private readonly logger = new Logger(IrregularidadeService.name);

  /** Limite de OS no PDF resumido da Gestão OS (evita PDF/memória excessivos). */
  static readonly RELATORIO_RESUMO_GESTAO_OS_MAX = 3000;

  constructor(
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(IrregularidadeMidia)
    private readonly midiaRepository: Repository<IrregularidadeMidia>,
    @InjectRepository(Vistoria)
    private readonly vistoriaRepository: Repository<Vistoria>,
    @InjectRepository(AreaVistoriada)
    private readonly areaRepository: Repository<AreaVistoriada>,
    @InjectRepository(Componente)
    private readonly componenteRepository: Repository<Componente>,
    @InjectRepository(Sintoma)
    private readonly sintomaRepository: Repository<Sintoma>,
    @InjectRepository(AreaComponente)
    private readonly areaComponenteRepository: Repository<AreaComponente>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizRepository: Repository<MatrizCriticidade>,
    @InjectRepository(EmpresaTerceira)
    private readonly empresaTerceiraRepository: Repository<EmpresaTerceira>,
    @InjectRepository(Configuracao)
    private readonly configuracaoRepository: Repository<Configuracao>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
    @InjectRepository(IrregularidadeHistorico)
    private readonly irregularidadeHistoricoRepository: Repository<IrregularidadeHistorico>,
    @InjectRepository(IrregularidadeOsExterna)
    private readonly irregularidadeOsExternaRepository: Repository<IrregularidadeOsExterna>,
    @InjectRepository(OsExternaStatusEvento)
    private readonly osExternaStatusEventoRepository: Repository<OsExternaStatusEvento>,
    @InjectRepository(IrregularidadeMarcacao)
    private readonly marcacaoRepository: Repository<IrregularidadeMarcacao>,
    private readonly manutencaoEnvioService: IrregularidadeManutencaoEnvioService,
    private readonly vistaService: ModeloVeiculoVistaService,
  ) {}

  async create(
    vistoriaId: string,
    dto: CreateIrregularidadeDto,
    actor?: {
      id?: string;
      idEmpresa?: string;
      permissions?: Set<string>;
    },
  ): Promise<Irregularidade> {
    const vistoria = await this.getVistoriaOrFail(vistoriaId);
    this.assertVistoriaAberta(vistoria);
    this.assertIrregularidadeCreatePermission(vistoria, actor?.permissions);
    const isSosVistoria = vistoria.origem === OrigemVistoria.SOS_WEB;
    const idUsuarioEvento = actor?.id ?? vistoria.idUsuario;

    await this.ensureArea(dto.idarea);
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    await this.ensureComponenteNaArea(dto.idarea, dto.idcomponente);
    await this.ensureMatriz(dto.idcomponente, dto.idsintoma);
    const marcacao = await this.resolveMarcacoes(
      vistoria,
      dto.idcomponente,
      dto.idsintoma,
      dto,
    );

    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        let saved: Irregularidade | null = null;
        let lastError: unknown;
        const primeiro = marcacao.pontos[0];

        for (let attempt = 0; attempt < 5; attempt += 1) {
          const numeroIrregularidade =
            await this.generateNumeroIrregularidade(manager);
          const irregularidade = manager.getRepository(Irregularidade).create({
            idVistoria: vistoria.id,
            numeroIrregularidade,
            idArea: dto.idarea,
            idComponente: dto.idcomponente,
            idSintoma: dto.idsintoma,
            observacao: dto.observacao,
            resolvido: false,
            statusAtual: StatusIrregularidade.REGISTRADA,
            origemRegistro: isSosVistoria
              ? OrigemRegistroIrregularidade.SOS_WEB
              : null,
            idVista: marcacao.idVista,
            posXPct: primeiro?.posXPct ?? null,
            posYPct: primeiro?.posYPct ?? null,
          });

          try {
            saved = await manager
              .getRepository(Irregularidade)
              .save(irregularidade);
            break;
          } catch (error) {
            lastError = error;
            if (!this.isNumeroIrregularidadeUniqueViolation(error)) {
              throw error;
            }
          }
        }

        if (!saved) {
          throw lastError;
        }

        await this.persistirMarcacoes(
          manager.getRepository(IrregularidadeMarcacao),
          saved.id,
          marcacao.idVista,
          marcacao.pontos,
        );

        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: undefined,
            statusDestino: StatusIrregularidade.REGISTRADA,
            acao: isSosVistoria ? 'registrar_sos' : 'registrar',
            idUsuario: idUsuarioEvento,
            idEmpresaEvento: actor?.idEmpresa,
            observacao: isSosVistoria
              ? 'Irregularidade registrada por SOS'
              : 'Irregularidade registrada pelo aplicativo',
          },
        );
        return saved;
      },
    );
  }

  async listPendentesByVeiculo(
    idVeiculo: string,
  ): Promise<IrregularidadeResumoDto[]> {
    const itens = await this.irregularidadeRepository
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('v.usuario', 'vistoriador')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .leftJoinAndSelect('i.vista', 'vista')
      .leftJoinAndSelect('i.marcacoes', 'marcacoesPontos')
      .where('v.idVeiculo = :idVeiculo', { idVeiculo })
      .andWhere('v.status = :statusVistoriaFinalizada', {
        statusVistoriaFinalizada: StatusVistoria.FINALIZADA,
      })
      .andWhere('i.statusAtual NOT IN (:...statusFinal)', {
        statusFinal: [
          StatusIrregularidade.VALIDADA,
          StatusIrregularidade.CANCELADA,
        ],
      })
      .orderBy('i.atualizadoEm', 'DESC')
      .getMany();
    return itens.map((item) => ({
      id: item.id,
      idvistoria: item.idVistoria,
      numeroIrregularidade: item.numeroIrregularidade,
      idarea: item.idArea,
      nomeArea: item.area?.nome,
      idcomponente: item.idComponente,
      nomeComponente: item.componente?.nome,
      idsintoma: item.idSintoma,
      descricaoSintoma: item.sintoma?.descricao,
      vistoriadorNome: item.vistoria?.usuario?.nome ?? undefined,
      observacao: item.observacao ?? undefined,
      resolvido: item.resolvido,
      statusAtual: item.statusAtual,
      criadoEm: item.criadoEm.toISOString(),
      atualizadoEm: item.atualizadoEm.toISOString(),
      marcacao: this.mapMarcacao(item),
      marcacoes: this.mapMarcacoes(item),
      exigeMarcacaoMapa: item.sintoma?.exigeMarcacaoMapa ?? false,
    }));
  }

  async listByVistoria(vistoriaId: string): Promise<IrregularidadeResumoDto[]> {
    await this.getVistoriaOrFail(vistoriaId);
    const itens = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoriaId },
      relations: ['area', 'componente', 'sintoma', 'vista', 'marcacoes'],
      order: { atualizadoEm: 'DESC' },
    });

    return itens.map((item) => ({
      id: item.id,
      idvistoria: item.idVistoria,
      numeroIrregularidade: item.numeroIrregularidade,
      idarea: item.idArea,
      nomeArea: item.area?.nome,
      idcomponente: item.idComponente,
      nomeComponente: item.componente?.nome,
      idsintoma: item.idSintoma,
      descricaoSintoma: item.sintoma?.descricao,
      observacao: item.observacao ?? undefined,
      resolvido: item.resolvido,
      statusAtual: item.statusAtual,
      criadoEm: item.criadoEm.toISOString(),
      atualizadoEm: item.atualizadoEm.toISOString(),
      marcacao: this.mapMarcacao(item),
      marcacoes: this.mapMarcacoes(item),
      exigeMarcacaoMapa: item.sintoma?.exigeMarcacaoMapa ?? false,
    }));
  }

  async listMarcacoesByVista(
    idVeiculo: string,
    idVista: string,
    somenteAbertas = true,
  ): Promise<VistaMarcacaoItemDto[]> {
    const qb = this.marcacaoRepository
      .createQueryBuilder('m')
      .innerJoinAndSelect('m.irregularidade', 'i')
      .innerJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .where('v.idVeiculo = :idVeiculo', { idVeiculo })
      .andWhere('m.idVista = :idVista', { idVista });

    if (somenteAbertas) {
      qb.andWhere('i.resolvido = false');
    }

    const pontos = await qb
      .orderBy('i.numeroIrregularidade', 'ASC')
      .addOrderBy('m.ordem', 'ASC')
      .getMany();

    return pontos.map((ponto) => {
      const item = ponto.irregularidade!;
      return {
        idIrregularidade: item.id,
        numeroIrregularidade: item.numeroIrregularidade,
        idsintoma: item.idSintoma,
        descricaoSintoma: item.sintoma?.descricao,
        statusAtual: item.statusAtual,
        resolvido: item.resolvido,
        posXPct: Number(ponto.posXPct),
        posYPct: Number(ponto.posYPct),
        ordem: ponto.ordem ?? 0,
      };
    });
  }

  async listHistoricoByIrregularidade(
    irregularidadeId: string,
  ): Promise<IrregularidadeHistoricoDto[]> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    const historico = await this.irregularidadeHistoricoRepository.find({
      where: { idIrregularidade: irregularidadeId },
      relations: ['usuario'],
      order: { dataEvento: 'ASC' },
    });

    const omniMapped: IrregularidadeHistoricoDto[] = historico.map(
      (item, index) => {
        const proximo = historico[index + 1];
        const inicio = item.dataEvento.getTime();
        const fim = proximo ? proximo.dataEvento.getTime() : Date.now();
        return {
          id: item.id,
          origem: 'OMNI' as const,
          statusOrigem: item.statusOrigem,
          statusDestino: item.statusDestino,
          acao: item.acao,
          dataEvento: item.dataEvento.toISOString(),
          idUsuario: item.idUsuario,
          usuarioNome: item.usuario?.nome,
          observacao: item.observacao,
          tempoEtapaMs: Math.max(0, fim - inicio),
        };
      },
    );

    const brtMapped = await this.listHistoricoBrtConsolidado(irregularidade);
    const consolidado = [...omniMapped, ...brtMapped].sort(
      (a, b) =>
        new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime(),
    );

    return consolidado.reverse();
  }

  /**
   * Timeline BRT da OS vinculada à irregularidade (ativa + histórico de envios).
   * Não altera tempo de etapa OMNI.
   */
  private async listHistoricoBrtConsolidado(
    irregularidade: Irregularidade,
  ): Promise<IrregularidadeHistoricoDto[]> {
    const numOsSet = new Set<number>();
    const osOrigSet = new Set<string>();

    if (irregularidade.numOsExternoAtual != null) {
      numOsSet.add(Number(irregularidade.numOsExternoAtual));
    }
    if (irregularidade.osOrigAtual?.trim()) {
      osOrigSet.add(irregularidade.osOrigAtual.trim());
    }

    const vinculos = await this.irregularidadeOsExternaRepository.find({
      where: {
        idIrregularidade: irregularidade.id,
        integrador: 'BRT',
        sucesso: true,
      },
    });
    for (const vinculo of vinculos) {
      if (vinculo.numOsExterno != null) {
        numOsSet.add(Number(vinculo.numOsExterno));
      }
      if (vinculo.osOrig?.trim()) {
        osOrigSet.add(vinculo.osOrig.trim());
      }
    }

    if (numOsSet.size === 0 && osOrigSet.size === 0) {
      return [];
    }

    const qb = this.osExternaStatusEventoRepository
      .createQueryBuilder('e')
      .where('e.integrador = :integrador', { integrador: 'BRT' });

    if (numOsSet.size > 0 && osOrigSet.size > 0) {
      qb.andWhere(
        '(e.numOsExterno IN (:...numOs) OR e.osOrig IN (:...osOrig))',
        {
          numOs: [...numOsSet],
          osOrig: [...osOrigSet],
        },
      );
    } else if (numOsSet.size > 0) {
      qb.andWhere('e.numOsExterno IN (:...numOs)', { numOs: [...numOsSet] });
    } else {
      qb.andWhere('e.osOrig IN (:...osOrig)', { osOrig: [...osOrigSet] });
    }

    const eventos = await qb.getMany();
    eventos.sort((a, b) => {
      const ta = (a.dataEventoBrt ?? a.recebidoEm).getTime();
      const tb = (b.dataEventoBrt ?? b.recebidoEm).getTime();
      return ta - tb;
    });

    return eventos.map((evento) => {
      const dataRef = evento.dataEventoBrt ?? evento.recebidoEm;
      const partesObs: string[] = [];
      if (evento.comentario?.trim()) {
        partesObs.push(evento.comentario.trim());
      }
      partesObs.push(`numOs=${evento.numOsExterno}`);
      if (evento.osOrig?.trim()) {
        partesObs.push(`os_orig=${evento.osOrig.trim()}`);
      }
      return {
        id: evento.id,
        origem: 'BRT' as const,
        statusBrt: evento.statusBrt,
        acao: 'status_brt',
        dataEvento: dataRef.toISOString(),
        usuarioNome: 'Integração BRT',
        observacao: partesObs.join('; '),
        numOsExterno: evento.numOsExterno,
      };
    });
  }

  async listNaoResolvidasByVeiculo(
    idVeiculo: string,
    areaId?: string,
    componenteId?: string,
  ): Promise<IrregularidadeHistoricoVeiculoDto> {
    const qb = this.irregularidadeRepository
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .leftJoinAndSelect('i.vista', 'vista')
      .leftJoinAndSelect('i.marcacoes', 'marcacoesPontos')
      .where('v.idVeiculo = :idVeiculo', { idVeiculo })
      .andWhere('v.status = :statusFinalizada', {
        statusFinalizada: StatusVistoria.FINALIZADA,
      })
      .andWhere('i.statusAtual NOT IN (:...statusFinal)', {
        statusFinal: [
          StatusIrregularidade.VALIDADA,
          StatusIrregularidade.CANCELADA,
        ],
      });

    if (areaId) {
      qb.andWhere('i.idArea = :areaId', { areaId });
    }
    if (componenteId) {
      qb.andWhere('i.idComponente = :componenteId', { componenteId });
    }

    const itens = await qb.orderBy('i.atualizadoEm', 'DESC').getMany();
    const idsIrregularidade = itens.map((item) => item.id);
    const midiasPorIrregularidade = new Map<
      string,
      IrregularidadeHistoricoVeiculoItemDto['midias']
    >();

    if (idsIrregularidade.length > 0) {
      const midiasRows = await this.midiaRepository
        .createQueryBuilder('m')
        .select('m.id', 'id')
        .addSelect('m.idIrregularidade', 'idIrregularidade')
        .addSelect('m.tipo', 'tipo')
        .addSelect('m.nomeArquivo', 'nomeArquivo')
        .addSelect('m.mimeType', 'mimeType')
        .addSelect('m.tamanho', 'tamanho')
        .addSelect('m.duracaoMs', 'duracaoMs')
        .addSelect('m.criadoEm', 'criadoEm')
        .where('m.idIrregularidade IN (:...ids)', { ids: idsIrregularidade })
        .orderBy('m.criadoEm', 'ASC')
        .getRawMany<{
          id: string;
          idIrregularidade: string;
          tipo: 'imagem' | 'audio';
          nomeArquivo: string;
          mimeType: string;
          tamanho: string | number;
          duracaoMs: string | number | null;
        }>();

      for (const row of midiasRows) {
        const atuais = midiasPorIrregularidade.get(row.idIrregularidade) ?? [];
        atuais.push({
          id: row.id,
          tipo: row.tipo,
          nomeArquivo: row.nomeArquivo,
          mimeType: row.mimeType,
          tamanho: Number(row.tamanho) || 0,
          duracaoMs: row.duracaoMs == null ? undefined : Number(row.duracaoMs),
        });
        midiasPorIrregularidade.set(row.idIrregularidade, atuais);
      }
    }

    const mapped: IrregularidadeHistoricoVeiculoItemDto[] = itens.map(
      (item) => ({
        id: item.id,
        numeroIrregularidade: item.numeroIrregularidade,
        idvistoria: item.idVistoria,
        numeroVistoria: item.vistoria?.numeroVistoria,
        datavistoria: item.vistoria?.datavistoria?.toISOString?.() ?? '',
        statusVistoria: item.vistoria?.status,
        idarea: item.idArea,
        nomeArea: item.area?.nome,
        idcomponente: item.idComponente,
        nomeComponente: item.componente?.nome,
        idsintoma: item.idSintoma,
        descricaoSintoma: item.sintoma?.descricao,
        observacao: item.observacao ?? undefined,
        resolvido: item.resolvido,
        statusAtual: item.statusAtual,
        atualizadoEm: item.atualizadoEm.toISOString(),
        midias: midiasPorIrregularidade.get(item.id) ?? [],
        marcacao: this.mapMarcacao(item),
        marcacoes: this.mapMarcacoes(item),
      }),
    );

    return {
      idveiculo: idVeiculo,
      veiculo: itens[0]?.vistoria?.veiculo?.descricao ?? '',
      total: mapped.length,
      itens: mapped,
    };
  }

  async gerarPdfPendenciasVeiculo(
    idVeiculo: string,
    emitidoPor?: string | null,
    areaId?: string,
    componenteId?: string,
  ): Promise<Buffer> {
    const veiculo = await this.veiculoRepository.findOne({
      where: { id: idVeiculo },
    });
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }

    const historico = await this.listNaoResolvidasByVeiculo(
      idVeiculo,
      areaId,
      componenteId,
    );

    let filtroArea: string | undefined;
    if (areaId) {
      const area = await this.areaRepository.findOne({ where: { id: areaId } });
      filtroArea = area?.nome?.trim() || undefined;
    }
    let filtroComponente: string | undefined;
    if (componenteId) {
      const componente = await this.componenteRepository.findOne({
        where: { id: componenteId },
      });
      filtroComponente = componente?.nome?.trim() || undefined;
    }

    const configuracao = await this.configuracaoRepository.findOne({
      where: {},
    });

    const imagensPorIrregularidade =
      await this.carregarImagensPdfPorIrregularidade(
        historico.itens.map((item) => item.id),
      );
    const mapas = await this.carregarMapasPdf(veiculo.idModelo, historico.itens);
    const mapasPorItem = await this.carregarMapasPdfPorHistoricoItens(
      veiculo.idModelo,
      historico.itens,
    );

    return this.buildPdfPendenciasVeiculo({
      veiculoDescricao: veiculo.descricao,
      veiculoPlaca: veiculo.placa,
      filtroArea,
      filtroComponente,
      itens: historico.itens.map((item) => ({
        ...item,
        imagens: imagensPorIrregularidade.get(item.id) ?? [],
      })),
      mapas,
      mapasPorItem,
      emitidoEm: new Date(),
      emitidoPor: emitidoPor?.trim() || undefined,
      logoBuffer: this.resolveLogoBuffer(configuracao),
    });
  }

  /**
   * PDF do relatório de uma vistoria (paridade com Imprimir na web).
   */
  async gerarPdfVistoria(
    idVistoria: string,
    emitidoPor?: string | null,
  ): Promise<Buffer> {
    const vistoria = await this.vistoriaRepository.findOne({
      where: { id: idVistoria },
      relations: ['veiculo', 'motorista', 'usuario'],
    });
    if (!vistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }

    const irregularidades = await this.irregularidadeRepository.find({
      where: { idVistoria },
      relations: ['area', 'componente', 'sintoma', 'vista', 'marcacoes'],
      order: { atualizadoEm: 'ASC' },
    });

    const historicoItens: IrregularidadeHistoricoVeiculoItemDto[] =
      irregularidades.map((item) => ({
        id: item.id,
        numeroIrregularidade: item.numeroIrregularidade,
        idvistoria: item.idVistoria,
        numeroVistoria: vistoria.numeroVistoria,
        datavistoria: vistoria.datavistoria.toISOString(),
        statusVistoria: vistoria.status,
        idarea: item.idArea,
        nomeArea: item.area?.nome,
        idcomponente: item.idComponente,
        nomeComponente: item.componente?.nome,
        idsintoma: item.idSintoma,
        descricaoSintoma: item.sintoma?.descricao,
        observacao: item.observacao ?? undefined,
        resolvido: item.resolvido,
        statusAtual: item.statusAtual,
        atualizadoEm: item.atualizadoEm.toISOString(),
        midias: [],
        marcacao: this.mapMarcacao(item),
        marcacoes: this.mapMarcacoes(item),
      }));

    const configuracao = await this.configuracaoRepository.findOne({
      where: {},
    });
    const imagensPorIrregularidade =
      await this.carregarImagensPdfPorIrregularidade(
        historicoItens.map((item) => item.id),
      );
    const mapasPorItem = await this.carregarMapasPdfPorHistoricoItens(
      vistoria.veiculo?.idModelo ?? null,
      historicoItens,
    );

    const percentual =
      vistoria.porcentagembateria === null ||
      vistoria.porcentagembateria === undefined
        ? '-'
        : `${Number(vistoria.porcentagembateria)}%`;
    const combustivel = vistoria.veiculo?.combustivel;
    const rotuloPercentual =
      combustivel === 'GNV (Gás Natural)'
        ? '% GNV (Gás Natural)'
        : '% Bateria';
    const statusLabel =
      vistoria.status === StatusVistoria.FINALIZADA
        ? 'Finalizada'
        : vistoria.status === StatusVistoria.CANCELADA
          ? 'Cancelada'
          : 'Em andamento';

    const capaCampos: Array<{ label: string; value: string; half?: boolean }> = [
      { label: 'Status', value: statusLabel, half: true },
      {
        label: 'Tipo',
        value:
          vistoria.tipo === TipoVistoria.SINISTRO
            ? 'Sinistro'
            : vistoria.tipo === TipoVistoria.PREVENTIVA
              ? 'Preventiva'
              : 'Corretiva',
        half: true,
      },
      {
        label: 'Data da vistoria',
        value: this.formatDateTimeBr(vistoria.datavistoria),
        half: true,
      },
      { label: 'Vistoriador', value: vistoria.usuario?.nome?.trim() || '-' },
      {
        label: 'Motorista',
        value: vistoria.motorista?.nome?.trim() || '-',
        half: true,
      },
      {
        label: 'Matrícula',
        value: vistoria.motorista?.matricula?.trim() || '-',
        half: true,
      },
      {
        label: 'Odômetro',
        value: Number(vistoria.odometro || 0).toLocaleString('pt-BR'),
        half: true,
      },
      { label: rotuloPercentual, value: percentual, half: true },
      {
        label: 'Tempo',
        value: `${Number(vistoria.tempo) || 0} min`,
        half: true,
      },
      {
        label: 'Vistoria',
        value: String(vistoria.numeroVistoria ?? '-'),
        half: true,
      },
      {
        label: 'Observação',
        value: vistoria.observacao?.trim() || '-',
      },
      {
        label: 'Vistoria OMNI',
        value:
          vistoria.erpNumeroVistoria != null && vistoria.erpNumeroVistoria !== ''
            ? String(vistoria.erpNumeroVistoria)
            : '—',
        half: true,
      },
      {
        label: 'Erro ERP',
        value: vistoria.erpUltimoErro?.trim() || '-',
        half: true,
      },
    ];

    return this.buildPdfPendenciasVeiculo({
      veiculoDescricao: vistoria.veiculo?.descricao ?? '-',
      veiculoPlaca: vistoria.veiculo?.placa ?? '-',
      itens: historicoItens.map((item) => ({
        ...item,
        imagens: imagensPorIrregularidade.get(item.id) ?? [],
      })),
      mapas: [],
      mapasPorItem,
      emitidoEm: new Date(),
      emitidoPor: emitidoPor?.trim() || undefined,
      logoBuffer: this.resolveLogoBuffer(configuracao),
      titulo: 'Relatório de Vistoria',
      capaCampos,
      emptyMessage: 'Nenhuma irregularidade registrada nesta vistoria.',
      omitTotalPendencias: true,
    });
  }

  async update(
    id: string,
    dto: UpdateIrregularidadeDto,
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);
    const vistoria = await this.getVistoriaOrFail(irregularidade.idVistoria);
    const marcacao = await this.resolveMarcacoes(
      vistoria,
      irregularidade.idComponente,
      irregularidade.idSintoma,
      dto,
      irregularidade,
    );
    const primeiro = marcacao.pontos[0];

    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        irregularidade.observacao =
          dto.observacao ?? irregularidade.observacao;
        Reflect.deleteProperty(irregularidade, 'vista');
        irregularidade.idVista = marcacao.idVista ?? null;
        irregularidade.posXPct = primeiro?.posXPct ?? null;
        irregularidade.posYPct = primeiro?.posYPct ?? null;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.persistirMarcacoes(
          manager.getRepository(IrregularidadeMarcacao),
          saved.id,
          marcacao.idVista,
          marcacao.pontos,
        );
        return saved;
      },
    );
  }

  async listByStatus(
    status: StatusIrregularidade[],
    context: {
      idsEmpresasManutencao?: string[];
      scopeByEmpresa?: boolean;
      /**
       * Mobile validação (Opção A): com `idVeiculo`, aplica escopo pela união
       * das empresas do usuário sem exigir `idEmpresaManutencao` na query.
       */
      scopeByEmpresaViaVeiculo?: boolean;
    },
    filters?: {
      idVeiculo?: string;
      /** Filtro obrigatório nas filas com escopo: uma empresa por vez. */
      idEmpresaManutencao?: string;
      gravidade?: GravidadeCriticidade[];
      dataInicio?: string;
      dataFim?: string;
      /** Trecho numérico da O.S.: busca parcial (ILIKE) em `numeroIrregularidade` (apenas dígitos). */
      ordemServico?: string;
      /** Trecho da OS OMNI / pedido ERP: busca parcial (ILIKE) em `erpCodigoPedido`. */
      erpCodigoPedido?: string;
      /** Trecho da OS BRT: busca parcial (ILIKE) em `numOsExternoAtual` (apenas dígitos). */
      numOsExterno?: string;
      /** Trecho do número da vistoria: busca parcial (ILIKE) em `v.numeroVistoria`. */
      numeroVistoria?: string;
      /** Alinha o filtro de datas à coluna "Registrado" por etapa (front: getDataRegistradoFluxo). */
      referenciaPeriodo?: 'CRIADO_EM' | 'ENTRADA_STATUS';
      /**
       * Tempo na etapa atual (sempre ENTRADA_STATUS): horas mínimas/máximas decorridas.
       */
      tempoEtapaHorasMin?: number;
      tempoEtapaHorasMax?: number;
      /** Filtra por origem do registro (`SOS_WEB` ou `MOBILE` para null). */
      origemRegistro?: 'SOS_WEB' | 'MOBILE';
      idArea?: string;
      idComponente?: string;
      idSintoma?: string;
      page?: number;
      limit?: number;
      /**
       * Relatório resumido Gestão OS: até RELATORIO_RESUMO_GESTAO_OS_MAX linhas,
       * sem mídias/marcações (somente campos do grid).
       */
      modoRelatorioResumo?: boolean;
    },
  ): Promise<PaginatedResponseDto<IrregularidadeResumoDto>> {
    const modoRelatorioResumo = !!filters?.modoRelatorioResumo;
    const page = modoRelatorioResumo
      ? 1
      : Math.max(1, Number(filters?.page) || 1);
    const limit = modoRelatorioResumo
      ? IrregularidadeService.RELATORIO_RESUMO_GESTAO_OS_MAX
      : Math.min(100, Math.max(1, Number(filters?.limit) || 20));
    // NÃO fazer leftJoinAndSelect em i.marcacoes aqui.
    // Join OneToMany multiplica linhas e o TypeORM mistura veículo/OS entre
    // irregularidades da mesma página (ex.: item com 3 marcações contamina os demais).
    let qb = this.irregularidadeRepository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .leftJoinAndSelect('i.vista', 'vista')
      .leftJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('v.veiculo', 'veiculo')
      .leftJoin(
        MatrizCriticidade,
        'matriz',
        'matriz.idComponente = i.idComponente AND matriz.idSintoma = i.idSintoma',
      )
      .where('i.statusAtual IN (:...status)', { status })
      .andWhere('v.status = :statusFinalizada', {
        statusFinalizada: StatusVistoria.FINALIZADA,
      });

    const statusEmpresa = [
      StatusIrregularidade.EM_MANUTENCAO,
      StatusIrregularidade.CONCLUIDA,
      StatusIrregularidade.VALIDADA,
    ];
    if (
      context.scopeByEmpresa &&
      status.some((s) => statusEmpresa.includes(s))
    ) {
      const idsPermitidos = (context.idsEmpresasManutencao ?? []).filter(
        Boolean,
      );
      if (!idsPermitidos.length) {
        throw new ForbiddenException(
          'Usuário sem empresa de manutenção vinculada. Não há registros para exibir.',
        );
      }
      if (context.scopeByEmpresaViaVeiculo) {
        if (!filters?.idVeiculo?.trim()) {
          throw new BadRequestException(
            'Informe o veículo (idVeiculo) para listar a validação no mobile',
          );
        }
        qb = qb.andWhere('i.idEmpresaManutencao IN (:...idsEmpresasManutencao)', {
          idsEmpresasManutencao: idsPermitidos,
        });
      } else {
        const idFiltro = filters?.idEmpresaManutencao?.trim();
        if (!idFiltro) {
          throw new BadRequestException(
            'Informe a empresa de manutenção (idEmpresaManutencao) para filtrar a fila',
          );
        }
        if (!idsPermitidos.includes(idFiltro)) {
          throw new ForbiddenException(
            'Empresa de manutenção fora do escopo do usuário',
          );
        }
        qb = qb.andWhere('i.idEmpresaManutencao = :idEmpresaManutencao', {
          idEmpresaManutencao: idFiltro,
        });
      }
    } else if (filters?.idEmpresaManutencao?.trim()) {
      qb = qb.andWhere('i.idEmpresaManutencao = :idEmpresaManutencao', {
        idEmpresaManutencao: filters.idEmpresaManutencao.trim(),
      });
    }

    if (filters?.origemRegistro === 'SOS_WEB') {
      qb = qb.andWhere('i.origemRegistro = :origemRegistro', {
        origemRegistro: OrigemRegistroIrregularidade.SOS_WEB,
      });
    } else if (filters?.origemRegistro === 'MOBILE') {
      qb = qb.andWhere('i.origemRegistro IS NULL');
    }

    if (filters?.idVeiculo) {
      qb = qb.andWhere('v.idVeiculo = :idVeiculo', {
        idVeiculo: filters.idVeiculo,
      });
    }
    if (filters?.idArea) {
      qb = qb.andWhere('i.idArea = :idArea', { idArea: filters.idArea });
    }
    if (filters?.idComponente) {
      qb = qb.andWhere('i.idComponente = :idComponente', {
        idComponente: filters.idComponente,
      });
    }
    if (filters?.idSintoma) {
      qb = qb.andWhere('i.idSintoma = :idSintoma', {
        idSintoma: filters.idSintoma,
      });
    }
    if (filters?.ordemServico) {
      const pat = `%${filters.ordemServico}%`;
      qb = qb.andWhere(
        'CAST(i.numeroIrregularidade AS TEXT) ILIKE :ordemServicoPat',
        {
          ordemServicoPat: pat,
        },
      );
    }
    if (filters?.erpCodigoPedido) {
      const pat = `%${filters.erpCodigoPedido}%`;
      qb = qb.andWhere('i.erpCodigoPedido ILIKE :erpCodigoPedidoPat', {
        erpCodigoPedidoPat: pat,
      });
    }
    if (filters?.numOsExterno) {
      const pat = `%${filters.numOsExterno}%`;
      qb = qb.andWhere(
        'CAST(i.numOsExternoAtual AS TEXT) ILIKE :numOsExternoPat',
        {
          numOsExternoPat: pat,
        },
      );
    }
    if (filters?.numeroVistoria) {
      const pat = `%${filters.numeroVistoria}%`;
      qb = qb.andWhere(
        'CAST(v.numeroVistoria AS TEXT) ILIKE :numeroVistoriaPat',
        {
          numeroVistoriaPat: pat,
        },
      );
    }
    if (filters?.gravidade?.length) {
      qb = qb.andWhere('matriz.gravidade IN (:...gravidade)', {
        gravidade: filters.gravidade,
      });
    }
    const useEntradaStatus = filters?.referenciaPeriodo === 'ENTRADA_STATUS';
    /**
     * ENTRADA_STATUS: instante da última transição real para o status atual
     * (statusOrigem distinto de statusDestino). Reclassificar não reinicia o relógio.
     * Fallback em criadoEm (igual ao cálculo de entradaStatusEm no retorno desta lista).
     * CRIADO_EM: data de criação do registro (fila de tratamento).
     */
    const entradaStatusSql = `COALESCE((
          SELECT MAX(hist."dataEvento")
          FROM "irregularidade_historico" hist
          WHERE hist."idIrregularidade" = "i"."id"
            AND hist."statusDestino" = "i"."status_atual"
            AND (hist."statusOrigem" IS NULL OR hist."statusOrigem" <> hist."statusDestino")
        ), "i"."criadoEm")`;
    const dataRefSql = useEntradaStatus ? entradaStatusSql : '"i"."criadoEm"';

    if (filters?.dataInicio || filters?.dataFim) {
      if (filters.dataInicio) {
        const dataInicio = this.parseLocalDate(filters.dataInicio, false);
        qb = qb.andWhere(`${dataRefSql} >= :dataInicio`, { dataInicio });
      }
      if (filters.dataFim) {
        const dataFim = this.parseLocalDate(filters.dataFim, true);
        qb = qb.andWhere(`${dataRefSql} <= :dataFim`, { dataFim });
      }
    }

    const horasMin = this.parseHorasNaoNegativas(filters?.tempoEtapaHorasMin);
    const horasMax = this.parseHorasNaoNegativas(filters?.tempoEtapaHorasMax);
    if (horasMin != null || horasMax != null) {
      const tempoHorasSql = `(EXTRACT(EPOCH FROM (NOW() - (${entradaStatusSql}))) / 3600.0)`;
      if (horasMin != null) {
        qb = qb.andWhere(`${tempoHorasSql} >= :tempoEtapaHorasMin`, {
          tempoEtapaHorasMin: horasMin,
        });
      }
      if (horasMax != null) {
        qb = qb.andWhere(`${tempoHorasSql} <= :tempoEtapaHorasMax`, {
          tempoEtapaHorasMax: horasMax,
        });
      }
    }

    qb = qb.setParameter(
      'sosOrigemOrdem',
      OrigemRegistroIrregularidade.SOS_WEB,
    );

    // Contagem sem ORDER BY (evita conflito com paginação).
    const total = await qb.clone().orderBy().getCount();

    if (
      modoRelatorioResumo &&
      total > IrregularidadeService.RELATORIO_RESUMO_GESTAO_OS_MAX
    ) {
      throw new BadRequestException(
        `O filtro retornou ${total} OS. Refine os filtros para no máximo ${IrregularidadeService.RELATORIO_RESUMO_GESTAO_OS_MAX} registros antes de gerar o relatório resumido.`,
      );
    }

    // Paginação por IDs: skip/take + ORDER BY CASE quebra no TypeORM (alias inválido).
    const idRows = await qb
      .clone()
      .select('i.id', 'id')
      .orderBy(
        `CASE WHEN i.origem_registro = :sosOrigemOrdem THEN 0 ELSE 1 END`,
        'ASC',
      )
      .addOrderBy(dataRefSql, 'ASC')
      .addOrderBy('i.id', 'ASC')
      .offset(modoRelatorioResumo ? 0 : (page - 1) * limit)
      .limit(limit)
      .getRawMany<{ id: string }>();

    const ids = idRows
      .map((row) => {
        const raw = row as Record<string, unknown>;
        const value = raw.id ?? raw.i_id;
        return typeof value === 'string' ? value : undefined;
      })
      .filter((id): id is string => !!id);
    if (ids.length === 0) {
      return new PaginatedResponseDto(
        [],
        new PaginationMetaDto(page, limit, total),
      );
    }

    const entitiesUnordered = await qb
      .clone()
      .andWhere('i.id IN (:...pageIds)', { pageIds: ids })
      .getMany();
    const entityById = new Map(
      entitiesUnordered.map((item) => [item.id, item]),
    );
    const entities = ids
      .map((id) => entityById.get(id))
      .filter((item): item is Irregularidade => !!item);

    // Marcações em query separada (evita produto cartesiano na listagem).
    if (ids.length > 0 && !modoRelatorioResumo) {
      const marcacoes = await this.marcacaoRepository.find({
        where: { idIrregularidade: In(ids) },
        order: { ordem: 'ASC' },
      });
      const marcacoesById = new Map<string, IrregularidadeMarcacao[]>();
      for (const m of marcacoes) {
        const list = marcacoesById.get(m.idIrregularidade) ?? [];
        list.push(m);
        marcacoesById.set(m.idIrregularidade, list);
      }
      for (const item of entities) {
        item.marcacoes = marcacoesById.get(item.id) ?? [];
      }
    }

    const gravidadeById = new Map<string, GravidadeCriticidade>();
    if (ids.length > 0) {
      const matrizRows = await this.matrizRepository
        .createQueryBuilder('matriz')
        .innerJoin(
          Irregularidade,
          'i',
          'matriz.idComponente = i.idComponente AND matriz.idSintoma = i.idSintoma',
        )
        .select('i.id', 'id')
        .addSelect('matriz.gravidade', 'gravidade')
        .where('i.id IN (:...ids)', { ids })
        .getRawMany<{ id: string; gravidade: GravidadeCriticidade }>();

      for (const row of matrizRows) {
        if (row.id && row.gravidade) {
          gravidadeById.set(row.id, row.gravidade);
        }
      }
    }

    const countsByIrregularidade = new Map<
      string,
      { foto: number; audio: number }
    >();
    const midiasByIrregularidade = new Map<
      string,
      {
        fotos: Array<{
          id: string;
          nomeArquivo: string;
          mimeType: string;
          dadosBase64: string;
        }>;
        audios: Array<{
          id: string;
          nomeArquivo: string;
          mimeType: string;
          dadosBase64: string;
        }>;
      }
    >();
    if (ids.length > 0 && !modoRelatorioResumo) {
      const rows = await this.midiaRepository
        .createQueryBuilder('m')
        .select('m.idIrregularidade', 'idIrregularidade')
        .addSelect('m.tipo', 'tipo')
        .addSelect('COUNT(*)', 'total')
        .where('m.idIrregularidade IN (:...ids)', { ids })
        .groupBy('m.idIrregularidade')
        .addGroupBy('m.tipo')
        .getRawMany<{
          idIrregularidade: string;
          tipo: 'imagem' | 'audio';
          total: string;
        }>();

      for (const row of rows) {
        const current = countsByIrregularidade.get(row.idIrregularidade) ?? {
          foto: 0,
          audio: 0,
        };
        if (row.tipo === 'imagem') current.foto = Number(row.total);
        if (row.tipo === 'audio') current.audio = Number(row.total);
        countsByIrregularidade.set(row.idIrregularidade, current);
      }

      const midias = await this.midiaRepository.find({
        where: ids.map((id) => ({ idIrregularidade: id })),
      });

      for (const midia of midias) {
        const current = midiasByIrregularidade.get(midia.idIrregularidade) ?? {
          fotos: [],
          audios: [],
        };
        const mapped = {
          id: midia.id,
          nomeArquivo: midia.nomeArquivo,
          mimeType: midia.mimeType,
          dadosBase64: midia.dadosBytea.toString('base64'),
        };
        if (midia.tipo === 'imagem') {
          current.fotos.push(mapped);
        } else if (midia.tipo === 'audio') {
          current.audios.push(mapped);
        }
        midiasByIrregularidade.set(midia.idIrregularidade, current);
      }
    }

    const vistoriaIds = Array.from(
      new Set(entities.map((i) => i.idVistoria)),
    );
    const vistoriaInfoById = new Map<
      string,
      {
        numeroVistoria?: number;
        idVeiculo?: string;
        veiculoDescricao?: string;
        veiculoPlaca?: string;
        veiculoModelo?: string;
        veiculoModeloId?: string;
        vistoriadorNome?: string;
        motoristaNome?: string;
      }
    >();
    if (vistoriaIds.length > 0) {
      const vistoriaRows = await this.vistoriaRepository
        .createQueryBuilder('v')
        .leftJoin('v.veiculo', 'veiculo')
        .leftJoin('veiculo.modeloVeiculo', 'modeloVeiculo')
        .leftJoin('v.usuario', 'usuario')
        .leftJoin('v.motorista', 'motorista')
        .select('v.id', 'id')
        .addSelect('v.numeroVistoria', 'numeroVistoria')
        .addSelect('v.idVeiculo', 'idVeiculo')
        .addSelect('veiculo.descricao', 'veiculoDescricao')
        .addSelect('veiculo.placa', 'veiculoPlaca')
        .addSelect('veiculo.idModelo', 'veiculoModeloId')
        .addSelect('modeloVeiculo.nome', 'veiculoModelo')
        .addSelect('usuario.nome', 'vistoriadorNome')
        .addSelect('motorista.nome', 'motoristaNome')
        .where('v.id IN (:...ids)', { ids: vistoriaIds })
        .getRawMany<{
          id?: string;
          v_id?: string;
          numeroVistoria?: number | string;
          idVeiculo?: string;
          veiculoDescricao?: string;
          veiculoPlaca?: string;
          veiculoModelo?: string;
          veiculoModeloId?: string;
          vistoriadorNome?: string;
          motoristaNome?: string;
        }>();

      for (const row of vistoriaRows) {
        const vistoriaId = row.id ?? row.v_id;
        if (!vistoriaId) continue;
        vistoriaInfoById.set(vistoriaId, {
          numeroVistoria:
            row.numeroVistoria != null
              ? Number(row.numeroVistoria)
              : undefined,
          idVeiculo: row.idVeiculo,
          veiculoDescricao: row.veiculoDescricao,
          veiculoPlaca: row.veiculoPlaca,
          veiculoModelo: row.veiculoModelo,
          veiculoModeloId: row.veiculoModeloId,
          vistoriadorNome: row.vistoriadorNome,
          motoristaNome: row.motoristaNome,
        });
      }
    }

    const entradaStatusByKey = new Map<string, string>();
    if (ids.length > 0) {
      const entradas = await this.irregularidadeHistoricoRepository
        .createQueryBuilder('hist')
        .select('hist.idIrregularidade', 'idIrregularidade')
        .addSelect('hist.statusDestino', 'statusDestino')
        .addSelect('MAX(hist.dataEvento)', 'entradaStatusEm')
        .where('hist.idIrregularidade IN (:...ids)', { ids })
        .andWhere(
          '(hist.statusOrigem IS NULL OR hist.statusOrigem <> hist.statusDestino)',
        )
        .groupBy('hist.idIrregularidade')
        .addGroupBy('hist.statusDestino')
        .getRawMany<{
          idIrregularidade: string;
          statusDestino: StatusIrregularidade;
          entradaStatusEm: string;
        }>();

      for (const row of entradas) {
        if (!row.idIrregularidade || !row.statusDestino || !row.entradaStatusEm)
          continue;
        entradaStatusByKey.set(
          `${row.idIrregularidade}|${row.statusDestino}`,
          row.entradaStatusEm,
        );
      }
    }

    const empresaIds = Array.from(
      new Set(
        entities
          .map((e) => e.idEmpresaManutencao)
          .filter((id): id is string => !!id),
      ),
    );
    const empresaDescricaoById = new Map<string, string>();
    if (empresaIds.length > 0) {
      const empresas = await this.empresaTerceiraRepository.find({
        where: { id: In(empresaIds) },
        select: ['id', 'descricao'],
      });
      for (const emp of empresas) {
        empresaDescricaoById.set(emp.id, emp.descricao);
      }
    }

    const conclusaoById = new Map<string, string>();
    if (ids.length > 0 && !modoRelatorioResumo) {
      const conclusoes = await this.irregularidadeHistoricoRepository
        .createQueryBuilder('hist')
        .select('hist.idIrregularidade', 'idIrregularidade')
        .addSelect('hist.observacao', 'observacao')
        .addSelect('hist.acao', 'acao')
        .addSelect('hist.dataEvento', 'dataEvento')
        .where('hist.idIrregularidade IN (:...ids)', { ids })
        .andWhere('hist.acao IN (:...acoesConclusao)', {
          acoesConclusao: [
            'concluir_manutencao',
            'concluir_manutencao_integracao',
            'concluir_manutencao_integracao_erp',
          ],
        })
        .orderBy('hist.dataEvento', 'DESC')
        .getRawMany<{
          idIrregularidade: string;
          observacao?: string | null;
          acao: string;
          dataEvento: string;
        }>();

      for (const row of conclusoes) {
        if (!row.idIrregularidade || conclusaoById.has(row.idIrregularidade)) {
          continue;
        }
        const obs = row.observacao?.trim();
        if (obs) {
          conclusaoById.set(row.idIrregularidade, obs);
        } else if ((row.acao || '').includes('integracao')) {
          conclusaoById.set(
            row.idIrregularidade,
            'Concluída via integração (sem texto de conclusão).',
          );
        } else {
          conclusaoById.set(
            row.idIrregularidade,
            'Conclusão registrada sem observação.',
          );
        }
      }
    }

    const data = entities.map((item) => {
      const counts = countsByIrregularidade.get(item.id);
      const midias = midiasByIrregularidade.get(item.id);
      const vistoriaInfo = vistoriaInfoById.get(item.idVistoria);
      const entradaStatusEm = entradaStatusByKey.get(
        `${item.id}|${item.statusAtual}`,
      );
      const resumo = this.toResumo(
        item,
        gravidadeById.get(item.id),
        counts?.foto ?? 0,
        counts?.audio ?? 0,
        midias?.fotos ?? [],
        midias?.audios ?? [],
        vistoriaInfo?.veiculoDescricao,
        vistoriaInfo?.veiculoPlaca,
        vistoriaInfo?.veiculoModelo,
        vistoriaInfo?.vistoriadorNome,
        vistoriaInfo?.motoristaNome,
        undefined,
        entradaStatusEm,
      );
      const observacaoConclusao = conclusaoById.get(item.id);
      if (observacaoConclusao) {
        resumo.observacaoConclusao = observacaoConclusao;
      }
      if (item.idEmpresaManutencao) {
        resumo.idEmpresaManutencao = item.idEmpresaManutencao;
        resumo.empresaManutencaoDescricao =
          empresaDescricaoById.get(item.idEmpresaManutencao) ?? undefined;
      }
      resumo.idvistoria = item.idVistoria;
      // Sobrescreve qualquer relação hidratada: fonte única = query de vistoria.
      if (vistoriaInfo?.numeroVistoria != null) {
        resumo.numeroVistoria = vistoriaInfo.numeroVistoria;
      }
      if (vistoriaInfo?.idVeiculo) {
        resumo.idVeiculo = vistoriaInfo.idVeiculo;
      }
      if (vistoriaInfo?.veiculoModeloId) {
        resumo.veiculoModeloId = vistoriaInfo.veiculoModeloId;
      }
      if (vistoriaInfo?.veiculoDescricao != null) {
        resumo.veiculoDescricao = vistoriaInfo.veiculoDescricao;
      }
      if (vistoriaInfo?.veiculoPlaca != null) {
        resumo.veiculoPlaca = vistoriaInfo.veiculoPlaca;
      }
      if (vistoriaInfo?.veiculoModelo != null) {
        resumo.veiculoModelo = vistoriaInfo.veiculoModelo;
      }
      if (vistoriaInfo?.vistoriadorNome != null) {
        resumo.vistoriadorNome = vistoriaInfo.vistoriadorNome;
      }
      if (vistoriaInfo?.motoristaNome != null) {
        resumo.motoristaNome = vistoriaInfo.motoristaNome;
      }
      return resumo;
    });

    if (!modoRelatorioResumo) {
      await this.preencherStatusBrtComentarioFallback(data);
    }

    return new PaginatedResponseDto(
      data,
      new PaginationMetaDto(page, limit, total),
    );
  }

  async reclassificar(
    id: string,
    dto: ReclassificarIrregularidadeDto,
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [
        StatusIrregularidade.REGISTRADA,
        StatusIrregularidade.RETRABALHO_GARANTIA,
        StatusIrregularidade.NAO_PROCEDE,
      ],
      'Somente irregularidades registradas, em retrabalho/garantia ou não procede podem ser reclassificadas',
    );
    await this.ensureArea(dto.idarea);
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    await this.ensureComponenteNaArea(dto.idarea, dto.idcomponente);
    await this.ensureMatriz(dto.idcomponente, dto.idsintoma);
    const vistoria = await this.getVistoriaOrFail(irregularidade.idVistoria);
    const classificacaoAlterada =
      irregularidade.idArea !== dto.idarea ||
      irregularidade.idComponente !== dto.idcomponente ||
      irregularidade.idSintoma !== dto.idsintoma;
    const descricaoAnterior = (irregularidade.observacao ?? '').trim();
    const descricaoNova = (dto.observacao ?? irregularidade.observacao ?? '').trim();
    const descricaoAlterada = descricaoAnterior !== descricaoNova;
    const marcacaoAnterior = this.snapshotMarcacao(irregularidade);
    const marcacao = await this.resolveMarcacoes(
      vistoria,
      dto.idcomponente,
      dto.idsintoma,
      dto,
      irregularidade,
    );
    const marcacaoAlterada =
      this.assinaturaMarcacao(
        marcacaoAnterior.idVista,
        marcacaoAnterior.pontos,
      ) !== this.assinaturaMarcacao(marcacao.idVista, marcacao.pontos);
    const observacaoHistorico = await this.montarObservacaoHistoricoReclassificacao(
      {
        classificacaoAlterada,
        idAreaOrigem: irregularidade.idArea,
        idComponenteOrigem: irregularidade.idComponente,
        idSintomaOrigem: irregularidade.idSintoma,
        idAreaDestino: dto.idarea,
        idComponenteDestino: dto.idcomponente,
        idSintomaDestino: dto.idsintoma,
        descricaoAlterada,
        descricaoAnterior,
        descricaoNova,
        marcacaoAlterada,
      },
    );
    const statusOrigemReclass = irregularidade.statusAtual;
    const primeiro = marcacao.pontos[0];

    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        irregularidade.idArea = dto.idarea;
        irregularidade.idComponente = dto.idcomponente;
        irregularidade.idSintoma = dto.idsintoma;
        // Relações hidratadas sobrescrevem FK no save do TypeORM (ex.: limpar mapa).
        Reflect.deleteProperty(irregularidade, 'sintoma');
        Reflect.deleteProperty(irregularidade, 'vista');
        irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
        irregularidade.idVista = marcacao.idVista ?? null;
        irregularidade.posXPct = primeiro?.posXPct ?? null;
        irregularidade.posYPct = primeiro?.posYPct ?? null;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.persistirMarcacoes(
          manager.getRepository(IrregularidadeMarcacao),
          saved.id,
          marcacao.idVista,
          marcacao.pontos,
        );
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: statusOrigemReclass,
            statusDestino: statusOrigemReclass,
            acao: 'reclassificar',
            idUsuario: actor?.id,
            idEmpresaEvento: actor?.idEmpresa,
            observacao: observacaoHistorico,
          },
        );
        return saved;
      },
    );
  }

  async cancelar(
    id: string,
    dto: CancelarIrregularidadeDto,
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [
        StatusIrregularidade.REGISTRADA,
        StatusIrregularidade.RETRABALHO_GARANTIA,
        StatusIrregularidade.NAO_PROCEDE,
      ],
      'Somente irregularidades registradas, em retrabalho/garantia ou não procede podem ser canceladas',
    );
    const statusOrigem = irregularidade.statusAtual;
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        irregularidade.statusAtual = StatusIrregularidade.CANCELADA;
        irregularidade.resolvido = true;
        irregularidade.motivoCancelamento = dto.motivo;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem,
            statusDestino: StatusIrregularidade.CANCELADA,
            acao: 'cancelar',
            idUsuario: actor?.id,
            idEmpresaEvento: actor?.idEmpresa,
            observacao: dto.motivo,
          },
        );
        return saved;
      },
    );
  }

  async cancelarOsBrt(
    id: string,
    dto: CancelarIrregularidadeDto,
    actor?: {
      id?: string;
      idEmpresa?: string;
      idsEmpresasManutencao?: string[];
    },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.EM_MANUTENCAO],
      'Somente irregularidades em manutenção podem ter a OS cancelada na integração BRT',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idsEmpresasManutencao);
    return this.manutencaoEnvioService.executarCancelamentoOsBrt(
      irregularidade,
      dto.motivo,
      this.buildManutencaoEnvioContext(actor),
    );
  }

  async iniciarManutencao(
    id: string,
    dto: IniciarManutencaoIrregularidadeDto,
    actor?: { id?: string; idEmpresa?: string; nome?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.irregularidadeRepository.findOne({
      where: { id },
      relations: [
        'area',
        'componente',
        'sintoma',
        'vista',
        'vistoria',
        'vistoria.veiculo',
        'vistoria.motorista',
        'vistoria.usuario',
        'midias',
      ],
    });
    if (!irregularidade) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    this.assertStatus(
      irregularidade,
      STATUS_ENVIO_MANUTENCAO,
      'Somente irregularidades registradas, em retrabalho/garantia ou não procede podem ser enviadas para manutenção',
    );
    const config = await this.configuracaoRepository.findOne({ where: {} });
    return this.manutencaoEnvioService.executarEnvioUnitario(
      irregularidade,
      dto.idEmpresaManutencao,
      config,
      this.buildManutencaoEnvioContext(actor),
    );
  }

  async previewIniciarManutencaoLote(
    dto: IniciarManutencaoLoteDto,
    actor?: { nome?: string },
  ): Promise<RelatorioManutencaoPreviewDto> {
    const { empresa, irregularidades } =
      await this.loadIrregularidadesLoteParaManutencao(dto);
    const emitidoEm = new Date();
    const resumo = this.buildResumoRelatorioManutencao(
      empresa,
      irregularidades,
      emitidoEm,
      actor?.nome,
    );
    const html = this.buildHtmlRelatorioManutencao(resumo, irregularidades);
    return { resumo, html };
  }

  async previewPdfIniciarManutencaoLote(
    dto: IniciarManutencaoLoteDto,
    actor?: { nome?: string },
  ): Promise<Buffer> {
    const { empresa, irregularidades } =
      await this.loadIrregularidadesLoteParaManutencao(dto);
    const emitidoEm = new Date();
    const resumo = this.buildResumoRelatorioManutencao(
      empresa,
      irregularidades,
      emitidoEm,
      actor?.nome,
    );
    const config = await this.configuracaoRepository.findOne({ where: {} });
    return this.buildPdfRelatorioManutencao(resumo, irregularidades, config);
  }

  /**
   * PDF do relatório de serviço(s) para irregularidades selecionadas
   * (Tratamento / Manutenção / Validação). Sem transição, ERP, BRT ou RAW.
   */
  async gerarRelatorioPdfLote(
    dto: RelatorioIrregularidadesLoteDto,
    actor?: {
      nome?: string;
      perfis?: Array<{ permissoes?: string[] }>;
    },
  ): Promise<Buffer> {
    const idsUnicos = Array.from(new Set(dto.idsIrregularidades));
    if (idsUnicos.length === 0) {
      throw new BadRequestException('Selecione ao menos uma irregularidade.');
    }

    const irregularidades = await this.irregularidadeRepository.find({
      where: idsUnicos.map((id) => ({ id })),
      relations: [
        'area',
        'componente',
        'sintoma',
        'vista',
        'marcacoes',
        'vistoria',
        'vistoria.veiculo',
        'vistoria.motorista',
        'vistoria.usuario',
        'midias',
      ],
      order: {
        criadoEm: 'ASC',
      },
    });

    if (irregularidades.length !== idsUnicos.length) {
      throw new NotFoundException(
        'Uma ou mais irregularidades selecionadas não foram encontradas.',
      );
    }

    const userPermissions = collectUserPermissions(actor?.perfis);
    if (!userPermissions.has(Permission.IRREGULARIDADE_GESTAO_OS_READ.toLowerCase())) {
      assertUserHasAllPermissions(
        userPermissions,
        getRequiredPrintPermissionsForStatuses(
          irregularidades.map((item) => item.statusAtual),
        ),
      );
    }

    const empresa = await this.resolveEmpresaRelatorioLote(irregularidades);
    const emitidoEm = new Date();
    const resumo = this.buildResumoRelatorioManutencao(
      empresa,
      irregularidades,
      emitidoEm,
      actor?.nome,
    );
    const config = await this.configuracaoRepository.findOne({ where: {} });
    return this.buildPdfRelatorioManutencao(resumo, irregularidades, config);
  }

  /**
   * PDF resumido da Gestão OS: todas as OS do filtro (sem paginação/seleção),
   * agrupadas por veículo, com tempo na etapa e totais por empresa/veículo/status.
   */
  async gerarRelatorioResumoGestaoOsPdf(
    dto: RelatorioResumoGestaoOsDto,
    actor?: {
      nome?: string;
      idsEmpresasManutencao?: string[];
    },
  ): Promise<Buffer> {
    const origemTela = dto.origemTela ?? 'gestao-os';
    const statusesPadraoPorTela: Record<
      'tratamento' | 'manutencao' | 'validacao-final' | 'gestao-os',
      StatusIrregularidade[]
    > = {
      tratamento: [
        StatusIrregularidade.REGISTRADA,
        StatusIrregularidade.NAO_PROCEDE,
        StatusIrregularidade.RETRABALHO_GARANTIA,
      ],
      manutencao: [StatusIrregularidade.EM_MANUTENCAO],
      'validacao-final': [StatusIrregularidade.CONCLUIDA],
      'gestao-os': Object.values(StatusIrregularidade),
    };
    const statuses =
      dto.status && dto.status.length > 0
        ? dto.status
        : statusesPadraoPorTela[origemTela];

    const scopeByEmpresa =
      origemTela === 'manutencao' || origemTela === 'validacao-final';
    if (scopeByEmpresa && !dto.idEmpresaManutencao?.trim()) {
      throw new BadRequestException(
        origemTela === 'validacao-final'
          ? 'Informe a empresa de manutenção para gerar o resumo na tela Validação.'
          : 'Informe a empresa de manutenção para gerar o resumo na tela Manutenção.',
      );
    }

    const listagem = await this.listByStatus(
      statuses,
      {
        scopeByEmpresa,
        idsEmpresasManutencao: actor?.idsEmpresasManutencao,
      },
      {
        idVeiculo: dto.idVeiculo,
        idEmpresaManutencao: dto.idEmpresaManutencao,
        gravidade: dto.gravidade,
        dataInicio: dto.dataInicio,
        dataFim: dto.dataFim,
        referenciaPeriodo: dto.referenciaPeriodo ?? 'CRIADO_EM',
        tempoEtapaHorasMin: dto.tempoEtapaHorasMin,
        tempoEtapaHorasMax: dto.tempoEtapaHorasMax,
        ordemServico: dto.ordemServico,
        erpCodigoPedido: dto.erpCodigoPedido,
        numOsExterno: dto.numOsExterno,
        numeroVistoria: dto.numeroVistoria,
        origemRegistro: dto.origemRegistro,
        idArea: dto.idArea,
        idComponente: dto.idComponente,
        idSintoma: dto.idSintoma,
        modoRelatorioResumo: true,
      },
    );

    if (!listagem.data.length) {
      throw new BadRequestException(
        'Nenhuma irregularidade encontrada com os filtros informados.',
      );
    }

    const filtrosAplicados = await this.buildFiltrosTextoRelatorioResumo(
      dto,
      statuses,
    );
    const config = await this.configuracaoRepository.findOne({ where: {} });
    const tipoImpressao =
      dto.tipoImpressao === 'SINTETICA' ? 'SINTETICA' : 'ANALITICA';
    return this.buildPdfRelatorioResumoGestaoOs(
      listagem.data,
      new Date(),
      actor?.nome,
      config,
      filtrosAplicados,
      tipoImpressao,
    );
  }

  private async buildFiltrosTextoRelatorioResumo(
    dto: RelatorioResumoGestaoOsDto,
    statusesEfetivos: StatusIrregularidade[],
  ): Promise<string> {
    const partes: string[] = [];

    const todosStatus =
      !dto.status?.length ||
      dto.status.length >= Object.values(StatusIrregularidade).length;
    if (todosStatus) {
      partes.push('Status: Todos');
    } else {
      partes.push(
        `Status: ${statusesEfetivos
          .map((s) => this.labelStatusIrregularidade(s))
          .join(', ')}`,
      );
    }

    if (dto.idEmpresaManutencao) {
      const emp = await this.empresaTerceiraRepository.findOne({
        where: { id: dto.idEmpresaManutencao },
        select: ['id', 'descricao'],
      });
      partes.push(`Empresa: ${emp?.descricao?.trim() || dto.idEmpresaManutencao}`);
    } else {
      partes.push('Empresa: Todas');
    }

    if (dto.idVeiculo) {
      const vei = await this.veiculoRepository.findOne({
        where: { id: dto.idVeiculo },
        select: ['id', 'descricao', 'placa'],
      });
      const label = vei
        ? `${vei.descricao}${vei.placa ? ` (${vei.placa})` : ''}`
        : dto.idVeiculo;
      partes.push(`Veículo: ${label}`);
    } else {
      partes.push('Veículo: Todos');
    }

    if (dto.dataInicio || dto.dataFim) {
      const ref =
        dto.referenciaPeriodo === 'ENTRADA_STATUS'
          ? 'entrada na etapa'
          : 'criação';
      const de = dto.dataInicio || '…';
      const ate = dto.dataFim || '…';
      partes.push(`Período (${ref}): ${de} a ${ate}`);
    }

    const horasMinTxt = this.parseHorasNaoNegativas(dto.tempoEtapaHorasMin);
    const horasMaxTxt = this.parseHorasNaoNegativas(dto.tempoEtapaHorasMax);
    if (horasMinTxt != null || horasMaxTxt != null) {
      partes.push(
        this.formatFiltroTempoEtapaTexto(horasMinTxt, horasMaxTxt),
      );
    }

    if (dto.ordemServico) partes.push(`OS: ${dto.ordemServico}`);
    if (dto.erpCodigoPedido) partes.push(`OS OMNI: ${dto.erpCodigoPedido}`);
    if (dto.numOsExterno) partes.push(`OS BRT: ${dto.numOsExterno}`);
    if (dto.numeroVistoria) partes.push(`Vistoria: ${dto.numeroVistoria}`);

    if (dto.idArea) {
      const area = await this.areaRepository.findOne({
        where: { id: dto.idArea },
        select: ['id', 'nome'],
      });
      partes.push(`Área: ${area?.nome?.trim() || dto.idArea}`);
    }
    if (dto.idComponente) {
      const comp = await this.componenteRepository.findOne({
        where: { id: dto.idComponente },
        select: ['id', 'nome'],
      });
      partes.push(`Componente: ${comp?.nome?.trim() || dto.idComponente}`);
    }
    if (dto.idSintoma) {
      const sint = await this.sintomaRepository.findOne({
        where: { id: dto.idSintoma },
        select: ['id', 'descricao'],
      });
      partes.push(`Sintoma: ${sint?.descricao?.trim() || dto.idSintoma}`);
    }

    if (dto.gravidade?.length) {
      partes.push(
        `Gravidade: ${dto.gravidade
          .map((g) => this.labelGravidadeIrregularidade(g))
          .join(', ')}`,
      );
    }

    if (dto.origemRegistro === 'SOS_WEB') {
      partes.push('Origem: SOS');
    } else if (dto.origemRegistro === 'MOBILE') {
      partes.push('Origem: Mobile');
    }

    return partes.join(' · ');
  }

  async iniciarManutencaoLote(
    dto: IniciarManutencaoLoteDto,
    actor?: { id?: string; idEmpresa?: string; nome?: string },
  ): Promise<RelatorioManutencaoExecucaoDto> {
    const { empresa, irregularidades } =
      await this.loadIrregularidadesLoteParaManutencao(dto);
    const config = await this.configuracaoRepository.findOne({ where: {} });
    return this.manutencaoEnvioService.executarEnvioLote(
      empresa,
      irregularidades,
      config,
      this.buildManutencaoEnvioContext(actor),
    );
  }

  async concluirManutencao(
    id: string,
    dto: ValidacaoFinalIrregularidadeDto,
    actor?: {
      id?: string;
      idEmpresa?: string;
      idsEmpresasManutencao?: string[];
    },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.EM_MANUTENCAO],
      'Somente irregularidades em manutenção podem ser concluídas',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idsEmpresasManutencao);
    // Conclusão manual permitida também na trilha BRT (RN-VIS-006 opção A).
    // Não procede permanece bloqueado via assertManutencaoManualPermitida.
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        irregularidade.statusAtual = StatusIrregularidade.CONCLUIDA;
        irregularidade.concluidaManutencaoEm = new Date();
        irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
        irregularidade.resolvido = false;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: StatusIrregularidade.EM_MANUTENCAO,
            statusDestino: StatusIrregularidade.CONCLUIDA,
            acao: 'concluir_manutencao',
            idUsuario: actor?.id,
            idEmpresaEvento: actor?.idEmpresa,
            observacao: dto.observacao,
          },
        );
        return saved;
      },
    );
  }

  async marcarNaoProcede(
    id: string,
    dto: NaoProcedeIrregularidadeDto,
    actor?: {
      id?: string;
      idEmpresa?: string;
      idsEmpresasManutencao?: string[];
    },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.EM_MANUTENCAO],
      'Somente irregularidades em manutenção podem ser marcadas como não procede',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idsEmpresasManutencao);
    this.assertManutencaoManualPermitida(irregularidade);
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        const empresaDevolvida = irregularidade.idEmpresaManutencao;
        irregularidade.statusAtual = StatusIrregularidade.NAO_PROCEDE;
        irregularidade.motivoNaoProcede = dto.motivoNaoProcede;
        irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
        irregularidade.resolvido = false;
        (irregularidade as { idEmpresaManutencao: string | null }).idEmpresaManutencao =
          null;
        irregularidade.controleIntegracaoApi = false;
        irregularidade.osOrigAtual = null;
        irregularidade.numOsExternoAtual = null;
        irregularidade.ultimoErroIntegracao = null;
        irregularidade.ultimoErroIntegracaoEm = null;
        irregularidade.statusBrtAtual = null;
        irregularidade.statusBrtAtualizadoEm = null;
        irregularidade.statusBrtComentario = null;
        irregularidade.erpCodigoPedido = null;
        irregularidade.erpEnviadoEm = null;
        irregularidade.erpUltimoErro = null;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: StatusIrregularidade.EM_MANUTENCAO,
            statusDestino: StatusIrregularidade.NAO_PROCEDE,
            acao: 'marcar_nao_procede',
            idUsuario: actor?.id,
            idEmpresaEvento: empresaDevolvida ?? actor?.idEmpresa,
            observacao: dto.motivoNaoProcede,
          },
        );
        return saved;
      },
    );
  }

  async validarFinal(
    id: string,
    dto: ValidacaoFinalIrregularidadeDto,
    actor?: {
      id?: string;
      idEmpresa?: string;
      idsEmpresasManutencao?: string[];
    },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.CONCLUIDA],
      'Somente irregularidades concluídas podem ser validadas',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idsEmpresasManutencao);
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        const origem = irregularidade.statusAtual;
        irregularidade.statusAtual = StatusIrregularidade.VALIDADA;
        irregularidade.validadaEm = new Date();
        irregularidade.resolvido = true;
        irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: origem,
            statusDestino: StatusIrregularidade.VALIDADA,
            acao: 'validar_final',
            idUsuario: actor?.id,
            idEmpresaEvento: actor?.idEmpresa,
            observacao: dto.observacao,
          },
        );
        return saved;
      },
    );
  }

  async reprovarValidacaoFinal(
    id: string,
    dto: ReprovarValidacaoFinalIrregularidadeDto,
    actor?: {
      id?: string;
      idEmpresa?: string;
      idsEmpresasManutencao?: string[];
    },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.CONCLUIDA],
      'Somente irregularidades concluídas podem ser reprovadas',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idsEmpresasManutencao);
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        const origem = irregularidade.statusAtual;
        const empresaAnterior = irregularidade.idEmpresaManutencao;
        irregularidade.statusAtual = StatusIrregularidade.RETRABALHO_GARANTIA;
        irregularidade.resolvido = false;
        // Volta ao Tratamento sem vínculo de empresa (igual NAO_PROCEDE); reenvio escolhe de novo.
        (irregularidade as { idEmpresaManutencao: string | null }).idEmpresaManutencao =
          null;
        irregularidade.controleIntegracaoApi = false;
        irregularidade.osOrigAtual = null;
        irregularidade.numOsExternoAtual = null;
        irregularidade.ultimoErroIntegracao = null;
        irregularidade.ultimoErroIntegracaoEm = null;
        // Snapshot da OS anterior (ex.: Disponivel na Validacao) nao deve aparecer no Retrabalho.
        irregularidade.statusBrtAtual = null;
        irregularidade.statusBrtAtualizadoEm = null;
        irregularidade.statusBrtComentario = null;
        irregularidade.erpCodigoPedido = null;
        irregularidade.erpEnviadoEm = null;
        irregularidade.erpUltimoErro = null;
        irregularidade.observacao = dto.observacao;
        const saved = await manager
          .getRepository(Irregularidade)
          .save(irregularidade);
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: origem,
            statusDestino: StatusIrregularidade.RETRABALHO_GARANTIA,
            acao: 'reprovar_validacao_final',
            idUsuario: actor?.id,
            idEmpresaEvento: empresaAnterior ?? actor?.idEmpresa,
            observacao: dto.observacao,
          },
        );
        return saved;
      },
    );
  }

  async listImages(
    vistoriaId: string,
    irregularidadeId?: string,
  ): Promise<IrregularidadeImagemResumoDto[]> {
    await this.getVistoriaOrFail(vistoriaId);
    const irregularidades = await this.irregularidadeRepository.find({
      where: irregularidadeId
        ? { idVistoria: vistoriaId, id: irregularidadeId }
        : { idVistoria: vistoriaId },
      relations: ['midias'],
    });

    return irregularidades.map((item) => {
      const imagens = (item.midias ?? []).filter((m) => m.tipo === 'imagem');
      return {
        idirregularidade: item.id,
        imagens: imagens.map((m) => ({
          nomeArquivo: m.nomeArquivo,
          tamanho: Number(m.tamanho),
          dadosBase64: m.dadosBytea.toString('base64'),
        })),
      };
    });
  }

  async listAudios(
    vistoriaId: string,
    irregularidadeId?: string,
  ): Promise<IrregularidadeAudioResumoDto[]> {
    await this.getVistoriaOrFail(vistoriaId);
    const irregularidades = await this.irregularidadeRepository.find({
      where: irregularidadeId
        ? { idVistoria: vistoriaId, id: irregularidadeId }
        : { idVistoria: vistoriaId },
      relations: ['midias'],
    });

    return irregularidades.map((item) => {
      const audios = (item.midias ?? []).filter((m) => m.tipo === 'audio');
      return {
        idirregularidade: item.id,
        audios: audios.map((m) => ({
          id: m.id,
          nomeArquivo: m.nomeArquivo,
          mimeType: m.mimeType,
          dadosBase64: m.dadosBytea.toString('base64'),
          duracaoMs: m.duracaoMs ?? undefined,
        })),
      };
    });
  }

  async uploadImages(
    irregularidadeId: string,
    files: Express.Multer.File[],
    permissions?: Set<string>,
  ): Promise<IrregularidadeMidia[]> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);
    await this.assertSosMidiaPermission(irregularidadeId, permissions);

    const matriz = await this.ensureMatriz(
      irregularidade.idComponente,
      irregularidade.idSintoma,
    );
    if (matriz.exigeFoto && (!files || files.length === 0)) {
      throw new BadRequestException('Foto obrigatória para a irregularidade');
    }

    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        await manager
          .getRepository(IrregularidadeMidia)
          .delete({ idIrregularidade: irregularidadeId, tipo: 'imagem' });

        const midias = (files ?? []).map((file) => {
          const nomePadrao = this.buildMidiaFilename(
            irregularidade.numeroIrregularidade,
            'imagem',
            file.originalname,
          );
          const otimizada = this.otimizarImagemParaArmazenamento(
            file.buffer,
            file.mimetype,
            nomePadrao,
          );
          return manager.getRepository(IrregularidadeMidia).create({
            idIrregularidade: irregularidadeId,
            tipo: 'imagem' as const,
            nomeArquivo: otimizada.nomeArquivo,
            mimeType: otimizada.mimeType,
            tamanho: otimizada.buffer.length,
            dadosBytea: otimizada.buffer,
          });
        });

        if (midias.length === 0) {
          return [];
        }

        return manager.getRepository(IrregularidadeMidia).save(midias);
      },
    );
  }

  async uploadAudio(
    irregularidadeId: string,
    file: Express.Multer.File,
    duracaoMs?: number,
    permissions?: Set<string>,
  ): Promise<IrregularidadeMidia> {
    if (!file) {
      throw new BadRequestException('Arquivo de áudio não enviado');
    }

    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);
    await this.assertSosMidiaPermission(irregularidadeId, permissions);

    const matriz = await this.ensureMatriz(
      irregularidade.idComponente,
      irregularidade.idSintoma,
    );
    if (!matriz.permiteAudio) {
      throw new BadRequestException(
        'Áudio não permitido para esta irregularidade',
      );
    }

    const midia = this.midiaRepository.create({
      idIrregularidade: irregularidadeId,
      tipo: 'audio',
      nomeArquivo: this.buildMidiaFilename(
        irregularidade.numeroIrregularidade,
        'audio',
        file.originalname,
      ),
      mimeType: file.mimetype,
      tamanho: file.size,
      dadosBytea: file.buffer,
      duracaoMs: duracaoMs ?? null,
    });
    return this.midiaRepository.save(midia);
  }

  async removeAudio(
    irregularidadeId: string,
    permissions?: Set<string>,
  ): Promise<void> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);
    await this.assertSosMidiaPermission(irregularidadeId, permissions);
    await this.midiaRepository.delete({
      idIrregularidade: irregularidadeId,
      tipo: 'audio',
    });
  }

  async removeMidia(midiaId: string, permissions?: Set<string>): Promise<void> {
    const midia = await this.midiaRepository.findOne({
      where: { id: midiaId },
    });
    if (!midia) {
      throw new NotFoundException('Mídia não encontrada');
    }
    await this.ensureVistoriaAberta(
      (await this.getIrregularidadeOrFail(midia.idIrregularidade)).idVistoria,
    );
    await this.assertSosMidiaPermission(midia.idIrregularidade, permissions);
    await this.midiaRepository.remove(midia);
  }

  private otimizarImagemParaArmazenamento(
    buffer: Buffer,
    mimeType: string,
    nomeArquivo: string,
  ): { buffer: Buffer; mimeType: string; nomeArquivo: string } {
    return { buffer, mimeType, nomeArquivo };
  }

  private formatDateTimeBr(dateInput: string | Date): string {
    return new Date(dateInput).toLocaleString('pt-BR');
  }

  private buildRelatorioAttachmentFilename(empresa: string): string {
    const empresaSanitizada =
      this.sanitizeForFilename(empresa).slice(0, 40) || 'empresa';
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14);
    return `relatorio-manutencao_${empresaSanitizada}_${timestamp}.pdf`;
  }

  private buildMidiaFilename(
    numeroIrregularidade: number | undefined,
    tipo: 'imagem' | 'audio',
    originalName: string,
  ): string {
    const numero = Number.isFinite(numeroIrregularidade)
      ? String(numeroIrregularidade)
      : 'sem-os';
    const ext =
      this.extractFileExtension(originalName) ||
      (tipo === 'audio' ? 'mp3' : 'jpg');
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14);
    const baseTipo = tipo === 'audio' ? 'audio' : 'img';
    return `OS-${numero}_${baseTipo}_${timestamp}.${ext}`;
  }

  private extractFileExtension(filename: string): string {
    const clean = filename?.trim() ?? '';
    const idx = clean.lastIndexOf('.');
    if (idx <= 0 || idx === clean.length - 1) {
      return '';
    }
    const ext = clean.slice(idx + 1).toLowerCase();
    return /^[a-z0-9]{1,8}$/.test(ext) ? ext : '';
  }

  private sanitizeForFilename(value: string): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^[-_]+|[-_]+$/g, '')
      .toLowerCase();
  }

  private async resolveEmpresaRelatorioLote(
    irregularidades: Irregularidade[],
  ): Promise<EmpresaTerceira> {
    const idEmpresa = irregularidades
      .map((item) => item.idEmpresaManutencao)
      .find((id): id is string => !!id?.trim());
    if (idEmpresa) {
      const empresa = await this.empresaTerceiraRepository.findOne({
        where: { id: idEmpresa },
      });
      if (empresa) {
        return empresa;
      }
    }
    return { descricao: 'Não vinculada' } as EmpresaTerceira;
  }

  private async loadIrregularidadesLoteParaManutencao(
    dto: IniciarManutencaoLoteDto,
  ): Promise<{
    empresa: EmpresaTerceira;
    irregularidades: Irregularidade[];
  }> {
    const idsUnicos = Array.from(new Set(dto.idsIrregularidades));
    if (idsUnicos.length === 0) {
      throw new BadRequestException('Selecione ao menos uma irregularidade.');
    }

    const empresa = await this.empresaTerceiraRepository.findOne({
      where: { id: dto.idEmpresaManutencao },
    });
    if (!empresa) {
      throw new NotFoundException('Empresa de manutenção não encontrada');
    }

    const irregularidades = await this.irregularidadeRepository.find({
      where: idsUnicos.map((id) => ({ id })),
      relations: [
        'area',
        'componente',
        'sintoma',
        'vista',
        'marcacoes',
        'vistoria',
        'vistoria.veiculo',
        'vistoria.motorista',
        'vistoria.usuario',
        'midias',
      ],
      order: {
        criadoEm: 'ASC',
      },
    });

    if (irregularidades.length !== idsUnicos.length) {
      throw new NotFoundException(
        'Uma ou mais irregularidades selecionadas não foram encontradas.',
      );
    }

    const invalidas = irregularidades.filter(
      (item) => !STATUS_ENVIO_MANUTENCAO.includes(item.statusAtual),
    );
    if (invalidas.length > 0) {
      throw new BadRequestException(
        'Somente irregularidades registradas, em retrabalho/garantia ou não procede podem ser enviadas para manutenção.',
      );
    }

    this.manutencaoEnvioService.assertEscopoEmpresa(empresa, irregularidades);

    if (this.manutencaoEnvioService.usesIntegracaoApi(empresa)) {
      await this.manutencaoEnvioService.assertSelecaoCompletaVistoriasBrt(
        irregularidades,
        empresa,
      );
    }

    return { empresa, irregularidades };
  }

  private formatOsColunasManutencao(item: {
    ordemServico: number;
    erpCodigoPedido?: string;
    numOsExternoAtual?: number | null;
  }): { label: string; value: string }[] {
    const cols = [{ label: 'OS', value: String(item.ordemServico) }];
    const erp = item.erpCodigoPedido?.trim();
    if (erp) {
      cols.push({ label: 'OS OMNI', value: erp });
    }
    if (item.numOsExternoAtual != null) {
      cols.push({ label: 'OS BRT', value: String(item.numOsExternoAtual) });
    }
    return cols;
  }

  private buildResumoRelatorioManutencao(
    empresa: EmpresaTerceira,
    irregularidades: Irregularidade[],
    emitidoEm: Date,
    emitidoPor?: string | null,
  ): RelatorioManutencaoResumoDto {
    const porVeiculoMap = new Map<
      string,
      RelatorioManutencaoResumoDto['porVeiculo'][number]
    >();
    for (const item of irregularidades) {
      const veiculo = item.vistoria?.veiculo?.descricao ?? 'Não informado';
      const chave = veiculo.toUpperCase();
      if (!porVeiculoMap.has(chave)) {
        porVeiculoMap.set(chave, {
          veiculo,
          placa: item.vistoria?.veiculo?.placa ?? undefined,
          modelo: item.vistoria?.veiculo?.modeloVeiculo?.nome ?? undefined,
          itens: [],
        });
      }
      porVeiculoMap.get(chave)?.itens.push({
        id: item.id,
        ordemServico: item.numeroIrregularidade,
        erpCodigoPedido: item.erpCodigoPedido?.trim() || undefined,
        numOsExternoAtual: item.numOsExternoAtual ?? undefined,
        irregularidade: `${item.area?.nome ?? '-'} - ${item.componente?.nome ?? '-'} - ${
          item.sintoma?.descricao ?? '-'
        }`,
        observacao: item.observacao ?? undefined,
        totalImagens: (item.midias ?? []).filter((m) => m.tipo === 'imagem')
          .length,
      });
    }

    const porVeiculo = Array.from(porVeiculoMap.values()).sort((a, b) =>
      a.veiculo.localeCompare(b.veiculo),
    );
    for (const grupo of porVeiculo) {
      grupo.itens.sort((a, b) => a.ordemServico - b.ordemServico);
    }

    const totalAnexos = porVeiculo.reduce(
      (acc, grupo) =>
        acc +
        grupo.itens.reduce((sum, item) => sum + (item.totalImagens || 0), 0),
      0,
    );

    const porNome = emitidoPor?.trim();

    return {
      emitidoEm: emitidoEm.toISOString(),
      emitidoPor: porNome || undefined,
      empresa: empresa.descricao,
      totalIrregularidades: irregularidades.length,
      totalVeiculos: porVeiculo.length,
      totalAnexos,
      porVeiculo,
    };
  }

  private buildHtmlRelatorioManutencao(
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
  ): string {
    const dataEmissao = this.formatDateTimeBr(resumo.emitidoEm);
    const itensHtml = resumo.porVeiculo
      .map((grupo) => {
        const veiculoMeta = [grupo.placa ?? '', grupo.modelo ?? '']
          .filter(Boolean)
          .join(' ');
        const veiculoTitulo = `Veículo: ${grupo.veiculo}${veiculoMeta ? ` ${veiculoMeta}` : ''}`;
        const cards = grupo.itens
          .map((itemResumo) => {
            const irregularidade = irregularidades.find(
              (i) => i.id === itemResumo.id,
            );
            const imagens = (irregularidade?.midias ?? []).filter(
              (m) => m.tipo === 'imagem',
            );
            const localDesc = irregularidade?.vista?.descricao?.trim();
            const imagensHtml =
              imagens.length === 0
                ? '<p class="muted">Sem imagens anexadas.</p>'
                : imagens
                    .map(
                      (imagem) =>
                        `<img class="imagem" src="data:${imagem.mimeType};base64,${imagem.dadosBytea.toString('base64')}" alt="${imagem.nomeArquivo}" />`,
                    )
                    .join('');

            const obsHtml = itemResumo.observacao?.trim()
              ? itemResumo.observacao
              : '<span class="muted">Não informada.</span>';
            const osColunas = this.formatOsColunasManutencao(itemResumo);
            const osColspan = osColunas.length;
            const osValHtml = osColunas
              .map((col) => `<td class="os-valor">${col.label}: ${col.value}</td>`)
              .join('');
            const localRow = localDesc
              ? `<tr><th>Local</th><td colspan="${Math.max(1, osColspan - 1)}">${localDesc}</td></tr>`
              : '';
            return `
              <table class="item-table">
                <tr>
                  <th class="veiculo-titulo" colspan="${osColspan}">${veiculoTitulo}</th>
                </tr>
                <tr>${osValHtml}</tr>
                <tr>
                  <th>Irregularidade</th>
                  <td colspan="${Math.max(1, osColspan - 1)}">${itemResumo.irregularidade}</td>
                </tr>
                <tr>
                  <th>Descrição do problema</th>
                  <td colspan="${Math.max(1, osColspan - 1)}">${obsHtml}</td>
                </tr>
                ${localRow}
                ${imagensHtml ? `<tr><td class="imagens-cell" colspan="${osColspan}"><div class="imagens-wrap">${imagensHtml}</div></td></tr>` : ''}
              </table>
            `;
          })
          .join('');

        return `
          <section class="veiculo-section">
            ${cards}
          </section>
        `;
      })
      .join('');

    return `
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório de Serviço(s)</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
          .topo { border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 18px; text-align: center; }
          .topo h1 { margin: 0; font-size: 22px; }
          .topo p { margin: 4px 0 0; color: #4b5563; }
          .resumo { border: 1px solid #94a3b8; padding: 12px; margin-bottom: 16px; }
          .veiculo-section { margin-bottom: 20px; page-break-before: always; }
          .veiculo-section:first-of-type { page-break-before: auto; }
          @media print {
            .topo { page-break-after: avoid; }
          }
          .item-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
          }
          .item-table th, .item-table td {
            border: 1px solid #94a3b8;
            padding: 6px 8px;
            background: transparent;
            text-align: left;
            vertical-align: middle;
          }
          .item-table th {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: #475569;
            width: 180px;
          }
          .item-table .veiculo-titulo {
            font-size: 13px;
            color: #0f172a;
            text-transform: none;
            letter-spacing: 0;
            width: auto;
          }
          .item-table .os-valor {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
          }
          .item-table td { font-size: 13px; color: #0f172a; }
          .imagens-cell { padding: 8px; }
          .imagens-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
          .imagem { max-width: 100%; width: 260px; height: auto; border: 1px solid #d1d5db; border-radius: 6px; }
          .muted { color: #6b7280; margin: 6px 0 0; }
        </style>
      </head>
      <body>
        <div class="topo">
          <h1>Relatório de Serviço(s)</h1>
          <p>Empresa de manutenção: ${resumo.empresa}</p>
          <p>Emissão: ${dataEmissao}${resumo.emitidoPor ? ` · Usuário: ${resumo.emitidoPor}` : ''}</p>
        </div>
        <div class="resumo">
          <strong>Resumo:</strong>
          ${resumo.totalIrregularidades} irregularidade(s) em ${resumo.totalVeiculos} veículo(s),
          com ${resumo.totalAnexos} anexo(s).
        </div>
        ${itensHtml}
      </body>
      </html>
    `;
  }

  private resolveLogoBuffer(
    configuracao?: Configuracao | null,
  ): Buffer | null {
    const raw = configuracao?.logoRelatorioBytes;
    if (raw) {
      const buf = Buffer.isBuffer(raw) ? raw : Buffer.from(raw);
      if (buf.length > 0) {
        return buf;
      }
    }
    const path = this.resolveLogoRelatorioPath(configuracao?.logoRelatorio);
    if (!path) {
      return null;
    }
    try {
      const fromDisk = readFileSync(path);
      return fromDisk.length > 0 ? fromDisk : null;
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

  private async carregarImagensPdfPorIrregularidade(
    ids: string[],
  ): Promise<Map<string, Buffer[]>> {
    const resultado = new Map<string, Buffer[]>();
    if (ids.length === 0) {
      return resultado;
    }
    const midias = await this.midiaRepository.find({
      where: {
        idIrregularidade: In(ids),
        tipo: 'imagem',
      },
      order: { criadoEm: 'ASC' },
    });
    for (const midia of midias) {
      if (!midia.dadosBytea?.length) {
        continue;
      }
      const atuais = resultado.get(midia.idIrregularidade) ?? [];
      atuais.push(midia.dadosBytea);
      resultado.set(midia.idIrregularidade, atuais);
    }
    return resultado;
  }

  private async carregarMapasPdf(
    idModelo: string | null,
    itens: IrregularidadeHistoricoVeiculoItemDto[],
  ): Promise<MapaPdfVista[]> {
    if (!idModelo) {
      return [];
    }
    const indicePorIrregularidade =
      this.montarIndiceOsPorIrregularidade(itens);
    const porVista = new Map<
      string,
      {
        descricao: string;
        circulos: CirculoMapaPdf[];
      }
    >();
    for (const item of itens) {
      const marcas =
        item.marcacoes && item.marcacoes.length > 0
          ? item.marcacoes
          : item.marcacao
            ? [item.marcacao]
            : [];
      if (marcas.length === 0) {
        continue;
      }
      const indiceOs = indicePorIrregularidade.get(item.id) ?? 1;
      const idVista = marcas[0].idVista;
      const atual = porVista.get(idVista) ?? {
        descricao: marcas[0].descricaoVista || 'Vista',
        circulos: [],
      };
      marcas.forEach((marca, idx) => {
        const ordem = marca.ordem ?? idx;
        atual.circulos.push({
          posXPct: marca.posXPct,
          posYPct: marca.posYPct,
          rotulo: String(item.numeroIrregularidade ?? ''),
          rotuloCirculo: this.rotuloCirculoMarcacao(indiceOs, ordem),
        });
      });
      porVista.set(idVista, atual);
    }

    const mapas: MapaPdfVista[] = [];
    const usados = new Set<string>();
    const vistas = await this.vistaService.listAtivasComImagem(idModelo);
    for (const vista of vistas) {
      usados.add(vista.id);
      mapas.push({
        idVista: vista.id,
        descricao: vista.descricao,
        buffer: vista.buffer,
        circulos: porVista.get(vista.id)?.circulos ?? [],
      });
    }
    for (const [idVista, grupo] of porVista.entries()) {
      if (usados.has(idVista)) {
        continue;
      }
      try {
        const imagem = await this.vistaService.getImagem(idModelo, idVista);
        mapas.push({
          idVista,
          descricao: grupo.descricao,
          buffer: imagem.buffer,
          circulos: grupo.circulos,
        });
      } catch {
        // Vista removida ou sem imagem: ignora no PDF
      }
    }
    for (const mapa of mapas) {
      const recorte = this.detectarRecorteConteudoJpeg(mapa.buffer);
      if (recorte) {
        mapa.recorte = recorte;
      }
    }
    return mapas;
  }

  private async carregarMapasPdfPorHistoricoItens(
    idModelo: string | null,
    itens: IrregularidadeHistoricoVeiculoItemDto[],
  ): Promise<Map<string, MapaPdfIrregularidadeLocal>> {
    const mapas = new Map<string, MapaPdfIrregularidadeLocal>();
    if (!idModelo) {
      return mapas;
    }
    for (const item of itens) {
      const marcas =
        item.marcacoes && item.marcacoes.length > 0
          ? item.marcacoes
          : item.marcacao
            ? [item.marcacao]
            : [];
      if (marcas.length === 0 || !marcas[0].idVista) {
        continue;
      }
      try {
        const imagem = await this.vistaService.getImagem(
          idModelo,
          marcas[0].idVista,
        );
        const recorte = this.detectarRecorteConteudoJpeg(imagem.buffer);
        mapas.set(item.id, {
          descricao: marcas[0].descricaoVista?.trim() || 'Local no veículo',
          buffer: imagem.buffer,
          recorte: recorte ?? undefined,
          pontos: marcas.map((m, ordem) => ({
            posXPct: m.posXPct,
            posYPct: m.posYPct,
            ordem: m.ordem ?? ordem,
          })),
        });
      } catch {
        // Sem imagem da vista: o card segue só com as fotos da irregularidade
      }
    }
    return mapas;
  }

  private async buildPdfPendenciasVeiculo(params: {
    veiculoDescricao: string;
    veiculoPlaca: string;
    filtroArea?: string;
    filtroComponente?: string;
    itens: Array<
      IrregularidadeHistoricoVeiculoItemDto & { imagens: Buffer[] }
    >;
    mapas?: MapaPdfVista[];
    mapasPorItem?: Map<string, MapaPdfIrregularidadeLocal>;
    emitidoEm: Date;
    emitidoPor?: string;
    logoBuffer?: Buffer | null;
    /** Título do relatório (padrão: pendências). */
    titulo?: string;
    /** Campos de capa em cards (ex.: relatório de vistoria — paridade com overlay de conclusão). */
    capaCampos?: Array<{ label: string; value: string; half?: boolean }>;
    emptyMessage?: string;
    omitTotalPendencias?: boolean;
  }): Promise<Buffer> {
    const dataEmissao = this.formatDateTimeBr(params.emitidoEm);
    const logoBuffer =
      params.logoBuffer && params.logoBuffer.length > 0
        ? params.logoBuffer
        : null;
    const marginX = 50;
    const contentTopY = 100;
    const footerBandPt = 92;
    const titulo = params.titulo?.trim() || 'Relatório de Pendências do Veículo';

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        autoFirstPage: false,
        margins: {
          top: marginX,
          left: marginX,
          right: marginX,
          bottom: footerBandPt,
        },
      });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const maxContentY = () => Math.floor(doc.page.maxY());
      const breakPageBody = () => {
        doc.addPage();
        doc.x = marginX;
        doc.y = contentTopY;
      };
      const normalizeCursorY = () => {
        const lim = maxContentY();
        if (doc.y > lim) {
          doc.y = lim;
        }
      };
      const ensureTextBlock = (minHeight: number) => {
        normalizeCursorY();
        const lim = maxContentY();
        if (Math.ceil(doc.y + minHeight) > lim) {
          breakPageBody();
        }
      };
      const measureTextHeight = (
        text: string,
        fontName: string,
        fontSize: number,
        width: number,
      ): number => {
        doc.font(fontName).fontSize(fontSize);
        return doc.heightOfString(text, { width });
      };

      const IMG_GAP_AFTER = 12;
      const IMG_GRID_GAP_X = 10;
      const IMG_GRID_GAP_Y = 10;
      const IMG_GRID_CELL_H = 200;
      const IMG_GRID_COLS = 3;
      const getImageGridLayout = (count: number, contentWidth: number) => {
        const rows = Math.ceil(count / IMG_GRID_COLS);
        const cellW = Math.floor(
          (contentWidth - IMG_GRID_GAP_X * (IMG_GRID_COLS - 1)) / IMG_GRID_COLS,
        );
        const gridH =
          rows > 0 ? rows * IMG_GRID_CELL_H + (rows - 1) * IMG_GRID_GAP_Y : 0;
        return { rows, cellW, gridH };
      };

      doc.addPage();
      const innerW = doc.page.width - marginX * 2;
      const headerRowTop = 42;
      const logoBoxW = 132;
      const logoBoxH = 48;

      if (logoBuffer) {
        try {
          doc.image(logoBuffer, marginX, headerRowTop, {
            fit: [logoBoxW, logoBoxH],
          });
        } catch {
          // Ignora falha de logo
        }
      }

      doc
        .font('Helvetica')
        .fontSize(17)
        .fillColor('#0f172a')
        .text(titulo, marginX, headerRowTop + 10, {
          width: innerW,
          align: 'center',
        });
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .fillColor('#0f172a')
        .text(
          `Veículo: ${params.veiculoDescricao} · Placa: ${params.veiculoPlaca}`,
          marginX,
          doc.y + 5,
          { width: innerW, align: 'center' },
        );
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#64748b')
        .text(`Emissão: ${dataEmissao}`, marginX, doc.y + 4, {
          width: innerW,
          align: 'center',
        });

      const headerTextosFimY = doc.y;
      doc.x = marginX;
      doc.y = Math.max(headerTextosFimY + 16, headerRowTop + logoBoxH + 12);

      const filtros: string[] = [];
      if (params.filtroArea) {
        filtros.push(`Área: ${params.filtroArea}`);
      }
      if (params.filtroComponente) {
        filtros.push(`Componente: ${params.filtroComponente}`);
      }
      if (filtros.length > 0) {
        ensureTextBlock(28);
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#0f172a')
          .text('Filtros aplicados', { width: innerW });
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#334155')
          .text(filtros.join(' · '), { width: innerW });
        doc.moveDown(0.6);
      }

      if (params.capaCampos && params.capaCampos.length > 0) {
        const gap = 6;
        const padX = 7;
        const padY = 5;
        const labelSize = 7;
        const valueSize = 9;
        const labelGap = 2;
        const colW = (innerW - gap) / 2;
        const radius = 5;
        const bg = '#f1f5f9';
        const labelColor = '#64748b';
        const valueColor = '#0f172a';

        const measureCardH = (value: string, width: number): number => {
          const textW = Math.max(20, width - padX * 2);
          doc.font('Helvetica-Bold').fontSize(labelSize);
          const labelH = doc.currentLineHeight();
          doc.font('Helvetica-Bold').fontSize(valueSize);
          const valueH = doc.heightOfString(value || '-', { width: textW });
          return padY * 2 + labelH + labelGap + valueH;
        };

        const drawCard = (
          x: number,
          y: number,
          width: number,
          label: string,
          value: string,
          height: number,
        ) => {
          doc
            .roundedRect(x, y, width, height, radius)
            .fillColor(bg)
            .fill();
          const textW = Math.max(20, width - padX * 2);
          doc
            .font('Helvetica-Bold')
            .fontSize(labelSize)
            .fillColor(labelColor)
            .text(label.toUpperCase(), x + padX, y + padY, {
              width: textW,
              lineBreak: false,
            });
          const afterLabelY = y + padY + doc.currentLineHeight() + labelGap;
          doc
            .font('Helvetica-Bold')
            .fontSize(valueSize)
            .fillColor(valueColor)
            .text(value || '-', x + padX, afterLabelY, { width: textW });
        };

        let cursorY = doc.y;
        let col = 0;
        let rowMaxH = 0;

        const flushHalfRow = () => {
          if (col > 0) {
            cursorY += rowMaxH + gap;
            col = 0;
            rowMaxH = 0;
          }
        };

        for (const campo of params.capaCampos) {
          const half = !!campo.half;
          const width = half ? colW : innerW;
          const height = measureCardH(campo.value, width);

          if (!half) {
            flushHalfRow();
            ensureTextBlock(height + gap);
            cursorY = doc.y;
            drawCard(
              marginX,
              cursorY,
              width,
              campo.label,
              campo.value,
              height,
            );
            cursorY += height + gap;
            doc.x = marginX;
            doc.y = cursorY;
            continue;
          }

          if (col === 0) {
            ensureTextBlock(height + gap);
            cursorY = doc.y;
          }

          const x = col === 0 ? marginX : marginX + colW + gap;
          drawCard(x, cursorY, width, campo.label, campo.value, height);
          doc.x = marginX;
          doc.y = cursorY;
          rowMaxH = Math.max(rowMaxH, height);
          col += 1;
          if (col >= 2) {
            cursorY += rowMaxH + gap;
            col = 0;
            rowMaxH = 0;
            doc.x = marginX;
            doc.y = cursorY;
          }
        }
        flushHalfRow();
        doc.x = marginX;
        doc.y = cursorY;
        doc.moveDown(0.2);
      }

      if (!params.omitTotalPendencias) {
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#334155')
          .text(`Total de pendências: ${params.itens.length}`, { width: innerW });
        doc.moveDown(0.6);
      } else if (params.itens.length > 0) {
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#334155')
          .text(
            `Irregularidades registradas: ${params.itens.length}`,
            { width: innerW },
          );
        doc.moveDown(0.6);
      }

      const mapas = params.mapas ?? [];
      const MAPAS_POR_PAGINA = 4;
      const ASPECT_BAIXA = 0.55;
      const TITLE_H = 12;
      const LEGEND_LINE_H = 11;
      const CELL_PAD = 4;
      const GAP_X = 8;
      const GAP_Y = 6;
      const MAX_ALTA_H = 158;
      const MIN_LATERAL_H = 58;

      const dimensoesUteis = (mapa: MapaPdfVista): { width: number; height: number } => {
        if (mapa.recorte) {
          return { width: mapa.recorte.width, height: mapa.recorte.height };
        }
        const size = this.lerDimensoesJpeg(mapa.buffer);
        return {
          width: size?.width || 1,
          height: size?.height || 1,
        };
      };
      const ehImagemBaixa = (mapa: MapaPdfVista): boolean => {
        const dim = dimensoesUteis(mapa);
        return dim.height / dim.width < ASPECT_BAIXA;
      };
      const alturaNatural = (mapa: MapaPdfVista, boxW: number): number => {
        const dim = dimensoesUteis(mapa);
        return Math.max(36, boxW * (dim.height / dim.width));
      };
      const montarLinhas = (lote: MapaPdfVista[]) => {
        const linhas: Array<{
          kind: 'full' | 'pair' | 'single';
          items: MapaPdfVista[];
        }> = [];
        let pendenteAlta: MapaPdfVista | null = null;
        for (const mapa of lote) {
          if (ehImagemBaixa(mapa)) {
            if (pendenteAlta) {
              linhas.push({ kind: 'single', items: [pendenteAlta] });
              pendenteAlta = null;
            }
            linhas.push({ kind: 'full', items: [mapa] });
          } else if (pendenteAlta) {
            linhas.push({ kind: 'pair', items: [pendenteAlta, mapa] });
            pendenteAlta = null;
          } else {
            pendenteAlta = mapa;
          }
        }
        if (pendenteAlta) {
          linhas.push({ kind: 'single', items: [pendenteAlta] });
        }
        return linhas;
      };
      const desenharCelulaMapa = (
        mapa: MapaPdfVista,
        x: number,
        y: number,
        cellW: number,
        cellH: number,
      ) => {
        const hasLegend = mapa.circulos.length > 0;
        const legendH = hasLegend ? LEGEND_LINE_H : 0;
        doc.save();
        doc
          .lineWidth(0.7)
          .strokeColor('#cbd5e1')
          .roundedRect(x, y, cellW, cellH, 5)
          .stroke();
        doc.restore();
        doc.font('Helvetica-Bold').fontSize(8).fillColor('#0f172a');
        const tituloVista = this.truncatePdfTextToWidth(
          doc,
          mapa.descricao,
          cellW - CELL_PAD * 2,
        );
        doc.text(tituloVista, x + CELL_PAD, y + 4, { lineBreak: false });
        const imgBoxY = y + TITLE_H + 2;
        const imgBoxH = Math.max(
          24,
          cellH - TITLE_H - legendH - CELL_PAD - 4,
        );
        this.desenharMapaVistaNoPdf(doc, {
          buffer: mapa.buffer,
          recorte: mapa.recorte,
          x: x + CELL_PAD,
          y: imgBoxY,
          boxW: cellW - CELL_PAD * 2,
          boxH: imgBoxH,
          circulos: mapa.circulos,
        });
        if (hasLegend) {
          doc.font('Helvetica').fontSize(7).fillColor('#334155');
          const legend = this.truncatePdfTextToWidth(
            doc,
            this.formatarLegendaOsPdf(mapa.circulos),
            cellW - CELL_PAD * 2,
          );
          doc.text(legend, x + CELL_PAD, y + cellH - legendH - 3, {
            lineBreak: false,
          });
        }
      };
      const desenharGradeMapas = (lote: MapaPdfVista[]) => {
        const linhas = montarLinhas(lote);
        const gridTop = doc.y;
        const availableH = Math.max(160, maxContentY() - gridTop);
        const halfW = (innerW - GAP_X) / 2;
        const desejadas = linhas.map((linha) => {
          if (linha.kind === 'full') {
            const imgH = alturaNatural(
              linha.items[0],
              innerW - CELL_PAD * 2,
            );
            const legendH = linha.items[0].circulos.length ? LEGEND_LINE_H : 0;
            return Math.max(
              MIN_LATERAL_H,
              TITLE_H + imgH + legendH + CELL_PAD + 4,
            );
          }
          const boxW = halfW - CELL_PAD * 2;
          const imgH = Math.max(
            ...linha.items.map((item) => alturaNatural(item, boxW)),
          );
          const legendH = linha.items.some((item) => item.circulos.length)
            ? LEGEND_LINE_H
            : 0;
          return Math.min(
            MAX_ALTA_H,
            TITLE_H + imgH + legendH + CELL_PAD + 4,
          );
        });
        const gaps = GAP_Y * Math.max(0, linhas.length - 1);
        const disponivel = Math.max(120, availableH - gaps);
        const alturas = desejadas.slice();
        const isLateral = (idx: number) => linhas[idx].kind === 'full';
        const soma = () => alturas.reduce((acc, h) => acc + h, 0);
        if (soma() > disponivel) {
          const idxLat = alturas
            .map((_, i) => i)
            .filter((i) => isLateral(i));
          const idxOutras = alturas
            .map((_, i) => i)
            .filter((i) => !isLateral(i));
          const somaLat = idxLat.reduce((acc, i) => acc + alturas[i], 0);
          const somaOutras = idxOutras.reduce((acc, i) => acc + alturas[i], 0);
          const restoParaOutras = disponivel - somaLat;
          if (idxOutras.length > 0 && restoParaOutras >= 72 * idxOutras.length) {
            const fator = restoParaOutras / somaOutras;
            for (const i of idxOutras) {
              alturas[i] *= fator;
            }
          } else {
            const fator = disponivel / soma();
            for (let i = 0; i < alturas.length; i += 1) {
              alturas[i] *= isLateral(i)
                ? Math.max(fator, 0.72)
                : fator;
            }
            const extra = soma() - disponivel;
            if (extra > 0 && idxOutras.length > 0) {
              const corte = extra / idxOutras.length;
              for (const i of idxOutras) {
                alturas[i] = Math.max(64, alturas[i] - corte);
              }
            }
          }
        }
        let y = gridTop;
        linhas.forEach((linha, idx) => {
          const rowH = alturas[idx];
          if (linha.kind === 'full') {
            desenharCelulaMapa(linha.items[0], marginX, y, innerW, rowH);
          } else if (linha.kind === 'pair') {
            desenharCelulaMapa(linha.items[0], marginX, y, halfW, rowH);
            desenharCelulaMapa(
              linha.items[1],
              marginX + halfW + GAP_X,
              y,
              halfW,
              rowH,
            );
          } else {
            desenharCelulaMapa(linha.items[0], marginX, y, halfW, rowH);
          }
          y += rowH + GAP_Y;
        });
        doc.x = marginX;
        doc.y = y;
        normalizeCursorY();
      };

      if (mapas.length > 0) {
        ensureTextBlock(36);
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#0f172a')
          .text('Mapa de avaria', { width: innerW });
        doc.moveDown(0.3);
        for (let i = 0; i < mapas.length; i += MAPAS_POR_PAGINA) {
          if (i > 0) {
            breakPageBody();
            doc
              .font('Helvetica-Bold')
              .fontSize(12)
              .fillColor('#0f172a')
              .text('Mapa de avaria', { width: innerW });
            doc.moveDown(0.3);
          }
          desenharGradeMapas(mapas.slice(i, i + MAPAS_POR_PAGINA));
        }
        if (params.itens.length > 0) {
          breakPageBody();
        }
      }

      if (params.itens.length === 0) {
        ensureTextBlock(24);
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#64748b')
          .text(
            params.emptyMessage?.trim() ||
              'Nenhuma irregularidade pendente para os filtros informados.',
            { width: innerW },
          );
      }

      const indicePorIrregularidade = this.montarIndiceOsPorIrregularidade(
        params.itens,
      );

      for (const item of params.itens) {
        const tituloItem = `${item.nomeArea ?? 'Área'} - ${item.nomeComponente ?? 'Componente'} - ${item.descricaoSintoma ?? 'Sintoma'}`;
        const vistoriaLinha = `Vistoria: ${item.numeroVistoria ?? '-'} (${this.formatDateTimeBr(item.datavistoria)})`;
        const obsTxt = item.observacao?.trim() || 'Não informada.';
        const imagens = item.imagens;
        const mapaLocal = params.mapasPorItem?.get(item.id);
        const indiceOsItem = indicePorIrregularidade.get(item.id) ?? 1;
        const cardPadX = 12;
        const cardPadY = 10;
        const cardInnerW = innerW - cardPadX * 2;

        const jpegMapa = mapaLocal
          ? this.lerDimensoesJpeg(mapaLocal.buffer)
          : null;
        const jpegW = jpegMapa?.width || cardInnerW;
        const jpegH = jpegMapa?.height || 80;
        const recorte = mapaLocal?.recorte;
        const recorteBaixa = !!(
          recorte && recorte.height / recorte.width < 0.55
        );
        const mapaBaixa = recorteBaixa || jpegH / jpegW < 0.55;
        const mapaUtilW = mapaBaixa ? recorte?.width || jpegW : jpegW;
        const mapaUtilH = mapaBaixa ? recorte?.height || jpegH : jpegH;
        let mapaBoxW = 0;
        let mapaBoxH = 0;
        if (mapaLocal) {
          if (mapaBaixa) {
            mapaBoxW = cardInnerW;
            mapaBoxH = Math.min(
              100,
              Math.max(56, mapaBoxW * (mapaUtilH / mapaUtilW)),
            );
          } else {
            const maxW = 210;
            const maxH = 210;
            const escala = Math.min(maxW / mapaUtilW, maxH / mapaUtilH);
            mapaBoxW = Math.max(96, mapaUtilW * escala);
            mapaBoxH = Math.max(96, mapaUtilH * escala);
          }
        }
        const fotosAoLado =
          !!mapaLocal && !mapaBaixa && imagens.length > 0;
        const imageLayout = getImageGridLayout(
          imagens.length,
          fotosAoLado
            ? Math.max(120, cardInnerW - mapaBoxW - 12)
            : cardInnerW,
        );
        const imagemLinhaFallback = 'Sem imagens anexadas.';
        const hTitulo = measureTextHeight(
          tituloItem,
          'Helvetica-Bold',
          10,
          cardInnerW,
        );
        const hVistoria = measureTextHeight(
          vistoriaLinha,
          'Helvetica',
          9,
          cardInnerW,
        );
        const hObs = measureTextHeight(
          `Observação: ${obsTxt}`,
          'Helvetica',
          9,
          cardInnerW,
        );
        const hImgs =
          imagens.length > 0
            ? fotosAoLado
              ? 0
              : imageLayout.gridH
            : measureTextHeight(
                imagemLinhaFallback,
                'Helvetica',
                9,
                cardInnerW,
              );
        const hMapa = mapaLocal ? 14 + mapaBoxH + 8 : 0;
        const hMidia = fotosAoLado
          ? Math.max(hMapa, mapaBoxH + 14)
          : hMapa + hImgs;
        const requiredH =
          cardPadY * 2 + hTitulo + 5 + hVistoria + 5 + hObs + 8 + hMidia;
        ensureTextBlock(requiredH);

        const cardX = marginX;
        const cardY = doc.y;
        const cardTextX = cardX + cardPadX;
        doc.x = cardTextX;
        doc.y = cardY + cardPadY;
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#0f172a')
          .text(tituloItem, { width: cardInnerW });
        doc.moveDown(0.15);
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#475569')
          .text(vistoriaLinha, { width: cardInnerW });
        doc.moveDown(0.15);
        doc
          .font('Helvetica')
          .fontSize(9)
          .fillColor('#334155')
          .text(`Observação: ${obsTxt}`, { width: cardInnerW });
        doc.moveDown(0.35);

        if (mapaLocal) {
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#334155')
            .text(`Local: ${mapaLocal.descricao}`, { width: cardInnerW });
          const mapY = doc.y + 3;
          this.desenharMapaVistaNoPdf(doc, {
            buffer: mapaLocal.buffer,
            recorte: mapaBaixa ? mapaLocal.recorte : undefined,
            x: cardTextX,
            y: mapY,
            boxW: mapaBoxW,
            boxH: mapaBoxH,
            circulos: mapaLocal.pontos.map((ponto) => ({
              posXPct: ponto.posXPct,
              posYPct: ponto.posYPct,
              rotulo: '',
              rotuloCirculo: this.rotuloCirculoMarcacao(
                indiceOsItem,
                ponto.ordem,
              ),
            })),
          });
          doc.save();
          doc
            .lineWidth(0.6)
            .strokeColor('#e2e8f0')
            .roundedRect(cardTextX, mapY, mapaBoxW, mapaBoxH, 4)
            .stroke();
          doc.restore();

          if (fotosAoLado) {
            const gapMapa = 12;
            const fotoAreaX = cardTextX + mapaBoxW + gapMapa;
            const fotoAreaW = Math.max(80, cardInnerW - mapaBoxW - gapMapa);
            const cols = Math.min(2, imagens.length);
            const rows = Math.ceil(imagens.length / cols);
            const cellW = Math.floor((fotoAreaW - 8 * (cols - 1)) / cols);
            const cellH = Math.floor((mapaBoxH - 8 * (rows - 1)) / rows);
            for (let idx = 0; idx < imagens.length; idx += 1) {
              const row = Math.floor(idx / cols);
              const col = idx % cols;
              const x = fotoAreaX + col * (cellW + 8);
              const y = mapY + row * (cellH + 8);
              try {
                doc.image(imagens[idx], x, y, {
                  fit: [cellW, cellH],
                  align: 'center',
                  valign: 'center',
                });
              } catch {
                doc
                  .fontSize(8)
                  .fillColor('#b91c1c')
                  .text('Falha na imagem.', x, y, { width: cellW });
              }
            }
            doc.x = cardTextX;
            doc.y = mapY + mapaBoxH + 8;
          } else {
            doc.x = cardTextX;
            doc.y = mapY + mapaBoxH + 8;
          }
        }

        if (fotosAoLado) {
          // Fotos já desenhadas ao lado do mapa.
        } else if (imagens.length === 0) {
          doc
            .font('Helvetica')
            .fontSize(9)
            .fillColor('#6b7280')
            .text(imagemLinhaFallback, { width: cardInnerW });
        } else {
          const gridStartY = doc.y;
          for (let idx = 0; idx < imagens.length; idx += 1) {
            const row = Math.floor(idx / IMG_GRID_COLS);
            const col = idx % IMG_GRID_COLS;
            const x = cardTextX + col * (imageLayout.cellW + IMG_GRID_GAP_X);
            const y = gridStartY + row * (IMG_GRID_CELL_H + IMG_GRID_GAP_Y);
            try {
              doc.image(imagens[idx], x, y, {
                fit: [imageLayout.cellW, IMG_GRID_CELL_H],
                align: 'center',
                valign: 'center',
              });
            } catch {
              doc
                .fontSize(9)
                .fillColor('#b91c1c')
                .text(
                  'Não foi possível renderizar uma das imagens anexadas.',
                  cardTextX,
                  y,
                  { width: cardInnerW },
                );
            }
          }
          doc.y = gridStartY + imageLayout.gridH;
        }

        const cardEndY = doc.y + cardPadY;
        doc
          .save()
          .lineWidth(0.8)
          .strokeColor('#cbd5e1')
          .roundedRect(cardX, cardY, innerW, Math.max(42, cardEndY - cardY), 6)
          .stroke()
          .restore();
        doc.x = marginX;
        doc.y = cardEndY + IMG_GAP_AFTER;
        normalizeCursorY();
      }

      const range = doc.bufferedPageRange();
      const totalPages = range.count;
      for (let i = 0; i < totalPages; i += 1) {
        doc.switchToPage(i);
        const { width, height } = doc.page;
        const pageNum = i + 1;
        if (i > 0) {
          doc.save();
          doc.fontSize(8).fillColor('#475569');
          const colW = (width - marginX * 2) / 2;
          doc.text(titulo, marginX, 42, { width: colW, ellipsis: true });
          doc.text(params.veiculoDescricao, marginX + colW, 42, {
            width: colW,
            align: 'right',
            ellipsis: true,
          });
          doc
            .moveTo(marginX, 62)
            .lineTo(width - marginX, 62)
            .strokeColor('#e2e8f0')
            .lineWidth(0.6)
            .stroke();
          doc.restore();
        }
        doc.save();
        doc.font('Helvetica').fontSize(8).fillColor('#64748b');
        const footerY = height - 38;
        const rodapeEmissor = params.emitidoPor?.trim();
        const textoRodapeEsquerda = rodapeEmissor
          ? `Emissão: ${dataEmissao} · Usuário: ${rodapeEmissor}`
          : `Emissão: ${dataEmissao}`;
        const larguraPagina = width - marginX * 2;
        const pageStr = `Página ${pageNum} de ${totalPages}`;
        const pageStrW = doc.widthOfString(pageStr);
        const leftMaxW = Math.max(60, larguraPagina - pageStrW - 20);
        const leftDraw = this.truncatePdfTextToWidth(
          doc,
          textoRodapeEsquerda,
          leftMaxW,
        );
        doc.text(leftDraw, marginX, footerY, { lineBreak: false });
        doc.text(pageStr, width - marginX - pageStrW, footerY, {
          lineBreak: false,
        });
        doc
          .moveTo(marginX, footerY - 8)
          .lineTo(width - marginX, footerY - 8)
          .strokeColor('#e2e8f0')
          .lineWidth(0.5)
          .stroke();
        doc.restore();
      }

      doc.flushPages();
      doc.end();
    });
  }

  private detectarRecorteConteudoJpeg(buffer: Buffer): RecorteJpegPdf | null {
    try {
      const decoded = decodeJpeg(buffer, {
        formatAsRGBA: true,
        maxMemoryUsageInMB: 48,
      });
      const width = decoded.width;
      const height = decoded.height;
      const pixels = decoded.data;
      if (!width || !height || !pixels?.length) {
        return null;
      }
      const stepX = Math.max(1, Math.floor(width / 480));
      const stepY = Math.max(1, Math.floor(height / 240));
      const limite = 246;
      let minX = width;
      let minY = height;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < height; y += stepY) {
        for (let x = 0; x < width; x += stepX) {
          const i = (y * width + x) * 4;
          const r = pixels[i] ?? 255;
          const g = pixels[i + 1] ?? 255;
          const b = pixels[i + 2] ?? 255;
          if (r < limite || g < limite || b < limite) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX <= minX || maxY <= minY) {
        return null;
      }
      const padX = Math.max(4, Math.round(width * 0.012));
      const padY = Math.max(4, Math.round(height * 0.012));
      const left = Math.max(0, minX - padX);
      const top = Math.max(0, minY - padY);
      const right = Math.min(width, maxX + padX);
      const bottom = Math.min(height, maxY + padY);
      const cropW = right - left;
      const cropH = bottom - top;
      if (cropW / width > 0.96 && cropH / height > 0.96) {
        return null;
      }
      return { left, top, width: cropW, height: cropH, origW: width, origH: height };
    } catch {
      return null;
    }
  }

  private formatarLegendaOsPdf(circulos: CirculoMapaPdf[]): string {
    if (circulos.length === 0) {
      return '';
    }
    /** Uma entrada por irregularidade: `1.X:20261`, `2.X:20262`… */
    const porIndice = new Map<number, string>();
    for (const circulo of circulos) {
      const indice = this.extrairIndiceOsDoRotulo(circulo.rotuloCirculo);
      if (indice == null || !circulo.rotulo) {
        continue;
      }
      if (!porIndice.has(indice)) {
        porIndice.set(indice, circulo.rotulo);
      }
    }
    const partes = Array.from(porIndice.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([indice, numeroOs]) => `${indice}.X:${numeroOs}`);
    if (partes.length === 0) {
      return '';
    }
    if (partes.length === 1) {
      return `OS: ${partes[0]}`;
    }
    const ultimo = partes[partes.length - 1];
    const anteriores = partes.slice(0, -1).join(', ');
    return `OS: ${anteriores} e ${ultimo}`;
  }

  /** Extrai o índice da irregularidade de um rótulo `1.2` → `1`. */
  private extrairIndiceOsDoRotulo(rotuloCirculo: string): number | null {
    const match = /^(\d+)\./.exec(rotuloCirculo?.trim() || '');
    if (!match) {
      return null;
    }
    const indice = Number(match[1]);
    return Number.isFinite(indice) && indice > 0 ? indice : null;
  }

  /**
   * Índice global no PDF de pendências: ordem crescente de `numeroIrregularidade`
   * entre irregularidades com marcação (alinhado ao overlay / RN-VIS-009).
   */
  private montarIndiceOsPorIrregularidade(
    itens: IrregularidadeHistoricoVeiculoItemDto[],
  ): Map<string, number> {
    const comMarcacao = itens.filter((item) => {
      if (item.marcacoes && item.marcacoes.length > 0) {
        return true;
      }
      return !!item.marcacao;
    });
    const ordenados = comMarcacao.slice().sort((a, b) => {
      const byNum =
        (a.numeroIrregularidade ?? 0) - (b.numeroIrregularidade ?? 0);
      if (byNum !== 0) {
        return byNum;
      }
      return a.id.localeCompare(b.id);
    });
    const indicePorId = new Map<string, number>();
    let indice = 0;
    for (const item of ordenados) {
      if (!indicePorId.has(item.id)) {
        indice += 1;
        indicePorId.set(item.id, indice);
      }
    }
    return indicePorId;
  }

  private desenharMapaVistaNoPdf(
    doc: InstanceType<typeof PDFDocument>,
    params: {
      buffer: Buffer;
      recorte?: RecorteJpegPdf;
      x: number;
      y: number;
      boxW: number;
      boxH: number;
      circulos: CirculoMapaPdf[];
    },
  ): void {
    try {
      const jpegSize = this.lerDimensoesJpeg(params.buffer);
      const origW = params.recorte?.origW || jpegSize?.width || params.boxW;
      const origH = params.recorte?.origH || jpegSize?.height || params.boxH;
      const cropLeft = params.recorte?.left ?? 0;
      const cropTop = params.recorte?.top ?? 0;
      const cropW = params.recorte?.width ?? origW;
      const cropH = params.recorte?.height ?? origH;
      const aspectCrop = cropH / cropW;
      const imagemBaixa = aspectCrop < 0.55;
      let scale = Math.min(params.boxW / cropW, params.boxH / cropH);
      if (imagemBaixa && cropH * (params.boxW / cropW) <= params.boxH + 0.5) {
        scale = params.boxW / cropW;
      }
      const dw = Math.max(1, origW * scale);
      const dh = Math.max(1, origH * scale);
      const contentW = cropW * scale;
      const contentH = cropH * scale;
      const ix =
        params.x + (params.boxW - contentW) / 2 - cropLeft * scale;
      const iy = imagemBaixa
        ? params.y - cropTop * scale
        : params.y + (params.boxH - contentH) / 2 - cropTop * scale;
      doc.save();
      if (params.recorte) {
        doc.rect(params.x, params.y, params.boxW, params.boxH).clip();
      }
      doc.image(params.buffer, ix, iy, { width: dw, height: dh });
      for (const circulo of params.circulos) {
        const cx = ix + (circulo.posXPct / 100) * dw;
        const cy = iy + (circulo.posYPct / 100) * dh;
        const raio = Math.max(5, Math.min(9, Math.min(contentH, contentW) * 0.09));
        doc.save();
        doc.fillOpacity(1).strokeOpacity(1);
        doc.fillColor('#2563eb').strokeColor('#1e40af').lineWidth(0.8);
        doc.circle(cx, cy, raio).fillAndStroke();
        doc.restore();
        if (circulo.rotuloCirculo) {
          const rotuloCirculo = circulo.rotuloCirculo;
          const fontSize =
            rotuloCirculo.length > 3 ? 5 : rotuloCirculo.length > 2 ? 5.5 : 7;
          doc
            .font('Helvetica-Bold')
            .fontSize(fontSize)
            .fillColor('#ffffff')
            .text(rotuloCirculo, cx - raio, cy - fontSize / 2, {
              width: raio * 2,
              align: 'center',
              lineBreak: false,
            });
        }
      }
      doc.restore();
    } catch {
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor('#b91c1c')
        .text('Não foi possível renderizar esta vista.', params.x, params.y, {
          width: params.boxW,
        });
    }
  }

  private lerDimensoesJpeg(
    buffer: Buffer,
  ): { width: number; height: number } | null {
    if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
      return null;
    }
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        if (width > 0 && height > 0) {
          return { width, height };
        }
        return null;
      }
      const size = buffer.readUInt16BE(offset + 2);
      offset += 2 + size;
    }
    return null;
  }

  /**
   * PDFKit: `doc.text` com `width` usa LineWrapper, que compara `y` com `page.maxY()`.
   * Texto na faixa do rodapé (y > maxY) dispara `continueOnNewPage()` e páginas em branco.
   */
  private truncatePdfTextToWidth(
    doc: InstanceType<typeof PDFDocument>,
    text: string,
    maxWidth: number,
  ): string {
    if (maxWidth <= 8) {
      return '…';
    }
    if (doc.widthOfString(text) <= maxWidth) {
      return text;
    }
    const ellipsis = '…';
    let end = text.length;
    while (end > 0) {
      const candidate = `${text.slice(0, end).trimEnd()}${ellipsis}`;
      if (doc.widthOfString(candidate) <= maxWidth) {
        return candidate;
      }
      end--;
    }
    return ellipsis;
  }

  private async carregarMapasPdfManutencao(
    irregularidades: Irregularidade[],
  ): Promise<Map<string, MapaPdfIrregularidadeLocal>> {
    const mapas = new Map<string, MapaPdfIrregularidadeLocal>();
    for (const item of irregularidades) {
      const marcas = this.mapMarcacoes(item);
      const idVista = marcas[0]?.idVista ?? item.idVista;
      const idModelo = item.vistoria?.veiculo?.idModelo;
      if (!idVista || !idModelo || marcas.length === 0) {
        continue;
      }
      try {
        const imagem = await this.vistaService.getImagem(idModelo, idVista);
        const recorte = this.detectarRecorteConteudoJpeg(imagem.buffer);
        mapas.set(item.id, {
          descricao: item.vista?.descricao?.trim() || 'Local no veículo',
          buffer: imagem.buffer,
          recorte: recorte ?? undefined,
          pontos: marcas.map((m, ordem) => ({
            posXPct: m.posXPct,
            posYPct: m.posYPct,
            ordem: m.ordem ?? ordem,
          })),
        });
      } catch {
        // Sem imagem da vista: o card segue só com as fotos da irregularidade
      }
    }
    return mapas;
  }

  private labelStatusIrregularidade(status: StatusIrregularidade): string {
    switch (status) {
      case StatusIrregularidade.REGISTRADA:
        return 'Registrada';
      case StatusIrregularidade.RETRABALHO_GARANTIA:
        return 'Retrabalho';
      case StatusIrregularidade.CANCELADA:
        return 'Cancelada';
      case StatusIrregularidade.EM_MANUTENCAO:
        return 'Em manutenção';
      case StatusIrregularidade.NAO_PROCEDE:
        return 'Não procede';
      case StatusIrregularidade.CONCLUIDA:
        return 'Concluída';
      case StatusIrregularidade.VALIDADA:
        return 'Validada';
      default:
        return status;
    }
  }

  private labelGravidadeIrregularidade(
    gravidade?: GravidadeCriticidade | null,
  ): string {
    switch (gravidade) {
      case GravidadeCriticidade.VERDE:
        return 'Baixa';
      case GravidadeCriticidade.AMARELO:
        return 'Média';
      case GravidadeCriticidade.VERMELHO:
        return 'Alta';
      default:
        return gravidade ? String(gravidade) : '-';
    }
  }

  private formatTempoDesde(isoDate?: string | null): string {
    if (!isoDate) {
      return '-';
    }
    const registro = new Date(isoDate).getTime();
    if (Number.isNaN(registro)) {
      return '-';
    }
    const diffMs = Date.now() - registro;
    if (diffMs <= 0) {
      return 'agora';
    }
    const totalMinutes = Math.floor(diffMs / 60000);
    const dias = Math.floor(totalMinutes / (60 * 24));
    const horas = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutos = totalMinutes % 60;
    if (dias > 0) {
      return `${dias}d ${horas}h`;
    }
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    if (minutos > 0) {
      return `${minutos}min`;
    }
    return 'agora';
  }

  private buildPdfRelatorioResumoGestaoOs(
    itens: IrregularidadeResumoDto[],
    emitidoEm: Date,
    emitidoPor: string | undefined,
    configuracao: Configuracao | null,
    filtrosAplicados: string,
    tipoImpressao: 'ANALITICA' | 'SINTETICA' = 'ANALITICA',
  ): Promise<Buffer> {
    const dataEmissao = this.formatDateTimeBr(emitidoEm);
    const logoBuffer = this.resolveLogoBuffer(configuracao);
    const tituloRelatorio =
      tipoImpressao === 'SINTETICA'
        ? 'Relatório Resumo por Veículo/Empresa (Sintético)'
        : 'Relatório Resumo por Veículo (Analítico)';
    const somenteSintetico = tipoImpressao === 'SINTETICA';
    const marginX = 24;
    const footerBandPt = 44;
    const boxPadX = 8;
    const boxPadY = 6;
    const boxGap = 10;

    type LinhaResumo = {
      empresa: string;
      veiculo: string;
      modelo: string;
      veiculoKey: string;
      os: string;
      classificacao: string;
      descricao: string;
      status: string;
      gravidade: string;
      tempoEtapa: string;
    };

    type GrupoVeiculo = {
      key: string;
      veiculo: string;
      modelo: string;
      rows: LinhaResumo[];
      porStatus: Map<string, number>;
    };

    const linhas: LinhaResumo[] = itens.map((item) => {
      const empresa = item.empresaManutencaoDescricao?.trim() || 'Sem Empresa';
      const veiculo = item.veiculoDescricao?.trim() || 'Veículo não informado';
      const placa = item.veiculoPlaca?.trim() || '';
      const veiculoLabel = placa ? `${veiculo} (${placa})` : veiculo;
      const modelo = item.veiculoModelo?.trim() || '-';
      const osParts = [`OS: ${item.numeroIrregularidade}`];
      if (item.erpCodigoPedido?.trim()) {
        osParts.push(`OMNI: ${item.erpCodigoPedido.trim()}`);
      }
      if (item.numOsExternoAtual != null) {
        osParts.push(`BRT: ${item.numOsExternoAtual}`);
      }
      const classificacao = [
        item.nomeArea?.trim() || '-',
        item.nomeComponente?.trim() || '-',
        item.descricaoSintoma?.trim() || '-',
      ].join(' / ');
      const entrada = item.entradaStatusEm ?? item.criadoEm;
      return {
        empresa,
        veiculo: veiculoLabel,
        modelo,
        veiculoKey: String(item.idVeiculo ?? veiculoLabel),
        os: osParts.join('\n'),
        classificacao,
        descricao: item.observacao?.trim() || '-',
        status: this.labelStatusIrregularidade(item.statusAtual),
        gravidade: this.labelGravidadeIrregularidade(item.gravidade),
        tempoEtapa: this.formatTempoDesde(entrada),
      };
    });

    linhas.sort((a, b) => {
      const vei = a.veiculo.localeCompare(b.veiculo, 'pt-BR');
      if (vei !== 0) return vei;
      const st = a.status.localeCompare(b.status, 'pt-BR');
      if (st !== 0) return st;
      const emp = a.empresa.localeCompare(b.empresa, 'pt-BR');
      if (emp !== 0) return emp;
      return a.os.localeCompare(b.os, 'pt-BR');
    });

    const grupos: GrupoVeiculo[] = [];
    for (const row of linhas) {
      let grupo = grupos.find((g) => g.key === row.veiculoKey);
      if (!grupo) {
        grupo = {
          key: row.veiculoKey,
          veiculo: row.veiculo,
          modelo: row.modelo,
          rows: [],
          porStatus: new Map(),
        };
        grupos.push(grupo);
      }
      grupo.rows.push(row);
      grupo.porStatus.set(
        row.status,
        (grupo.porStatus.get(row.status) ?? 0) + 1,
      );
    }

    /** Matriz empresa × status para o resumo final em tabela. */
    const matrizEmpresaStatus = new Map<string, Map<string, number>>();
    const statusNoResumo = new Set<string>();
    for (const row of linhas) {
      statusNoResumo.add(row.status);
      let porStatus = matrizEmpresaStatus.get(row.empresa);
      if (!porStatus) {
        porStatus = new Map();
        matrizEmpresaStatus.set(row.empresa, porStatus);
      }
      porStatus.set(row.status, (porStatus.get(row.status) ?? 0) + 1);
    }
    /** Ordem do fluxo: Cancelada → Registrada → Não procede → Retrabalho → Manutenção → Concluída → Validada. */
    const ordemStatusFluxo = [
      this.labelStatusIrregularidade(StatusIrregularidade.CANCELADA),
      this.labelStatusIrregularidade(StatusIrregularidade.REGISTRADA),
      this.labelStatusIrregularidade(StatusIrregularidade.NAO_PROCEDE),
      this.labelStatusIrregularidade(StatusIrregularidade.RETRABALHO_GARANTIA),
      this.labelStatusIrregularidade(StatusIrregularidade.EM_MANUTENCAO),
      this.labelStatusIrregularidade(StatusIrregularidade.CONCLUIDA),
      this.labelStatusIrregularidade(StatusIrregularidade.VALIDADA),
    ];
    const statusColunas = ordemStatusFluxo.filter((st) => statusNoResumo.has(st));
    const empresasLinhas = Array.from(matrizEmpresaStatus.keys()).sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    );

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        bufferPages: true,
        autoFirstPage: false,
        margins: {
          top: marginX,
          left: marginX,
          right: marginX,
          bottom: footerBandPt,
        },
      });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const maxContentY = () => Math.floor(doc.page.maxY());
      let innerW = 0;
      let contentW = 0;
      let contentX = 0;

      const drawPageChrome = () => {
        innerW = doc.page.width - marginX * 2;
        contentX = marginX + boxPadX;
        contentW = innerW - boxPadX * 2;
        const headerTop = 18;
        if (logoBuffer) {
          try {
            doc.image(logoBuffer, marginX, headerTop, { fit: [100, 32] });
          } catch {
            // ignora logo inválido
          }
        }
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#0f172a')
          .text(tituloRelatorio, marginX, headerTop + 2, {
            width: innerW,
            align: 'center',
          });
        const subtitulo = `(${filtrosAplicados || 'Nenhum filtro adicional'})`;
        const filtrosY = Math.max(headerTop + 22, doc.y + 2);
        doc
          .font('Helvetica')
          .fontSize(7.5)
          .fillColor('#475569')
          .text(subtitulo, marginX, filtrosY, {
            width: innerW,
            align: 'center',
            height: 32,
            ellipsis: true,
          });
        doc.x = marginX;
        doc.y = Math.max(filtrosY + 34, headerTop + 52);
      };

      let boxTopY = 0;
      let boxOpen = false;

      const strokeBoxSegment = (bottomY: number) => {
        if (!boxOpen) return;
        const h = Math.max(4, bottomY - boxTopY);
        doc
          .save()
          .lineWidth(0.8)
          .strokeColor('#94a3b8')
          .roundedRect(marginX, boxTopY, innerW, h, 4)
          .stroke()
          .restore();
      };

      const openBox = () => {
        boxTopY = doc.y;
        boxOpen = true;
        doc.y += boxPadY;
      };

      const closeBoxSegment = (opts?: { continued?: boolean }) => {
        if (!boxOpen) return;
        doc.y += boxPadY;
        strokeBoxSegment(doc.y);
        boxOpen = false;
        if (opts?.continued) {
          doc.y += 4;
        } else {
          doc.y += boxGap;
        }
      };

      const breakPage = (continueBox?: {
        grupo: GrupoVeiculo;
        continued: boolean;
      }) => {
        if (boxOpen) {
          closeBoxSegment({ continued: true });
        }
        doc.addPage();
        doc.x = marginX;
        drawPageChrome();
        if (continueBox) {
          openBox();
          drawVeiculoCabecalho(continueBox.grupo, true);
          drawColHeaders();
        }
      };

      const ensureSpace = (h: number, continueBox?: {
        grupo: GrupoVeiculo;
        continued: boolean;
      }) => {
        if (Math.ceil(doc.y + h) > maxContentY()) {
          breakPage(continueBox);
        }
      };

      /** Larguras A4 retrato; Empresa após Status. */
      const cols = {
        os: 58,
        classificacao: 88,
        descricao: 100,
        status: 62,
        empresa: 58,
        gravidade: 32,
        tempo: 52,
      };
      const rowPad = 3;
      const boxFooterH = 20;

      const drawVeiculoCabecalho = (grupo: GrupoVeiculo, cont?: boolean) => {
        const titulo = cont
          ? `Veículo: ${grupo.veiculo}  ·  Modelo: ${grupo.modelo}  (cont.)`
          : `Veículo: ${grupo.veiculo}  ·  Modelo: ${grupo.modelo}`;
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#0f172a')
          .text(titulo, contentX, doc.y, {
            width: contentW,
            height: 14,
            ellipsis: true,
          });
        doc.y += 2;
      };

      const drawColHeaders = () => {
        const y = doc.y;
        doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#334155');
        let x = contentX;
        /** NBSP evita quebra "Tempo / etapa" na coluna estreita. */
        const headers: Array<[string, number]> = [
          ['OS', cols.os],
          ['Classificação', cols.classificacao],
          ['Descrição do problema', cols.descricao],
          ['Status', cols.status],
          ['Empresa', cols.empresa],
          ['Grav.', cols.gravidade],
          ['Tempo\u00A0etapa', cols.tempo],
        ];
        for (const [label, w] of headers) {
          doc.text(label, x, y, { width: w, lineBreak: false });
          doc.y = y;
          doc.x = contentX;
          x += w + 4;
        }
        doc.y = y + 12;
        doc
          .moveTo(contentX, doc.y)
          .lineTo(contentX + contentW, doc.y)
          .strokeColor('#cbd5e1')
          .lineWidth(0.5)
          .stroke();
        doc.y += 3;
      };

      const measureRowHeight = (row: LinhaResumo): number => {
        doc.font('Helvetica').fontSize(7);
        const hOs = doc.heightOfString(row.os, { width: cols.os });
        const hCl = doc.heightOfString(row.classificacao, {
          width: cols.classificacao,
        });
        const hDe = doc.heightOfString(row.descricao, { width: cols.descricao });
        const hSt = doc.heightOfString(row.status, { width: cols.status });
        const hEmp = doc.heightOfString(row.empresa, { width: cols.empresa });
        const natural =
          Math.max(hOs, hCl, hDe, hSt, hEmp, 10) + rowPad * 2;
        return Math.min(natural, 64);
      };

      const drawRow = (row: LinhaResumo, grupo: GrupoVeiculo) => {
        let h = measureRowHeight(row);
        ensureSpace(h + 4 + boxFooterH, { grupo, continued: true });
        const avail = Math.max(18, maxContentY() - doc.y - boxFooterH - 4);
        h = Math.min(h, avail);
        const y = doc.y;
        const cellH = Math.max(10, h - rowPad * 2);
        doc.font('Helvetica').fontSize(7).fillColor('#1e293b');
        let x = contentX;
        const cells: Array<[string, number]> = [
          [row.os, cols.os],
          [row.classificacao, cols.classificacao],
          [row.descricao, cols.descricao],
          [row.status, cols.status],
          [row.empresa, cols.empresa],
          [row.gravidade, cols.gravidade],
          [row.tempoEtapa, cols.tempo],
        ];
        for (const [text, w] of cells) {
          doc.text(text, x, y + rowPad, {
            width: w,
            height: cellH,
            ellipsis: true,
          });
          doc.y = y;
          doc.x = contentX;
          x += w + 4;
        }
        doc.y = y + h;
        doc
          .moveTo(contentX, doc.y)
          .lineTo(contentX + contentW, doc.y)
          .strokeColor('#e2e8f0')
          .lineWidth(0.4)
          .stroke();
        doc.y += 2;
      };

      const drawBoxFooterTotais = (grupo: GrupoVeiculo) => {
        ensureSpace(boxFooterH + 4, { grupo, continued: true });
        const statusTxt = Array.from(grupo.porStatus.entries())
          .sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'))
          .map(([st, q]) => `${st}: ${q}`)
          .join(' · ');
        const texto = `Totais do veículo: ${grupo.rows.length} OS${
          statusTxt ? `  |  ${statusTxt}` : ''
        }`;
        doc
          .moveTo(contentX, doc.y)
          .lineTo(contentX + contentW, doc.y)
          .strokeColor('#94a3b8')
          .lineWidth(0.6)
          .stroke();
        doc.y += 3;
        doc
          .font('Helvetica-Bold')
          .fontSize(7.5)
          .fillColor('#0f172a')
          .text(texto, contentX, doc.y, {
            width: contentW,
            height: 12,
            ellipsis: true,
          });
        doc.y += 2;
      };

      doc.addPage();
      drawPageChrome();

      if (!somenteSintetico) {
        for (const grupo of grupos) {
          const headerBlockH = 16 + 14 + boxPadY * 2 + boxFooterH;
          ensureSpace(headerBlockH + 24);
          openBox();
          drawVeiculoCabecalho(grupo, false);
          drawColHeaders();
          for (const row of grupo.rows) {
            drawRow(row, grupo);
          }
          drawBoxFooterTotais(grupo);
          closeBoxSegment();
        }
      }

      // Resumo: mesma formatação das caixas de veículo (borda arredondada, sem fundo)
      const resumoColEmpresaW = Math.min(110, Math.floor(contentW * 0.22));
      const resumoColTotalW = 42;
      const resumoStatusCols = Math.max(1, statusColunas.length);
      const resumoStatusColW = Math.max(
        36,
        Math.floor(
          (contentW - resumoColEmpresaW - resumoColTotalW - 4) /
            resumoStatusCols,
        ),
      );
      const resumoRowH = 14;
      const resumoHeaderH = 22;

      const drawResumoCell = (
        text: string,
        x: number,
        y: number,
        w: number,
        h: number,
        opts?: {
          bold?: boolean;
          align?: 'left' | 'center' | 'right';
          wrap?: boolean;
        },
      ) => {
        doc
          .font(opts?.bold ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(7)
          .fillColor('#0f172a')
          .text(text, x + 2, y + (opts?.wrap ? 2 : 3), {
            width: w - 4,
            height: h - 4,
            align: opts?.align ?? 'left',
            ellipsis: true,
            lineBreak: !!opts?.wrap,
          });
        doc.x = contentX;
        doc.y = y;
      };

      const drawResumoDivider = () => {
        doc
          .moveTo(contentX, doc.y)
          .lineTo(contentX + contentW, doc.y)
          .strokeColor('#e2e8f0')
          .lineWidth(0.4)
          .stroke();
        doc.y += 2;
      };

      const drawResumoColHeaders = () => {
        const y = doc.y;
        drawResumoCell('Empresa', contentX, y, resumoColEmpresaW, resumoHeaderH, {
          bold: true,
        });
        let x = contentX + resumoColEmpresaW;
        for (const st of statusColunas) {
          drawResumoCell(st, x, y, resumoStatusColW, resumoHeaderH, {
            bold: true,
            align: 'center',
            wrap: true,
          });
          x += resumoStatusColW;
        }
        drawResumoCell('Total', x, y, resumoColTotalW, resumoHeaderH, {
          bold: true,
          align: 'center',
        });
        doc.y = y + resumoHeaderH;
        doc
          .moveTo(contentX, doc.y)
          .lineTo(contentX + contentW, doc.y)
          .strokeColor('#cbd5e1')
          .lineWidth(0.5)
          .stroke();
        doc.y += 3;
      };

      const drawResumoLinha = (
        empresaLabel: string,
        valores: Map<string, number> | null,
        totalLinha: number,
        bold = false,
      ) => {
        ensureSpace(resumoRowH + boxFooterH);
        if (doc.y + resumoRowH + boxPadY > maxContentY()) {
          closeBoxSegment({ continued: true });
          breakPage();
          openBox();
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#0f172a')
            .text('Resumo (cont.)', contentX, doc.y, {
              width: contentW,
              height: 14,
              ellipsis: true,
            });
          doc.y += 2;
          drawResumoColHeaders();
        }
        const y = doc.y;
        drawResumoCell(empresaLabel, contentX, y, resumoColEmpresaW, resumoRowH, {
          bold,
        });
        let x = contentX + resumoColEmpresaW;
        for (const st of statusColunas) {
          const qtd = valores?.get(st) ?? 0;
          drawResumoCell(
            qtd > 0 ? String(qtd) : '—',
            x,
            y,
            resumoStatusColW,
            resumoRowH,
            { bold, align: 'center' },
          );
          x += resumoStatusColW;
        }
        drawResumoCell(String(totalLinha), x, y, resumoColTotalW, resumoRowH, {
          bold: true,
          align: 'center',
        });
        doc.y = y + resumoRowH;
        drawResumoDivider();
      };

      ensureSpace(56);
      doc.y += 4;
      openBox();
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#0f172a')
        .text('Resumo', contentX, doc.y, {
          width: contentW,
          height: 14,
          ellipsis: true,
        });
      doc.y += 2;
      drawResumoColHeaders();

      const totaisPorStatus = new Map<string, number>();
      for (const st of statusColunas) {
        totaisPorStatus.set(st, 0);
      }

      for (const empresa of empresasLinhas) {
        const porStatus = matrizEmpresaStatus.get(empresa) ?? new Map();
        let totalLinha = 0;
        for (const st of statusColunas) {
          const qtd = porStatus.get(st) ?? 0;
          totalLinha += qtd;
          totaisPorStatus.set(st, (totaisPorStatus.get(st) ?? 0) + qtd);
        }
        drawResumoLinha(empresa, porStatus, totalLinha, false);
      }

      doc
        .moveTo(contentX, doc.y)
        .lineTo(contentX + contentW, doc.y)
        .strokeColor('#94a3b8')
        .lineWidth(0.6)
        .stroke();
      doc.y += 2;
      drawResumoLinha('Total geral', totaisPorStatus, linhas.length, true);
      closeBoxSegment();

      const range = doc.bufferedPageRange();
      const totalPages = range.count;
      for (let i = 0; i < totalPages; i += 1) {
        doc.switchToPage(range.start + i);
        const { width, height } = doc.page;
        const pageStr = `Página ${i + 1} de ${totalPages}`;
        const emissaoTxt = emitidoPor?.trim()
          ? `Emissão: ${dataEmissao} · ${emitidoPor.trim()} · ${linhas.length} OS`
          : `Emissão: ${dataEmissao} · ${linhas.length} OS`;
        doc.save();
        doc.font('Helvetica').fontSize(7).fillColor('#64748b');
        const pageStrW = doc.widthOfString(pageStr);
        const footerY = height - 28;
        /** Sem `width`: não dispara quebra de página no rodapé. */
        doc.text(emissaoTxt, marginX, footerY, { lineBreak: false });
        doc.text(pageStr, width - marginX - pageStrW, footerY, {
          lineBreak: false,
        });
        doc.restore();
      }

      doc.flushPages();
      doc.end();
    });
  }

  private async buildPdfRelatorioManutencao(
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
    configuracao: Configuracao | null,
  ): Promise<Buffer> {
    const dataEmissao = this.formatDateTimeBr(resumo.emitidoEm);
    const logoBuffer = this.resolveLogoBuffer(configuracao);
    const mapasPorItem =
      await this.carregarMapasPdfManutencao(irregularidades);

    const marginX = 50;
    /**
     * Margem inferior da página = faixa do rodapé desenhado depois. O motor de texto do PDFKit
     * usa page.maxY() = height - margins.bottom, alinhado ao nosso conteúdo manual.
     */
    const footerBandPt = 92;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        autoFirstPage: false,
        margins: {
          top: marginX,
          left: marginX,
          right: marginX,
          bottom: footerBandPt,
        },
      });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk as Buffer));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const maxContentY = () => Math.floor(doc.page.maxY());

      /** Configuração de imagens no PDF */
      const IMG_GAP_AFTER = 12;
      const IMG_GRID_GAP_X = 10;
      const IMG_GRID_GAP_Y = 10;
      /** Retorna ao tamanho padrão anterior das fotos. */
      const IMG_GRID_CELL_H = 200;
      const IMG_GRID_COLS = 3;

      const headerRowTop = 42;
      const logoBoxW = 132;
      const logoBoxH = 48;
      let innerW = 0;
      let veiculoAtualHeader = '';

      const drawReportHeader = () => {
        innerW = doc.page.width - marginX * 2;
        if (logoBuffer) {
          try {
            doc.image(logoBuffer, marginX, headerRowTop, {
              fit: [logoBoxW, logoBoxH],
            });
          } catch {
            // Ignora falha de logo
          }
        }
        const tituloY = headerRowTop + 10;
        doc
          .font('Helvetica')
          .fontSize(17)
          .fillColor('#0f172a')
          .text('Relatório de Serviço(s)', marginX, tituloY, {
            width: innerW,
            align: 'center',
          });
        doc
          .font('Helvetica')
          .fontSize(11)
          .fillColor('#475569')
          .text(
            `Empresa de manutenção: ${resumo.empresa}`,
            marginX,
            doc.y + 5,
            { width: innerW, align: 'center' },
          );
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#64748b')
          .text(`Emissão: ${dataEmissao}`, marginX, doc.y + 4, {
            width: innerW,
            align: 'center',
          });
        const headerTextosFimY = doc.y;
        const logoFimY = headerRowTop + logoBoxH;
        doc.x = marginX;
        doc.y = Math.max(headerTextosFimY + 12, logoFimY + 10);
      };

      const breakPageBody = () => {
        doc.addPage();
        doc.x = marginX;
        drawReportHeader();
      };

      /**
       * Só ajusta o cursor: nunca abre página nova aqui (isso gerava folhas em branco no fim do fluxo).
       */
      const normalizeCursorY = () => {
        const lim = maxContentY();
        if (doc.y > lim) {
          doc.y = lim;
        }
      };

      const ensureTextBlock = (minHeight: number) => {
        normalizeCursorY();
        const lim = maxContentY();
        if (Math.ceil(doc.y + minHeight) > lim) {
          breakPageBody();
        }
      };

      const getImageGridLayout = (count: number, contentWidth: number) => {
        const rows = Math.ceil(count / IMG_GRID_COLS);
        const cellW = Math.floor(
          (contentWidth - IMG_GRID_GAP_X * (IMG_GRID_COLS - 1)) / IMG_GRID_COLS,
        );
        const gridH =
          rows > 0 ? rows * IMG_GRID_CELL_H + (rows - 1) * IMG_GRID_GAP_Y : 0;
        return { rows, cellW, gridH };
      };

      const buildVeiculoHeader = (
        grupo: RelatorioManutencaoResumoDto['porVeiculo'][number],
      ) => {
        const dadosVeiculo = [
          grupo.veiculo,
          grupo.placa ?? '',
          grupo.modelo ?? '',
        ]
          .filter(Boolean)
          .join(' ');
        return `Veículo: ${dadosVeiculo}`;
      };

      const measureTextHeight = (
        text: string,
        fontName: string,
        fontSize: number,
        width: number,
      ): number => {
        doc.font(fontName).fontSize(fontSize);
        return doc.heightOfString(text, { width });
      };

      const drawTableCell = (
        x: number,
        y: number,
        w: number,
        h: number,
        text: string,
        opts: {
          font?: string;
          size?: number;
          color?: string;
          padX?: number;
          padY?: number;
          wrap?: boolean;
          valign?: 'top' | 'center';
        } = {},
      ) => {
        const padX = opts.padX ?? 6;
        const padY = opts.padY ?? 4;
        doc.save();
        doc.lineWidth(0.6).strokeColor('#94a3b8').rect(x, y, w, h).stroke();
        if (text) {
          const font = opts.font ?? 'Helvetica';
          const size = opts.size ?? 9;
          const textW = Math.max(8, w - padX * 2);
          doc.font(font).fontSize(size);
          const textH = Math.min(
            h - padY * 2,
            doc.heightOfString(text, {
              width: textW,
              lineBreak: opts.wrap !== false,
            }),
          );
          const textY =
            opts.valign === 'center'
              ? y + Math.max(padY, (h - textH) / 2)
              : y + padY;
          doc.fillColor(opts.color ?? '#0f172a').text(text, x + padX, textY, {
            width: textW,
            height: Math.max(8, h - (textY - y) - padY),
            lineBreak: opts.wrap !== false,
            ellipsis: true,
          });
        }
        doc.restore();
      };

      doc.addPage();
      drawReportHeader();

      let primeiroVeiculo = true;
      for (const grupo of resumo.porVeiculo) {
        veiculoAtualHeader = buildVeiculoHeader(grupo);
        if (!primeiroVeiculo) {
          breakPageBody();
        }
        primeiroVeiculo = false;

        for (const itemResumo of grupo.itens) {
          const irregularidade = irregularidades.find(
            (i) => i.id === itemResumo.id,
          );
          const imagens = (irregularidade?.midias ?? []).filter(
            (m) => m.tipo === 'imagem',
          );
          const mapaLocal = mapasPorItem.get(itemResumo.id);
          const obsTxt = itemResumo.observacao?.trim() || 'Não informada.';

          const cardPadX = 0;
          const cardPadY = 0;
          const mediaPad = 8;
          const cardInnerW = innerW - cardPadX * 2;
          const mediaW = cardInnerW - mediaPad * 2;

          const osColunas = this.formatOsColunasManutencao(itemResumo);
          const osColW = cardInnerW / Math.max(1, osColunas.length);
          const hOs = 24;
          const hVeiculo = Math.max(
            22,
            measureTextHeight(
              veiculoAtualHeader,
              'Helvetica-Bold',
              11,
              cardInnerW - 12,
            ) + 10,
          );
          const labelColW = 132;
          const valueColW = cardInnerW - labelColW;
          const cellPad = 5;
          const hIrreg = Math.max(
            18,
            measureTextHeight(
              itemResumo.irregularidade,
              'Helvetica',
              9,
              valueColW - cellPad * 2,
            ) +
              cellPad * 2,
          );
          const hObsLine = Math.max(
            18,
            measureTextHeight(obsTxt, 'Helvetica', 9, valueColW - cellPad * 2) +
              cellPad * 2,
          );
          const jpegMapa = mapaLocal
            ? this.lerDimensoesJpeg(mapaLocal.buffer)
            : null;
          const jpegW = jpegMapa?.width || cardInnerW;
          const jpegH = jpegMapa?.height || 80;
          const recorte = mapaLocal?.recorte;
          const recorteBaixa = !!(
            recorte && recorte.height / recorte.width < 0.55
          );
          const mapaBaixa =
            recorteBaixa || jpegH / jpegW < 0.55;
          const mapaUtilW = mapaBaixa
            ? recorte?.width || jpegW
            : jpegW;
          const mapaUtilH = mapaBaixa
            ? recorte?.height || jpegH
            : jpegH;
          let mapaBoxW = 0;
          let mapaBoxH = 0;
          if (mapaLocal) {
            if (mapaBaixa) {
              mapaBoxW = mediaW;
              mapaBoxH = Math.min(
                100,
                Math.max(56, mapaBoxW * (mapaUtilH / mapaUtilW)),
              );
            } else {
              const maxW = 210;
              const maxH = 210;
              const escala = Math.min(
                maxW / mapaUtilW,
                maxH / mapaUtilH,
              );
              mapaBoxW = Math.max(96, mapaUtilW * escala);
              mapaBoxH = Math.max(96, mapaUtilH * escala);
            }
          }
          const fotosAoLado =
            !!mapaLocal && !mapaBaixa && imagens.length > 0;
          const imageLayout = getImageGridLayout(
            imagens.length,
            fotosAoLado
              ? Math.max(120, mediaW - mapaBoxW - 12)
              : mediaW,
          );
          const imagemLinhaFallback = 'Sem imagens anexadas.';
          const hImgs =
            imagens.length > 0
              ? fotosAoLado
                ? 0
                : imageLayout.gridH
              : mapaLocal
                ? 0
                : measureTextHeight(
                    imagemLinhaFallback,
                    'Helvetica',
                    9,
                    mediaW,
                  );
          const hLocal = mapaLocal
            ? Math.max(
                18,
                measureTextHeight(
                  mapaLocal.descricao,
                  'Helvetica',
                  9,
                  valueColW - cellPad * 2,
                ) +
                  cellPad * 2,
              )
            : 0;
          const hMapa = mapaLocal ? mapaBoxH : 0;
          const hMidia = fotosAoLado
            ? Math.max(hMapa, mapaBoxH)
            : hMapa + (mapaLocal && imagens.length ? 8 : 0) + hImgs;
          const hMediaCell = hMidia + mediaPad * 2;
          const cardContentH =
            hVeiculo + hOs + hIrreg + hObsLine + hLocal + hMediaCell;
          const requiredCardH = cardPadY * 2 + cardContentH + 6;

          ensureTextBlock(requiredCardH + 8);

          // Bloco visual da irregularidade com todas as informações (veículo + dados + imagens).
          const cardX = marginX;
          const cardY = doc.y;
          const cardTextX = cardX + cardPadX;
          const cardTextY = cardY + cardPadY;

          doc.x = cardTextX;
          doc.y = cardTextY;
          let tableY = cardTextY;
          drawTableCell(
            cardTextX,
            tableY,
            cardInnerW,
            hVeiculo,
            veiculoAtualHeader,
            {
              font: 'Helvetica-Bold',
              size: 11,
              color: '#0f172a',
              wrap: true,
              valign: 'center',
            },
          );
          tableY += hVeiculo;
          osColunas.forEach((col, idx) => {
            drawTableCell(
              cardTextX + idx * osColW,
              tableY,
              osColW,
              hOs,
              `${col.label}: ${col.value}`,
              {
                font: 'Helvetica-Bold',
                size: 11,
                color: '#0f172a',
                wrap: false,
                valign: 'center',
              },
            );
          });
          tableY += hOs;
          drawTableCell(
            cardTextX,
            tableY,
            labelColW,
            hIrreg,
            'IRREGULARIDADE',
            {
              font: 'Helvetica-Bold',
              size: 8,
              color: '#475569',
              wrap: false,
            },
          );
          drawTableCell(
            cardTextX + labelColW,
            tableY,
            valueColW,
            hIrreg,
            itemResumo.irregularidade,
            { font: 'Helvetica', size: 9, color: '#0f172a', wrap: true },
          );
          tableY += hIrreg;
          drawTableCell(
            cardTextX,
            tableY,
            labelColW,
            hObsLine,
            'DESCRIÇÃO DO PROBLEMA',
            {
              font: 'Helvetica-Bold',
              size: 8,
              color: '#475569',
              wrap: true,
            },
          );
          drawTableCell(
            cardTextX + labelColW,
            tableY,
            valueColW,
            hObsLine,
            obsTxt,
            { font: 'Helvetica', size: 9, color: '#0f172a', wrap: true },
          );
          tableY += hObsLine;
          if (mapaLocal) {
            drawTableCell(
              cardTextX,
              tableY,
              labelColW,
              hLocal,
              'LOCAL',
              {
                font: 'Helvetica-Bold',
                size: 8,
                color: '#475569',
                wrap: false,
              },
            );
            drawTableCell(
              cardTextX + labelColW,
              tableY,
              valueColW,
              hLocal,
              mapaLocal.descricao,
              { font: 'Helvetica', size: 9, color: '#0f172a', wrap: true },
            );
            tableY += hLocal;
          }
          drawTableCell(cardTextX, tableY, cardInnerW, hMediaCell, '', {
            wrap: false,
          });
          const mediaX = cardTextX + mediaPad;
          const mediaY = tableY + mediaPad;
          doc.x = mediaX;
          doc.y = mediaY;

          if (mapaLocal) {
            const mapY = mediaY;
            this.desenharMapaVistaNoPdf(doc, {
              buffer: mapaLocal.buffer,
              recorte: mapaBaixa ? mapaLocal.recorte : undefined,
              x: mediaX,
              y: mapY,
              boxW: mapaBoxW,
              boxH: mapaBoxH,
              circulos: mapaLocal.pontos.map((ponto) => ({
                posXPct: ponto.posXPct,
                posYPct: ponto.posYPct,
                rotulo: '',
                rotuloCirculo: this.rotuloCirculoMarcacao(1, ponto.ordem),
              })),
            });
            doc.save();
            doc
              .lineWidth(0.6)
              .strokeColor('#e2e8f0')
              .roundedRect(mediaX, mapY, mapaBoxW, mapaBoxH, 4)
              .stroke();
            doc.restore();

            if (fotosAoLado) {
              const gapMapa = 12;
              const fotoAreaX = mediaX + mapaBoxW + gapMapa;
              const fotoAreaW = Math.max(80, mediaW - mapaBoxW - gapMapa);
              const cols = Math.min(2, imagens.length);
              const rows = Math.ceil(imagens.length / cols);
              const cellW = Math.floor((fotoAreaW - 8 * (cols - 1)) / cols);
              const cellH = Math.floor((mapaBoxH - 8 * (rows - 1)) / rows);
              for (let idx = 0; idx < imagens.length; idx += 1) {
                const row = Math.floor(idx / cols);
                const col = idx % cols;
                const x = fotoAreaX + col * (cellW + 8);
                const y = mapY + row * (cellH + 8);
                try {
                  doc.image(imagens[idx].dadosBytea, x, y, {
                    fit: [cellW, cellH],
                    align: 'center',
                    valign: 'center',
                  });
                } catch {
                  doc
                    .fontSize(8)
                    .fillColor('#b91c1c')
                    .text('Falha na imagem.', x, y, { width: cellW });
                }
              }
              doc.x = mediaX;
              doc.y = mapY + mapaBoxH;
            } else {
              doc.x = mediaX;
              doc.y = mapY + mapaBoxH;
            }
          }

          if (fotosAoLado) {
            // Fotos já desenhadas ao lado do mapa.
          } else if (imagens.length === 0 && !mapaLocal) {
            doc
              .font('Helvetica')
              .fontSize(9)
              .fillColor('#6b7280')
              .text(imagemLinhaFallback, mediaX, mediaY, {
                width: mediaW,
              });
          } else if (!fotosAoLado && imagens.length > 0) {
            const gridStartY = mapaLocal ? doc.y + 8 : mediaY;
            for (let idx = 0; idx < imagens.length; idx += 1) {
              const row = Math.floor(idx / IMG_GRID_COLS);
              const col = idx % IMG_GRID_COLS;
              const x = mediaX + col * (imageLayout.cellW + IMG_GRID_GAP_X);
              const y = gridStartY + row * (IMG_GRID_CELL_H + IMG_GRID_GAP_Y);
              try {
                doc.image(imagens[idx].dadosBytea, x, y, {
                  fit: [imageLayout.cellW, IMG_GRID_CELL_H],
                  align: 'center',
                  valign: 'center',
                });
              } catch {
                doc
                  .fontSize(9)
                  .fillColor('#b91c1c')
                  .text(
                    'Não foi possível renderizar uma das imagens anexadas.',
                    mediaX,
                    y,
                    {
                      width: mediaW,
                    },
                  );
              }
            }
          }

          const cardEndY = tableY + hMediaCell + cardPadY;
          doc.x = marginX;
          doc.y = cardEndY + IMG_GAP_AFTER;
          normalizeCursorY();
        }
        if (doc.y + 14 <= maxContentY()) {
          doc.moveDown(0.08);
        }
        normalizeCursorY();
      }

      const range = doc.bufferedPageRange();
      const totalPages = range.count;
      for (let i = 0; i < totalPages; i += 1) {
        doc.switchToPage(i);
        const { width, height } = doc.page;
        const pageNum = i + 1;

        doc.save();
        doc.font('Helvetica').fontSize(8).fillColor('#64748b');
        const footerY = height - 38;
        const rodapeEmissor = resumo.emitidoPor?.trim();
        const textoRodapeEsquerda = rodapeEmissor
          ? `Emissão: ${dataEmissao} · Usuário: ${rodapeEmissor}`
          : `Emissão: ${dataEmissao}`;
        const larguraPagina = width - marginX * 2;
        const pageStr = `Página ${pageNum} de ${totalPages}`;
        const pageStrW = doc.widthOfString(pageStr);
        const gapCentral = 20;
        const leftMaxW = Math.max(60, larguraPagina - pageStrW - gapCentral);
        const leftDraw = this.truncatePdfTextToWidth(
          doc,
          textoRodapeEsquerda,
          leftMaxW,
        );
        /** Sem `width`: não usa LineWrapper; y na margem inferior não dispara quebra de página. */
        doc.text(leftDraw, marginX, footerY, { lineBreak: false });
        doc.text(pageStr, width - marginX - pageStrW, footerY, {
          lineBreak: false,
        });
        doc
          .moveTo(marginX, footerY - 8)
          .lineTo(width - marginX, footerY - 8)
          .strokeColor('#e2e8f0')
          .lineWidth(0.5)
          .stroke();
        doc.restore();
      }

      doc.flushPages();
      doc.end();
    });
  }

  private assertEmailRelatorioConfigSeAtivo(
    empresa: EmpresaTerceira,
    configuracao: Configuracao | null,
  ): void {
    if (!empresa.enviarEmailRelatorio) {
      return;
    }
    const emailConfig = configuracao?.emailEnvioConfig;
    if (!emailConfig?.ativo) {
      return;
    }
    if (!emailConfig.host || !emailConfig.porta) {
      throw new BadRequestException(
        'Envio de e-mail está ativo: informe host e porta SMTP em Configurações → Envio de E-mail.',
      );
    }
    if (!emailConfig.remetenteEmail?.trim()) {
      throw new BadRequestException(
        'Envio de e-mail está ativo: informe o e-mail do remetente nas Configurações.',
      );
    }
    const destinatarios = (empresa.emailsRelatorio ?? '')
      .split(/[;,]/)
      .map((email) => email.trim())
      .filter(Boolean);
    if (destinatarios.length === 0) {
      throw new BadRequestException(
        `Envio de e-mail está ativo: cadastre e-mail(is) de relatório na empresa "${empresa.descricao}".`,
      );
    }
  }

  private async sendRelatorioManutencaoEmail(
    empresa: EmpresaTerceira,
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
    configuracao: Configuracao | null,
  ): Promise<{ enviado: boolean }> {
    if (!empresa.enviarEmailRelatorio) {
      return { enviado: false };
    }
    const emailConfig = configuracao?.emailEnvioConfig;
    if (!emailConfig?.ativo) {
      return { enviado: false };
    }

    if (!emailConfig.host || !emailConfig.porta) {
      throw new BadRequestException(
        'Configuração de e-mail inválida: host/porta obrigatórios.',
      );
    }

    const destinatarios = (empresa.emailsRelatorio ?? '')
      .split(/[;,]/)
      .map((email) => email.trim())
      .filter(Boolean);

    if (destinatarios.length === 0) {
      throw new BadRequestException(
        `A empresa "${empresa.descricao}" não possui e-mail de recebimento cadastrado.`,
      );
    }

    const transport = createTransport({
      host: emailConfig.host,
      port: Number(emailConfig.porta),
      secure: Number(emailConfig.porta) === 465,
      requireTLS: !!emailConfig.usarTls,
      connectionTimeout: 45_000,
      greetingTimeout: 30_000,
      socketTimeout: 45_000,
      auth:
        emailConfig.usuario && emailConfig.senha
          ? {
              user: emailConfig.usuario,
              pass: emailConfig.senha,
            }
          : undefined,
    });

    const assuntoBase =
      emailConfig.assuntoPadrao?.trim() ||
      'Relatório de Serviço(s) - Irregularidades';
    const assuntoData = this.formatDateTimeBr(resumo.emitidoEm).replace(
      ',',
      '',
    );
    const assunto = `${assuntoBase} (${assuntoData})`;
    const fromAddress = emailConfig.remetenteEmail?.trim();
    if (!fromAddress) {
      throw new BadRequestException(
        'Configuração de e-mail inválida: remetente não informado.',
      );
    }
    const fromName = emailConfig.remetenteNome?.trim();
    const from = fromName ? `"${fromName}" <${fromAddress}>` : fromAddress;
    const pdfRelatorio = await this.buildPdfRelatorioManutencao(
      resumo,
      irregularidades,
      configuracao ?? null,
    );

    try {
      await transport.sendMail({
        from,
        to: destinatarios.join(', '),
        subject: assunto,
        html: `
        <p>Prezados,</p>
        <p>Segue em anexo o relatório de Serviço(s) com as irregularidades enviadas para manutenção.</p>
        <p><strong>Resumo:</strong> ${resumo.totalIrregularidades} irregularidade(s) / ${resumo.totalVeiculos} veículo(s).</p>
      `,
        attachments: [
          {
            filename: this.buildRelatorioAttachmentFilename(empresa.descricao),
            content: pdfRelatorio,
            contentType: 'application/pdf',
          },
        ],
      });
      return { enviado: true };
    } catch (err) {
      const detalhe = err instanceof Error ? err.message : String(err);
      this.logger.warn(
        `Falha SMTP ao enviar relatório de manutenção: ${detalhe}`,
      );
      throw new BadRequestException(
        `Não foi possível enviar o relatório por e-mail. As irregularidades não foram encaminhadas para manutenção. Verifique SMTP e credenciais. Detalhe: ${detalhe}`,
      );
    }
  }

  /**
   * Se o snapshot `statusBrtComentario` ainda estiver vazio (OS já Paralisada/Retido
   * antes da coluna), preenche com o comentário mais recente da timeline BRT.
   */
  private async preencherStatusBrtComentarioFallback(
    data: IrregularidadeResumoDto[],
  ): Promise<void> {
    const semMotivo = data.filter((item) => {
      const n = normalizarSituacaoBrt(item.statusBrtAtual);
      return (
        item.numOsExternoAtual != null &&
        !item.statusBrtComentario?.trim() &&
        (n.startsWith('paralisad') || n.startsWith('retid'))
      );
    });
    if (!semMotivo.length) {
      return;
    }
    const numOsList = [
      ...new Set(
        semMotivo
          .map((item) => item.numOsExternoAtual)
          .filter((n): n is number => n != null),
      ),
    ];
    const eventos = await this.osExternaStatusEventoRepository
      .createQueryBuilder('e')
      .where('e.integrador = :integrador', { integrador: 'BRT' })
      .andWhere('e.numOsExterno IN (:...numOsList)', { numOsList })
      .andWhere('e.comentario IS NOT NULL')
      .andWhere("TRIM(e.comentario) <> ''")
      .orderBy('e.dataEventoBrt', 'DESC', 'NULLS LAST')
      .addOrderBy('e.recebidoEm', 'DESC')
      .getMany();

    const comentarioByKey = new Map<string, string>();
    for (const evento of eventos) {
      const key = `${evento.numOsExterno}|${normalizarSituacaoBrt(evento.statusBrt)}`;
      if (!comentarioByKey.has(key) && evento.comentario?.trim()) {
        comentarioByKey.set(key, evento.comentario.trim());
      }
    }

    for (const item of semMotivo) {
      const key = `${item.numOsExternoAtual}|${normalizarSituacaoBrt(item.statusBrtAtual)}`;
      const comentario = comentarioByKey.get(key);
      if (comentario) {
        item.statusBrtComentario = comentario;
      }
    }
  }

  private toResumo(
    item: Irregularidade,
    gravidade?: GravidadeCriticidade,
    quantidadeFotos = 0,
    quantidadeAudios = 0,
    fotos: Array<{
      id: string;
      nomeArquivo: string;
      mimeType: string;
      dadosBase64: string;
    }> = [],
    audios: Array<{
      id: string;
      nomeArquivo: string;
      mimeType: string;
      dadosBase64: string;
    }> = [],
    veiculoDescricaoRaw?: string,
    veiculoPlacaRaw?: string,
    veiculoModeloRaw?: string,
    vistoriadorNomeRaw?: string,
    motoristaNomeRaw?: string,
    criadoEmRaw?: string,
    entradaStatusEmRaw?: string,
  ): IrregularidadeResumoDto {
    const createdAt = criadoEmRaw
      ? new Date(criadoEmRaw).toISOString()
      : item.criadoEm.toISOString();

    return {
      id: item.id,
      idvistoria: item.idVistoria,
      numeroVistoria: item.vistoria?.numeroVistoria,
      numeroIrregularidade: item.numeroIrregularidade,
      idarea: item.idArea,
      nomeArea: item.area?.nome,
      idcomponente: item.idComponente,
      nomeComponente: item.componente?.nome,
      idsintoma: item.idSintoma,
      descricaoSintoma: item.sintoma?.descricao,
      observacao: item.observacao ?? undefined,
      resolvido: item.resolvido,
      statusAtual: item.statusAtual,
      criadoEm: createdAt,
      entradaStatusEm: entradaStatusEmRaw
        ? new Date(entradaStatusEmRaw).toISOString()
        : undefined,
      atualizadoEm: item.atualizadoEm.toISOString(),
      idVeiculo: item.vistoria?.idVeiculo,
      gravidade,
      veiculoDescricao:
        veiculoDescricaoRaw ?? item.vistoria?.veiculo?.descricao,
      veiculoPlaca: veiculoPlacaRaw ?? item.vistoria?.veiculo?.placa,
      veiculoModelo:
        veiculoModeloRaw ?? item.vistoria?.veiculo?.modeloVeiculo?.nome,
      veiculoCombustivel: item.vistoria?.veiculo?.combustivel ?? undefined,
      veiculoModeloId: item.vistoria?.veiculo?.idModelo ?? undefined,
      vistoriadorNome: vistoriadorNomeRaw ?? item.vistoria?.usuario?.nome,
      motoristaNome: motoristaNomeRaw ?? item.vistoria?.motorista?.nome,
      quantidadeFotos,
      quantidadeAudios,
      fotos,
      audios,
      origemRegistro: item.origemRegistro ?? undefined,
      controleIntegracaoApi: item.controleIntegracaoApi,
      osOrigAtual: item.osOrigAtual ?? undefined,
      numOsExternoAtual: item.numOsExternoAtual ?? undefined,
      statusBrtAtual: item.statusBrtAtual ?? undefined,
      statusBrtAtualizadoEm: item.statusBrtAtualizadoEm
        ? item.statusBrtAtualizadoEm.toISOString()
        : undefined,
      statusBrtComentario: item.statusBrtComentario ?? undefined,
      ultimoErroIntegracao: item.ultimoErroIntegracao ?? undefined,
      ultimoErroIntegracaoEm: item.ultimoErroIntegracaoEm
        ? item.ultimoErroIntegracaoEm.toISOString()
        : undefined,
      erpCodigoPedido: item.erpCodigoPedido ?? undefined,
      erpUltimoErro: item.erpUltimoErro ?? undefined,
      marcacao: this.mapMarcacao(item),
      marcacoes: this.mapMarcacoes(item),
      exigeMarcacaoMapa: item.sintoma?.exigeMarcacaoMapa ?? false,
    };
  }

  private mapMarcacoes(item: Irregularidade): IrregularidadeMarcacaoDto[] {
    const rows = [...(item.marcacoes ?? [])].sort(
      (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0),
    );
    if (rows.length > 0) {
      return rows.map((row) => ({
        idVista: row.idVista,
        descricaoVista: item.vista?.descricao ?? '',
        posXPct: Number(row.posXPct),
        posYPct: Number(row.posYPct),
        ordem: row.ordem ?? 0,
      }));
    }
    const legado = this.mapMarcacaoFromCols(item);
    return legado ? [legado] : [];
  }

  private mapMarcacao(item: Irregularidade): IrregularidadeMarcacaoDto | null {
    const todas = this.mapMarcacoes(item);
    return todas[0] ?? null;
  }

  private mapMarcacaoFromCols(
    item: Irregularidade,
  ): IrregularidadeMarcacaoDto | null {
    if (
      !item.idVista ||
      item.posXPct === null ||
      item.posXPct === undefined ||
      item.posYPct === null ||
      item.posYPct === undefined
    ) {
      return null;
    }
    return {
      idVista: item.idVista,
      descricaoVista: item.vista?.descricao ?? '',
      posXPct: Number(item.posXPct),
      posYPct: Number(item.posYPct),
      ordem: 0,
    };
  }

  private normalizarPontosEntrada(dto: {
    marcacoes?: MarcacaoPontoDto[];
    idVista?: string;
    posXPct?: number;
    posYPct?: number;
  }): MarcacaoPontoDto[] {
    if (dto.marcacoes && dto.marcacoes.length > 0) {
      return dto.marcacoes.slice(0, MARCACOES_MAX_POR_IRREGULARIDADE);
    }
    if (
      dto.idVista &&
      dto.posXPct !== undefined &&
      dto.posYPct !== undefined
    ) {
      return [
        {
          idVista: dto.idVista,
          posXPct: dto.posXPct,
          posYPct: dto.posYPct,
        },
      ];
    }
    return [];
  }

  private async persistirMarcacoes(
    repo: Repository<IrregularidadeMarcacao>,
    idIrregularidade: string,
    idVista: string | null,
    pontos: Array<{ posXPct: number; posYPct: number }>,
  ): Promise<void> {
    await repo.delete({ idIrregularidade });
    if (!idVista || pontos.length === 0) {
      return;
    }
    const entities = pontos.map((ponto, ordem) =>
      repo.create({
        idIrregularidade,
        idVista,
        posXPct: ponto.posXPct,
        posYPct: ponto.posYPct,
        ordem,
      }),
    );
    await repo.save(entities);
  }

  private rotuloCirculoMarcacao(indiceOs: number, ordem: number): string {
    return `${indiceOs}.${Math.max(0, ordem) + 1}`;
  }

  private async resolveMarcacoes(
    vistoria: Vistoria,
    idComponente: string,
    idSintoma: string,
    dto: {
      marcacoes?: MarcacaoPontoDto[];
      idVista?: string;
      posXPct?: number;
      posYPct?: number;
    },
    existente?: Irregularidade,
  ): Promise<{
    idVista: string | null;
    pontos: Array<{ posXPct: number; posYPct: number }>;
  }> {
    const sintoma = await this.sintomaRepository.findOne({
      where: { id: idSintoma },
    });
    if (!sintoma) {
      throw new NotFoundException('Sintoma não encontrado');
    }

    const pontosDto = this.normalizarPontosEntrada(dto);
    const enviouMarcacao = pontosDto.length > 0;

    const pontosExistentes = existente
      ? this.mapMarcacoes(existente).map((m) => ({
          posXPct: m.posXPct,
          posYPct: m.posYPct,
          idVista: m.idVista,
        }))
      : [];
    const existenteCompleta = pontosExistentes.length > 0;

    if (!sintoma.exigeMarcacaoMapa) {
      // Destino sem mapa: remove marcações existentes (UI confirma antes de enviar).
      return { idVista: null, pontos: [] };
    }

    const idModelo = vistoria.veiculo?.idModelo;
    if (!idModelo) {
      throw new UnprocessableEntityException(
        'Cadastre ao menos uma vista no modelo do veículo para sintomas que exigem localização.',
      );
    }
    const ativas = await this.vistaService.countAtivas(idModelo);
    if (ativas === 0) {
      throw new UnprocessableEntityException(
        'Cadastre ao menos uma vista no modelo do veículo para sintomas que exigem localização.',
      );
    }

    if (enviouMarcacao) {
      return this.validarPontosMarcacao(
        vistoria,
        idComponente,
        idSintoma,
        pontosDto,
      );
    }

    if (existenteCompleta) {
      return {
        idVista: pontosExistentes[0].idVista,
        pontos: pontosExistentes.map((p) => ({
          posXPct: p.posXPct,
          posYPct: p.posYPct,
        })),
      };
    }

    throw new UnprocessableEntityException(
      'Marque o local da irregularidade no desenho do veículo.',
    );
  }

  private async validarPontosMarcacao(
    vistoria: Vistoria,
    idComponente: string,
    idSintoma: string,
    pontosDto: MarcacaoPontoDto[],
  ): Promise<{
    idVista: string;
    pontos: Array<{ posXPct: number; posYPct: number }>;
  }> {
    if (pontosDto.length > MARCACOES_MAX_POR_IRREGULARIDADE) {
      throw new UnprocessableEntityException(
        `É permitido no máximo ${MARCACOES_MAX_POR_IRREGULARIDADE} marcações por irregularidade.`,
      );
    }
    const idVista = pontosDto[0].idVista;
    if (pontosDto.some((p) => p.idVista !== idVista)) {
      throw new UnprocessableEntityException(
        'Todas as marcações da irregularidade devem ser na mesma vista.',
      );
    }
    const idModelo = vistoria.veiculo?.idModelo;
    if (!idModelo) {
      throw new UnprocessableEntityException(
        'Cadastre ao menos uma vista no modelo do veículo para sintomas que exigem localização.',
      );
    }
    const vista = await this.vistaService.assertVistaDoModelo(idModelo, idVista);
    await this.assertVistaPermitidaNaMatriz(
      idComponente,
      idSintoma,
      vista.idCatalogo,
    );
    return {
      idVista,
      pontos: pontosDto.map((p) => ({
        posXPct: p.posXPct,
        posYPct: p.posYPct,
      })),
    };
  }

  private async assertVistaPermitidaNaMatriz(
    idComponente: string,
    idSintoma: string,
    idCatalogo: string,
  ): Promise<void> {
    const matriz = await this.matrizRepository.findOne({
      where: { idComponente, idSintoma },
    });
    const permitidas = (matriz?.idVistas ?? []).filter(Boolean);
    if (permitidas.length === 0) {
      return;
    }
    if (!permitidas.includes(idCatalogo)) {
      throw new UnprocessableEntityException(
        'A vista marcada não está entre as permitidas para este sintoma.',
      );
    }
  }

  private assertIrregularidadeCreatePermission(
    vistoria: Vistoria,
    permissions?: Set<string>,
  ): void {
    const normalized = permissions ?? new Set<string>();
    const canMobile = normalized.has(Permission.VISTORIA_UPDATE.toLowerCase());
    const canSos = normalized.has(
      Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS.toLowerCase(),
    );
    const isSosVistoria = vistoria.origem === OrigemVistoria.SOS_WEB;

    if (isSosVistoria) {
      if (!canSos && !canMobile) {
        throw new ForbiddenException(
          'Sem permissão para registrar irregularidade em vistoria SOS.',
        );
      }
      return;
    }

    if (!canMobile) {
      throw new ForbiddenException(
        'Sem permissão para registrar irregularidade em vistoria mobile.',
      );
    }
  }

  private async assertSosMidiaPermission(
    irregularidadeId: string,
    permissions?: Set<string>,
  ): Promise<void> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    const vistoria = await this.getVistoriaOrFail(irregularidade.idVistoria);
    this.assertIrregularidadeCreatePermission(vistoria, permissions);
  }

  private assertStatus(
    irregularidade: Irregularidade,
    allowed: StatusIrregularidade[],
    message: string,
  ): void {
    if (!allowed.includes(irregularidade.statusAtual)) {
      throw new BadRequestException(message);
    }
  }

  private assertManutencaoManualPermitida(irregularidade: Irregularidade): void {
    if (irregularidade.controleIntegracaoApi) {
      throw new BadRequestException(
        'Esta irregularidade é controlada pela integração de OS. Não é permitido marcar como não procede manualmente até o retorno integrado da API.',
      );
    }
  }

  private buildManutencaoEnvioContext(actor?: {
    id?: string;
    idEmpresa?: string;
    nome?: string;
  }): ManutencaoEnvioContext {
    return {
      actor,
      registrarHistorico: async (manager, data) => {
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          data,
        );
      },
      buildResumoRelatorio: (empresa, irregularidades, emitidoEm, emitidoPor) =>
        this.buildResumoRelatorioManutencao(
          empresa,
          irregularidades,
          emitidoEm,
          emitidoPor,
        ),
      buildHtmlRelatorio: (resumo, irregularidades) =>
        this.buildHtmlRelatorioManutencao(resumo, irregularidades),
      assertEmailConfigIfNeeded: (empresa, configuracao) =>
        this.assertEmailRelatorioConfigSeAtivo(empresa, configuracao),
      sendRelatorioEmail: (empresa, resumo, irregularidades, configuracao) =>
        this.sendRelatorioManutencaoEmail(
          empresa,
          resumo,
          irregularidades,
          configuracao,
        ),
      buildPdfRelatorio: (resumo, irregularidades, configuracao) =>
        this.buildPdfRelatorioManutencao(
          resumo,
          irregularidades,
          configuracao,
        ),
    };
  }

  private async ensureEmpresa(idEmpresa: string): Promise<void> {
    const empresa = await this.empresaTerceiraRepository.findOne({
      where: { id: idEmpresa },
    });
    if (!empresa) {
      throw new NotFoundException('Empresa de manutenção não encontrada');
    }
  }

  private assertEmpresaEscopo(
    irregularidade: Irregularidade,
    idsEmpresasUsuario?: string[],
  ): void {
    const ids = (idsEmpresasUsuario ?? []).filter(Boolean);
    if (!ids.length) {
      throw new ForbiddenException(
        'Usuário sem empresa de manutenção vinculada',
      );
    }
    if (!irregularidade.idEmpresaManutencao) {
      throw new ForbiddenException(
        'Irregularidade sem empresa de manutenção vinculada',
      );
    }
    if (!ids.includes(irregularidade.idEmpresaManutencao)) {
      throw new ForbiddenException(
        'Sem acesso: irregularidade pertence a outra empresa de manutenção',
      );
    }
  }

  private async registrarHistoricoTransicao(
    historicoRepository: Repository<IrregularidadeHistorico>,
    data: {
      idIrregularidade: string;
      statusOrigem?: StatusIrregularidade;
      statusDestino: StatusIrregularidade;
      acao: string;
      idUsuario?: string;
      idEmpresaEvento?: string;
      observacao?: string;
      correlationId?: string;
    },
  ): Promise<void> {
    const evento = historicoRepository.create({
      idIrregularidade: data.idIrregularidade,
      statusOrigem: data.statusOrigem,
      statusDestino: data.statusDestino,
      acao: data.acao,
      idUsuario: data.idUsuario,
      idEmpresaEvento: data.idEmpresaEvento,
      dataEvento: new Date(),
      observacao: data.observacao,
      correlationId: data.correlationId,
    });
    await historicoRepository.save(evento);
  }

  private async formatClassificacaoLabel(
    idArea: string,
    idComponente: string,
    idSintoma: string,
  ): Promise<string> {
    const [area, componente, sintoma] = await Promise.all([
      this.areaRepository.findOne({ where: { id: idArea } }),
      this.componenteRepository.findOne({ where: { id: idComponente } }),
      this.sintomaRepository.findOne({ where: { id: idSintoma } }),
    ]);
    return `${area?.nome?.trim() || '-'} - ${componente?.nome?.trim() || '-'} - ${sintoma?.descricao?.trim() || '-'}`;
  }

  private snapshotMarcacao(irregularidade: Irregularidade): {
    idVista: string | null;
    pontos: Array<{ posXPct: number; posYPct: number }>;
  } {
    const pontos = this.mapMarcacoes(irregularidade);
    if (pontos.length === 0) {
      return { idVista: null, pontos: [] };
    }
    return {
      idVista: pontos[0].idVista,
      pontos: pontos.map((p) => ({
        posXPct: p.posXPct,
        posYPct: p.posYPct,
      })),
    };
  }

  private assinaturaMarcacao(
    idVista: string | null | undefined,
    pontos: Array<{ posXPct: number; posYPct: number }>,
  ): string {
    const vista = idVista ?? '';
    const contato = pontos
      .map(
        (p) =>
          `${Number(p.posXPct).toFixed(2)},${Number(p.posYPct).toFixed(2)}`,
      )
      .join(';');
    return `${vista}|${contato}`;
  }

  private async montarObservacaoHistoricoReclassificacao(params: {
    classificacaoAlterada: boolean;
    idAreaOrigem: string;
    idComponenteOrigem: string;
    idSintomaOrigem: string;
    idAreaDestino: string;
    idComponenteDestino: string;
    idSintomaDestino: string;
    descricaoAlterada: boolean;
    descricaoAnterior: string;
    descricaoNova: string;
    marcacaoAlterada: boolean;
  }): Promise<string | undefined> {
    const partes: string[] = [];

    if (params.classificacaoAlterada) {
      const [origem, destino] = await Promise.all([
        this.formatClassificacaoLabel(
          params.idAreaOrigem,
          params.idComponenteOrigem,
          params.idSintomaOrigem,
        ),
        this.formatClassificacaoLabel(
          params.idAreaDestino,
          params.idComponenteDestino,
          params.idSintomaDestino,
        ),
      ]);
      partes.push(`${origem}\nalterado para\n${destino}`);
    }

    if (params.descricaoAlterada) {
      const anterior = params.descricaoAnterior || '(sem descrição)';
      const nova = params.descricaoNova || '(sem descrição)';
      partes.push(`${anterior}\nalterado para\n${nova}`);
    }

    if (params.marcacaoAlterada) {
      partes.push('Marcação alterada');
    }

    if (partes.length === 0) {
      return undefined;
    }
    return partes.join('\n\n');
  }

  private async ensureArea(id: string): Promise<void> {
    const area = await this.areaRepository.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }
  }

  private async ensureComponente(id: string): Promise<void> {
    const componente = await this.componenteRepository.findOne({
      where: { id },
    });
    if (!componente) {
      throw new NotFoundException('Componente não encontrado');
    }
  }

  private async ensureSintoma(id: string): Promise<void> {
    const sintoma = await this.sintomaRepository.findOne({ where: { id } });
    if (!sintoma) {
      throw new NotFoundException('Sintoma não encontrado');
    }
  }

  private async ensureComponenteNaArea(
    idArea: string,
    idComponente: string,
  ): Promise<void> {
    const found = await this.areaComponenteRepository.findOne({
      where: { idArea, idComponente },
    });
    if (!found) {
      throw new BadRequestException('Componente não pertence à área informada');
    }
  }

  private async ensureMatriz(
    idComponente: string,
    idSintoma: string,
  ): Promise<MatrizCriticidade> {
    const matriz = await this.matrizRepository.findOne({
      where: { idComponente, idSintoma },
    });
    if (!matriz) {
      throw new NotFoundException('Matriz de criticidade não encontrada');
    }
    return matriz;
  }

  private async getVistoriaOrFail(id: string): Promise<Vistoria> {
    const vistoria = await this.vistoriaRepository.findOne({
      where: { id },
      relations: ['veiculo'],
    });
    if (!vistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }
    return vistoria;
  }

  private async ensureVistoriaAberta(vistoriaId: string): Promise<void> {
    const vistoria = await this.getVistoriaOrFail(vistoriaId);
    this.assertVistoriaAberta(vistoria);
  }

  private assertVistoriaAberta(vistoria: Vistoria): void {
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    if (vistoria.status === StatusVistoria.CANCELADA) {
      throw new BadRequestException('Vistoria cancelada');
    }
  }

  private async getIrregularidadeOrFail(id: string): Promise<Irregularidade> {
    const irregularidade = await this.irregularidadeRepository.findOne({
      where: { id },
      // Não hidratar `sintoma`/`componente`/`area`: no save o TypeORM prioriza a
      // relação carregada e pode ignorar alteração de FK (ex.: reclassificar).
      relations: ['vista', 'marcacoes'],
    });
    if (!irregularidade) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    return irregularidade;
  }

  private async generateNumeroIrregularidade(
    manager: EntityManager,
  ): Promise<number> {
    const anoAtual = new Date().getFullYear();
    const lockKey = `irregularidade_numero_${anoAtual}`;
    await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [
      lockKey,
    ]);

    const prefixoAno = `${anoAtual}`;
    const rows = await manager.query(
      `
        SELECT
          MAX(numero_irregularidade) AS max_num
        FROM irregularidades
        WHERE numero_irregularidade IS NOT NULL
          AND numero_irregularidade::text LIKE $1
      `,
      [`${prefixoAno}%`],
    );

    const maxNumRaw = rows?.[0]?.max_num;
    const maxNum =
      maxNumRaw === null || maxNumRaw === undefined ? 0 : Number(maxNumRaw);
    const maxNumTexto = maxNum > 0 ? String(maxNum) : '';
    const maxSeq = maxNumTexto.startsWith(prefixoAno)
      ? Number(maxNumTexto.slice(prefixoAno.length) || '0')
      : 0;
    const proximaSequencia = maxSeq + 1;

    return Number(`${prefixoAno}${proximaSequencia}`);
  }

  private isNumeroIrregularidadeUniqueViolation(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }
    const driverError = (
      error as QueryFailedError & {
        driverError?: { code?: string; constraint?: string };
      }
    ).driverError;
    return (
      driverError?.code === '23505' &&
      driverError?.constraint === 'UQ_IRREGULARIDADE_NUMERO'
    );
  }

  private parseHorasNaoNegativas(value?: number | string | null): number | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }
    const n = typeof value === 'number' ? value : Number(String(value).trim());
    if (!Number.isFinite(n) || n < 0) {
      return null;
    }
    return Math.floor(n);
  }

  /**
   * Texto do filtro Tempo na etapa no subtítulo do PDF.
   * Personalizado (múltiplo de 24 h, ≥ 24): exibe em dias.
   * Presets curtos (ex.: 8 h): permanece em horas.
   */
  private formatFiltroTempoEtapaTexto(
    horasMin: number | null,
    horasMax: number | null,
  ): string {
    const formatValor = (horas: number): string => {
      if (horas >= 24 && horas % 24 === 0) {
        const dias = horas / 24;
        return dias === 1 ? '1 dia' : `${dias} dias`;
      }
      return horas === 1 ? '1 h' : `${horas} h`;
    };

    if (horasMin != null && horasMax != null) {
      return `Tempo na etapa: maior que ${formatValor(horasMin)} e até ${formatValor(horasMax)}`;
    }
    if (horasMin != null) {
      return `Tempo na etapa: maior que ${formatValor(horasMin)}`;
    }
    return `Tempo na etapa: até ${formatValor(horasMax!)}`;
  }

  private parseLocalDate(dateInput: string, endOfDay: boolean): Date {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput);
    if (!match) {
      throw new BadRequestException(
        endOfDay ? 'dataFim inválida' : 'dataInicio inválida',
      );
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = endOfDay
      ? new Date(year, month - 1, day, 23, 59, 59, 999)
      : new Date(year, month - 1, day, 0, 0, 0, 0);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        endOfDay ? 'dataFim inválida' : 'dataInicio inválida',
      );
    }

    return date;
  }
}
