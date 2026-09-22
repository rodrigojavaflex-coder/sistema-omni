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
  IrregularidadeHistoricoVeiculoDto,
  IrregularidadeHistoricoVeiculoItemDto,
} from './dto/irregularidade-historico-veiculo.dto';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import {
  OrigemRegistroIrregularidade,
  OrigemVistoria,
} from '../../common/enums/origem-vistoria.enum';
import { Permission } from '../../common/enums/permission.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { GravidadeCriticidade } from '../../common/enums/gravidade-criticidade.enum';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Configuracao } from '../configuracao/entities/configuracao.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { IniciarManutencaoLoteDto } from './dto/iniciar-manutencao-lote.dto';
import {
  RelatorioManutencaoExecucaoDto,
  RelatorioManutencaoPreviewDto,
  RelatorioManutencaoResumoDto,
} from './dto/relatorio-manutencao.dto';
import { IrregularidadeManutencaoEnvioService,
  ManutencaoEnvioContext,
  STATUS_ENVIO_MANUTENCAO,
} from './irregularidade-manutencao-envio.service';
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
    await this.getIrregularidadeOrFail(irregularidadeId);
    const historico = await this.irregularidadeHistoricoRepository.find({
      where: { idIrregularidade: irregularidadeId },
      relations: ['usuario'],
      order: { dataEvento: 'ASC' },
    });

    const mapped = historico.map((item, index) => {
      const proximo = historico[index + 1];
      const inicio = item.dataEvento.getTime();
      const fim = proximo ? proximo.dataEvento.getTime() : Date.now();
      return {
        id: item.id,
        statusOrigem: item.statusOrigem,
        statusDestino: item.statusDestino,
        acao: item.acao,
        dataEvento: item.dataEvento.toISOString(),
        idUsuario: item.idUsuario,
        usuarioNome: item.usuario?.nome,
        observacao: item.observacao,
        tempoEtapaMs: Math.max(0, fim - inicio),
      };
    });

    return mapped.reverse();
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
        irregularidade.idVista = marcacao.idVista;
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
    context: { idEmpresa?: string; scopeByEmpresa?: boolean },
    filters?: {
      idVeiculo?: string;
      gravidade?: GravidadeCriticidade[];
      dataInicio?: string;
      dataFim?: string;
      /** Trecho numérico da O.S.: busca parcial (ILIKE) em `numeroIrregularidade` (apenas dígitos). */
      ordemServico?: string;
      /** Alinha o filtro de datas à coluna "Registrado" por etapa (front: getDataRegistradoFluxo). */
      referenciaPeriodo?: 'CRIADO_EM' | 'ENTRADA_STATUS';
      /** Filtra por origem do registro (`SOS_WEB` ou `MOBILE` para null). */
      origemRegistro?: 'SOS_WEB' | 'MOBILE';
    },
  ): Promise<IrregularidadeResumoDto[]> {
    let qb = this.irregularidadeRepository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .leftJoinAndSelect('i.vista', 'vista')
      .leftJoinAndSelect('i.marcacoes', 'marcacoesPontos')
      .leftJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('v.veiculo', 'veiculo')
      .leftJoinAndSelect('v.usuario', 'vistoriador')
      .leftJoinAndSelect('v.motorista', 'motorista')
      .addSelect('veiculo.descricao', 'veiculo_descricao')
      .addSelect('veiculo.placa', 'veiculo_placa')
      .addSelect('vistoriador.nome', 'vistoriador_nome')
      .addSelect('motorista.nome', 'motorista_nome')
      .addSelect('i.criadoEm', 'irregularidade_criado_em')
      .leftJoin(
        MatrizCriticidade,
        'matriz',
        'matriz.idComponente = i.idComponente AND matriz.idSintoma = i.idSintoma',
      )
      .addSelect('matriz.gravidade', 'matriz_gravidade')
      .where('i.statusAtual IN (:...status)', { status })
      .andWhere('v.status = :statusFinalizada', {
        statusFinalizada: StatusVistoria.FINALIZADA,
      });

    const statusEmpresa = [
      StatusIrregularidade.EM_MANUTENCAO,
      StatusIrregularidade.NAO_PROCEDE,
    ];
    if (
      context.scopeByEmpresa &&
      status.some((s) => statusEmpresa.includes(s))
    ) {
      if (!context.idEmpresa) {
        throw new ForbiddenException(
          'Usuário sem empresa vinculada para acessar fila de manutenção',
        );
      }
      qb = qb.andWhere('i.idEmpresaManutencao = :idEmpresa', {
        idEmpresa: context.idEmpresa,
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
    if (filters?.ordemServico) {
      const pat = `%${filters.ordemServico}%`;
      qb = qb.andWhere(
        'CAST(i.numeroIrregularidade AS TEXT) ILIKE :ordemServicoPat',
        {
          ordemServicoPat: pat,
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
     * ENTRADA_STATUS: instante da última transição para o status atual no histórico,
     * com fallback em criadoEm (igual ao cálculo de entradaStatusEm no retorno desta lista).
     * CRIADO_EM: data de criação do registro (fila de tratamento).
     */
    const dataRefSql = useEntradaStatus
      ? `COALESCE((
          SELECT MAX(hist."dataEvento")
          FROM "irregularidade_historico" hist
          WHERE hist."idIrregularidade" = "i"."id"
            AND hist."statusDestino" = "i"."status_atual"
        ), "i"."criadoEm")`
      : '"i"."criadoEm"';

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

    const result = await qb
      .orderBy(
        `CASE WHEN "i"."origem_registro" = :sosOrigemOrdem THEN 0 ELSE 1 END`,
        'ASC',
      )
      .addOrderBy(dataRefSql, 'ASC')
      .addOrderBy('"i"."id"', 'ASC')
      .setParameter('sosOrigemOrdem', OrigemRegistroIrregularidade.SOS_WEB)
      .getRawAndEntities();
    const ids = result.entities.map((i) => i.id);

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
    if (ids.length > 0) {
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
      new Set(result.entities.map((i) => i.idVistoria)),
    );
    const vistoriaInfoById = new Map<
      string,
      {
        veiculoDescricao?: string;
        veiculoPlaca?: string;
        veiculoModelo?: string;
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
        .addSelect('veiculo.descricao', 'veiculoDescricao')
        .addSelect('veiculo.placa', 'veiculoPlaca')
        .addSelect('modeloVeiculo.nome', 'veiculoModelo')
        .addSelect('usuario.nome', 'vistoriadorNome')
        .addSelect('motorista.nome', 'motoristaNome')
        .where('v.id IN (:...ids)', { ids: vistoriaIds })
        .getRawMany<{
          id: string;
          veiculoDescricao?: string;
          veiculoPlaca?: string;
          veiculoModelo?: string;
          vistoriadorNome?: string;
          motoristaNome?: string;
        }>();

      for (const row of vistoriaRows) {
        vistoriaInfoById.set(row.id, {
          veiculoDescricao: row.veiculoDescricao,
          veiculoPlaca: row.veiculoPlaca,
          veiculoModelo: row.veiculoModelo,
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

    return result.entities.map((item, index) => {
      const raw = result.raw[index] as {
        matriz_gravidade?: GravidadeCriticidade;
        veiculo_descricao?: string;
        veiculo_placa?: string;
        veiculo_modelo?: string;
        vistoriador_nome?: string;
        motorista_nome?: string;
        irregularidade_criado_em?: string;
      };
      const counts = countsByIrregularidade.get(item.id);
      const midias = midiasByIrregularidade.get(item.id);
      const vistoriaInfo = vistoriaInfoById.get(item.idVistoria);
      const entradaStatusEm = entradaStatusByKey.get(
        `${item.id}|${item.statusAtual}`,
      );
      return this.toResumo(
        item,
        raw?.matriz_gravidade,
        counts?.foto ?? 0,
        counts?.audio ?? 0,
        midias?.fotos ?? [],
        midias?.audios ?? [],
        raw?.veiculo_descricao ?? vistoriaInfo?.veiculoDescricao,
        raw?.veiculo_placa ?? vistoriaInfo?.veiculoPlaca,
        raw?.veiculo_modelo ?? vistoriaInfo?.veiculoModelo,
        raw?.vistoriador_nome ?? vistoriaInfo?.vistoriadorNome,
        raw?.motorista_nome ?? vistoriaInfo?.motoristaNome,
        raw?.irregularidade_criado_em,
        entradaStatusEm,
      );
    });
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
      ],
      'Somente irregularidades registradas ou em retrabalho/garantia podem ser reclassificadas',
    );
    await this.ensureArea(dto.idarea);
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    await this.ensureComponenteNaArea(dto.idarea, dto.idcomponente);
    await this.ensureMatriz(dto.idcomponente, dto.idsintoma);
    const vistoria = await this.getVistoriaOrFail(irregularidade.idVistoria);
    const marcacao = await this.resolveMarcacoes(
      vistoria,
      dto.idcomponente,
      dto.idsintoma,
      dto,
      irregularidade,
    );
    const statusOrigemReclass = irregularidade.statusAtual;
    const primeiro = marcacao.pontos[0];

    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        irregularidade.idArea = dto.idarea;
        irregularidade.idComponente = dto.idcomponente;
        irregularidade.idSintoma = dto.idsintoma;
        irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
        irregularidade.idVista = marcacao.idVista;
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
            observacao: dto.observacao,
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
      ],
      'Somente irregularidades registradas ou em retrabalho/garantia podem ser canceladas',
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
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.EM_MANUTENCAO],
      'Somente irregularidades em manutenção podem ter a OS cancelada na integração BRT',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idEmpresa);
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
        'midias',
      ],
    });
    if (!irregularidade) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    this.assertStatus(
      irregularidade,
      STATUS_ENVIO_MANUTENCAO,
      'Somente irregularidades registradas ou em retrabalho/garantia podem ser enviadas para manutenção',
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
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.EM_MANUTENCAO],
      'Somente irregularidades em manutenção podem ser concluídas',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idEmpresa);
    this.assertManutencaoManualPermitida(irregularidade);
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
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.EM_MANUTENCAO],
      'Somente irregularidades em manutenção podem ser marcadas como não procede',
    );
    this.assertEmpresaEscopo(irregularidade, actor?.idEmpresa);
    this.assertManutencaoManualPermitida(irregularidade);
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        irregularidade.statusAtual = StatusIrregularidade.NAO_PROCEDE;
        irregularidade.motivoNaoProcede = dto.motivoNaoProcede;
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
            statusDestino: StatusIrregularidade.NAO_PROCEDE,
            acao: 'marcar_nao_procede',
            idUsuario: actor?.id,
            idEmpresaEvento: actor?.idEmpresa,
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
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.CONCLUIDA, StatusIrregularidade.NAO_PROCEDE],
      'Somente irregularidades concluídas ou não procede podem ser validadas',
    );
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
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.CONCLUIDA, StatusIrregularidade.NAO_PROCEDE],
      'Somente irregularidades concluídas ou não procede podem ser reprovadas',
    );
    return this.irregularidadeRepository.manager.transaction(
      async (manager) => {
        const origem = irregularidade.statusAtual;
        irregularidade.statusAtual = StatusIrregularidade.RETRABALHO_GARANTIA;
        irregularidade.resolvido = false;
        irregularidade.controleIntegracaoApi = false;
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
            idEmpresaEvento: actor?.idEmpresa,
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
        'Somente irregularidades registradas ou em retrabalho/garantia podem ser enviadas para manutenção.',
      );
    }

    return { empresa, irregularidades };
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
        const cards = grupo.itens
          .map((itemResumo) => {
            const irregularidade = irregularidades.find(
              (i) => i.id === itemResumo.id,
            );
            const imagens = (irregularidade?.midias ?? []).filter(
              (m) => m.tipo === 'imagem',
            );
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
            return `
              <div class="item-card">
                <div class="item-head">
                  <strong>Ordem de Serviço #${itemResumo.ordemServico}</strong>
                </div>
                <div class="relatorio-bloco-tab">
                  <div class="item-field item-field-inline">
                    <span class="item-label-inline">IRREGULARIDADE:</span>
                    <span class="item-value-inline">${itemResumo.irregularidade}</span>
                  </div>
                  <div class="item-field item-field-inline">
                    <span class="item-label-inline">DESCRIÇÃO DO PROBLEMA:</span>
                    <span class="item-value-inline">${obsHtml}</span>
                  </div>
                </div>
                <div class="imagens-wrap">${imagensHtml}</div>
              </div>
            `;
          })
          .join('');

        const veiculoMeta = [grupo.placa ?? '', grupo.modelo ?? '']
          .filter(Boolean)
          .join(' ');
        return `
          <section class="veiculo-section">
            <h2 class="veiculo-titulo">Veículo: ${grupo.veiculo}${veiculoMeta ? ` ${veiculoMeta}` : ''}</h2>
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
          .resumo { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
          .veiculo-section { margin-bottom: 20px; }
          .veiculo-titulo { margin: 0 0 10px; font-size: 17px; }
          .item-card { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px; margin-bottom: 10px; }
          .item-head { margin-bottom: 10px; color: #1d4ed8; font-size: 15px; }
          .relatorio-bloco-tab { padding-left: 20px; margin-bottom: 2px; }
          .item-field { margin-bottom: 8px; }
          .item-field-inline { display: flex; flex-wrap: wrap; gap: 4px; align-items: baseline; }
          .item-label-inline { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; }
          .item-value-inline { font-size: 13px; color: #111827; line-height: 1.35; }
          .item-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #64748b; margin-bottom: 2px; }
          .item-value { display: block; font-size: 13px; color: #111827; line-height: 1.35; }
          .imagens-wrap { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; }
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
    const porVista = new Map<
      string,
      {
        descricao: string;
        circulos: CirculoMapaPdf[];
      }
    >();
    let indiceOs = 0;
    let ultimoIdIrreg: string | null = null;
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
      if (item.id !== ultimoIdIrreg) {
        indiceOs += 1;
        ultimoIdIrreg = item.id;
      }
      const idVista = marcas[0].idVista;
      const atual = porVista.get(idVista) ?? {
        descricao: marcas[0].descricaoVista || 'Vista',
        circulos: [],
      };
      marcas.forEach((marca, ordem) => {
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
  }): Promise<Buffer> {
    const dataEmissao = this.formatDateTimeBr(params.emitidoEm);
    const logoBuffer =
      params.logoBuffer && params.logoBuffer.length > 0
        ? params.logoBuffer
        : null;
    const marginX = 50;
    const contentTopY = 100;
    const footerBandPt = 92;
    const titulo = 'Relatório de Pendências do Veículo';

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
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#475569')
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

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#334155')
        .text(`Total de pendências: ${params.itens.length}`, { width: innerW });
      doc.moveDown(0.6);

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
            'Nenhuma irregularidade pendente para os filtros informados.',
            { width: innerW },
          );
      }

      for (const item of params.itens) {
        const tituloItem = `${item.nomeArea ?? 'Área'} - ${item.nomeComponente ?? 'Componente'} - ${item.descricaoSintoma ?? 'Sintoma'}`;
        const vistoriaLinha = `Vistoria: ${item.numeroVistoria ?? '-'} (${this.formatDateTimeBr(item.datavistoria)})`;
        const obsTxt = item.observacao?.trim() || 'Não informada.';
        const imagens = item.imagens;
        const mapaLocal = params.mapasPorItem?.get(item.id);
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
              rotuloCirculo: this.rotuloCirculoMarcacao(1, ponto.ordem),
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
    const partes = circulos.map(
      (circulo) => `${circulo.rotuloCirculo}:${circulo.rotulo}`,
    );
    if (partes.length === 1) {
      return `OS: ${partes[0]}`;
    }
    const ultimo = partes[partes.length - 1];
    const anteriores = partes.slice(0, -1).join(', ');
    return `OS: ${anteriores} e ${ultimo}`;
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
    const contentTopY = 100;
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

      const breakPageBody = () => {
        doc.addPage();
        doc.x = marginX;
        doc.y = contentTopY;
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

      /** Página inicial + conteúdo */
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

      /** Título e subtítulos centralizados na largura útil da página (não só à direita da logo). */
      const tituloY = headerRowTop + 10;
      doc
        .font('Helvetica')
        .fontSize(17)
        .fillColor('#0f172a')
        .text('Relatório de Serviço(s)', marginX, tituloY, {
          width: innerW,
          align: 'center',
        });

      const gapSubtitulo = 5;
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#475569')
        .text(
          `Empresa de manutenção: ${resumo.empresa}`,
          marginX,
          doc.y + gapSubtitulo,
          {
            width: innerW,
            align: 'center',
          },
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
      /** Corpo abaixo do bloco de cabeçalho (título centralizado na página + logo à esquerda). */
      doc.x = marginX;
      doc.y = Math.max(headerTextosFimY + 16, logoFimY + 12);

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

      for (const grupo of resumo.porVeiculo) {
        const veiculoHeader = buildVeiculoHeader(grupo);
        ensureTextBlock(56);

        for (const itemResumo of grupo.itens) {
          const irregularidade = irregularidades.find(
            (i) => i.id === itemResumo.id,
          );
          const imagens = (irregularidade?.midias ?? []).filter(
            (m) => m.tipo === 'imagem',
          );
          const mapaLocal = mapasPorItem.get(itemResumo.id);
          const obsTxt = itemResumo.observacao?.trim() || 'Não informada.';

          const cardPadX = 12;
          const cardPadY = 10;
          const cardInnerW = innerW - cardPadX * 2;

          const hVeiculoCard = measureTextHeight(
            veiculoHeader,
            'Helvetica-Bold',
            10,
            cardInnerW,
          );
          const hOs = measureTextHeight(
            `Ordem de Serviço #${itemResumo.ordemServico}`,
            'Helvetica-Bold',
            11,
            cardInnerW,
          );
          const hIrreg = measureTextHeight(
            `IRREGULARIDADE: ${itemResumo.irregularidade}`,
            'Helvetica-Bold',
            9,
            cardInnerW,
          );
          const hObsLine = measureTextHeight(
            `DESCRIÇÃO DO PROBLEMA: ${obsTxt}`,
            'Helvetica-Bold',
            9,
            cardInnerW,
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
              mapaBoxW = cardInnerW;
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
              ? Math.max(120, cardInnerW - mapaBoxW - 12)
              : cardInnerW,
          );
          const imagemLinhaFallback = 'Sem imagens anexadas.';
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
          const cardContentH =
            hOs +
            6 +
            hVeiculoCard +
            5 +
            hIrreg +
            5 +
            hObsLine +
            8 +
            hMidia;
          const requiredCardH = cardPadY * 2 + cardContentH + 6;

          ensureTextBlock(requiredCardH + 8);

          // Bloco visual da irregularidade com todas as informações (veículo + dados + imagens).
          const cardX = marginX;
          const cardY = doc.y;
          const cardW = innerW;
          const cardTextX = cardX + cardPadX;
          const cardTextY = cardY + cardPadY;

          doc.x = cardTextX;
          doc.y = cardTextY;
          doc
            .font('Helvetica-Bold')
            .fontSize(11)
            .fillColor('#1d4ed8')
            .text(`Ordem de Serviço #${itemResumo.ordemServico}`, {
              width: cardInnerW,
            });
          doc.moveDown(0.3);
          doc
            .font('Helvetica-Bold')
            .fontSize(10)
            .fillColor('#334155')
            .text(veiculoHeader, { width: cardInnerW });
          doc.moveDown(0.25);
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#64748b')
            .text(`IRREGULARIDADE: ${itemResumo.irregularidade}`, {
              width: cardInnerW,
            });
          doc.moveDown(0.25);
          const obsLine = `DESCRIÇÃO DO PROBLEMA: ${obsTxt}`;
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#64748b')
            .text(obsLine, { width: cardInnerW });
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
                rotuloCirculo: this.rotuloCirculoMarcacao(1, ponto.ordem),
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
              .text(imagemLinhaFallback, {
                width: cardInnerW,
              });
          } else {
            const gridStartY = doc.y;
            for (let idx = 0; idx < imagens.length; idx += 1) {
              const row = Math.floor(idx / IMG_GRID_COLS);
              const col = idx % IMG_GRID_COLS;
              const x = cardTextX + col * (imageLayout.cellW + IMG_GRID_GAP_X);
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
                    cardTextX,
                    y,
                    {
                      width: cardInnerW,
                    },
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
            .roundedRect(cardX, cardY, cardW, Math.max(42, cardEndY - cardY), 6)
            .stroke()
            .restore();

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

        if (i > 0) {
          doc.save();
          doc.fontSize(8).fillColor('#475569');
          const headerMid = 'Relatório de Serviço(s)';
          const colW = (width - marginX * 2) / 2;
          doc.text(headerMid, marginX, 42, { width: colW, ellipsis: true });
          doc.text(resumo.empresa, marginX + colW, 42, {
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
      ultimoErroIntegracao:
        item.numOsExternoAtual != null
          ? undefined
          : item.ultimoErroIntegracao ?? undefined,
      ultimoErroIntegracaoEm:
        item.numOsExternoAtual != null
          ? undefined
          : item.ultimoErroIntegracaoEm
            ? item.ultimoErroIntegracaoEm.toISOString()
            : undefined,
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
        'Esta irregularidade é controlada pela integração de OS. A conclusão será registrada automaticamente quando o retorno da API estiver disponível.',
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
    idEmpresaUsuario?: string,
  ): void {
    if (!idEmpresaUsuario) {
      throw new ForbiddenException('Usuário sem empresa vinculada');
    }
    if (!irregularidade.idEmpresaManutencao) {
      throw new ForbiddenException(
        'Irregularidade sem empresa de manutenção vinculada',
      );
    }
    if (irregularidade.idEmpresaManutencao !== idEmpresaUsuario) {
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
      relations: ['vista', 'marcacoes', 'sintoma'],
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
