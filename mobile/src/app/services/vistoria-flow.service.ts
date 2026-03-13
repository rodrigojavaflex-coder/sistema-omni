import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VistoriaFlowService {
  private vistoriaId: string | null = null;
  private numeroVistoria: number | null = null;
  private startedAt: number | null = null;
  private veiculoId: string | null = null;
  private veiculoDescricao: string | null = null;
  private veiculoModeloId: string | null = null;
  private veiculoModeloNome: string | null = null;
  private dataVistoriaIso: string | null = null;

  /** Formata numero_vistoria para exibição: 2026001 -> "20261" */
  static formatNumeroVistoria(n: number): string {
    const year = Math.floor(n / 1000);
    const seq = n % 1000;
    return `${year}${seq}`;
  }

  iniciar(
    vistoriaId: string,
    options?: {
      numeroVistoria?: number;
      veiculoId?: string;
      veiculoDescricao?: string;
      veiculoModeloId?: string;
      veiculoModeloNome?: string;
      datavistoria?: string;
    },
  ): void {
    this.vistoriaId = vistoriaId;
    this.numeroVistoria = options?.numeroVistoria ?? this.numeroVistoria;
    this.startedAt = Date.now();
    this.veiculoId = options?.veiculoId ?? this.veiculoId;
    this.veiculoDescricao = options?.veiculoDescricao ?? this.veiculoDescricao;
    this.veiculoModeloId = options?.veiculoModeloId ?? this.veiculoModeloId;
    this.veiculoModeloNome = options?.veiculoModeloNome ?? this.veiculoModeloNome;
    this.dataVistoriaIso = options?.datavistoria ?? this.dataVistoriaIso;
  }

  finalizar(): void {
    this.vistoriaId = null;
    this.numeroVistoria = null;
    this.startedAt = null;
    this.veiculoId = null;
    this.veiculoDescricao = null;
    this.veiculoModeloId = null;
    this.veiculoModeloNome = null;
    this.dataVistoriaIso = null;
  }

  getVistoriaId(): string | null {
    return this.vistoriaId;
  }

  getNumeroVistoria(): number | null {
    return this.numeroVistoria;
  }

  getNumeroVistoriaDisplay(): string {
    if (this.numeroVistoria == null) return '';
    return VistoriaFlowService.formatNumeroVistoria(this.numeroVistoria);
  }

  updateContext(options: {
    numeroVistoria?: number;
    veiculoId?: string;
    veiculoDescricao?: string;
    veiculoModeloId?: string;
    veiculoModeloNome?: string;
    datavistoria?: string;
  }): void {
    if (options.numeroVistoria !== undefined) {
      this.numeroVistoria = options.numeroVistoria;
    }
    if (options.veiculoId !== undefined) {
      this.veiculoId = options.veiculoId;
    }
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

  getVeiculoId(): string | null {
    return this.veiculoId;
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
