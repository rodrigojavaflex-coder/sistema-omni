import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { AreaVistoriada, AreaComponente } from '../models/area-vistoriada.model';

@Injectable({ providedIn: 'root' })
export class AreaVistoriadaService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async listarPorModelo(modeloId: string): Promise<AreaVistoriada[]> {
    const areas = await firstValueFrom(
      this.http.get<AreaVistoriada[]>(`${this.apiBaseUrl}/areas`, {
        params: { idmodelo: modeloId, ativo: 'true' },
      }),
    );
    return areas ?? [];
  }

  async listarComponentes(areaId: string): Promise<AreaComponente[]> {
    const componentes = await firstValueFrom(
      this.http.get<AreaComponente[]>(`${this.apiBaseUrl}/areas/${areaId}/componentes`),
    );
    return componentes ?? [];
  }
}
