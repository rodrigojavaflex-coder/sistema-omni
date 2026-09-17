import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ModeloVeiculo,
  ModeloVeiculoVista,
  CreateModeloVeiculoDto,
  UpdateModeloVeiculoDto,
} from '../models/modelo-veiculo.model';
import { VistaMarcacaoApi } from '../models/mapa-avaria.model';

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

  listVistas(idModelo: string, ativo?: boolean): Observable<ModeloVeiculoVista[]> {
    let params = new HttpParams();
    if (ativo !== undefined) {
      params = params.set('ativo', ativo ? 'true' : 'false');
    }
    return this.http.get<ModeloVeiculoVista[]>(`${this.apiUrl}/${idModelo}/vistas`, {
      params,
    });
  }

  getVistaImagem(idModelo: string, vistaId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${idModelo}/vistas/${vistaId}/imagem`, {
      responseType: 'blob',
    });
  }

  createVista(
    idModelo: string,
    idCatalogo: string,
    file: Blob,
    ordem?: number,
  ): Observable<ModeloVeiculoVista> {
    const form = new FormData();
    form.append('idCatalogo', idCatalogo);
    if (ordem !== undefined) {
      form.append('ordem', String(ordem));
    }
    form.append('file', file, 'vista.jpg');
    return this.http.post<ModeloVeiculoVista>(`${this.apiUrl}/${idModelo}/vistas`, form);
  }

  updateVista(
    idModelo: string,
    vistaId: string,
    patch: {
      ordem?: number;
      ativo?: boolean;
    },
  ): Observable<ModeloVeiculoVista> {
    return this.http.patch<ModeloVeiculoVista>(
      `${this.apiUrl}/${idModelo}/vistas/${vistaId}`,
      patch,
    );
  }

  replaceVistaImagem(
    idModelo: string,
    vistaId: string,
    file: Blob,
  ): Observable<ModeloVeiculoVista> {
    const form = new FormData();
    form.append('file', file, 'vista.jpg');
    return this.http.patch<ModeloVeiculoVista>(
      `${this.apiUrl}/${idModelo}/vistas/${vistaId}/imagem`,
      form,
    );
  }

  deleteVista(idModelo: string, vistaId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idModelo}/vistas/${vistaId}`);
  }

  listMarcacoes(
    idVeiculo: string,
    idVista: string,
    somenteAbertas = true,
  ): Observable<VistaMarcacaoApi[]> {
    return this.http.get<VistaMarcacaoApi[]>(
      `${environment.apiUrl}/vistoria/veiculo/${idVeiculo}/vistas/${idVista}/marcacoes`,
      { params: { somenteAbertas: somenteAbertas ? 'true' : 'false' } },
    );
  }
}
