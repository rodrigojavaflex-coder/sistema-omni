import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { Vistoria } from '../models/vistoria.model';
import {
  IrregularidadeAudioResumo,
  IrregularidadeHistoricoVeiculo,
  IrregularidadeResumo,
  IrregularidadeImagemResumo,
} from '../models/irregularidade.model';

export interface CriarIrregularidadeResponse {
  id: string;
  numeroIrregularidade?: number;
}

@Injectable({ providedIn: 'root' })
export class VistoriaService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async iniciarVistoria(payload: {
    idusuario: string;
    idveiculo: string;
    idmotorista: string;
    odometro: number;
    porcentagembateria?: number;
    datavistoria: string;
  }): Promise<Vistoria> {
    return firstValueFrom(
      this.http.post<Vistoria>(`${this.apiBaseUrl}/vistoria`, payload),
    );
  }

  async atualizarVistoria(
    vistoriaId: string,
    payload: {
      idveiculo?: string;
      idmotorista?: string;
      odometro?: number;
      porcentagembateria?: number | null;
      datavistoria?: string;
    },
  ): Promise<Vistoria> {
    return firstValueFrom(
      this.http.patch<Vistoria>(`${this.apiBaseUrl}/vistoria/${vistoriaId}`, payload),
    );
  }

  async getById(vistoriaId: string): Promise<Vistoria> {
    return firstValueFrom(
      this.http.get<Vistoria>(`${this.apiBaseUrl}/vistoria/${vistoriaId}`),
    );
  }

  async listarIrregularidadesPendentes(idVeiculo: string): Promise<IrregularidadeResumo[]> {
    return firstValueFrom(
      this.http.get<IrregularidadeResumo[]>(
        `${this.apiBaseUrl}/vistoria/veiculo/${idVeiculo}/irregularidades-pendentes`,
      ),
    );
  }

  async listarHistoricoIrregularidadesNaoResolvidas(
    idVeiculo: string,
    filtros?: { areaId?: string; componenteId?: string },
  ): Promise<IrregularidadeHistoricoVeiculo> {
    const params: Record<string, string> = {};
    if (filtros?.areaId) {
      params['areaId'] = filtros.areaId;
    }
    if (filtros?.componenteId) {
      params['componenteId'] = filtros.componenteId;
    }

    return firstValueFrom(
      this.http.get<IrregularidadeHistoricoVeiculo>(
        `${this.apiBaseUrl}/vistoria/veiculo/${idVeiculo}/historico-irregularidades-nao-resolvidas`,
        { params },
      ),
    );
  }

  async getUltimoOdometro(
    idveiculo: string,
    ignorarVistoriaId?: string,
  ): Promise<{ odometro: number; datavistoria: string } | null> {
    return firstValueFrom(
      this.http.get<{ odometro: number; datavistoria: string } | null>(
        `${this.apiBaseUrl}/vistoria/veiculo/${idveiculo}/ultimo-odometro`,
        {
          params: ignorarVistoriaId
            ? { ignorarVistoriaId }
            : {},
        },
      ),
    );
  }

  async criarIrregularidade(
    vistoriaId: string,
    payload: { idarea: string; idcomponente: string; idsintoma: string; observacao?: string },
  ): Promise<CriarIrregularidadeResponse> {
    return firstValueFrom(
      this.http.post<CriarIrregularidadeResponse>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades`,
        payload,
      ),
    );
  }

  async atualizarIrregularidade(
    irregularidadeId: string,
    payload: { observacao?: string; resolvido?: boolean },
  ): Promise<{ id: string }> {
    return firstValueFrom(
      this.http.patch<{ id: string }>(
        `${this.apiBaseUrl}/irregularidades/${irregularidadeId}`,
        payload,
      ),
    );
  }

  async listarIrregularidades(vistoriaId: string): Promise<IrregularidadeResumo[]> {
    return firstValueFrom(
      this.http.get<IrregularidadeResumo[]>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades`,
      ),
    );
  }

  async listarIrregularidadesImagens(
    vistoriaId: string,
    irregularidadeId?: string,
  ): Promise<IrregularidadeImagemResumo[]> {
    const query = irregularidadeId
      ? `?irregularidadeId=${encodeURIComponent(irregularidadeId)}`
      : '';
    return firstValueFrom(
      this.http.get<IrregularidadeImagemResumo[]>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades/imagens${query}`,
      ),
    );
  }

  async listarIrregularidadesAudios(
    vistoriaId: string,
    irregularidadeId?: string,
  ): Promise<IrregularidadeAudioResumo[]> {
    const query = irregularidadeId
      ? `?irregularidadeId=${encodeURIComponent(irregularidadeId)}`
      : '';
    return firstValueFrom(
      this.http.get<IrregularidadeAudioResumo[]>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades/audios${query}`,
      ),
    );
  }

  async uploadIrregularidadeImagens(
    irregularidadeId: string,
    files: { nomeArquivo: string; blob: Blob }[],
  ): Promise<void> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file.blob, file.nomeArquivo);
    });
    await firstValueFrom(
      this.http.post<void>(
        `${this.apiBaseUrl}/irregularidades/${irregularidadeId}/imagens`,
        formData,
      ),
    );
  }

  async uploadIrregularidadeAudio(
    irregularidadeId: string,
    file: Blob,
    nomeArquivo: string,
    duracaoMs?: number,
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', file, nomeArquivo);
    if (duracaoMs !== undefined) {
      formData.append('duracao_ms', `${duracaoMs}`);
    }
    await firstValueFrom(
      this.http.post<void>(
        `${this.apiBaseUrl}/irregularidades/${irregularidadeId}/audio`,
        formData,
      ),
    );
  }

  async removerAudiosIrregularidade(irregularidadeId: string): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(
        `${this.apiBaseUrl}/irregularidades/${irregularidadeId}/audio`,
      ),
    );
  }

  async finalizarVistoria(
    vistoriaId: string,
    payload: { tempo: number; observacao?: string },
  ): Promise<Vistoria> {
    return firstValueFrom(
      this.http.post<Vistoria>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/finalizar`,
        payload,
      ),
    );
  }

  async cancelarVistoria(vistoriaId: string): Promise<Vistoria> {
    return firstValueFrom(
      this.http.post<Vistoria>(`${this.apiBaseUrl}/vistoria/${vistoriaId}/cancelar`, {}),
    );
  }

  async retomarVistoria(vistoriaId: string): Promise<Vistoria> {
    return firstValueFrom(
      this.http.post<Vistoria>(`${this.apiBaseUrl}/vistoria/${vistoriaId}/retomar`, {}),
    );
  }

  async listarEmAndamento(
    idusuario?: string,
    ignorarVistoriaId?: string,
  ): Promise<Vistoria[]> {
    return firstValueFrom(
      this.http.get<Vistoria[]>(`${this.apiBaseUrl}/vistoria`, {
        params: {
          status: 'EM_ANDAMENTO',
          ...(idusuario ? { idusuario } : {}),
          ...(ignorarVistoriaId ? { ignorarVistoriaId } : {}),
        },
      }),
    );
  }
}
