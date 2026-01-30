import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  Router,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-FWNB6FX6.js";
import {
  Capacitor,
  registerPlugin
} from "./chunk-RP3QMZ46.js";
import {
  registerPlugin as registerPlugin2
} from "./chunk-JGROTZJO.js";
import {
  __async
} from "./chunk-ZRCPYJMT.js";

// node_modules/@capacitor/preferences/dist/esm/index.js
var Preferences = registerPlugin("Preferences", {
  web: () => import("./chunk-HCO2GF4T.js").then((m) => new m.PreferencesWeb())
});

// node_modules/capacitor-secure-storage-plugin/dist/esm/index.js
var SecureStoragePlugin = registerPlugin("SecureStoragePlugin", {
  web: () => import("./chunk-CL33IZGY.js").then((m) => new m.SecureStoragePluginWeb())
});

// node_modules/capacitor-native-biometric/dist/esm/definitions.js
var BiometryType;
(function(BiometryType2) {
  BiometryType2[BiometryType2["NONE"] = 0] = "NONE";
  BiometryType2[BiometryType2["TOUCH_ID"] = 1] = "TOUCH_ID";
  BiometryType2[BiometryType2["FACE_ID"] = 2] = "FACE_ID";
  BiometryType2[BiometryType2["FINGERPRINT"] = 3] = "FINGERPRINT";
  BiometryType2[BiometryType2["FACE_AUTHENTICATION"] = 4] = "FACE_AUTHENTICATION";
  BiometryType2[BiometryType2["IRIS_AUTHENTICATION"] = 5] = "IRIS_AUTHENTICATION";
  BiometryType2[BiometryType2["MULTIPLE"] = 6] = "MULTIPLE";
})(BiometryType || (BiometryType = {}));
var BiometricAuthError;
(function(BiometricAuthError2) {
  BiometricAuthError2[BiometricAuthError2["UNKNOWN_ERROR"] = 0] = "UNKNOWN_ERROR";
  BiometricAuthError2[BiometricAuthError2["BIOMETRICS_UNAVAILABLE"] = 1] = "BIOMETRICS_UNAVAILABLE";
  BiometricAuthError2[BiometricAuthError2["USER_LOCKOUT"] = 2] = "USER_LOCKOUT";
  BiometricAuthError2[BiometricAuthError2["BIOMETRICS_NOT_ENROLLED"] = 3] = "BIOMETRICS_NOT_ENROLLED";
  BiometricAuthError2[BiometricAuthError2["USER_TEMPORARY_LOCKOUT"] = 4] = "USER_TEMPORARY_LOCKOUT";
  BiometricAuthError2[BiometricAuthError2["AUTHENTICATION_FAILED"] = 10] = "AUTHENTICATION_FAILED";
  BiometricAuthError2[BiometricAuthError2["APP_CANCEL"] = 11] = "APP_CANCEL";
  BiometricAuthError2[BiometricAuthError2["INVALID_CONTEXT"] = 12] = "INVALID_CONTEXT";
  BiometricAuthError2[BiometricAuthError2["NOT_INTERACTIVE"] = 13] = "NOT_INTERACTIVE";
  BiometricAuthError2[BiometricAuthError2["PASSCODE_NOT_SET"] = 14] = "PASSCODE_NOT_SET";
  BiometricAuthError2[BiometricAuthError2["SYSTEM_CANCEL"] = 15] = "SYSTEM_CANCEL";
  BiometricAuthError2[BiometricAuthError2["USER_CANCEL"] = 16] = "USER_CANCEL";
  BiometricAuthError2[BiometricAuthError2["USER_FALLBACK"] = 17] = "USER_FALLBACK";
})(BiometricAuthError || (BiometricAuthError = {}));

// node_modules/capacitor-native-biometric/dist/esm/index.js
var NativeBiometric = registerPlugin2("NativeBiometric", {
  web: () => import("./chunk-VFO7XLTP.js").then((m) => new m.NativeBiometricWeb())
});

// src/app/services/auth.service.ts
var AuthService = class _AuthService {
  http = inject(HttpClient);
  router = inject(Router);
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
        yield this.setUser(response.user);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
        this.biometricSessionVerified = true;
        if (options?.navigate !== false) {
          this.router.navigate(["/home"]);
        }
      } catch (error) {
        const status = error?.status ? ` (HTTP ${error.status})` : "";
        const serverMessage = error?.error?.message || error?.message;
        const details = serverMessage ? `: ${serverMessage}` : "";
        throw new Error(`Erro ao fazer login${status}${details}`);
      }
    });
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
    const raw = user.perfil?.permissoes;
    if (!raw) {
      return [];
    }
    if (Array.isArray(raw)) {
      return raw;
    }
    return raw.split(",").map((value) => value.trim()).filter((value) => value.length > 0);
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
          const user = JSON.parse(userStr.value);
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
        const { isAvailable } = yield NativeBiometric.isAvailable({ useFallback: true });
        return isAvailable;
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
        yield NativeBiometric.verifyIdentity({
          reason: "Confirme sua identidade para ativar o login por digital",
          title: "Ativar login por digital",
          subtitle: "Use sua biometria para acessar mais r\xE1pido",
          description: "Sua biometria ser\xE1 usada para liberar o login rapidamente.",
          negativeButtonText: "Agora n\xE3o",
          useFallback: true,
          maxAttempts: 3
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
        yield NativeBiometric.verifyIdentity({
          reason: "Confirme sua identidade para entrar",
          title: "Login por digital",
          subtitle: "Use sua biometria para acessar",
          description: "Sua biometria ser\xE1 usada para validar o acesso.",
          negativeButtonText: "Cancelar",
          useFallback: true,
          maxAttempts: 3
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
//# sourceMappingURL=chunk-6QPZWFDT.js.map
