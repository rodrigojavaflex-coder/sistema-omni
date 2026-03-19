import {
  Injectable,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-46CAF6GZ.js";

// src/app/services/vistoria-flow.service.ts
var VistoriaFlowService = class _VistoriaFlowService {
  vistoriaId = null;
  numeroVistoria = null;
  startedAt = null;
  veiculoId = null;
  veiculoDescricao = null;
  veiculoModeloId = null;
  veiculoModeloNome = null;
  dataVistoriaIso = null;
  /** Formata numero_vistoria para exibição: 2026001 -> "20261" */
  static formatNumeroVistoria(n) {
    const year = Math.floor(n / 1e3);
    const seq = n % 1e3;
    return `${year}${seq}`;
  }
  iniciar(vistoriaId, options) {
    this.vistoriaId = vistoriaId;
    this.numeroVistoria = options?.numeroVistoria ?? this.numeroVistoria;
    this.startedAt = Date.now();
    this.veiculoId = options?.veiculoId ?? this.veiculoId;
    this.veiculoDescricao = options?.veiculoDescricao ?? this.veiculoDescricao;
    this.veiculoModeloId = options?.veiculoModeloId ?? this.veiculoModeloId;
    this.veiculoModeloNome = options?.veiculoModeloNome ?? this.veiculoModeloNome;
    this.dataVistoriaIso = options?.datavistoria ?? this.dataVistoriaIso;
  }
  finalizar() {
    this.vistoriaId = null;
    this.numeroVistoria = null;
    this.startedAt = null;
    this.veiculoId = null;
    this.veiculoDescricao = null;
    this.veiculoModeloId = null;
    this.veiculoModeloNome = null;
    this.dataVistoriaIso = null;
  }
  getVistoriaId() {
    return this.vistoriaId;
  }
  getNumeroVistoria() {
    return this.numeroVistoria;
  }
  getNumeroVistoriaDisplay() {
    if (this.numeroVistoria == null)
      return "";
    return _VistoriaFlowService.formatNumeroVistoria(this.numeroVistoria);
  }
  updateContext(options) {
    if (options.numeroVistoria !== void 0) {
      this.numeroVistoria = options.numeroVistoria;
    }
    if (options.veiculoId !== void 0) {
      this.veiculoId = options.veiculoId;
    }
    if (options.veiculoDescricao !== void 0) {
      this.veiculoDescricao = options.veiculoDescricao;
    }
    if (options.veiculoModeloId !== void 0) {
      this.veiculoModeloId = options.veiculoModeloId;
    }
    if (options.veiculoModeloNome !== void 0) {
      this.veiculoModeloNome = options.veiculoModeloNome;
    }
    if (options.datavistoria !== void 0) {
      this.dataVistoriaIso = options.datavistoria;
    }
  }
  getVeiculoId() {
    return this.veiculoId;
  }
  getVeiculoDescricao() {
    return this.veiculoDescricao;
  }
  getVeiculoModeloId() {
    return this.veiculoModeloId;
  }
  getVeiculoModeloNome() {
    return this.veiculoModeloNome;
  }
  getDataVistoriaIso() {
    return this.dataVistoriaIso;
  }
  getTempoEmMinutos() {
    if (!this.startedAt) {
      return 0;
    }
    const diffMs = Date.now() - this.startedAt;
    return Math.max(1, Math.round(diffMs / 6e4));
  }
  static \u0275fac = function VistoriaFlowService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaFlowService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VistoriaFlowService, factory: _VistoriaFlowService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaFlowService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  VistoriaFlowService
};
//# sourceMappingURL=chunk-XK4MYM6O.js.map
