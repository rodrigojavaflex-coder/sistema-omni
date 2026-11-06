import { Injectable, Logger } from '@nestjs/common';
import { fetch as undiciFetch } from 'undici';

export interface InfobusMotoristaKm {
  matricula?: string | number | null;
  motorista?: string | null;
  km?: number | null;
}

export interface InfobusLinhaKm {
  linha?: string | null;
  km?: number | null;
  motoristas?: InfobusMotoristaKm[];
}

export interface InfobusVeiculoKm {
  veiculo?: number | string | null;
  km?: number | null;
  linhas?: InfobusLinhaKm[];
}

export interface InfobusKmDetalhadoResponse {
  data?: string;
  total_veiculos?: number;
  veiculos?: InfobusVeiculoKm[];
}

@Injectable()
export class InfobusKmClient {
  private readonly logger = new Logger(InfobusKmClient.name);

  async buscarKmDetalhado(params: {
    baseUrl: string;
    tenant: string;
    apiKey: string;
    data: string;
    timeoutMs?: number;
  }): Promise<InfobusKmDetalhadoResponse> {
    const base = params.baseUrl.replace(/\/+$/, '');
    const url = new URL('/api/v1/veiculos/km/detalhado', `${base}/`);
    url.searchParams.set('data', params.data);

    const timeoutMs = params.timeoutMs && params.timeoutMs > 0 ? params.timeoutMs : 30000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await undiciFetch(url.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Tenant': params.tenant,
          'X-API-Key': params.apiKey,
        },
        signal: controller.signal,
      });
      const text = await response.text();
      let body: InfobusKmDetalhadoResponse = {};
      try {
        body = text ? (JSON.parse(text) as InfobusKmDetalhadoResponse) : {};
      } catch {
        this.logger.warn(
          `INFOBUS KM: resposta não-JSON (HTTP ${response.status})`,
        );
      }
      if (!response.ok) {
        throw new Error(
          `INFOBUS KM retornou HTTP ${response.status}. Verifique URL, tenant e API Key.`,
        );
      }
      return body;
    } finally {
      clearTimeout(timer);
    }
  }
}
