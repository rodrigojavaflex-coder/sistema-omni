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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { collectUserPermissions } from '../../common/utils/irregularidade-permissions.util';
import { AuditoriaInterceptor } from '../../common/interceptors/auditoria.interceptor';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { EmpresaTerceiraService } from './empresa-terceira.service';
import { CreateEmpresaTerceiraDto } from './dto/create-empresa-terceira.dto';
import { UpdateEmpresaTerceiraDto } from './dto/update-empresa-terceira.dto';

type AuthenticatedRequest = Request & { user?: Usuario };

@Controller('empresas-terceiras')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@UseInterceptors(AuditoriaInterceptor)
export class EmpresaTerceiraController {
  constructor(private readonly service: EmpresaTerceiraService) {}

  private includeIntegracaoConfig(req: AuthenticatedRequest): boolean {
    const permissions = collectUserPermissions(req.user?.perfis);
    return permissions.has(
      Permission.EMPRESATERCIRA_INTEGRACAO_CONFIG.toLowerCase(),
    );
  }

  @Post()
  @Permissions(Permission.EMPRESATERCIRA_CREATE)
  create(
    @Body() dto: CreateEmpresaTerceiraDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.create(dto, {
      includeIntegracaoConfig: this.includeIntegracaoConfig(req),
    });
  }

  @Get()
  @Permissions(
    Permission.EMPRESATERCIRA_READ,
    Permission.OCORRENCIA_READ,
    Permission.OCORRENCIA_CREATE,
  )
  findAll(
    @Query('manutencao') manutencao?: string,
    @Req() req?: AuthenticatedRequest,
  ) {
    const onlyManutencao = ['true', '1', 'sim', 'yes'].includes(
      (manutencao ?? '').toLowerCase(),
    );
    return this.service.findAll(onlyManutencao, {
      includeIntegracaoConfig: req
        ? this.includeIntegracaoConfig(req)
        : false,
    });
  }

  @Get(':id')
  @Permissions(
    Permission.EMPRESATERCIRA_READ,
    Permission.OCORRENCIA_READ,
    Permission.OCORRENCIA_CREATE,
  )
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.findOne(id, {
      includeIntegracaoConfig: this.includeIntegracaoConfig(req),
    });
  }

  @Patch(':id')
  @Permissions(Permission.EMPRESATERCIRA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateEmpresaTerceiraDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.update(id, dto, {
      includeIntegracaoConfig: this.includeIntegracaoConfig(req),
    });
  }

  @Delete(':id')
  @Permissions(Permission.EMPRESATERCIRA_DELETE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
