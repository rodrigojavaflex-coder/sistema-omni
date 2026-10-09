import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fetch as undiciFetch } from 'undici';
import { OrigemVistoria } from '../../common/enums/origem-vistoria.enum';
import { TipoVistoria } from '../../common/enums/tipo-vistoria.enum';
import {
  Configuracao,
  ErpVistoriaConfig,
} from '../configuracao/entities/configuracao.entity';
import { Irregularidade } from './entities/irregularidade.entity';
import { Vistoria } from './entities/vistoria.entity';

export const ERP_VISTORIA_MENSAGEM_FALLBACK =
  'Erro ao gravar Vistoria no OMNI';
export const ERP_VISTORIA_API_KEY_MASK = '********';
const ERP_VISTORIA_LOTE_PATH = '/api/v1/vistorias/lote';

interface ErpLoteItemPayload {
  veiculo: string;
  data_vistoria: string;
  local_abertura: number;
  tipo_pedido: number;
  condicao: number;
  motorista: string;
  matricula_motorista: number;
  vistoriador: string;
  odometro: number;
  sintomas: string[];
}

interface ErpLotePedido {
  codigo_pedido?: number | string;
}

interface ErpLoteItemResposta {
  indice?: number;
  sucesso?: boolean;
  mensagem?: string;
  erro?: string;
  detalhe?: string;
  pedido?: ErpLotePedido;
}

interface ErpLoteResposta {
  sucesso?: boolean;
  mensagem?: string;
  erro?: string;
  vistorias?: ErpLoteItemResposta[];
}

export type ErpEnvioVeiculoResultado =
  | { ok: true; codigoPedido: string; jaExistia: boolean }
  | { ok: false; erro: string };

@Injectable()
export class ErpVistoriaIntegrationService {
  private readonly logger = new Logger(ErpVistoriaIntegrationService.name);

  constructor(
    @InjectRepository(Vistoria)
    private readonly vistoriaRepository: Repository<Vistoria>,
    @InjectRepository(Irregularidade)
    private readonly irregularidadeRepository: Repository<Irregularidade>,
    @InjectRepository(Configuracao)
    private readonly configuracaoRepository: Repository<Configuracao>,
  ) {}

  /**
   * Integração habilitada e credenciais prontas (pronta para POST).
   */
  async isIntegracaoAtiva(): Promise<boolean> {
    const config = await this.carregarConfig();
    return this.configPronta(config);
  }

  /**
   * Flag «Habilitar envio ao ERP» ligada (pode estar incompleta).
   */
  async isEnvioHabilitado(): Promise<boolean> {
    const config = await this.carregarConfig();
    return !!config?.ativo;
  }

  /**
   * Quando a flag está ativa mas URL/tenant/key faltam.
   */
  async obterErroConfigIncompleta(): Promise<string | null> {
    const config = await this.carregarConfig();
    if (!config?.ativo) {
      return null;
    }
    if (this.configPronta(config)) {
      return null;
    }
    return 'Configure URL, tenant e API Key da integração ERP.';
  }

  /**
   * Envia (ou reaproveita) o pedido ERP do grupo de irregularidades do mesmo veículo.
   * Idempotente: se todas já têm o mesmo erp_codigo_pedido, não chama a API.
   */
  async garantirEnvioGrupoVeiculo(
    irregularidades: Irregularidade[],
  ): Promise<ErpEnvioVeiculoResultado> {
    if (irregularidades.length === 0) {
      return { ok: false, erro: 'Nenhuma irregularidade para envio ao ERP' };
    }

    const codigos = new Set(
      irregularidades
        .map((item) => item.erpCodigoPedido?.trim())
        .filter((item): item is string => !!item),
    );
    if (
      codigos.size === 1 &&
      irregularidades.every((item) => !!item.erpCodigoPedido?.trim())
    ) {
      const codigoPedido = [...codigos][0];
      return { ok: true, codigoPedido, jaExistia: true };
    }

    const config = await this.carregarConfig();
    if (!config?.ativo) {
      return { ok: false, erro: 'Envio ao ERP desabilitado na configuração do sistema' };
    }
    if (!this.configPronta(config)) {
      return {
        ok: false,
        erro: 'Configure URL, tenant e API Key da integração ERP.',
      };
    }

    const montagem = this.montarPayloadGrupoVeiculo(irregularidades, config);
    if (!montagem.ok) {
      await this.marcarFalhaGrupo(irregularidades, montagem.erro);
      return { ok: false, erro: montagem.erro };
    }

    const lote = await this.postarLote(config, [montagem.payload]);
    if (lote.falhaGeral) {
      const erro = this.resolverMensagemErro(lote.mensagemGeral, config);
      await this.marcarFalhaGrupo(irregularidades, erro);
      return { ok: false, erro };
    }

    const respostaItem = lote.porIndice.get(1) ?? null;
    const codigo = respostaItem?.pedido?.codigo_pedido;
    const sucessoItem = respostaItem?.sucesso !== false && codigo != null;
    if (!sucessoItem) {
      const erro = this.resolverMensagemErro(
        this.extrairMensagemItem(respostaItem),
        config,
      );
      await this.marcarFalhaGrupo(irregularidades, erro);
      return { ok: false, erro };
    }

    const codigoPedido = String(codigo);
    await this.marcarEnviadoGrupo(irregularidades, codigoPedido);
    return { ok: true, codigoPedido, jaExistia: false };
  }

  limparVinculoErp(irregularidade: Irregularidade): void {
    irregularidade.erpCodigoPedido = null;
    irregularidade.erpEnviadoEm = null;
    irregularidade.erpUltimoErro = null;
  }

  montarVeiculoErp(descricao: string): string | null {
    const texto = descricao.trim();
    if (!/^\d{2}/.test(texto)) {
      return null;
    }
    const prefixoNum = Number.parseInt(texto.slice(0, 2), 10);
    if (!Number.isFinite(prefixoNum)) {
      return null;
    }
    const empresa = prefixoNum >= 12 ? '1' : '5';
    return `${empresa}:${texto}`;
  }

  /**
   * Capa do payload: vistoria mais recente do grupo (datavistoria DESC).
   */
  private escolherCapa(irregularidades: Irregularidade[]): Vistoria | null {
    const capas = irregularidades
      .map((item) => item.vistoria)
      .filter((item): item is Vistoria => !!item);
    if (capas.length === 0) {
      return null;
    }
    return [...capas].sort((a, b) => {
      const ta = new Date(a.datavistoria).getTime();
      const tb = new Date(b.datavistoria).getTime();
      return tb - ta;
    })[0];
  }

  private montarPayloadGrupoVeiculo(
    irregularidades: Irregularidade[],
    config: ErpVistoriaConfig,
  ):
    | { ok: true; payload: ErpLoteItemPayload }
    | { ok: false; erro: string } {
    const capa = this.escolherCapa(irregularidades);
    if (!capa) {
      return { ok: false, erro: 'Vistoria não carregada para envio ao ERP' };
    }
    const descricao = capa.veiculo?.descricao ?? '';
    const veiculo = this.montarVeiculoErp(descricao);
    if (!veiculo) {
      return {
        ok: false,
        erro: 'Descrição do veículo inválida para o ERP',
      };
    }
    const matriculaRaw = (capa.motorista?.matricula ?? '').trim();
    const matricula = Number(matriculaRaw);
    if (!matriculaRaw || !Number.isFinite(matricula)) {
      return {
        ok: false,
        erro: 'Matrícula do motorista inválida para o ERP',
      };
    }
    const sintomas = irregularidades
      .map((item) => this.montarSintomaErp(item))
      .filter((item): item is string => !!item);
    if (sintomas.length === 0) {
      return {
        ok: false,
        erro: 'Nenhum sintoma válido para envio ao ERP',
      };
    }
    return {
      ok: true,
      payload: {
        veiculo,
        data_vistoria: this.formatarDataVistoria(capa.datavistoria),
        local_abertura: config.localAbertura,
        tipo_pedido: config.tipoPedido,
        condicao: this.montarCondicao(capa),
        motorista: capa.motorista?.nome?.trim() ?? '',
        matricula_motorista: matricula,
        vistoriador: capa.usuario?.nome?.trim() ?? '',
        odometro: Math.trunc(Number(capa.odometro) || 0),
        sintomas,
      },
    };
  }

  private montarCondicao(vistoria: Vistoria): number {
    if (vistoria.tipo === TipoVistoria.SINISTRO) {
      return 2;
    }
    return vistoria.origem === OrigemVistoria.SOS_WEB ? 5 : 1;
  }

  private montarSintomaErp(irregularidade: Irregularidade): string | null {
    const area = irregularidade.area?.nome?.trim() ?? '';
    const componente = irregularidade.componente?.nome?.trim() ?? '';
    const sintoma = irregularidade.sintoma?.descricao?.trim() ?? '';
    const texto = [area, componente, sintoma].filter(Boolean).join('-');
    if (!texto) {
      return null;
    }
    const observacao = irregularidade.observacao?.trim() ?? '';
    return observacao ? `${texto} - (${observacao})` : texto;
  }

  private formatarDataVistoria(data: Date): string {
    const d = data instanceof Date ? data : new Date(data);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  private async postarLote(
    config: ErpVistoriaConfig,
    vistorias: ErpLoteItemPayload[],
  ): Promise<{
    falhaGeral: boolean;
    mensagemGeral?: string;
    porIndice: Map<number, ErpLoteItemResposta>;
  }> {
    const url = `${config.url.replace(/\/+$/, '')}${ERP_VISTORIA_LOTE_PATH}`;
    const timeoutMs =
      config.timeoutMs && config.timeoutMs > 0 ? config.timeoutMs : 30_000;
    this.logger.log(`ERP vistoria POST lote qtd=${vistorias.length} url=${url}`);

    let response: { status: number; json: () => Promise<unknown> };
    try {
      response = (await undiciFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant': config.tenant,
          'X-API-Key': config.apiKey ?? '',
        },
        body: JSON.stringify({ vistorias }),
        signal: AbortSignal.timeout(timeoutMs),
      })) as unknown as { status: number; json: () => Promise<unknown> };
    } catch (err) {
      const detalhe = err instanceof Error ? err.message : String(err);
      this.logger.warn(`ERP vistoria falha de comunicação | ${detalhe}`);
      return { falhaGeral: true, porIndice: new Map() };
    }

    let body: ErpLoteResposta = {};
    try {
      body = (await response.json()) as ErpLoteResposta;
    } catch {
      body = {};
    }

    if (response.status >= 500 || response.status === 0) {
      return {
        falhaGeral: true,
        mensagemGeral: this.extrairMensagemBody(body),
        porIndice: new Map(),
      };
    }

    const porIndice = new Map<number, ErpLoteItemResposta>();
    (body.vistorias ?? []).forEach((item, idx) => {
      const indice = Number(item.indice ?? idx + 1);
      porIndice.set(indice, item);
    });

    if (response.status >= 400 && porIndice.size === 0) {
      return {
        falhaGeral: true,
        mensagemGeral: this.extrairMensagemBody(body),
        porIndice,
      };
    }

    return { falhaGeral: false, porIndice };
  }

  private extrairMensagemBody(body: ErpLoteResposta): string | undefined {
    const texto = body.mensagem || body.erro;
    return texto?.trim() || undefined;
  }

  private extrairMensagemItem(
    item: ErpLoteItemResposta | null,
  ): string | undefined {
    if (!item) {
      return undefined;
    }
    const texto = item.mensagem || item.erro || item.detalhe;
    return texto?.trim() || undefined;
  }

  private resolverMensagemErro(
    daApi: string | undefined,
    config: ErpVistoriaConfig | null,
  ): string {
    if (daApi?.trim()) {
      return daApi.trim();
    }
    const daAba = config?.mensagemErroPadrao?.trim();
    if (daAba) {
      return daAba;
    }
    return ERP_VISTORIA_MENSAGEM_FALLBACK;
  }

  private async marcarEnviadoGrupo(
    irregularidades: Irregularidade[],
    codigoPedido: string,
  ): Promise<void> {
    const agora = new Date();
    for (const item of irregularidades) {
      item.erpCodigoPedido = codigoPedido;
      item.erpEnviadoEm = agora;
      item.erpUltimoErro = null;
      await this.irregularidadeRepository.save(item);
    }
  }

  private async marcarFalhaGrupo(
    irregularidades: Irregularidade[],
    erro: string,
  ): Promise<void> {
    for (const item of irregularidades) {
      item.erpUltimoErro = erro;
      await this.irregularidadeRepository.save(item);
    }
  }

  private configPronta(
    config: ErpVistoriaConfig | null,
  ): config is ErpVistoriaConfig {
    if (!config) {
      return false;
    }
    const apiKey = (config.apiKey ?? '').trim();
    const apiKeyValida = !!apiKey && !/^\*+$/.test(apiKey);
    return !!(
      config.ativo &&
      config.url?.trim() &&
      config.tenant?.trim() &&
      apiKeyValida
    );
  }

  private async carregarConfig(): Promise<ErpVistoriaConfig | null> {
    const row = await this.configuracaoRepository.findOne({ where: {} });
    return row?.erpVistoriaConfig ?? null;
  }
}
