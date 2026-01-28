import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoVistoria } from './entities/tipo-vistoria.entity';
import { CreateTipoVistoriaDto } from './dto/create-tipo-vistoria.dto';
import { UpdateTipoVistoriaDto } from './dto/update-tipo-vistoria.dto';
import { ItemVistoriado } from './entities/item-vistoriado.entity';

@Injectable()
export class TipoVistoriaService {
  constructor(
    @InjectRepository(TipoVistoria)
    private readonly tipoVistoriaRepository: Repository<TipoVistoria>,
    @InjectRepository(ItemVistoriado)
    private readonly itemVistoriadoRepository: Repository<ItemVistoriado>,
  ) {}

  async create(dto: CreateTipoVistoriaDto): Promise<TipoVistoria> {
    const tipo = this.tipoVistoriaRepository.create({
      descricao: dto.descricao,
      ativo: dto.ativo ?? true,
    });
    return this.tipoVistoriaRepository.save(tipo);
  }

  async findAll(): Promise<TipoVistoria[]> {
    return this.tipoVistoriaRepository.find({
      order: { descricao: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TipoVistoria> {
    const tipo = await this.tipoVistoriaRepository.findOne({ where: { id } });
    if (!tipo) {
      throw new NotFoundException('Tipo de vistoria não encontrado');
    }
    return tipo;
  }

  async update(id: string, dto: UpdateTipoVistoriaDto): Promise<TipoVistoria> {
    const tipo = await this.findOne(id);
    const updated = this.tipoVistoriaRepository.merge(tipo, dto);
    return this.tipoVistoriaRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const tipo = await this.findOne(id);
    const itensRelacionados = await this.itemVistoriadoRepository
      .createQueryBuilder('item')
      .where(':id = ANY(item.tiposvistorias)', { id })
      .getCount();

    if (itensRelacionados > 0) {
      throw new BadRequestException(
        'Não é possível excluir o tipo de vistoria porque existem itens vistoriados vinculados.',
      );
    }
    await this.tipoVistoriaRepository.remove(tipo);
  }
}
