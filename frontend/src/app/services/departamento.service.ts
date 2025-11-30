import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Departamento, CreateDepartamentoDto, UpdateDepartamentoDto } from '../models/departamento.model';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/departamentos`;

  getAll(nome?: string): Observable<Departamento[]> {
    const params: any = {};
    if (nome) params.nome = nome;
    return this.http.get<Departamento[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateDepartamentoDto): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateDepartamentoDto): Observable<Departamento> {
    return this.http.patch<Departamento>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
