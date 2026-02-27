import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Sintoma,
  CreateSintomaDto,
  UpdateSintomaDto,
} from '../models/sintoma.model';

@Injectable({
  providedIn: 'root',
})
export class SintomaService {
  private readonly apiUrl = `${environment.apiUrl}/sintomas`;

  constructor(private http: HttpClient) {}

  getAll(ativo?: boolean): Observable<Sintoma[]> {
    let params = new HttpParams();
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }
    return this.http.get<Sintoma[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Sintoma> {
    return this.http.get<Sintoma>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateSintomaDto): Observable<Sintoma> {
    return this.http.post<Sintoma>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateSintomaDto): Observable<Sintoma> {
    return this.http.patch<Sintoma>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
