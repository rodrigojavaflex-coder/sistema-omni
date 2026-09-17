import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { Componente } from './entities/componente.entity';
import { Sintoma } from './entities/sintoma.entity';
import { VistaVeiculo } from '../veiculo/entities/vista-veiculo.entity';
import { CreateMatrizCriticidadeDto } from './dto/create-matriz-criticidade.dto';
import { UpdateMatrizCriticidadeDto } from './dto/update-matriz-criticidade.dto';

@Injectable()
export class MatrizCriticidadeService {
  constructor(
    @InjectRepository(MatrizCriticidade)
    private readonly matrizRepository: Repository<MatrizCriticidade>,
    @InjectRepository(Componente)
    private readonly componenteRepository: Repository<Componente>,
    @InjectRepository(Sintoma)
    private readonly sintomaRepository: Repository<Sintoma>,
    @InjectRepository(VistaVeiculo)
    private readonly catalogoRepository: Repository<VistaVeiculo>,
  ) {}

  async create(dto: CreateMatrizCriticidadeDto): Promise<MatrizCriticidade> {
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    const idVistas = await this.resolveIdVistas(dto.idsintoma, dto.id_vistas);
    const matriz = this.matrizRepository.create({
      idComponente: dto.idcomponente,
      idSintoma: dto.idsintoma,
      gravidade: dto.gravidade,
      exigeFoto: dto.exige_foto ?? false,
      permiteAudio: dto.permite_audio ?? false,
      idVistas,
    });
    return this.matrizRepository.save(matriz);
  }

  async findAll(idcomponente?: string): Promise<MatrizCriticidade[]> {
    const where: Record<string, unknown> = {};
    if (idcomponente) {
      where.idComponente = idcomponente;
    }
    return this.matrizRepository.find({
      where,
      relations: ['sintoma', 'componente'],
      order: { criadoEm: 'DESC' },
    });
  }

  async findByComponenteSintoma(
    idComponente: string,
    idSintoma: string,
  ): Promise<MatrizCriticidade | null> {
    return this.matrizRepository.findOne({
      where: { idComponente, idSintoma },
      relations: ['sintoma', 'componente'],
    });
  }

  async findOne(id: string): Promise<MatrizCriticidade> {
    const matriz = await this.matrizRepository.findOne({ where: { id } });
    if (!matriz) {
      throw new NotFoundException('Matriz de criticidade não encontrada');
    }
    return matriz;
  }

  async update(
    id: string,
    dto: UpdateMatrizCriticidadeDto,
  ): Promise<MatrizCriticidade> {
    const matriz = await this.findOne(id);

    if (dto.idcomponente) {
      await this.ensureComponente(dto.idcomponente);
    }
    if (dto.idsintoma) {
      await this.ensureSintoma(dto.idsintoma);
    }

    const idSintoma = dto.idsintoma ?? matriz.idSintoma;
    const idVistas = await this.resolveIdVistas(
      idSintoma,
      dto.id_vistas ?? matriz.idVistas,
    );

    const updated = this.matrizRepository.merge(matriz, {
      idComponente: dto.idcomponente ?? matriz.idComponente,
      idSintoma,
      gravidade: dto.gravidade ?? matriz.gravidade,
      exigeFoto: dto.exige_foto ?? matriz.exigeFoto,
      permiteAudio: dto.permite_audio ?? matriz.permiteAudio,
      idVistas,
    });
    return this.matrizRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const matriz = await this.findOne(id);
    await this.matrizRepository.remove(matriz);
  }

  private async resolveIdVistas(
    idSintoma: string,
    raw?: string[],
  ): Promise<string[]> {
    const sintoma = await this.sintomaRepository.findOne({
      where: { id: idSintoma },
    });
    if (!sintoma?.exigeMarcacaoMapa) {
      return [];
    }
    const ids = [...new Set((raw ?? []).map((item) => item.trim()).filter(Boolean))];
    if (ids.length === 0) {
      return [];
    }
    const encontradas = await this.catalogoRepository.find({
      where: { id: In(ids) },
    });
    if (encontradas.length !== ids.length) {
      throw new BadRequestException(
        'Uma ou mais vistas selecionadas não existem no catálogo.',
      );
    }
    return ids;
  }

  private async ensureComponente(id: string): Promise<void> {
    const componente = await this.componenteRepository.findOne({
      where: { id },
    });
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
}
