import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  IrregularidadeAudioResumo,
  IrregularidadeImagemResumo,
  IrregularidadeResumo,
  SosSessaoAberta,
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

  buscarSosSessaoAberta(): Observable<SosSessaoAberta | null> {
    return this.http.get<SosSessaoAberta | null>(`${this.apiUrl}/sos/sessao-aberta`);
  }

  criarVistoriaSos(payload: {
    idveiculo: string;
    idmotorista: string;
    odometro: number;
    porcentagembateria?: number;
    observacao?: string;
  }): Observable<VistoriaResumo> {
    return this.http.post<VistoriaResumo>(`${this.apiUrl}/sos`, payload);
  }

  getUltimoOdometro(
    idVeiculo: string,
    ignorarVistoriaId?: string,
  ): Observable<{ odometro: number; datavistoria: string } | null> {
    let params = new HttpParams();
    if (ignorarVistoriaId) {
      params = params.set('ignorarVistoriaId', ignorarVistoriaId);
    }
    return this.http.get<{ odometro: number; datavistoria: string } | null>(
      `${this.apiUrl}/veiculo/${idVeiculo}/ultimo-odometro`,
      { params },
    );
  }

  listarIrregularidadesPendentes(idVeiculo: string): Observable<IrregularidadeResumo[]> {
    return this.http.get<IrregularidadeResumo[]>(
      `${this.apiUrl}/veiculo/${idVeiculo}/irregularidades-pendentes`,
    );
  }

  finalizarVistoria(
    vistoriaId: string,
    payload: { tempo: number; observacao?: string },
  ): Observable<VistoriaResumo> {
    return this.http.post<VistoriaResumo>(
      `${this.apiUrl}/${vistoriaId}/finalizar`,
      payload,
    );
  }

  cancelarVistoria(vistoriaId: string): Observable<VistoriaResumo> {
    return this.http.post<VistoriaResumo>(`${this.apiUrl}/${vistoriaId}/cancelar`, {});
  }

  criarIrregularidade(
    vistoriaId: string,
    payload: {
      idarea: string;
      idcomponente: string;
      idsintoma: string;
      observacao: string;
    },
  ): Observable<IrregularidadeResumo & { id: string; numeroIrregularidade?: number }> {
    return this.http.post<IrregularidadeResumo & { id: string; numeroIrregularidade?: number }>(
      `${this.apiUrl}/${vistoriaId}/irregularidades`,
      payload,
    );
  }

  uploadIrregularidadeImagens(
    irregularidadeId: string,
    files: File[],
  ): Observable<unknown> {
    const form = new FormData();
    files.forEach((file) => form.append('files', file, file.name));
    return this.http.post(
      `${environment.apiUrl}/irregularidades/${irregularidadeId}/imagens`,
      form,
    );
  }

  uploadIrregularidadeAudio(
    irregularidadeId: string,
    file: File,
  ): Observable<unknown> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post(
      `${environment.apiUrl}/irregularidades/${irregularidadeId}/audio`,
      form,
    );
  }
}
