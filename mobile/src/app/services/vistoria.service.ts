import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';
import {
  ChecklistItemPayload,
  ChecklistImagemResumo,
  ChecklistItemResumo,
  Vistoria,
} from '../models/vistoria.model';

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
    idtipovistoria: string;
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
      idtipovistoria?: string;
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

  async salvarChecklistItem(
    vistoriaId: string,
    payload: ChecklistItemPayload,
  ): Promise<{ id: string }> {
    return firstValueFrom(
      this.http.post<{ id: string }>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/checklist`,
        payload,
      ),
    );
  }

  async uploadChecklistImagens(
    vistoriaId: string,
    checklistId: string,
    files: { nomeArquivo: string; blob: Blob }[],
  ): Promise<void> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file.blob, file.nomeArquivo);
    });
    await firstValueFrom(
      this.http.post<void>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/checklist/${checklistId}/imagens`,
        formData,
      ),
    );
  }

  async listarChecklist(vistoriaId: string): Promise<ChecklistItemResumo[]> {
    return firstValueFrom(
      this.http.get<ChecklistItemResumo[]>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/checklist`,
      ),
    );
  }

  async listarChecklistImagens(
    vistoriaId: string,
  ): Promise<ChecklistImagemResumo[]> {
    return firstValueFrom(
      this.http.get<ChecklistImagemResumo[]>(
        `${this.apiBaseUrl}/vistoria/${vistoriaId}/checklist/imagens`,
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
