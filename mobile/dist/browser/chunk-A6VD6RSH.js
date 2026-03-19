import {
  environment
} from "./chunk-2MMOVOXA.js";
import {
  HttpClient,
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-46CAF6GZ.js";
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
  listarHistoricoIrregularidadesNaoResolvidas(idVeiculo, filtros) {
    return __async(this, null, function* () {
      const params = {};
      if (filtros?.areaId) {
        params["areaId"] = filtros.areaId;
      }
      if (filtros?.componenteId) {
        params["componenteId"] = filtros.componenteId;
      }
      return firstValueFrom(this.http.get(`${this.apiBaseUrl}/vistoria/veiculo/${idVeiculo}/historico-irregularidades-nao-resolvidas`, { params }));
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

export {
  VistoriaService
};
//# sourceMappingURL=chunk-A6VD6RSH.js.map
