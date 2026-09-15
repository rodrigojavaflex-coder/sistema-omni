import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fetch as undiciFetch } from 'undici';
import { StatusErpVistoria } from '../../common/enums/status-erp-vistoria.enum';
import { StatusVistoria } from '../../common/enums/status-vistoria.enum';
import { OrigemVistoria } from '../../common/enums/origem-vistoria.enum';
import {
  Configuracao,
  ErpVistoriaConfig,
} from '../configuracao/entities/configuracao.entity';
import { EnviarErpVistoriaRespostaDto } from './dto/enviar-erp-vistoria-resultado.dto';
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

  async isIntegracaoAtiva(): Promise<boolean> {
    const config = await this.carregarConfig();
    return this.configPronta(config);
  }

  async enfileirarAposFinalizar(vistoriaId: string): Promise<void> {
    const vistoria = await this.vistoriaRepository.findOne({
      where: { id: vistoriaId },
    });
    if (!vistoria || vistoria.status !== StatusVistoria.FINALIZADA) {
      return;
    }

    const qtd = await this.irregularidadeRepository.count({
      where: { idVistoria: vistoriaId },
    });
    if (qtd === 0) {
      vistoria.erpStatus = StatusErpVistoria.NAO_APLICA;
      vistoria.erpUltimoErro = null;
      await this.vistoriaRepository.save(vistoria);
      return;
    }

    const config = await this.carregarConfig();
    if (!config?.ativo) {
      return;
    }
    if (!this.configPronta(config)) {
      await this.marcarFalha(
        vistoria,
        this.resolverMensagemErro(undefined, config),
      );
      return;
    }

    vistoria.erpStatus = StatusErpVistoria.PENDENTE;
    vistoria.erpUltimoErro = null;
    await this.vistoriaRepository.save(vistoria);
    await this.enviarIds([vistoriaId], { exigirAtivo: false });
  }

  async enviarIds(
    ids: string[],
    opcoes?: { exigirAtivo?: boolean },
  ): Promise<EnviarErpVistoriaRespostaDto> {
    const exigirAtivo = opcoes?.exigirAtivo !== false;
    const config = await this.carregarConfig();
    if (exigirAtivo && !config?.ativo) {
      throw new BadRequestException(
        'Envio ao ERP desabilitado na configuração do sistema',
      );
    }
    if (!this.configPronta(config)) {
      throw new BadRequestException(
        'Configure URL, tenant e API Key da integração ERP.',
      );
    }

    const unicos = [...new Set(ids)];
    const itens: EnviarErpVistoriaRespostaDto['itens'] = [];
    const paraEnviar: Array<{ vistoria: Vistoria; payload: ErpLoteItemPayload }> =
      [];

    for (const id of unicos) {
      const vistoria = await this.carregarCapaParaEnvio(id);
      if (!vistoria) {
        itens.push({
          id,
          resultado: 'IGNORADA',
          erro: 'Vistoria não encontrada',
        });
        continue;
      }
      const motivo = await this.motivoInelegivel(vistoria);
      if (motivo) {
        itens.push({ id, resultado: 'IGNORADA', erro: motivo });
        continue;
      }

      const montagem = this.montarPayloadItem(vistoria, config);
      if (!montagem.ok) {
        await this.marcarFalha(vistoria, montagem.erro);
        itens.push({ id, resultado: 'FALHA', erro: montagem.erro });
        continue;
      }
      paraEnviar.push({ vistoria, payload: montagem.payload });
    }

    if (paraEnviar.length > 0) {
      const loteItens = await this.postarLote(
        config,
        paraEnviar.map((item) => item.payload),
      );
      for (let i = 0; i < paraEnviar.length; i++) {
        const { vistoria } = paraEnviar[i];
        const respostaItem = loteItens.porIndice.get(i + 1) ?? null;
        if (loteItens.falhaGeral) {
          const erro = this.resolverMensagemErro(
            loteItens.mensagemGeral,
            config,
          );
          await this.marcarFalha(vistoria, erro);
          itens.push({ id: vistoria.id, resultado: 'FALHA', erro });
          continue;
        }
        const codigo = respostaItem?.pedido?.codigo_pedido;
        const sucessoItem = respostaItem?.sucesso !== false && codigo != null;
        if (sucessoItem) {
          const numero = String(codigo);
          await this.marcarEnviado(vistoria, numero);
          itens.push({
            id: vistoria.id,
            resultado: 'ENVIADO',
            erpNumeroVistoria: numero,
          });
          continue;
        }
        const erro = this.resolverMensagemErro(
          this.extrairMensagemItem(respostaItem),
          config,
        );
        await this.marcarFalha(vistoria, erro);
        itens.push({ id: vistoria.id, resultado: 'FALHA', erro });
      }
    }

    return {
      enviadas: itens.filter((item) => item.resultado === 'ENVIADO').length,
      falhas: itens.filter((item) => item.resultado === 'FALHA').length,
      ignoradas: itens.filter((item) => item.resultado === 'IGNORADA').length,
      itens,
    };
  }

  async anexarElegibilidade(vistorias: Vistoria[]): Promise<Vistoria[]> {
    if (vistorias.length === 0) {
      return vistorias;
    }
    const ids = vistorias.map((item) => item.id);
    const rows = await this.irregularidadeRepository
      .createQueryBuilder('i')
      .select('i.idVistoria', 'id')
      .addSelect('COUNT(*)', 'qtd')
      .where('i.idVistoria IN (:...ids)', { ids })
      .groupBy('i.idVistoria')
      .getRawMany<{ id: string; qtd: string }>();
    const comIrregularidade = new Set(
      rows.filter((row) => Number(row.qtd) > 0).map((row) => row.id),
    );
    for (const vistoria of vistorias) {
      vistoria.erpElegivel = this.ehElegivel(
        vistoria,
        comIrregularidade.has(vistoria.id),
      );
    }
    return vistorias;
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

  private ehElegivel(vistoria: Vistoria, temIrregularidade: boolean): boolean {
    return (
      vistoria.status === StatusVistoria.FINALIZADA &&
      !vistoria.erpNumeroVistoria &&
      temIrregularidade
    );
  }

  private async motivoInelegivel(vistoria: Vistoria): Promise<string | null> {
    if (vistoria.status !== StatusVistoria.FINALIZADA) {
      return 'Somente vistorias finalizadas podem ser enviadas ao ERP';
    }
    if (vistoria.erpNumeroVistoria) {
      return 'Vistoria já possui número do ERP';
    }
    const qtd = await this.irregularidadeRepository.count({
      where: { idVistoria: vistoria.id },
    });
    if (qtd === 0) {
      return 'Vistoria sem irregularidade';
    }
    return null;
  }

  private montarPayloadItem(
    vistoria: Vistoria,
    config: ErpVistoriaConfig,
  ):
    | { ok: true; payload: ErpLoteItemPayload }
    | { ok: false; erro: string } {
    const descricao = vistoria.veiculo?.descricao ?? '';
    const veiculo = this.montarVeiculoErp(descricao);
    if (!veiculo) {
      return {
        ok: false,
        erro: 'Descrição do veículo inválida para o ERP',
      };
    }
    const matriculaRaw = (vistoria.motorista?.matricula ?? '').trim();
    const matricula = Number(matriculaRaw);
    if (!matriculaRaw || !Number.isFinite(matricula)) {
      return {
        ok: false,
        erro: 'Matrícula do motorista inválida para o ERP',
      };
    }
    const sintomas =
      vistoria.irregularidades
        ?.map((item) => this.montarSintomaErp(item))
        .filter((item): item is string => !!item) ?? [];
    return {
      ok: true,
      payload: {
        veiculo,
        data_vistoria: this.formatarDataVistoria(vistoria.datavistoria),
        local_abertura: config.localAbertura,
        tipo_pedido: config.tipoPedido,
        condicao: this.montarCondicao(vistoria),
        motorista: vistoria.motorista?.nome?.trim() ?? '',
        matricula_motorista: matricula,
        vistoriador: vistoria.usuario?.nome?.trim() ?? '',
        odometro: Math.trunc(Number(vistoria.odometro) || 0),
        sintomas,
      },
    };
  }

  private montarCondicao(vistoria: Vistoria): number {
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

  private async carregarCapaParaEnvio(id: string): Promise<Vistoria | null> {
    return this.vistoriaRepository.findOne({
      where: { id },
      relations: [
        'veiculo',
        'motorista',
        'usuario',
        'irregularidades',
        'irregularidades.area',
        'irregularidades.componente',
        'irregularidades.sintoma',
      ],
    });
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
    const timeoutMs = config.timeoutMs && config.timeoutMs > 0 ? config.timeoutMs : 30_000;
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

  private extrairMensagemItem(item: ErpLoteItemResposta | null): string | undefined {
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

  private async marcarEnviado(vistoria: Vistoria, numero: string): Promise<void> {
    vistoria.erpStatus = StatusErpVistoria.ENVIADO;
    vistoria.erpNumeroVistoria = numero;
    vistoria.erpEnviadoEm = new Date();
    vistoria.erpUltimoErro = null;
    await this.vistoriaRepository.save(vistoria);
  }

  private async marcarFalha(vistoria: Vistoria, erro: string): Promise<void> {
    vistoria.erpStatus = StatusErpVistoria.FALHA;
    vistoria.erpUltimoErro = erro;
    await this.vistoriaRepository.save(vistoria);
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
