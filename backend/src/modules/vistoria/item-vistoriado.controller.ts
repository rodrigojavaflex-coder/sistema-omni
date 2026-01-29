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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { ItemVistoriadoService } from './item-vistoriado.service';
import { CreateItemVistoriadoDto } from './dto/create-item-vistoriado.dto';
import { UpdateItemVistoriadoDto } from './dto/update-item-vistoriado.dto';

@ApiTags('itensvistoriados')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('itensvistoriados')
export class ItemVistoriadoController {
  constructor(private readonly itemService: ItemVistoriadoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar item vistoriado' })
  @Permissions(Permission.ITEMVISTORIADO_CREATE)
  create(@Body() dto: CreateItemVistoriadoDto) {
    return this.itemService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar itens vistoriados' })
  @Permissions(Permission.ITEMVISTORIADO_READ, Permission.VISTORIA_READ)
  findAll(
    @Query('tipovistoria') tipovistoria?: string,
    @Query('ativo') ativo?: string,
  ) {
    const ativoParsed =
      ativo === undefined ? undefined : ativo === 'true' || ativo === '1';
    return this.itemService.findAll(tipovistoria, ativoParsed);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar item vistoriado por id' })
  @Permissions(Permission.ITEMVISTORIADO_READ, Permission.VISTORIA_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar item vistoriado' })
  @Permissions(Permission.ITEMVISTORIADO_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateItemVistoriadoDto,
  ) {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir item vistoriado' })
  @Permissions(Permission.ITEMVISTORIADO_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.itemService.remove(id);
  }
}
