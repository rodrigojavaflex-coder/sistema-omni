import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateIndicadorDto,
  Indicador,
  IndicadorDashboardCard,
  UpdateIndicadorDto,
} from '../models/indicador.model';

@Injectable({ providedIn: 'root' })
export class IndicadorService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/indicadores`;

  getAll(): Observable<Indicador[]> {
    return this.http.get<Indicador[]>(this.apiUrl);
  }

  getDashboardCards(ano?: number): Observable<IndicadorDashboardCard[]> {
    let params = new HttpParams();
    if (ano != null) {
      params = params.set('ano', String(ano));
    }
    return this.http.get<IndicadorDashboardCard[]>(`${this.apiUrl}/dashboard`, {
      params,
    });
  }

  getById(id: string): Observable<Indicador> {
    return this.http.get<Indicador>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateIndicadorDto): Observable<Indicador> {
    return this.http.post<Indicador>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateIndicadorDto): Observable<Indicador> {
    return this.http.patch<Indicador>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
