import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CancelarPayload,
  ListarIrregularidadeFiltros,
  IniciarManutencaoPayload,
  IniciarManutencaoLotePayload,
  IrregularidadeHistoricoItem,
  IrregularidadeFluxoItem,
  IrregularidadeFluxoPaginated,
  RelatorioManutencaoExecucao,
  RelatorioManutencaoPreview,
  NaoProcedePayload,
  ReclassificarPayload,
  ReprovarFinalPayload,
  StatusIrregularidade,
  ValidacaoFinalPayload,
} from '../models/irregularidade-fluxo.model';

@Injectable({
  providedIn: 'root',
})
export class IrregularidadeService {
  private readonly apiUrl = `${environment.apiUrl}/irregularidades`;

  constructor(private http: HttpClient) {}

  listarPorStatus(
    status: StatusIrregularidade[],
    filtros?: ListarIrregularidadeFiltros,
  ): Observable<IrregularidadeFluxoPaginated> {
    let params = new HttpParams().set('status', status.join(','));
    if (filtros?.ordemServico) {
      params = params.set('ordemServico', filtros.ordemServico);
    }
    if (filtros?.erpCodigoPedido) {
      params = params.set('erpCodigoPedido', filtros.erpCodigoPedido);
    }
    if (filtros?.numOsExterno) {
      params = params.set('numOsExterno', filtros.numOsExterno);
    }
    if (filtros?.numeroVistoria) {
      params = params.set('numeroVistoria', filtros.numeroVistoria);
    }
    if (filtros?.idVeiculo) {
      params = params.set('idVeiculo', filtros.idVeiculo);
    }
    if (filtros?.idEmpresaManutencao) {
      params = params.set('idEmpresaManutencao', filtros.idEmpresaManutencao);
    }
    if (filtros?.gravidade?.length) {
      params = params.set('gravidade', filtros.gravidade.join(','));
    }
    if (filtros?.dataInicio) {
      params = params.set('dataInicio', filtros.dataInicio);
    }
    if (filtros?.dataFim) {
      params = params.set('dataFim', filtros.dataFim);
    }
    if (filtros?.referenciaPeriodo) {
      params = params.set('referenciaPeriodo', filtros.referenciaPeriodo);
    }
    if (filtros?.origemRegistro) {
      params = params.set('origemRegistro', filtros.origemRegistro);
    }
    if (filtros?.idArea) {
      params = params.set('idArea', filtros.idArea);
    }
    if (filtros?.idComponente) {
      params = params.set('idComponente', filtros.idComponente);
    }
    if (filtros?.idSintoma) {
      params = params.set('idSintoma', filtros.idSintoma);
    }
    if (filtros?.page != null) {
      params = params.set('page', String(filtros.page));
    }
    if (filtros?.limit != null) {
      params = params.set('limit', String(filtros.limit));
    }
    return this.http.get<IrregularidadeFluxoPaginated>(this.apiUrl, { params });
  }

  reclassificar(id: string, payload: ReclassificarPayload): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(
      `${this.apiUrl}/${id}/reclassificar`,
      payload,
    );
  }

  cancelar(id: string, payload: CancelarPayload): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(`${this.apiUrl}/${id}/cancelar`, payload);
  }

  cancelarOsBrt(id: string, payload: CancelarPayload): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(
      `${this.apiUrl}/${id}/cancelar-os-brt`,
      payload,
    );
  }

  iniciarManutencao(
    id: string,
    payload: IniciarManutencaoPayload,
  ): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(
      `${this.apiUrl}/${id}/iniciar-manutencao`,
      payload,
    );
  }

  concluirManutencao(
    id: string,
    payload: ValidacaoFinalPayload = {},
  ): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(
      `${this.apiUrl}/${id}/concluir-manutencao`,
      payload,
    );
  }

  marcarNaoProcede(
    id: string,
    payload: NaoProcedePayload,
  ): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(`${this.apiUrl}/${id}/nao-procede`, payload);
  }

  validarFinal(
    id: string,
    payload: ValidacaoFinalPayload = {},
  ): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(`${this.apiUrl}/${id}/validar-final`, payload);
  }

  reprovarFinal(
    id: string,
    payload: ReprovarFinalPayload,
  ): Observable<IrregularidadeFluxoItem> {
    return this.http.post<IrregularidadeFluxoItem>(`${this.apiUrl}/${id}/reprovar-final`, payload);
  }

  listarHistorico(id: string): Observable<IrregularidadeHistoricoItem[]> {
    return this.http.get<IrregularidadeHistoricoItem[]>(`${this.apiUrl}/${id}/historico`);
  }

  previewIniciarManutencaoLote(
    payload: IniciarManutencaoLotePayload,
  ): Observable<RelatorioManutencaoPreview> {
    return this.http.post<RelatorioManutencaoPreview>(
      `${this.apiUrl}/lote/iniciar-manutencao/preview`,
      payload,
    );
  }

  previewPdfIniciarManutencaoLote(payload: IniciarManutencaoLotePayload): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/lote/iniciar-manutencao/preview-pdf`, payload, {
      responseType: 'blob',
    });
  }

  gerarRelatorioPdfLote(idsIrregularidades: string[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/lote/relatorio-pdf`,
      { idsIrregularidades },
      { responseType: 'blob' },
    );
  }

  iniciarManutencaoLote(
    payload: IniciarManutencaoLotePayload,
  ): Observable<RelatorioManutencaoExecucao> {
    return this.http.post<RelatorioManutencaoExecucao>(
      `${this.apiUrl}/lote/iniciar-manutencao`,
      payload,
    );
  }
}

