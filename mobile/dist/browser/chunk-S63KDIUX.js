import {
  environment
} from "./chunk-P3DEM65Q.js";
import {
  HttpClient,
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-IS355SV5.js";
import {
  Capacitor
} from "./chunk-5JG7MXFI.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

// src/app/services/vistoria-bootstrap.service.ts
var VistoriaBootstrapService = class _VistoriaBootstrapService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  cache = /* @__PURE__ */ new Map();
  inFlight = /* @__PURE__ */ new Map();
  ttlMs = 6e4;
  getSnapshot(vistoriaId) {
    const entry = this.cache.get(vistoriaId);
    return entry?.data ?? null;
  }
  getOrFetch(vistoriaId) {
    return __async(this, null, function* () {
      const entry = this.cache.get(vistoriaId);
      if (entry) {
        if (this.isExpired(entry)) {
          void this.refreshInBackground(vistoriaId);
        }
        return entry.data;
      }
      try {
        return yield this.fetchAndCache(vistoriaId);
      } catch {
        return null;
      }
    });
  }
  warmup(vistoriaId) {
    return __async(this, null, function* () {
      try {
        yield this.fetchAndCache(vistoriaId);
      } catch {
      }
    });
  }
  invalidate(vistoriaId) {
    if (vistoriaId) {
      this.cache.delete(vistoriaId);
      return;
    }
    this.cache.clear();
  }
  isExpired(entry) {
    return Date.now() - entry.fetchedAt > this.ttlMs;
  }
  refreshInBackground(vistoriaId) {
    return __async(this, null, function* () {
      if (this.inFlight.has(vistoriaId)) {
        return;
      }
      try {
        yield this.fetchAndCache(vistoriaId);
      } catch {
      }
    });
  }
  fetchAndCache(vistoriaId) {
    return __async(this, null, function* () {
      const existingPromise = this.inFlight.get(vistoriaId);
      if (existingPromise) {
        return existingPromise;
      }
      const promise = firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/${vistoriaId}/bootstrap`));
      this.inFlight.set(vistoriaId, promise);
      try {
        const data = yield promise;
        this.cache.set(vistoriaId, {
          data,
          fetchedAt: Date.now()
        });
        return data;
      } finally {
        this.inFlight.delete(vistoriaId);
      }
    });
  }
  static \u0275fac = function VistoriaBootstrapService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaBootstrapService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VistoriaBootstrapService, factory: _VistoriaBootstrapService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaBootstrapService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  VistoriaBootstrapService
};
//# sourceMappingURL=chunk-S63KDIUX.js.map
