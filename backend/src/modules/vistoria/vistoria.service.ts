import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Vistoria } from './entities/vistoria.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { Motorista } from '../motorista/entities/motorista.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { Irregularidade } from './entities/irregularidade.entity';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { FinalizeVistoriaDto } from './dto/finalize-vistoria.dto';
import { UpdateVistoriaDto } from './dto/update-vistoria.dto';
import { StatusVeiculo } from '../../common/enums/status-veiculo.enum';
import { StatusMotorista } from '../../common/enums/status-motorista.enum';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { Combustivel } from '../../common/enums/combustivel.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { OrigemVistoria } from '../../common/enums/origem-vistoria.enum';
import { CreateVistoriaSosDto } from './dto/create-vistoria-sos.dto';
import { SosSessaoAbertaDto } from './dto/sos-sessao-aberta.dto';
import { IrregularidadeMidia } from './entities/irregularidade-midia.entity';
import { IrregularidadeHistorico } from './entities/irregularidade-historico.entity';

@Injectable()
export class VistoriaService {
  constructor(
    @InjectRepository(Vistoria)
    private readonly vistoriaRepository: Repository<Vistoria>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(AreaVistoriada)
    private readonly areaRepository: Repository<AreaVistoriada>,
    @InjectRepository(AreaComponente)
    private readonly areaComponenteRepository: Repository<AreaComponente>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizRepository: Repository<MatrizCriticidade>,
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
  ) {}

  async create(dto: CreateVistoriaDto): Promise<Vistoria> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: dto.idusuario },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!usuario.ativo) {
      throw new BadRequestException('Usuário inativo');
    }

    const veiculo = await this.veiculoRepository.findOne({
      where: { id: dto.idveiculo },
    });
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }
    if (veiculo.status !== StatusVeiculo.ATIVO) {
      throw new BadRequestException('Veículo inativo');
    }
    if (veiculo.combustivel === Combustivel.ELETRICO) {
      if (
        dto.porcentagembateria === null ||
        dto.porcentagembateria === undefined
      ) {
        throw new BadRequestException(
          'Percentual de bateria é obrigatório para veículo elétrico',
        );
      }
    }

    const motorista = await this.motoristaRepository.findOne({
      where: { id: dto.idmotorista },
    });
    if (!motorista) {
      throw new NotFoundException('Motorista não encontrado');
    }
    if (motorista.status !== StatusMotorista.ATIVO) {
      throw new BadRequestException('Motorista inativo');
    }

    const dataVistoria = new Date(dto.datavistoria);
    const ano = dataVistoria.getFullYear();
    const anoInicio = ano * 1000;
    const anoFim = (ano + 1) * 1000;

    const maxResult = await this.vistoriaRepository
      .createQueryBuilder('v')
      .select('MAX(v.numeroVistoria)', 'maxNum')
      .where('v.numeroVistoria >= :anoInicio', { anoInicio })
      .andWhere('v.numeroVistoria < :anoFim', { anoFim })
      .getRawOne<{ maxNum: number | null }>();

    const proximoNumero =
      maxResult?.maxNum != null ? maxResult.maxNum + 1 : anoInicio + 1;

    const vistoria = this.vistoriaRepository.create({
      idUsuario: dto.idusuario,
      idVeiculo: dto.idveiculo,
      idMotorista: dto.idmotorista,
      odometro: dto.odometro,
      porcentagembateria:
        dto.porcentagembateria === undefined ? null : dto.porcentagembateria,
      numeroVistoria: proximoNumero,
      datavistoria: dataVistoria,
      tempo: 0,
      status: StatusVistoria.EM_ANDAMENTO,
    });

    return this.vistoriaRepository.save(vistoria);
  }

  async createSos(
    dto: CreateVistoriaSosDto,
    idUsuario: string,
  ): Promise<Vistoria> {
    await this.validateOdometroVeiculo(
      dto.idveiculo,
      dto.odometro,
      undefined,
    );

    const dataVistoria = new Date();
    const ano = dataVistoria.getFullYear();
    const anoInicio = ano * 1000;
    const anoFim = (ano + 1) * 1000;

    const veiculo = await this.veiculoRepository.findOne({
      where: { id: dto.idveiculo },
    });
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }
    if (veiculo.status !== StatusVeiculo.ATIVO) {
      throw new BadRequestException('Veículo inativo');
    }
    if (veiculo.combustivel === Combustivel.ELETRICO) {
      if (
        dto.porcentagembateria === null ||
        dto.porcentagembateria === undefined
      ) {
        throw new BadRequestException(
          'Percentual de bateria é obrigatório para veículo elétrico',
        );
      }
    }

    const motorista = await this.motoristaRepository.findOne({
      where: { id: dto.idmotorista },
    });
    if (!motorista) {
      throw new NotFoundException('Motorista não encontrado');
    }
    if (motorista.status !== StatusMotorista.ATIVO) {
      throw new BadRequestException('Motorista inativo');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuario },
    });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    if (!usuario.ativo) {
      throw new BadRequestException('Usuário inativo');
    }

    const maxResult = await this.vistoriaRepository
      .createQueryBuilder('v')
      .select('MAX(v.numeroVistoria)', 'maxNum')
      .where('v.numeroVistoria >= :anoInicio', { anoInicio })
      .andWhere('v.numeroVistoria < :anoFim', { anoFim })
      .getRawOne<{ maxNum: number | null }>();

    const proximoNumero =
      maxResult?.maxNum != null ? maxResult.maxNum + 1 : anoInicio + 1;

    const vistoria = this.vistoriaRepository.create({
      idUsuario,
      idVeiculo: dto.idveiculo,
      idMotorista: dto.idmotorista,
      odometro: dto.odometro,
      porcentagembateria:
        dto.porcentagembateria === undefined ? null : dto.porcentagembateria,
      numeroVistoria: proximoNumero,
      datavistoria: dataVistoria,
      tempo: 0,
      status: StatusVistoria.EM_ANDAMENTO,
      origem: OrigemVistoria.SOS_WEB,
      observacao: dto.observacao?.trim() || undefined,
    });

    return this.vistoriaRepository.save(vistoria);
  }

  async validateOdometroVeiculo(
    idVeiculo: string,
    odometro: number,
    ignorarVistoriaId?: string,
  ): Promise<void> {
    if (odometro <= 0) {
      throw new BadRequestException('Informe um odômetro válido.');
    }
    if (odometro > 9999999) {
      throw new BadRequestException('Odômetro não pode ser maior que 9.999.999.');
    }

    const ultimo = await this.getUltimoOdometro(idVeiculo, ignorarVistoriaId);
    if (!ultimo) {
      return;
    }
    if (odometro <= ultimo.odometro) {
      throw new BadRequestException(
        'Odômetro deve ser maior que o da última vistoria.',
      );
    }
  }

  async update(id: string, dto: UpdateVistoriaDto): Promise<Vistoria> {
    const vistoria = await this.findOne(id);
    if (vistoria.status !== StatusVistoria.EM_ANDAMENTO) {
      throw new BadRequestException(
        'Somente vistorias em andamento podem ser atualizadas',
      );
    }

    const veiculoId = dto.idveiculo ?? vistoria.idVeiculo;
    const veiculo = await this.veiculoRepository.findOne({
      where: { id: veiculoId },
    });
    if (!veiculo) {
      throw new NotFoundException('Veículo não encontrado');
    }
    if (veiculo.status !== StatusVeiculo.ATIVO) {
      throw new BadRequestException('Veículo inativo');
    }

    if (dto.idmotorista) {
      const motorista = await this.motoristaRepository.findOne({
        where: { id: dto.idmotorista },
      });
      if (!motorista) {
        throw new NotFoundException('Motorista não encontrado');
      }
      if (motorista.status !== StatusMotorista.ATIVO) {
        throw new BadRequestException('Motorista inativo');
      }
    }

    const bateriaAtual =
      dto.porcentagembateria !== undefined
        ? dto.porcentagembateria
        : vistoria.porcentagembateria;
    if (veiculo.combustivel === Combustivel.ELETRICO) {
      if (bateriaAtual === null || bateriaAtual === undefined) {
        throw new BadRequestException(
          'Percentual de bateria é obrigatório para veículo elétrico',
        );
      }
    }

    const bateriaFinal =
      veiculo.combustivel === Combustivel.ELETRICO
        ? bateriaAtual
        : dto.porcentagembateria !== undefined
          ? dto.porcentagembateria
          : null;

    const updated = this.vistoriaRepository.merge(vistoria, {
      idVeiculo: dto.idveiculo ?? vistoria.idVeiculo,
      idMotorista: dto.idmotorista ?? vistoria.idMotorista,
      odometro: dto.odometro ?? vistoria.odometro,
      porcentagembateria: bateriaFinal,
      datavistoria: dto.datavistoria
        ? new Date(dto.datavistoria)
        : vistoria.datavistoria,
    });

    return this.vistoriaRepository.save(updated);
  }

  async getUltimoOdometro(
    idveiculo: string,
    ignorarVistoriaId?: string,
  ): Promise<{
    odometro: number;
    datavistoria: string;
  } | null> {
    const query = this.vistoriaRepository
      .createQueryBuilder('vistoria')
      .where('vistoria.idVeiculo = :idVeiculo', { idVeiculo: idveiculo })
      .andWhere('vistoria.status = :statusFinalizada', {
        statusFinalizada: StatusVistoria.FINALIZADA,
      })
      .orderBy('vistoria.datavistoria', 'DESC');

    if (ignorarVistoriaId) {
      query.andWhere('vistoria.id != :ignorarVistoriaId', {
        ignorarVistoriaId,
      });
    }

    const ultima = await query.getOne();
    if (!ultima || ultima.odometro === null || ultima.odometro === undefined) {
      return null;
    }
    return {
      odometro: Number(ultima.odometro),
      datavistoria: ultima.datavistoria
        ? ultima.datavistoria.toISOString()
        : new Date().toISOString(),
    };
  }

  async getSosSessaoAberta(
    idUsuario: string,
  ): Promise<SosSessaoAbertaDto | null> {
    const vistoria = await this.vistoriaRepository
      .createQueryBuilder('vistoria')
      .leftJoinAndSelect('vistoria.veiculo', 'veiculo')
      .leftJoinAndSelect('vistoria.motorista', 'motorista')
      .where('vistoria.idUsuario = :idUsuario', { idUsuario })
      .andWhere('vistoria.status = :status', {
        status: StatusVistoria.EM_ANDAMENTO,
      })
      .andWhere('vistoria.origem = :origem', { origem: OrigemVistoria.SOS_WEB })
      .orderBy('vistoria.datavistoria', 'DESC')
      .getOne();

    if (!vistoria) {
      return null;
    }

    const irregularidades = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoria.id },
      relations: ['area', 'componente', 'sintoma'],
      order: { criadoEm: 'ASC' },
    });

    const ids = irregularidades.map((i) => i.id);
    const midias =
      ids.length > 0
        ? await this.vistoriaRepository.manager
            .getRepository(IrregularidadeMidia)
            .find({ where: { idIrregularidade: In(ids) } })
        : [];

    const midiasPorIrregularidade = new Map<
      string,
      { fotos: number; audios: number }
    >();
    for (const midia of midias) {
      const atual = midiasPorIrregularidade.get(midia.idIrregularidade) ?? {
        fotos: 0,
        audios: 0,
      };
      if (midia.tipo === 'imagem') {
        atual.fotos += 1;
      } else if (midia.tipo === 'audio') {
        atual.audios += 1;
      }
      midiasPorIrregularidade.set(midia.idIrregularidade, atual);
    }

    const irregularidadesResumo = await Promise.all(
      irregularidades.map(async (item) => {
        const matriz = await this.matrizRepository.findOne({
          where: {
            idComponente: item.idComponente,
            idSintoma: item.idSintoma,
          },
        });
        const contagem = midiasPorIrregularidade.get(item.id) ?? {
          fotos: 0,
          audios: 0,
        };
        return {
          id: item.id,
          numeroIrregularidade: item.numeroIrregularidade,
          nomeArea: item.area?.nome ?? '',
          nomeComponente: item.componente?.nome ?? '',
          descricaoSintoma: item.sintoma?.descricao ?? '',
          qtdFotos: contagem.fotos,
          qtdAudios: contagem.audios,
          exigeFoto: !!matriz?.exigeFoto,
        };
      }),
    );

    return {
      id: vistoria.id,
      idVeiculo: vistoria.idVeiculo,
      idMotorista: vistoria.idMotorista,
      odometro: Number(vistoria.odometro),
      porcentagembateria:
        vistoria.porcentagembateria === null ||
        vistoria.porcentagembateria === undefined
          ? null
          : Number(vistoria.porcentagembateria),
      datavistoria: vistoria.datavistoria.toISOString(),
      numeroVistoria: vistoria.numeroVistoria,
      veiculoDescricao: vistoria.veiculo?.descricao,
      veiculoPlaca: vistoria.veiculo?.placa,
      motoristaNome: vistoria.motorista?.nome,
      irregularidades: irregularidadesResumo,
    };
  }

  async finalize(
    vistoriaId: string,
    dto: FinalizeVistoriaDto,
  ): Promise<Vistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.CANCELADA) {
      throw new BadRequestException('Vistoria cancelada');
    }
    if (vistoria.origem === OrigemVistoria.SOS_WEB) {
      await this.assertSosReadyToFinalize(vistoriaId);
    }
    vistoria.tempo = dto.tempo;
    if (dto.observacao !== undefined) {
      vistoria.observacao = dto.observacao;
    }
    vistoria.status = StatusVistoria.FINALIZADA;
    return this.vistoriaRepository.save(vistoria);
  }

  async cancel(vistoriaId: string): Promise<Vistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    if (vistoria.origem === OrigemVistoria.SOS_WEB) {
      return this.cancelSos(vistoriaId);
    }
    vistoria.status = StatusVistoria.CANCELADA;
    return this.vistoriaRepository.save(vistoria);
  }

  async cancelSos(vistoriaId: string): Promise<Vistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.origem !== OrigemVistoria.SOS_WEB) {
      throw new BadRequestException(
        'Cancelamento em cascata aplica-se apenas a vistorias SOS.',
      );
    }
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }

    const snapshot = { ...vistoria };

    await this.vistoriaRepository.manager.transaction(async (manager) => {
      const irregularidades = await manager
        .getRepository(Irregularidade)
        .find({ where: { idVistoria: vistoriaId }, select: ['id'] });
      const ids = irregularidades.map((i) => i.id);
      if (ids.length > 0) {
        await manager.getRepository(IrregularidadeHistorico).delete({
          idIrregularidade: In(ids),
        });
        await manager.getRepository(IrregularidadeMidia).delete({
          idIrregularidade: In(ids),
        });
        await manager.getRepository(Irregularidade).delete({
          idVistoria: vistoriaId,
        });
      }
      await manager.getRepository(Vistoria).delete(vistoriaId);
    });

    return snapshot;
  }

  private async assertSosReadyToFinalize(vistoriaId: string): Promise<void> {
    const irregularidades = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoriaId },
    });
    if (irregularidades.length === 0) {
      throw new BadRequestException(
        'Conclua o SOS com ao menos uma irregularidade registrada.',
      );
    }

    for (const irregularidade of irregularidades) {
      const matriz = await this.matrizRepository.findOne({
        where: {
          idComponente: irregularidade.idComponente,
          idSintoma: irregularidade.idSintoma,
        },
      });
      if (!matriz?.exigeFoto) {
        continue;
      }
      const fotoCount = await this.vistoriaRepository.manager
        .getRepository(IrregularidadeMidia)
        .count({
          where: {
            idIrregularidade: irregularidade.id,
            tipo: 'imagem',
          },
        });
      if (fotoCount === 0) {
        throw new BadRequestException(
          `A irregularidade O.S. #${irregularidade.numeroIrregularidade} exige foto antes de concluir o SOS.`,
        );
      }
    }
  }

  async retomar(vistoriaId: string): Promise<Vistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    vistoria.status = StatusVistoria.EM_ANDAMENTO;
    return this.vistoriaRepository.save(vistoria);
  }

  async findAll(
    status?: StatusVistoria,
    idUsuario?: string,
    ignorarVistoriaId?: string,
  ): Promise<Vistoria[]> {
    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (idUsuario) {
      where.idUsuario = idUsuario;
    }
    if (!ignorarVistoriaId) {
      return this.vistoriaRepository.find({
        where,
        order: { datavistoria: 'DESC' },
      });
    }
    return this.vistoriaRepository
      .createQueryBuilder('vistoria')
      .where(where)
      .andWhere('vistoria.id != :ignorarVistoriaId', { ignorarVistoriaId })
      .orderBy('vistoria.datavistoria', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Vistoria> {
    const vistoria = await this.vistoriaRepository.findOne({ where: { id } });
    if (!vistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }
    return vistoria;
  }

  async getBootstrap(vistoriaId: string): Promise<Record<string, unknown>> {
    const vistoria = await this.findOne(vistoriaId);

    const modeloId = vistoria.veiculo?.idModelo ?? null;
    const areas = await this.listAreasAtivasPorModelo(modeloId);
    const areaIds = areas.map((a) => a.id);

    const areaComponentes =
      areaIds.length > 0
        ? await this.areaComponenteRepository.find({
            where: { idArea: In(areaIds) },
            relations: ['componente'],
            order: { ordemVisual: 'ASC' },
          })
        : [];

    const componenteIds = [
      ...new Set(areaComponentes.map((ac) => ac.idComponente)),
    ];
    const matriz =
      componenteIds.length > 0
        ? await this.matrizRepository.find({
            where: { idComponente: In(componenteIds) },
            relations: ['sintoma'],
            order: { criadoEm: 'DESC' },
          })
        : [];

    const irregularidadesVistoria = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoriaId },
      relations: ['area', 'componente', 'sintoma'],
      order: { atualizadoEm: 'DESC' },
    });

    const pendentesVeiculo = await this.irregularidadeRepository
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.vistoria', 'v')
      .leftJoinAndSelect('i.area', 'area')
      .leftJoinAndSelect('i.componente', 'componente')
      .leftJoinAndSelect('i.sintoma', 'sintoma')
      .where('v.idVeiculo = :idVeiculo', { idVeiculo: vistoria.idVeiculo })
      .andWhere('v.status = :statusVistoriaFinalizada', {
        statusVistoriaFinalizada: StatusVistoria.FINALIZADA,
      })
      .andWhere('i.statusAtual NOT IN (:...statusFinal)', {
        statusFinal: [
          StatusIrregularidade.CANCELADA,
          StatusIrregularidade.VALIDADA,
        ],
      })
      .orderBy('i.atualizadoEm', 'DESC')
      .getMany();

    const matrizByComponente = new Map<string, MatrizCriticidade[]>();
    matriz.forEach((m) => {
      const list = matrizByComponente.get(m.idComponente) ?? [];
      list.push(m);
      matrizByComponente.set(m.idComponente, list);
    });

    const componentesByArea = new Map<string, AreaComponente[]>();
    areaComponentes.forEach((ac) => {
      const list = componentesByArea.get(ac.idArea) ?? [];
      list.push(ac);
      componentesByArea.set(ac.idArea, list);
    });

    return {
      generatedAt: new Date().toISOString(),
      vistoria: {
        id: vistoria.id,
        numeroVistoria: vistoria.numeroVistoria,
        datavistoria: vistoria.datavistoria?.toISOString(),
        odometro: Number(vistoria.odometro),
        porcentagembateria:
          vistoria.porcentagembateria === null ||
          vistoria.porcentagembateria === undefined
            ? null
            : Number(vistoria.porcentagembateria),
        status: vistoria.status,
        idVeiculo: vistoria.idVeiculo,
        idMotorista: vistoria.idMotorista,
        idUsuario: vistoria.idUsuario,
        veiculo: vistoria.veiculo,
        motorista: vistoria.motorista,
      },
      areas: areas.map((area) => ({
        id: area.id,
        nome: area.nome,
        ordemVisual: area.ordemVisual,
        ativo: area.ativo,
        componentes: (componentesByArea.get(area.id) ?? []).map((ac) => ({
          id: ac.id,
          idArea: ac.idArea,
          idComponente: ac.idComponente,
          ordemVisual: ac.ordemVisual,
          componente: ac.componente,
          matriz: matrizByComponente.get(ac.idComponente) ?? [],
        })),
      })),
      irregularidadesVistoria: irregularidadesVistoria.map((item) =>
        this.mapIrregularidadeResumo(item),
      ),
      pendentesVeiculo: pendentesVeiculo.map((item) =>
        this.mapIrregularidadeResumo(item),
      ),
    };
  }

  private mapIrregularidadeResumo(
    item: Irregularidade,
  ): Record<string, unknown> {
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
      atualizadoEm: item.atualizadoEm.toISOString(),
    };
  }

  private async listAreasAtivasPorModelo(
    idmodelo?: string | null,
  ): Promise<AreaVistoriada[]> {
    const modeloFiltro = idmodelo?.trim();
    if (!modeloFiltro) {
      return this.areaRepository.find({
        where: { ativo: true },
        order: { ordemVisual: 'ASC' },
      });
    }

    return this.areaRepository
      .createQueryBuilder('area')
      .where('area.ativo = :ativo', { ativo: true })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'EXISTS (SELECT 1 FROM areas_modelos am WHERE am.idarea = area.id AND am.idmodelo = :idModelo)',
          ).orWhere(
            'NOT EXISTS (SELECT 1 FROM areas_modelos am2 WHERE am2.idarea = area.id)',
          );
        }),
      )
      .setParameter('idModelo', modeloFiltro)
      .orderBy('area.ordemVisual', 'ASC')
      .getMany();
  }
}
