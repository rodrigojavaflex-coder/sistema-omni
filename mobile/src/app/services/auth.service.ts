import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { NativeBiometric } from 'capacitor-native-biometric';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, Perfil, AuthResponse } from '../models/usuario.model';
import { ErrorMessageService } from './error-message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private errorMessageService = inject(ErrorMessageService);
  private apiBaseUrl = this.resolveApiBaseUrl();
  private apiUrl = `${this.apiBaseUrl}/auth`;

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';
  private readonly BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
  private readonly BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

  private biometricSessionVerified = false;
  private apiBaseUrlLogged = false;

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkStoredAuth();
  }

  /**
   * Realiza login do usuário
   */
  async login(email: string, password: string, options?: { navigate?: boolean }): Promise<void> {
    await this.performLogin(email, password, options);
  }

  private async performLogin(
    email: string,
    password: string,
    options?: { navigate?: boolean }
  ): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      );

      const accessToken = response.accessToken ?? response.access_token;
      const refreshToken = response.refreshToken ?? response.refresh_token;
      if (!accessToken || !refreshToken) {
        throw new Error('Tokens de autenticação não recebidos');
      }
      await this.setTokens(accessToken, refreshToken);
      const normalizedUser = this.normalizeUser(response.user);
      await this.setUser(normalizedUser);
      
      this.currentUserSubject.next(normalizedUser);
      this.isAuthenticatedSubject.next(true);
      this.biometricSessionVerified = true;
      
      if (options?.navigate !== false) {
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      throw new Error(this.mapLoginError(error));
    }
  }

  private mapLoginError(error: any): string {
    const status = Number(error?.status ?? 0);
    if (status === 401) {
      return 'E-mail ou senha inválidos.';
    }

    return this.errorMessageService.fromApi(
      error,
      'Erro ao fazer login. Tente novamente.',
    );
  }

  /**
   * Realiza logout
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (refreshToken) {
        await firstValueFrom(
          this.http.post(`${this.apiUrl}/logout`, { refreshToken })
        ).catch(() => {
          // Ignora erro se o token já foi invalidado
        });
      }
    } catch (error) {
      // Ignora erros no logout
    } finally {
      await this.clearAuth();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      this.biometricSessionVerified = false;
      this.router.navigate(['/login']);
    }
  }

  /**
   * Bloqueia sessão local sem invalidar token no servidor
   */
  async lockSession(): Promise<void> {
    await this.clearAuth();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.biometricSessionVerified = false;
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica se o usuário tem uma permissão específica
   */
  hasPermission(permission: string): boolean {
    const permissoes = this.getUserPermissions();
    return permissoes.includes(permission);
  }

  /**
   * Verifica se o usuário tem alguma das permissões fornecidas
   */
  hasAnyPermission(permissions: string[]): boolean {
    if (permissions.length === 0) {
      return true;
    }
    const permissoes = this.getUserPermissions();
    return permissions.some((permission) => permissoes.includes(permission));
  }

  private getUserPermissions(): string[] {
    const user = this.currentUserSubject.value;
    if (!user) {
      return [];
    }
    const permissions = new Set<string>();
    const perfis = this.getUserProfiles(user);
    for (const perfil of perfis) {
      const raw = perfil?.permissoes;
      if (!raw) {
        continue;
      }
      if (Array.isArray(raw)) {
        raw.forEach((permission) => {
          const normalized = `${permission ?? ''}`.trim();
          if (normalized) {
            permissions.add(normalized);
          }
        });
        continue;
      }
      raw
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .forEach((value) => permissions.add(value));
    }
    return Array.from(permissions);
  }

  /**
   * Obtém o access token
   */
  async getAccessToken(): Promise<string | null> {
    return this.getSecureItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Obtém o refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return this.getSecureItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Atualiza o access token
   */
  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await firstValueFrom(
        this.http.post<{ accessToken: string }>(`${this.apiUrl}/refresh`, { refreshToken })
      );

      await this.setSecureItem(this.ACCESS_TOKEN_KEY, response.accessToken);
      return response.accessToken;
    } catch (error) {
      await this.logout();
      return null;
    }
  }

  /**
   * Verifica autenticação armazenada
   */
  private async checkStoredAuth(): Promise<void> {
    const accessToken = await this.getAccessToken();
    const userStr = await Preferences.get({ key: this.USER_KEY });

    if (accessToken && userStr.value) {
      try {
        const user = this.normalizeUser(JSON.parse(userStr.value));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        await this.clearAuth();
      }
    }
  }

  /**
   * Armazena tokens
   */
  private async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.setSecureItem(this.ACCESS_TOKEN_KEY, accessToken);
    await this.setSecureItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Armazena usuário
   */
  private async setUser(user: Usuario): Promise<void> {
    await Preferences.set({ key: this.USER_KEY, value: JSON.stringify(user) });
  }

  private getUserProfiles(user: Usuario): Perfil[] {
    if (Array.isArray(user.perfis) && user.perfis.length > 0) {
      return user.perfis.filter((perfil): perfil is Perfil => Boolean(perfil));
    }
    if (user.perfil) {
      return [user.perfil];
    }
    return [];
  }

  private normalizeUser(user: Usuario): Usuario {
    if (!user) {
      return user;
    }
    const perfis = Array.isArray(user.perfis)
      ? user.perfis.filter((perfil): perfil is Perfil => Boolean(perfil))
      : [];
    const perfil = user.perfil ?? perfis[0];
    const ativo =
      typeof user.ativo === 'boolean'
        ? user.ativo
        : ((user.status ?? '').toUpperCase() === 'ATIVO');

    return {
      ...user,
      perfil,
      perfis: perfis.length > 0 ? perfis : (perfil ? [perfil] : []),
      ativo,
    };
  }

  /**
   * Limpa dados de autenticação
   */
  private async clearAuth(): Promise<void> {
    await this.removeSecureItem(this.ACCESS_TOKEN_KEY);
    await this.removeSecureItem(this.REFRESH_TOKEN_KEY);
    await Preferences.remove({ key: this.USER_KEY });
  }

  /**
   * Verifica se biometria está disponível no dispositivo
   */
  async isBiometricAvailable(): Promise<boolean> {
    if (!this.isNativePlatform()) {
      return false;
    }
    try {
      const { isAvailable } = await NativeBiometric.isAvailable({ useFallback: true });
      return isAvailable;
    } catch {
      return false;
    }
  }

  /**
   * Verifica se login biométrico está habilitado
   */
  async isBiometricEnabled(): Promise<boolean> {
    const { value } = await Preferences.get({ key: this.BIOMETRIC_ENABLED_KEY });
    if (value !== 'true') {
      return false;
    }

    const credentials = await this.getBiometricCredentials();
    return Boolean(credentials);
  }

  /**
   * Habilita login biométrico para o usuário atual
   */
  async enableBiometricLogin(email: string, password: string): Promise<boolean> {
    if (!this.isNativePlatform()) {
      return false;
    }
    const available = await this.isBiometricAvailable();
    if (!available) {
      return false;
    }

    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Confirme sua identidade para ativar o login por digital',
        title: 'Ativar login por digital',
        subtitle: 'Use sua biometria para acessar mais rápido',
        description: 'Sua biometria será usada para liberar o login rapidamente.',
        negativeButtonText: 'Agora não',
        useFallback: true,
        maxAttempts: 3
      });
    } catch {
      return false;
    }

    await this.setBiometricCredentials({ email, password });
    await Preferences.set({ key: this.BIOMETRIC_ENABLED_KEY, value: 'true' });
    return true;
  }

  /**
   * Login usando biometria e refresh token armazenado
   */
  async loginWithBiometrics(): Promise<void> {
    if (!this.isNativePlatform()) {
      throw new Error('Biometria indisponível neste ambiente');
    }
    const enabled = await this.isBiometricEnabled();
    if (!enabled) {
      throw new Error('Login biométrico não está habilitado');
    }

    const unlocked = await this.requireBiometricUnlock();
    if (!unlocked) {
      throw new Error('Autenticação biométrica não confirmada');
    }

    const credentials = await this.getBiometricCredentials();
    if (!credentials) {
      throw new Error('Credenciais biométricas não encontradas');
    }

    await this.performLogin(credentials.email, credentials.password, { navigate: false });
  }

  async disableBiometricLogin(): Promise<void> {
    await Preferences.remove({ key: this.BIOMETRIC_ENABLED_KEY });
    await this.removeSecureItem(this.BIOMETRIC_CREDENTIALS_KEY);
    this.biometricSessionVerified = false;
  }

  async requireBiometricUnlock(): Promise<boolean> {
    if (this.biometricSessionVerified) {
      return true;
    }

    if (!this.isNativePlatform()) {
      return true;
    }

    const enabled = await this.isBiometricEnabled();
    if (!enabled) {
      return true;
    }

    try {
      await NativeBiometric.verifyIdentity({
        reason: 'Confirme sua identidade para entrar',
        title: 'Login por digital',
        subtitle: 'Use sua biometria para acessar',
        description: 'Sua biometria será usada para validar o acesso.',
        negativeButtonText: 'Cancelar',
        useFallback: true,
        maxAttempts: 3
      });
      this.biometricSessionVerified = true;
      return true;
    } catch {
      return false;
    }
  }

  private async getBiometricCredentials(): Promise<{ email: string; password: string } | null> {
    const value = await this.getSecureItem(this.BIOMETRIC_CREDENTIALS_KEY);
    if (!value) {
      return null;
    }

    try {
      const parsed = JSON.parse(value);
      if (!parsed?.email || !parsed?.password) {
        return null;
      }
      return { email: parsed.email, password: parsed.password };
    } catch {
      return null;
    }
  }

  private async setBiometricCredentials(credentials: { email: string; password: string }): Promise<void> {
    await this.setSecureItem(this.BIOMETRIC_CREDENTIALS_KEY, JSON.stringify(credentials));
  }

  private async getSecureItem(key: string): Promise<string | null> {
    try {
      const { value } = await SecureStoragePlugin.get({ key });
      return value ?? null;
    } catch {
      return null;
    }
  }

  private async setSecureItem(key: string, value: string): Promise<void> {
    await SecureStoragePlugin.set({ key, value });
  }

  private async removeSecureItem(key: string): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key });
    } catch {
      // Ignora remoção se não existir
    }
  }

  private isNativePlatform(): boolean {
    return Capacitor.getPlatform() !== 'web';
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${this.apiUrl}/password-reset/request`, { email }),
    );
  }

  async confirmPasswordReset(body: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ message: string }> {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${this.apiUrl}/password-reset/confirm`, body),
    );
  }

  private resolveApiBaseUrl(): string {
    const platform = Capacitor.getPlatform();
    const baseUrl = this.isNativePlatform()
      ? environment.apiUrlNative || environment.apiUrl
      : environment.apiUrl;

    if (!this.apiBaseUrlLogged) {
      this.apiBaseUrlLogged = true;
      console.info(`[OMNI] API Base URL: ${baseUrl} (platform: ${platform})`);
    }

    return baseUrl;
  }
}
