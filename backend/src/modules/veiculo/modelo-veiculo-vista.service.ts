import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ModeloVeiculoVista } from './entities/modelo-veiculo-vista.entity';
import { ModeloVeiculo } from './entities/modelo-veiculo.entity';
import { VistaVeiculo } from './entities/vista-veiculo.entity';
import { Irregularidade } from '../vistoria/entities/irregularidade.entity';
import { ModeloVeiculoVistaResumoDto } from './dto/modelo-veiculo-vista.dto';

const JPEG_MIME = 'image/jpeg';
const MAX_BYTES = 2 * 1024 * 1024;

@Injectable()
export class ModeloVeiculoVistaService {
  constructor(
    @InjectRepository(ModeloVeiculoVista)
    private readonly vistaRepository: Repository<ModeloVeiculoVista>,
    @InjectRepository(ModeloVeiculo)
    private readonly modeloRepository: Repository<ModeloVeiculo>,
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(VistaVeiculo)
    private readonly catalogoRepository: Repository<VistaVeiculo>,
  ) {}

  async listByModelo(
    idModelo: string,
    ativo?: boolean,
  ): Promise<ModeloVeiculoVistaResumoDto[]> {
    await this.ensureModelo(idModelo);
    const where: FindOptionsWhere<ModeloVeiculoVista> = { idModelo };
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    const rows = await this.vistaRepository.find({
      where,
      order: { ordem: 'ASC', descricao: 'ASC' },
    });
    return rows.map((row) => this.toResumo(row));
  }

  async countAtivas(idModelo: string): Promise<number> {
    return this.vistaRepository.count({ where: { idModelo, ativo: true } });
  }

  async listAtivasComImagem(idModelo: string): Promise<
    Array<{
      id: string;
      descricao: string;
      buffer: Buffer;
    }>
  > {
    const rows = await this.vistaRepository
      .createQueryBuilder('v')
      .innerJoin('v.catalogo', 'catalogo')
      .addSelect('v.dadosBytea')
      .where('v.idModelo = :idModelo', { idModelo })
      .andWhere('v.ativo = true')
      .orderBy('catalogo.ordem', 'ASC')
      .addOrderBy('v.ordem', 'ASC')
      .addOrderBy('v.descricao', 'ASC')
      .getMany();
    return rows
      .filter((row): row is ModeloVeiculoVista & { dadosBytea: Buffer } =>
        Boolean(row.dadosBytea?.length),
      )
      .map((row) => ({
        id: row.id,
        descricao: row.descricao,
        buffer: row.dadosBytea,
      }));
  }

  async getImagem(
    idModelo: string,
    vistaId: string,
  ): Promise<{ buffer: Buffer; mimeType: string; nomeArquivo: string }> {
    const vista = await this.vistaRepository
      .createQueryBuilder('v')
      .addSelect('v.dadosBytea')
      .where('v.id = :vistaId', { vistaId })
      .andWhere('v.idModelo = :idModelo', { idModelo })
      .getOne();
    if (!vista?.dadosBytea) {
      throw new NotFoundException('Vista do modelo não encontrada');
    }
    return {
      buffer: vista.dadosBytea,
      mimeType: vista.mimeType,
      nomeArquivo: vista.nomeArquivo,
    };
  }

  async create(
    idModelo: string,
    idCatalogo: string,
    ordem: number | undefined,
    file: Express.Multer.File,
  ): Promise<ModeloVeiculoVistaResumoDto> {
    await this.ensureModelo(idModelo);
    if (!idCatalogo?.trim()) {
      throw new BadRequestException('Selecione a vista do catálogo.');
    }
    const catalogo = await this.ensureCatalogoAtivo(idCatalogo);
    const duplicada = await this.vistaRepository.findOne({
      where: { idModelo, idCatalogo: catalogo.id },
    });
    if (duplicada) {
      throw new ConflictException(
        'Este modelo já possui essa vista do catálogo.',
      );
    }
    this.assertJpeg(file);
    const vista = this.vistaRepository.create({
      idModelo,
      idCatalogo: catalogo.id,
      descricao: catalogo.descricao,
      ordem: ordem ?? 0,
      mimeType: JPEG_MIME,
      nomeArquivo: file.originalname || 'vista.jpg',
      tamanho: file.size,
      dadosBytea: file.buffer,
      ativo: true,
    });
    const saved = await this.vistaRepository.save(vista);
    return this.toResumo(saved);
  }

  async update(
    idModelo: string,
    vistaId: string,
    patch: {
      ordem?: number;
      ativo?: boolean;
      file?: Express.Multer.File;
    },
  ): Promise<ModeloVeiculoVistaResumoDto> {
    const vista = await this.vistaRepository.findOne({
      where: { id: vistaId, idModelo },
    });
    if (!vista) {
      throw new NotFoundException('Vista do modelo não encontrada');
    }
    if (patch.ordem !== undefined) {
      vista.ordem = patch.ordem;
    }
    if (patch.ativo !== undefined) {
      vista.ativo = patch.ativo;
    }
    if (patch.file) {
      this.assertJpeg(patch.file);
      vista.mimeType = JPEG_MIME;
      vista.nomeArquivo = patch.file.originalname || vista.nomeArquivo;
      vista.tamanho = patch.file.size;
      vista.dadosBytea = patch.file.buffer;
    }
    const saved = await this.vistaRepository.save(vista);
    return this.toResumo(saved);
  }

  async remove(idModelo: string, vistaId: string): Promise<void> {
    const vista = await this.vistaRepository.findOne({
      where: { id: vistaId, idModelo },
    });
    if (!vista) {
      throw new NotFoundException('Vista do modelo não encontrada');
    }
    const emUso = await this.irregularidadeRepository.count({
      where: { idVista: vistaId },
    });
    if (emUso > 0) {
      throw new ConflictException(
        'Não é possível excluir. Inative a vista. Há irregularidades marcadas neste desenho.',
      );
    }
    await this.vistaRepository.remove(vista);
  }

  async assertVistaDoModelo(
    idModelo: string,
    vistaId: string,
    exigirAtiva = true,
  ): Promise<ModeloVeiculoVista> {
    const vista = await this.vistaRepository.findOne({
      where: { id: vistaId, idModelo },
    });
    if (!vista) {
      throw new BadRequestException(
        'A vista selecionada não pertence ao modelo do veículo.',
      );
    }
    if (exigirAtiva && !vista.ativo) {
      throw new BadRequestException(
        'A vista selecionada está inativa. Escolha outro desenho do modelo.',
      );
    }
    return vista;
  }

  private async ensureCatalogoAtivo(idCatalogo: string): Promise<VistaVeiculo> {
    const catalogo = await this.catalogoRepository.findOne({
      where: { id: idCatalogo },
    });
    if (!catalogo) {
      throw new BadRequestException('A vista do catálogo não foi encontrada.');
    }
    if (!catalogo.ativo) {
      throw new BadRequestException(
        'A vista do catálogo está inativa. Escolha outra.',
      );
    }
    return catalogo;
  }

  private async ensureModelo(idModelo: string): Promise<void> {
    const modelo = await this.modeloRepository.findOne({
      where: { id: idModelo },
    });
    if (!modelo) {
      throw new NotFoundException('Modelo de veículo não encontrado');
    }
  }

  private assertJpeg(file?: Express.Multer.File): void {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Imagem JPEG da vista é obrigatória.');
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException(
        'A imagem da vista deve ter no máximo 2 MB após compactar.',
      );
    }
    const mime = (file.mimetype || '').toLowerCase();
    if (mime !== JPEG_MIME && mime !== 'image/jpg') {
      throw new BadRequestException('A vista deve ser um arquivo JPEG.');
    }
  }

  private toResumo(row: ModeloVeiculoVista): ModeloVeiculoVistaResumoDto {
    return {
      id: row.id,
      idCatalogo: row.idCatalogo,
      descricao: row.descricao,
      ordem: row.ordem,
      mimeType: row.mimeType,
      nomeArquivo: row.nomeArquivo,
      tamanho: Number(row.tamanho),
      ativo: row.ativo,
      atualizadoEm: row.atualizadoEm.toISOString(),
    };
  }
}
