import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vistoria } from './entities/vistoria.entity';
import { Veiculo } from '../veiculo/entities/veiculo.entity';
import { Motorista } from '../motorista/entities/motorista.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { FinalizeVistoriaDto } from './dto/finalize-vistoria.dto';
import { UpdateVistoriaDto } from './dto/update-vistoria.dto';
import { StatusVeiculo } from '../../common/enums/status-veiculo.enum';
import { StatusMotorista } from '../../common/enums/status-motorista.enum';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { Combustivel } from '../../common/enums/combustivel.enum';

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

    const vistoria = this.vistoriaRepository.create({
      idUsuario: dto.idusuario,
      idVeiculo: dto.idveiculo,
      idMotorista: dto.idmotorista,
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

}
