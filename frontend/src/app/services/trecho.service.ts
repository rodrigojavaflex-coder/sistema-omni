import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Trecho, CreateTrechoDto, UpdateTrechoDto } from '../models/trecho.model';

export interface TrechoListResponse {
  data: Trecho[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class TrechoService {
  private readonly apiUrl = `${environment.apiUrl}/trechos`;

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1,
    limit: number = 10,
    descricao?: string
  ): Observable<TrechoListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('orderBy', 'atualizadoEm')
      .set('order', 'DESC');

    if (descricao) {
      params = params.set('descricao', descricao);
    }

    return this.http.get<TrechoListResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Trecho> {
    return this.http.get<Trecho>(`${this.apiUrl}/${id}`);
  }

  create(trecho: CreateTrechoDto): Observable<Trecho> {
    return this.http.post<Trecho>(this.apiUrl, trecho);
  }

  update(id: string, trecho: UpdateTrechoDto): Observable<Trecho> {
    return this.http.patch<Trecho>(`${this.apiUrl}/${id}`, trecho);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findByLocation(latitude: number, longitude: number): Observable<Trecho[]> {
    return this.http.get<Trecho[]>(
      `${this.apiUrl}/by-location/${latitude}/${longitude}`
    );
  }
}
