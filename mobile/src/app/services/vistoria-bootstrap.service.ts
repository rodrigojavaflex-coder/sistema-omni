import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../environments/environment';
import { VistoriaBootstrap } from '../models/vistoria-bootstrap.model';

interface BootstrapCacheEntry {
  data: VistoriaBootstrap;
  fetchedAt: number;
}

@Injectable({ providedIn: 'root' })
export class VistoriaBootstrapService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  private cache = new Map<string, BootstrapCacheEntry>();
  private inFlight = new Map<string, Promise<VistoriaBootstrap>>();
  private readonly ttlMs = 60_000;

  getSnapshot(vistoriaId: string): VistoriaBootstrap | null {
    const entry = this.cache.get(vistoriaId);
    return entry?.data ?? null;
  }

  async getOrFetch(vistoriaId: string): Promise<VistoriaBootstrap | null> {
    const entry = this.cache.get(vistoriaId);
    if (entry) {
      if (this.isExpired(entry)) {
        // SWR: retorna snapshot rápido e atualiza silenciosamente.
        void this.refreshInBackground(vistoriaId);
      }
      return entry.data;
    }

    try {
      return await this.fetchAndCache(vistoriaId);
    } catch {
      return null;
    }
  }

  async warmup(vistoriaId: string): Promise<void> {
    try {
      await this.fetchAndCache(vistoriaId);
    } catch {
      // Falha de warmup não bloqueia o fluxo de vistoria.
    }
  }

  invalidate(vistoriaId?: string): void {
    if (vistoriaId) {
      this.cache.delete(vistoriaId);
      return;
    }
    this.cache.clear();
  }

  private isExpired(entry: BootstrapCacheEntry): boolean {
    return Date.now() - entry.fetchedAt > this.ttlMs;
  }

  private async refreshInBackground(vistoriaId: string): Promise<void> {
    if (this.inFlight.has(vistoriaId)) {
      return;
    }
    try {
      await this.fetchAndCache(vistoriaId);
    } catch {
      // Ignora falha de refresh silencioso e mantém snapshot atual.
    }
  }

  private async fetchAndCache(vistoriaId: string): Promise<VistoriaBootstrap> {
    const existingPromise = this.inFlight.get(vistoriaId);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = firstValueFrom(
      this.http.get<VistoriaBootstrap>(`${this.apiBaseUrl}/vistoria/${vistoriaId}/bootstrap`),
    );
    this.inFlight.set(vistoriaId, promise);

    try {
      const data = await promise;
      this.cache.set(vistoriaId, {
        data,
        fetchedAt: Date.now(),
      });
      return data;
    } finally {
      this.inFlight.delete(vistoriaId);
    }
  }
}
