import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sintoma } from './entities/sintoma.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { ModeloVeiculo } from '../veiculo/entities/modelo-veiculo.entity';
import { CreateSintomaDto } from './dto/create-sintoma.dto';
import { UpdateSintomaDto } from './dto/update-sintoma.dto';
import {
  SintomaModeloResumoDto,
  SintomaVistaResumoDto,
} from './dto/sintoma-modelo.dto';

@Injectable()
export class SintomaService {
  constructor(
    @InjectRepository(Sintoma)
    private readonly sintomaRepository: Repository<Sintoma>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizCriticidadeRepository: Repository<MatrizCriticidade>,
    @InjectRepository(ModeloVeiculo)
    private readonly modeloRepository: Repository<ModeloVeiculo>,
  ) {}

  async create(dto: CreateSintomaDto): Promise<Sintoma> {
    const sintoma = this.sintomaRepository.create({
      descricao: dto.descricao,
      ativo: dto.ativo ?? true,
      exigeMarcacaoMapa: dto.exigeMarcacaoMapa ?? false,
    });
    const saved = await this.sintomaRepository.save(sintoma);
    return this.toResponse(saved, await this.loadModelos());
  }

  async findAll(ativo?: boolean): Promise<Sintoma[]> {
    const where: Record<string, unknown> = {};
    if (ativo !== undefined) {
      where.ativo = ativo;
    }
    const [rows, modelos] = await Promise.all([
      this.sintomaRepository.find({ where, order: { descricao: 'ASC' } }),
      this.loadModelos(),
    ]);
    return rows.map((row) => this.toResponse(row, modelos));
  }

  async findOne(id: string): Promise<Sintoma> {
    return this.toResponse(await this.getEntity(id), await this.loadModelos());
  }

  async listModelos(): Promise<SintomaModeloResumoDto[]> {
    return this.loadModelos();
  }

  async update(id: string, dto: UpdateSintomaDto): Promise<Sintoma> {
    const sintoma = await this.getEntity(id);
    const updated = this.sintomaRepository.merge(sintoma, {
      descricao: dto.descricao ?? sintoma.descricao,
      ativo: dto.ativo ?? sintoma.ativo,
      exigeMarcacaoMapa: dto.exigeMarcacaoMapa ?? sintoma.exigeMarcacaoMapa,
    });
    const saved = await this.sintomaRepository.save(updated);
    return this.toResponse(saved, await this.loadModelos());
  }

  async remove(id: string): Promise<void> {
    const sintoma = await this.getEntity(id);
    const countMatriz = await this.matrizCriticidadeRepository.count({
      where: { idSintoma: id },
    });
    if (countMatriz > 0) {
      throw new BadRequestException(
        'Não é possível excluir o sintoma pois existem registros na matriz de criticidade. Remova ou altere as matrizes antes de excluir.',
      );
    }
    await this.sintomaRepository.remove(sintoma);
  }

  private async getEntity(id: string): Promise<Sintoma> {
    const sintoma = await this.sintomaRepository.findOne({ where: { id } });
    if (!sintoma) {
      throw new NotFoundException('Sintoma não encontrado');
    }
    return sintoma;
  }

  private async loadModelos(): Promise<SintomaModeloResumoDto[]> {
    const modelos = await this.modeloRepository.find({
      relations: ['vistas'],
      order: { nome: 'ASC' },
    });
    return modelos.map((modelo) => {
      const vistas: SintomaVistaResumoDto[] = [...(modelo.vistas ?? [])]
        .sort((a, b) => a.ordem - b.ordem || a.descricao.localeCompare(b.descricao))
        .map((vista) => ({
          id: vista.id,
          idCatalogo: vista.idCatalogo,
          descricao: vista.descricao,
          ativo: vista.ativo,
        }));
      return {
        id: modelo.id,
        nome: modelo.nome,
        ativo: modelo.ativo,
        total: vistas.length,
        vistas,
      };
    });
  }

  private toResponse(
    sintoma: Sintoma,
    modelos: SintomaModeloResumoDto[],
  ): Sintoma {
    return Object.assign(sintoma, { modelos });
  }
}
