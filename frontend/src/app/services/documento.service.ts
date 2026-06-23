import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AtivarCompartilhamentoPayload,
  CreateDocumentoPayload,
  DocumentoFilters,
  DocumentoPublicoResumo,
  DocumentoResumo,
  UpdateDocumentoPayload,
} from '../models/documento.model';
import { buildAppUrl } from '../utils/app-base-path.util';

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  private readonly apiUrl = `${environment.apiUrl}/documentos`;
  private readonly publicApiUrl = `${environment.apiUrl}/documentos/publico`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: DocumentoFilters = {}): Observable<DocumentoResumo[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<DocumentoResumo[]>(this.apiUrl, { params });
  }

  getById(id: string): Observable<DocumentoResumo> {
    return this.http.get<DocumentoResumo>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateDocumentoPayload): Observable<DocumentoResumo> {
    const formData = new FormData();
    formData.append('nomeDocumento', payload.nomeDocumento);
    if (payload.detalhesDocumento?.trim()) {
      formData.append('detalhesDocumento', payload.detalhesDocumento.trim());
    }
    formData.append('tipoDocumentoId', payload.tipoDocumentoId);
    formData.append('departamentoId', payload.departamentoId);
    formData.append('responsavelId', payload.responsavelId);
    if (payload.status) {
      formData.append('status', payload.status);
    }
    formData.append('arquivo', payload.arquivo);
    return this.http.post<DocumentoResumo>(this.apiUrl, formData);
  }

  update(id: string, payload: UpdateDocumentoPayload): Observable<DocumentoResumo> {
    return this.http.patch<DocumentoResumo>(`${this.apiUrl}/${id}`, payload);
  }

  replaceArquivo(id: string, arquivo: File): Observable<DocumentoResumo> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.patch<DocumentoResumo>(`${this.apiUrl}/${id}/arquivo`, formData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  downloadArquivo(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/arquivo`, {
      responseType: 'blob',
    });
  }

  ativarCompartilhamento(
    id: string,
    payload: AtivarCompartilhamentoPayload = {},
  ): Observable<DocumentoResumo> {
    return this.http.post<DocumentoResumo>(
      `${this.apiUrl}/${id}/compartilhamento/ativar`,
      payload,
    );
  }

  desativarCompartilhamento(id: string): Observable<DocumentoResumo> {
    return this.http.post<DocumentoResumo>(
      `${this.apiUrl}/${id}/compartilhamento/desativar`,
      {},
    );
  }

  regenerarCompartilhamento(
    id: string,
    payload: AtivarCompartilhamentoPayload = {},
  ): Observable<DocumentoResumo> {
    return this.http.post<DocumentoResumo>(
      `${this.apiUrl}/${id}/compartilhamento/regenerar`,
      payload,
    );
  }

  getPublico(token: string): Observable<DocumentoPublicoResumo> {
    return this.http.get<DocumentoPublicoResumo>(`${this.publicApiUrl}/${token}`);
  }

  downloadPublico(token: string): Observable<Blob> {
    return this.http.get(`${this.publicApiUrl}/${token}/arquivo`, {
      responseType: 'blob',
    });
  }

  buildPublicLink(token: string): string {
    return buildAppUrl(`/documentos/publico/${token}`);
  }
}
