import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EscalaPainelResponse,
  OsRetencaoResponse,
  SyncEscalaResult,
  SyncTelemetriaResult,
  TrocarVeiculoEscalaResult,
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

  syncTelemetria(opcoes?: {
    idEmpresa?: string;
    prefixo?: string;
    idVeiculo?: string;
  }): Observable<SyncTelemetriaResult> {
    let params = new HttpParams();
    if (opcoes?.idEmpresa?.trim()) {
      params = params.set('idEmpresa', opcoes.idEmpresa.trim());
    }
    if (opcoes?.prefixo?.trim()) {
      params = params.set('prefixo', opcoes.prefixo.trim());
    }
    if (opcoes?.idVeiculo?.trim()) {
      params = params.set('idVeiculo', opcoes.idVeiculo.trim());
    }
    return this.http.post<SyncTelemetriaResult>(
      `${this.apiUrl}/sync/telemetria`,
      {},
      { params },
    );
  }

  getOsRetencao(idVeiculo: string): Observable<OsRetencaoResponse> {
    return this.http.get<OsRetencaoResponse>(
      `${this.apiUrl}/veiculo/${idVeiculo}/os-retencao`,
    );
  }

  trocarVeiculo(
    idEscalaDia: string,
    idVeiculo: string,
  ): Observable<TrocarVeiculoEscalaResult> {
    return this.http.patch<TrocarVeiculoEscalaResult>(
      `${this.apiUrl}/escala-dia/${idEscalaDia}/veiculo`,
      { idVeiculo },
    );
  }
}
