import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateVeiculoDto, UpdateVeiculoDto, FindVeiculoDto, Veiculo } from '../models';
import { PaginatedResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  constructor(private http: HttpClient) {}

  getVeiculos(find?: FindVeiculoDto): Observable<PaginatedResponse<Veiculo>> {
    let params = new HttpParams();
    if (find) {
      if (find.page) params = params.set('page', find.page.toString());
      if (find.limit) params = params.set('limit', find.limit.toString());
      if (find.descricao) params = params.set('descricao', find.descricao);
      if (find.placa) params = params.set('placa', find.placa);
      if (find.ano) params = params.set('ano', find.ano.toString());
    }
    return this.http.get<PaginatedResponse<Veiculo>>(`${environment.apiUrl}/veiculo`, { params });
  }

  getById(id: string) {
    return this.http.get<Veiculo>(`${environment.apiUrl}/veiculo/${id}`);
  }

  create(dto: CreateVeiculoDto) {
    return this.http.post<Veiculo>(`${environment.apiUrl}/veiculo`, dto);
  }

  update(id: string, dto: UpdateVeiculoDto) {
    return this.http.patch<Veiculo>(`${environment.apiUrl}/veiculo/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/veiculo/${id}`);
  }
}
