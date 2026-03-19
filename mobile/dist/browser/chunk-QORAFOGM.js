import {
  VeiculoService
} from "./chunk-INZQO2HI.js";
import {
  VistoriaBootstrapService
} from "./chunk-YKVIUHZJ.js";
import {
  VistoriaService
} from "./chunk-A6VD6RSH.js";
import {
  VistoriaFlowService
} from "./chunk-XK4MYM6O.js";
import {
  addIcons,
  refreshOutline
} from "./chunk-C5VNYMLZ.js";
import {
  AuthService
} from "./chunk-NMTSWNTL.js";
import {
  ErrorMessageService,
  environment
} from "./chunk-2MMOVOXA.js";
import {
  AlertController,
  Component,
  DecimalPipe,
  FormsModule,
  HttpClient,
  Injectable,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSearchbar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  NgControlStatus,
  NgForOf,
  NgIf,
  NgModel,
  Router,
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
} from "./chunk-46CAF6GZ.js";
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
    \u0275\u0275elementStart(0, "ion-buttons", 20);
    \u0275\u0275element(1, "ion-menu-button");
    \u0275\u0275elementEnd();
  }
}
function VistoriaInicioPage_ion_card_13_ion_item_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "ion-spinner", 21);
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
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 23)(10, "ion-button", 24);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template_ion_button_click_10_listener() {
      const vistoria_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.continuarVistoria(vistoria_r2));
    });
    \u0275\u0275text(11, " Continuar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "ion-button", 25);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template_ion_button_click_12_listener() {
      const vistoria_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cancelarVistoriaEmAndamento(vistoria_r2));
    });
    \u0275\u0275text(13, " Cancelar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const vistoria_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((vistoria_r2.veiculo == null ? null : vistoria_r2.veiculo.descricao) || "Ve\xEDculo");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Motorista: ", (vistoria_r2.motorista == null ? null : vistoria_r2.motorista.nome) || "---", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", vistoria_r2.motorista == null ? null : vistoria_r2.motorista.matricula);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Data: ", ctx_r2.formatarDataHora24(vistoria_r2.datavistoria), " ");
  }
}
function VistoriaInicioPage_ion_card_13_ion_list_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template, 14, 4, "ion-item", 22);
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
    \u0275\u0275element(2, "ion-spinner", 21);
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
    \u0275\u0275textInterpolate1("\xDAltimo Od\xF4metro: ", ctx_r2.ultimoOdometro === null ? "Sem hist\xF3rico" : \u0275\u0275pipeBind2(4, 2, ctx_r2.ultimoOdometro, "1.0-0"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Combust\xEDvel: ", ctx_r2.selectedVeiculo.combustivel || "-");
  }
}
function VistoriaInicioPage_ion_list_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list")(1, "ion-item");
    \u0275\u0275element(2, "ion-spinner", 21);
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
function VistoriaInicioPage_span_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "number");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xDAltimo od\xF4metro: ", \u0275\u0275pipeBind2(2, 1, ctx_r2.ultimoOdometro, "1.0-0"), " ");
  }
}
function VistoriaInicioPage_ion_text_39_Template(rf, ctx) {
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
function VistoriaInicioPage_ion_text_40_Template(rf, ctx) {
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
function VistoriaInicioPage_ion_spinner_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 21);
  }
}
function VistoriaInicioPage_span_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Iniciar Vistoria");
    \u0275\u0275elementEnd();
  }
}
var VistoriaInicioPage = class _VistoriaInicioPage {
  veiculoService = inject(VeiculoService);
  motoristaService = inject(MotoristaService);
  vistoriaService = inject(VistoriaService);
  flowService = inject(VistoriaFlowService);
  bootstrapService = inject(VistoriaBootstrapService);
  router = inject(Router);
  systemService = inject(SystemService);
  authService = inject(AuthService);
  alertController = inject(AlertController);
  errorMessageService = inject(ErrorMessageService);
  veiculos = [];
  motoristas = [];
  vistoriasEmAndamento = [];
  veiculoSearch = "";
  motoristaSearch = "";
  selectedVeiculo = null;
  selectedMotorista = null;
  odometro = null;
  odometroDisplay = "";
  bateria = null;
  ultimoOdometro = null;
  ultimoOdometroData = null;
  datavistoriaDisplay = "";
  datavistoriaIso = "";
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
        const modeloId = atualizada.veiculo?.idModelo ?? atualizada.veiculo?.modeloVeiculo?.id ?? vistoria.veiculo?.idModelo ?? vistoria.veiculo?.modeloVeiculo?.id;
        const modeloNome = atualizada.veiculo?.modeloVeiculo?.nome ?? atualizada.veiculo?.modelo ?? vistoria.veiculo?.modeloVeiculo?.nome ?? vistoria.veiculo?.modelo;
        this.flowService.iniciar(atualizada.id, {
          numeroVistoria: atualizada.numeroVistoria ?? vistoria.numeroVistoria,
          veiculoId: atualizada.idVeiculo ?? vistoria.idVeiculo,
          veiculoDescricao: atualizada.veiculo?.descricao ?? vistoria.veiculo?.descricao,
          veiculoModeloId: modeloId ?? void 0,
          veiculoModeloNome: modeloNome ?? void 0,
          datavistoria: atualizada.datavistoria ?? vistoria.datavistoria
        });
        void this.bootstrapService.warmup(atualizada.id);
        this.router.navigate(["/vistoria/areas"]);
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel retomar a vistoria. Tente novamente.");
      }
    });
  }
  formatarDataHora24(dateValue) {
    if (!dateValue) {
      return "-";
    }
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    const pad = (n) => n.toString().padStart(2, "0");
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  }
  cancelarVistoriaEmAndamento(vistoria) {
    return __async(this, null, function* () {
      const alert = yield this.alertController.create({
        header: "Cancelar vistoria",
        message: "Deseja realmente cancelar esta vistoria em andamento?",
        buttons: [
          { text: "Voltar", role: "cancel" },
          { text: "Cancelar vistoria", role: "confirm" }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role !== "confirm") {
        return;
      }
      try {
        yield this.vistoriaService.cancelarVistoria(vistoria.id);
        const flowVistoriaId = this.flowService.getVistoriaId();
        if (flowVistoriaId === vistoria.id) {
          this.flowService.finalizar();
        }
        this.bootstrapService.invalidate(vistoria.id);
        yield this.atualizarListaEmAndamento();
        yield this.carregarVistoriaEmEdicao();
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel cancelar a vistoria. Tente novamente.");
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
    return Boolean(this.selectedVeiculo && this.selectedMotorista && this.odometro !== null && this.odometro > 0 && this.odometro <= 9999999 && bateriaValida);
  }
  get startValidationMessage() {
    if (!this.selectedVeiculo) {
      return "Selecione um ve\xEDculo.";
    }
    if (!this.selectedMotorista) {
      return "Selecione um motorista.";
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
        const vistoriaId = this.flowService.getVistoriaId();
        if (vistoriaId) {
          try {
            const atualizada = yield this.vistoriaService.atualizarVistoria(vistoriaId, {
              idveiculo: this.selectedVeiculo.id,
              idmotorista: this.selectedMotorista.id,
              odometro: Number(this.odometro),
              porcentagembateria: this.bateria === null ? null : Number(this.bateria),
              datavistoria: this.datavistoriaIso
            });
            this.flowService.updateContext({
              numeroVistoria: atualizada.numeroVistoria,
              veiculoId: this.selectedVeiculo.id,
              veiculoDescricao: this.selectedVeiculo.descricao,
              veiculoModeloId: this.selectedVeiculo.idModelo ?? this.selectedVeiculo.modeloVeiculo?.id,
              veiculoModeloNome: this.selectedVeiculo.modeloVeiculo?.nome ?? this.selectedVeiculo.modelo ?? void 0,
              datavistoria: this.datavistoriaIso
            });
            void this.bootstrapService.warmup(atualizada.id);
            this.router.navigate(["/vistoria/areas"]);
            return;
          } catch (errorAtualizacao) {
            if (this.isVistoriaNaoEncontradaError(errorAtualizacao)) {
              this.flowService.finalizar();
            } else {
              throw errorAtualizacao;
            }
          }
        }
        const vistoria = yield this.vistoriaService.iniciarVistoria(__spreadProps(__spreadValues({
          idusuario: user.id,
          idveiculo: this.selectedVeiculo.id,
          idmotorista: this.selectedMotorista.id,
          odometro: Number(this.odometro)
        }, this.bateria !== null ? { porcentagembateria: Number(this.bateria) } : {}), {
          datavistoria: this.datavistoriaIso
        }));
        this.flowService.iniciar(vistoria.id, {
          numeroVistoria: vistoria.numeroVistoria,
          veiculoId: this.selectedVeiculo.id,
          veiculoDescricao: this.selectedVeiculo.descricao,
          veiculoModeloId: this.selectedVeiculo.idModelo ?? this.selectedVeiculo.modeloVeiculo?.id,
          veiculoModeloNome: this.selectedVeiculo.modeloVeiculo?.nome ?? this.selectedVeiculo.modelo ?? void 0,
          datavistoria: this.datavistoriaIso
        });
        void this.bootstrapService.warmup(vistoria.id);
        this.router.navigate(["/vistoria/areas"]);
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao iniciar vistoria. Tente novamente.");
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
          veiculoDescricao: vistoria.veiculo?.descricao,
          datavistoria: vistoria.datavistoria
        });
      } catch (error) {
        if (this.isVistoriaNaoEncontradaError(error)) {
          this.flowService.finalizar();
        }
      }
    });
  }
  isVistoriaNaoEncontradaError(error) {
    const status = error?.status;
    const message = error?.error?.message ?? error?.message ?? "";
    return status === 404 || /vistoria não encontrada/i.test(String(message));
  }
  static \u0275fac = function VistoriaInicioPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaInicioPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaInicioPage, selectors: [["app-vistoria-inicio"]], decls: 46, vars: 23, consts: [[3, "translucent"], ["slot", "start", 4, "ngIf"], [3, "fullscreen"], [1, "card"], [1, "datetime-item"], ["position", "stacked"], ["readonly", "true", 3, "value"], ["fill", "clear", "size", "small", "slot", "end", "aria-label", "Atualizar data/hora", 3, "click"], ["name", "refresh-outline"], ["class", "card", 4, "ngIf"], ["placeholder", "Buscar por descri\xE7\xE3o ou placa", 3, "ionInput", "ionClear", "debounce", "value"], [4, "ngIf"], ["placeholder", "Buscar por nome, matr\xEDcula ou CPF", 3, "ionInput", "ionClear", "debounce", "value"], ["position", "stacked", 1, "odometro-label"], ["class", "ultimo-odometro-destaque", 4, "ngIf"], ["type", "text", "inputmode", "numeric", "placeholder", "Ex: 12345", 1, "campo-destaque", 3, "ionInput", "value"], ["type", "number", "placeholder", "0 a 100", "min", "0", "max", "100", 1, "campo-destaque", 3, "ngModelChange", "ngModel", "disabled"], ["color", "danger", 4, "ngIf"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["slot", "start"], ["name", "crescent"], [4, "ngFor", "ngForOf"], ["slot", "end", 1, "andamento-actions"], ["fill", "outline", 3, "click"], ["fill", "outline", "color", "danger", 3, "click"], ["button", "", "class", "selection-item", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], ["button", "", 1, "selection-item", 3, "click"], [1, "ultimo-odometro-destaque"], ["color", "danger"], [1, "error-message"]], template: function VistoriaInicioPage_Template(rf, ctx) {
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
      \u0275\u0275elementStart(29, "ion-card", 3)(30, "ion-item")(31, "ion-label", 13);
      \u0275\u0275text(32, " Od\xF4metro ");
      \u0275\u0275template(33, VistoriaInicioPage_span_33_Template, 3, 4, "span", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "ion-input", 15);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_input_ionInput_34_listener($event) {
        return ctx.onOdometroInput($event.detail.value);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "ion-item")(36, "ion-label", 5);
      \u0275\u0275text(37, "% Bateria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "ion-input", 16);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.bateria, $event) || (ctx.bateria = $event);
        return $event;
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(39, VistoriaInicioPage_ion_text_39_Template, 3, 1, "ion-text", 17)(40, VistoriaInicioPage_ion_text_40_Template, 3, 1, "ion-text", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "ion-footer")(42, "ion-toolbar")(43, "ion-button", 18);
      \u0275\u0275listener("click", function VistoriaInicioPage_Template_ion_button_click_43_listener() {
        return ctx.iniciarVistoria();
      });
      \u0275\u0275template(44, VistoriaInicioPage_ion_spinner_44_Template, 1, 0, "ion-spinner", 19)(45, VistoriaInicioPage_span_45_Template, 2, 0, "span", 11);
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
      \u0275\u0275property("ngIf", ctx.ultimoOdometro !== null);
      \u0275\u0275advance();
      \u0275\u0275property("value", ctx.odometroDisplay);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.bateria);
      \u0275\u0275property("disabled", !ctx.isBateriaObrigatoria());
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.canStart && ctx.startValidationMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance(3);
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
    IonFooter,
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
    IonSpinner,
    IonText,
    DecimalPipe
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.card[_ngcontent-%COMP%] {\n  margin: 16px;\n}\n.datetime-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-top: 22px;\n}\nion-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.andamento-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  align-items: stretch;\n  min-width: 118px;\n}\n.andamento-actions[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.selection-item[_ngcontent-%COMP%], \n.select-item[_ngcontent-%COMP%] {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.selection-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select[_ngcontent-%COMP%]::part(placeholder) {\n  color: #64748b;\n}\nion-select[_ngcontent-%COMP%]::part(text) {\n  color: #0f172a;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n.campo-destaque[_ngcontent-%COMP%]::part(native) {\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n.odometro-label[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n}\n.ultimo-odometro-destaque[_ngcontent-%COMP%] {\n  color: #1d4ed8;\n  font-weight: 700;\n  font-size: 0.92rem;\n  background: #e8f1ff;\n  border: 1px solid #bfdbfe;\n  border-radius: 8px;\n  padding: 2px 8px;\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaInicioPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-inicio", standalone: true, imports: [
      NgIf,
      NgForOf,
      DecimalPipe,
      FormsModule,
      IonContent,
      IonFooter,
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
            Data: {{ formatarDataHora24(vistoria.datavistoria) }}\r
          </p>\r
        </ion-label>\r
        <div slot="end" class="andamento-actions">\r
          <ion-button fill="outline" (click)="continuarVistoria(vistoria)">\r
            Continuar\r
          </ion-button>\r
          <ion-button fill="outline" color="danger" (click)="cancelarVistoriaEmAndamento(vistoria)">\r
            Cancelar\r
          </ion-button>\r
        </div>\r
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
        <p>\xDAltimo Od\xF4metro: {{ ultimoOdometro === null ? 'Sem hist\xF3rico' : (ultimoOdometro | number:'1.0-0') }}</p>\r
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
    <ion-item>\r
      <ion-label position="stacked" class="odometro-label">\r
        Od\xF4metro\r
        <span class="ultimo-odometro-destaque" *ngIf="ultimoOdometro !== null">\r
          \xDAltimo od\xF4metro: {{ ultimoOdometro | number:'1.0-0' }}\r
        </span>\r
      </ion-label>\r
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
</ion-content>\r
\r
<ion-footer>\r
  <ion-toolbar>\r
    <ion-button expand="block" [disabled]="!canStart || isSaving" (click)="iniciarVistoria()">\r
      <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r
      <span *ngIf="!isSaving">Iniciar Vistoria</span>\r
    </ion-button>\r
  </ion-toolbar>\r
</ion-footer>\r
`, styles: ["/* src/app/pages/vistoria/vistoria-inicio.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.card {\n  margin: 16px;\n}\n.datetime-item ion-button {\n  margin-top: 22px;\n}\nion-item ion-button {\n  margin-left: 8px;\n}\n.andamento-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  align-items: stretch;\n  min-width: 118px;\n}\n.andamento-actions ion-button {\n  margin: 0;\n}\n.selection-item,\n.select-item {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item ion-label h3 {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item ion-label p {\n  color: #64748b;\n}\n.selection-item.is-selected {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select::part(placeholder) {\n  color: #64748b;\n}\nion-select::part(text) {\n  color: #0f172a;\n}\n.error-message {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n.campo-destaque::part(native) {\n  font-size: 1.25rem;\n  font-weight: 600;\n}\n.odometro-label {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n}\n.ultimo-odometro-destaque {\n  color: #1d4ed8;\n  font-weight: 700;\n  font-size: 0.92rem;\n  background: #e8f1ff;\n  border: 1px solid #bfdbfe;\n  border-radius: 8px;\n  padding: 2px 8px;\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaInicioPage, { className: "VistoriaInicioPage", filePath: "src/app/pages/vistoria/vistoria-inicio.page.ts", lineNumber: 69 });
})();
export {
  VistoriaInicioPage
};
//# sourceMappingURL=chunk-QORAFOGM.js.map
