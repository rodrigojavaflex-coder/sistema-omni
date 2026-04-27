import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
import { createTransport } from 'nodemailer';
import { existsSync } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';
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
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { GravidadeCriticidade } from '../../common/enums/gravidade-criticidade.enum';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Configuracao } from '../configuracao/entities/configuracao.entity';
import { IniciarManutencaoLoteDto } from './dto/iniciar-manutencao-lote.dto';
import {
  RelatorioManutencaoExecucaoDto,
  RelatorioManutencaoPreviewDto,
  RelatorioManutencaoResumoDto,
} from './dto/relatorio-manutencao.dto';

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
    @InjectRepository(IrregularidadeHistorico)
    private readonly irregularidadeHistoricoRepository: Repository<IrregularidadeHistorico>,
  ) {}

  async create(
    vistoriaId: string,
    dto: CreateIrregularidadeDto,
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const vistoria = await this.getVistoriaOrFail(vistoriaId);
    this.assertVistoriaAberta(vistoria);
    const idUsuarioEvento = actor?.id ?? vistoria.idUsuario;

    await this.ensureArea(dto.idarea);
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    await this.ensureComponenteNaArea(dto.idarea, dto.idcomponente);
    await this.ensureMatriz(dto.idcomponente, dto.idsintoma);

    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      let saved: Irregularidade | null = null;
      let lastError: unknown;

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const numeroIrregularidade = await this.generateNumeroIrregularidade(manager);
        const irregularidade = manager.getRepository(Irregularidade).create({
          idVistoria: vistoria.id,
          numeroIrregularidade,
          idArea: dto.idarea,
          idComponente: dto.idcomponente,
          idSintoma: dto.idsintoma,
          observacao: dto.observacao,
          resolvido: false,
          statusAtual: StatusIrregularidade.REGISTRADA,
        });

        try {
          saved = await manager.getRepository(Irregularidade).save(irregularidade);
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

      await this.registrarHistoricoTransicao(
        manager.getRepository(IrregularidadeHistorico),
        {
          idIrregularidade: saved.id,
          statusOrigem: undefined,
          statusDestino: StatusIrregularidade.REGISTRADA,
          acao: 'registrar',
          idUsuario: idUsuarioEvento,
          idEmpresaEvento: actor?.idEmpresa,
          observacao: 'Irregularidade registrada pelo aplicativo',
        },
      );
      return saved;
    });
  }

  async listPendentesByVeiculo(idVeiculo: string): Promise<IrregularidadeResumoDto[]> {
    const itens = await this.irregularidadeRepository
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('v.usuario', 'vistoriador')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .where('v.idVeiculo = :idVeiculo', { idVeiculo })
      .andWhere('v.status = :statusVistoriaFinalizada', {
        statusVistoriaFinalizada: StatusVistoria.FINALIZADA,
      })
      .andWhere('i.statusAtual NOT IN (:...statusFinal)', {
        statusFinal: [StatusIrregularidade.VALIDADA, StatusIrregularidade.CANCELADA],
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
    }));
  }

  async listByVistoria(vistoriaId: string): Promise<IrregularidadeResumoDto[]> {
    await this.getVistoriaOrFail(vistoriaId);
    const itens = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoriaId },
      relations: ['area', 'componente', 'sintoma'],
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
    }));
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
      .where('v.idVeiculo = :idVeiculo', { idVeiculo })
      .andWhere('v.status = :statusFinalizada', {
        statusFinalizada: StatusVistoria.FINALIZADA,
      })
      .andWhere('i.statusAtual NOT IN (:...statusFinal)', {
        statusFinal: [StatusIrregularidade.VALIDADA, StatusIrregularidade.CANCELADA],
      });

    if (areaId) {
      qb.andWhere('i.idArea = :areaId', { areaId });
    }
    if (componenteId) {
      qb.andWhere('i.idComponente = :componenteId', { componenteId });
    }

    const itens = await qb.orderBy('i.atualizadoEm', 'DESC').getMany();
    const idsIrregularidade = itens.map((item) => item.id);
    const midiasPorIrregularidade = new Map<string, IrregularidadeHistoricoVeiculoItemDto['midias']>();

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

    const mapped: IrregularidadeHistoricoVeiculoItemDto[] = itens.map((item) => ({
      id: item.id,
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
    }));

    return {
      idveiculo: idVeiculo,
      veiculo: itens[0]?.vistoria?.veiculo?.descricao ?? '',
      total: mapped.length,
      itens: mapped,
    };
  }

  async update(id: string, dto: UpdateIrregularidadeDto): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);

    const updated = this.irregularidadeRepository.merge(irregularidade, {
      observacao: dto.observacao ?? irregularidade.observacao,
    });
    return this.irregularidadeRepository.save(updated);
  }

  async listByStatus(
    status: StatusIrregularidade[],
    context: { idEmpresa?: string; scopeByEmpresa?: boolean },
    filters?: {
      idVeiculo?: string;
      gravidade?: GravidadeCriticidade[];
      dataInicio?: string;
      dataFim?: string;
    },
  ): Promise<IrregularidadeResumoDto[]> {
    let qb = this.irregularidadeRepository
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
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
    if (context.scopeByEmpresa && status.some((s) => statusEmpresa.includes(s))) {
      if (!context.idEmpresa) {
        throw new ForbiddenException(
          'Usuário sem empresa vinculada para acessar fila de manutenção',
        );
      }
      qb = qb.andWhere('i.idEmpresaManutencao = :idEmpresa', {
        idEmpresa: context.idEmpresa,
      });
    }

    if (filters?.idVeiculo) {
      qb = qb.andWhere('v.idVeiculo = :idVeiculo', { idVeiculo: filters.idVeiculo });
    }
    if (filters?.gravidade?.length) {
      qb = qb.andWhere('matriz.gravidade IN (:...gravidade)', {
        gravidade: filters.gravidade,
      });
    }
    if (filters?.dataInicio) {
      const dataInicio = this.parseLocalDate(filters.dataInicio, false);
      qb = qb.andWhere('i.criadoEm >= :dataInicio', { dataInicio });
    }
    if (filters?.dataFim) {
      const dataFim = this.parseLocalDate(filters.dataFim, true);
      qb = qb.andWhere('i.criadoEm <= :dataFim', { dataFim });
    }

    const result = await qb.orderBy('i.atualizadoEm', 'DESC').getRawAndEntities();
    const ids = result.entities.map((i) => i.id);

    const countsByIrregularidade = new Map<string, { foto: number; audio: number }>();
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
        .getRawMany<{ idIrregularidade: string; tipo: 'imagem' | 'audio'; total: string }>();

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

    const vistoriaIds = Array.from(new Set(result.entities.map((i) => i.idVistoria)));
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
        if (!row.idIrregularidade || !row.statusDestino || !row.entradaStatusEm) continue;
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
      const entradaStatusEm = entradaStatusByKey.get(`${item.id}|${item.statusAtual}`);
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
      [StatusIrregularidade.REGISTRADA],
      'Somente irregularidades registradas podem ser reclassificadas',
    );
    await this.ensureArea(dto.idarea);
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    await this.ensureComponenteNaArea(dto.idarea, dto.idcomponente);
    await this.ensureMatriz(dto.idcomponente, dto.idsintoma);

    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      irregularidade.idArea = dto.idarea;
      irregularidade.idComponente = dto.idcomponente;
      irregularidade.idSintoma = dto.idsintoma;
      irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
      await this.registrarHistoricoTransicao(
        manager.getRepository(IrregularidadeHistorico),
        {
          idIrregularidade: saved.id,
          statusOrigem: StatusIrregularidade.REGISTRADA,
          statusDestino: StatusIrregularidade.REGISTRADA,
          acao: 'reclassificar',
          idUsuario: actor?.id,
          idEmpresaEvento: actor?.idEmpresa,
          observacao: dto.observacao,
        },
      );
      return saved;
    });
  }

  async cancelar(
    id: string,
    dto: CancelarIrregularidadeDto,
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.REGISTRADA],
      'Somente irregularidades registradas podem ser canceladas',
    );
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      irregularidade.statusAtual = StatusIrregularidade.CANCELADA;
      irregularidade.resolvido = true;
      irregularidade.motivoCancelamento = dto.motivo;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
      await this.registrarHistoricoTransicao(
        manager.getRepository(IrregularidadeHistorico),
        {
          idIrregularidade: saved.id,
          statusOrigem: StatusIrregularidade.REGISTRADA,
          statusDestino: StatusIrregularidade.CANCELADA,
          acao: 'cancelar',
          idUsuario: actor?.id,
          idEmpresaEvento: actor?.idEmpresa,
          observacao: dto.motivo,
        },
      );
      return saved;
    });
  }

  async iniciarManutencao(
    id: string,
    dto: IniciarManutencaoIrregularidadeDto,
    actor?: { id?: string; idEmpresa?: string },
  ): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    this.assertStatus(
      irregularidade,
      [StatusIrregularidade.REGISTRADA],
      'Somente irregularidades registradas podem ser enviadas para manutenção',
    );
    await this.ensureEmpresa(dto.idEmpresaManutencao);

    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      irregularidade.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
      irregularidade.idEmpresaManutencao = dto.idEmpresaManutencao;
      irregularidade.iniciadaManutencaoEm = new Date();
      irregularidade.resolvido = false;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
      await this.registrarHistoricoTransicao(
        manager.getRepository(IrregularidadeHistorico),
        {
          idIrregularidade: saved.id,
          statusOrigem: StatusIrregularidade.REGISTRADA,
          statusDestino: StatusIrregularidade.EM_MANUTENCAO,
          acao: 'iniciar_manutencao',
          idUsuario: actor?.id,
          idEmpresaEvento: dto.idEmpresaManutencao,
        },
      );
      return saved;
    });
  }

  async previewIniciarManutencaoLote(
    dto: IniciarManutencaoLoteDto,
    actor?: { nome?: string },
  ): Promise<RelatorioManutencaoPreviewDto> {
    const { empresa, irregularidades } = await this.loadIrregularidadesLoteParaManutencao(dto);
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
    const { empresa, irregularidades } = await this.loadIrregularidadesLoteParaManutencao(dto);
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
    const { empresa, irregularidades } = await this.loadIrregularidadesLoteParaManutencao(dto);
    const emitidoEm = new Date();
    const resumo = this.buildResumoRelatorioManutencao(
      empresa,
      irregularidades,
      emitidoEm,
      actor?.nome,
    );
    const html = this.buildHtmlRelatorioManutencao(resumo, irregularidades);

    const config = await this.configuracaoRepository.findOne({ where: {} });
    this.assertEmailRelatorioConfigSeAtivo(empresa, config);

    const emailOutcome = await this.sendRelatorioManutencaoEmail(
      empresa,
      resumo,
      irregularidades,
      config,
    );

    await this.irregularidadeRepository.manager.transaction(async (manager) => {
      for (const irregularidade of irregularidades) {
        irregularidade.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
        irregularidade.idEmpresaManutencao = dto.idEmpresaManutencao;
        irregularidade.iniciadaManutencaoEm = new Date();
        irregularidade.resolvido = false;

        const saved = await manager.getRepository(Irregularidade).save(irregularidade);
        await this.registrarHistoricoTransicao(
          manager.getRepository(IrregularidadeHistorico),
          {
            idIrregularidade: saved.id,
            statusOrigem: StatusIrregularidade.REGISTRADA,
            statusDestino: StatusIrregularidade.EM_MANUTENCAO,
            acao: 'iniciar_manutencao',
            idUsuario: actor?.id,
            idEmpresaEvento: dto.idEmpresaManutencao,
          },
        );
      }
    });

    return {
      resumo,
      html,
      totalEnviadas: irregularidades.length,
      emailEnviado: emailOutcome.enviado,
    };
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
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      irregularidade.statusAtual = StatusIrregularidade.CONCLUIDA;
      irregularidade.concluidaManutencaoEm = new Date();
      irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
      irregularidade.resolvido = false;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
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
    });
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
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      irregularidade.statusAtual = StatusIrregularidade.NAO_PROCEDE;
      irregularidade.motivoNaoProcede = dto.motivoNaoProcede;
      irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
      irregularidade.resolvido = false;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
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
    });
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
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      const origem = irregularidade.statusAtual;
      irregularidade.statusAtual = StatusIrregularidade.VALIDADA;
      irregularidade.validadaEm = new Date();
      irregularidade.resolvido = true;
      irregularidade.observacao = dto.observacao ?? irregularidade.observacao;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
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
    });
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
    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      const origem = irregularidade.statusAtual;
      irregularidade.statusAtual = StatusIrregularidade.EM_MANUTENCAO;
      irregularidade.resolvido = false;
      irregularidade.observacao = dto.observacao;
      const saved = await manager.getRepository(Irregularidade).save(irregularidade);
      await this.registrarHistoricoTransicao(
        manager.getRepository(IrregularidadeHistorico),
        {
          idIrregularidade: saved.id,
          statusOrigem: origem,
          statusDestino: StatusIrregularidade.EM_MANUTENCAO,
          acao: 'reprovar_validacao_final',
          idUsuario: actor?.id,
          idEmpresaEvento: actor?.idEmpresa,
          observacao: dto.observacao,
        },
      );
      return saved;
    });
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
  ): Promise<IrregularidadeMidia[]> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);

    const matriz = await this.ensureMatriz(
      irregularidade.idComponente,
      irregularidade.idSintoma,
    );
    if (matriz.exigeFoto && (!files || files.length === 0)) {
      throw new BadRequestException('Foto obrigatória para a irregularidade');
    }

    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      await manager
        .getRepository(IrregularidadeMidia)
        .delete({ idIrregularidade: irregularidadeId, tipo: 'imagem' });

      const midias = await Promise.all((files ?? []).map(async (file) => {
        const nomePadrao = this.buildMidiaFilename(
          irregularidade.numeroIrregularidade,
          'imagem',
          file.originalname,
        );
        const otimizada = await this.otimizarImagemParaArmazenamento(
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
      }));

      if (midias.length === 0) {
        return [];
      }

      return manager.getRepository(IrregularidadeMidia).save(midias);
    });
  }

  async uploadAudio(
    irregularidadeId: string,
    file: Express.Multer.File,
    duracaoMs?: number,
  ): Promise<IrregularidadeMidia> {
    if (!file) {
      throw new BadRequestException('Arquivo de áudio não enviado');
    }

    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);

    const matriz = await this.ensureMatriz(
      irregularidade.idComponente,
      irregularidade.idSintoma,
    );
    if (!matriz.permiteAudio) {
      throw new BadRequestException('Áudio não permitido para esta irregularidade');
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

  async removeAudio(irregularidadeId: string): Promise<void> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);
    await this.midiaRepository.delete({ idIrregularidade: irregularidadeId, tipo: 'audio' });
  }

  async removeMidia(midiaId: string): Promise<void> {
    const midia = await this.midiaRepository.findOne({ where: { id: midiaId } });
    if (!midia) {
      throw new NotFoundException('Mídia não encontrada');
    }
    await this.ensureVistoriaAberta(midia.idIrregularidade);
    await this.midiaRepository.remove(midia);
  }

  private async otimizarImagemParaArmazenamento(
    buffer: Buffer,
    mimeType: string,
    nomeArquivo: string,
  ): Promise<{ buffer: Buffer; mimeType: string; nomeArquivo: string }> {
    return { buffer, mimeType, nomeArquivo };
  }

  private formatDateTimeBr(dateInput: string | Date): string {
    return new Date(dateInput).toLocaleString('pt-BR');
  }

  private buildRelatorioAttachmentFilename(empresa: string): string {
    const empresaSanitizada = this.sanitizeForFilename(empresa).slice(0, 40) || 'empresa';
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    return `relatorio-manutencao_${empresaSanitizada}_${timestamp}.pdf`;
  }

  private buildMidiaFilename(
    numeroIrregularidade: number | undefined,
    tipo: 'imagem' | 'audio',
    originalName: string,
  ): string {
    const numero = Number.isFinite(numeroIrregularidade) ? String(numeroIrregularidade) : 'sem-os';
    const ext = this.extractFileExtension(originalName) || (tipo === 'audio' ? 'mp3' : 'jpg');
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
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

  private async loadIrregularidadesLoteParaManutencao(dto: IniciarManutencaoLoteDto): Promise<{
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
      (item) => item.statusAtual !== StatusIrregularidade.REGISTRADA,
    );
    if (invalidas.length > 0) {
      throw new BadRequestException(
        'Somente irregularidades com status Registrada podem ser enviadas para manutenção.',
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
    const porVeiculoMap = new Map<string, RelatorioManutencaoResumoDto['porVeiculo'][number]>();
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
        totalImagens: (item.midias ?? []).filter((m) => m.tipo === 'imagem').length,
      });
    }

    const porVeiculo = Array.from(porVeiculoMap.values()).sort((a, b) =>
      a.veiculo.localeCompare(b.veiculo),
    );
    for (const grupo of porVeiculo) {
      grupo.itens.sort((a, b) => a.ordemServico - b.ordemServico);
    }

    const totalAnexos = porVeiculo.reduce(
      (acc, grupo) => acc + grupo.itens.reduce((sum, item) => sum + (item.totalImagens || 0), 0),
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
            const irregularidade = irregularidades.find((i) => i.id === itemResumo.id);
            const imagens = (irregularidade?.midias ?? []).filter((m) => m.tipo === 'imagem');
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

        const veiculoMeta = [grupo.placa ?? '', grupo.modelo ?? ''].filter(Boolean).join(' ');
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

  private resolveLogoRelatorioPath(logoRelatorio?: string | null): string | null {
    if (!logoRelatorio?.trim()) {
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

  private async buildPdfRelatorioManutencao(
    resumo: RelatorioManutencaoResumoDto,
    irregularidades: Irregularidade[],
    configuracao: Configuracao | null,
  ): Promise<Buffer> {
    const dataEmissao = this.formatDateTimeBr(resumo.emitidoEm);
    const logoPath = this.resolveLogoRelatorioPath(configuracao?.logoRelatorio);

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
        const cellW = Math.floor((contentWidth - IMG_GRID_GAP_X * (IMG_GRID_COLS - 1)) / IMG_GRID_COLS);
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

      if (logoPath) {
        try {
          doc.image(logoPath, marginX, headerRowTop, { fit: [logoBoxW, logoBoxH] });
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
        .text(`Empresa de manutenção: ${resumo.empresa}`, marginX, doc.y + gapSubtitulo, {
          width: innerW,
          align: 'center',
        });
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

      const buildVeiculoHeader = (grupo: RelatorioManutencaoResumoDto['porVeiculo'][number]) => {
        const dadosVeiculo = [grupo.veiculo, grupo.placa ?? '', grupo.modelo ?? '']
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
          const irregularidade = irregularidades.find((i) => i.id === itemResumo.id);
          const imagens = (irregularidade?.midias ?? []).filter((m) => m.tipo === 'imagem');
          const obsTxt = itemResumo.observacao?.trim() || 'Não informada.';

          const cardPadX = 12;
          const cardPadY = 10;
          const cardInnerW = innerW - cardPadX * 2;
          const imageLayout = getImageGridLayout(imagens.length, cardInnerW);
          const imagemLinhaFallback = 'Sem imagens anexadas.';

          const hVeiculoCard = measureTextHeight(veiculoHeader, 'Helvetica-Bold', 10, cardInnerW);
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
          const hImgs =
            imagens.length > 0
              ? imageLayout.gridH
              : measureTextHeight(imagemLinhaFallback, 'Helvetica', 9, cardInnerW);
          const cardContentH =
            hOs + 6 + hVeiculoCard + 5 + hIrreg + 5 + hObsLine + 8 + hImgs;
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
            .text(`Ordem de Serviço #${itemResumo.ordemServico}`, { width: cardInnerW });
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
            .text(`IRREGULARIDADE: ${itemResumo.irregularidade}`, { width: cardInnerW });
          doc.moveDown(0.25);
          const obsLine = `DESCRIÇÃO DO PROBLEMA: ${obsTxt}`;
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#64748b')
            .text(obsLine, { width: cardInnerW });
          doc.moveDown(0.35);

          if (imagens.length === 0) {
            doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(imagemLinhaFallback, {
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
                  .text('Não foi possível renderizar uma das imagens anexadas.', cardTextX, y, {
                    width: cardInnerW,
                  });
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
        const leftDraw = this.truncatePdfTextToWidth(doc, textoRodapeEsquerda, leftMaxW);
        /** Sem `width`: não usa LineWrapper; y na margem inferior não dispara quebra de página. */
        doc.text(leftDraw, marginX, footerY, { lineBreak: false });
        doc.text(pageStr, width - marginX - pageStrW, footerY, { lineBreak: false });
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
    const emailConfig = configuracao?.emailEnvioConfig;
    if (!emailConfig?.ativo) {
      return { enviado: false };
    }

    if (!emailConfig.host || !emailConfig.porta) {
      throw new BadRequestException('Configuração de e-mail inválida: host/porta obrigatórios.');
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
      emailConfig.assuntoPadrao?.trim() || 'Relatório de Serviço(s) - Irregularidades';
    const assuntoData = this.formatDateTimeBr(resumo.emitidoEm).replace(',', '');
    const assunto = `${assuntoBase} (${assuntoData})`;
    const fromAddress = emailConfig.remetenteEmail?.trim();
    if (!fromAddress) {
      throw new BadRequestException('Configuração de e-mail inválida: remetente não informado.');
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
      this.logger.warn(`Falha SMTP ao enviar relatório de manutenção: ${detalhe}`);
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
      veiculoDescricao: veiculoDescricaoRaw ?? item.vistoria?.veiculo?.descricao,
      veiculoPlaca: veiculoPlacaRaw ?? item.vistoria?.veiculo?.placa,
      veiculoModelo: veiculoModeloRaw ?? item.vistoria?.veiculo?.modeloVeiculo?.nome,
      vistoriadorNome: vistoriadorNomeRaw ?? item.vistoria?.usuario?.nome,
      motoristaNome: motoristaNomeRaw ?? item.vistoria?.motorista?.nome,
      quantidadeFotos,
      quantidadeAudios,
      fotos,
      audios,
    };
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
    const componente = await this.componenteRepository.findOne({ where: { id } });
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

  private async ensureComponenteNaArea(idArea: string, idComponente: string): Promise<void> {
    const found = await this.areaComponenteRepository.findOne({
      where: { idArea, idComponente },
    });
    if (!found) {
      throw new BadRequestException('Componente não pertence à área informada');
    }
  }

  private async ensureMatriz(idComponente: string, idSintoma: string): Promise<MatrizCriticidade> {
    const matriz = await this.matrizRepository.findOne({
      where: { idComponente, idSintoma },
    });
    if (!matriz) {
      throw new NotFoundException('Matriz de criticidade não encontrada');
    }
    return matriz;
  }

  private async getVistoriaOrFail(id: string): Promise<Vistoria> {
    const vistoria = await this.vistoriaRepository.findOne({ where: { id } });
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
    });
    if (!irregularidade) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    return irregularidade;
  }

  private async generateNumeroIrregularidade(manager: EntityManager): Promise<number> {
    const anoAtual = new Date().getFullYear();
    const lockKey = `irregularidade_numero_${anoAtual}`;
    await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [lockKey]);

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
    const maxNum = maxNumRaw === null || maxNumRaw === undefined ? 0 : Number(maxNumRaw);
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
    const driverError = (error as QueryFailedError & {
      driverError?: { code?: string; constraint?: string };
    }).driverError;
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
