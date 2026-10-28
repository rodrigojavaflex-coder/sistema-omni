import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  IrregularidadeFluxoItem,
  IrregularidadeFluxoPaginated,
  IrregularidadeHistoricoItem,
  ReprovarFinalPayload,
  StatusIrregularidade,
  ValidacaoFinalPayload,
} from '../models/irregularidade-fluxo.model';

@Injectable({ providedIn: 'root' })
export class IrregularidadeService {
  private http = inject(HttpClient);
  private apiBaseUrl =
    Capacitor.getPlatform() !== 'web'
      ? environment.apiUrlNative || environment.apiUrl
      : environment.apiUrl;
  private readonly apiUrl = `${this.apiBaseUrl}/irregularidades`;

  async listarPorStatus(
    status: StatusIrregularidade[],
    filtros?: {
      idVeiculo?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<IrregularidadeFluxoPaginated> {
    let params = new HttpParams().set('status', status.join(','));
    if (filtros?.idVeiculo) {
      params = params.set('idVeiculo', filtros.idVeiculo);
    }
    if (filtros?.page != null) {
      params = params.set('page', String(filtros.page));
    }
    if (filtros?.limit != null) {
      params = params.set('limit', String(filtros.limit));
    }
    return firstValueFrom(
      this.http.get<IrregularidadeFluxoPaginated>(this.apiUrl, { params }),
    );
  }

  async listarHistorico(id: string): Promise<IrregularidadeHistoricoItem[]> {
    return firstValueFrom(
      this.http.get<IrregularidadeHistoricoItem[]>(
        `${this.apiUrl}/${id}/historico`,
      ),
    );
  }

  async validarFinal(
    id: string,
    payload: ValidacaoFinalPayload = {},
  ): Promise<IrregularidadeFluxoItem> {
    return firstValueFrom(
      this.http.post<IrregularidadeFluxoItem>(
        `${this.apiUrl}/${id}/validar-final`,
        payload,
      ),
    );
  }

  async reprovarFinal(
    id: string,
    payload: ReprovarFinalPayload,
  ): Promise<IrregularidadeFluxoItem> {
    return firstValueFrom(
      this.http.post<IrregularidadeFluxoItem>(
        `${this.apiUrl}/${id}/reprovar-final`,
        payload,
      ),
    );
  }
}
