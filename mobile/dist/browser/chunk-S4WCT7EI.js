import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-XDELGTKF.js";
import {
  addIcons,
  refreshOutline
} from "./chunk-MVYH7HIC.js";
import {
  AuthService
} from "./chunk-APMN3AA5.js";
import {
  Component,
  DatePipe,
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
} from "./chunk-XXY565TE.js";
import "./chunk-3EJ4SNN5.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor
} from "./chunk-RP3QMZ46.js";
import "./chunk-JGROTZJO.js";
import "./chunk-6JHPNCWP.js";
import "./chunk-BH2QRXZH.js";
import "./chunk-BT3FPS55.js";
import "./chunk-ZG3Z5V5T.js";
import "./chunk-VY52QLWN.js";
import "./chunk-7GPIVXJN.js";
import "./chunk-HZI4L77X.js";
import "./chunk-M43RYFB3.js";
import "./chunk-FDXV3QXU.js";
import "./chunk-YPIUQMS2.js";
import "./chunk-QGYUETGI.js";
import {
  __async
} from "./chunk-ZRCPYJMT.js";

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
function VistoriaInicioPage_ion_list_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list")(1, "ion-item");
    \u0275\u0275element(2, "ion-spinner", 23);
    \u0275\u0275elementStart(3, "ion-label");
    \u0275\u0275text(4, "Buscando motoristas...");
    \u0275\u0275elementEnd()()();
  }
}
function VistoriaInicioPage_ion_list_27_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 27);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_list_27_ion_item_1_Template_ion_item_click_0_listener() {
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
function VistoriaInicioPage_ion_list_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_list_27_ion_item_1_Template, 6, 4, "ion-item", 26);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.motoristas);
  }
}
function VistoriaInicioPage_ion_select_option_33_Template(rf, ctx) {
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
function VistoriaInicioPage_ion_item_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "ion-spinner", 23);
    \u0275\u0275elementStart(2, "ion-label");
    \u0275\u0275text(3, "Carregando tipos...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaInicioPage_ion_text_44_Template(rf, ctx) {
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
function VistoriaInicioPage_ion_spinner_47_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 23);
  }
}
function VistoriaInicioPage_span_48_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Iniciar Checklist");
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
  bateria = null;
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
        this.vistoriasEmAndamento = yield this.vistoriaService.listarEmAndamento(user?.id);
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
        this.flowService.iniciar(atualizada.id, tipoId, {
          veiculoDescricao: atualizada.veiculo?.descricao ?? vistoria.veiculo?.descricao,
          datavistoria: atualizada.datavistoria ?? vistoria.datavistoria
        });
        this.router.navigate(["/vistoria/checklist"]);
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
  }
  selecionarMotorista(motorista) {
    this.selectedMotorista = motorista;
    this.motoristas = [];
    this.motoristaSearch = `${motorista.nome} - ${motorista.matricula}`;
  }
  get canStart() {
    return Boolean(this.selectedVeiculo && this.selectedMotorista && this.selectedTipoId && this.odometro !== null && this.odometro > 0 && this.bateria !== null && this.bateria >= 0 && this.bateria <= 100);
  }
  iniciarVistoria() {
    return __async(this, null, function* () {
      if (!this.canStart || !this.selectedVeiculo || !this.selectedMotorista) {
        this.errorMessage = "Preencha todos os campos obrigat\xF3rios.";
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
        const vistoria = yield this.vistoriaService.iniciarVistoria({
          idusuario: user.id,
          idveiculo: this.selectedVeiculo.id,
          idmotorista: this.selectedMotorista.id,
          idtipovistoria: this.selectedTipoId,
          odometro: Number(this.odometro),
          porcentagembateria: Number(this.bateria),
          datavistoria: this.datavistoriaIso
        });
        this.flowService.iniciar(vistoria.id, this.selectedTipoId, {
          veiculoDescricao: this.selectedVeiculo.descricao,
          datavistoria: this.datavistoriaIso
        });
        this.router.navigate(["/vistoria/checklist"]);
      } catch (error) {
        this.errorMessage = error?.message || "Erro ao iniciar vistoria.";
      } finally {
        this.isSaving = false;
      }
    });
  }
  static \u0275fac = function VistoriaInicioPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaInicioPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaInicioPage, selectors: [["app-vistoria-inicio"]], decls: 49, vars: 22, consts: [[3, "translucent"], ["slot", "start", 4, "ngIf"], [3, "fullscreen"], [1, "card"], [1, "datetime-item"], ["position", "stacked"], ["readonly", "true", 3, "value"], ["fill", "clear", "size", "small", "slot", "end", "aria-label", "Atualizar data/hora", 3, "click"], ["name", "refresh-outline"], ["class", "card", 4, "ngIf"], ["placeholder", "Buscar por descri\xE7\xE3o ou placa", 3, "ionInput", "debounce", "value"], [4, "ngIf"], ["placeholder", "Buscar por nome, matr\xEDcula ou CPF", 3, "ionInput", "debounce", "value"], [1, "select-item"], ["interface", "popover", "placeholder", "Selecione", 3, "ngModelChange", "ngModel"], [3, "value", 4, "ngFor", "ngForOf"], ["type", "number", "placeholder", "Ex: 12345", 3, "ngModelChange", "ngModel"], ["type", "number", "placeholder", "0 a 100", "min", "0", "max", "100", 3, "ngModelChange", "ngModel"], ["color", "danger", 4, "ngIf"], [1, "actions"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["slot", "start"], ["name", "crescent"], [4, "ngFor", "ngForOf"], ["fill", "outline", 3, "click"], ["button", "", "class", "selection-item", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], ["button", "", 1, "selection-item", 3, "click"], [3, "value"], ["color", "danger"], [1, "error-message"]], template: function VistoriaInicioPage_Template(rf, ctx) {
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
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(19, VistoriaInicioPage_ion_list_19_Template, 5, 0, "ion-list", 11)(20, VistoriaInicioPage_ion_list_20_Template, 2, 1, "ion-list", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "ion-card", 3)(22, "ion-item")(23, "ion-label", 5);
      \u0275\u0275text(24, "Motorista");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "ion-searchbar", 12);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_searchbar_ionInput_25_listener($event) {
        return ctx.onBuscarMotoristas($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(26, VistoriaInicioPage_ion_list_26_Template, 5, 0, "ion-list", 11)(27, VistoriaInicioPage_ion_list_27_Template, 2, 1, "ion-list", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "ion-card", 3)(29, "ion-item", 13)(30, "ion-label", 5);
      \u0275\u0275text(31, "Tipo de Vistoria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "ion-select", 14);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_select_ngModelChange_32_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.selectedTipoId, $event) || (ctx.selectedTipoId = $event);
        return $event;
      });
      \u0275\u0275template(33, VistoriaInicioPage_ion_select_option_33_Template, 2, 2, "ion-select-option", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275template(34, VistoriaInicioPage_ion_item_34_Template, 4, 0, "ion-item", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "ion-card", 3)(36, "ion-item")(37, "ion-label", 5);
      \u0275\u0275text(38, "Od\xF4metro");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "ion-input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_input_ngModelChange_39_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.odometro, $event) || (ctx.odometro = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(40, "ion-item")(41, "ion-label", 5);
      \u0275\u0275text(42, "% Bateria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(43, "ion-input", 17);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_input_ngModelChange_43_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.bateria, $event) || (ctx.bateria = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(44, VistoriaInicioPage_ion_text_44_Template, 3, 1, "ion-text", 18);
      \u0275\u0275elementStart(45, "div", 19)(46, "ion-button", 20);
      \u0275\u0275listener("click", function VistoriaInicioPage_Template_ion_button_click_46_listener() {
        return ctx.iniciarVistoria();
      });
      \u0275\u0275template(47, VistoriaInicioPage_ion_spinner_47_Template, 1, 0, "ion-spinner", 21)(48, VistoriaInicioPage_span_48_Template, 2, 0, "span", 11);
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
      \u0275\u0275twoWayProperty("ngModel", ctx.odometro);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.bateria);
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
    DatePipe
  ], styles: ["\n\n.card[_ngcontent-%COMP%] {\n  margin: 16px;\n}\n.actions[_ngcontent-%COMP%] {\n  padding: 0 16px 24px;\n}\n.datetime-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-top: 22px;\n}\nion-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.selection-item[_ngcontent-%COMP%], \n.select-item[_ngcontent-%COMP%] {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.selection-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select[_ngcontent-%COMP%]::part(placeholder) {\n  color: #64748b;\n}\nion-select[_ngcontent-%COMP%]::part(text) {\n  color: #0f172a;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaInicioPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-inicio", standalone: true, imports: [
      NgIf,
      NgForOf,
      DatePipe,
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
      <ion-input type="number" [(ngModel)]="odometro" placeholder="Ex: 12345"></ion-input>\r
    </ion-item>\r
    <ion-item>\r
      <ion-label position="stacked">% Bateria</ion-label>\r
      <ion-input\r
        type="number"\r
        [(ngModel)]="bateria"\r
        placeholder="0 a 100"\r
        min="0"\r
        max="100"\r
      ></ion-input>\r
    </ion-item>\r
  </ion-card>\r
\r
  <ion-text color="danger" *ngIf="errorMessage">\r
    <p class="error-message">{{ errorMessage }}</p>\r
  </ion-text>\r
\r
  <div class="actions">\r
    <ion-button expand="block" [disabled]="!canStart || isSaving" (click)="iniciarVistoria()">\r
      <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r
      <span *ngIf="!isSaving">Iniciar Checklist</span>\r
    </ion-button>\r
  </div>\r
</ion-content>\r
`, styles: ["/* src/app/pages/vistoria/vistoria-inicio.page.scss */\n.card {\n  margin: 16px;\n}\n.actions {\n  padding: 0 16px 24px;\n}\n.datetime-item ion-button {\n  margin-top: 22px;\n}\nion-item ion-button {\n  margin-left: 8px;\n}\n.selection-item,\n.select-item {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item ion-label h3 {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item ion-label p {\n  color: #64748b;\n}\n.selection-item.is-selected {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select::part(placeholder) {\n  color: #64748b;\n}\nion-select::part(text) {\n  color: #0f172a;\n}\n.error-message {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaInicioPage, { className: "VistoriaInicioPage", filePath: "src/app/pages/vistoria/vistoria-inicio.page.ts", lineNumber: 70 });
})();
export {
  VistoriaInicioPage
};
//# sourceMappingURL=chunk-S4WCT7EI.js.map
