import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Componente,
  CreateComponenteDto,
  UpdateComponenteDto,
} from '../models/componente.model';

@Injectable({
  providedIn: 'root',
})
export class ComponenteService {
  private readonly apiUrl = `${environment.apiUrl}/componentes`;

  constructor(private http: HttpClient) {}

  getAll(ativo?: boolean): Observable<Componente[]> {
    let params = new HttpParams();
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }
    return this.http.get<Componente[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Componente> {
    return this.http.get<Componente>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateComponenteDto): Observable<Componente> {
    return this.http.post<Componente>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateComponenteDto): Observable<Componente> {
    return this.http.patch<Componente>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
