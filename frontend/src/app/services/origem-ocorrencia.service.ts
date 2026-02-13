import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  OrigemOcorrencia,
  CreateOrigemOcorrenciaDto,
  UpdateOrigemOcorrenciaDto,
} from '../models/origem-ocorrencia.model';

@Injectable({
  providedIn: 'root',
})
export class OrigemOcorrenciaService {
  private readonly apiUrl = `${environment.apiUrl}/origens-ocorrencia`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrigemOcorrencia[]> {
    return this.http.get<OrigemOcorrencia[]>(this.apiUrl);
  }

  getById(id: string): Observable<OrigemOcorrencia> {
    return this.http.get<OrigemOcorrencia>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateOrigemOcorrenciaDto): Observable<OrigemOcorrencia> {
    return this.http.post<OrigemOcorrencia>(this.apiUrl, dto);
  }

  update(
    id: string,
    dto: UpdateOrigemOcorrenciaDto,
  ): Observable<OrigemOcorrencia> {
    return this.http.patch<OrigemOcorrencia>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
