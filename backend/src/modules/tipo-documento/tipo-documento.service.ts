import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TipoDocumento } from './entities/tipo-documento.entity';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';
import { Documento } from '../documento/entities/documento.entity';

@Injectable()
export class TipoDocumentoService {
  constructor(
    @InjectRepository(TipoDocumento)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
  ) {}

  async create(dto: CreateTipoDocumentoDto): Promise<TipoDocumento> {
    const nomeNorm = dto.nome.trim();
    const existente = await this.tipoDocumentoRepository.findOne({
      where: { nome: nomeNorm },
    });
    if (existente) {
      throw new ConflictException(
        `Já existe um tipo de documento com o nome "${nomeNorm}"`,
      );
    }
    const entity = this.tipoDocumentoRepository.create({
      nome: nomeNorm,
      descricao: dto.descricao?.trim() || null,
      ativo: dto.ativo ?? true,
    });
    return this.tipoDocumentoRepository.save(entity);
  }

  findAll(nome?: string, apenasAtivos?: boolean): Promise<TipoDocumento[]> {
    const where: Record<string, unknown> = {};
    if (nome?.trim()) {
      where.nome = ILike(`%${nome.trim()}%`);
    }
    if (apenasAtivos) {
      where.ativo = true;
    }
    return this.tipoDocumentoRepository.find({
      where,
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TipoDocumento> {
    const entity = await this.tipoDocumentoRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Tipo de documento não encontrado');
    }
    return entity;
  }

  async update(id: string, dto: UpdateTipoDocumentoDto): Promise<TipoDocumento> {
    const entity = await this.findOne(id);
    if (dto.nome !== undefined) {
      const nomeNorm = dto.nome.trim();
      const existente = await this.tipoDocumentoRepository.findOne({
        where: { nome: nomeNorm },
      });
      if (existente && existente.id !== id) {
        throw new ConflictException(
          `Já existe outro tipo com o nome "${nomeNorm}"`,
        );
      }
      entity.nome = nomeNorm;
    }
    if (dto.descricao !== undefined) {
      entity.descricao = dto.descricao?.trim() || null;
    }
    if (dto.ativo !== undefined) {
      entity.ativo = dto.ativo;
    }
    return this.tipoDocumentoRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    const vinculados = await this.documentoRepository.count({
      where: { tipoDocumentoId: id },
    });
    if (vinculados > 0) {
      throw new ConflictException(
        'Não é possível excluir tipo de documento vinculado a documentos cadastrados',
      );
    }
    await this.tipoDocumentoRepository.remove(entity);
  }
}
