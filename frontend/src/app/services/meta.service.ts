import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Meta, CreateMetaDto, UpdateMetaDto, MetaDashboardCard } from '../models/meta.model';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/metas`;

  getAll(): Observable<Meta[]> {
    return this.http.get<Meta[]>(this.apiUrl);
  }

  getDashboardCards(): Observable<MetaDashboardCard[]> {
    return this.http.get<MetaDashboardCard[]>(`${this.apiUrl}/dashboard`);
  }

  getById(id: string): Observable<Meta> {
    return this.http.get<Meta>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateMetaDto): Observable<Meta> {
    return this.http.post<Meta>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateMetaDto): Observable<Meta> {
    return this.http.patch<Meta>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
