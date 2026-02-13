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
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';
import { CategoriaOcorrenciaService } from './categoria-ocorrencia.service';
import { CreateCategoriaOcorrenciaDto } from './dto/create-categoria-ocorrencia.dto';
import { UpdateCategoriaOcorrenciaDto } from './dto/update-categoria-ocorrencia.dto';

@Controller('categorias-ocorrencia')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class CategoriaOcorrenciaController {
  constructor(private readonly service: CategoriaOcorrenciaService) {}

  @Post()
  @Permissions(Permission.CATEGORIAOCORRENCIA_CREATE)
  create(@Body() dto: CreateCategoriaOcorrenciaDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions(Permission.CATEGORIAOCORRENCIA_READ)
  findAll(@Query('origem') origem?: string) {
    return this.service.findAll(origem);
  }

  @Get(':id')
  @Permissions(Permission.CATEGORIAOCORRENCIA_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.CATEGORIAOCORRENCIA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoriaOcorrenciaDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions(Permission.CATEGORIAOCORRENCIA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
