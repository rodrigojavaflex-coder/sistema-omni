import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Configuracao,
  CreateConfiguracaoDto,
  TempoFluxoConfig,
  UpdateConfiguracaoDto,
} from '../models/configuracao.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private readonly apiUrl = `${environment.apiUrl}/configuracao`;

  constructor(private http: HttpClient) {}

  getConfiguracao(): Observable<Configuracao> {
    return this.http.get<Configuracao>(this.apiUrl);
  }

  createConfiguracao(data: FormData): Observable<Configuracao> {
    return this.http.post<Configuracao>(this.apiUrl, data);
  }

  updateConfiguracao(id: string, data: FormData): Observable<Configuracao> {
    return this.http.put<Configuracao>(`${this.apiUrl}/${id}`, data);
  }

  getTempoFluxoConfig(): Observable<TempoFluxoConfig> {
    return this.http.get<TempoFluxoConfig>(`${this.apiUrl}/tempo-fluxo`);
  }

  updateTempoFluxoConfig(tempoFluxoConfig: TempoFluxoConfig): Observable<TempoFluxoConfig> {
    return this.http.put<TempoFluxoConfig>(`${this.apiUrl}/tempo-fluxo`, {
      tempoFluxoConfig,
    });
  }
}
