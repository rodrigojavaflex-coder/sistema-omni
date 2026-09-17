import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
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
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { ModeloVeiculo } from './entities/modelo-veiculo.entity';
import { ModeloVeiculoService } from './modelo-veiculo.service';
import { ModeloVeiculoVistaService } from './modelo-veiculo-vista.service';
import { CreateModeloVeiculoDto } from './dto/create-modelo-veiculo.dto';
import { UpdateModeloVeiculoDto } from './dto/update-modelo-veiculo.dto';
import { ModeloVeiculoVistaResumoDto, UpdateModeloVeiculoVistaDto } from './dto/modelo-veiculo-vista.dto';

const JPEG_LIMIT = 2 * 1024 * 1024;
const PERMS_VISTA_MODELO_LEITURA = [
  Permission.MODELOVEICULO_READ,
  Permission.MODELOVEICULO_VISTAS,
  Permission.MODELOVEICULO_VISTAS_IMAGEM,
  Permission.MODELOVEICULO_VISTAS_INATIVAR,
  Permission.MODELOVEICULO_VISTAS_EXCLUIR,
] as const;

@ApiTags('modelos-veiculo')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('modelos-veiculo')
export class ModeloVeiculoController {
  constructor(
    private readonly modeloService: ModeloVeiculoService,
    private readonly vistaService: ModeloVeiculoVistaService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar modelo de veículo' })
  @ApiResponse({ status: 201, type: ModeloVeiculo })
  @Permissions(Permission.MODELOVEICULO_CREATE)
  create(@Body() dto: CreateModeloVeiculoDto): Promise<ModeloVeiculo> {
    return this.modeloService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar modelos de veículo' })
  @ApiResponse({ status: 200, type: [ModeloVeiculo] })
  @Permissions(
    Permission.MODELOVEICULO_READ,
    Permission.MODELOVEICULO_VISTAS,
    Permission.MODELOVEICULO_VISTAS_IMAGEM,
    Permission.MODELOVEICULO_VISTAS_INATIVAR,
    Permission.MODELOVEICULO_VISTAS_EXCLUIR,
    Permission.VEICULO_READ,
  )
  findAll(@Query('ativo') ativo?: string): Promise<ModeloVeiculo[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.modeloService.findAll(ativoParsed);
  }

  @Get(':id/vistas')
  @ApiOperation({ summary: 'Listar vistas (desenhos) do modelo' })
  @ApiResponse({ status: 200, type: [ModeloVeiculoVistaResumoDto] })
  @Permissions(
    ...PERMS_VISTA_MODELO_LEITURA,
    Permission.VISTORIA_READ,
    Permission.VISTORIA_WEB_READ,
    Permission.IRREGULARIDADE_TRATAMENTO_READ,
    Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS,
  )
  listVistas(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('ativo') ativo?: string,
  ): Promise<ModeloVeiculoVistaResumoDto[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.vistaService.listByModelo(id, ativoParsed);
  }

  @Get(':id/vistas/:vistaId/imagem')
  @ApiOperation({ summary: 'Obter JPEG da vista do modelo' })
  @Permissions(
    ...PERMS_VISTA_MODELO_LEITURA,
    Permission.VISTORIA_READ,
    Permission.VISTORIA_WEB_READ,
    Permission.IRREGULARIDADE_TRATAMENTO_READ,
    Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS,
  )
  async getVistaImagem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vistaId', new ParseUUIDPipe()) vistaId: string,
  ): Promise<StreamableFile> {
    const imagem = await this.vistaService.getImagem(id, vistaId);
    return new StreamableFile(imagem.buffer, {
      type: imagem.mimeType,
      disposition: `inline; filename="${imagem.nomeArquivo}"`,
    });
  }

  @Post(':id/vistas')
  @ApiOperation({ summary: 'Adicionar vista ao modelo' })
  @ApiConsumes('multipart/form-data')
  @Permissions(Permission.MODELOVEICULO_VISTAS)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: JPEG_LIMIT } }),
  )
  createVista(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { idCatalogo?: string; ordem?: string },
  ): Promise<ModeloVeiculoVistaResumoDto> {
    const ordem =
      body.ordem === undefined || body.ordem === ''
        ? undefined
        : Number(body.ordem);
    return this.vistaService.create(id, body.idCatalogo ?? '', ordem, file);
  }

  @Patch(':id/vistas/:vistaId/imagem')
  @ApiOperation({ summary: 'Trocar JPEG da vista do modelo' })
  @ApiConsumes('multipart/form-data')
  @Permissions(Permission.MODELOVEICULO_VISTAS_IMAGEM)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: JPEG_LIMIT } }),
  )
  updateVistaImagem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vistaId', new ParseUUIDPipe()) vistaId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ModeloVeiculoVistaResumoDto> {
    return this.vistaService.update(id, vistaId, { file });
  }

  @Patch(':id/vistas/:vistaId')
  @ApiOperation({ summary: 'Inativar ou ativar vista do modelo' })
  @Permissions(Permission.MODELOVEICULO_VISTAS_INATIVAR)
  updateVista(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vistaId', new ParseUUIDPipe()) vistaId: string,
    @Body() body: UpdateModeloVeiculoVistaDto,
  ): Promise<ModeloVeiculoVistaResumoDto> {
    return this.vistaService.update(id, vistaId, {
      ordem: body.ordem,
      ativo: body.ativo,
    });
  }

  @Delete(':id/vistas/:vistaId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Excluir vista sem marcações' })
  @Permissions(Permission.MODELOVEICULO_VISTAS_EXCLUIR)
  removeVista(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('vistaId', new ParseUUIDPipe()) vistaId: string,
  ): Promise<void> {
    return this.vistaService.remove(id, vistaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar modelo por id' })
  @ApiResponse({ status: 200, type: ModeloVeiculo })
  @Permissions(
    Permission.MODELOVEICULO_READ,
    Permission.MODELOVEICULO_VISTAS,
    Permission.MODELOVEICULO_VISTAS_IMAGEM,
    Permission.MODELOVEICULO_VISTAS_INATIVAR,
    Permission.MODELOVEICULO_VISTAS_EXCLUIR,
  )
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ModeloVeiculo> {
    return this.modeloService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar modelo de veículo' })
  @ApiResponse({ status: 200, type: ModeloVeiculo })
  @Permissions(Permission.MODELOVEICULO_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateModeloVeiculoDto,
  ): Promise<ModeloVeiculo> {
    return this.modeloService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir modelo de veículo' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.MODELOVEICULO_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.modeloService.remove(id);
  }
}
