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
import { IndicadorExecucaoService } from './indicador-execucao.service';
import { CreateIndicadorExecucaoDto } from './dto/create-indicador-execucao.dto';
import { UpdateIndicadorExecucaoDto } from './dto/update-indicador-execucao.dto';
import { AuditLog } from '../../common/interceptors/auditoria.interceptor';
import { AuditAction } from '../../common/enums/auditoria.enum';

type AuthenticatedRequest = Request & { user?: { id: string } };

@ApiTags('indicadores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('indicadores/:indicadorId/execucoes')
export class IndicadorExecucaoController {
  constructor(
    private readonly indicadorExecucaoService: IndicadorExecucaoService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar execuções de um indicador' })
  @Permissions(Permission.INDICADOR_EXECUCAO_READ)
  findAll(
    @Req() req: AuthenticatedRequest,
    @Param('indicadorId') indicadorId: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.indicadorExecucaoService.findAll(userId, indicadorId);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar execução do indicador' })
  @Permissions(Permission.INDICADOR_EXECUCAO_CREATE)
  @AuditLog(AuditAction.CREATE, 'indicador_execucoes')
  create(
    @Req() req: AuthenticatedRequest,
    @Param('indicadorId') indicadorId: string,
    @Body() dto: CreateIndicadorExecucaoDto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.indicadorExecucaoService.create(userId, indicadorId, dto);
  }

  @Patch(':execucaoId')
  @ApiOperation({ summary: 'Atualizar execução do indicador' })
  @Permissions(Permission.INDICADOR_EXECUCAO_UPDATE)
  @AuditLog(AuditAction.UPDATE, 'indicador_execucoes')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('indicadorId') indicadorId: string,
    @Param('execucaoId') execucaoId: string,
    @Body() dto: UpdateIndicadorExecucaoDto,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.indicadorExecucaoService.update(
      userId,
      indicadorId,
      execucaoId,
      dto,
    );
  }

  @Delete(':execucaoId')
  @ApiOperation({ summary: 'Excluir execução do indicador' })
  @Permissions(Permission.INDICADOR_EXECUCAO_DELETE)
  @AuditLog(AuditAction.DELETE, 'indicador_execucoes')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('indicadorId') indicadorId: string,
    @Param('execucaoId') execucaoId: string,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }
    return this.indicadorExecucaoService.remove(
      userId,
      indicadorId,
      execucaoId,
    );
  }
}
