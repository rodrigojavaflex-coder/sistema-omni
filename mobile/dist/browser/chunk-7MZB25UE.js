import {
  ErrorMessageService,
  environment
} from "./chunk-AN5CWPW3.js";
import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  Router,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-7F2ASLWB.js";
import {
  Capacitor,
  registerPlugin
} from "./chunk-XS4INNGU.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-3RNQ4BE2.js";

// node_modules/@capacitor/preferences/dist/esm/index.js
var Preferences = registerPlugin("Preferences", {
  web: () => import("./chunk-5XG6BIFC.js").then((m) => new m.PreferencesWeb())
});

// node_modules/capacitor-secure-storage-plugin/dist/esm/index.js
var SecureStoragePlugin = registerPlugin("SecureStoragePlugin", {
  web: () => import("./chunk-3YO3XGTZ.js").then((m) => new m.SecureStoragePluginWeb())
});

// node_modules/@aparajita/capacitor-biometric-auth/dist/esm/index.js
var proxy = registerPlugin("BiometricAuthNative", {
  web: () => __async(null, null, function* () {
    const module = yield import("./chunk-3ATNMSQE.js");
    return new module.BiometricAuthWeb();
  }),
  ios: () => __async(null, null, function* () {
    const module = yield import("./chunk-HWXJKLBC.js");
    return new module.BiometricAuthNative(proxy);
  }),
  android: () => __async(null, null, function* () {
    const module = yield import("./chunk-HWXJKLBC.js");
    return new module.BiometricAuthNative(proxy);
  })
});

// src/app/services/auth.service.ts
var AuthService = class _AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  errorMessageService = inject(ErrorMessageService);
  apiBaseUrl = this.resolveApiBaseUrl();
  apiUrl = `${this.apiBaseUrl}/auth`;
  ACCESS_TOKEN_KEY = "access_token";
  REFRESH_TOKEN_KEY = "refresh_token";
  USER_KEY = "current_user";
  BIOMETRIC_ENABLED_KEY = "biometric_enabled";
  BIOMETRIC_CREDENTIALS_KEY = "biometric_credentials";
  biometricSessionVerified = false;
  apiBaseUrlLogged = false;
  currentUserSubject = new BehaviorSubject(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticatedSubject = new BehaviorSubject(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor() {
    this.checkStoredAuth();
  }
  /**
   * Realiza login do usuário
   */
  login(email, password, options) {
    return __async(this, null, function* () {
      yield this.performLogin(email, password, options);
    });
  }
  performLogin(email, password, options) {
    return __async(this, null, function* () {
      try {
        const response = yield firstValueFrom(this.http.post(`${this.apiUrl}/login`, { email, password }));
        const accessToken = response.accessToken ?? response.access_token;
        const refreshToken = response.refreshToken ?? response.refresh_token;
        if (!accessToken || !refreshToken) {
          throw new Error("Tokens de autentica\xE7\xE3o n\xE3o recebidos");
        }
        yield this.setTokens(accessToken, refreshToken);
        const normalizedUser = this.normalizeUser(response.user);
        yield this.setUser(normalizedUser);
        this.currentUserSubject.next(normalizedUser);
        this.isAuthenticatedSubject.next(true);
        this.biometricSessionVerified = true;
        if (options?.navigate !== false) {
          this.router.navigate(["/home"]);
        }
      } catch (error) {
        throw new Error(this.mapLoginError(error));
      }
    });
  }
  mapLoginError(error) {
    const status = Number(error?.status ?? 0);
    if (status === 401) {
      return "E-mail ou senha inv\xE1lidos.";
    }
    return this.errorMessageService.fromApi(error, "Erro ao fazer login. Tente novamente.");
  }
  /**
   * Realiza logout
   */
  logout() {
    return __async(this, null, function* () {
      try {
        const refreshToken = yield this.getRefreshToken();
        if (refreshToken) {
          yield firstValueFrom(this.http.post(`${this.apiUrl}/logout`, { refreshToken })).catch(() => {
          });
        }
      } catch (error) {
      } finally {
        yield this.clearAuth();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.biometricSessionVerified = false;
        this.router.navigate(["/login"]);
      }
    });
  }
  /**
   * Bloqueia sessão local sem invalidar token no servidor
   */
  lockSession() {
    return __async(this, null, function* () {
      yield this.clearAuth();
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      this.biometricSessionVerified = false;
    });
  }
  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated() {
    return this.isAuthenticatedSubject.value;
  }
  /**
   * Obtém o usuário atual
   */
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  /**
   * Verifica se o usuário tem uma permissão específica
   */
  hasPermission(permission) {
    const permissoes = this.getUserPermissions();
    return permissoes.includes(permission);
  }
  /**
   * Verifica se o usuário tem alguma das permissões fornecidas
   */
  hasAnyPermission(permissions) {
    if (permissions.length === 0) {
      return true;
    }
    const permissoes = this.getUserPermissions();
    return permissions.some((permission) => permissoes.includes(permission));
  }
  getUserPermissions() {
    const user = this.currentUserSubject.value;
    if (!user) {
      return [];
    }
    const permissions = /* @__PURE__ */ new Set();
    const perfis = this.getUserProfiles(user);
    for (const perfil of perfis) {
      const raw = perfil?.permissoes;
      if (!raw) {
        continue;
      }
      if (Array.isArray(raw)) {
        raw.forEach((permission) => {
          const normalized = `${permission ?? ""}`.trim();
          if (normalized) {
            permissions.add(normalized);
          }
        });
        continue;
      }
      raw.split(",").map((value) => value.trim()).filter((value) => value.length > 0).forEach((value) => permissions.add(value));
    }
    return Array.from(permissions);
  }
  /**
   * Obtém o access token
   */
  getAccessToken() {
    return __async(this, null, function* () {
      return this.getSecureItem(this.ACCESS_TOKEN_KEY);
    });
  }
  /**
   * Obtém o refresh token
   */
  getRefreshToken() {
    return __async(this, null, function* () {
      return this.getSecureItem(this.REFRESH_TOKEN_KEY);
    });
  }
  /**
   * Atualiza o access token
   */
  refreshAccessToken() {
    return __async(this, null, function* () {
      try {
        const refreshToken = yield this.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token");
        }
        const response = yield firstValueFrom(this.http.post(`${this.apiUrl}/refresh`, { refreshToken }));
        yield this.setSecureItem(this.ACCESS_TOKEN_KEY, response.accessToken);
        return response.accessToken;
      } catch (error) {
        yield this.logout();
        return null;
      }
    });
  }
  /**
   * Verifica autenticação armazenada
   */
  checkStoredAuth() {
    return __async(this, null, function* () {
      const accessToken = yield this.getAccessToken();
      const userStr = yield Preferences.get({ key: this.USER_KEY });
      if (accessToken && userStr.value) {
        try {
          const user = this.normalizeUser(JSON.parse(userStr.value));
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        } catch (error) {
          yield this.clearAuth();
        }
      }
    });
  }
  /**
   * Armazena tokens
   */
  setTokens(accessToken, refreshToken) {
    return __async(this, null, function* () {
      yield this.setSecureItem(this.ACCESS_TOKEN_KEY, accessToken);
      yield this.setSecureItem(this.REFRESH_TOKEN_KEY, refreshToken);
    });
  }
  /**
   * Armazena usuário
   */
  setUser(user) {
    return __async(this, null, function* () {
      yield Preferences.set({ key: this.USER_KEY, value: JSON.stringify(user) });
    });
  }
  getUserProfiles(user) {
    if (Array.isArray(user.perfis) && user.perfis.length > 0) {
      return user.perfis.filter((perfil) => Boolean(perfil));
    }
    if (user.perfil) {
      return [user.perfil];
    }
    return [];
  }
  normalizeUser(user) {
    if (!user) {
      return user;
    }
    const perfis = Array.isArray(user.perfis) ? user.perfis.filter((perfil2) => Boolean(perfil2)) : [];
    const perfil = user.perfil ?? perfis[0];
    const ativo = typeof user.ativo === "boolean" ? user.ativo : (user.status ?? "").toUpperCase() === "ATIVO";
    return __spreadProps(__spreadValues({}, user), {
      perfil,
      perfis: perfis.length > 0 ? perfis : perfil ? [perfil] : [],
      ativo
    });
  }
  /**
   * Limpa dados de autenticação
   */
  clearAuth() {
    return __async(this, null, function* () {
      yield this.removeSecureItem(this.ACCESS_TOKEN_KEY);
      yield this.removeSecureItem(this.REFRESH_TOKEN_KEY);
      yield Preferences.remove({ key: this.USER_KEY });
    });
  }
  /**
   * Verifica se biometria está disponível no dispositivo
   */
  isBiometricAvailable() {
    return __async(this, null, function* () {
      if (!this.isNativePlatform()) {
        return false;
      }
      try {
        const info = yield proxy.checkBiometry();
        return info.isAvailable || info.deviceIsSecure;
      } catch {
        return false;
      }
    });
  }
  /**
   * Verifica se login biométrico está habilitado
   */
  isBiometricEnabled() {
    return __async(this, null, function* () {
      const { value } = yield Preferences.get({ key: this.BIOMETRIC_ENABLED_KEY });
      if (value !== "true") {
        return false;
      }
      const credentials = yield this.getBiometricCredentials();
      return Boolean(credentials);
    });
  }
  /**
   * Habilita login biométrico para o usuário atual
   */
  enableBiometricLogin(email, password) {
    return __async(this, null, function* () {
      if (!this.isNativePlatform()) {
        return false;
      }
      const available = yield this.isBiometricAvailable();
      if (!available) {
        return false;
      }
      try {
        yield proxy.authenticate({
          reason: "Sua biometria ser\xE1 usada para liberar o login rapidamente.",
          cancelTitle: "Agora n\xE3o",
          allowDeviceCredential: true,
          iosFallbackTitle: "Usar senha do dispositivo",
          androidTitle: "Ativar login por digital",
          androidSubtitle: "Use sua biometria para acessar mais r\xE1pido"
        });
      } catch {
        return false;
      }
      yield this.setBiometricCredentials({ email, password });
      yield Preferences.set({ key: this.BIOMETRIC_ENABLED_KEY, value: "true" });
      return true;
    });
  }
  /**
   * Login usando biometria e refresh token armazenado
   */
  loginWithBiometrics() {
    return __async(this, null, function* () {
      if (!this.isNativePlatform()) {
        throw new Error("Biometria indispon\xEDvel neste ambiente");
      }
      const enabled = yield this.isBiometricEnabled();
      if (!enabled) {
        throw new Error("Login biom\xE9trico n\xE3o est\xE1 habilitado");
      }
      const unlocked = yield this.requireBiometricUnlock();
      if (!unlocked) {
        throw new Error("Autentica\xE7\xE3o biom\xE9trica n\xE3o confirmada");
      }
      const credentials = yield this.getBiometricCredentials();
      if (!credentials) {
        throw new Error("Credenciais biom\xE9tricas n\xE3o encontradas");
      }
      yield this.performLogin(credentials.email, credentials.password, { navigate: false });
    });
  }
  disableBiometricLogin() {
    return __async(this, null, function* () {
      yield Preferences.remove({ key: this.BIOMETRIC_ENABLED_KEY });
      yield this.removeSecureItem(this.BIOMETRIC_CREDENTIALS_KEY);
      this.biometricSessionVerified = false;
    });
  }
  requireBiometricUnlock() {
    return __async(this, null, function* () {
      if (this.biometricSessionVerified) {
        return true;
      }
      if (!this.isNativePlatform()) {
        return true;
      }
      const enabled = yield this.isBiometricEnabled();
      if (!enabled) {
        return true;
      }
      try {
        yield proxy.authenticate({
          reason: "Sua biometria ser\xE1 usada para validar o acesso.",
          cancelTitle: "Cancelar",
          allowDeviceCredential: true,
          iosFallbackTitle: "Usar senha do dispositivo",
          androidTitle: "Login por digital",
          androidSubtitle: "Use sua biometria para acessar"
        });
        this.biometricSessionVerified = true;
        return true;
      } catch {
        return false;
      }
    });
  }
  getBiometricCredentials() {
    return __async(this, null, function* () {
      const value = yield this.getSecureItem(this.BIOMETRIC_CREDENTIALS_KEY);
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
    });
  }
  setBiometricCredentials(credentials) {
    return __async(this, null, function* () {
      yield this.setSecureItem(this.BIOMETRIC_CREDENTIALS_KEY, JSON.stringify(credentials));
    });
  }
  getSecureItem(key) {
    return __async(this, null, function* () {
      try {
        const { value } = yield SecureStoragePlugin.get({ key });
        return value ?? null;
      } catch {
        return null;
      }
    });
  }
  setSecureItem(key, value) {
    return __async(this, null, function* () {
      yield SecureStoragePlugin.set({ key, value });
    });
  }
  removeSecureItem(key) {
    return __async(this, null, function* () {
      try {
        yield SecureStoragePlugin.remove({ key });
      } catch {
      }
    });
  }
  isNativePlatform() {
    return Capacitor.getPlatform() !== "web";
  }
  requestPasswordReset(email) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiUrl}/password-reset/request`, { email }));
    });
  }
  confirmPasswordReset(body) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiUrl}/password-reset/confirm`, body));
    });
  }
  resolveApiBaseUrl() {
    const platform = Capacitor.getPlatform();
    const baseUrl = this.isNativePlatform() ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
    if (!this.apiBaseUrlLogged) {
      this.apiBaseUrlLogged = true;
      console.info(`[OMNI] API Base URL: ${baseUrl} (platform: ${platform})`);
    }
    return baseUrl;
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-7MZB25UE.js.map
