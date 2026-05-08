import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-RD4URZID.js";

// src/app/services/error-message.service.ts
var ErrorMessageService = class _ErrorMessageService {
  fromApi(error, fallback) {
    const anyError = error;
    const hasHttpStatus = anyError != null && (Object.prototype.hasOwnProperty.call(anyError, "status") || Object.prototype.hasOwnProperty.call(anyError, "statusCode"));
    const status = Number(anyError?.status ?? anyError?.statusCode ?? 0);
    if (hasHttpStatus && status === 0) {
      return "N\xE3o foi poss\xEDvel conectar ao servidor. Verifique sua internet e tente novamente.";
    }
    const backendDetail = this.tryExtractBackendMessage(anyError);
    if (hasHttpStatus) {
      switch (status) {
        case 400:
        case 422:
          if (backendDetail) {
            return this.normalizePtBrMessage(backendDetail);
          }
          return status === 422 ? "Alguns dados informados s\xE3o inv\xE1lidos." : "Solicita\xE7\xE3o inv\xE1lida. Revise os dados e tente novamente.";
        case 401:
          return "E-mail ou senha inv\xE1lidos.";
        case 403:
          return "Voc\xEA n\xE3o tem permiss\xE3o para executar esta a\xE7\xE3o.";
        case 404:
          return "Recurso n\xE3o encontrado.";
        case 408:
          return "Tempo de conex\xE3o esgotado. Tente novamente.";
        case 409:
          return "Conflito de dados. Atualize a tela e tente novamente.";
        case 429:
          return "Muitas tentativas em sequ\xEAncia. Aguarde alguns instantes.";
        case 500:
        case 502:
        case 503:
        case 504:
          return "Servi\xE7o temporariamente indispon\xEDvel. Tente novamente em instantes.";
        default:
          break;
      }
    }
    if (!backendDetail) {
      return fallback;
    }
    const lowered = backendDetail.toLowerCase();
    if (lowered.includes("network error") || lowered.includes("failed to fetch") || lowered.includes("timeout") || lowered.includes("timed out")) {
      return "N\xE3o foi poss\xEDvel conectar ao servidor. Verifique sua internet e tente novamente.";
    }
    return this.normalizePtBrMessage(backendDetail || fallback);
  }
  /** Extrai texto útil enviado pelo backend (Nest `message` pode ser string ou string[]). */
  tryExtractBackendMessage(anyError) {
    const raw = anyError?.error?.message ?? anyError?.message;
    if (raw === void 0 || raw === null || raw === "") {
      return null;
    }
    const normalized = Array.isArray(raw) ? raw.join(" ") : String(raw);
    const sanitized = normalized.replace(/https?:\/\/\S+/gi, "").replace(/Http failure response for/gi, "").replace(/Unknown Error/gi, "").replace(/HttpErrorResponse/gi, "").replace(/\s+/g, " ").trim();
    return sanitized || null;
  }
  normalizePtBrMessage(message) {
    return message.replace(/\b[Nn]ao\b/g, (value) => value[0] === "N" ? "N\xE3o" : "n\xE3o").replace(/\b[Pp]ossivel\b/g, (value) => value[0] === "P" ? "Poss\xEDvel" : "poss\xEDvel").replace(/\b[Ss]ervico\b/g, (value) => value[0] === "S" ? "Servi\xE7o" : "servi\xE7o").replace(/\b[Ii]nvalidos\b/g, (value) => value[0] === "I" ? "Inv\xE1lidos" : "inv\xE1lidos").replace(/\b[Mm]idias\b/g, (value) => value[0] === "M" ? "M\xEDdias" : "m\xEDdias").replace(/\b[Vv]eiculo\b/g, (value) => value[0] === "V" ? "Ve\xEDculo" : "ve\xEDculo");
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
//# sourceMappingURL=chunk-PIJXL63R.js.map
