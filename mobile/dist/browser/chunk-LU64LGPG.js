import {
  HttpClient,
  Injectable,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-KKQO7KIV.js";
import {
  Capacitor
} from "./chunk-5JG7MXFI.js";
import {
  __async,
  __spreadValues
} from "./chunk-3RNQ4BE2.js";

// src/app/services/vistoria.service.ts
var VistoriaService = class _VistoriaService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  iniciarVistoria(payload) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiBaseUrl}/vistoria`, payload));
    });
  }
  atualizarVistoria(vistoriaId, payload) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.patch(`${this.apiBaseUrl}/vistoria/${vistoriaId}`, payload));
    });
  }
  getById(vistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/${vistoriaId}`));
    });
  }
  listarIrregularidadesPendentes(idVeiculo) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/veiculo/${idVeiculo}/irregularidades-pendentes`));
    });
  }
  getUltimoOdometro(idveiculo, ignorarVistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/veiculo/${idveiculo}/ultimo-odometro`, {
        params: ignorarVistoriaId ? { ignorarVistoriaId } : {}
      }));
    });
  }
  criarIrregularidade(vistoriaId, payload) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades`, payload));
    });
  }
  atualizarIrregularidade(irregularidadeId, payload) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.patch(`${this.apiBaseUrl}/irregularidades/${irregularidadeId}`, payload));
    });
  }
  listarIrregularidades(vistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades`));
    });
  }
  listarIrregularidadesImagens(vistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades/imagens`));
    });
  }
  listarIrregularidadesAudios(vistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/${vistoriaId}/irregularidades/audios`));
    });
  }
  uploadIrregularidadeImagens(irregularidadeId, files) {
    return __async(this, null, function* () {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file.blob, file.nomeArquivo);
      });
      yield firstValueFrom(this.http.post(`${this.apiBaseUrl}/irregularidades/${irregularidadeId}/imagens`, formData));
    });
  }
  uploadIrregularidadeAudio(irregularidadeId, file, nomeArquivo, duracaoMs) {
    return __async(this, null, function* () {
      const formData = new FormData();
      formData.append("file", file, nomeArquivo);
      if (duracaoMs !== void 0) {
        formData.append("duracao_ms", `${duracaoMs}`);
      }
      yield firstValueFrom(this.http.post(`${this.apiBaseUrl}/irregularidades/${irregularidadeId}/audio`, formData));
    });
  }
  finalizarVistoria(vistoriaId, payload) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiBaseUrl}/vistoria/${vistoriaId}/finalizar`, payload));
    });
  }
  cancelarVistoria(vistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiBaseUrl}/vistoria/${vistoriaId}/cancelar`, {}));
    });
  }
  retomarVistoria(vistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.post(`${this.apiBaseUrl}/vistoria/${vistoriaId}/retomar`, {}));
    });
  }
  listarEmAndamento(idusuario, ignorarVistoriaId) {
    return __async(this, null, function* () {
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria`, {
        params: __spreadValues(__spreadValues({
          status: "EM_ANDAMENTO"
        }, idusuario ? { idusuario } : {}), ignorarVistoriaId ? { ignorarVistoriaId } : {})
      }));
    });
  }
  static \u0275fac = function VistoriaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _VistoriaService, factory: _VistoriaService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

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
  VistoriaService,
  VistoriaFlowService
};
//# sourceMappingURL=chunk-LU64LGPG.js.map
