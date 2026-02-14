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
import { EmpresaTerceiraService } from './empresa-terceira.service';
import { CreateEmpresaTerceiraDto } from './dto/create-empresa-terceira.dto';
import { UpdateEmpresaTerceiraDto } from './dto/update-empresa-terceira.dto';

@Controller('empresas-terceiras')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class EmpresaTerceiraController {
  constructor(private readonly service: EmpresaTerceiraService) {}

  @Post()
  @Permissions(Permission.EMPRESATERCIRA_CREATE)
  create(@Body() dto: CreateEmpresaTerceiraDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions(Permission.EMPRESATERCIRA_READ, Permission.OCORRENCIA_READ, Permission.OCORRENCIA_CREATE)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Permissions(Permission.EMPRESATERCIRA_READ, Permission.OCORRENCIA_READ, Permission.OCORRENCIA_CREATE)
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions(Permission.EMPRESATERCIRA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEmpresaTerceiraDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions(Permission.EMPRESATERCIRA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
