import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  BiAcessoLink,
  BiAcessoMenuItem,
  BiAcessoViewer,
  CreateBiAcessoLinkDto,
  UpdateBiAcessoLinkDto,
} from '../models/bi-acesso-link.model';

@Injectable({
  providedIn: 'root',
})
export class BiAcessoLinkService {
  private readonly apiUrl = `${environment.apiUrl}/bi-acesso-links`;

  constructor(private readonly http: HttpClient) {}

  getAll(includeInactive = true): Observable<BiAcessoLink[]> {
    const params = new HttpParams().set('includeInactive', String(includeInactive));
    return this.http.get<BiAcessoLink[]>(this.apiUrl, { params });
  }

  getMyMenu(): Observable<BiAcessoMenuItem[]> {
    return this.http.get<BiAcessoMenuItem[]>(`${this.apiUrl}/my-menu`);
  }

  getAccessibleLink(id: string): Observable<BiAcessoViewer> {
    return this.http.get<BiAcessoViewer>(`${this.apiUrl}/${id}/acesso`);
  }

  create(dto: CreateBiAcessoLinkDto): Observable<BiAcessoLink> {
    return this.http.post<BiAcessoLink>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateBiAcessoLinkDto): Observable<BiAcessoLink> {
    return this.http.patch<BiAcessoLink>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
