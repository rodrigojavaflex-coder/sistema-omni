import { Injectable, Logger } from '@nestjs/common';
import { Agent, fetch as undiciFetch } from 'undici';
import { BRT_OS_DEFAULT_URL } from '../vistoria/brt-os-integration.service';

export interface BrtTempoRealItem {
  veiculo_id?: number | null;
  data_hora?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bateria?: number | null;
  autonomia?: number | null;
  odometro?: number | null;
}

export interface BrtTempoRealResponse {
  success?: boolean;
  total?: number;
  data?: BrtTempoRealItem[];
}

@Injectable()
export class BrtTempoRealClient {
  private readonly logger = new Logger(BrtTempoRealClient.name);
  private readonly insecureTlsAgent = new Agent({
    connect: { rejectUnauthorized: false },
  });

  resolveTempoRealUrl(brtUrlBase?: string | null): string {
    const base = (brtUrlBase?.trim() || BRT_OS_DEFAULT_URL).replace(/\/+$/, '');
    if (/\/os$/i.test(base)) {
      return base.replace(/\/os$/i, '/tempo_real');
    }
    if (/\/v1$/i.test(base)) {
      return `${base}/tempo_real`;
    }
    return `${base}/tempo_real`;
  }

  async buscarTempoReal(params: {
    brtUrlBase?: string | null;
    tenEmp: string;
    token: string;
    allowInsecureTls?: boolean;
    timeoutMs?: number;
  }): Promise<BrtTempoRealResponse> {
    const url = this.resolveTempoRealUrl(params.brtUrlBase);
    const timeoutMs =
      params.timeoutMs && params.timeoutMs > 0 ? params.timeoutMs : 30000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const inicioMs = Date.now();

    this.logger.log(
      `BRT tempo_real: iniciando GET ${url} ten_emp=${params.tenEmp} timeoutMs=${timeoutMs} insecureTls=${!!params.allowInsecureTls}`,
    );

    try {
      const response = await undiciFetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ten_emp: params.tenEmp,
          token: params.token,
        },
        signal: controller.signal,
        ...(params.allowInsecureTls
          ? { dispatcher: this.insecureTlsAgent }
          : {}),
      });
      const text = await response.text();
      const elapsedMs = Date.now() - inicioMs;
      let body: BrtTempoRealResponse = {};
      try {
        body = text ? (JSON.parse(text) as BrtTempoRealResponse) : {};
      } catch {
        this.logger.warn(
          `BRT tempo_real: resposta não-JSON (HTTP ${response.status}) em ${elapsedMs}ms bytes=${text?.length ?? 0} preview=${(text ?? '').slice(0, 400)}`,
        );
      }

      const total =
        typeof body.total === 'number'
          ? body.total
          : Array.isArray(body.data)
            ? body.data.length
            : 0;
      const amostra = Array.isArray(body.data)
        ? body.data.slice(0, 5).map((item) => ({
            veiculo_id: item.veiculo_id,
            data_hora: item.data_hora,
            bateria: item.bateria,
            autonomia: item.autonomia,
            odometro: item.odometro,
            latitude: item.latitude,
            longitude: item.longitude,
          }))
        : [];

      this.logger.log(
        `BRT tempo_real: HTTP ${response.status} em ${elapsedMs}ms success=${String(body.success)} total=${total} itens=${Array.isArray(body.data) ? body.data.length : 0} bytes=${text?.length ?? 0}`,
      );
      this.logger.log(
        `BRT tempo_real: amostra (até 5): ${JSON.stringify(amostra)}`,
      );

      if (!response.ok) {
        const codigo =
          (body as { erro?: string }).erro || `http_${response.status}`;
        const mensagemErro =
          (body as { mensagem?: string }).mensagem || '';
        this.logger.error(
          `BRT tempo_real: falha codigo=${codigo} mensagem=${mensagemErro} corpo=${(text ?? '').slice(0, 800)}`,
        );
        throw new Error(
          `BRT tempo_real falhou (${codigo}). Verifique credenciais da empresa BRT.`,
        );
      }
      return body;
    } catch (err) {
      const elapsedMs = Date.now() - inicioMs;
      if (err instanceof Error && /abort/i.test(err.message)) {
        this.logger.error(
          `BRT tempo_real: timeout/abort após ${elapsedMs}ms (limite ${timeoutMs}ms) url=${url}`,
        );
      } else if (!(err instanceof Error && /BRT tempo_real falhou/.test(err.message))) {
        this.logger.error(
          `BRT tempo_real: erro de rede após ${elapsedMs}ms: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
