import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VistoriaFlowService {
  private vistoriaId: string | null = null;
  private tipoVistoriaId: string | null = null;
  private startedAt: number | null = null;
  private veiculoDescricao: string | null = null;
  private tipoVistoriaDescricao: string | null = null;
  private dataVistoriaIso: string | null = null;

  iniciar(
    vistoriaId: string,
    tipoVistoriaId: string,
    options?: { veiculoDescricao?: string; tipoVistoriaDescricao?: string; datavistoria?: string },
  ): void {
    this.vistoriaId = vistoriaId;
    this.tipoVistoriaId = tipoVistoriaId;
    this.startedAt = Date.now();
    this.veiculoDescricao = options?.veiculoDescricao ?? this.veiculoDescricao;
    this.tipoVistoriaDescricao = options?.tipoVistoriaDescricao ?? this.tipoVistoriaDescricao;
    this.dataVistoriaIso = options?.datavistoria ?? this.dataVistoriaIso;
  }

  finalizar(): void {
    this.vistoriaId = null;
    this.tipoVistoriaId = null;
    this.startedAt = null;
    this.veiculoDescricao = null;
    this.tipoVistoriaDescricao = null;
    this.dataVistoriaIso = null;
  }

  getVistoriaId(): string | null {
    return this.vistoriaId;
  }

  getTipoVistoriaId(): string | null {
    return this.tipoVistoriaId;
  }

  updateContext(options: {
    tipoVistoriaId?: string;
    veiculoDescricao?: string;
    tipoVistoriaDescricao?: string;
    datavistoria?: string;
  }): void {
    if (options.tipoVistoriaId) {
      this.tipoVistoriaId = options.tipoVistoriaId;
    }
    if (options.veiculoDescricao !== undefined) {
      this.veiculoDescricao = options.veiculoDescricao;
    }
    if (options.tipoVistoriaDescricao !== undefined) {
      this.tipoVistoriaDescricao = options.tipoVistoriaDescricao;
    }
    if (options.datavistoria !== undefined) {
      this.dataVistoriaIso = options.datavistoria;
    }
  }

  getVeiculoDescricao(): string | null {
    return this.veiculoDescricao;
  }

  getTipoVistoriaDescricao(): string | null {
    return this.tipoVistoriaDescricao;
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
