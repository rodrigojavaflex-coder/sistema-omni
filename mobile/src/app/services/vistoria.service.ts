import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import { Vistoria } from '../models/vistoria.model';
import {
  IrregularidadeResumo,
  IrregularidadeImagemResumo,
} from '../models/irregularidade.model';

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
  ): Promise<{ id: string }> {
    return firstValueFrom(
      this.http.post<{ id: string }>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades`,
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
  ): Promise<IrregularidadeImagemResumo[]> {
    return firstValueFrom(
      this.http.get<IrregularidadeImagemResumo[]>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades/imagens`,
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
