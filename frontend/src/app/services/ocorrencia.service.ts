import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateOcorrenciaDto, UpdateOcorrenciaDto, FindOcorrenciaDto, Ocorrencia, OcorrenciaListResponse } from '../models/ocorrencia.model';
import { HistoricoOcorrencia, UpdateStatusOcorrenciaDto, OcorrenciaStats } from '../models/historico-ocorrencia.model';

@Injectable({ providedIn: 'root' })
export class OcorrenciaService {
  constructor(private http: HttpClient) {}

  getOcorrencias(find?: FindOcorrenciaDto): Observable<OcorrenciaListResponse> {
    let params = new HttpParams();
    if (find) {
      if (find.page) params = params.set('page', find.page.toString());
      if (find.limit) params = params.set('limit', find.limit.toString());
      if (find.tipo && find.tipo.length > 0) {
        find.tipo.forEach(t => {
          params = params.append('tipo', t);
        });
      }
      if (find.linha && find.linha.length > 0) {
        find.linha.forEach(l => {
          params = params.append('linha', l);
        });
      }
      if (find.dataInicio) params = params.set('dataInicio', find.dataInicio);
      if (find.dataFim) params = params.set('dataFim', find.dataFim);
      if (find.idVeiculo) params = params.set('idVeiculo', find.idVeiculo);
      if (find.idMotorista) params = params.set('idMotorista', find.idMotorista);
      if (find.arco && find.arco.length > 0) {
        find.arco.forEach(a => {
          params = params.append('arco', a);
        });
      }
      if (find.sentidoVia && find.sentidoVia.length > 0) {
        find.sentidoVia.forEach(s => {
          params = params.append('sentidoVia', s);
        });
      }
      if (find.tipoLocal && find.tipoLocal.length > 0) {
        find.tipoLocal.forEach(t => {
          params = params.append('tipoLocal', t);
        });
      }
      if (find.culpabilidade && find.culpabilidade.length > 0) {
        find.culpabilidade.forEach(c => {
          params = params.append('culpabilidade', c);
        });
      }
      if (find.houveVitimas && find.houveVitimas.length > 0) {
        find.houveVitimas.forEach(h => {
          params = params.append('houveVitimas', h);
        });
      }
      if (find.terceirizado && find.terceirizado.length > 0) {
        find.terceirizado.forEach(t => {
          params = params.append('terceirizado', t);
        });
      }
      if (find.idOrigem && find.idOrigem.length > 0) {
        find.idOrigem.forEach(id => {
          params = params.append('idOrigem', id);
        });
      }
      if (find.idCategoria && find.idCategoria.length > 0) {
        find.idCategoria.forEach(id => {
          params = params.append('idCategoria', id);
        });
      }
      if (find.numero) params = params.set('numero', find.numero);
      if (find.status && find.status.length > 0) {
        find.status.forEach(s => {
          params = params.append('status', s);
        });
      }
    }
    return this.http.get<OcorrenciaListResponse>(`${environment.apiUrl}/ocorrencias`, { params });
  }

  getById(id: string): Observable<Ocorrencia> {
    return this.http.get<Ocorrencia>(`${environment.apiUrl}/ocorrencias/${id}`);
  }

  /** Verifica se já existe ocorrência para o motorista na mesma data (aviso, não bloqueia). */
  verificarOcorrenciaMotoristaDataHora(
    idMotorista: string,
    dataHora: string,
    idOcorrenciaExcluir?: string,
  ): Observable<{
    existe: boolean;
    numero?: string;
    origem?: string;
    categoria?: string;
  }> {
    let params = new HttpParams()
      .set('idMotorista', idMotorista)
      .set('dataHora', dataHora);
    if (idOcorrenciaExcluir) {
      params = params.set('idOcorrenciaExcluir', idOcorrenciaExcluir);
    }
    return this.http.get<
      { existe: boolean; numero?: string; origem?: string; categoria?: string }
    >(`${environment.apiUrl}/ocorrencias/check-motorista-data`, { params });
  }

  create(dto: CreateOcorrenciaDto): Observable<Ocorrencia> {
    return this.http.post<Ocorrencia>(`${environment.apiUrl}/ocorrencias`, dto);
  }

  update(id: string, dto: UpdateOcorrenciaDto): Observable<Ocorrencia> {
    return this.http.patch<Ocorrencia>(`${environment.apiUrl}/ocorrencias/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/ocorrencias/${id}`);
  }

  getStatistics(dataInicio?: string, dataFim?: string): Observable<any> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<any>(`${environment.apiUrl}/ocorrencias/statistics`, { params });
  }

  findByLocation(latitude: number, longitude: number, radius?: number): Observable<Ocorrencia[]> {
    let params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());
    if (radius) params = params.set('radius', radius.toString());
    return this.http.get<Ocorrencia[]>(`${environment.apiUrl}/ocorrencias/nearby`, { params });
  }

  getHistorico(idOcorrencia: string): Observable<HistoricoOcorrencia[]> {
    return this.http.get<HistoricoOcorrencia[]>(`${environment.apiUrl}/ocorrencias/${idOcorrencia}/historico`);
  }

  updateStatus(idOcorrencia: string, dto: UpdateStatusOcorrenciaDto): Observable<Ocorrencia> {
    return this.http.patch<Ocorrencia>(`${environment.apiUrl}/ocorrencias/${idOcorrencia}/status`, dto);
  }

  updateHistoricoObservacao(idOcorrencia: string, idHistorico: string, observacao?: string): Observable<HistoricoOcorrencia> {
    return this.http.patch<HistoricoOcorrencia>(
      `${environment.apiUrl}/ocorrencias/${idOcorrencia}/historico/${idHistorico}/observacao`,
      { observacao }
    );
  }

  getStats(
    dataInicio?: string,
    dataFim?: string,
    linha?: string[],
    tipo?: string[],
    idOrigem?: string[],
    idCategoria?: string[],
    idVeiculo?: string,
    idMotorista?: string,
    arco?: string[],
    sentidoVia?: string[],
    tipoLocal?: string[],
    culpabilidade?: string[],
    houveVitimas?: string[],
    terceirizado?: string[],
  ): Observable<OcorrenciaStats> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    if (linha && linha.length > 0) {
      linha.forEach(l => params = params.append('linha', l));
    }
    if (tipo && tipo.length > 0) {
      tipo.forEach(t => params = params.append('tipo', t));
    }
    if (idOrigem && idOrigem.length > 0) {
      idOrigem.forEach(id => params = params.append('idOrigem', id));
    }
    if (idCategoria && idCategoria.length > 0) {
      idCategoria.forEach(id => params = params.append('idCategoria', id));
    }
    if (idVeiculo) params = params.set('idVeiculo', idVeiculo);
    if (idMotorista) params = params.set('idMotorista', idMotorista);
    if (arco && arco.length > 0) {
      arco.forEach(a => params = params.append('arco', a));
    }
    if (sentidoVia && sentidoVia.length > 0) {
      sentidoVia.forEach(s => params = params.append('sentidoVia', s));
    }
    if (tipoLocal && tipoLocal.length > 0) {
      tipoLocal.forEach(t => params = params.append('tipoLocal', t));
    }
    if (culpabilidade && culpabilidade.length > 0) {
      culpabilidade.forEach(c => params = params.append('culpabilidade', c));
    }
    if (houveVitimas && houveVitimas.length > 0) {
      houveVitimas.forEach(h => params = params.append('houveVitimas', h));
    }
    if (terceirizado && terceirizado.length > 0) {
      terceirizado.forEach(t => params = params.append('terceirizado', t));
    }
    return this.http.get<OcorrenciaStats>(`${environment.apiUrl}/ocorrencias/stats`, { params });
  }
}
