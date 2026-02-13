import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CategoriaOcorrencia,
  CreateCategoriaOcorrenciaDto,
  UpdateCategoriaOcorrenciaDto,
} from '../models/categoria-ocorrencia.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaOcorrenciaService {
  private readonly apiUrl = `${environment.apiUrl}/categorias-ocorrencia`;

  constructor(private http: HttpClient) {}

  getAll(origemId?: string): Observable<CategoriaOcorrencia[]> {
    let params = new HttpParams();
    if (origemId) {
      params = params.set('origem', origemId);
    }
    return this.http.get<CategoriaOcorrencia[]>(this.apiUrl, { params });
  }

  getByOrigem(origemId: string): Observable<CategoriaOcorrencia[]> {
    return this.getAll(origemId);
  }

  getById(id: string): Observable<CategoriaOcorrencia> {
    return this.http.get<CategoriaOcorrencia>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateCategoriaOcorrenciaDto): Observable<CategoriaOcorrencia> {
    return this.http.post<CategoriaOcorrencia>(this.apiUrl, dto);
  }

  update(
    id: string,
    dto: UpdateCategoriaOcorrenciaDto,
  ): Observable<CategoriaOcorrencia> {
    return this.http.patch<CategoriaOcorrencia>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
