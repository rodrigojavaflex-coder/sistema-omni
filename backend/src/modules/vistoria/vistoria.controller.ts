import {
  Body,
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { Vistoria } from './entities/vistoria.entity';
import { VistoriaService } from './vistoria.service';
import { CreateVistoriaDto } from './dto/create-vistoria.dto';
import { FinalizeVistoriaDto } from './dto/finalize-vistoria.dto';
import { UpdateVistoriaDto } from './dto/update-vistoria.dto';
import { CreateIrregularidadeDto } from './dto/create-irregularidade.dto';
import { IrregularidadeResumoDto } from './dto/irregularidade-resumo.dto';
import { IrregularidadeImagemResumoDto } from './dto/irregularidade-imagem-resumo.dto';
import { IrregularidadeService } from './irregularidade.service';

@ApiTags('vistorias')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('vistoria')
export class VistoriaController {
  constructor(
    private readonly vistoriaService: VistoriaService,
    private readonly irregularidadeService: IrregularidadeService,
  ) {}

  @Post()
  @Permissions(Permission.VISTORIA_CREATE)
  @ApiOperation({ summary: 'Iniciar vistoria' })
  @ApiResponse({ status: 201, description: 'Vistoria criada', type: Vistoria })
  create(@Body() dto: CreateVistoriaDto): Promise<Vistoria> {
    return this.vistoriaService.create(dto);
  }

  @Post(':id/irregularidades')
  @Permissions(Permission.VISTORIA_UPDATE)
  @ApiOperation({ summary: 'Registrar irregularidade' })
  @ApiResponse({
    status: 201,
    description: 'Irregularidade registrada',
  })
  addIrregularidade(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateIrregularidadeDto,
  ) {
    return this.irregularidadeService.create(id, dto);
  }

  @Get(':id/irregularidades')
  @Permissions(Permission.VISTORIA_READ, Permission.VISTORIA_WEB_READ)
  @ApiOperation({ summary: 'Listar irregularidades da vistoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de irregularidades',
    type: [IrregularidadeResumoDto],
  })
  listIrregularidades(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IrregularidadeResumoDto[]> {
    return this.irregularidadeService.listByVistoria(id);
  }

  @Get(':id/irregularidades/imagens')
  @Permissions(Permission.VISTORIA_READ, Permission.VISTORIA_WEB_READ)
  @ApiOperation({ summary: 'Listar imagens das irregularidades da vistoria' })
  @ApiResponse({
    status: 200,
    description: 'Lista de imagens por irregularidade',
    type: [IrregularidadeImagemResumoDto],
  })
  listIrregularidadesImages(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IrregularidadeImagemResumoDto[]> {
    return this.irregularidadeService.listImages(id);
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

  @Patch(':id')
  @Permissions(Permission.VISTORIA_UPDATE)
  @ApiOperation({ summary: 'Atualizar dados iniciais da vistoria' })
  @ApiResponse({ status: 200, description: 'Vistoria atualizada', type: Vistoria })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateVistoriaDto,
  ): Promise<Vistoria> {
    return this.vistoriaService.update(id, dto);
  }

  @Get('veiculo/:id/ultimo-odometro')
  @Permissions(Permission.VISTORIA_READ, Permission.VISTORIA_WEB_READ)
  @ApiOperation({ summary: 'Buscar último odômetro por veículo' })
  @ApiResponse({ status: 200, description: 'Último odômetro encontrado' })
  findUltimoOdometro(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('ignorarVistoriaId') ignorarVistoriaId?: string,
  ): Promise<{ odometro: number; datavistoria: string } | null> {
    return this.vistoriaService.getUltimoOdometro(id, ignorarVistoriaId);
  }

  @Get(':id')
  @Permissions(Permission.VISTORIA_READ, Permission.VISTORIA_WEB_READ)
  @ApiOperation({ summary: 'Buscar vistoria por id' })
  @ApiResponse({ status: 200, description: 'Vistoria encontrada', type: Vistoria })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Vistoria> {
    return this.vistoriaService.findOne(id);
  }

  @Get()
  @Permissions(Permission.VISTORIA_READ, Permission.VISTORIA_WEB_READ)
  @ApiOperation({ summary: 'Listar vistorias (com filtro de status)' })
  @ApiResponse({ status: 200, description: 'Lista de vistorias', type: [Vistoria] })
  findAll(
    @Query('status') status?: StatusVistoria,
    @Query('idusuario') idusuario?: string,
    @Query('ignorarVistoriaId') ignorarVistoriaId?: string,
  ): Promise<Vistoria[]> {
    return this.vistoriaService.findAll(status, idusuario, ignorarVistoriaId);
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
