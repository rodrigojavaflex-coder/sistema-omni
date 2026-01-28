import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Veiculo } from '../models/veiculo.model';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async searchAtivos(query: string): Promise<Veiculo[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const placaRegex = /^[A-Za-z0-9-]+$/;
    const params: Record<string, string> = {
      status: 'ATIVO',
    };

    if (placaRegex.test(trimmed) && trimmed.length <= 10) {
      params['placa'] = trimmed;
    } else {
      params['descricao'] = trimmed;
    }

    const response = await firstValueFrom(
      this.http.get<{ data: Veiculo[] } | Veiculo[]>(
        `${this.apiBaseUrl}/veiculo`,
        { params },
      ),
    );

    if (Array.isArray(response)) {
      return response;
    }

    return response.data ?? [];
  }
}
