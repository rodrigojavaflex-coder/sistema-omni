import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { FindDocumentosDto } from './dto/find-documentos.dto';
import { AtivarCompartilhamentoDto } from './dto/ativar-compartilhamento.dto';
import {
  DocumentoPublicoResumoDto,
  DocumentoResumoDto,
} from './dto/documento-resumo.dto';
import { StatusDocumento } from '../../common/enums/status-documento.enum';
import { TipoDocumento } from '../tipo-documento/entities/tipo-documento.entity';
import { Departamento } from '../departamento/entities/departamento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import {
  DOCUMENTO_MAX_FILE_SIZE_BYTES,
  DOCUMENTO_MIME_TYPES_PERMITIDOS,
  DOCUMENTO_PUBLIC_RATE_LIMIT_MAX,
  DOCUMENTO_PUBLIC_RATE_LIMIT_WINDOW_MS,
} from './documento.constants';

@Injectable()
export class DocumentoService {
  private readonly logger = new Logger(DocumentoService.name);
  private readonly publicRateLimit = new Map<
    string,
    { count: number; resetAt: number }
  >();

  constructor(
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>,
    @InjectRepository(TipoDocumento)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
    @InjectRepository(Departamento)
    private readonly departamentoRepository: Repository<Departamento>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(
    dto: CreateDocumentoDto,
    file: Express.Multer.File,
  ): Promise<DocumentoResumoDto> {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }
    this.validateFile(file);

    await this.validateReferencias(dto);

    const documento = this.documentoRepository.create({
      nomeDocumento: dto.nomeDocumento.trim(),
      tipoDocumentoId: dto.tipoDocumentoId,
      departamentoId: dto.departamentoId,
      responsavelId: dto.responsavelId,
      status: dto.status ?? StatusDocumento.ATIVO,
      nomeArquivo: file.originalname,
      mimeType: file.mimetype,
      tamanho: file.size,
      dadosBytea: file.buffer,
      compartilhamentoAtivo: false,
    });

    const saved = await this.documentoRepository.save(documento);
    return this.findOneResumo(saved.id);
  }

  async findAll(filters: FindDocumentosDto): Promise<DocumentoResumoDto[]> {
    const qb = this.documentoRepository
      .createQueryBuilder('documento')
      .leftJoinAndSelect('documento.tipoDocumento', 'tipoDocumento')
      .leftJoinAndSelect('documento.departamento', 'departamento')
      .leftJoinAndSelect('documento.responsavel', 'responsavel')
      .orderBy('documento.nomeDocumento', 'ASC');

    if (filters.nome?.trim()) {
      qb.andWhere('documento.nomeDocumento ILIKE :nome', {
        nome: `%${filters.nome.trim()}%`,
      });
    }
    if (filters.tipoDocumentoId) {
      qb.andWhere('documento.tipoDocumentoId = :tipoDocumentoId', {
        tipoDocumentoId: filters.tipoDocumentoId,
      });
    }
    if (filters.departamentoId) {
      qb.andWhere('documento.departamentoId = :departamentoId', {
        departamentoId: filters.departamentoId,
      });
    }
    if (filters.responsavelId) {
      qb.andWhere('documento.responsavelId = :responsavelId', {
        responsavelId: filters.responsavelId,
      });
    }
    if (filters.status) {
      qb.andWhere('documento.status = :status', { status: filters.status });
    }

    const items = await qb.getMany();
    return items.map((item) => this.toResumo(item));
  }

  async findOneResumo(id: string): Promise<DocumentoResumoDto> {
    const documento = await this.documentoRepository.findOne({
      where: { id },
      relations: ['tipoDocumento', 'departamento', 'responsavel'],
    });
    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }
    return this.toResumo(documento);
  }

  async update(
    id: string,
    dto: UpdateDocumentoDto,
  ): Promise<DocumentoResumoDto> {
    const documento = await this.getDocumentoOrFail(id);
    this.assertEditable(documento, dto);

    if (dto.nomeDocumento !== undefined) {
      documento.nomeDocumento = dto.nomeDocumento.trim();
    }
    if (dto.tipoDocumentoId !== undefined) {
      await this.validateTipoDocumento(dto.tipoDocumentoId);
      documento.tipoDocumentoId = dto.tipoDocumentoId;
    }
    if (dto.departamentoId !== undefined) {
      await this.validateDepartamento(dto.departamentoId);
      documento.departamentoId = dto.departamentoId;
    }
    if (dto.responsavelId !== undefined) {
      await this.validateResponsavel(dto.responsavelId);
      documento.responsavelId = dto.responsavelId;
    }
    if (dto.status !== undefined) {
      documento.status = dto.status;
      if (
        dto.status !== StatusDocumento.ATIVO &&
        documento.compartilhamentoAtivo
      ) {
        this.revogarCompartilhamento(documento);
      }
    }

    await this.documentoRepository.save(documento);
    return this.findOneResumo(id);
  }

  async replaceArquivo(
    id: string,
    file: Express.Multer.File,
  ): Promise<DocumentoResumoDto> {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }
    this.validateFile(file);

    const documento = await this.getDocumentoOrFail(id);
    this.assertEditable(documento);

    documento.nomeArquivo = file.originalname;
    documento.mimeType = file.mimetype;
    documento.tamanho = file.size;
    documento.dadosBytea = file.buffer;

    await this.documentoRepository.save(documento);
    return this.findOneResumo(id);
  }

  async getArquivoBuffer(id: string): Promise<{
    buffer: Buffer;
    mimeType: string;
    nomeArquivo: string;
  }> {
    const documento = await this.documentoRepository
      .createQueryBuilder('documento')
      .addSelect('documento.dadosBytea')
      .where('documento.id = :id', { id })
      .getOne();

    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }

    return {
      buffer: documento.dadosBytea,
      mimeType: documento.mimeType,
      nomeArquivo: documento.nomeArquivo,
    };
  }

  async remove(id: string): Promise<void> {
    const documento = await this.getDocumentoOrFail(id);
    await this.documentoRepository.remove(documento);
  }

  async ativarCompartilhamento(
    id: string,
    dto: AtivarCompartilhamentoDto,
  ): Promise<DocumentoResumoDto> {
    const documento = await this.getDocumentoOrFail(id);
    if (documento.status !== StatusDocumento.ATIVO) {
      throw new BadRequestException(
        'Compartilhamento público permitido apenas para documentos com status Ativo',
      );
    }

    documento.compartilhamentoAtivo = true;
    documento.tokenPublico = this.generateToken();
    documento.compartilhamentoGeradoEm = new Date();
    documento.compartilhamentoExpiraEm = dto.compartilhamentoExpiraEm
      ? new Date(dto.compartilhamentoExpiraEm)
      : null;

    if (
      documento.compartilhamentoExpiraEm &&
      documento.compartilhamentoExpiraEm.getTime() <= Date.now()
    ) {
      throw new BadRequestException(
        'Data de expiração deve ser futura quando informada',
      );
    }

    await this.documentoRepository.save(documento);
    return this.findOneResumo(id);
  }

  async desativarCompartilhamento(id: string): Promise<DocumentoResumoDto> {
    const documento = await this.getDocumentoOrFail(id);
    this.revogarCompartilhamento(documento);
    await this.documentoRepository.save(documento);
    return this.findOneResumo(id);
  }

  async regenerarCompartilhamento(
    id: string,
    dto: AtivarCompartilhamentoDto,
  ): Promise<DocumentoResumoDto> {
    const documento = await this.getDocumentoOrFail(id);
    if (!documento.compartilhamentoAtivo) {
      throw new BadRequestException(
        'Compartilhamento não está ativo. Ative antes de regenerar o link.',
      );
    }
    return this.ativarCompartilhamento(id, dto);
  }

  async getPublicoResumo(
    token: string,
    clientIp?: string,
  ): Promise<DocumentoPublicoResumoDto> {
    this.assertPublicRateLimit(clientIp);
    const documento = await this.getDocumentoByTokenOrFail(token);
    this.logPublicAccess(token, clientIp, 'metadata');
    return {
      nomeDocumento: documento.nomeDocumento,
      nomeArquivo: documento.nomeArquivo,
      tipoDocumento: documento.tipoDocumento?.nome ?? '',
      departamento: documento.departamento?.nomeDepartamento ?? '',
      mimeType: documento.mimeType,
      tamanho: Number(documento.tamanho),
    };
  }

  async getPublicoArquivo(
    token: string,
    clientIp?: string,
  ): Promise<{ buffer: Buffer; mimeType: string; nomeArquivo: string }> {
    this.assertPublicRateLimit(clientIp);
    const documento = await this.documentoRepository
      .createQueryBuilder('documento')
      .addSelect('documento.dadosBytea')
      .where('documento.tokenPublico = :token', { token })
      .getOne();

    if (!documento) {
      throw new NotFoundException('Link de documento inválido ou expirado');
    }

    this.assertPublicoAccessivel(documento);
    this.logPublicAccess(token, clientIp, 'download');

    return {
      buffer: documento.dadosBytea,
      mimeType: documento.mimeType,
      nomeArquivo: documento.nomeArquivo,
    };
  }

  private async getDocumentoOrFail(id: string): Promise<Documento> {
    const documento = await this.documentoRepository.findOne({ where: { id } });
    if (!documento) {
      throw new NotFoundException('Documento não encontrado');
    }
    return documento;
  }

  private async getDocumentoByTokenOrFail(token: string): Promise<Documento> {
    const documento = await this.documentoRepository.findOne({
      where: { tokenPublico: token },
    });
    if (!documento) {
      throw new NotFoundException('Link de documento inválido ou expirado');
    }
    this.assertPublicoAccessivel(documento);
    return documento;
  }

  private assertPublicoAccessivel(documento: Documento): void {
    if (
      documento.status !== StatusDocumento.ATIVO ||
      !documento.compartilhamentoAtivo ||
      !documento.tokenPublico
    ) {
      throw new ForbiddenException(
        'Link de compartilhamento indisponível para este documento',
      );
    }
    if (
      documento.compartilhamentoExpiraEm &&
      documento.compartilhamentoExpiraEm.getTime() <= Date.now()
    ) {
      throw new ForbiddenException('Link de compartilhamento expirado');
    }
  }

  private assertEditable(
    documento: Documento,
    dto?: UpdateDocumentoDto,
  ): void {
    const bloqueado =
      documento.status === StatusDocumento.OBSOLETO ||
      documento.status === StatusDocumento.ARQUIVADO;

    if (!bloqueado) {
      return;
    }

    const reabrindo =
      dto?.status === StatusDocumento.EM_REVISAO &&
      Object.keys(dto).length === 1;

    if (reabrindo) {
      return;
    }

    throw new BadRequestException(
      'Documento obsoleto ou arquivado não permite alteração. Altere o status para Em Revisão para reabrir.',
    );
  }

  private revogarCompartilhamento(documento: Documento): void {
    documento.compartilhamentoAtivo = false;
    documento.tokenPublico = null;
    documento.compartilhamentoExpiraEm = null;
    documento.compartilhamentoGeradoEm = null;
  }

  private async validateReferencias(dto: CreateDocumentoDto): Promise<void> {
    await this.validateTipoDocumento(dto.tipoDocumentoId);
    await this.validateDepartamento(dto.departamentoId);
    await this.validateResponsavel(dto.responsavelId);
  }

  private async validateTipoDocumento(id: string): Promise<TipoDocumento> {
    const tipo = await this.tipoDocumentoRepository.findOne({ where: { id } });
    if (!tipo || !tipo.ativo) {
      throw new BadRequestException('Tipo de documento inválido ou inativo');
    }
    return tipo;
  }

  private async validateDepartamento(id: string): Promise<Departamento> {
    const departamento = await this.departamentoRepository.findOne({
      where: { id },
    });
    if (!departamento) {
      throw new BadRequestException('Departamento inválido');
    }
    return departamento;
  }

  private async validateResponsavel(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario || !usuario.ativo) {
      throw new BadRequestException('Responsável inválido ou inativo');
    }
    return usuario;
  }

  private validateFile(file: Express.Multer.File): void {
    if (file.size > DOCUMENTO_MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException(
        'Arquivo excede o limite máximo de 25 MB',
      );
    }
    if (
      !DOCUMENTO_MIME_TYPES_PERMITIDOS.includes(
        file.mimetype as (typeof DOCUMENTO_MIME_TYPES_PERMITIDOS)[number],
      )
    ) {
      throw new BadRequestException(
        'Tipo de arquivo não permitido. Envie PDF, Word, Excel ou imagem PNG/JPEG.',
      );
    }
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private toResumo(documento: Documento): DocumentoResumoDto {
    return {
      id: documento.id,
      nomeDocumento: documento.nomeDocumento,
      tipoDocumento: {
        id: documento.tipoDocumento.id,
        nome: documento.tipoDocumento.nome,
      },
      departamento: {
        id: documento.departamento.id,
        nomeDepartamento: documento.departamento.nomeDepartamento,
      },
      responsavel: {
        id: documento.responsavel.id,
        nome: documento.responsavel.nome,
      },
      status: documento.status,
      nomeArquivo: documento.nomeArquivo,
      mimeType: documento.mimeType,
      tamanho: Number(documento.tamanho),
      compartilhamentoAtivo: documento.compartilhamentoAtivo,
      compartilhamentoExpiraEm: documento.compartilhamentoExpiraEm ?? null,
      tokenPublico: documento.compartilhamentoAtivo
        ? documento.tokenPublico
        : null,
      criadoEm: documento.criadoEm,
      atualizadoEm: documento.atualizadoEm,
    };
  }

  private assertPublicRateLimit(clientIp?: string): void {
    const key = clientIp?.trim() || 'unknown';
    const now = Date.now();
    const entry = this.publicRateLimit.get(key);

    if (!entry || now > entry.resetAt) {
      this.publicRateLimit.set(key, {
        count: 1,
        resetAt: now + DOCUMENTO_PUBLIC_RATE_LIMIT_WINDOW_MS,
      });
      return;
    }

    entry.count += 1;
    if (entry.count > DOCUMENTO_PUBLIC_RATE_LIMIT_MAX) {
      throw new HttpException(
        'Muitas requisições. Tente novamente em instantes.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private logPublicAccess(
    token: string,
    clientIp: string | undefined,
    action: 'metadata' | 'download',
  ): void {
    this.logger.log(
      `[documento-publico] action=${action} tokenPrefix=${token.slice(0, 8)} ip=${clientIp ?? 'unknown'}`,
    );
  }
}
