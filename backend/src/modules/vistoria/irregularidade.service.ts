import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeImagem } from './entities/irregularidade-imagem.entity';
import { Vistoria } from './entities/vistoria.entity';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { Componente } from './entities/componente.entity';
import { Sintoma } from './entities/sintoma.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { MatrizCriticidade } from './entities/matriz-criticidade.entity';
import { CreateIrregularidadeDto } from './dto/create-irregularidade.dto';
import { UpdateIrregularidadeDto } from './dto/update-irregularidade.dto';
import { IrregularidadeResumoDto } from './dto/irregularidade-resumo.dto';
import { IrregularidadeImagemResumoDto } from './dto/irregularidade-imagem-resumo.dto';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';

@Injectable()
export class IrregularidadeService {
  constructor(
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(IrregularidadeImagem)
    private readonly imagemRepository: Repository<IrregularidadeImagem>,
    @InjectRepository(Vistoria)
    private readonly vistoriaRepository: Repository<Vistoria>,
    @InjectRepository(AreaVistoriada)
    private readonly areaRepository: Repository<AreaVistoriada>,
    @InjectRepository(Componente)
    private readonly componenteRepository: Repository<Componente>,
    @InjectRepository(Sintoma)
    private readonly sintomaRepository: Repository<Sintoma>,
    @InjectRepository(AreaComponente)
    private readonly areaComponenteRepository: Repository<AreaComponente>,
    @InjectRepository(MatrizCriticidade)
    private readonly matrizRepository: Repository<MatrizCriticidade>,
  ) {}

  async create(
    vistoriaId: string,
    dto: CreateIrregularidadeDto,
  ): Promise<Irregularidade> {
    const vistoria = await this.getVistoriaOrFail(vistoriaId);
    this.assertVistoriaAberta(vistoria);

    await this.ensureArea(dto.idarea);
    await this.ensureComponente(dto.idcomponente);
    await this.ensureSintoma(dto.idsintoma);
    await this.ensureComponenteNaArea(dto.idarea, dto.idcomponente);
    await this.ensureMatriz(dto.idcomponente, dto.idsintoma);

    const irregularidade = this.irregularidadeRepository.create({
      idVistoria: vistoria.id,
      idArea: dto.idarea,
      idComponente: dto.idcomponente,
      idSintoma: dto.idsintoma,
      observacao: dto.observacao,
      resolvido: false,
    });

    return this.irregularidadeRepository.save(irregularidade);
  }

  async listByVistoria(vistoriaId: string): Promise<IrregularidadeResumoDto[]> {
    await this.getVistoriaOrFail(vistoriaId);
    const itens = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoriaId },
      relations: ['area', 'componente', 'sintoma'],
      order: { atualizadoEm: 'DESC' },
    });

    return itens.map((item) => ({
      id: item.id,
      idarea: item.idArea,
      nomeArea: item.area?.nome,
      idcomponente: item.idComponente,
      nomeComponente: item.componente?.nome,
      idsintoma: item.idSintoma,
      descricaoSintoma: item.sintoma?.descricao,
      observacao: item.observacao ?? undefined,
      resolvido: item.resolvido,
      atualizadoEm: item.atualizadoEm.toISOString(),
    }));
  }

  async update(id: string, dto: UpdateIrregularidadeDto): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(id);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);

    const updated = this.irregularidadeRepository.merge(irregularidade, {
      observacao: dto.observacao ?? irregularidade.observacao,
      resolvido: dto.resolvido ?? irregularidade.resolvido,
    });
    return this.irregularidadeRepository.save(updated);
  }

  async listImages(vistoriaId: string): Promise<IrregularidadeImagemResumoDto[]> {
    await this.getVistoriaOrFail(vistoriaId);
    const irregularidades = await this.irregularidadeRepository.find({
      where: { idVistoria: vistoriaId },
      relations: ['imagens'],
    });

    return irregularidades.map((item) => ({
      idirregularidade: item.id,
      imagens: (item.imagens ?? []).map((imagem) => ({
        nomeArquivo: imagem.nomeArquivo,
        tamanho: Number(imagem.tamanho),
        dadosBase64: imagem.dadosBytea.toString('base64'),
      })),
    }));
  }

  async uploadImages(
    irregularidadeId: string,
    files: Express.Multer.File[],
  ): Promise<IrregularidadeImagem[]> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);

    const matriz = await this.ensureMatriz(
      irregularidade.idComponente,
      irregularidade.idSintoma,
    );
    if (matriz.exigeFoto && (!files || files.length === 0)) {
      throw new BadRequestException('Foto obrigatória para a irregularidade');
    }

    return this.irregularidadeRepository.manager.transaction(async (manager) => {
      await manager
        .getRepository(IrregularidadeImagem)
        .delete({ idIrregularidade: irregularidadeId });

      const imagens = (files ?? []).map((file) =>
        manager.getRepository(IrregularidadeImagem).create({
          idIrregularidade: irregularidadeId,
          nomeArquivo: file.originalname,
          tamanho: file.size,
          dadosBytea: file.buffer,
        }),
      );

      if (imagens.length === 0) {
        return [];
      }

      return manager.getRepository(IrregularidadeImagem).save(imagens);
    });
  }

  async uploadAudio(
    irregularidadeId: string,
    file: Express.Multer.File,
    duracaoMs?: number,
  ): Promise<Irregularidade> {
    if (!file) {
      throw new BadRequestException('Arquivo de áudio não enviado');
    }

    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);

    const matriz = await this.ensureMatriz(
      irregularidade.idComponente,
      irregularidade.idSintoma,
    );
    if (!matriz.permiteAudio) {
      throw new BadRequestException('Áudio não permitido para esta irregularidade');
    }

    const updated = this.irregularidadeRepository.merge(irregularidade, {
      audioNomeArquivo: file.originalname,
      audioMimeType: file.mimetype,
      audioTamanho: file.size,
      audioDuracaoMs: duracaoMs,
      audioDadosBytea: file.buffer,
    });
    return this.irregularidadeRepository.save(updated);
  }

  async removeAudio(irregularidadeId: string): Promise<Irregularidade> {
    const irregularidade = await this.getIrregularidadeOrFail(irregularidadeId);
    await this.ensureVistoriaAberta(irregularidade.idVistoria);
    const updated = this.irregularidadeRepository.merge(irregularidade, {
      audioNomeArquivo: null,
      audioMimeType: null,
      audioTamanho: null,
      audioDuracaoMs: null,
      audioDadosBytea: null,
    });
    return this.irregularidadeRepository.save(updated);
  }

  private async ensureArea(id: string): Promise<void> {
    const area = await this.areaRepository.findOne({ where: { id } });
    if (!area) {
      throw new NotFoundException('Área não encontrada');
    }
  }

  private async ensureComponente(id: string): Promise<void> {
    const componente = await this.componenteRepository.findOne({ where: { id } });
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

  private async ensureComponenteNaArea(idArea: string, idComponente: string): Promise<void> {
    const found = await this.areaComponenteRepository.findOne({
      where: { idArea, idComponente },
    });
    if (!found) {
      throw new BadRequestException('Componente não pertence à área informada');
    }
  }

  private async ensureMatriz(idComponente: string, idSintoma: string): Promise<MatrizCriticidade> {
    const matriz = await this.matrizRepository.findOne({
      where: { idComponente, idSintoma },
    });
    if (!matriz) {
      throw new NotFoundException('Matriz de criticidade não encontrada');
    }
    return matriz;
  }

  private async getVistoriaOrFail(id: string): Promise<Vistoria> {
    const vistoria = await this.vistoriaRepository.findOne({ where: { id } });
    if (!vistoria) {
      throw new NotFoundException('Vistoria não encontrada');
    }
    return vistoria;
  }

  private async ensureVistoriaAberta(vistoriaId: string): Promise<void> {
    const vistoria = await this.getVistoriaOrFail(vistoriaId);
    this.assertVistoriaAberta(vistoria);
  }

  private assertVistoriaAberta(vistoria: Vistoria): void {
    if (vistoria.status === StatusVistoria.FINALIZADA) {
      throw new BadRequestException('Vistoria já finalizada');
    }
    if (vistoria.status === StatusVistoria.CANCELADA) {
      throw new BadRequestException('Vistoria cancelada');
    }
  }

  private async getIrregularidadeOrFail(id: string): Promise<Irregularidade> {
    const irregularidade = await this.irregularidadeRepository.findOne({
      where: { id },
    });
    if (!irregularidade) {
      throw new NotFoundException('Irregularidade não encontrada');
    }
    return irregularidade;
  }
}
