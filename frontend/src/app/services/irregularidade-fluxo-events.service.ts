import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { IrregularidadeFluxoStreamEvent } from '../models/irregularidade-fluxo-events.model';

const RECONNECT_DELAY_MS = 5_000;

@Injectable({ providedIn: 'root' })
export class IrregularidadeFluxoEventsService {
  private readonly authService = inject(AuthService);
  private eventSource: EventSource | null = null;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private listener: ((event: IrregularidadeFluxoStreamEvent) => void) | null =
    null;
  private active = false;

  connect(onEvent: (event: IrregularidadeFluxoStreamEvent) => void): void {
    this.listener = onEvent;
    this.active = true;
    this.openStream();
  }

  disconnect(): void {
    this.active = false;
    this.listener = null;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.closeStream();
  }

  private openStream(): void {
    if (!this.active || !this.listener) {
      return;
    }

    this.closeStream();
    const token = this.authService.getAccessToken();
    if (!token) {
      this.scheduleReconnect();
      return;
    }

    const url = new URL(
      `${environment.apiUrl}/irregularidades/fluxo/events`,
      window.location.origin,
    );
    url.searchParams.set('access_token', token);

    const source = new EventSource(url.toString());
    this.eventSource = source;

    source.onmessage = (message: MessageEvent<string>) => {
      if (!this.listener) {
        return;
      }
      try {
        const payload = JSON.parse(message.data) as IrregularidadeFluxoStreamEvent;
        this.listener(payload);
      } catch {
        // Ignora mensagens malformadas.
      }
    };

    source.onerror = () => {
      this.closeStream();
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (!this.active || this.reconnectTimer) {
      return;
    }
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.openStream();
    }, RECONNECT_DELAY_MS);
  }

  private closeStream(): void {
    if (!this.eventSource) {
      return;
    }
    this.eventSource.close();
    this.eventSource = null;
  }
}
