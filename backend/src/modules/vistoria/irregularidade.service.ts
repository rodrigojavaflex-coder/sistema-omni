import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, QueryFailedError, Repository } from 'typeorm';
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

@Injectable()
export class IrregularidadeService {
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
        vistoriadorNome?: string;
        motoristaNome?: string;
      }
    >();
    if (vistoriaIds.length > 0) {
      const vistoriaRows = await this.vistoriaRepository
        .createQueryBuilder('v')
        .leftJoin('v.veiculo', 'veiculo')
        .leftJoin('v.usuario', 'usuario')
        .leftJoin('v.motorista', 'motorista')
        .select('v.id', 'id')
        .addSelect('veiculo.descricao', 'veiculoDescricao')
        .addSelect('veiculo.placa', 'veiculoPlaca')
        .addSelect('usuario.nome', 'vistoriadorNome')
        .addSelect('motorista.nome', 'motoristaNome')
        .where('v.id IN (:...ids)', { ids: vistoriaIds })
        .getRawMany<{
          id: string;
          veiculoDescricao?: string;
          veiculoPlaca?: string;
          vistoriadorNome?: string;
          motoristaNome?: string;
        }>();

      for (const row of vistoriaRows) {
        vistoriaInfoById.set(row.id, {
          veiculoDescricao: row.veiculoDescricao,
          veiculoPlaca: row.veiculoPlaca,
          vistoriadorNome: row.vistoriadorNome,
          motoristaNome: row.motoristaNome,
        });
      }
    }

    return result.entities.map((item, index) => {
      const raw = result.raw[index] as {
        matriz_gravidade?: GravidadeCriticidade;
        veiculo_descricao?: string;
        veiculo_placa?: string;
        vistoriador_nome?: string;
        motorista_nome?: string;
        irregularidade_criado_em?: string;
      };
      const counts = countsByIrregularidade.get(item.id);
      const midias = midiasByIrregularidade.get(item.id);
      const vistoriaInfo = vistoriaInfoById.get(item.idVistoria);
      return this.toResumo(
        item,
        raw?.matriz_gravidade,
        counts?.foto ?? 0,
        counts?.audio ?? 0,
        midias?.fotos ?? [],
        midias?.audios ?? [],
        raw?.veiculo_descricao ?? vistoriaInfo?.veiculoDescricao,
        raw?.veiculo_placa ?? vistoriaInfo?.veiculoPlaca,
        raw?.vistoriador_nome ?? vistoriaInfo?.vistoriadorNome,
        raw?.motorista_nome ?? vistoriaInfo?.motoristaNome,
        raw?.irregularidade_criado_em,
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
        const otimizada = await this.otimizarImagemParaArmazenamento(
          file.buffer,
          file.mimetype,
          file.originalname,
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
      nomeArquivo: file.originalname,
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
    vistoriadorNomeRaw?: string,
    motoristaNomeRaw?: string,
    criadoEmRaw?: string,
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
      atualizadoEm: item.atualizadoEm.toISOString(),
      idVeiculo: item.vistoria?.idVeiculo,
      gravidade,
      veiculoDescricao: veiculoDescricaoRaw ?? item.vistoria?.veiculo?.descricao,
      veiculoPlaca: veiculoPlacaRaw ?? item.vistoria?.veiculo?.placa,
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
