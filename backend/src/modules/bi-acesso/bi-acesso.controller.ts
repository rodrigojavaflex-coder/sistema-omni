import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { BiAcessoService } from './bi-acesso.service';
import { CreateBiAcessoLinkDto } from './dto/create-bi-acesso-link.dto';
import { UpdateBiAcessoLinkDto } from './dto/update-bi-acesso-link.dto';

@ApiTags('bi-acesso')
@ApiBearerAuth()
@Controller('bi-acesso-links')
export class BiAcessoController {
  constructor(private readonly biAcessoService: BiAcessoService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Permissions(Permission.BI_ACESSO_LINK_CREATE)
  @ApiOperation({ summary: 'Cadastrar link de BI' })
  create(@Body() dto: CreateBiAcessoLinkDto) {
    return this.biAcessoService.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @Permissions(Permission.BI_ACESSO_LINK_READ)
  @ApiOperation({ summary: 'Listar links de BI cadastrados' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Se true, inclui links inativos',
  })
  findAll(
    @Query('includeInactive', new ParseBoolPipe({ optional: true }))
    includeInactive?: boolean,
  ) {
    return this.biAcessoService.findAll(includeInactive ?? true);
  }

  @Get('my-menu')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Listar links de BI permitidos ao usuário logado' })
  async getMyMenu(@Req() req: any) {
    return this.biAcessoService.getMenuForUser(req?.user?.id);
  }

  @Get(':id/acesso')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Buscar URL de BI para visualização interna com validação de acesso',
  })
  getAccessibleLink(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return this.biAcessoService.getAccessibleLinkForUser(id, req?.user?.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @Permissions(Permission.BI_ACESSO_LINK_READ)
  @ApiOperation({ summary: 'Buscar link de BI por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.biAcessoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @Permissions(Permission.BI_ACESSO_LINK_UPDATE)
  @ApiOperation({ summary: 'Atualizar link de BI' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBiAcessoLinkDto,
  ) {
    return this.biAcessoService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @Permissions(Permission.BI_ACESSO_LINK_DELETE)
  @ApiOperation({ summary: 'Excluir link de BI' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.biAcessoService.remove(id);
  }
}
