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
  tipoVistoriaId = null;
  startedAt = null;
  veiculoDescricao = null;
  veiculoModeloId = null;
  veiculoModeloNome = null;
  tipoVistoriaDescricao = null;
  dataVistoriaIso = null;
  iniciar(vistoriaId, tipoVistoriaId, options) {
    this.vistoriaId = vistoriaId;
    this.tipoVistoriaId = tipoVistoriaId;
    this.startedAt = Date.now();
    this.veiculoDescricao = options?.veiculoDescricao ?? this.veiculoDescricao;
    this.veiculoModeloId = options?.veiculoModeloId ?? this.veiculoModeloId;
    this.veiculoModeloNome = options?.veiculoModeloNome ?? this.veiculoModeloNome;
    this.tipoVistoriaDescricao = options?.tipoVistoriaDescricao ?? this.tipoVistoriaDescricao;
    this.dataVistoriaIso = options?.datavistoria ?? this.dataVistoriaIso;
  }
  finalizar() {
    this.vistoriaId = null;
    this.tipoVistoriaId = null;
    this.startedAt = null;
    this.veiculoDescricao = null;
    this.veiculoModeloId = null;
    this.veiculoModeloNome = null;
    this.tipoVistoriaDescricao = null;
    this.dataVistoriaIso = null;
  }
  getVistoriaId() {
    return this.vistoriaId;
  }
  getTipoVistoriaId() {
    return this.tipoVistoriaId;
  }
  updateContext(options) {
    if (options.tipoVistoriaId) {
      this.tipoVistoriaId = options.tipoVistoriaId;
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
    if (options.tipoVistoriaDescricao !== void 0) {
      this.tipoVistoriaDescricao = options.tipoVistoriaDescricao;
    }
    if (options.datavistoria !== void 0) {
      this.dataVistoriaIso = options.datavistoria;
    }
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
  getTipoVistoriaDescricao() {
    return this.tipoVistoriaDescricao;
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
//# sourceMappingURL=chunk-LOSUBM6T.js.map
