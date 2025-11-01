import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOcorrenciaDto, UpdateOcorrenciaDto, FindOcorrenciaDto, Ocorrencia, OcorrenciaListResponse } from '../models/ocorrencia.model';

@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  constructor(private http: HttpClient) {}

  getOcorrencias(find?: FindOcorrenciaDto): Observable<OcorrenciaListResponse> {
    let params = new HttpParams();
    if (find) {
      if (find.page) params = params.set('page', find.page.toString());
      if (find.limit) params = params.set('limit', find.limit.toString());
      if (find.tipo && find.tipo.length > 0) {
        find.tipo.forEach(t => {
          params = params.append('tipo', t);
        });
      }
      if (find.linha && find.linha.length > 0) {
        find.linha.forEach(l => {
          params = params.append('linha', l);
        });
      }
      if (find.dataInicio) params = params.set('dataInicio', find.dataInicio);
      if (find.dataFim) params = params.set('dataFim', find.dataFim);
      if (find.idVeiculo) params = params.set('idVeiculo', find.idVeiculo);
      if (find.idMotorista) params = params.set('idMotorista', find.idMotorista);
      if (find.arco && find.arco.length > 0) {
        find.arco.forEach(a => {
          params = params.append('arco', a);
        });
      }
      if (find.sentidoVia && find.sentidoVia.length > 0) {
        find.sentidoVia.forEach(s => {
          params = params.append('sentidoVia', s);
        });
      }
      if (find.tipoLocal && find.tipoLocal.length > 0) {
        find.tipoLocal.forEach(t => {
          params = params.append('tipoLocal', t);
        });
      }
      if (find.culpabilidade && find.culpabilidade.length > 0) {
        find.culpabilidade.forEach(c => {
          params = params.append('culpabilidade', c);
        });
      }
      if (find.houveVitimas && find.houveVitimas.length > 0) {
        find.houveVitimas.forEach(h => {
          params = params.append('houveVitimas', h);
        });
      }
      if (find.terceirizado && find.terceirizado.length > 0) {
        find.terceirizado.forEach(t => {
          params = params.append('terceirizado', t);
        });
      }
    }
    return this.http.get<OcorrenciaListResponse>(`${environment.apiUrl}/ocorrencias`, { params });
  }

  getById(id: string): Observable<Ocorrencia> {
    return this.http.get<Ocorrencia>(`${environment.apiUrl}/ocorrencias/${id}`);
  }

  create(dto: CreateOcorrenciaDto): Observable<Ocorrencia> {
    return this.http.post<Ocorrencia>(`${environment.apiUrl}/ocorrencias`, dto);
  }

  update(id: string, dto: UpdateOcorrenciaDto): Observable<Ocorrencia> {
    return this.http.patch<Ocorrencia>(`${environment.apiUrl}/ocorrencias/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ocorrencias/${id}`);
  }

  getStatistics(dataInicio?: string, dataFim?: string): Observable<any> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<any>(`${environment.apiUrl}/ocorrencias/statistics`, { params });
  }

  findByLocation(latitude: number, longitude: number, radius?: number): Observable<Ocorrencia[]> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    if (radius) params = params.set('radius', radius.toString());
    return this.http.get<Ocorrencia[]>(`${environment.apiUrl}/ocorrencias/nearby`, { params });
  }
}
