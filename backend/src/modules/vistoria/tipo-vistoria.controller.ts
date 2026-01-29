import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { TipoVistoriaService } from './tipo-vistoria.service';
import { CreateTipoVistoriaDto } from './dto/create-tipo-vistoria.dto';
import { UpdateTipoVistoriaDto } from './dto/update-tipo-vistoria.dto';

@ApiTags('tiposvistoria')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('tiposvistoria')
export class TipoVistoriaController {
  constructor(private readonly tipoVistoriaService: TipoVistoriaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar tipo de vistoria' })
  @Permissions(Permission.TIPOVISTORIA_CREATE)
  create(@Body() dto: CreateTipoVistoriaDto) {
    return this.tipoVistoriaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de vistoria' })
  @Permissions(
    Permission.TIPOVISTORIA_READ,
    Permission.VISTORIA_WEB_READ,
    Permission.VISTORIA_READ,
  )
  findAll() {
    return this.tipoVistoriaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tipo de vistoria por id' })
  @Permissions(
    Permission.TIPOVISTORIA_READ,
    Permission.VISTORIA_WEB_READ,
    Permission.VISTORIA_READ,
  )
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tipoVistoriaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tipo de vistoria' })
  @Permissions(Permission.TIPOVISTORIA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTipoVistoriaDto,
  ) {
    return this.tipoVistoriaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir tipo de vistoria' })
  @Permissions(Permission.TIPOVISTORIA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tipoVistoriaService.remove(id);
  }
}
