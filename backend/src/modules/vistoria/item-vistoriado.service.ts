import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemVistoriado } from './entities/item-vistoriado.entity';
import { CreateItemVistoriadoDto } from './dto/create-item-vistoriado.dto';
import { UpdateItemVistoriadoDto } from './dto/update-item-vistoriado.dto';

@Injectable()
export class ItemVistoriadoService {
  constructor(
    @InjectRepository(ItemVistoriado)
    private readonly itemRepository: Repository<ItemVistoriado>,
  ) {}

  async create(dto: CreateItemVistoriadoDto): Promise<ItemVistoriado> {
    const item = this.itemRepository.create({
      descricao: dto.descricao,
      sequencia: dto.sequencia,
      tiposVistorias: dto.tiposvistorias,
      obrigafoto: dto.obrigafoto ?? false,
      ativo: dto.ativo ?? true,
    });
    return this.itemRepository.save(item);
  }

  async findAll(tipovistoriaId?: string, ativo?: boolean): Promise<ItemVistoriado[]> {
    let query = this.itemRepository
      .createQueryBuilder('item')
      .orderBy('item.sequencia', 'ASC');

    if (tipovistoriaId) {
      query = query.andWhere(':id = ANY(item.tiposvistorias)', {
        id: tipovistoriaId,
      });
    }

    if (ativo !== undefined) {
      query = query.andWhere('item.ativo = :ativo', { ativo });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<ItemVistoriado> {
    const item = await this.itemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item vistoriado não encontrado');
    }
    return item;
  }

  async update(id: string, dto: UpdateItemVistoriadoDto): Promise<ItemVistoriado> {
    const item = await this.findOne(id);
    const updated = this.itemRepository.merge(item, {
      descricao: dto.descricao ?? item.descricao,
      sequencia: dto.sequencia ?? item.sequencia,
      tiposVistorias: dto.tiposvistorias ?? item.tiposVistorias,
      obrigafoto: dto.obrigafoto ?? item.obrigafoto,
      ativo: dto.ativo ?? item.ativo,
    });
    return this.itemRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.itemRepository.remove(item);
  }
}
