import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LOSUBM6T.js";
import {
  addIcons,
  refreshOutline
} from "./chunk-JMBQIX2W.js";
import {
  AuthService
} from "./chunk-FAJD6DZI.js";
import {
  AlertController,
  Component,
  DatePipe,
  DecimalPipe,
  FormsModule,
  HttpClient,
  Injectable,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  NgControlStatus,
  NgForOf,
  NgIf,
  NgModel,
  Router,
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
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-SPXVY54Q.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor
} from "./chunk-5JG7MXFI.js";
import "./chunk-Y5RNAJMB.js";
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
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-3RNQ4BE2.js";

// src/app/services/tipo-vistoria.service.ts
var TipoVistoriaService = class _TipoVistoriaService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  getAtivos() {
    return __async(this, null, function* () {
      const tipos = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/tiposvistoria`));
      return (tipos ?? []).filter((tipo) => tipo.ativo);
    });
  }
  static \u0275fac = function TipoVistoriaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TipoVistoriaService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TipoVistoriaService, factory: _TipoVistoriaService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TipoVistoriaService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

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

// src/app/services/motorista.service.ts
var MotoristaService = class _MotoristaService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  searchAtivos(query) {
    return __async(this, null, function* () {
      const trimmed = query.trim();
      if (!trimmed) {
        return [];
      }
      const response = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/motoristas`, {
        params: {
          search: trimmed,
          status: "Ativo",
          limit: "20"
        }
      }));
      return response.data ?? [];
    });
  }
  static \u0275fac = function MotoristaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MotoristaService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MotoristaService, factory: _MotoristaService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MotoristaService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/services/system.service.ts
var SystemService = class _SystemService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  getServerTime() {
    return __async(this, null, function* () {
      const response = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/system/time`));
      return response.serverTime;
    });
  }
  static \u0275fac = function SystemService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SystemService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SystemService, factory: _SystemService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SystemService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/pages/vistoria/vistoria-inicio.page.ts
function VistoriaInicioPage_ion_buttons_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-buttons", 22);
    \u0275\u0275element(1, "ion-menu-button");
    \u0275\u0275elementEnd();
  }
}
function VistoriaInicioPage_ion_card_13_ion_item_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "ion-spinner", 23);
    \u0275\u0275elementStart(2, "ion-label");
    \u0275\u0275text(3, "Carregando vistorias...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const vistoria_r2 = \u0275\u0275nextContext().$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2022 Matricula: ", ctx_r2.formatarMatricula((vistoria_r2.motorista == null ? null : vistoria_r2.motorista.matricula) || ""), " ");
  }
}
function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275template(6, VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_span_6_Template, 2, 1, "span", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "ion-button", 25);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template_ion_button_click_12_listener() {
      const vistoria_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.continuarVistoria(vistoria_r2));
    });
    \u0275\u0275text(13, " Continuar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const vistoria_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((vistoria_r2.veiculo == null ? null : vistoria_r2.veiculo.descricao) || "Ve\xEDculo");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Motorista: ", (vistoria_r2.motorista == null ? null : vistoria_r2.motorista.nome) || "---", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", vistoria_r2.motorista == null ? null : vistoria_r2.motorista.matricula);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Tipo: ", (vistoria_r2.tipoVistoria == null ? null : vistoria_r2.tipoVistoria.descricao) || "---", " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Data: ", \u0275\u0275pipeBind2(11, 5, vistoria_r2.datavistoria, "short"), " ");
  }
}
function VistoriaInicioPage_ion_card_13_ion_list_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template, 14, 8, "ion-item", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.vistoriasEmAndamento);
  }
}
function VistoriaInicioPage_ion_card_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 3)(1, "ion-item")(2, "ion-label", 5);
    \u0275\u0275text(3, "Vistorias em andamento");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaInicioPage_ion_card_13_ion_item_4_Template, 4, 0, "ion-item", 11)(5, VistoriaInicioPage_ion_card_13_ion_list_5_Template, 2, 1, "ion-list", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r2.loadingAndamento);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r2.loadingAndamento && ctx_r2.vistoriasEmAndamento.length > 0);
  }
}
function VistoriaInicioPage_ion_list_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list")(1, "ion-item");
    \u0275\u0275element(2, "ion-spinner", 23);
    \u0275\u0275elementStart(3, "ion-label");
    \u0275\u0275text(4, "Buscando ve\xEDculos...");
    \u0275\u0275elementEnd()()();
  }
}
function VistoriaInicioPage_ion_list_20_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 27);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_list_20_ion_item_1_Template_ion_item_click_0_listener() {
      const veiculo_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selecionarVeiculo(veiculo_r5));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const veiculo_r5 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", (ctx_r2.selectedVeiculo == null ? null : ctx_r2.selectedVeiculo.id) === veiculo_r5.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(veiculo_r5.descricao);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(veiculo_r5.placa);
  }
}
function VistoriaInicioPage_ion_list_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_list_20_ion_item_1_Template, 6, 4, "ion-item", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.veiculos);
  }
}
function VistoriaInicioPage_ion_item_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label")(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275pipe(4, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Od\xF4metro atual: ", ctx_r2.ultimoOdometro === null ? "Sem hist\xF3rico" : \u0275\u0275pipeBind2(4, 2, ctx_r2.ultimoOdometro, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Combust\xEDvel: ", ctx_r2.selectedVeiculo.combustivel || "-");
  }
}
function VistoriaInicioPage_ion_list_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list")(1, "ion-item");
    \u0275\u0275element(2, "ion-spinner", 23);
    \u0275\u0275elementStart(3, "ion-label");
    \u0275\u0275text(4, "Buscando motoristas...");
    \u0275\u0275elementEnd()()();
  }
}
function VistoriaInicioPage_ion_list_28_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 27);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_list_28_ion_item_1_Template_ion_item_click_0_listener() {
      const motorista_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selecionarMotorista(motorista_r7));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const motorista_r7 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", (ctx_r2.selectedMotorista == null ? null : ctx_r2.selectedMotorista.id) === motorista_r7.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(motorista_r7.nome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Matr\xEDcula: ", ctx_r2.formatarMatricula(motorista_r7.matricula));
  }
}
function VistoriaInicioPage_ion_list_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_list_28_ion_item_1_Template, 6, 4, "ion-item", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.motoristas);
  }
}
function VistoriaInicioPage_ion_select_option_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 28);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tipo_r8 = ctx.$implicit;
    \u0275\u0275property("value", tipo_r8.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tipo_r8.descricao, " ");
  }
}
function VistoriaInicioPage_ion_item_35_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "ion-spinner", 23);
    \u0275\u0275elementStart(2, "ion-label");
    \u0275\u0275text(3, "Carregando tipos...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaInicioPage_ion_text_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 29)(1, "p", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.startValidationMessage);
  }
}
function VistoriaInicioPage_ion_text_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 29)(1, "p", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.errorMessage);
  }
}
function VistoriaInicioPage_ion_spinner_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 23);
  }
}
function VistoriaInicioPage_span_50_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Iniciar Vistoria");
    \u0275\u0275elementEnd();
  }
}
var VistoriaInicioPage = class _VistoriaInicioPage {
  tipoService = inject(TipoVistoriaService);
  veiculoService = inject(VeiculoService);
  motoristaService = inject(MotoristaService);
  vistoriaService = inject(VistoriaService);
  flowService = inject(VistoriaFlowService);
  router = inject(Router);
  systemService = inject(SystemService);
  authService = inject(AuthService);
  alertController = inject(AlertController);
  tipos = [];
  veiculos = [];
  motoristas = [];
  vistoriasEmAndamento = [];
  veiculoSearch = "";
  motoristaSearch = "";
  selectedVeiculo = null;
  selectedMotorista = null;
  selectedTipoId = "";
  odometro = null;
  odometroDisplay = "";
  bateria = null;
  ultimoOdometro = null;
  ultimoOdometroData = null;
  datavistoriaDisplay = "";
  datavistoriaIso = "";
  loadingTipos = false;
  loadingVeiculos = false;
  loadingMotoristas = false;
  isSaving = false;
  loadingAndamento = false;
  errorMessage = "";
  isNative = Capacitor.getPlatform() !== "web";
  constructor() {
    addIcons({ refreshOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.atualizarDataHora();
      this.loadingTipos = true;
      try {
        this.tipos = yield this.tipoService.getAtivos();
      } catch (error) {
        this.errorMessage = "Erro ao carregar tipos de vistoria.";
      } finally {
        this.loadingTipos = false;
      }
      this.loadingAndamento = true;
      try {
        const user = this.authService.getCurrentUser();
        this.vistoriasEmAndamento = yield this.vistoriaService.listarEmAndamento(user?.id, this.flowService.getVistoriaId() ?? void 0);
      } catch {
        this.vistoriasEmAndamento = [];
      } finally {
        this.loadingAndamento = false;
      }
      yield this.carregarVistoriaEmEdicao();
    });
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      yield this.carregarVistoriaEmEdicao();
      yield this.atualizarListaEmAndamento();
    });
  }
  atualizarListaEmAndamento() {
    return __async(this, null, function* () {
      this.loadingAndamento = true;
      try {
        const user = this.authService.getCurrentUser();
        this.vistoriasEmAndamento = yield this.vistoriaService.listarEmAndamento(user?.id, this.flowService.getVistoriaId() ?? void 0);
      } catch {
        this.vistoriasEmAndamento = [];
      } finally {
        this.loadingAndamento = false;
      }
    });
  }
  atualizarDataHora() {
    return __async(this, null, function* () {
      try {
        const serverTime = yield this.systemService.getServerTime();
        const serverDate = new Date(serverTime);
        this.datavistoriaDisplay = serverDate.toLocaleString("pt-BR");
        this.datavistoriaIso = serverDate.toISOString();
      } catch {
        const now = /* @__PURE__ */ new Date();
        this.datavistoriaDisplay = now.toLocaleString("pt-BR");
        this.datavistoriaIso = now.toISOString();
      }
    });
  }
  formatarMatricula(matricula) {
    const clean = matricula?.toString() ?? "";
    const suffix = clean.slice(-3);
    return `***${suffix}`;
  }
  continuarVistoria(vistoria) {
    return __async(this, null, function* () {
      try {
        const atualizada = yield this.vistoriaService.retomarVistoria(vistoria.id);
        const tipoId = atualizada.idTipoVistoria || vistoria.idTipoVistoria;
        const modeloId = atualizada.veiculo?.idModelo ?? atualizada.veiculo?.modeloVeiculo?.id ?? vistoria.veiculo?.idModelo ?? vistoria.veiculo?.modeloVeiculo?.id;
        const modeloNome = atualizada.veiculo?.modeloVeiculo?.nome ?? atualizada.veiculo?.modelo ?? vistoria.veiculo?.modeloVeiculo?.nome ?? vistoria.veiculo?.modelo;
        this.flowService.iniciar(atualizada.id, tipoId, {
          veiculoDescricao: atualizada.veiculo?.descricao ?? vistoria.veiculo?.descricao,
          veiculoModeloId: modeloId ?? void 0,
          veiculoModeloNome: modeloNome ?? void 0,
          tipoVistoriaDescricao: atualizada.tipoVistoria?.descricao ?? vistoria.tipoVistoria?.descricao,
          datavistoria: atualizada.datavistoria ?? vistoria.datavistoria
        });
        this.router.navigate(["/vistoria/areas"]);
      } catch (error) {
        this.errorMessage = error?.message || "N\xE3o foi poss\xEDvel retomar a vistoria.";
      }
    });
  }
  onBuscarVeiculos(event) {
    return __async(this, null, function* () {
      const value = (event.detail?.value ?? "").toString();
      this.veiculoSearch = value;
      if (!value.trim()) {
        this.veiculos = [];
        return;
      }
      this.loadingVeiculos = true;
      try {
        this.veiculos = yield this.veiculoService.searchAtivos(value);
      } catch {
        this.veiculos = [];
      } finally {
        this.loadingVeiculos = false;
      }
    });
  }
  onBuscarMotoristas(event) {
    return __async(this, null, function* () {
      const value = (event.detail?.value ?? "").toString();
      this.motoristaSearch = value;
      if (!value.trim()) {
        this.motoristas = [];
        return;
      }
      this.loadingMotoristas = true;
      try {
        this.motoristas = yield this.motoristaService.searchAtivos(value);
      } catch {
        this.motoristas = [];
      } finally {
        this.loadingMotoristas = false;
      }
    });
  }
  selecionarVeiculo(veiculo) {
    this.selectedVeiculo = veiculo;
    this.veiculos = [];
    this.veiculoSearch = `${veiculo.descricao} - ${veiculo.placa}`;
    this.carregarUltimoOdometro(veiculo.id, this.flowService.getVistoriaId() ?? void 0);
    if (!this.isBateriaObrigatoria()) {
      this.bateria = null;
    }
  }
  limparVeiculo() {
    this.selectedVeiculo = null;
    this.veiculoSearch = "";
    this.veiculos = [];
    this.odometro = null;
    this.odometroDisplay = "";
    this.ultimoOdometro = null;
    this.ultimoOdometroData = null;
    this.errorMessage = "";
  }
  onOdometroInput(value) {
    const parsed = this.parseOdometroValue(value);
    if (parsed === null) {
      this.odometro = null;
      this.odometroDisplay = "";
      return;
    }
    this.odometro = parsed;
    this.odometroDisplay = parsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  selecionarMotorista(motorista) {
    this.selectedMotorista = motorista;
    this.motoristas = [];
    this.motoristaSearch = `${motorista.nome} - ${motorista.matricula}`;
  }
  limparMotorista() {
    this.selectedMotorista = null;
    this.motoristaSearch = "";
    this.motoristas = [];
    this.errorMessage = "";
  }
  get canStart() {
    const bateriaObrigatoria = this.isBateriaObrigatoria();
    const bateriaValida = this.bateria === null ? !bateriaObrigatoria : this.bateria >= 0 && this.bateria <= 100;
    return Boolean(this.selectedVeiculo && this.selectedMotorista && this.selectedTipoId && this.odometro !== null && this.odometro > 0 && this.odometro <= 9999999 && bateriaValida);
  }
  get startValidationMessage() {
    if (!this.selectedVeiculo) {
      return "Selecione um ve\xEDculo.";
    }
    if (!this.selectedMotorista) {
      return "Selecione um motorista.";
    }
    if (!this.selectedTipoId) {
      return "Selecione o tipo de vistoria.";
    }
    if (this.odometro === null || this.odometro <= 0) {
      return "Informe o od\xF4metro.";
    }
    if (this.odometro > 9999999) {
      return "Od\xF4metro n\xE3o pode ser maior que 9.999.999.";
    }
    if (this.isBateriaObrigatoria() && (this.bateria === null || this.bateria < 0 || this.bateria > 100)) {
      return "Informe a bateria (0 a 100) para ve\xEDculo el\xE9trico.";
    }
    return null;
  }
  iniciarVistoria() {
    return __async(this, null, function* () {
      if (!this.canStart || !this.selectedVeiculo || !this.selectedMotorista) {
        this.errorMessage = "Preencha todos os campos obrigat\xF3rios.";
        return;
      }
      const odometroOk = yield this.validarOdometro();
      if (!odometroOk) {
        return;
      }
      const user = this.authService.getCurrentUser();
      if (!user?.id) {
        this.errorMessage = "Usu\xE1rio n\xE3o encontrado na sess\xE3o.";
        return;
      }
      this.isSaving = true;
      this.errorMessage = "";
      try {
        const tipoSelecionado = this.tipos.find((tipo) => tipo.id === this.selectedTipoId);
        const vistoriaId = this.flowService.getVistoriaId();
        if (vistoriaId) {
          yield this.vistoriaService.atualizarVistoria(vistoriaId, {
            idveiculo: this.selectedVeiculo.id,
            idmotorista: this.selectedMotorista.id,
            idtipovistoria: this.selectedTipoId,
            odometro: Number(this.odometro),
            porcentagembateria: this.bateria === null ? null : Number(this.bateria),
            datavistoria: this.datavistoriaIso
          });
          this.flowService.updateContext({
            tipoVistoriaId: this.selectedTipoId,
            veiculoDescricao: this.selectedVeiculo.descricao,
            veiculoModeloId: this.selectedVeiculo.idModelo ?? this.selectedVeiculo.modeloVeiculo?.id,
            veiculoModeloNome: this.selectedVeiculo.modeloVeiculo?.nome ?? this.selectedVeiculo.modelo ?? void 0,
            tipoVistoriaDescricao: tipoSelecionado?.descricao,
            datavistoria: this.datavistoriaIso
          });
          this.router.navigate(["/vistoria/areas"]);
          return;
        }
        const vistoria = yield this.vistoriaService.iniciarVistoria(__spreadProps(__spreadValues({
          idusuario: user.id,
          idveiculo: this.selectedVeiculo.id,
          idmotorista: this.selectedMotorista.id,
          idtipovistoria: this.selectedTipoId,
          odometro: Number(this.odometro)
        }, this.bateria !== null ? { porcentagembateria: Number(this.bateria) } : {}), {
          datavistoria: this.datavistoriaIso
        }));
        this.flowService.iniciar(vistoria.id, this.selectedTipoId, {
          veiculoDescricao: this.selectedVeiculo.descricao,
          veiculoModeloId: this.selectedVeiculo.idModelo ?? this.selectedVeiculo.modeloVeiculo?.id,
          veiculoModeloNome: this.selectedVeiculo.modeloVeiculo?.nome ?? this.selectedVeiculo.modelo ?? void 0,
          tipoVistoriaDescricao: tipoSelecionado?.descricao,
          datavistoria: this.datavistoriaIso
        });
        this.router.navigate(["/vistoria/areas"]);
      } catch (error) {
        this.errorMessage = error?.message || "Erro ao iniciar vistoria.";
      } finally {
        this.isSaving = false;
      }
    });
  }
  isBateriaObrigatoria() {
    const combustivel = this.selectedVeiculo?.combustivel ?? "";
    return combustivel.toLowerCase() === "eletrico";
  }
  parseOdometroValue(value) {
    if (value === null || value === void 0) {
      return null;
    }
    if (typeof value === "number") {
      return Number.isNaN(value) ? null : Math.floor(value);
    }
    const raw = value.toString().trim();
    if (!raw) {
      return null;
    }
    const hasDot = raw.includes(".");
    const hasComma = raw.includes(",");
    let normalized = raw;
    if (hasDot && hasComma) {
      normalized = raw.replace(/\./g, "").replace(",", ".");
    } else if (hasComma) {
      const parts = raw.split(",");
      normalized = parts[parts.length - 1].length <= 2 ? raw.replace(",", ".") : raw.replace(/,/g, "");
    } else if (hasDot) {
      const parts = raw.split(".");
      normalized = parts[parts.length - 1].length <= 2 ? raw : raw.replace(/\./g, "");
    }
    normalized = normalized.replace(/[^\d.]/g, "");
    if (!normalized) {
      return null;
    }
    const parsed = Number.parseFloat(normalized);
    if (Number.isNaN(parsed)) {
      return null;
    }
    return Math.floor(parsed);
  }
  carregarUltimoOdometro(idVeiculo, ignorarVistoriaId) {
    return __async(this, null, function* () {
      try {
        const ultimo = yield this.vistoriaService.getUltimoOdometro(idVeiculo, ignorarVistoriaId);
        this.ultimoOdometro = ultimo?.odometro ?? null;
        this.ultimoOdometroData = ultimo?.datavistoria ?? null;
      } catch {
        this.ultimoOdometro = null;
        this.ultimoOdometroData = null;
      }
    });
  }
  validarOdometro() {
    return __async(this, null, function* () {
      if (this.odometro === null || this.odometro <= 0) {
        this.errorMessage = "Informe um od\xF4metro v\xE1lido.";
        return false;
      }
      if (this.odometro > 9999999) {
        this.errorMessage = "Od\xF4metro n\xE3o pode ser maior que 9.999.999.";
        return false;
      }
      if (this.ultimoOdometro === null || this.ultimoOdometro === void 0) {
        return true;
      }
      if (this.odometro <= this.ultimoOdometro) {
        this.errorMessage = "Od\xF4metro deve ser maior que o da \xFAltima vistoria.";
        return false;
      }
      const diff = this.odometro - this.ultimoOdometro;
      if (diff > 200) {
        const alert = yield this.alertController.create({
          header: "Confirmar od\xF4metro",
          message: `Ve\xEDculo rodou ${diff} km desde a \xFAltima vistoria. Deseja registrar o od\xF4metro?`,
          buttons: [
            { text: "Cancelar", role: "cancel" },
            { text: "Confirmar", role: "confirm" }
          ]
        });
        yield alert.present();
        const { role } = yield alert.onDidDismiss();
        return role === "confirm";
      }
      return true;
    });
  }
  carregarVistoriaEmEdicao() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return;
      }
      try {
        const vistoria = yield this.vistoriaService.getById(vistoriaId);
        if (vistoria?.veiculo) {
          this.selectedVeiculo = {
            id: vistoria.idVeiculo,
            descricao: vistoria.veiculo?.descricao ?? "",
            placa: vistoria.veiculo?.placa ?? "",
            status: "ATIVO",
            combustivel: vistoria.veiculo?.combustivel
          };
          this.veiculoSearch = `${this.selectedVeiculo.descricao} - ${this.selectedVeiculo.placa}`;
          this.carregarUltimoOdometro(this.selectedVeiculo.id, vistoria.id);
        }
        if (vistoria?.motorista) {
          this.selectedMotorista = {
            id: vistoria.idMotorista,
            nome: vistoria.motorista?.nome ?? "",
            matricula: vistoria.motorista?.matricula ?? "",
            status: "ATIVO"
          };
          this.motoristaSearch = `${this.selectedMotorista.nome} - ${this.selectedMotorista.matricula}`;
        }
        this.selectedTipoId = vistoria.idTipoVistoria;
        this.onOdometroInput(vistoria.odometro);
        if (this.isBateriaObrigatoria()) {
          this.bateria = vistoria.porcentagembateria === null || vistoria.porcentagembateria === void 0 ? null : Number(vistoria.porcentagembateria);
        } else {
          this.bateria = null;
        }
        if (vistoria.datavistoria) {
          const date = new Date(vistoria.datavistoria);
          this.datavistoriaDisplay = date.toLocaleString("pt-BR");
          this.datavistoriaIso = date.toISOString();
        }
        this.flowService.updateContext({
          tipoVistoriaId: vistoria.idTipoVistoria,
          veiculoDescricao: vistoria.veiculo?.descricao,
          tipoVistoriaDescricao: vistoria.tipoVistoria?.descricao,
          datavistoria: vistoria.datavistoria
        });
      } catch {
      }
    });
  }
  static \u0275fac = function VistoriaInicioPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaInicioPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaInicioPage, selectors: [["app-vistoria-inicio"]], decls: 51, vars: 25, consts: [[3, "translucent"], ["slot", "start", 4, "ngIf"], [3, "fullscreen"], [1, "card"], [1, "datetime-item"], ["position", "stacked"], ["readonly", "true", 3, "value"], ["fill", "clear", "size", "small", "slot", "end", "aria-label", "Atualizar data/hora", 3, "click"], ["name", "refresh-outline"], ["class", "card", 4, "ngIf"], ["placeholder", "Buscar por descri\xE7\xE3o ou placa", 3, "ionInput", "ionClear", "debounce", "value"], [4, "ngIf"], ["placeholder", "Buscar por nome, matr\xEDcula ou CPF", 3, "ionInput", "ionClear", "debounce", "value"], [1, "select-item"], ["interface", "popover", "placeholder", "Selecione", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "text", "inputmode", "numeric", "placeholder", "Ex: 12345", 1, "campo-destaque", 3, "ionInput", "value"], ["type", "number", "placeholder", "0 a 100", "min", "0", "max", "100", 1, "campo-destaque", 3, "ngModelChange", "ngModel", "disabled"], ["color", "danger", 4, "ngIf"], [1, "actions"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["slot", "start"], ["name", "crescent"], [4, "ngFor", "ngForOf"], ["fill", "outline", 3, "click"], ["button", "", "class", "selection-item", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], ["button", "", 1, "selection-item", 3, "click"], [3, "value"], ["color", "danger"], [1, "error-message"]], template: function VistoriaInicioPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar");
      \u0275\u0275template(2, VistoriaInicioPage_ion_buttons_2_Template, 2, 0, "ion-buttons", 1);
      \u0275\u0275elementStart(3, "ion-title");
      \u0275\u0275text(4, "Nova Vistoria");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(5, "ion-content", 2)(6, "ion-card", 3)(7, "ion-item", 4)(8, "ion-label", 5);
      \u0275\u0275text(9, "Data/Hora");
      \u0275\u0275elementEnd();
      \u0275\u0275element(10, "ion-input", 6);
      \u0275\u0275elementStart(11, "ion-button", 7);
      \u0275\u0275listener("click", function VistoriaInicioPage_Template_ion_button_click_11_listener() {
        return ctx.atualizarDataHora();
      });
      \u0275\u0275element(12, "ion-icon", 8);
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(13, VistoriaInicioPage_ion_card_13_Template, 6, 2, "ion-card", 9);
      \u0275\u0275elementStart(14, "ion-card", 3)(15, "ion-item")(16, "ion-label", 5);
      \u0275\u0275text(17, "Ve\xEDculo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "ion-searchbar", 10);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_searchbar_ionInput_18_listener($event) {
        return ctx.onBuscarVeiculos($event);
      })("ionClear", function VistoriaInicioPage_Template_ion_searchbar_ionClear_18_listener() {
        return ctx.limparVeiculo();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(19, VistoriaInicioPage_ion_list_19_Template, 5, 0, "ion-list", 11)(20, VistoriaInicioPage_ion_list_20_Template, 2, 1, "ion-list", 11)(21, VistoriaInicioPage_ion_item_21_Template, 7, 5, "ion-item", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "ion-card", 3)(23, "ion-item")(24, "ion-label", 5);
      \u0275\u0275text(25, "Motorista");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "ion-searchbar", 12);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_searchbar_ionInput_26_listener($event) {
        return ctx.onBuscarMotoristas($event);
      })("ionClear", function VistoriaInicioPage_Template_ion_searchbar_ionClear_26_listener() {
        return ctx.limparMotorista();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(27, VistoriaInicioPage_ion_list_27_Template, 5, 0, "ion-list", 11)(28, VistoriaInicioPage_ion_list_28_Template, 2, 1, "ion-list", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "ion-card", 3)(30, "ion-item", 13)(31, "ion-label", 5);
      \u0275\u0275text(32, "Tipo de Vistoria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "ion-select", 14);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_select_ngModelChange_33_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedTipoId, $event) || (ctx.selectedTipoId = $event);
        return $event;
      });
      \u0275\u0275template(34, VistoriaInicioPage_ion_select_option_34_Template, 2, 2, "ion-select-option", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(35, VistoriaInicioPage_ion_item_35_Template, 4, 0, "ion-item", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(36, "ion-card", 3)(37, "ion-item")(38, "ion-label", 5);
      \u0275\u0275text(39, "Od\xF4metro");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(40, "ion-input", 16);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_input_ionInput_40_listener($event) {
        return ctx.onOdometroInput($event.detail.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(41, "ion-item")(42, "ion-label", 5);
      \u0275\u0275text(43, "% Bateria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(44, "ion-input", 17);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_input_ngModelChange_44_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.bateria, $event) || (ctx.bateria = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(45, VistoriaInicioPage_ion_text_45_Template, 3, 1, "ion-text", 18)(46, VistoriaInicioPage_ion_text_46_Template, 3, 1, "ion-text", 18);
      \u0275\u0275elementStart(47, "div", 19)(48, "ion-button", 20);
      \u0275\u0275listener("click", function VistoriaInicioPage_Template_ion_button_click_48_listener() {
        return ctx.iniciarVistoria();
      });
      \u0275\u0275template(49, VistoriaInicioPage_ion_spinner_49_Template, 1, 0, "ion-spinner", 21)(50, VistoriaInicioPage_span_50_Template, 2, 0, "span", 11);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.isNative);
      \u0275\u0275advance(3);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.datavistoriaDisplay);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ctx.loadingAndamento || ctx.vistoriasEmAndamento.length > 0);
      \u0275\u0275advance(5);
      \u0275\u0275property("debounce", 350)("value", ctx.veiculoSearch);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingVeiculos);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loadingVeiculos && ctx.veiculos.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedVeiculo);
      \u0275\u0275advance(5);
      \u0275\u0275property("debounce", 350)("value", ctx.motoristaSearch);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingMotoristas);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loadingMotoristas && ctx.motoristas.length > 0);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.selectedTipoId);
      \u0275\u0275advance();
      \u0275\u0275property("ngForOf", ctx.tipos);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingTipos);
      \u0275\u0275advance(5);
      \u0275\u0275property("value", ctx.odometroDisplay);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.bateria);
      \u0275\u0275property("disabled", !ctx.isBateriaObrigatoria());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.canStart && ctx.startValidationMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance(2);
      \u0275\u0275property("disabled", !ctx.canStart || ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.isSaving);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    FormsModule,
    NgControlStatus,
    NgModel,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonList,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    DatePipe,
    DecimalPipe
  ], styles: ["\n\n.card[_ngcontent-%COMP%] {\n  margin: 16px;\n}\n.actions[_ngcontent-%COMP%] {\n  padding: 0 16px 24px;\n}\n.datetime-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-top: 22px;\n}\nion-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.selection-item[_ngcontent-%COMP%], \n.select-item[_ngcontent-%COMP%] {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.selection-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select[_ngcontent-%COMP%]::part(placeholder) {\n  color: #64748b;\n}\nion-select[_ngcontent-%COMP%]::part(text) {\n  color: #0f172a;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n.campo-destaque[_ngcontent-%COMP%]::part(native) {\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaInicioPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-inicio", standalone: true, imports: [
      NgIf,
      NgForOf,
      DatePipe,
      DecimalPipe,
      FormsModule,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonCard,
      IonItem,
      IonLabel,
      IonInput,
      IonButton,
      IonIcon,
      IonList,
      IonSearchbar,
      IonSelect,
      IonSelectOption,
      IonSpinner,
      IonText
    ], template: `<ion-header [translucent]="true">\r
  <ion-toolbar>\r
    <ion-buttons slot="start" *ngIf="isNative">\r
      <ion-menu-button></ion-menu-button>\r
    </ion-buttons>\r
    <ion-title>Nova Vistoria</ion-title>\r
  </ion-toolbar>\r
</ion-header>\r
\r
<ion-content [fullscreen]="true">\r
  <ion-card class="card">\r
    <ion-item class="datetime-item">\r
      <ion-label position="stacked">Data/Hora</ion-label>\r
      <ion-input [value]="datavistoriaDisplay" readonly="true"></ion-input>\r
      <ion-button\r
        fill="clear"\r
        size="small"\r
        slot="end"\r
        aria-label="Atualizar data/hora"\r
        (click)="atualizarDataHora()"\r
      >\r
        <ion-icon name="refresh-outline"></ion-icon>\r
      </ion-button>\r
    </ion-item>\r
  </ion-card>\r
\r
  <ion-card class="card" *ngIf="loadingAndamento || vistoriasEmAndamento.length > 0">\r
    <ion-item>\r
      <ion-label position="stacked">Vistorias em andamento</ion-label>\r
    </ion-item>\r
    <ion-item *ngIf="loadingAndamento">\r
      <ion-spinner name="crescent"></ion-spinner>\r
      <ion-label>Carregando vistorias...</ion-label>\r
    </ion-item>\r
    <ion-list *ngIf="!loadingAndamento && vistoriasEmAndamento.length > 0">\r
      <ion-item *ngFor="let vistoria of vistoriasEmAndamento">\r
        <ion-label>\r
          <h3>{{ vistoria.veiculo?.descricao || 'Ve\xEDculo' }}</h3>\r
          <p>\r
            Motorista: {{ vistoria.motorista?.nome || '---' }}\r
            <span *ngIf="vistoria.motorista?.matricula">\r
              \u2022 Matricula: {{ formatarMatricula(vistoria.motorista?.matricula || '') }}\r
            </span>\r
          </p>\r
          <p>\r
            Tipo: {{ vistoria.tipoVistoria?.descricao || '---' }}\r
          </p>\r
          <p>\r
            Data: {{ vistoria.datavistoria | date:'short' }}\r
          </p>\r
        </ion-label>\r
        <ion-button fill="outline" (click)="continuarVistoria(vistoria)">\r
          Continuar\r
        </ion-button>\r
      </ion-item>\r
    </ion-list>\r
  </ion-card>\r
\r
  <ion-card class="card">\r
    <ion-item>\r
      <ion-label position="stacked">Ve\xEDculo</ion-label>\r
      <ion-searchbar\r
        [debounce]="350"\r
        placeholder="Buscar por descri\xE7\xE3o ou placa"\r
        [value]="veiculoSearch"\r
        (ionInput)="onBuscarVeiculos($event)"\r
        (ionClear)="limparVeiculo()"\r
      ></ion-searchbar>\r
    </ion-item>\r
    <ion-list *ngIf="loadingVeiculos">\r
      <ion-item>\r
        <ion-spinner name="crescent"></ion-spinner>\r
        <ion-label>Buscando ve\xEDculos...</ion-label>\r
      </ion-item>\r
    </ion-list>\r
    <ion-list *ngIf="!loadingVeiculos && veiculos.length > 0">\r
      <ion-item\r
        button\r
        class="selection-item"\r
        [class.is-selected]="selectedVeiculo?.id === veiculo.id"\r
        *ngFor="let veiculo of veiculos"\r
        (click)="selecionarVeiculo(veiculo)"\r
      >\r
        <ion-label>\r
          <h3>{{ veiculo.descricao }}</h3>\r
          <p>{{ veiculo.placa }}</p>\r
        </ion-label>\r
      </ion-item>\r
    </ion-list>\r
    <ion-item *ngIf="selectedVeiculo">\r
      <ion-label>\r
        <p>Od\xF4metro atual: {{ ultimoOdometro === null ? 'Sem hist\xF3rico' : (ultimoOdometro | number:'1.0-0') }}</p>\r
        <p>Combust\xEDvel: {{ selectedVeiculo.combustivel || '-' }}</p>\r
      </ion-label>\r
    </ion-item>\r
  </ion-card>\r
\r
  <ion-card class="card">\r
    <ion-item>\r
      <ion-label position="stacked">Motorista</ion-label>\r
      <ion-searchbar\r
        [debounce]="350"\r
        placeholder="Buscar por nome, matr\xEDcula ou CPF"\r
        [value]="motoristaSearch"\r
        (ionInput)="onBuscarMotoristas($event)"\r
        (ionClear)="limparMotorista()"\r
      ></ion-searchbar>\r
    </ion-item>\r
    <ion-list *ngIf="loadingMotoristas">\r
      <ion-item>\r
        <ion-spinner name="crescent"></ion-spinner>\r
        <ion-label>Buscando motoristas...</ion-label>\r
      </ion-item>\r
    </ion-list>\r
    <ion-list *ngIf="!loadingMotoristas && motoristas.length > 0">\r
      <ion-item\r
        button\r
        class="selection-item"\r
        [class.is-selected]="selectedMotorista?.id === motorista.id"\r
        *ngFor="let motorista of motoristas"\r
        (click)="selecionarMotorista(motorista)"\r
      >\r
        <ion-label>\r
          <h3>{{ motorista.nome }}</h3>\r
          <p>Matr\xEDcula: {{ formatarMatricula(motorista.matricula) }}</p>\r
        </ion-label>\r
      </ion-item>\r
    </ion-list>\r
  </ion-card>\r
\r
  <ion-card class="card">\r
    <ion-item class="select-item">\r
      <ion-label position="stacked">Tipo de Vistoria</ion-label>\r
      <ion-select\r
        interface="popover"\r
        placeholder="Selecione"\r
        [(ngModel)]="selectedTipoId"\r
      >\r
        <ion-select-option\r
          *ngFor="let tipo of tipos"\r
          [value]="tipo.id"\r
        >\r
          {{ tipo.descricao }}\r
        </ion-select-option>\r
      </ion-select>\r
    </ion-item>\r
    <ion-item *ngIf="loadingTipos">\r
      <ion-spinner name="crescent"></ion-spinner>\r
      <ion-label>Carregando tipos...</ion-label>\r
    </ion-item>\r
  </ion-card>\r
\r
  <ion-card class="card">\r
    <ion-item>\r
      <ion-label position="stacked">Od\xF4metro</ion-label>\r
      <ion-input\r
        type="text"\r
        inputmode="numeric"\r
        placeholder="Ex: 12345"\r
        class="campo-destaque"\r
        [value]="odometroDisplay"\r
        (ionInput)="onOdometroInput($event.detail.value)"\r
      ></ion-input>\r
    </ion-item>\r
    <ion-item>\r
      <ion-label position="stacked">% Bateria</ion-label>\r
      <ion-input\r
        type="number"\r
        [(ngModel)]="bateria"\r
        placeholder="0 a 100"\r
        min="0"\r
        max="100"\r
        [disabled]="!isBateriaObrigatoria()"\r
        class="campo-destaque"\r
      ></ion-input>\r
    </ion-item>\r
  </ion-card>\r
\r
  <ion-text color="danger" *ngIf="!canStart && startValidationMessage">\r
    <p class="error-message">{{ startValidationMessage }}</p>\r
  </ion-text>\r
\r
  <ion-text color="danger" *ngIf="errorMessage">\r
    <p class="error-message">{{ errorMessage }}</p>\r
  </ion-text>\r
\r
  <div class="actions">\r
    <ion-button expand="block" [disabled]="!canStart || isSaving" (click)="iniciarVistoria()">\r
      <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r
      <span *ngIf="!isSaving">Iniciar Vistoria</span>\r
    </ion-button>\r
  </div>\r
</ion-content>\r
`, styles: ["/* src/app/pages/vistoria/vistoria-inicio.page.scss */\n.card {\n  margin: 16px;\n}\n.actions {\n  padding: 0 16px 24px;\n}\n.datetime-item ion-button {\n  margin-top: 22px;\n}\nion-item ion-button {\n  margin-left: 8px;\n}\n.selection-item,\n.select-item {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item ion-label h3 {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item ion-label p {\n  color: #64748b;\n}\n.selection-item.is-selected {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select::part(placeholder) {\n  color: #64748b;\n}\nion-select::part(text) {\n  color: #0f172a;\n}\n.error-message {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n.campo-destaque::part(native) {\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaInicioPage, { className: "VistoriaInicioPage", filePath: "src/app/pages/vistoria/vistoria-inicio.page.ts", lineNumber: 72 });
})();
export {
  VistoriaInicioPage
};
//# sourceMappingURL=chunk-Z2Q6U7WJ.js.map
