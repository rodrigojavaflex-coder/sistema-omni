import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { GravidadeCriticidade } from '../../common/enums/gravidade-criticidade.enum';
import { Irregularidade } from './entities/irregularidade.entity';
import { IrregularidadeMidia } from './entities/irregularidade-midia.entity';
import { IrregularidadeService } from './irregularidade.service';
import { UpdateIrregularidadeDto } from './dto/update-irregularidade.dto';
import { ReclassificarIrregularidadeDto } from './dto/reclassificar-irregularidade.dto';
import { CancelarIrregularidadeDto } from './dto/cancelar-irregularidade.dto';
import { IniciarManutencaoIrregularidadeDto } from './dto/iniciar-manutencao-irregularidade.dto';
import { IniciarManutencaoLoteDto } from './dto/iniciar-manutencao-lote.dto';
import { NaoProcedeIrregularidadeDto } from './dto/nao-procede-irregularidade.dto';
import { ValidacaoFinalIrregularidadeDto } from './dto/validacao-final-irregularidade.dto';
import { ReprovarValidacaoFinalIrregularidadeDto } from './dto/reprovar-validacao-final-irregularidade.dto';
import { IrregularidadeResumoDto } from './dto/irregularidade-resumo.dto';
import { IrregularidadeHistoricoDto } from './dto/irregularidade-historico.dto';
import {
  RelatorioManutencaoExecucaoDto,
  RelatorioManutencaoPreviewDto,
} from './dto/relatorio-manutencao.dto';
import {
  assertUserHasAllPermissions,
  collectUserPermissions,
  getRequiredReadPermissionsForStatuses,
  IRREGULARIDADE_FLUXO_READ_PERMISSIONS,
} from '../../common/utils/irregularidade-permissions.util';
import { Usuario } from '../usuarios/entities/usuario.entity';

@ApiTags('irregularidades')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('irregularidades')
export class IrregularidadesController {
  constructor(private readonly irregularidadeService: IrregularidadeService) {}

  @Get()
  @ApiOperation({ summary: 'Listar irregularidades por status' })
  @ApiQuery({
    name: 'ordemServico',
    required: false,
    type: String,
    description:
      'Trecho do número da O.S. (numeroIrregularidade): busca parcial nos dígitos, ex.: 2026 corresponde a 202601, 202619, etc.',
  })
  @ApiResponse({ status: 200, type: [IrregularidadeResumoDto] })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão de leitura para a etapa consultada',
  })
  @Permissions(...IRREGULARIDADE_FLUXO_READ_PERMISSIONS)
  findByStatus(
    @Query('status') status?: string,
    @Query('idVeiculo') idVeiculo?: string,
    @Query('gravidade') gravidade?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('referenciaPeriodo') referenciaPeriodo?: string,
    @Query('ordemServico') ordemServico?: string,
    @Query('origemRegistro') origemRegistro?: string,
    @Req() req?: Request & { user?: Usuario },
  ): Promise<IrregularidadeResumoDto[]> {
    const statuses = (status ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as StatusIrregularidade[];

    const requiredReads = getRequiredReadPermissionsForStatuses(statuses);
    assertUserHasAllPermissions(
      collectUserPermissions(req?.user?.perfis),
      requiredReads,
    );
    const gravidades = (gravidade ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as GravidadeCriticidade[];

    const refPeriodo =
      referenciaPeriodo === 'ENTRADA_STATUS'
        ? ('ENTRADA_STATUS' as const)
        : ('CRIADO_EM' as const);

    const ordemServicoDigits = this.parseOrdemServicoQuery(ordemServico);
    const origemFiltro =
      origemRegistro === 'SOS_WEB'
        ? ('SOS_WEB' as const)
        : origemRegistro === 'MOBILE'
          ? ('MOBILE' as const)
          : undefined;

    const filtrosLista = {
      idVeiculo,
      gravidade: gravidades,
      dataInicio,
      dataFim,
      referenciaPeriodo: refPeriodo,
      ordemServico: ordemServicoDigits,
      origemRegistro: origemFiltro,
    };

    if (statuses.length === 0) {
      return this.irregularidadeService.listByStatus(
        [StatusIrregularidade.REGISTRADA],
        { idEmpresa: req?.user?.idEmpresa ?? undefined, scopeByEmpresa: false },
        filtrosLista,
      );
    }

    const requiresScope = statuses.some((s) =>
      [
        StatusIrregularidade.EM_MANUTENCAO,
        StatusIrregularidade.NAO_PROCEDE,
      ].includes(s),
    );
    return this.irregularidadeService.listByStatus(
      statuses,
      {
        idEmpresa: req?.user?.idEmpresa ?? undefined,
        scopeByEmpresa: requiresScope,
      },
      filtrosLista,
    );
  }

  /**
   * Extrai apenas dígitos da query para busca parcial na O.S. (substring em numero_irregularidade).
   */
  private parseOrdemServicoQuery(raw?: string): string | undefined {
    if (raw === undefined || raw === null) {
      return undefined;
    }
    const digits = String(raw).replace(/\D/g, '');
    return digits.length > 0 ? digits : undefined;
  }

  @Get(':id/historico')
  @ApiOperation({ summary: 'Listar histórico da irregularidade' })
  @ApiResponse({ status: 200, type: [IrregularidadeHistoricoDto] })
  @Permissions(...IRREGULARIDADE_FLUXO_READ_PERMISSIONS)
  listHistorico(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IrregularidadeHistoricoDto[]> {
    return this.irregularidadeService.listHistoricoByIrregularidade(id);
  }

  @Post('lote/iniciar-manutencao/preview')
  @ApiOperation({
    summary: 'Gerar preview do relatório de envio para manutenção',
  })
  @ApiResponse({ status: 200, type: RelatorioManutencaoPreviewDto })
  @Permissions(Permission.IRREGULARIDADE_MANUTENCAO_START)
  previewIniciarManutencaoLote(
    @Body() dto: IniciarManutencaoLoteDto,
    @Req() req: Request & { user?: { nome?: string } },
  ): Promise<RelatorioManutencaoPreviewDto> {
    return this.irregularidadeService.previewIniciarManutencaoLote(
      dto,
      req.user,
    );
  }

  @Post('lote/iniciar-manutencao/preview-pdf')
  @ApiOperation({
    summary: 'Gerar preview em PDF do relatório de envio para manutenção',
  })
  @ApiResponse({ status: 200, description: 'Arquivo PDF' })
  @Permissions(Permission.IRREGULARIDADE_MANUTENCAO_START)
  async previewPdfIniciarManutencaoLote(
    @Body() dto: IniciarManutencaoLoteDto,
    @Req() req: Request & { user?: { nome?: string } },
  ): Promise<StreamableFile> {
    const pdf =
      await this.irregularidadeService.previewPdfIniciarManutencaoLote(
        dto,
        req.user,
      );
    return new StreamableFile(pdf, {
      type: 'application/pdf',
      disposition: 'inline; filename="preview-relatorio-manutencao.pdf"',
    });
  }

  @Post('lote/iniciar-manutencao')
  @ApiOperation({
    summary:
      'Enviar irregularidades para manutenção em lote, com envio de e-mail e relatório anexo',
  })
  @ApiResponse({ status: 200, type: RelatorioManutencaoExecucaoDto })
  @Permissions(Permission.IRREGULARIDADE_MANUTENCAO_START)
  iniciarManutencaoLote(
    @Body() dto: IniciarManutencaoLoteDto,
    @Req()
    req: Request & {
      user?: { id?: string; idEmpresa?: string; nome?: string };
    },
  ): Promise<RelatorioManutencaoExecucaoDto> {
    return this.irregularidadeService.iniciarManutencaoLote(dto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos (ex.: descrição do problema obrigatória)',
  })
  @Permissions(Permission.VISTORIA_UPDATE)
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateIrregularidadeDto,
  ): Promise<Irregularidade> {
    return this.irregularidadeService.update(id, dto);
  }

  @Post(':id/reclassificar')
  @ApiOperation({ summary: 'Reclassificar irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_TRATAMENTO_UPDATE)
  reclassificar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ReclassificarIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.reclassificar(id, dto, req.user);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_TRATAMENTO_UPDATE)
  cancelar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CancelarIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.cancelar(id, dto, req.user);
  }

  @Post(':id/iniciar-manutencao')
  @ApiOperation({ summary: 'Enviar irregularidade para manutenção' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_MANUTENCAO_START)
  iniciarManutencao(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: IniciarManutencaoIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.iniciarManutencao(id, dto, req.user);
  }

  @Post(':id/concluir-manutencao')
  @ApiOperation({ summary: 'Concluir manutenção da irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_MANUTENCAO_FINISH)
  concluirManutencao(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ValidacaoFinalIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.concluirManutencao(id, dto, req.user);
  }

  @Post(':id/nao-procede')
  @ApiOperation({ summary: 'Marcar irregularidade como não procede' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_MANUTENCAO_MARK_NOT_PROCEEDING)
  naoProcede(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: NaoProcedeIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.marcarNaoProcede(id, dto, req.user);
  }

  @Post(':id/validar-final')
  @ApiOperation({ summary: 'Validar final irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_VALIDACAO_FINAL_UPDATE)
  validarFinal(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ValidacaoFinalIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.validarFinal(id, dto, req.user);
  }

  @Post(':id/reprovar-final')
  @ApiOperation({
    summary: 'Reprovar validação final e retornar para manutenção',
  })
  @ApiResponse({ status: 200, type: Irregularidade })
  @Permissions(Permission.IRREGULARIDADE_VALIDACAO_FINAL_UPDATE)
  reprovarFinal(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ReprovarValidacaoFinalIrregularidadeDto,
    @Req() req: Request & { user?: { id?: string; idEmpresa?: string } },
  ): Promise<Irregularidade> {
    return this.irregularidadeService.reprovarValidacaoFinal(id, dto, req.user);
  }

  @Post(':id/imagens')
  @ApiOperation({ summary: 'Enviar imagens da irregularidade' })
  @ApiResponse({ status: 201, type: [IrregularidadeMidia] })
  @Permissions(
    Permission.VISTORIA_UPDATE,
    Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS,
  )
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request & { user?: Usuario },
  ): Promise<IrregularidadeMidia[]> {
    const permissions = collectUserPermissions(req.user?.perfis);
    return this.irregularidadeService.uploadImages(id, files, permissions);
  }

  @Post(':id/audio')
  @ApiOperation({
    summary: 'Enviar áudio da irregularidade (pode enviar múltiplos)',
  })
  @ApiResponse({ status: 201, type: IrregularidadeMidia })
  @Permissions(
    Permission.VISTORIA_UPDATE,
    Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS,
  )
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  uploadAudio(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('duracao_ms') duracaoMs?: string,
    @Req() req?: Request & { user?: Usuario },
  ): Promise<IrregularidadeMidia> {
    const parsed = duracaoMs ? Number(duracaoMs) : undefined;
    const permissions = collectUserPermissions(req?.user?.perfis);
    return this.irregularidadeService.uploadAudio(id, file, parsed, permissions);
  }

  @Delete(':id/audio')
  @ApiOperation({ summary: 'Remover todos os áudios da irregularidade' })
  @ApiResponse({ status: 200 })
  @Permissions(
    Permission.VISTORIA_UPDATE,
    Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS,
  )
  removeAudio(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request & { user?: Usuario },
  ): Promise<void> {
    const permissions = collectUserPermissions(req.user?.perfis);
    return this.irregularidadeService.removeAudio(id, permissions);
  }

  @Delete(':id/midias/:midiaId')
  @ApiOperation({ summary: 'Remover mídia por id' })
  @ApiResponse({ status: 204 })
  @Permissions(
    Permission.VISTORIA_UPDATE,
    Permission.IRREGULARIDADE_TRATAMENTO_CREATE_SOS,
  )
  removeMidia(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('midiaId', new ParseUUIDPipe()) midiaId: string,
    @Req() req: Request & { user?: Usuario },
  ): Promise<void> {
    const permissions = collectUserPermissions(req.user?.perfis);
    return this.irregularidadeService.removeMidia(midiaId, permissions);
  }
}
