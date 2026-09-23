import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent, fetch as undiciFetch } from 'undici';
import { IntegracaoManutencaoEmpresa } from '../../common/enums/integracao-manutencao-empresa.enum';
import { OrigemRegistroIrregularidade } from '../../common/enums/origem-vistoria.enum';
import { StatusIrregularidade } from '../../common/enums/status-irregularidade.enum';
import { EmpresaTerceira } from '../empresa-terceira/entities/empresa-terceira.entity';
import { Irregularidade } from './entities/irregularidade.entity';

export const BRT_OS_DEFAULT_URL = 'https://www.api.brtgo.com.br/v1/os';

export interface BrtCriarOsPayload {
  ten_emp: string;
  tpo_reg: 1;
  tpo_srv: number;
  os_orig: string;
  plc_vcl: string;
  odo_vcl?: number;
  nom_sol: string;
  tel_ctt?: string;
  comenta?: string;
  loc_atd?: string;
}

export interface BrtCancelarOsPayload {
  ten_emp: string;
  tpo_reg: 7;
  os_orig: string;
  comenta: string;
}

export interface BrtOsSuccessBody {
  success?: boolean;
  numOs?: number;
  duplicada?: boolean;
}

export interface BrtOsErrorBody {
  erro?: string;
  mensagem?: string;
  campos?: Array<{ campo: string; mensagens: string[] }>;
}

export type BrtCriarOsResult =
  | {
      ok: true;
      httpStatus: number;
      numOs: number;
      duplicada: boolean;
      raw: BrtOsSuccessBody;
    }
  | {
      ok: false;
      httpStatus: number;
      codigoErro: string;
      mensagem: string;
      raw: BrtOsErrorBody;
    };

export type BrtCancelarOsResult =
  | {
      ok: true;
      httpStatus: number;
      raw: BrtOsSuccessBody;
    }
  | {
      ok: false;
      httpStatus: number;
      codigoErro: string;
      mensagem: string;
      raw: BrtOsErrorBody;
    };

@Injectable()
export class BrtOsIntegrationService {
  private readonly logger = new Logger(BrtOsIntegrationService.name);

  /** Reutilizado com TLS relaxado (mesmo pacote undici do fetch). */
  private readonly insecureTlsAgent = new Agent({
    connect: { rejectUnauthorized: false },
  });

  constructor(private readonly configService: ConfigService) {}

  usesBrtIntegration(empresa: EmpresaTerceira): boolean {
    return (
      empresa.ehEmpresaManutencao &&
      empresa.integracaoManutencao === IntegracaoManutencaoEmpresa.BRT_OS
    );
  }

  resolveEndpoint(empresa: EmpresaTerceira): string {
    const base = empresa.brtUrlBase?.trim() || BRT_OS_DEFAULT_URL;
    return base.replace(/\/+$/, '');
  }

  /**
   * os_orig na API BRT: NS da irregularidade no OMNI.
   * - 1º envio (sem OS BRT criada com sucesso): só numeroIrregularidade (deduplica retentativas de erro).
   * - RETRABALHO_GARANTIA ou reenvio após OS cancelada: numeroIrregularidade-N (N>=2).
   */
  buildOsOrig(
    irregularidade: Irregularidade,
    integracoesSucessoAnteriores: number,
  ): string {
    const numero = irregularidade.numeroIrregularidade;
    if (numero === undefined || numero === null || Number.isNaN(Number(numero))) {
      throw new Error('Número da irregularidade não informado para os_orig');
    }
    const base = String(numero);
    const precisaSufixo =
      irregularidade.statusAtual === StatusIrregularidade.RETRABALHO_GARANTIA ||
      integracoesSucessoAnteriores > 0;
    if (precisaSufixo) {
      const ciclo = Math.max(2, integracoesSucessoAnteriores + 1);
      return `${base}-${ciclo}`;
    }
    return base;
  }

  buildCancelarPayload(
    empresa: EmpresaTerceira,
    osOrig: string,
    motivo: string,
  ): BrtCancelarOsPayload {
    const tenEmp = empresa.brtTenEmp?.trim();
    if (!tenEmp) {
      throw new Error('Tenant BRT não configurado na empresa');
    }
    const comenta = motivo?.trim();
    if (!comenta) {
      throw new Error('Motivo do cancelamento é obrigatório');
    }
    return {
      ten_emp: tenEmp,
      tpo_reg: 7,
      os_orig: osOrig,
      comenta: comenta.slice(0, 4000),
    };
  }

  buildComentario(irregularidade: Irregularidade): string {
    const linhaClassificacao = [
      irregularidade.area?.nome,
      irregularidade.componente?.nome,
      irregularidade.sintoma?.descricao,
    ]
      .filter((parte) => parte?.trim())
      .join('->');

    const descricaoProblema = irregularidade.observacao?.trim() ?? '';

    const linhas = [linhaClassificacao, descricaoProblema].filter(Boolean);
    return linhas.join('\n').slice(0, 4000);
  }

  buildPayload(
    empresa: EmpresaTerceira,
    irregularidade: Irregularidade,
    osOrig: string,
  ): BrtCriarOsPayload {
    const placa = irregularidade.vistoria?.veiculo?.placa?.trim();
    if (!placa) {
      throw new Error('Placa do veículo não informada');
    }
    const tenEmp = empresa.brtTenEmp?.trim();
    if (!tenEmp) {
      throw new Error('Tenant BRT não configurado na empresa');
    }
    const nomSol = empresa.brtNomSol?.trim();
    if (!nomSol) {
      throw new Error(
        'Solicitante não configurado na empresa de manutenção',
      );
    }
    const tpoSrv =
      irregularidade.origemRegistro === OrigemRegistroIrregularidade.SOS_WEB
        ? 3
        : 1;
    const odom = irregularidade.vistoria?.odometro;
    const payload: BrtCriarOsPayload = {
      ten_emp: tenEmp,
      tpo_reg: 1,
      tpo_srv: tpoSrv,
      os_orig: osOrig,
      plc_vcl: placa,
      nom_sol: nomSol.slice(0, 200),
      comenta: this.buildComentario(irregularidade),
    };
    const telCtt = empresa.brtTelCtt?.trim();
    if (telCtt) {
      payload.tel_ctt = telCtt.slice(0, 40);
    }
    const locAtd = empresa.brtLocAtd?.trim();
    if (locAtd) {
      payload.loc_atd = locAtd.slice(0, 500);
    }
    if (odom !== null && odom !== undefined && !Number.isNaN(Number(odom))) {
      payload.odo_vcl = Math.trunc(Number(odom));
    }
    return payload;
  }

  async criarOs(
    empresa: EmpresaTerceira,
    payload: BrtCriarOsPayload,
  ): Promise<BrtCriarOsResult> {
    const token = empresa.brtToken?.trim();
    if (!token) {
      return {
        ok: false,
        httpStatus: 0,
        codigoErro: 'configuracao_incompleta',
        mensagem: 'Token BRT não configurado na empresa de manutenção',
        raw: { erro: 'configuracao_incompleta' },
      };
    }

    const url = this.resolveEndpoint(empresa);
    const contextoLog = `url=${url} os_orig=${payload.os_orig} plc_vcl=${payload.plc_vcl} ten_emp=${payload.ten_emp}`;
    this.logger.debug(`BRT OS POST iniciando ${contextoLog}`);

    const usarTlsInseguro = this.deveIgnorarTls(empresa);
    if (usarTlsInseguro) {
      this.logger.warn(
        `BRT OS: TLS com rejectUnauthorized=false (${this.motivoTlsInseguro(empresa)}) ${contextoLog}`,
      );
    }

    const fetchOptions = {
      method: 'POST' as const,
      headers: {
        'Content-Type': 'application/json',
        ten_emp: payload.ten_emp,
        token,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
      ...(usarTlsInseguro ? { dispatcher: this.insecureTlsAgent } : {}),
    };

    let response: Response;
    try {
      response = (await undiciFetch(url, fetchOptions)) as unknown as Response;
    } catch (err) {
      const { mensagemUsuario, detalheTecnico } =
        this.descreverErroComunicacao(err);
      const mensagemExibida =
        this.mensagemComunicacaoParaUsuario(detalheTecnico, mensagemUsuario);
      this.logger.warn(
        `BRT OS falha de comunicação ${contextoLog} | ${detalheTecnico}`,
      );
      if (err instanceof Error && err.stack) {
        this.logger.debug(err.stack);
      }
      return {
        ok: false,
        httpStatus: 0,
        codigoErro: 'falha_comunicacao',
        mensagem: `Não foi possível comunicar com a API de OS: ${mensagemExibida}`,
        raw: {
          erro: 'falha_comunicacao',
          mensagem: mensagemExibida,
          ...(detalheTecnico !== mensagemExibida
            ? { detalhe: detalheTecnico }
            : {}),
        },
      };
    }

    let body: BrtOsSuccessBody & BrtOsErrorBody = {};
    try {
      body = (await response.json()) as BrtOsSuccessBody & BrtOsErrorBody;
    } catch {
      body = {};
    }

    if (response.status === 201 || response.status === 200) {
      const numOs = body.numOs;
      if (numOs === undefined || numOs === null) {
        this.logger.warn(
          `BRT OS resposta sem numOs http=${response.status} ${contextoLog} body=${this.resumirCorpoLog(body)}`,
        );
        return {
          ok: false,
          httpStatus: response.status,
          codigoErro: 'resposta_invalida',
          mensagem: 'API BRT não retornou numOs',
          raw: body,
        };
      }
      return {
        ok: true,
        httpStatus: response.status,
        numOs: Number(numOs),
        duplicada: body.duplicada === true,
        raw: body,
      };
    }

    const codigoErro = body.erro ?? `http_${response.status}`;
    const mensagem = this.formatarMensagemErro(body, response.status);
    this.logger.warn(
      `BRT OS resposta erro http=${response.status} codigo=${codigoErro} ${contextoLog} body=${this.resumirCorpoLog(body)}`,
    );
    return {
      ok: false,
      httpStatus: response.status,
      codigoErro,
      mensagem,
      raw: body,
    };
  }

  async cancelarOs(
    empresa: EmpresaTerceira,
    payload: BrtCancelarOsPayload,
  ): Promise<BrtCancelarOsResult> {
    const token = empresa.brtToken?.trim();
    if (!token) {
      return {
        ok: false,
        httpStatus: 0,
        codigoErro: 'configuracao_incompleta',
        mensagem: 'Token BRT não configurado na empresa de manutenção',
        raw: { erro: 'configuracao_incompleta' },
      };
    }

    const url = this.resolveEndpoint(empresa);
    const contextoLog = `url=${url} os_orig=${payload.os_orig} ten_emp=${payload.ten_emp} tpo_reg=7`;
    this.logger.debug(`BRT OS cancelamento POST iniciando ${contextoLog}`);

    const usarTlsInseguro = this.deveIgnorarTls(empresa);
    if (usarTlsInseguro) {
      this.logger.warn(
        `BRT OS cancelamento: TLS com rejectUnauthorized=false (${this.motivoTlsInseguro(empresa)}) ${contextoLog}`,
      );
    }

    const fetchOptions = {
      method: 'POST' as const,
      headers: {
        'Content-Type': 'application/json',
        ten_emp: payload.ten_emp,
        token,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60_000),
      ...(usarTlsInseguro ? { dispatcher: this.insecureTlsAgent } : {}),
    };

    let response: Response;
    try {
      response = (await undiciFetch(url, fetchOptions)) as unknown as Response;
    } catch (err) {
      const { mensagemUsuario, detalheTecnico } =
        this.descreverErroComunicacao(err);
      const mensagemExibida =
        this.mensagemComunicacaoParaUsuario(detalheTecnico, mensagemUsuario);
      this.logger.warn(
        `BRT OS cancelamento falha de comunicação ${contextoLog} | ${detalheTecnico}`,
      );
      return {
        ok: false,
        httpStatus: 0,
        codigoErro: 'falha_comunicacao',
        mensagem: `Não foi possível comunicar com a API de OS: ${mensagemExibida}`,
        raw: {
          erro: 'falha_comunicacao',
          mensagem: mensagemExibida,
        },
      };
    }

    let body: BrtOsSuccessBody & BrtOsErrorBody = {};
    try {
      body = (await response.json()) as BrtOsSuccessBody & BrtOsErrorBody;
    } catch {
      body = {};
    }

    if (response.status === 201 || response.status === 200) {
      this.logger.debug(
        `BRT OS cancelamento OK http=${response.status} ${contextoLog} body=${this.resumirCorpoLog(body)}`,
      );
      return {
        ok: true,
        httpStatus: response.status,
        raw: body,
      };
    }

    const codigoErro = body.erro ?? `http_${response.status}`;
    const mensagem = this.formatarMensagemErro(body, response.status, true);
    this.logger.warn(
      `BRT OS cancelamento erro http=${response.status} codigo=${codigoErro} ${contextoLog} body=${this.resumirCorpoLog(body)}`,
    );
    return {
      ok: false,
      httpStatus: response.status,
      codigoErro,
      mensagem,
      raw: body,
    };
  }

  private formatarMensagemErro(
    body: BrtOsErrorBody,
    httpStatus: number,
    cancelamento = false,
  ): string {
    if (body.erro === 'veiculo_nao_encontrado') {
      return 'Placa não cadastrada no consórcio BRT. Regularize o cadastro do veículo antes de reenviar.';
    }
    if (cancelamento && body.erro === 'os_em_execucao') {
      return 'A OS já está em execução na oficina BRT e não pode ser cancelada.';
    }
    if (cancelamento && body.erro === 'os_nao_encontrada') {
      return 'OS não encontrada na BRT para cancelamento. Verifique o status no consórcio.';
    }
    if (body.erro === 'credenciais_invalidas') {
      return 'Credenciais BRT inválidas. Verifique tenant e token na empresa de manutenção.';
    }
    if (body.erro === 'tenant_divergente') {
      return 'Tenant BRT divergente entre cabeçalho e corpo da requisição.';
    }
    if (body.erro === 'validacao' && body.campos?.length) {
      const campos = body.campos
        .map((c) => `${c.campo}: ${(c.mensagens ?? []).join(', ')}`)
        .join('; ');
      return `Dados inválidos para a API BRT: ${campos}`;
    }
    if (body.mensagem?.trim()) {
      return body.mensagem.trim();
    }
    if (body.erro) {
      return `Erro BRT (${body.erro})`;
    }
    return `Erro ao criar OS na API BRT (HTTP ${httpStatus})`;
  }

  /**
   * TLS relaxado: flag da empresa, flag global env, ou homolog + empresa HOMOLOG.
   */
  private deveIgnorarTls(empresa: EmpresaTerceira): boolean {
    if (empresa.brtAllowInsecureTls === true) {
      return true;
    }
    const allowAny = this.configService.get<boolean>(
      'brtOs.allowInsecureTls',
      false,
    );
    if (allowAny) {
      return true;
    }
    const allowHomolog = this.configService.get<boolean>(
      'brtOs.allowInsecureTlsHomolog',
      false,
    );
    if (!allowHomolog) {
      return false;
    }
    return empresa.brtAmbiente?.trim().toUpperCase() === 'HOMOLOG';
  }

  private motivoTlsInseguro(empresa: EmpresaTerceira): string {
    if (empresa.brtAllowInsecureTls === true) {
      return 'empresa.brtAllowInsecureTls=true';
    }
    const allowAny = this.configService.get<boolean>(
      'brtOs.allowInsecureTls',
      false,
    );
    if (allowAny) {
      return 'BRT_OS_ALLOW_INSECURE_TLS=true';
    }
    return `empresa ambiente ${empresa.brtAmbiente ?? '?'} + BRT_OS_ALLOW_INSECURE_TLS_HOMOLOG=true`;
  }

  private mensagemComunicacaoParaUsuario(
    detalheTecnico: string,
    mensagemUsuario: string,
  ): string {
    const lower = detalheTecnico.toLowerCase();
    if (
      lower.includes('und_err_invalid_arg') ||
      lower.includes('invalid argument')
    ) {
      return (
        'Falha interna ao preparar a chamada HTTP à API de OS. ' +
        'Reinicie o backend; se persistir, contate o suporte técnico.'
      );
    }
    if (
      lower.includes('self-signed') ||
      lower.includes('self_signed') ||
      lower.includes('depth_zero_self_signed') ||
      lower.includes('certificate')
    ) {
      return (
        'Certificado SSL da API não é confiável (comum em homologação). ' +
        'Instale o certificado no servidor, marque «Permitir certificado SSL não confiável» ' +
        'na empresa de manutenção, ou use BRT_OS_ALLOW_INSECURE_TLS=true / ' +
        'BRT_OS_ALLOW_INSECURE_TLS_HOMOLOG=true (só Homologação).'
      );
    }
    return mensagemUsuario;
  }

  /** Mensagem para usuário e detalhe técnico (cause, errno) em falhas de rede. */
  private descreverErroComunicacao(err: unknown): {
    mensagemUsuario: string;
    detalheTecnico: string;
  } {
    const partes: string[] = [];
    const codigos: string[] = [];
    let atual: unknown = err;
    const visitados = new Set<unknown>();

    while (atual && !visitados.has(atual)) {
      visitados.add(atual);
      if (atual instanceof Error) {
        if (atual.message?.trim()) {
          partes.push(atual.message.trim());
        }
        if (atual.name && atual.name !== 'Error') {
          partes.push(`[${atual.name}]`);
        }
      } else if (typeof atual === 'string' && atual.trim()) {
        partes.push(atual.trim());
      }
      if (typeof atual === 'object' && atual !== null) {
        const comCodigo = atual as { code?: unknown; errno?: unknown };
        if (typeof comCodigo.code === 'string' && comCodigo.code) {
          codigos.push(comCodigo.code);
        }
        if (
          comCodigo.errno !== undefined &&
          comCodigo.errno !== null &&
          String(comCodigo.errno)
        ) {
          codigos.push(`errno=${String(comCodigo.errno)}`);
        }
      }
      if (atual instanceof Error && atual.cause !== undefined) {
        atual = atual.cause;
      } else {
        break;
      }
    }

    const unicos = [...new Set([...partes, ...codigos])].filter(Boolean);
    const detalheTecnico =
      unicos.length > 0 ? unicos.join(' → ') : String(err);

    const mensagemRaiz =
      err instanceof Error ? err.message.trim() : String(err);
    const mensagemUsuario =
      mensagemRaiz.toLowerCase() === 'fetch failed' && unicos.length > 1
        ? unicos[unicos.length - 1]
        : detalheTecnico;

    return { mensagemUsuario, detalheTecnico };
  }

  private resumirCorpoLog(body: unknown, maxLen = 800): string {
    try {
      const texto = JSON.stringify(body);
      if (texto.length <= maxLen) {
        return texto;
      }
      return `${texto.slice(0, maxLen)}…`;
    } catch {
      return '[corpo não serializável]';
    }
  }
}
