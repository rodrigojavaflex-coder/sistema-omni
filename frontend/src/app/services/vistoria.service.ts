import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ChecklistImagemResumo,
  ChecklistItemResumo,
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

  listarChecklist(id: string): Observable<ChecklistItemResumo[]> {
    return this.http.get<ChecklistItemResumo[]>(`${this.apiUrl}/${id}/checklist`);
  }

  listarChecklistImagens(id: string): Observable<ChecklistImagemResumo[]> {
    return this.http.get<ChecklistImagemResumo[]>(
      `${this.apiUrl}/${id}/checklist/imagens`,
    );
  }
}
