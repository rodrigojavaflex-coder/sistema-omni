import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Motorista, CreateMotoristaDto, UpdateMotoristaDto } from '../models/motorista.model';

export interface MotoristaListResponse {
  data: Motorista[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private readonly apiUrl = `${environment.apiUrl}/motoristas`;

  constructor(private http: HttpClient) {}

  getAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string,
    nome?: string,
    matricula?: string,
    cpf?: string,
    status?: string
  ): Observable<MotoristaListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (nome) {
      params = params.set('nome', nome);
    }
    if (matricula) {
      params = params.set('matricula', matricula);
    }
    if (cpf) {
      params = params.set('cpf', cpf);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<MotoristaListResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Motorista> {
    return this.http.get<Motorista>(`${this.apiUrl}/${id}`);
  }

  create(motorista: CreateMotoristaDto): Observable<Motorista> {
    return this.http.post<Motorista>(this.apiUrl, motorista);
  }

  update(id: string, motorista: UpdateMotoristaDto): Observable<Motorista> {
    return this.http.patch<Motorista>(`${this.apiUrl}/${id}`, motorista);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
