import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoVistoria } from '../models/tipo-vistoria.model';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class TipoVistoriaService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async getAtivos(): Promise<TipoVistoria[]> {
    const tipos = await firstValueFrom(
      this.http.get<TipoVistoria[]>(`${this.apiBaseUrl}/tiposvistoria`)
    );
    return (tipos ?? []).filter((tipo) => tipo.ativo);
  }
}
