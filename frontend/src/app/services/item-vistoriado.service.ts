import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ItemVistoriado,
  CreateItemVistoriadoDto,
  UpdateItemVistoriadoDto,
} from '../models/item-vistoriado.model';

@Injectable({
  providedIn: 'root',
})
export class ItemVistoriadoService {
  private readonly apiUrl = `${environment.apiUrl}/itensvistoriados`;

  constructor(private http: HttpClient) {}

  getAll(tipovistoriaId?: string, ativo?: boolean): Observable<ItemVistoriado[]> {
    let params = new HttpParams();

    if (tipovistoriaId) {
      params = params.set('tipovistoria', tipovistoriaId);
    }
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }

    return this.http.get<ItemVistoriado[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ItemVistoriado> {
    return this.http.get<ItemVistoriado>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateItemVistoriadoDto): Observable<ItemVistoriado> {
    return this.http.post<ItemVistoriado>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateItemVistoriadoDto): Observable<ItemVistoriado> {
    return this.http.patch<ItemVistoriado>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
