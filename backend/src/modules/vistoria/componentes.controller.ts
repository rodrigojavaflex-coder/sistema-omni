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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { Componente } from './entities/componente.entity';
import { ComponenteService } from './componente.service';
import { CreateComponenteDto } from './dto/create-componente.dto';
import { UpdateComponenteDto } from './dto/update-componente.dto';

@ApiTags('componentes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('componentes')
export class ComponentesController {
  constructor(private readonly componenteService: ComponenteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar componente' })
  @ApiResponse({ status: 201, type: Componente })
  @Permissions(Permission.COMPONENTE_CREATE)
  create(@Body() dto: CreateComponenteDto): Promise<Componente> {
    return this.componenteService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar componentes' })
  @ApiResponse({ status: 200, type: [Componente] })
  @Permissions(Permission.COMPONENTE_READ, Permission.VISTORIA_READ)
  findAll(@Query('ativo') ativo?: string): Promise<Componente[]> {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.componenteService.findAll(ativoParsed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar componente por id' })
  @ApiResponse({ status: 200, type: Componente })
  @Permissions(Permission.COMPONENTE_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Componente> {
    return this.componenteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar componente' })
  @ApiResponse({ status: 200, type: Componente })
  @Permissions(Permission.COMPONENTE_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateComponenteDto,
  ): Promise<Componente> {
    return this.componenteService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir componente' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.COMPONENTE_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.componenteService.remove(id);
  }
}
