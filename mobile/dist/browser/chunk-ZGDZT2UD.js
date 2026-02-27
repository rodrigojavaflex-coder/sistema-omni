import {
  CameraResultType,
  CameraSource
} from "./chunk-DMFZDTFJ.js";
import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LOSUBM6T.js";
import {
  addIcons,
  cameraOutline,
  trashOutline
} from "./chunk-JMBQIX2W.js";
import {
  ActivatedRoute,
  Component,
  FormsModule,
  HttpClient,
  Injectable,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
  Router,
  ViewChild,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-SPXVY54Q.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor,
  registerPlugin
} from "./chunk-5JG7MXFI.js";
import "./chunk-AIZDI3X7.js";
import "./chunk-NZVQSZKT.js";
import "./chunk-CBDAGKSH.js";
import "./chunk-VI2LP43Q.js";
import "./chunk-4A3IYY7S.js";
import "./chunk-7GPIVXJN.js";
import "./chunk-HZI4L77X.js";
import "./chunk-M43RYFB3.js";
import "./chunk-FDXV3QXU.js";
import "./chunk-YPIUQMS2.js";
import "./chunk-QGYUETGI.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

// node_modules/@capacitor/camera/dist/esm/index.js
var Camera = registerPlugin("Camera", {
  web: () => import("./chunk-ONVX354O.js").then((m) => new m.CameraWeb())
});

// node_modules/capacitor-voice-recorder/dist/esm/index.js
var VoiceRecorder = registerPlugin("VoiceRecorder", {
  web: () => import("./chunk-F6V6BQOJ.js").then((m) => new m.VoiceRecorderWeb())
});

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

// src/app/pages/vistoria/vistoria-irregularidade.page.ts
var _c0 = ["observacaoInput"];
function VistoriaIrregularidadePage_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "ion-spinner", 9);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando sintomas...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_ion_text_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 10)(1, "p", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaIrregularidadePage_ion_list_9_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 13);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_ion_list_9_ion_item_1_Template_ion_item_click_0_listener() {
      const item_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.selecionarSintoma(item_r3));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", (ctx_r0.selectedMatriz == null ? null : ctx_r0.selectedMatriz.id) === item_r3.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.sintoma == null ? null : item_r3.sintoma.descricao);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Gravidade: ", item_r3.gravidade);
  }
}
function VistoriaIrregularidadePage_ion_list_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaIrregularidadePage_ion_list_9_ion_item_1_Template, 6, 4, "ion-item", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.matriz);
  }
}
function VistoriaIrregularidadePage_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "p");
    \u0275\u0275text(2, "Nenhum sintoma configurado para este componente.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_11_ion_list_12_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "img", 23);
    \u0275\u0275elementStart(2, "ion-label")(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ion-button", 24);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_11_ion_list_12_ion_item_1_Template_ion_button_click_5_listener() {
      const i_r6 = \u0275\u0275restoreView(_r5).index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.removerFoto(i_r6));
    });
    \u0275\u0275element(6, "ion-icon", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const foto_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", foto_r7.preview, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(foto_r7.nomeArquivo);
  }
}
function VistoriaIrregularidadePage_div_11_ion_list_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_11_ion_list_12_ion_item_1_Template, 7, 2, "ion-item", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.fotos);
  }
}
function VistoriaIrregularidadePage_div_11_ion_item_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 16)(1, "ion-label");
    \u0275\u0275text(2, "\xC1udio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 26)(4, "ion-button", 27);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_11_ion_item_13_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.iniciarAudio());
    });
    \u0275\u0275text(5, " Gravar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ion-button", 28);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_11_ion_item_13_Template_ion_button_click_6_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.pararAudio());
    });
    \u0275\u0275text(7, " Parar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ion-button", 29);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_11_ion_item_13_Template_ion_button_click_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.limparAudio());
    });
    \u0275\u0275text(9, " Limpar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275property("disabled", ctx_r0.gravandoAudio || !ctx_r0.podeGravarAudio);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.gravandoAudio);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.audioBase64);
  }
}
function VistoriaIrregularidadePage_div_11_ion_text_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 10)(1, "p", 11);
    \u0275\u0275text(2, "Dispositivo n\xE3o suporta grava\xE7\xE3o de \xE1udio.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_11_ion_spinner_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 9);
  }
}
function VistoriaIrregularidadePage_div_11_span_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Salvar irregularidade");
    \u0275\u0275elementEnd();
  }
}
function VistoriaIrregularidadePage_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "ion-item")(2, "ion-label", 14);
    \u0275\u0275text(3, "Observa\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-textarea", 15, 0);
    \u0275\u0275listener("ionInput", function VistoriaIrregularidadePage_div_11_Template_ion_textarea_ionInput_4_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.observacao = $event.detail.value ?? "");
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "ion-item", 16)(7, "ion-label");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "ion-button", 17);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_11_Template_ion_button_click_9_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.adicionarFoto());
    });
    \u0275\u0275element(10, "ion-icon", 18);
    \u0275\u0275text(11, " Adicionar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(12, VistoriaIrregularidadePage_div_11_ion_list_12_Template, 2, 1, "ion-list", 7)(13, VistoriaIrregularidadePage_div_11_ion_item_13_Template, 10, 3, "ion-item", 19)(14, VistoriaIrregularidadePage_div_11_ion_text_14_Template, 3, 0, "ion-text", 6);
    \u0275\u0275elementStart(15, "ion-button", 20);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_11_Template_ion_button_click_15_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.salvarIrregularidade());
    });
    \u0275\u0275template(16, VistoriaIrregularidadePage_div_11_ion_spinner_16_Template, 1, 0, "ion-spinner", 21)(17, VistoriaIrregularidadePage_div_11_span_17_Template, 2, 0, "span", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.observacao);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Fotos (", ctx_r0.fotos.length, ")");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.fotos.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMatriz.permiteAudio);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMatriz.permiteAudio && !ctx_r0.podeGravarAudio);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.saving);
  }
}
var VistoriaIrregularidadePage = class _VistoriaIrregularidadePage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  matrizService = inject(MatrizCriticidadeService);
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  observacaoInput;
  areaId = "";
  componenteId = "";
  areaNome = "";
  componenteNome = "";
  matriz = [];
  selectedMatriz = null;
  observacao = "";
  fotos = [];
  audioBase64;
  audioMimeType;
  audioDurationMs;
  gravandoAudio = false;
  podeGravarAudio = true;
  loading = false;
  saving = false;
  errorMessage = "";
  isNative = Capacitor.getPlatform() !== "web";
  constructor() {
    addIcons({ cameraOutline, trashOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.areaId = this.route.snapshot.paramMap.get("areaId") ?? "";
      this.componenteId = this.route.snapshot.paramMap.get("componenteId") ?? "";
      if (!this.areaId || !this.componenteId) {
        this.router.navigate(["/vistoria/areas"]);
        return;
      }
      const state = this.router.getCurrentNavigation()?.extras?.state;
      this.areaNome = state?.areaNome ?? "\xC1rea";
      this.componenteNome = state?.componenteNome ?? "Componente";
      this.loading = true;
      try {
        this.matriz = yield this.matrizService.listarPorComponente(this.componenteId);
        const canRecord = yield VoiceRecorder.canDeviceVoiceRecord();
        this.podeGravarAudio = canRecord.value === true;
      } catch {
        this.errorMessage = "Erro ao carregar sintomas.";
      } finally {
        this.loading = false;
      }
    });
  }
  selecionarSintoma(item) {
    this.selectedMatriz = item;
  }
  adicionarFoto() {
    return __async(this, null, function* () {
      const photo = yield Camera.getPhoto({
        quality: 60,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024,
        correctOrientation: true
      });
      if (!photo.base64String) {
        return;
      }
      const base64 = photo.base64String;
      const veiculo = this.sanitizeFilename(this.flowService.getVeiculoDescricao() ?? "veiculo");
      const data = this.formatDateFilename(this.flowService.getDataVistoriaIso() ?? (/* @__PURE__ */ new Date()).toISOString());
      const area = this.sanitizeFilename(this.areaNome ?? "area");
      const componente = this.sanitizeFilename(this.componenteNome ?? "componente");
      const imageIndex = this.fotos.length + 1;
      const nomeArquivo = `${veiculo}_${area}_${componente}_${data}_IMG_${imageIndex}.jpg`;
      const tamanho = this.estimateBase64Size(base64);
      this.fotos.push({
        nomeArquivo,
        tamanho,
        dadosBase64: base64,
        preview: `data:image/jpeg;base64,${base64}`
      });
    });
  }
  removerFoto(index) {
    this.fotos.splice(index, 1);
  }
  iniciarAudio() {
    return __async(this, null, function* () {
      try {
        const permission = yield VoiceRecorder.hasAudioRecordingPermission();
        if (!permission.value) {
          const request = yield VoiceRecorder.requestAudioRecordingPermission();
          if (!request.value) {
            this.errorMessage = "Permiss\xE3o de \xE1udio negada.";
            return;
          }
        }
        yield VoiceRecorder.startRecording();
        this.gravandoAudio = true;
      } catch {
        this.errorMessage = "N\xE3o foi poss\xEDvel iniciar a grava\xE7\xE3o.";
      }
    });
  }
  pararAudio() {
    return __async(this, null, function* () {
      try {
        const result = yield VoiceRecorder.stopRecording();
        this.audioBase64 = result.value.recordDataBase64;
        this.audioMimeType = result.value.mimeType;
        this.audioDurationMs = result.value.msDuration;
        this.gravandoAudio = false;
      } catch {
        this.errorMessage = "N\xE3o foi poss\xEDvel finalizar a grava\xE7\xE3o.";
        this.gravandoAudio = false;
      }
    });
  }
  limparAudio() {
    this.audioBase64 = void 0;
    this.audioMimeType = void 0;
    this.audioDurationMs = void 0;
  }
  salvarIrregularidade() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId || !this.selectedMatriz) {
        this.errorMessage = "Selecione um sintoma.";
        return;
      }
      if (this.selectedMatriz.exigeFoto && this.fotos.length === 0) {
        this.errorMessage = "Foto obrigat\xF3ria para este sintoma.";
        return;
      }
      this.saving = true;
      this.errorMessage = "";
      try {
        const irregularidade = yield this.vistoriaService.criarIrregularidade(vistoriaId, {
          idarea: this.areaId,
          idcomponente: this.componenteId,
          idsintoma: this.selectedMatriz.idSintoma,
          observacao: this.observacao?.trim() || void 0
        });
        if (this.fotos.length > 0) {
          const files = this.fotos.map((foto) => ({
            nomeArquivo: foto.nomeArquivo,
            blob: this.base64ToBlob(foto.dadosBase64)
          }));
          yield this.vistoriaService.uploadIrregularidadeImagens(irregularidade.id, files);
        }
        if (this.audioBase64 && this.selectedMatriz.permiteAudio) {
          const blob = this.base64ToBlob(this.audioBase64, this.audioMimeType || "audio/m4a");
          yield this.vistoriaService.uploadIrregularidadeAudio(irregularidade.id, blob, `audio_${Date.now()}.m4a`, this.audioDurationMs);
        }
        this.router.navigate([`/vistoria/areas/${this.areaId}`], {
          state: { areaNome: this.areaNome }
        });
      } catch (error) {
        this.errorMessage = error?.message || "Erro ao salvar irregularidade.";
      } finally {
        this.saving = false;
      }
    });
  }
  estimateBase64Size(base64) {
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.floor(base64.length * 3 / 4) - padding;
  }
  sanitizeFilename(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  }
  formatDateFilename(dateValue) {
    const date = new Date(dateValue);
    const pad = (n) => n.toString().padStart(2, "0");
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${dd}${mm}${yyyy}`;
  }
  base64ToBlob(base64, mimeType = "application/octet-stream") {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }
  static \u0275fac = function VistoriaIrregularidadePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaIrregularidadePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaIrregularidadePage, selectors: [["app-vistoria-irregularidade"]], viewQuery: function VistoriaIrregularidadePage_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, IonTextarea);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.observacaoInput = _t.first);
    }
  }, decls: 12, vars: 9, consts: [["observacaoInput", ""], [3, "translucent"], ["slot", "start"], [3, "defaultHref"], [3, "fullscreen"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], [4, "ngIf"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], ["button", "", "detail", "false", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], ["button", "", "detail", "false", 3, "click"], ["position", "stacked"], ["placeholder", "Observa\xE7\xE3o opcional", 3, "ionInput", "value"], ["lines", "none"], ["fill", "outline", 3, "click"], ["slot", "start", "name", "camera-outline"], ["lines", "none", 4, "ngIf"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], [4, "ngFor", "ngForOf"], ["alt", "Foto", 3, "src"], ["slot", "end", "fill", "clear", "color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], [1, "audio-actions"], ["fill", "outline", 3, "click", "disabled"], ["color", "danger", "fill", "outline", 3, "click", "disabled"], ["fill", "clear", "color", "medium", 3, "click", "disabled"]], template: function VistoriaIrregularidadePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 1)(1, "ion-toolbar")(2, "ion-buttons", 2);
      \u0275\u0275element(3, "ion-back-button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "ion-content", 4);
      \u0275\u0275template(7, VistoriaIrregularidadePage_div_7_Template, 4, 0, "div", 5)(8, VistoriaIrregularidadePage_ion_text_8_Template, 3, 1, "ion-text", 6)(9, VistoriaIrregularidadePage_ion_list_9_Template, 2, 1, "ion-list", 7)(10, VistoriaIrregularidadePage_div_10_Template, 3, 0, "div", 5)(11, VistoriaIrregularidadePage_div_11_Template, 18, 8, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(3);
      \u0275\u0275property("defaultHref", "/vistoria/areas/" + ctx.areaId);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.componenteNome);
      \u0275\u0275advance();
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.matriz.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.matriz.length === 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedMatriz);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonTextarea,
    IonSpinner
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\nion-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e7f2ff;\n}\nimg[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.audio-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=vistoria-irregularidade.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaIrregularidadePage, [{
    type: Component,
    args: [{ selector: "app-vistoria-irregularidade", standalone: true, imports: [
      NgIf,
      NgForOf,
      FormsModule,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonBackButton,
      IonList,
      IonItem,
      IonLabel,
      IonButton,
      IonIcon,
      IonText,
      IonTextarea,
      IonSpinner
    ], template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button [defaultHref]="'/vistoria/areas/' + areaId"></ion-back-button>
    </ion-buttons>
    <ion-title>{{ componenteNome }}</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div class="content" *ngIf="loading">
    <ion-spinner name="crescent"></ion-spinner>
    <p>Carregando sintomas...</p>
  </div>

  <ion-text color="danger" *ngIf="errorMessage">
    <p class="error-message">{{ errorMessage }}</p>
  </ion-text>

  <ion-list *ngIf="!loading && matriz.length > 0">
    <ion-item
      button
      detail="false"
      *ngFor="let item of matriz"
      (click)="selecionarSintoma(item)"
      [class.is-selected]="selectedMatriz?.id === item.id"
    >
      <ion-label>
        <h2>{{ item.sintoma?.descricao }}</h2>
        <p>Gravidade: {{ item.gravidade }}</p>
      </ion-label>
    </ion-item>
  </ion-list>

  <div class="content" *ngIf="!loading && matriz.length === 0">
    <p>Nenhum sintoma configurado para este componente.</p>
  </div>

  <div class="content" *ngIf="selectedMatriz">
    <ion-item>
      <ion-label position="stacked">Observa\xE7\xE3o</ion-label>
      <ion-textarea
        #observacaoInput
        [value]="observacao"
        placeholder="Observa\xE7\xE3o opcional"
        (ionInput)="observacao = $event.detail.value ?? ''"
      ></ion-textarea>
    </ion-item>

    <ion-item lines="none">
      <ion-label>Fotos ({{ fotos.length }})</ion-label>
      <ion-button fill="outline" (click)="adicionarFoto()">
        <ion-icon slot="start" name="camera-outline"></ion-icon>
        Adicionar
      </ion-button>
    </ion-item>

    <ion-list *ngIf="fotos.length > 0">
      <ion-item *ngFor="let foto of fotos; let i = index">
        <img [src]="foto.preview" alt="Foto" />
        <ion-label>
          <p>{{ foto.nomeArquivo }}</p>
        </ion-label>
        <ion-button slot="end" fill="clear" color="danger" (click)="removerFoto(i)">
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-list>

    <ion-item lines="none" *ngIf="selectedMatriz.permiteAudio">
      <ion-label>\xC1udio</ion-label>
      <div class="audio-actions">
        <ion-button fill="outline" (click)="iniciarAudio()" [disabled]="gravandoAudio || !podeGravarAudio">
          Gravar
        </ion-button>
        <ion-button color="danger" fill="outline" (click)="pararAudio()" [disabled]="!gravandoAudio">
          Parar
        </ion-button>
        <ion-button fill="clear" color="medium" (click)="limparAudio()" [disabled]="!audioBase64">
          Limpar
        </ion-button>
      </div>
    </ion-item>

    <ion-text *ngIf="selectedMatriz.permiteAudio && !podeGravarAudio" color="danger">
      <p class="error-message">Dispositivo n\xE3o suporta grava\xE7\xE3o de \xE1udio.</p>
    </ion-text>

    <ion-button expand="block" (click)="salvarIrregularidade()" [disabled]="saving">
      <ion-spinner *ngIf="saving" name="crescent"></ion-spinner>
      <span *ngIf="!saving">Salvar irregularidade</span>
    </ion-button>
  </div>
</ion-content>
`, styles: ["/* src/app/pages/vistoria/vistoria-irregularidade.page.scss */\n.content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n}\n.error-message {\n  padding: 12px 16px;\n}\nion-item.is-selected {\n  --background: #e7f2ff;\n}\nimg {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.audio-actions {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n/*# sourceMappingURL=vistoria-irregularidade.page.css.map */\n"] }]
  }], () => [], { observacaoInput: [{
    type: ViewChild,
    args: ["observacaoInput", { read: IonTextarea }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaIrregularidadePage, { className: "VistoriaIrregularidadePage", filePath: "src/app/pages/vistoria/vistoria-irregularidade.page.ts", lineNumber: 63 });
})();
export {
  VistoriaIrregularidadePage
};
//# sourceMappingURL=chunk-ZGDZT2UD.js.map
