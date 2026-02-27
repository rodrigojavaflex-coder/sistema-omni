import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ModeloVeiculo,
  CreateModeloVeiculoDto,
  UpdateModeloVeiculoDto,
} from '../models/modelo-veiculo.model';

@Injectable({ providedIn: 'root' })
export class ModeloVeiculoService {
  private readonly apiUrl = `${environment.apiUrl}/modelos-veiculo`;

  constructor(private http: HttpClient) {}

  getAll(ativo?: boolean): Observable<ModeloVeiculo[]> {
    let params = new HttpParams();
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }
    return this.http.get<ModeloVeiculo[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ModeloVeiculo> {
    return this.http.get<ModeloVeiculo>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateModeloVeiculoDto): Observable<ModeloVeiculo> {
    return this.http.post<ModeloVeiculo>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateModeloVeiculoDto): Observable<ModeloVeiculo> {
    return this.http.patch<ModeloVeiculo>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
