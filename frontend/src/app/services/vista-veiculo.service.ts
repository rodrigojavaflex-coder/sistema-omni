import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  VistaVeiculo,
  CreateVistaVeiculoDto,
  UpdateVistaVeiculoDto,
} from '../models/vista-veiculo.model';

@Injectable({
  providedIn: 'root',
})
export class VistaVeiculoService {
  private readonly apiUrl = `${environment.apiUrl}/vistas-veiculo`;

  constructor(private http: HttpClient) {}

  getAll(ativo?: boolean): Observable<VistaVeiculo[]> {
    let params = new HttpParams();
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }
    return this.http.get<VistaVeiculo[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<VistaVeiculo> {
    return this.http.get<VistaVeiculo>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateVistaVeiculoDto): Observable<VistaVeiculo> {
    return this.http.post<VistaVeiculo>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateVistaVeiculoDto): Observable<VistaVeiculo> {
    return this.http.patch<VistaVeiculo>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
