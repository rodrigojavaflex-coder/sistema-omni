import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AreaVistoriada } from './entities/area-vistoriada.entity';
import { AreaComponente } from './entities/area-componente.entity';
import { AreaVistoriadaService } from './area-vistoriada.service';
import { AreaComponenteService } from './area-componente.service';
import { CreateAreaVistoriadaDto } from './dto/create-area-vistoriada.dto';
import { UpdateAreaVistoriadaDto } from './dto/update-area-vistoriada.dto';
import { SetAreaComponentesDto } from './dto/set-area-componentes.dto';

@ApiTags('areas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('areas')
export class AreasVistoriadasController {
  constructor(
    private readonly areaService: AreaVistoriadaService,
    private readonly areaComponenteService: AreaComponenteService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar área vistoriada' })
  @ApiResponse({ status: 201, type: AreaVistoriada })
  @Permissions(Permission.AREAVISTORIADA_CREATE)
  create(@Body() dto: CreateAreaVistoriadaDto): Promise<AreaVistoriada> {
    return this.areaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar áreas vistoriadas' })
  @ApiResponse({ status: 200, type: [AreaVistoriada] })
  @Permissions(Permission.AREAVISTORIADA_READ, Permission.VISTORIA_READ)
  findAll(
    @Query('idmodelo') idmodelo?: string,
    @Query('ativo') ativo?: string,
  ): Promise<AreaVistoriada[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.areaService.findAll(idmodelo, ativoParsed);
  }

  @Get('componentes-com-vinculo')
  @ApiOperation({ summary: 'Listar componentes com área vinculada (para modal vincular)' })
  @ApiResponse({ status: 200 })
  @Permissions(Permission.AREAVISTORIADA_READ, Permission.AREAVISTORIADA_VINCULAR_COMPONENTE)
  getComponentesWithArea(): Promise<
    Array<{ id: string; nome: string; ativo: boolean; idArea: string | null; nomeArea: string | null }>
  > {
    return this.areaComponenteService.listComponentesWithArea();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar área por id' })
  @ApiResponse({ status: 200, type: AreaVistoriada })
  @Permissions(Permission.AREAVISTORIADA_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<AreaVistoriada> {
    return this.areaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar área vistoriada' })
  @ApiResponse({ status: 200, type: AreaVistoriada })
  @Permissions(Permission.AREAVISTORIADA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAreaVistoriadaDto,
  ): Promise<AreaVistoriada> {
    return this.areaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir área vistoriada' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.AREAVISTORIADA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.areaService.remove(id);
  }

  @Get(':id/componentes')
  @ApiOperation({ summary: 'Listar componentes da área' })
  @ApiResponse({ status: 200, type: [AreaComponente] })
  @Permissions(Permission.AREAVISTORIADA_READ, Permission.VISTORIA_READ)
  listComponentes(@Param('id', new ParseUUIDPipe()) id: string): Promise<AreaComponente[]> {
    return this.areaComponenteService.listByArea(id);
  }

  @Put(':id/componentes')
  @ApiOperation({ summary: 'Definir componentes da área' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.AREAVISTORIADA_UPDATE, Permission.AREAVISTORIADA_REMOVER_COMPONENTE, Permission.AREAVISTORIADA_VINCULAR_COMPONENTE)
  async setComponentes(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: SetAreaComponentesDto,
  ): Promise<void> {
    await this.areaComponenteService.setByArea(id, dto);
  }
}
