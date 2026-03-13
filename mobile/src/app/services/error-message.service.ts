import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  fromApi(error: unknown, fallback: string): string {
    const anyError = error as any;
    const status = Number(anyError?.status ?? 0);

    if (status === 0) {
      return 'Nao foi possivel conectar ao servidor. Tente novamente.';
    }

    if (status >= 500) {
      return 'Servico temporariamente indisponivel. Tente novamente em instantes.';
    }

    const raw = anyError?.error?.message ?? anyError?.message;
    if (!raw) {
      return fallback;
    }

    const normalized = Array.isArray(raw) ? raw.join(' ') : String(raw);
    const sanitized = normalized
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/Http failure response for/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    return sanitized || fallback;
  }
}
