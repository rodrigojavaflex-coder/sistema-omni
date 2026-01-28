import {
  Body,
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { Vistoria } from './entities/vistoria.entity';
import { ChecklistVistoria } from './entities/checklist-vistoria.entity';
import { ImagensVistoria } from './entities/imagens-vistoria.entity';
import { VistoriaService } from './vistoria.service';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { FinalizeVistoriaDto } from './dto/finalize-vistoria.dto';
import { ChecklistItemResumoDto } from './dto/checklist-item-resumo.dto';
import { ChecklistImagemResumoDto } from './dto/checklist-imagem-resumo.dto';

@ApiTags('vistorias')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('vistoria')
export class VistoriaController {
  constructor(private readonly vistoriaService: VistoriaService) {}

  @Post()
  @Permissions(Permission.VISTORIA_CREATE)
  @ApiOperation({ summary: 'Iniciar vistoria' })
  @ApiResponse({ status: 201, description: 'Vistoria criada', type: Vistoria })
  create(@Body() dto: CreateVistoriaDto): Promise<Vistoria> {
    return this.vistoriaService.create(dto);
  }

  @Post(':id/checklist')
  @Permissions(Permission.VISTORIA_UPDATE)
  @ApiOperation({ summary: 'Registrar item do checklist' })
  @ApiResponse({
    status: 201,
    description: 'Item de checklist registrado',
    type: ChecklistVistoria,
  })
  addChecklistItem(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateChecklistItemDto,
  ): Promise<ChecklistVistoria> {
    return this.vistoriaService.addChecklistItem(id, dto);
  }

  @Get(':id/checklist')
  @Permissions(Permission.VISTORIA_READ)
  @ApiOperation({ summary: 'Listar itens salvos do checklist' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens do checklist',
    type: [ChecklistItemResumoDto],
  })
  listChecklist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ChecklistItemResumoDto[]> {
    return this.vistoriaService.listChecklist(id);
  }

  @Get(':id/checklist/imagens')
  @Permissions(Permission.VISTORIA_READ)
  @ApiOperation({ summary: 'Listar imagens do checklist da vistoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imagens por item',
    type: [ChecklistImagemResumoDto],
  })
  listChecklistImages(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ChecklistImagemResumoDto[]> {
    return this.vistoriaService.listChecklistImages(id);
  }

  @Post(':id/checklist/:checklistId/imagens')
  @Permissions(Permission.VISTORIA_UPDATE)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiOperation({ summary: 'Enviar imagens do checklist (multipart)' })
  @ApiResponse({
    status: 201,
    description: 'Imagens cadastradas',
    type: [ImagensVistoria],
  })
  uploadChecklistImages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('checklistId', new ParseUUIDPipe()) checklistId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ImagensVistoria[]> {
    return this.vistoriaService.uploadChecklistImages(id, checklistId, files);
  }

  @Post(':id/finalizar')
  @Permissions(Permission.VISTORIA_UPDATE)
  @ApiOperation({ summary: 'Finalizar vistoria' })
  @ApiResponse({ status: 200, description: 'Vistoria finalizada', type: Vistoria })
  finalize(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: FinalizeVistoriaDto,
  ): Promise<Vistoria> {
    return this.vistoriaService.finalize(id, dto);
  }

  @Get(':id')
  @Permissions(Permission.VISTORIA_READ)
  @ApiOperation({ summary: 'Buscar vistoria por id' })
  @ApiResponse({ status: 200, description: 'Vistoria encontrada', type: Vistoria })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Vistoria> {
    return this.vistoriaService.findOne(id);
  }

  @Get()
  @Permissions(Permission.VISTORIA_READ)
  @ApiOperation({ summary: 'Listar vistorias (com filtro de status)' })
  @ApiResponse({ status: 200, description: 'Lista de vistorias', type: [Vistoria] })
  findAll(
    @Query('status') status?: StatusVistoria,
    @Query('idusuario') idusuario?: string,
  ): Promise<Vistoria[]> {
    return this.vistoriaService.findAll(status, idusuario);
  }

  @Post(':id/cancelar')
  @Permissions(Permission.VISTORIA_UPDATE)
  @ApiOperation({ summary: 'Cancelar vistoria' })
  @ApiResponse({ status: 200, description: 'Vistoria cancelada', type: Vistoria })
  cancel(@Param('id', new ParseUUIDPipe()) id: string): Promise<Vistoria> {
    return this.vistoriaService.cancel(id);
  }

  @Post(':id/retomar')
  @Permissions(Permission.VISTORIA_UPDATE)
  @ApiOperation({ summary: 'Retomar vistoria' })
  @ApiResponse({ status: 200, description: 'Vistoria retomada', type: Vistoria })
  retomar(@Param('id', new ParseUUIDPipe()) id: string): Promise<Vistoria> {
    return this.vistoriaService.retomar(id);
  }
}
