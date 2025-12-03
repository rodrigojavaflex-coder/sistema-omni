import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';
import { DepartamentoService } from './departamento.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { UpdateDepartamentoDto } from './dto/update-departamento.dto';

@ApiTags('departamentos')
@Controller('departamentos')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class DepartamentoController {
  constructor(private readonly departamentoService: DepartamentoService) {}

  @Post()
  @Permissions(Permission.DEPARTAMENTO_CREATE)
  @ApiOperation({ summary: 'Criar departamento' })
  @ApiResponse({ status: 201, description: 'Departamento criado' })
  create(@Body() dto: CreateDepartamentoDto) {
    return this.departamentoService.create(dto);
  }

  @Get()
  @Permissions(Permission.DEPARTAMENTO_READ)
  @ApiOperation({ summary: 'Listar departamentos' })
  findAll(@Query('nome') nome?: string) {
    return this.departamentoService.findAll(nome);
  }

  @Get(':id')
  @Permissions(Permission.DEPARTAMENTO_READ)
  @ApiOperation({ summary: 'Buscar departamento por id' })
  findOne(@Param('id') id: string) {
    return this.departamentoService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.DEPARTAMENTO_UPDATE)
  @ApiOperation({ summary: 'Atualizar departamento' })
  update(@Param('id') id: string, @Body() dto: UpdateDepartamentoDto) {
    return this.departamentoService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(Permission.DEPARTAMENTO_DELETE)
  @ApiOperation({ summary: 'Excluir departamento' })
  remove(@Param('id') id: string) {
    return this.departamentoService.remove(id);
  }
}
