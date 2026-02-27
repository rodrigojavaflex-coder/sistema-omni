import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AreaVistoriada,
  CreateAreaVistoriadaDto,
  UpdateAreaVistoriadaDto,
  SetAreaComponentesDto,
  AreaComponente,
  ComponenteComArea,
} from '../models/area-vistoriada.model';

@Injectable({
  providedIn: 'root',
})
export class AreaVistoriadaService {
  private readonly apiUrl = `${environment.apiUrl}/areas`;

  constructor(private http: HttpClient) {}

  getAll(idmodelo?: string, ativo?: boolean): Observable<AreaVistoriada[]> {
    let params = new HttpParams();
    if (idmodelo) {
      params = params.set('idmodelo', idmodelo);
    }
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }
    return this.http.get<AreaVistoriada[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<AreaVistoriada> {
    return this.http.get<AreaVistoriada>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateAreaVistoriadaDto): Observable<AreaVistoriada> {
    return this.http.post<AreaVistoriada>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateAreaVistoriadaDto): Observable<AreaVistoriada> {
    return this.http.patch<AreaVistoriada>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  listComponentes(id: string): Observable<AreaComponente[]> {
    return this.http.get<AreaComponente[]>(`${this.apiUrl}/${id}/componentes`);
  }

  getComponentesWithArea(): Observable<ComponenteComArea[]> {
    return this.http.get<ComponenteComArea[]>(`${this.apiUrl}/componentes-com-vinculo`);
  }

  setComponentes(id: string, dto: SetAreaComponentesDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/componentes`, dto);
  }
}
