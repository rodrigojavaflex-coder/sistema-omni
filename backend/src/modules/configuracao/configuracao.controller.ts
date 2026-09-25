import {
  BadRequestException,
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ConfiguracaoService } from './configuracao.service';
import { CreateConfiguracaoDto } from './dto/create-configuracao.dto';
import { UpdateConfiguracaoDto } from './dto/update-configuracao.dto';
import { ErpApiKeyDto } from './dto/erp-api-key.dto';
import { LogoRelatorioDto } from './dto/logo-relatorio.dto';
import { MobileVersaoMinimaDto } from './dto/mobile-versao-minima.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const logoUploadInterceptor = FileInterceptor('logoRelatorio', {
  storage: memoryStorage(),
  limits: { fileSize: LOGO_MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    const mime = (file.mimetype || '').toLowerCase();
    const name = (file.originalname || '').toLowerCase();
    if (mime !== 'image/png' && !name.endsWith('.png')) {
      cb(
        new BadRequestException('Apenas arquivos .png são permitidos para a logo.'),
        false,
      );
      return;
    }
    cb(null, true);
  },
});

@ApiTags('configuracao')
@Controller('configuracao')
export class ConfiguracaoController {
  constructor(private readonly configuracaoService: ConfiguracaoService) {}

  private parseTempoFluxoConfig(raw: unknown) {
    if (!raw) {
      return undefined;
    }
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    }
    return raw;
  }

  private parseEmailEnvioConfig(raw: unknown) {
    if (!raw) {
      return undefined;
    }
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    }
    return raw;
  }

  private parseErpVistoriaConfig(raw: unknown) {
    if (!raw) {
      return undefined;
    }
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    }
    return raw;
  }

  private parseOdometroDiffMaxKm(raw: unknown): number | null | undefined {
    if (raw === undefined) {
      return undefined;
    }
    if (raw === null || raw === '') {
      return null;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      return null;
    }
    return Math.trunc(n);
  }

  private parseMobileVersaoMinima(raw: unknown): string | null | undefined {
    if (raw === undefined) {
      return undefined;
    }
    if (raw === null || raw === '') {
      return null;
    }
    return String(raw).trim();
  }

  @Post()
  @Permissions(Permission.CONFIGURACAO_ACCESS)
  @UseInterceptors(logoUploadInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateConfiguracaoDto })
  async create(
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    const body: CreateConfiguracaoDto = {
      nomeCliente: req.body.nomeCliente,
      auditarConsultas: req.body.auditarConsultas
        ? req.body.auditarConsultas === 'true'
        : true,
      auditarLoginLogOff: req.body.auditarLoginLogOff
        ? req.body.auditarLoginLogOff === 'true'
        : true,
      auditarCriacao: req.body.auditarCriacao
        ? req.body.auditarCriacao === 'true'
        : true,
      auditarAlteracao: req.body.auditarAlteracao
        ? req.body.auditarAlteracao === 'true'
        : true,
      auditarExclusao: req.body.auditarExclusao
        ? req.body.auditarExclusao === 'true'
        : true,
      auditarSenhaAlterada: req.body.auditarSenhaAlterada
        ? req.body.auditarSenhaAlterada === 'true'
        : true,
      tempoFluxoConfig: this.parseTempoFluxoConfig(req.body.tempoFluxoConfig),
      emailEnvioConfig: this.parseEmailEnvioConfig(req.body.emailEnvioConfig),
      erpVistoriaConfig: this.parseErpVistoriaConfig(req.body.erpVistoriaConfig),
      odometroDiffMaxKm: this.parseOdometroDiffMaxKm(
        req.body.odometroDiffMaxKm,
      ),
      mobileVersaoMinima: this.parseMobileVersaoMinima(
        req.body.mobileVersaoMinima,
      ),
    };

    return this.configuracaoService.create(body, req?.user?.id, file);
  }

  @Get()
  @Permissions(Permission.CONFIGURACAO_ACCESS)
  @ApiOperation({ summary: 'Buscar configuração' })
  async findOne() {
    return this.configuracaoService.findOne();
  }

  @Get('mobile-versao-minima')
  @ApiOperation({
    summary:
      'Versão mínima do app mobile (público — usado no boot/login do aplicativo)',
  })
  @ApiResponse({ status: 200, type: MobileVersaoMinimaDto })
  findMobileVersaoMinima(): Promise<MobileVersaoMinimaDto> {
    return this.configuracaoService.findMobileVersaoMinima();
  }

  @Delete('mobile-versoes/:version')
  @Permissions(Permission.CONFIGURACAO_ACCESS)
  @ApiOperation({
    summary: 'Remove uma versão do catálogo do app (aba App na Configuração)',
  })
  async removeMobileVersao(
    @Param('version') version: string,
    @Req() req?: { user?: { id?: string } },
  ) {
    return this.configuracaoService.removeMobileVersaoCatalogo(
      version,
      req?.user?.id,
    );
  }

  @Get('logo-relatorio')
  @Permissions(Permission.VISTORIA_WEB_READ, Permission.CONFIGURACAO_ACCESS)
  @ApiOperation({ summary: 'Obter logo do relatório (data URL a partir do banco)' })
  @ApiResponse({ status: 200, type: LogoRelatorioDto })
  findLogoRelatorio(): Promise<LogoRelatorioDto> {
    return this.configuracaoService.findLogoRelatorio();
  }

  @Get('erp-api-key')
  @Permissions(Permission.CONFIGURACAO_ACCESS)
  @ApiOperation({ summary: 'Obter API Key do ERP em claro (aba Integração ERP)' })
  @ApiResponse({ status: 200, type: ErpApiKeyDto })
  findErpApiKey(): Promise<ErpApiKeyDto> {
    return this.configuracaoService.findErpApiKey();
  }

  @Get('tempo-fluxo')
  @Permissions(Permission.CONFIGURACAO_TEMPO_FLUXO_ACCESS)
  @ApiOperation({ summary: 'Buscar configuração de tempo do fluxo' })
  async findTempoFluxo() {
    return this.configuracaoService.findTempoFluxoConfig();
  }

  @Put('tempo-fluxo')
  @Permissions(
    Permission.CONFIGURACAO_TEMPO_FLUXO_CREATE,
    Permission.CONFIGURACAO_TEMPO_FLUXO_UPDATE,
    Permission.CONFIGURACAO_TEMPO_FLUXO_DELETE,
  )
  @ApiOperation({ summary: 'Atualizar configuração de tempo do fluxo' })
  async updateTempoFluxo(
    @Body() body: { tempoFluxoConfig?: unknown },
    @Req() req?: any,
  ) {
    return this.configuracaoService.updateTempoFluxoConfig(
      body?.tempoFluxoConfig,
      req?.user?.id,
    );
  }

  @Put(':id')
  @Permissions(Permission.CONFIGURACAO_ACCESS)
  @UseInterceptors(logoUploadInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateConfiguracaoDto })
  async update(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Req() req?: any,
  ) {
    const previousConfig = await this.configuracaoService.findOne();
    req.previousUserData = previousConfig;

    const body: UpdateConfiguracaoDto = {
      nomeCliente: req.body.nomeCliente,
      auditarConsultas: req.body.auditarConsultas
        ? req.body.auditarConsultas === 'true'
        : undefined,
      auditarLoginLogOff: req.body.auditarLoginLogOff
        ? req.body.auditarLoginLogOff === 'true'
        : undefined,
      auditarCriacao: req.body.auditarCriacao
        ? req.body.auditarCriacao === 'true'
        : undefined,
      auditarAlteracao: req.body.auditarAlteracao
        ? req.body.auditarAlteracao === 'true'
        : undefined,
      auditarExclusao: req.body.auditarExclusao
        ? req.body.auditarExclusao === 'true'
        : undefined,
      auditarSenhaAlterada: req.body.auditarSenhaAlterada
        ? req.body.auditarSenhaAlterada === 'true'
        : undefined,
      tempoFluxoConfig: this.parseTempoFluxoConfig(req.body.tempoFluxoConfig),
      emailEnvioConfig: this.parseEmailEnvioConfig(req.body.emailEnvioConfig),
      erpVistoriaConfig: this.parseErpVistoriaConfig(req.body.erpVistoriaConfig),
      odometroDiffMaxKm: this.parseOdometroDiffMaxKm(
        req.body.odometroDiffMaxKm,
      ),
      mobileVersaoMinima: this.parseMobileVersaoMinima(
        req.body.mobileVersaoMinima,
      ),
    };

    return this.configuracaoService.update(id, body, req?.user?.id, file);
  }
}
