import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  IrregularidadeAudioResumo,
  IrregularidadeImagemResumo,
  IrregularidadeResumo,
  VistoriaResumo,
} from '../models/vistoria.model';

@Injectable({
  providedIn: 'root',
})
export class VistoriaService {
  private readonly apiUrl = `${environment.apiUrl}/vistoria`;

  constructor(private http: HttpClient) {}

  listar(params?: { status?: string; idusuario?: string }): Observable<VistoriaResumo[]> {
    let httpParams = new HttpParams();
    if (params?.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params?.idusuario) {
      httpParams = httpParams.set('idusuario', params.idusuario);
    }
    return this.http.get<VistoriaResumo[]>(this.apiUrl, { params: httpParams });
  }

  buscarPorId(id: string): Observable<VistoriaResumo> {
    return this.http.get<VistoriaResumo>(`${this.apiUrl}/${id}`);
  }

  listarIrregularidades(id: string): Observable<IrregularidadeResumo[]> {
    return this.http.get<IrregularidadeResumo[]>(
      `${this.apiUrl}/${id}/irregularidades`,
    );
  }

  listarIrregularidadesImagens(id: string): Observable<IrregularidadeImagemResumo[]> {
    return this.http.get<IrregularidadeImagemResumo[]>(
      `${this.apiUrl}/${id}/irregularidades/imagens`,
    );
  }

  listarIrregularidadesAudios(id: string): Observable<IrregularidadeAudioResumo[]> {
    return this.http.get<IrregularidadeAudioResumo[]>(
      `${this.apiUrl}/${id}/irregularidades/audios`,
    );
  }
}
