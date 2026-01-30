import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vistoria } from './entities/vistoria.entity';
import { ChecklistVistoria } from './entities/checklist-vistoria.entity';
import { ImagensVistoria } from './entities/imagens-vistoria.entity';
import { ItemVistoriado } from './entities/item-vistoriado.entity';
import { TipoVistoria } from './entities/tipo-vistoria.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { Motorista } from '../motorista/entities/motorista.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { FinalizeVistoriaDto } from './dto/finalize-vistoria.dto';
import { UpdateVistoriaDto } from './dto/update-vistoria.dto';
import { ChecklistItemResumoDto } from './dto/checklist-item-resumo.dto';
import { ChecklistImagemResumoDto } from './dto/checklist-imagem-resumo.dto';
import { StatusVeiculo } from '../../common/enums/status-veiculo.enum';
import { StatusMotorista } from '../../common/enums/status-motorista.enum';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { Combustivel } from '../../common/enums/combustivel.enum';

@Injectable()
export class VistoriaService {
  constructor(
    @InjectRepository(Vistoria)
    private readonly vistoriaRepository: Repository<Vistoria>,
    @InjectRepository(ChecklistVistoria)
    private readonly checklistRepository: Repository<ChecklistVistoria>,
    @InjectRepository(ImagensVistoria)
    private readonly imagensRepository: Repository<ImagensVistoria>,
    @InjectRepository(ItemVistoriado)
    private readonly itemRepository: Repository<ItemVistoriado>,
    @InjectRepository(TipoVistoria)
    private readonly tipoRepository: Repository<TipoVistoria>,
    @InjectRepository(Veiculo)
    private readonly veiculoRepository: Repository<Veiculo>,
    @InjectRepository(Motorista)
    private readonly motoristaRepository: Repository<Motorista>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
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
      if (dto.porcentagembateria === null || dto.porcentagembateria === undefined) {
        throw new BadRequestException('Percentual de bateria é obrigatório para veículo elétrico');
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

    const tipo = await this.tipoRepository.findOne({
      where: { id: dto.idtipovistoria },
    });
    if (!tipo) {
      throw new NotFoundException('Tipo de vistoria não encontrado');
    }
    if (!tipo.ativo) {
      throw new BadRequestException('Tipo de vistoria inativo');
    }

    const vistoria = this.vistoriaRepository.create({
      idUsuario: dto.idusuario,
      idVeiculo: dto.idveiculo,
      idMotorista: dto.idmotorista,
      idTipoVistoria: dto.idtipovistoria,
      odometro: dto.odometro,
      porcentagembateria:
        dto.porcentagembateria === undefined ? null : dto.porcentagembateria,
      datavistoria: new Date(dto.datavistoria),
      tempo: 0,
      status: StatusVistoria.EM_ANDAMENTO,
    });

    return this.vistoriaRepository.save(vistoria);
  }

  async update(id: string, dto: UpdateVistoriaDto): Promise<Vistoria> {
    const vistoria = await this.findOne(id);
    if (vistoria.status !== StatusVistoria.EM_ANDAMENTO) {
      throw new BadRequestException('Somente vistorias em andamento podem ser atualizadas');
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

    if (dto.idtipovistoria) {
      const tipo = await this.tipoRepository.findOne({
        where: { id: dto.idtipovistoria },
      });
      if (!tipo) {
        throw new NotFoundException('Tipo de vistoria não encontrado');
      }
      if (!tipo.ativo) {
        throw new BadRequestException('Tipo de vistoria inativo');
      }
    }

    const bateriaAtual =
      dto.porcentagembateria !== undefined
        ? dto.porcentagembateria
        : vistoria.porcentagembateria;
    if (veiculo.combustivel === Combustivel.ELETRICO) {
      if (bateriaAtual === null || bateriaAtual === undefined) {
        throw new BadRequestException('Percentual de bateria é obrigatório para veículo elétrico');
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
      idTipoVistoria: dto.idtipovistoria ?? vistoria.idTipoVistoria,
      odometro: dto.odometro ?? vistoria.odometro,
      porcentagembateria: bateriaFinal,
      datavistoria: dto.datavistoria ? new Date(dto.datavistoria) : vistoria.datavistoria,
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
      .andWhere('vistoria.status != :statusCancelada', {
        statusCancelada: StatusVistoria.CANCELADA,
      })
      .orderBy('vistoria.datavistoria', 'DESC');

    if (ignorarVistoriaId) {
      query.andWhere('vistoria.id != :ignorarVistoriaId', { ignorarVistoriaId });
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

  async addChecklistItem(
    vistoriaId: string,
    dto: CreateChecklistItemDto,
  ): Promise<ChecklistVistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    if (vistoria.status === StatusVistoria.CANCELADA) {
      throw new BadRequestException('Vistoria cancelada');
    }

    const item = await this.itemRepository.findOne({
      where: { id: dto.iditemvistoriado },
    });
    if (!item) {
      throw new NotFoundException('Item vistoriado não encontrado');
    }
    if (!item.ativo) {
      throw new BadRequestException('Item vistoriado inativo');
    }
    if (!item.tiposVistorias?.includes(vistoria.idTipoVistoria)) {
      throw new BadRequestException(
        'Item vistoriado não pertence ao tipo de vistoria informado',
      );
    }

    if (!dto.conforme && item.obrigafoto) {
      // Validação de foto fica para o upload multipart
    }

    return this.checklistRepository.manager.transaction(async (manager) => {
      const checklistRepo = manager.getRepository(ChecklistVistoria);
      const imagensRepo = manager.getRepository(ImagensVistoria);

      const existing = await checklistRepo.findOne({
        where: {
          idVistoria: vistoria.id,
          idItemVistoriado: dto.iditemvistoriado,
        },
      });

      const checklist = existing
        ? checklistRepo.merge(existing, {
            conforme: dto.conforme,
            observacao: dto.observacao,
          })
        : checklistRepo.create({
            idVistoria: vistoria.id,
            idItemVistoriado: dto.iditemvistoriado,
            conforme: dto.conforme,
            observacao: dto.observacao,
          });

      const savedChecklist = await checklistRepo.save(checklist);

      if (existing) {
        await imagensRepo.delete({ idChecklistVistoria: savedChecklist.id });
      }

      return savedChecklist;
    });
  }

  async listChecklist(vistoriaId: string): Promise<ChecklistItemResumoDto[]> {
    await this.findOne(vistoriaId);
    const items = await this.checklistRepository.find({
      where: { idVistoria: vistoriaId },
      order: { atualizadoEm: 'DESC' },
      relations: ['itemVistoriado'],
    });
    return items.map((item) => ({
      iditemvistoriado: item.idItemVistoriado,
      descricaoItem: item.itemVistoriado?.descricao,
      sequencia: item.itemVistoriado?.sequencia,
      conforme: item.conforme,
      observacao: item.observacao ?? undefined,
      atualizadoEm: item.atualizadoEm.toISOString(),
    }));
  }

  async listChecklistImages(
    vistoriaId: string,
  ): Promise<ChecklistImagemResumoDto[]> {
    await this.findOne(vistoriaId);
    const checklists = await this.checklistRepository.find({
      where: { idVistoria: vistoriaId },
      relations: ['imagens'],
    });
    return checklists.map((checklist) => ({
      iditemvistoriado: checklist.idItemVistoriado,
      imagens: (checklist.imagens ?? []).map((imagem) => ({
        nomeArquivo: imagem.nomeArquivo,
        tamanho: Number(imagem.tamanho),
        dadosBase64: imagem.dadosBytea.toString('base64'),
      })),
    }));
  }

  async uploadChecklistImages(
    vistoriaId: string,
    checklistId: string,
    files: Express.Multer.File[],
  ): Promise<ImagensVistoria[]> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    if (vistoria.status === StatusVistoria.CANCELADA) {
      throw new BadRequestException('Vistoria cancelada');
    }

    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId, idVistoria: vistoriaId },
    });
    if (!checklist) {
      throw new NotFoundException('Checklist não encontrado');
    }

    const item = await this.itemRepository.findOne({
      where: { id: checklist.idItemVistoriado },
    });
    if (checklist.conforme && item?.permitirfotoconforme === false) {
      throw new BadRequestException(
        'Fotos não permitidas para item conforme',
      );
    }
    if (!checklist.conforme && item?.obrigafoto && (!files || files.length === 0)) {
      throw new BadRequestException(
        'Foto obrigatória para item não conforme',
      );
    }

    return this.checklistRepository.manager.transaction(async (manager) => {
      await manager
        .getRepository(ImagensVistoria)
        .delete({ idChecklistVistoria: checklistId });

      const imagens = (files ?? []).map((file) =>
        manager.getRepository(ImagensVistoria).create({
          idChecklistVistoria: checklistId,
          nomeArquivo: file.originalname,
          tamanho: file.size,
          dadosBytea: file.buffer,
        }),
      );

      if (imagens.length === 0) {
        return [];
      }

      return manager.getRepository(ImagensVistoria).save(imagens);
    });
  }

  async finalize(
    vistoriaId: string,
    dto: FinalizeVistoriaDto,
  ): Promise<Vistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.CANCELADA) {
      throw new BadRequestException('Vistoria cancelada');
    }
    vistoria.tempo = dto.tempo;
    vistoria.observacao = dto.observacao;
    vistoria.status = StatusVistoria.FINALIZADA;
    return this.vistoriaRepository.save(vistoria);
  }

  async cancel(vistoriaId: string): Promise<Vistoria> {
    const vistoria = await this.findOne(vistoriaId);
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    vistoria.status = StatusVistoria.CANCELADA;
    return this.vistoriaRepository.save(vistoria);
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

  private normalizeBase64(data: string): string {
    const parts = data.split(',');
    return parts.length > 1 ? parts[1] : data;
  }
}
