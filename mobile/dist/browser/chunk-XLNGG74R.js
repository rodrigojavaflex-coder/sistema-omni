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

// src/app/services/veiculo.service.ts
var VeiculoService = class _VeiculoService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  searchAtivos(query) {
    return __async(this, null, function* () {
      const trimmed = query.trim();
      if (!trimmed) {
        return [];
      }
      const params = {
        status: "ATIVO",
        placa: trimmed,
        descricao: trimmed
      };
      const response = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/veiculo`, { params }));
      if (Array.isArray(response)) {
        return response;
      }
      return response.data ?? [];
    });
  }
  static \u0275fac = function VeiculoService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VeiculoService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VeiculoService, factory: _VeiculoService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VeiculoService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  VeiculoService
};
//# sourceMappingURL=chunk-XLNGG74R.js.map
