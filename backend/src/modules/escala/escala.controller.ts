import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { TrocarVeiculoEscalaDto } from './dto/trocar-veiculo-escala.dto';
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

  @Get('veiculo/:idVeiculo/os-retencao')
  @Permissions(Permission.CONTROLE_ESCALA_READ)
  @ApiOperation({
    summary:
      'Listar OS vermelhas que retêm o veículo (EM_MANUTENCAO ou CONCLUIDA)',
  })
  listarOsRetencao(
    @Param('idVeiculo', new ParseUUIDPipe()) idVeiculo: string,
  ) {
    return this.escalaService.listarOsRetencao(idVeiculo);
  }

  @Patch('escala-dia/:idEscalaDia/veiculo')
  @Permissions(Permission.CONTROLE_ESCALA_TROCAR_VEICULO)
  @ApiOperation({
    summary:
      'Trocar veículo OMNI da escala do dia (preservado em syncs posteriores)',
  })
  trocarVeiculo(
    @Param('idEscalaDia', new ParseUUIDPipe()) idEscalaDia: string,
    @Body() dto: TrocarVeiculoEscalaDto,
  ) {
    return this.escalaService.trocarVeiculoEscala(idEscalaDia, dto.idVeiculo);
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
  @ApiOperation({
    summary:
      'Sincronizar telemetria BRT (tempo_real). Opcional: filtrar por prefixo INFOBUS.',
  })
  @ApiQuery({ name: 'idEmpresa', required: false })
  @ApiQuery({
    name: 'prefixo',
    required: false,
    description: 'Prefixo/veiculo_id BRT para atualizar somente um veículo',
  })
  @ApiQuery({
    name: 'idVeiculo',
    required: false,
    description: 'ID OMNI a vincular na telemetria (ex.: substituição na escala)',
  })
  syncTelemetria(
    @Query('idEmpresa') idEmpresa?: string,
    @Query('prefixo') prefixo?: string,
    @Query('idVeiculo') idVeiculo?: string,
  ) {
    return this.escalaService.sincronizarTelemetria(idEmpresa, {
      prefixo,
      idVeiculo,
    });
  }
}
