import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { MatrizCriticidade } from '../models/matriz-criticidade.model';

@Injectable({ providedIn: 'root' })
export class MatrizCriticidadeService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async listarPorComponente(componenteId: string): Promise<MatrizCriticidade[]> {
    const matriz = await firstValueFrom(
      this.http.get<MatrizCriticidade[]>(`${this.apiBaseUrl}/matriz-criticidade`, {
        params: { idcomponente: componenteId },
      }),
    );
    return matriz ?? [];
  }
}
