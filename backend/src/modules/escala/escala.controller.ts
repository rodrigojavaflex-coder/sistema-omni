import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { EscalaService } from './escala.service';

@ApiTags('controle-escala')
@Controller('controle-escala')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class EscalaController {
  constructor(private readonly escalaService: EscalaService) {}

  @Get('painel')
  @Permissions(Permission.CONTROLE_ESCALA_READ)
  @ApiOperation({
    summary: 'Painel de controle de escala e liberação do dia',
  })
  @ApiQuery({ name: 'data', required: true, example: '2026-10-29' })
  listarPainel(@Query('data') data: string) {
    return this.escalaService.listarPainel(data);
  }

  @Post('sync/escala')
  @Permissions(Permission.CONTROLE_ESCALA_SYNC)
  @ApiOperation({ summary: 'Sincronizar escala INFOBUS (KM detalhado) do dia' })
  @ApiQuery({ name: 'data', required: true, example: '2026-10-29' })
  syncEscala(@Query('data') data: string) {
    return this.escalaService.sincronizarEscala(data);
  }

  @Post('sync/telemetria')
  @Permissions(Permission.CONTROLE_ESCALA_SYNC)
  @ApiOperation({ summary: 'Sincronizar telemetria BRT (tempo_real)' })
  @ApiQuery({ name: 'idEmpresa', required: false })
  syncTelemetria(@Query('idEmpresa') idEmpresa?: string) {
    return this.escalaService.sincronizarTelemetria(idEmpresa);
  }
}
