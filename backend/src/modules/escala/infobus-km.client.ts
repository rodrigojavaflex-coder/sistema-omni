import { Injectable, Logger } from '@nestjs/common';
import { fetch as undiciFetch } from 'undici';

export interface InfobusMotoristaKm {
  matricula?: string | number | null;
  motorista?: string | null;
  km?: number | null;
  /** Campos opcionais se o INFOBUS expandir o contrato atual. */
  nome?: string | null;
  nomeTurno?: string | null;
  numero?: string | null;
  numeroViagem?: string | null;
  horarioInicio?: string | null;
  horarioFim?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
}

export interface InfobusLinhaKm {
  linha?: string | null;
  descricao?: string | null;
  descricaoLinha?: string | null;
  km?: number | null;
  quilometragem?: number | null;
  motoristas?: InfobusMotoristaKm[];
  nome?: string | null;
  nomeTurno?: string | null;
  numero?: string | null;
  numeroViagem?: string | null;
  horarioInicio?: string | null;
  horarioFim?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
}

/** Turno explícito (contrato INFOBUS expandido, opcional). */
export interface InfobusTurnoKm {
  nome?: string | null;
  nomeTurno?: string | null;
  quilometragem?: number | null;
  km?: number | null;
  numero?: string | null;
  numeroViagem?: string | null;
  linha?: string | null;
  descricao?: string | null;
  descricaoLinha?: string | null;
  veiculo?: string | number | null;
  motorista?: string | null;
  matricula?: string | number | null;
  horarioInicio?: string | null;
  horarioFim?: string | null;
  horario_inicio?: string | null;
  horario_fim?: string | null;
  data?: string | null;
}

export interface InfobusVeiculoKm {
  veiculo?: number | string | null;
  km?: number | null;
  quilometragem?: number | null;
  linhas?: InfobusLinhaKm[];
  turnos?: InfobusTurnoKm[];
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
