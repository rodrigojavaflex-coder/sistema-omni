import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class SystemService {
  private http = inject(HttpClient);
  private apiBaseUrl = Capacitor.getPlatform() !== 'web'
    ? environment.apiUrlNative || environment.apiUrl
    : environment.apiUrl;

  async getServerTime(): Promise<string> {
    const response = await firstValueFrom(
      this.http.get<{ serverTime: string }>(`${this.apiBaseUrl}/system/time`),
    );
    return response.serverTime;
  }
}
