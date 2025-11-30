import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MetaService } from './meta.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@ApiTags('metas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('metas')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar meta' })
  @Permissions(Permission.META_CREATE)
  create(@Req() req: any, @Body() dto: CreateMetaDto) {
    return this.metaService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar metas do usuário' })
  @Permissions(Permission.META_READ)
  findAll(@Req() req: any) {
    return this.metaService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar meta por id' })
  @Permissions(Permission.META_READ)
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.metaService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar meta' })
  @Permissions(Permission.META_UPDATE)
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMetaDto) {
    return this.metaService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir meta' })
  @Permissions(Permission.META_DELETE)
  remove(@Req() req: any, @Param('id') id: string) {
    return this.metaService.remove(req.user.id, id);
  }
}
