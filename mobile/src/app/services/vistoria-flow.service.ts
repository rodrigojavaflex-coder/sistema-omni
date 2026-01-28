import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VistoriaFlowService {
  private vistoriaId: string | null = null;
  private tipoVistoriaId: string | null = null;
  private startedAt: number | null = null;
  private veiculoDescricao: string | null = null;
  private dataVistoriaIso: string | null = null;

  iniciar(
    vistoriaId: string,
    tipoVistoriaId: string,
    options?: { veiculoDescricao?: string; datavistoria?: string },
  ): void {
    this.vistoriaId = vistoriaId;
    this.tipoVistoriaId = tipoVistoriaId;
    this.startedAt = Date.now();
    this.veiculoDescricao = options?.veiculoDescricao ?? this.veiculoDescricao;
    this.dataVistoriaIso = options?.datavistoria ?? this.dataVistoriaIso;
  }

  finalizar(): void {
    this.vistoriaId = null;
    this.tipoVistoriaId = null;
    this.startedAt = null;
    this.veiculoDescricao = null;
    this.dataVistoriaIso = null;
  }

  getVistoriaId(): string | null {
    return this.vistoriaId;
  }

  getTipoVistoriaId(): string | null {
    return this.tipoVistoriaId;
  }

  getVeiculoDescricao(): string | null {
    return this.veiculoDescricao;
  }

  getDataVistoriaIso(): string | null {
    return this.dataVistoriaIso;
  }

  getTempoEmMinutos(): number {
    if (!this.startedAt) {
      return 0;
    }
    const diffMs = Date.now() - this.startedAt;
    return Math.max(1, Math.round(diffMs / 60000));
  }
}
