import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Motorista } from '../models/motorista.model';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class MotoristaService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async searchAtivos(query: string): Promise<Motorista[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const response = await firstValueFrom(
      this.http.get<{ data: Motorista[] }>(
        `${this.apiBaseUrl}/motoristas`,
        {
          params: {
            search: trimmed,
            status: 'Ativo',
            limit: '20',
          },
        },
      ),
    );

    return response.data ?? [];
  }
}
