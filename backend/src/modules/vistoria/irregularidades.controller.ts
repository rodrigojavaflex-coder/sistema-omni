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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { NaoProcedeIrregularidadeDto } from './dto/nao-procede-irregularidade.dto';
import { ValidacaoFinalIrregularidadeDto } from './dto/validacao-final-irregularidade.dto';
import { ReprovarValidacaoFinalIrregularidadeDto } from './dto/reprovar-validacao-final-irregularidade.dto';
import { IrregularidadeResumoDto } from './dto/irregularidade-resumo.dto';
import { IrregularidadeHistoricoDto } from './dto/irregularidade-historico.dto';

@ApiTags('irregularidades')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('irregularidades')
export class IrregularidadesController {
  constructor(private readonly irregularidadeService: IrregularidadeService) {}

  @Get()
  @ApiOperation({ summary: 'Listar irregularidades por status' })
  @ApiResponse({ status: 200, type: [IrregularidadeResumoDto] })
  @Permissions(
    Permission.IRREGULARIDADE_TRATAMENTO_READ,
    Permission.IRREGULARIDADE_MANUTENCAO_READ,
    Permission.IRREGULARIDADE_VALIDACAO_FINAL_READ,
  )
  findByStatus(
    @Query('status') status?: string,
    @Query('idVeiculo') idVeiculo?: string,
    @Query('gravidade') gravidade?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Req() req?: Request & { user?: { idEmpresa?: string } },
  ): Promise<IrregularidadeResumoDto[]> {
    const statuses = (status ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as StatusIrregularidade[];
    const gravidades = (gravidade ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as GravidadeCriticidade[];

    if (statuses.length === 0) {
      return this.irregularidadeService.listByStatus(
        [StatusIrregularidade.REGISTRADA],
        { idEmpresa: req?.user?.idEmpresa, scopeByEmpresa: false },
        { idVeiculo, gravidade: gravidades, dataInicio, dataFim },
      );
    }

    const requiresScope = statuses.some((s) =>
      [StatusIrregularidade.EM_MANUTENCAO, StatusIrregularidade.NAO_PROCEDE].includes(s),
    );
    return this.irregularidadeService.listByStatus(statuses, {
      idEmpresa: req?.user?.idEmpresa,
      scopeByEmpresa: requiresScope,
    }, { idVeiculo, gravidade: gravidades, dataInicio, dataFim });
  }

  @Get(':id/historico')
  @ApiOperation({ summary: 'Listar histórico da irregularidade' })
  @ApiResponse({ status: 200, type: [IrregularidadeHistoricoDto] })
  @Permissions(
    Permission.IRREGULARIDADE_TRATAMENTO_READ,
    Permission.IRREGULARIDADE_MANUTENCAO_READ,
    Permission.IRREGULARIDADE_VALIDACAO_FINAL_READ,
  )
  listHistorico(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<IrregularidadeHistoricoDto[]> {
    return this.irregularidadeService.listHistoricoByIrregularidade(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar irregularidade' })
  @ApiResponse({ status: 200, type: Irregularidade })
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
  @ApiOperation({ summary: 'Reprovar validação final e retornar para manutenção' })
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
  @Permissions(Permission.VISTORIA_UPDATE)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImages(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IrregularidadeMidia[]> {
    return this.irregularidadeService.uploadImages(id, files);
  }

  @Post(':id/audio')
  @ApiOperation({ summary: 'Enviar áudio da irregularidade (pode enviar múltiplos)' })
  @ApiResponse({ status: 201, type: IrregularidadeMidia })
  @Permissions(Permission.VISTORIA_UPDATE)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 15 * 1024 * 1024 },
    }),
  )
  uploadAudio(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('duracao_ms') duracaoMs?: string,
  ): Promise<IrregularidadeMidia> {
    const parsed = duracaoMs ? Number(duracaoMs) : undefined;
    return this.irregularidadeService.uploadAudio(id, file, parsed);
  }

  @Delete(':id/audio')
  @ApiOperation({ summary: 'Remover todos os áudios da irregularidade' })
  @ApiResponse({ status: 200 })
  @Permissions(Permission.VISTORIA_UPDATE)
  removeAudio(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.irregularidadeService.removeAudio(id);
  }

  @Delete(':id/midias/:midiaId')
  @ApiOperation({ summary: 'Remover mídia por id' })
  @ApiResponse({ status: 204 })
  @Permissions(Permission.VISTORIA_UPDATE)
  removeMidia(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('midiaId', new ParseUUIDPipe()) midiaId: string,
  ): Promise<void> {
    return this.irregularidadeService.removeMidia(midiaId);
  }
}
