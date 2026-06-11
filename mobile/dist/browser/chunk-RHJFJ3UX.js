import {
  environment
} from "./chunk-AN5CWPW3.js";
import {
  HttpClient,
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-7F2ASLWB.js";
import {
  Capacitor
} from "./chunk-XS4INNGU.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

// src/app/services/matriz-criticidade.service.ts
var MatrizCriticidadeService = class _MatrizCriticidadeService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  listarPorComponente(componenteId) {
    return __async(this, null, function* () {
      const matriz = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/matriz-criticidade`, {
        params: { idcomponente: componenteId }
      }));
      return matriz ?? [];
    });
  }
  static \u0275fac = function MatrizCriticidadeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatrizCriticidadeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MatrizCriticidadeService, factory: _MatrizCriticidadeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatrizCriticidadeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  MatrizCriticidadeService
};
//# sourceMappingURL=chunk-RHJFJ3UX.js.map
