import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EmpresaTerceira,
  CreateEmpresaTerceiraDto,
  UpdateEmpresaTerceiraDto,
} from '../models/empresa-terceira.model';

@Injectable({
  providedIn: 'root',
})
export class EmpresaTerceiraService {
  private readonly apiUrl = `${environment.apiUrl}/empresas-terceiras`;

  constructor(private http: HttpClient) {}

  getAll(options?: { somenteManutencao?: boolean }): Observable<EmpresaTerceira[]> {
    let params = new HttpParams();
    if (options?.somenteManutencao) {
      params = params.set('manutencao', 'true');
    }
    return this.http.get<EmpresaTerceira[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<EmpresaTerceira> {
    return this.http.get<EmpresaTerceira>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateEmpresaTerceiraDto): Observable<EmpresaTerceira> {
    return this.http.post<EmpresaTerceira>(this.apiUrl, dto);
  }

  update(
    id: string,
    dto: UpdateEmpresaTerceiraDto,
  ): Observable<EmpresaTerceira> {
    return this.http.patch<EmpresaTerceira>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
