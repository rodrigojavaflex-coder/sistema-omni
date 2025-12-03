import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MetaExecucao,
  CreateMetaExecucaoDto,
  UpdateMetaExecucaoDto,
} from '../models/meta.model';

@Injectable({ providedIn: 'root' })
export class MetaExecucaoService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/metas`;

  getByMeta(metaId: string): Observable<MetaExecucao[]> {
    return this.http.get<MetaExecucao[]>(`${this.apiUrl}/${metaId}/execucoes`);
  }

  create(metaId: string, dto: CreateMetaExecucaoDto): Observable<MetaExecucao> {
    return this.http.post<MetaExecucao>(`${this.apiUrl}/${metaId}/execucoes`, dto);
  }

  update(metaId: string, execucaoId: string, dto: UpdateMetaExecucaoDto): Observable<MetaExecucao> {
    return this.http.patch<MetaExecucao>(`${this.apiUrl}/${metaId}/execucoes/${execucaoId}`, dto);
  }

  delete(metaId: string, execucaoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${metaId}/execucoes/${execucaoId}`);
  }
}

