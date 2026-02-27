import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MatrizCriticidade,
  CreateMatrizCriticidadeDto,
  UpdateMatrizCriticidadeDto,
} from '../models/matriz-criticidade.model';

@Injectable({
  providedIn: 'root',
})
export class MatrizCriticidadeService {
  private readonly apiUrl = `${environment.apiUrl}/matriz-criticidade`;

  constructor(private http: HttpClient) {}

  getAll(idcomponente?: string): Observable<MatrizCriticidade[]> {
    let params = new HttpParams();
    if (idcomponente) {
      params = params.set('idcomponente', idcomponente);
    }
    return this.http.get<MatrizCriticidade[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<MatrizCriticidade> {
    return this.http.get<MatrizCriticidade>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateMatrizCriticidadeDto): Observable<MatrizCriticidade> {
    return this.http.post<MatrizCriticidade>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateMatrizCriticidadeDto): Observable<MatrizCriticidade> {
    return this.http.patch<MatrizCriticidade>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
