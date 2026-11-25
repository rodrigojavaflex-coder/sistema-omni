import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateIndicadorExecucaoDto,
  IndicadorExecucao,
  UpdateIndicadorExecucaoDto,
} from '../models/indicador.model';

@Injectable({ providedIn: 'root' })
export class IndicadorExecucaoService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/indicadores`;

  getByIndicador(indicadorId: string): Observable<IndicadorExecucao[]> {
    return this.http.get<IndicadorExecucao[]>(
      `${this.apiUrl}/${indicadorId}/execucoes`,
    );
  }

  create(
    indicadorId: string,
    dto: CreateIndicadorExecucaoDto,
  ): Observable<IndicadorExecucao> {
    return this.http.post<IndicadorExecucao>(
      `${this.apiUrl}/${indicadorId}/execucoes`,
      dto,
    );
  }

  update(
    indicadorId: string,
    execucaoId: string,
    dto: UpdateIndicadorExecucaoDto,
  ): Observable<IndicadorExecucao> {
    return this.http.patch<IndicadorExecucao>(
      `${this.apiUrl}/${indicadorId}/execucoes/${execucaoId}`,
      dto,
    );
  }

  delete(indicadorId: string, execucaoId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${indicadorId}/execucoes/${execucaoId}`,
    );
  }
}
