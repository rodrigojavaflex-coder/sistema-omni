import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { validarCamposVitimas } from '../../common/validators/validador-vitimas';
import { CategoriaOcorrenciaService } from '../categoria-ocorrencia/categoria-ocorrencia.service';

@Injectable()
export class OcorrenciaService {
  constructor(
    @InjectRepository(Ocorrencia)
    private readonly ocorrenciaRepository: Repository<Ocorrencia>,
    private readonly categoriaOcorrenciaService: CategoriaOcorrenciaService,
  ) {}

  async create(
    createOcorrenciaDto: CreateOcorrenciaDto,
    idUsuario?: string,
  ): Promise<Ocorrencia> {
    // Validar campos de vítima condicionalmente
    const errosVitimas = validarCamposVitimas(createOcorrenciaDto);
    if (errosVitimas.length > 0) {
      throw new BadRequestException(errosVitimas[0]);
    }

    // Validar categoria pertence à origem (origem e categoria são obrigatórios)
    const categoria = await this.categoriaOcorrenciaService.findOne(
      createOcorrenciaDto.idCategoria,
    );
    if (categoria.idOrigem !== createOcorrenciaDto.idOrigem) {
      throw new BadRequestException(
        'A categoria selecionada não pertence à origem informada',
      );
    }

    // Validar localização se fornecida
    if (createOcorrenciaDto.localizacao) {
      this.validateLocation(createOcorrenciaDto.localizacao);
    }

    // Converter objeto de localização para formato PostGIS
    const ocorrenciaData: any = {
      ...createOcorrenciaDto,
    };

    if (createOcorrenciaDto.localizacao) {
      ocorrenciaData.localizacao = this.formatLocationForDB(
        createOcorrenciaDto.localizacao,
      );
    }

    if (idUsuario) {
      ocorrenciaData.idUsuario = idUsuario;
    }

    const dataHoraDate = new Date(createOcorrenciaDto.dataHora);
    const ano = dataHoraDate.getFullYear();
    ocorrenciaData.numero = await this.getProximoNumeroOcorrencia(ano);

    const ocorrencia = this.ocorrenciaRepository.create(ocorrenciaData);
    const saved: any = await this.ocorrenciaRepository.save(ocorrencia);

    // Buscar ocorrência completa com relações
    const id = Array.isArray(saved) ? saved[0].id : saved.id;
    return await this.findOne(id);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    tipo?: string | string[],
    linha?: string | string[],
    dataInicio?: string,
    dataFim?: string,
    idVeiculo?: string,
    idMotorista?: string,
    arco?: string | string[],
    sentidoVia?: string | string[],
    tipoLocal?: string | string[],
    culpabilidade?: string | string[],
    houveVitimas?: string | string[],
    terceirizado?: string | string[],
    idOrigem?: string | string[],
    idCategoria?: string | string[],
    numero?: string,
  ): Promise<{
    data: Ocorrencia[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    let query = this.ocorrenciaRepository
      .createQueryBuilder('ocorrencia')
      .leftJoinAndSelect('ocorrencia.veiculo', 'veiculo')
      .leftJoinAndSelect('ocorrencia.motorista', 'motorista')
      .leftJoinAndSelect('ocorrencia.origem', 'origem')
      .leftJoinAndSelect('ocorrencia.categoria', 'categoria')
      .leftJoinAndSelect('ocorrencia.empresaDoMotorista', 'empresaDoMotorista')
      .leftJoinAndSelect('ocorrencia.usuario', 'usuario')
      .take(limit)
      .skip(skip)
      .orderBy('ocorrencia.atualizadoEm', 'DESC');

    const conditions: string[] = [];
    const parameters: any = {};

    // Filtro por tipo - suporta múltiplos valores
    if (tipo) {
      const tipos = Array.isArray(tipo) ? tipo : [tipo];
      if (tipos.length > 0) {
        conditions.push('ocorrencia.tipo IN (:...tipos)');
        parameters.tipos = tipos;
      }
    }

    // Filtro por linha - suporta múltiplos valores
    if (linha) {
      const linhas = Array.isArray(linha) ? linha : [linha];
      if (linhas.length > 0) {
        conditions.push('ocorrencia.linha IN (:...linhas)');
        parameters.linhas = linhas;
      }
    }

    // Filtro por período
    if (dataInicio && dataFim) {
      conditions.push('ocorrencia.dataHora BETWEEN :dataInicio AND :dataFim');
      parameters.dataInicio = dataInicio;
      parameters.dataFim = dataFim;
    } else if (dataInicio) {
      conditions.push('ocorrencia.dataHora >= :dataInicio');
      parameters.dataInicio = dataInicio;
    } else if (dataFim) {
      conditions.push('ocorrencia.dataHora <= :dataFim');
      parameters.dataFim = dataFim;
    }

    // Filtro por veículo
    if (idVeiculo) {
      conditions.push('ocorrencia.idVeiculo = :idVeiculo');
      parameters.idVeiculo = idVeiculo;
    }

    // Filtro por motorista
    if (idMotorista) {
      conditions.push('ocorrencia.idMotorista = :idMotorista');
      parameters.idMotorista = idMotorista;
    }

    // Filtro por arco - suporta múltiplos valores
    if (arco) {
      const arcos = Array.isArray(arco) ? arco : [arco];
      if (arcos.length > 0) {
        conditions.push('ocorrencia.arco IN (:...arcos)');
        parameters.arcos = arcos;
      }
    }

    // Filtro por sentido da via - suporta múltiplos valores
    if (sentidoVia) {
      const sentidos = Array.isArray(sentidoVia) ? sentidoVia : [sentidoVia];
      if (sentidos.length > 0) {
        conditions.push('ocorrencia.sentidoVia IN (:...sentidos)');
        parameters.sentidos = sentidos;
      }
    }

    // Filtro por tipo local - suporta múltiplos valores
    if (tipoLocal) {
      const locais = Array.isArray(tipoLocal) ? tipoLocal : [tipoLocal];
      if (locais.length > 0) {
        conditions.push('ocorrencia.tipoLocal IN (:...locais)');
        parameters.locais = locais;
      }
    }

    // Filtro por culpabilidade - suporta múltiplos valores
    if (culpabilidade) {
      const culpabilidades = Array.isArray(culpabilidade)
        ? culpabilidade
        : [culpabilidade];
      if (culpabilidades.length > 0) {
        conditions.push('ocorrencia.culpabilidade IN (:...culpabilidades)');
        parameters.culpabilidades = culpabilidades;
      }
    }

    // Filtro por houve vítimas - suporta múltiplos valores
    if (houveVitimas) {
      const vitimas = Array.isArray(houveVitimas)
        ? houveVitimas
        : [houveVitimas];
      if (vitimas.length > 0) {
        conditions.push('ocorrencia.houveVitimas IN (:...vitimas)');
        parameters.vitimas = vitimas;
      }
    }

    // Filtro por terceirizado - suporta múltiplos valores
    if (terceirizado) {
      const terceirizados = Array.isArray(terceirizado)
        ? terceirizado
        : [terceirizado];
      if (terceirizados.length > 0) {
        conditions.push('motorista.terceirizado IN (:...terceirizados)');
        parameters.terceirizados = terceirizados;
      }
    }

    // Filtro por origem - suporta múltiplos valores
    if (idOrigem) {
      const origens = Array.isArray(idOrigem) ? idOrigem : [idOrigem];
      if (origens.length > 0) {
        conditions.push('ocorrencia.idOrigem IN (:...origens)');
        parameters.origens = origens;
      }
    }

    // Filtro por categoria - suporta múltiplos valores
    if (idCategoria) {
      const categorias = Array.isArray(idCategoria) ? idCategoria : [idCategoria];
      if (categorias.length > 0) {
        conditions.push('ocorrencia.idCategoria IN (:...categorias)');
        parameters.categorias = categorias;
      }
    }

    // Filtro por número da ocorrência (exato ou contém)
    if (numero && numero.trim()) {
      conditions.push('ocorrencia.numero LIKE :numero');
      parameters.numero = '%' + numero.trim() + '%';
    }

    // Aplica as condições
    if (conditions.length > 0) {
      query = query.where(conditions.join(' AND '), parameters);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  async findOne(id: string): Promise<Ocorrencia> {
    const ocorrencia = await this.ocorrenciaRepository.findOne({
      where: { id },
      relations: [
        'veiculo',
        'motorista',
        'trecho',
        'origem',
        'categoria',
        'empresaDoMotorista',
        'usuario',
      ],
    });

    if (!ocorrencia) {
      throw new NotFoundException('Ocorrência não encontrada');
    }

    return ocorrencia;
  }

  async update(
    id: string,
    updateOcorrenciaDto: UpdateOcorrenciaDto,
  ): Promise<Ocorrencia> {
    const ocorrencia = await this.findOne(id);

    // Mesclar os dados atualizados com os dados existentes para validação completa
    const dadosMergidos = {
      ...ocorrencia,
      ...updateOcorrenciaDto,
    };

    // Validar campos de vítima condicionalmente
    const errosVitimas = validarCamposVitimas(dadosMergidos);

    if (errosVitimas.length > 0) {
      throw new BadRequestException(errosVitimas[0]);
    }

    // Validar categoria pertence à origem quando ambos forem enviados
    if (
      updateOcorrenciaDto.idCategoria != null &&
      updateOcorrenciaDto.idOrigem != null
    ) {
      const categoria = await this.categoriaOcorrenciaService.findOne(
        updateOcorrenciaDto.idCategoria,
      );
      if (categoria.idOrigem !== updateOcorrenciaDto.idOrigem) {
        throw new BadRequestException(
          'A categoria selecionada não pertence à origem informada',
        );
      }
    }

    // Validar localização se fornecida
    if (updateOcorrenciaDto.localizacao) {
      this.validateLocation(updateOcorrenciaDto.localizacao);
    }

    // Converter objeto de localização para formato PostGIS
    const updateData: any = {
      ...updateOcorrenciaDto,
    };

    if (updateOcorrenciaDto.localizacao) {
      updateData.localizacao = this.formatLocationForDB(
        updateOcorrenciaDto.localizacao,
      );
    }

    // Usar update() do queryBuilder para atualizar direto no banco
    // Isso evita problemas com eager loading e Object.assign
    await this.ocorrenciaRepository
      .createQueryBuilder()
      .update(Ocorrencia)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    // Recarregar com as relações para retornar dados completos
    const ocorrenciaCompleta = await this.ocorrenciaRepository.findOne({
      where: { id },
      relations: ['veiculo', 'motorista', 'trecho'],
      cache: false,
    });

    if (!ocorrenciaCompleta) {
      throw new NotFoundException('Ocorrência não encontrada após atualização');
    }

    return ocorrenciaCompleta;
  }

  async remove(id: string): Promise<void> {
    const ocorrencia = await this.findOne(id);
    await this.ocorrenciaRepository.remove(ocorrencia);
  }

  /**
   * Estatísticas de ocorrências
   */
  async getStatistics(dataInicio?: string, dataFim?: string): Promise<any> {
    let query = this.ocorrenciaRepository.createQueryBuilder('ocorrencia');

    if (dataInicio && dataFim) {
      query = query.where(
        'ocorrencia.dataHora BETWEEN :dataInicio AND :dataFim',
        {
          dataInicio,
          dataFim,
        },
      );
    }

    const total = await query.getCount();

    const porTipo = await query
      .select('ocorrencia.tipo', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .groupBy('ocorrencia.tipo')
      .orderBy('total', 'DESC')
      .getRawMany();

    const porLinha = await query
      .select('ocorrencia.linha', 'linha')
      .addSelect('COUNT(*)', 'total')
      .where('ocorrencia.linha IS NOT NULL')
      .groupBy('ocorrencia.linha')
      .orderBy('total', 'DESC')
      .getRawMany();

    const comVitimas = await this.ocorrenciaRepository.count({
      where: { houveVitimas: 'Sim' as any },
    });

    return {
      total,
      comVitimas,
      porTipo,
      porLinha,
    };
  }

  /**
   * Buscar ocorrências próximas a uma localização (raio em metros)
   */
  async findByLocation(
    latitude: number,
    longitude: number,
    radiusMeters: number = 1000,
  ): Promise<Ocorrencia[]> {
    // Usar PostGIS ST_DWithin para busca por proximidade
    const query = `
      SELECT * FROM ocorrencias
      WHERE localizacao IS NOT NULL
      AND ST_DWithin(
        localizacao::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
        $3
      )
      ORDER BY ST_Distance(
        localizacao::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      )
    `;

    return await this.ocorrenciaRepository.query(query, [
      longitude,
      latitude,
      radiusMeters,
    ]);
  }

  /**
   * Gera o próximo número da ocorrência no ano: AAAA + sequencial 6 dígitos (ex.: 2026000001)
   */
  private async getProximoNumeroOcorrencia(ano: number): Promise<string> {
    const prefix = String(ano);
    const result = await this.ocorrenciaRepository
      .createQueryBuilder('o')
      .select('o.numero')
      .where('o.numero IS NOT NULL')
      .andWhere('o.numero LIKE :prefix', { prefix: prefix + '%' })
      .orderBy('o.numero', 'DESC')
      .limit(1)
      .getOne();

    let proximoSeq = 1;
    if (result?.numero && result.numero.length >= 10) {
      const seqStr = result.numero.slice(-6);
      const seq = parseInt(seqStr, 10);
      if (!isNaN(seq)) proximoSeq = seq + 1;
    }
    return prefix + String(proximoSeq).padStart(6, '0');
  }

  /**
   * Verifica se já existe ocorrência para o motorista na mesma data (dia), sem considerar hora.
   * Retorna { existe, numero?, origem?, categoria? }. Em edição, passa idOcorrenciaExcluir para ignorar a própria.
   */
  async existsOcorrenciaMotoristaDataHora(
    idMotorista: string,
    dataHora: string,
    idOcorrenciaExcluir?: string,
  ): Promise<{
    existe: boolean;
    numero?: string;
    origem?: string;
    categoria?: string;
  }> {
    // dataHora vem como "2025-10-18T15:00" -> considerar só a data: mesmo dia [00:00:00, dia seguinte)
    const s = dataHora.replace('T', ' ').substring(0, 10); // "2025-10-18"
    const dataInicio = s + ' 00:00:00';
    const d = new Date(s + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    const dataFim =
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0') +
      ' 00:00:00';

    let qb = this.ocorrenciaRepository
      .createQueryBuilder('o')
      .leftJoin('o.origem', 'origem')
      .leftJoin('o.categoria', 'categoria')
      .select('o.numero', 'numero')
      .addSelect('origem.descricao', 'origem')
      .addSelect('categoria.descricao', 'categoria')
      .where('o.idMotorista = :idMotorista', { idMotorista })
      .andWhere('o.dataHora >= :dataInicio AND o.dataHora < :dataFim', {
        dataInicio,
        dataFim,
      });

    if (idOcorrenciaExcluir) {
      qb = qb.andWhere('o.id != :idOcorrenciaExcluir', {
        idOcorrenciaExcluir,
      });
    }

    const raw = await qb
      .orderBy('o.dataHora', 'ASC')
      .limit(1)
      .getRawOne<{ numero: string; origem: string; categoria: string }>();
    return {
      existe: !!raw,
      numero: raw?.numero,
      origem: raw?.origem,
      categoria: raw?.categoria,
    };
  }

  /**
   * Validar coordenadas de localização
   */
  private validateLocation(location: any): void {
    if (!location.coordinates || !Array.isArray(location.coordinates)) {
      throw new BadRequestException('Coordenadas de localização inválidas');
    }

    const [lng, lat] = location.coordinates;

    if (typeof lng !== 'number' || typeof lat !== 'number') {
      throw new BadRequestException('Coordenadas devem ser números');
    }

    if (lng < -180 || lng > 180) {
      throw new BadRequestException('Longitude deve estar entre -180 e 180');
    }

    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude deve estar entre -90 e 90');
    }
  }

  /**
   * Formatar localização para formato PostGIS
   */
  private formatLocationForDB(location: any): any {
    // Retornar como GeoJSON - TypeORM/PostGIS converterá automaticamente
    return location; // Já é um GeoJSON válido: { type: 'Point', coordinates: [lng, lat] }
  }
}
