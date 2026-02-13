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
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';
import { OrigemOcorrenciaService } from './origem-ocorrencia.service';
import { CreateOrigemOcorrenciaDto } from './dto/create-origem-ocorrencia.dto';
import { UpdateOrigemOcorrenciaDto } from './dto/update-origem-ocorrencia.dto';

@Controller('origens-ocorrencia')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class OrigemOcorrenciaController {
  constructor(private readonly service: OrigemOcorrenciaService) {}

  @Post()
  @Permissions(Permission.ORIGEMOCORRENCIA_CREATE)
  create(@Body() dto: CreateOrigemOcorrenciaDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions(Permission.ORIGEMOCORRENCIA_READ)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions(Permission.ORIGEMOCORRENCIA_READ)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.ORIGEMOCORRENCIA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrigemOcorrenciaDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions(Permission.ORIGEMOCORRENCIA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
