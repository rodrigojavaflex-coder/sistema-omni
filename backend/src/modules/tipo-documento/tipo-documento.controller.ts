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
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';
import { TipoDocumentoService } from './tipo-documento.service';
import { CreateTipoDocumentoDto } from './dto/create-tipo-documento.dto';
import { UpdateTipoDocumentoDto } from './dto/update-tipo-documento.dto';

@ApiTags('tipos-documento')
@Controller('tipos-documento')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class TipoDocumentoController {
  constructor(private readonly tipoDocumentoService: TipoDocumentoService) {}

  @Post()
  @Permissions(Permission.TIPO_DOCUMENTO_CREATE)
  @ApiOperation({ summary: 'Criar tipo de documento' })
  @ApiResponse({ status: 201, description: 'Tipo criado' })
  create(@Body() dto: CreateTipoDocumentoDto) {
    return this.tipoDocumentoService.create(dto);
  }

  @Get()
  @Permissions(
    Permission.TIPO_DOCUMENTO_READ,
    Permission.DOCUMENTO_READ,
    Permission.DOCUMENTO_CREATE,
    Permission.DOCUMENTO_UPDATE,
  )
  @ApiOperation({ summary: 'Listar tipos de documento' })
  findAll(
    @Query('nome') nome?: string,
    @Query('apenasAtivos') apenasAtivos?: string,
  ) {
    return this.tipoDocumentoService.findAll(
      nome,
      apenasAtivos === 'true' || apenasAtivos === '1',
    );
  }

  @Get(':id')
  @Permissions(Permission.TIPO_DOCUMENTO_READ, Permission.DOCUMENTO_READ)
  @ApiOperation({ summary: 'Buscar tipo de documento por id' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tipoDocumentoService.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.TIPO_DOCUMENTO_UPDATE)
  @ApiOperation({ summary: 'Atualizar tipo de documento' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTipoDocumentoDto,
  ) {
    return this.tipoDocumentoService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(Permission.TIPO_DOCUMENTO_DELETE)
  @ApiOperation({ summary: 'Excluir tipo de documento' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tipoDocumentoService.remove(id);
  }
}
