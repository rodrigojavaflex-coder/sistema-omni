import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EscalaPainelResponse,
  SyncEscalaResult,
  SyncTelemetriaResult,
} from '../models/controle-escala.model';

@Injectable({ providedIn: 'root' })
export class ControleEscalaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/controle-escala`;

  getPainel(data: string): Observable<EscalaPainelResponse> {
    const params = new HttpParams().set('data', data);
    return this.http.get<EscalaPainelResponse>(`${this.apiUrl}/painel`, {
      params,
    });
  }

  syncEscala(data: string): Observable<SyncEscalaResult> {
    const params = new HttpParams().set('data', data);
    return this.http.post<SyncEscalaResult>(
      `${this.apiUrl}/sync/escala`,
      {},
      { params },
    );
  }

  syncTelemetria(idEmpresa?: string): Observable<SyncTelemetriaResult> {
    let params = new HttpParams();
    if (idEmpresa?.trim()) {
      params = params.set('idEmpresa', idEmpresa.trim());
    }
    return this.http.post<SyncTelemetriaResult>(
      `${this.apiUrl}/sync/telemetria`,
      {},
      { params },
    );
  }
}
