import {
  HttpClient,
  Injectable,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-SPXVY54Q.js";
import {
  Capacitor
} from "./chunk-5JG7MXFI.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

// src/app/services/area-vistoriada.service.ts
var AreaVistoriadaService = class _AreaVistoriadaService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  listarPorModelo(modeloId) {
    return __async(this, null, function* () {
      const areas = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/areas`, {
        params: { idmodelo: modeloId, ativo: "true" }
      }));
      return areas ?? [];
    });
  }
  listarComponentes(areaId) {
    return __async(this, null, function* () {
      const componentes = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/areas/${areaId}/componentes`));
      return componentes ?? [];
    });
  }
  static \u0275fac = function AreaVistoriadaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AreaVistoriadaService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AreaVistoriadaService, factory: _AreaVistoriadaService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AreaVistoriadaService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  AreaVistoriadaService
};
//# sourceMappingURL=chunk-2LKB7HLG.js.map
