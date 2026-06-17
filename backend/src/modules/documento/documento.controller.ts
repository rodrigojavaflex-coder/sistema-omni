import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';
import { DocumentoService } from './documento.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { FindDocumentosDto } from './dto/find-documentos.dto';
import { AtivarCompartilhamentoDto } from './dto/ativar-compartilhamento.dto';
import {
  DocumentoPublicoResumoDto,
  DocumentoResumoDto,
} from './dto/documento-resumo.dto';
import { DOCUMENTO_MAX_FILE_SIZE_BYTES } from './documento.constants';

@ApiTags('documentos')
@ApiBearerAuth()
@Controller('documentos')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class DocumentoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Post()
  @Permissions(Permission.DOCUMENTO_CREATE)
  @ApiOperation({ summary: 'Criar documento com arquivo' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: DocumentoResumoDto })
  @UseInterceptors(
    FileInterceptor('arquivo', {
      limits: { fileSize: DOCUMENTO_MAX_FILE_SIZE_BYTES },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateDocumentoDto,
  ): Promise<DocumentoResumoDto> {
    return this.documentoService.create(dto, file);
  }

  @Get()
  @Permissions(Permission.DOCUMENTO_READ)
  @ApiOperation({ summary: 'Listar documentos' })
  @ApiResponse({ status: 200, type: [DocumentoResumoDto] })
  findAll(@Query() filters: FindDocumentosDto): Promise<DocumentoResumoDto[]> {
    return this.documentoService.findAll(filters);
  }

  @Get(':id/arquivo')
  @Permissions(Permission.DOCUMENTO_READ)
  @ApiOperation({ summary: 'Download do arquivo do documento' })
  async downloadArquivo(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<StreamableFile> {
    const arquivo = await this.documentoService.getArquivoBuffer(id);
    return new StreamableFile(arquivo.buffer, {
      type: arquivo.mimeType,
      disposition: `attachment; filename="${encodeURIComponent(arquivo.nomeArquivo)}"`,
    });
  }

  @Get(':id')
  @Permissions(Permission.DOCUMENTO_READ)
  @ApiOperation({ summary: 'Buscar documento por id' })
  @ApiResponse({ status: 200, type: DocumentoResumoDto })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentoService.findOneResumo(id);
  }

  @Patch(':id')
  @Permissions(Permission.DOCUMENTO_UPDATE)
  @ApiOperation({ summary: 'Atualizar metadados do documento' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateDocumentoDto,
  ) {
    return this.documentoService.update(id, dto);
  }

  @Patch(':id/arquivo')
  @Permissions(Permission.DOCUMENTO_UPDATE)
  @ApiOperation({ summary: 'Substituir arquivo do documento' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      limits: { fileSize: DOCUMENTO_MAX_FILE_SIZE_BYTES },
    }),
  )
  replaceArquivo(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentoService.replaceArquivo(id, file);
  }

  @Delete(':id')
  @Permissions(Permission.DOCUMENTO_DELETE)
  @ApiOperation({ summary: 'Excluir documento' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentoService.remove(id);
  }

  @Post(':id/compartilhamento/ativar')
  @Permissions(Permission.DOCUMENTO_COMPARTILHAR)
  @ApiOperation({ summary: 'Ativar link público de compartilhamento' })
  ativarCompartilhamento(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AtivarCompartilhamentoDto,
  ) {
    return this.documentoService.ativarCompartilhamento(id, dto);
  }

  @Post(':id/compartilhamento/desativar')
  @Permissions(Permission.DOCUMENTO_COMPARTILHAR)
  @ApiOperation({ summary: 'Desativar link público de compartilhamento' })
  desativarCompartilhamento(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.documentoService.desativarCompartilhamento(id);
  }

  @Post(':id/compartilhamento/regenerar')
  @Permissions(Permission.DOCUMENTO_COMPARTILHAR)
  @ApiOperation({ summary: 'Regenerar token do link público' })
  regenerarCompartilhamento(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: AtivarCompartilhamentoDto,
  ) {
    return this.documentoService.regenerarCompartilhamento(id, dto);
  }
}

@ApiTags('documentos-publico')
@Controller('documentos/publico')
export class DocumentoPublicoController {
  constructor(private readonly documentoService: DocumentoService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Metadados públicos do documento por token' })
  @ApiResponse({ status: 200, type: DocumentoPublicoResumoDto })
  getPublico(
    @Param('token') token: string,
    @Req() req: Request,
  ): Promise<DocumentoPublicoResumoDto> {
    return this.documentoService.getPublicoResumo(
      token,
      req.ip || req.socket.remoteAddress,
    );
  }

  @Get(':token/arquivo')
  @ApiOperation({ summary: 'Download público do arquivo por token' })
  async downloadPublico(
    @Param('token') token: string,
    @Req() req: Request,
  ): Promise<StreamableFile> {
    const arquivo = await this.documentoService.getPublicoArquivo(
      token,
      req.ip || req.socket.remoteAddress,
    );
    return new StreamableFile(arquivo.buffer, {
      type: arquivo.mimeType,
      disposition: `attachment; filename="${encodeURIComponent(arquivo.nomeArquivo)}"`,
    });
  }
}
