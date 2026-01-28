import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  TipoVistoria,
  CreateTipoVistoriaDto,
  UpdateTipoVistoriaDto,
} from '../models/tipo-vistoria.model';

@Injectable({
  providedIn: 'root',
})
export class TipoVistoriaService {
  private readonly apiUrl = `${environment.apiUrl}/tiposvistoria`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoVistoria[]> {
    return this.http.get<TipoVistoria[]>(this.apiUrl);
  }

  getById(id: string): Observable<TipoVistoria> {
    return this.http.get<TipoVistoria>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateTipoVistoriaDto): Observable<TipoVistoria> {
    return this.http.post<TipoVistoria>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateTipoVistoriaDto): Observable<TipoVistoria> {
    return this.http.patch<TipoVistoria>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
