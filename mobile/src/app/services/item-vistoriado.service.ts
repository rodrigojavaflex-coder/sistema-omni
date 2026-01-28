import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { ItemVistoriado } from '../models/item-vistoriado.model';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class ItemVistoriadoService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async getAtivosPorTipo(tipoVistoriaId: string): Promise<ItemVistoriado[]> {
    const itens = await firstValueFrom(
      this.http.get<ItemVistoriado[]>(
        `${this.apiBaseUrl}/itensvistoriados`,
        {
          params: {
            tipovistoria: tipoVistoriaId,
            ativo: 'true',
          },
        },
      ),
    );
    return itens ?? [];
  }
}
