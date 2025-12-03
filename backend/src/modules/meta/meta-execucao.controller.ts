import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { MetaExecucaoService } from './meta-execucao.service';
import { CreateMetaExecucaoDto } from './dto/create-meta-execucao.dto';
import { UpdateMetaExecucaoDto } from './dto/update-meta-execucao.dto';
import { AuditLog } from '../../common/interceptors/auditoria.interceptor';
import { AuditAction } from '../../common/enums/auditoria.enum';

type AuthenticatedRequest = Request & { user?: { id: string } };

@ApiTags('metas')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('metas/:metaId/execucoes')
export class MetaExecucaoController {
  constructor(private readonly metaExecucaoService: MetaExecucaoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar execuções de uma meta' })
  @Permissions(Permission.META_EXECUCAO_READ)
  findAll(@Req() req: AuthenticatedRequest, @Param('metaId') metaId: string) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.metaExecucaoService.findAll(userId, metaId);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar execução da meta' })
  @Permissions(Permission.META_EXECUCAO_CREATE)
  @AuditLog(AuditAction.CREATE, 'meta_execucoes')
  create(
    @Req() req: AuthenticatedRequest,
    @Param('metaId') metaId: string,
    @Body() dto: CreateMetaExecucaoDto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.metaExecucaoService.create(userId, metaId, dto);
  }

  @Patch(':execucaoId')
  @ApiOperation({ summary: 'Atualizar execução da meta' })
  @Permissions(Permission.META_EXECUCAO_UPDATE)
  @AuditLog(AuditAction.UPDATE, 'meta_execucoes')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('metaId') metaId: string,
    @Param('execucaoId') execucaoId: string,
    @Body() dto: UpdateMetaExecucaoDto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.metaExecucaoService.update(userId, metaId, execucaoId, dto);
  }

  @Delete(':execucaoId')
  @ApiOperation({ summary: 'Excluir execução da meta' })
  @Permissions(Permission.META_EXECUCAO_DELETE)
  @AuditLog(AuditAction.DELETE, 'meta_execucoes')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('metaId') metaId: string,
    @Param('execucaoId') execucaoId: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.metaExecucaoService.remove(userId, metaId, execucaoId);
  }
}
