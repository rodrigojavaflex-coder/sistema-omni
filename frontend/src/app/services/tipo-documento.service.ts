import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateTipoDocumentoDto,
  TipoDocumento,
  UpdateTipoDocumentoDto,
} from '../models/tipo-documento.model';

@Injectable({ providedIn: 'root' })
export class TipoDocumentoService {
  private readonly apiUrl = `${environment.apiUrl}/tipos-documento`;

  constructor(private readonly http: HttpClient) {}

  getAll(nome?: string, apenasAtivos?: boolean): Observable<TipoDocumento[]> {
    let params = new HttpParams();
    if (nome?.trim()) {
      params = params.set('nome', nome.trim());
    }
    if (apenasAtivos) {
      params = params.set('apenasAtivos', 'true');
    }
    return this.http.get<TipoDocumento[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<TipoDocumento> {
    return this.http.get<TipoDocumento>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTipoDocumentoDto): Observable<TipoDocumento> {
    return this.http.post<TipoDocumento>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateTipoDocumentoDto): Observable<TipoDocumento> {
    return this.http.patch<TipoDocumento>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
