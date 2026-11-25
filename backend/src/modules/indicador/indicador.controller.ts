import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IndicadorService } from './indicador.service';
import { CreateIndicadorDto } from './dto/create-indicador.dto';
import { UpdateIndicadorDto } from './dto/update-indicador.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@ApiTags('indicadores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('indicadores')
export class IndicadorController {
  constructor(private readonly indicadorService: IndicadorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar indicador' })
  @Permissions(Permission.INDICADOR_CREATE)
  create(@Req() req: { user: { id: string } }, @Body() dto: CreateIndicadorDto) {
    return this.indicadorService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar indicadores do usuário' })
  @Permissions(Permission.INDICADOR_READ)
  findAll(@Req() req: { user: { id: string } }) {
    return this.indicadorService.findAll(req.user.id);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Obter painel de indicadores do usuário' })
  @ApiQuery({ name: 'ano', required: false, type: Number })
  @Permissions(Permission.INDICADOR_READ, Permission.INDICADOR_EXECUCAO_READ)
  dashboard(
    @Req() req: { user: { id: string } },
    @Query('ano') ano?: string,
  ) {
    const anoNum = ano ? Number(ano) : undefined;
    return this.indicadorService.getDashboard(
      req.user.id,
      Number.isFinite(anoNum) ? anoNum : undefined,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar indicador por id' })
  @Permissions(Permission.INDICADOR_READ)
  findOne(@Req() req: { user: { id: string } }, @Param('id') id: string) {
    return this.indicadorService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar indicador' })
  @Permissions(Permission.INDICADOR_UPDATE)
  update(
    @Req() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateIndicadorDto,
  ) {
    return this.indicadorService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir indicador (somente sem lançamentos)' })
  @Permissions(Permission.INDICADOR_DELETE)
  remove(@Req() req: { user: { id: string } }, @Param('id') id: string) {
    return this.indicadorService.remove(req.user.id, id);
  }
}
