import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VistoriaFlowService {
  private vistoriaId: string | null = null;
  private startedAt: number | null = null;
  private veiculoDescricao: string | null = null;
  private veiculoModeloId: string | null = null;
  private veiculoModeloNome: string | null = null;
  private dataVistoriaIso: string | null = null;

  iniciar(
    vistoriaId: string,
    options?: {
      veiculoDescricao?: string;
      veiculoModeloId?: string;
      veiculoModeloNome?: string;
      datavistoria?: string;
    },
  ): void {
    this.vistoriaId = vistoriaId;
    this.startedAt = Date.now();
    this.veiculoDescricao = options?.veiculoDescricao ?? this.veiculoDescricao;
    this.veiculoModeloId = options?.veiculoModeloId ?? this.veiculoModeloId;
    this.veiculoModeloNome = options?.veiculoModeloNome ?? this.veiculoModeloNome;
    this.dataVistoriaIso = options?.datavistoria ?? this.dataVistoriaIso;
  }

  finalizar(): void {
    this.vistoriaId = null;
    this.startedAt = null;
    this.veiculoDescricao = null;
    this.veiculoModeloId = null;
    this.veiculoModeloNome = null;
    this.dataVistoriaIso = null;
  }

  getVistoriaId(): string | null {
    return this.vistoriaId;
  }

  updateContext(options: {
    veiculoDescricao?: string;
    veiculoModeloId?: string;
    veiculoModeloNome?: string;
    datavistoria?: string;
  }): void {
    if (options.veiculoDescricao !== undefined) {
      this.veiculoDescricao = options.veiculoDescricao;
    }
    if (options.veiculoModeloId !== undefined) {
      this.veiculoModeloId = options.veiculoModeloId;
    }
    if (options.veiculoModeloNome !== undefined) {
      this.veiculoModeloNome = options.veiculoModeloNome;
    }
    if (options.datavistoria !== undefined) {
      this.dataVistoriaIso = options.datavistoria;
    }
  }

  getVeiculoDescricao(): string | null {
    return this.veiculoDescricao;
  }

  getVeiculoModeloId(): string | null {
    return this.veiculoModeloId;
  }

  getVeiculoModeloNome(): string | null {
    return this.veiculoModeloNome;
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
