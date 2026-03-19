import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-46CAF6GZ.js";

// src/app/services/error-message.service.ts
var ErrorMessageService = class _ErrorMessageService {
  fromApi(error, fallback) {
    const anyError = error;
    const status = Number(anyError?.status ?? 0);
    if (status === 0) {
      return "Nao foi possivel conectar ao servidor. Tente novamente.";
    }
    if (status >= 500) {
      return "Servico temporariamente indisponivel. Tente novamente em instantes.";
    }
    const raw = anyError?.error?.message ?? anyError?.message;
    if (!raw) {
      return fallback;
    }
    const normalized = Array.isArray(raw) ? raw.join(" ") : String(raw);
    const sanitized = normalized.replace(/https?:\/\/\S+/gi, "").replace(/Http failure response for/gi, "").replace(/\s+/g, " ").trim();
    return sanitized || fallback;
  }
  static \u0275fac = function ErrorMessageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorMessageService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorMessageService, factory: _ErrorMessageService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorMessageService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/environments/environment.ts
var environment = {
  production: false,
  apiUrl: "https://api-dev.sistemasfarmamais.com/api",
  apiUrlNative: "https://api-dev.sistemasfarmamais.com/api"
};

export {
  environment,
  ErrorMessageService
};
//# sourceMappingURL=chunk-2MMOVOXA.js.map
