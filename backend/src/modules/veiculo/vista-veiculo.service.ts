import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { VistaVeiculo } from './entities/vista-veiculo.entity';
import { ModeloVeiculoVista } from './entities/modelo-veiculo-vista.entity';
import { MatrizCriticidade } from '../vistoria/entities/matriz-criticidade.entity';
import { CreateVistaVeiculoDto } from './dto/create-vista-veiculo.dto';
import { UpdateVistaVeiculoDto } from './dto/update-vista-veiculo.dto';

@Injectable()
export class VistaVeiculoService {
  constructor(
    @InjectRepository(VistaVeiculo)
    private readonly catalogoRepository: Repository<VistaVeiculo>,
    @InjectRepository(ModeloVeiculoVista)
    private readonly modeloVistaRepository: Repository<ModeloVeiculoVista>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizRepository: Repository<MatrizCriticidade>,
  ) {}

  async create(dto: CreateVistaVeiculoDto): Promise<VistaVeiculo> {
    const descricao = dto.descricao.trim();
    await this.assertDescricaoUnica(descricao);
    const vista = this.catalogoRepository.create({
      descricao,
      ativo: dto.ativo ?? true,
      ordem: dto.ordem ?? 0,
    });
    return this.catalogoRepository.save(vista);
  }

  async findAll(ativo?: boolean): Promise<VistaVeiculo[]> {
    const where: FindOptionsWhere<VistaVeiculo> = {};
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    return this.catalogoRepository.find({
      where,
      order: { ordem: 'ASC', descricao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<VistaVeiculo> {
    const vista = await this.catalogoRepository.findOne({ where: { id } });
    if (!vista) {
      throw new NotFoundException('Vista do veículo não encontrada');
    }
    return vista;
  }

  async update(id: string, dto: UpdateVistaVeiculoDto): Promise<VistaVeiculo> {
    const vista = await this.findOne(id);
    const descricao =
      dto.descricao !== undefined ? dto.descricao.trim() : vista.descricao;
    if (!descricao) {
      throw new BadRequestException('A descrição da vista é obrigatória.');
    }
    await this.assertDescricaoUnica(descricao, id);
    const updated = this.catalogoRepository.merge(vista, {
      descricao,
      ativo: dto.ativo ?? vista.ativo,
      ordem: dto.ordem ?? vista.ordem,
    });
    const saved = await this.catalogoRepository.save(updated);
    if (descricao !== vista.descricao) {
      await this.modeloVistaRepository.update(
        { idCatalogo: id },
        { descricao },
      );
    }
    return saved;
  }

  async remove(id: string): Promise<void> {
    const vista = await this.findOne(id);
    const emModelos = await this.modeloVistaRepository.count({
      where: { idCatalogo: id },
    });
    if (emModelos > 0) {
      throw new ConflictException(
        'Não é possível excluir. Há desenhos de modelo usando esta vista. Inative o cadastro.',
      );
    }
    const emMatriz = await this.matrizRepository
      .createQueryBuilder('m')
      .where(':id = ANY("m"."id_vistas")', { id })
      .getCount();
    if (emMatriz > 0) {
      throw new ConflictException(
        'Não é possível excluir. Há matrizes de criticidade usando esta vista. Inative o cadastro.',
      );
    }
    await this.catalogoRepository.remove(vista);
  }

  private async assertDescricaoUnica(
    descricao: string,
    ignoreId?: string,
  ): Promise<void> {
    const qb = this.catalogoRepository
      .createQueryBuilder('v')
      .where('LOWER(TRIM(v.descricao)) = LOWER(TRIM(:descricao))', {
        descricao,
      });
    if (ignoreId) {
      qb.andWhere('v.id != :ignoreId', { ignoreId });
    }
    const existente = await qb.getOne();
    if (existente) {
      throw new ConflictException('Já existe uma vista com esta descrição.');
    }
  }
}
