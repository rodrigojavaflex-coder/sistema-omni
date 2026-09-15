import {
  VeiculoService
} from "./chunk-6BHNPHDX.js";
import {
  VistoriaBootstrapService
} from "./chunk-7ZWF5N4P.js";
import {
  exigePercentualNivel,
  mensagemPercentualNivelObrigatorio,
  rotuloPercentualNivel
} from "./chunk-GBM6MIDD.js";
import {
  VistoriaService
} from "./chunk-M3ZJWNPO.js";
import {
  addIcons,
  refreshOutline
} from "./chunk-4KKD5W2S.js";
import {
  VistoriaFlowService
} from "./chunk-EHNZXCFC.js";
import {
  AuthService,
  ErrorMessageService,
  environment
} from "./chunk-XXRWZG7R.js";
import {
  AlertController,
  Component,
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
  PatternValidator,
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
} from "./chunk-TLQ76MG3.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-JCEFQURH.js";
import "./chunk-PFHNU3CN.js";
import {
  Capacitor
} from "./chunk-52UEIZVD.js";
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
    \u0275\u0275elementStart(0, "ion-buttons", 25);
    \u0275\u0275element(1, "ion-menu-button", 26);
    \u0275\u0275elementEnd();
  }
}
function VistoriaInicioPage_ion_card_13_ion_item_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "ion-spinner", 27);
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
    const matricula_r2 = ctx.ngIf;
    const ctx_r2 = \u0275\u0275nextContext(4);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \u2022 Matricula: ", ctx_r2.formatarMatricula(matricula_r2), " ");
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
    \u0275\u0275template(6, VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_span_6_Template, 2, 1, "span", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 29)(10, "ion-button", 30);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template_ion_button_click_10_listener() {
      const vistoria_r4 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.continuarVistoria(vistoria_r4));
    });
    \u0275\u0275text(11, " Continuar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "ion-button", 31);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template_ion_button_click_12_listener() {
      const vistoria_r4 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r2.cancelarVistoriaEmAndamento(vistoria_r4));
    });
    \u0275\u0275text(13, " Excluir ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const vistoria_r4 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate((vistoria_r4.veiculo == null ? null : vistoria_r4.veiculo.descricao) || "Ve\xEDculo");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Motorista: ", (vistoria_r4.motorista == null ? null : vistoria_r4.motorista.nome) || "---", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", vistoria_r4.motorista == null ? null : vistoria_r4.motorista.matricula);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Data: ", ctx_r2.formatarDataHora24(vistoria_r4.datavistoria), " ");
  }
}
function VistoriaInicioPage_ion_card_13_ion_list_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_card_13_ion_list_5_ion_item_1_Template, 14, 4, "ion-item", 28);
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
    \u0275\u0275template(4, VistoriaInicioPage_ion_card_13_ion_item_4_Template, 4, 0, "ion-item", 12)(5, VistoriaInicioPage_ion_card_13_ion_list_5_Template, 2, 1, "ion-list", 12);
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
    \u0275\u0275element(2, "ion-spinner", 27);
    \u0275\u0275elementStart(3, "ion-label");
    \u0275\u0275text(4, "Buscando ve\xEDculos...");
    \u0275\u0275elementEnd()()();
  }
}
function VistoriaInicioPage_ion_list_20_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 33);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_list_20_ion_item_1_Template_ion_item_click_0_listener() {
      const veiculo_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selecionarVeiculo(veiculo_r6));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const veiculo_r6 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", (ctx_r2.selectedVeiculo == null ? null : ctx_r2.selectedVeiculo.id) === veiculo_r6.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(veiculo_r6.descricao);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(veiculo_r6.placa);
  }
}
function VistoriaInicioPage_ion_list_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_list_20_ion_item_1_Template, 6, 4, "ion-item", 32);
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
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("\xDAltimo Od\xF4metro: ", ctx_r2.formatarNumeroSemSeparador(ctx_r2.ultimoOdometro));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Combust\xEDvel: ", ctx_r2.selectedVeiculo.combustivel || "-");
  }
}
function VistoriaInicioPage_ion_list_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list")(1, "ion-item");
    \u0275\u0275element(2, "ion-spinner", 27);
    \u0275\u0275elementStart(3, "ion-label");
    \u0275\u0275text(4, "Buscando motoristas...");
    \u0275\u0275elementEnd()()();
  }
}
function VistoriaInicioPage_ion_list_28_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 33);
    \u0275\u0275listener("click", function VistoriaInicioPage_ion_list_28_ion_item_1_Template_ion_item_click_0_listener() {
      const motorista_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.selecionarMotorista(motorista_r8));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h3");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const motorista_r8 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("is-selected", (ctx_r2.selectedMotorista == null ? null : ctx_r2.selectedMotorista.id) === motorista_r8.id);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(motorista_r8.nome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Matr\xEDcula: ", ctx_r2.formatarMatricula(motorista_r8.matricula));
  }
}
function VistoriaInicioPage_ion_list_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaInicioPage_ion_list_28_ion_item_1_Template, 6, 4, "ion-item", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r2.motoristas);
  }
}
function VistoriaInicioPage_div_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" \xDAltimo od\xF4metro: ", ctx_r2.formatarNumeroSemSeparador(ctx_r2.ultimoOdometro), " ");
  }
}
function VistoriaInicioPage_ion_text_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 35)(1, "p", 36);
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
    \u0275\u0275elementStart(0, "ion-text", 35)(1, "p", 36);
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
    \u0275\u0275element(0, "ion-spinner", 27);
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
  scrollFocusTimeout = null;
  keyboardFocusListener = null;
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
    });
  }
  ngOnDestroy() {
    this.limparScrollFocusPendente();
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      if (this.flowService.getVistoriaId()) {
        this.router.navigate(["/vistoria/areas"]);
        return;
      }
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
        const modeloNome = atualizada.veiculo?.modeloVeiculo?.nome ?? vistoria.veiculo?.modeloVeiculo?.nome;
        this.flowService.iniciar(atualizada.id, {
          numeroVistoria: atualizada.numeroVistoria ?? vistoria.numeroVistoria,
          veiculoId: atualizada.idVeiculo ?? vistoria.idVeiculo,
          veiculoDescricao: atualizada.veiculo?.descricao ?? vistoria.veiculo?.descricao,
          veiculoModeloId: modeloId ?? void 0,
          veiculoModeloNome: modeloNome ?? void 0,
          datavistoria: atualizada.datavistoria ?? vistoria.datavistoria
        });
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
        header: "Excluir vistoria",
        message: "Deseja excluir a vistoria?",
        cssClass: "alert-excluir-vistoria",
        buttons: [
          { text: "Voltar", role: "cancel", cssClass: "alert-button-continuar" },
          { text: "Excluir vistoria", role: "confirm", cssClass: "alert-button-excluir" }
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
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel excluir a vistoria. Tente novamente.");
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
    this.odometroDisplay = parsed.toString();
  }
  formatarNumeroSemSeparador(value) {
    if (value === null || value === void 0) {
      return "Sem hist\xF3rico";
    }
    return Math.trunc(value).toString();
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
      return mensagemPercentualNivelObrigatorio(this.selectedVeiculo?.combustivel);
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
          veiculoModeloNome: this.selectedVeiculo.modeloVeiculo?.nome ?? void 0,
          datavistoria: this.datavistoriaIso
        });
        this.router.navigate(["/vistoria/areas"]);
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao iniciar vistoria. Tente novamente.");
      } finally {
        this.isSaving = false;
      }
    });
  }
  isBateriaObrigatoria() {
    return exigePercentualNivel(this.selectedVeiculo?.combustivel);
  }
  get rotuloPercentualNivel() {
    return rotuloPercentualNivel(this.selectedVeiculo?.combustivel);
  }
  onCampoFocus(cardId) {
    return __async(this, null, function* () {
      const card = document.getElementById(cardId);
      if (!card) {
        return;
      }
      this.limparScrollFocusPendente();
      yield this.rolarCardParaTopo(card);
      this.scrollFocusTimeout = window.setTimeout(() => {
        void this.rolarCardParaTopo(card);
      }, 350);
      this.keyboardFocusListener = () => {
        this.limparScrollFocusPendente();
        window.setTimeout(() => {
          void this.rolarCardParaTopo(card);
        }, 50);
      };
      window.addEventListener("ionKeyboardDidShow", this.keyboardFocusListener, {
        once: true
      });
    });
  }
  rolarCardParaTopo(card) {
    return __async(this, null, function* () {
      const contentEl = card.closest("ion-content");
      if (!contentEl || !this.isConteudoRolavel(contentEl)) {
        return;
      }
      const scrollEl = yield contentEl.getScrollElement();
      const pagina = card.closest(".ion-page");
      const header = (pagina ?? document).querySelector("ion-header");
      const topoVisivel = header ? header.getBoundingClientRect().bottom : scrollEl.getBoundingClientRect().top;
      const y = scrollEl.scrollTop + card.getBoundingClientRect().top - topoVisivel - 8;
      yield contentEl.scrollToPoint(0, Math.max(0, y), 250);
    });
  }
  isConteudoRolavel(el) {
    const candidato = el;
    return typeof candidato.getScrollElement === "function" && typeof candidato.scrollToPoint === "function";
  }
  limparScrollFocusPendente() {
    if (this.scrollFocusTimeout !== null) {
      window.clearTimeout(this.scrollFocusTimeout);
      this.scrollFocusTimeout = null;
    }
    if (this.keyboardFocusListener) {
      window.removeEventListener("ionKeyboardDidShow", this.keyboardFocusListener);
      this.keyboardFocusListener = null;
    }
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
  static \u0275fac = function VistoriaInicioPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaInicioPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaInicioPage, selectors: [["app-vistoria-inicio"]], decls: 46, vars: 24, consts: [[3, "translucent"], ["slot", "start", 4, "ngIf"], [3, "fullscreen"], [1, "card"], [1, "datetime-item"], ["position", "stacked"], ["readonly", "true", 3, "value"], ["fill", "clear", "size", "small", "slot", "end", "aria-label", "Atualizar data/hora", 3, "click"], ["name", "refresh-outline"], ["class", "card", 4, "ngIf"], ["id", "vistoria-card-veiculo", 1, "card", 3, "focusin"], ["placeholder", "Buscar por descri\xE7\xE3o ou placa", 3, "ionInput", "ionClear", "ionFocus", "debounce", "value"], [4, "ngIf"], ["id", "vistoria-card-motorista", 1, "card", 3, "focusin"], ["placeholder", "Buscar por nome, matr\xEDcula ou CPF", 3, "ionInput", "ionClear", "ionFocus", "debounce", "value"], ["id", "vistoria-card-medidas", 1, "card", 3, "focusin"], [1, "medida-row"], [1, "medida-label"], ["type", "text", "inputmode", "numeric", "pattern", "[0-9]*", "placeholder", "Ex: 12345", 1, "campo-destaque", 3, "ionInput", "ionFocus", "value"], ["class", "ultimo-odometro-linha", 4, "ngIf"], [1, "medida-row", "medida-row-separada"], ["type", "number", "inputmode", "numeric", "pattern", "[0-9]*", "placeholder", "0 a 100", "min", "0", "max", "100", 1, "campo-destaque", 3, "ngModelChange", "ionFocus", "ngModel", "disabled"], ["color", "danger", 4, "ngIf"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["slot", "start"], ["menu", "main-menu"], ["name", "crescent"], [4, "ngFor", "ngForOf"], ["slot", "end", 1, "andamento-actions"], ["fill", "outline", 3, "click"], ["fill", "outline", "color", "danger", 3, "click"], ["button", "", "class", "selection-item", 3, "is-selected", "click", 4, "ngFor", "ngForOf"], ["button", "", 1, "selection-item", 3, "click"], [1, "ultimo-odometro-linha"], ["color", "danger"], [1, "error-message"]], template: function VistoriaInicioPage_Template(rf, ctx) {
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
      \u0275\u0275elementStart(14, "ion-card", 10);
      \u0275\u0275listener("focusin", function VistoriaInicioPage_Template_ion_card_focusin_14_listener() {
        return ctx.onCampoFocus("vistoria-card-veiculo");
      });
      \u0275\u0275elementStart(15, "ion-item")(16, "ion-label", 5);
      \u0275\u0275text(17, "Ve\xEDculo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "ion-searchbar", 11);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_searchbar_ionInput_18_listener($event) {
        return ctx.onBuscarVeiculos($event);
      })("ionClear", function VistoriaInicioPage_Template_ion_searchbar_ionClear_18_listener() {
        return ctx.limparVeiculo();
      })("ionFocus", function VistoriaInicioPage_Template_ion_searchbar_ionFocus_18_listener() {
        return ctx.onCampoFocus("vistoria-card-veiculo");
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(19, VistoriaInicioPage_ion_list_19_Template, 5, 0, "ion-list", 12)(20, VistoriaInicioPage_ion_list_20_Template, 2, 1, "ion-list", 12)(21, VistoriaInicioPage_ion_item_21_Template, 6, 2, "ion-item", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "ion-card", 13);
      \u0275\u0275listener("focusin", function VistoriaInicioPage_Template_ion_card_focusin_22_listener() {
        return ctx.onCampoFocus("vistoria-card-motorista");
      });
      \u0275\u0275elementStart(23, "ion-item")(24, "ion-label", 5);
      \u0275\u0275text(25, "Motorista");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(26, "ion-searchbar", 14);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_searchbar_ionInput_26_listener($event) {
        return ctx.onBuscarMotoristas($event);
      })("ionClear", function VistoriaInicioPage_Template_ion_searchbar_ionClear_26_listener() {
        return ctx.limparMotorista();
      })("ionFocus", function VistoriaInicioPage_Template_ion_searchbar_ionFocus_26_listener() {
        return ctx.onCampoFocus("vistoria-card-motorista");
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(27, VistoriaInicioPage_ion_list_27_Template, 5, 0, "ion-list", 12)(28, VistoriaInicioPage_ion_list_28_Template, 2, 1, "ion-list", 12);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(29, "ion-card", 15);
      \u0275\u0275listener("focusin", function VistoriaInicioPage_Template_ion_card_focusin_29_listener() {
        return ctx.onCampoFocus("vistoria-card-medidas");
      });
      \u0275\u0275elementStart(30, "div", 16)(31, "span", 17);
      \u0275\u0275text(32, "Od\xF4metro");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(33, "ion-input", 18);
      \u0275\u0275listener("ionInput", function VistoriaInicioPage_Template_ion_input_ionInput_33_listener($event) {
        return ctx.onOdometroInput($event.detail.value);
      })("ionFocus", function VistoriaInicioPage_Template_ion_input_ionFocus_33_listener() {
        return ctx.onCampoFocus("vistoria-card-medidas");
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(34, VistoriaInicioPage_div_34_Template, 2, 1, "div", 19);
      \u0275\u0275elementStart(35, "div", 20)(36, "span", 17);
      \u0275\u0275text(37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "ion-input", 21);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaInicioPage_Template_ion_input_ngModelChange_38_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.bateria, $event) || (ctx.bateria = $event);
        return $event;
      });
      \u0275\u0275listener("ionFocus", function VistoriaInicioPage_Template_ion_input_ionFocus_38_listener() {
        return ctx.onCampoFocus("vistoria-card-medidas");
      });
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(39, VistoriaInicioPage_ion_text_39_Template, 3, 1, "ion-text", 22)(40, VistoriaInicioPage_ion_text_40_Template, 3, 1, "ion-text", 22);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "ion-footer")(42, "ion-toolbar")(43, "ion-button", 23);
      \u0275\u0275listener("click", function VistoriaInicioPage_Template_ion_button_click_43_listener() {
        return ctx.iniciarVistoria();
      });
      \u0275\u0275template(44, VistoriaInicioPage_ion_spinner_44_Template, 1, 0, "ion-spinner", 24)(45, VistoriaInicioPage_span_45_Template, 2, 0, "span", 12);
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
      \u0275\u0275property("value", ctx.odometroDisplay);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.ultimoOdometro !== null);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.rotuloPercentualNivel);
      \u0275\u0275advance();
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
    PatternValidator,
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
    IonText
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: 8px;\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.card[_ngcontent-%COMP%] {\n  margin: 16px;\n}\n.datetime-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-top: 22px;\n}\nion-item[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin-left: 8px;\n}\n.andamento-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  align-items: stretch;\n  min-width: 118px;\n}\n.andamento-actions[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.selection-item[_ngcontent-%COMP%], \n.select-item[_ngcontent-%COMP%] {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #64748b;\n}\n.selection-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select[_ngcontent-%COMP%]::part(placeholder) {\n  color: #64748b;\n}\nion-select[_ngcontent-%COMP%]::part(text) {\n  color: #0f172a;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n.campo-destaque[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: 1.5rem;\n  font-weight: 700;\n  text-align: end;\n}\n.campo-destaque[_ngcontent-%COMP%]::part(native) {\n  font-size: 1.5rem;\n  font-weight: 700;\n  text-align: end;\n}\n.medida-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  min-height: 52px;\n  padding: 8px 16px;\n}\n.medida-row-separada[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--ion-item-border-color, var(--ion-color-step-150, #e2e8f0));\n}\n.medida-label[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  white-space: nowrap;\n  color: var(--ion-text-color);\n  font-size: 1rem;\n}\n.ultimo-odometro-linha[_ngcontent-%COMP%] {\n  margin: 0 16px 8px;\n  font-size: 0.92rem;\n  font-weight: 700;\n  color: var(--ion-color-primary);\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaInicioPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-inicio", standalone: true, imports: [
      NgIf,
      NgForOf,
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
    ], template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start" *ngIf="isNative">
      <ion-menu-button menu="main-menu"></ion-menu-button>
    </ion-buttons>
    <ion-title>Nova Vistoria</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-card class="card">
    <ion-item class="datetime-item">
      <ion-label position="stacked">Data/Hora</ion-label>
      <ion-input [value]="datavistoriaDisplay" readonly="true"></ion-input>
      <ion-button
        fill="clear"
        size="small"
        slot="end"
        aria-label="Atualizar data/hora"
        (click)="atualizarDataHora()"
      >
        <ion-icon name="refresh-outline"></ion-icon>
      </ion-button>
    </ion-item>
  </ion-card>

  <ion-card class="card" *ngIf="loadingAndamento || vistoriasEmAndamento.length > 0">
    <ion-item>
      <ion-label position="stacked">Vistorias em andamento</ion-label>
    </ion-item>
    <ion-item *ngIf="loadingAndamento">
      <ion-spinner name="crescent"></ion-spinner>
      <ion-label>Carregando vistorias...</ion-label>
    </ion-item>
    <ion-list *ngIf="!loadingAndamento && vistoriasEmAndamento.length > 0">
      <ion-item *ngFor="let vistoria of vistoriasEmAndamento">
        <ion-label>
          <h3>{{ vistoria.veiculo?.descricao || 'Ve\xEDculo' }}</h3>
          <p>
            Motorista: {{ vistoria.motorista?.nome || '---' }}
            <span *ngIf="vistoria.motorista?.matricula as matricula">
              \u2022 Matricula: {{ formatarMatricula(matricula) }}
            </span>
          </p>
          <p>
            Data: {{ formatarDataHora24(vistoria.datavistoria) }}
          </p>
        </ion-label>
        <div slot="end" class="andamento-actions">
          <ion-button fill="outline" (click)="continuarVistoria(vistoria)">
            Continuar
          </ion-button>
          <ion-button fill="outline" color="danger" (click)="cancelarVistoriaEmAndamento(vistoria)">
            Excluir
          </ion-button>
        </div>
      </ion-item>
    </ion-list>
  </ion-card>

  <ion-card
    class="card"
    id="vistoria-card-veiculo"
    (focusin)="onCampoFocus('vistoria-card-veiculo')"
  >
    <ion-item>
      <ion-label position="stacked">Ve\xEDculo</ion-label>
      <ion-searchbar
        [debounce]="350"
        placeholder="Buscar por descri\xE7\xE3o ou placa"
        [value]="veiculoSearch"
        (ionInput)="onBuscarVeiculos($event)"
        (ionClear)="limparVeiculo()"
        (ionFocus)="onCampoFocus('vistoria-card-veiculo')"
      ></ion-searchbar>
    </ion-item>
    <ion-list *ngIf="loadingVeiculos">
      <ion-item>
        <ion-spinner name="crescent"></ion-spinner>
        <ion-label>Buscando ve\xEDculos...</ion-label>
      </ion-item>
    </ion-list>
    <ion-list *ngIf="!loadingVeiculos && veiculos.length > 0">
      <ion-item
        button
        class="selection-item"
        [class.is-selected]="selectedVeiculo?.id === veiculo.id"
        *ngFor="let veiculo of veiculos"
        (click)="selecionarVeiculo(veiculo)"
      >
        <ion-label>
          <h3>{{ veiculo.descricao }}</h3>
          <p>{{ veiculo.placa }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
    <ion-item *ngIf="selectedVeiculo">
      <ion-label>
        <p>\xDAltimo Od\xF4metro: {{ formatarNumeroSemSeparador(ultimoOdometro) }}</p>
        <p>Combust\xEDvel: {{ selectedVeiculo.combustivel || '-' }}</p>
      </ion-label>
    </ion-item>
  </ion-card>

  <ion-card
    class="card"
    id="vistoria-card-motorista"
    (focusin)="onCampoFocus('vistoria-card-motorista')"
  >
    <ion-item>
      <ion-label position="stacked">Motorista</ion-label>
      <ion-searchbar
        [debounce]="350"
        placeholder="Buscar por nome, matr\xEDcula ou CPF"
        [value]="motoristaSearch"
        (ionInput)="onBuscarMotoristas($event)"
        (ionClear)="limparMotorista()"
        (ionFocus)="onCampoFocus('vistoria-card-motorista')"
      ></ion-searchbar>
    </ion-item>
    <ion-list *ngIf="loadingMotoristas">
      <ion-item>
        <ion-spinner name="crescent"></ion-spinner>
        <ion-label>Buscando motoristas...</ion-label>
      </ion-item>
    </ion-list>
    <ion-list *ngIf="!loadingMotoristas && motoristas.length > 0">
      <ion-item
        button
        class="selection-item"
        [class.is-selected]="selectedMotorista?.id === motorista.id"
        *ngFor="let motorista of motoristas"
        (click)="selecionarMotorista(motorista)"
      >
        <ion-label>
          <h3>{{ motorista.nome }}</h3>
          <p>Matr\xEDcula: {{ formatarMatricula(motorista.matricula) }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-card>

  <ion-card
    class="card"
    id="vistoria-card-medidas"
    (focusin)="onCampoFocus('vistoria-card-medidas')"
  >
    <div class="medida-row">
      <span class="medida-label">Od\xF4metro</span>
      <ion-input
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        placeholder="Ex: 12345"
        class="campo-destaque"
        [value]="odometroDisplay"
        (ionInput)="onOdometroInput($event.detail.value)"
        (ionFocus)="onCampoFocus('vistoria-card-medidas')"
      ></ion-input>
    </div>
    <div class="ultimo-odometro-linha" *ngIf="ultimoOdometro !== null">
      \xDAltimo od\xF4metro: {{ formatarNumeroSemSeparador(ultimoOdometro) }}
    </div>
    <div class="medida-row medida-row-separada">
      <span class="medida-label">{{ rotuloPercentualNivel }}</span>
      <ion-input
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        [(ngModel)]="bateria"
        placeholder="0 a 100"
        min="0"
        max="100"
        [disabled]="!isBateriaObrigatoria()"
        class="campo-destaque"
        (ionFocus)="onCampoFocus('vistoria-card-medidas')"
      ></ion-input>
    </div>
  </ion-card>

  <ion-text color="danger" *ngIf="!canStart && startValidationMessage">
    <p class="error-message">{{ startValidationMessage }}</p>
  </ion-text>

  <ion-text color="danger" *ngIf="errorMessage">
    <p class="error-message">{{ errorMessage }}</p>
  </ion-text>

</ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-button expand="block" [disabled]="!canStart || isSaving" (click)="iniciarVistoria()">
      <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>
      <span *ngIf="!isSaving">Iniciar Vistoria</span>
    </ion-button>
  </ion-toolbar>
</ion-footer>
`, styles: ["/* src/app/pages/vistoria/vistoria-inicio.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: 8px;\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.card {\n  margin: 16px;\n}\n.datetime-item ion-button {\n  margin-top: 22px;\n}\nion-item ion-button {\n  margin-left: 8px;\n}\n.andamento-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  align-items: stretch;\n  min-width: 118px;\n}\n.andamento-actions ion-button {\n  margin: 0;\n}\n.selection-item,\n.select-item {\n  --background: #ffffff;\n  --color: #0f172a;\n  --border-color: #e2e8f0;\n  --border-width: 1px;\n  --border-style: solid;\n  --border-radius: 12px;\n  margin: 6px 12px;\n}\n.selection-item ion-label h3 {\n  color: #0f172a;\n  font-weight: 600;\n}\n.selection-item ion-label p {\n  color: #64748b;\n}\n.selection-item.is-selected {\n  --background: #e8f1ff;\n  --border-color: #3b82f6;\n  --color: #1d4ed8;\n}\nion-select::part(placeholder) {\n  color: #64748b;\n}\nion-select::part(text) {\n  color: #0f172a;\n}\n.error-message {\n  margin: 8px 16px;\n  font-size: 0.9rem;\n}\n.campo-destaque {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: 1.5rem;\n  font-weight: 700;\n  text-align: end;\n}\n.campo-destaque::part(native) {\n  font-size: 1.5rem;\n  font-weight: 700;\n  text-align: end;\n}\n.medida-row {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  min-height: 52px;\n  padding: 8px 16px;\n}\n.medida-row-separada {\n  border-top: 1px solid var(--ion-item-border-color, var(--ion-color-step-150, #e2e8f0));\n}\n.medida-label {\n  flex: 0 0 auto;\n  white-space: nowrap;\n  color: var(--ion-text-color);\n  font-size: 1rem;\n}\n.ultimo-odometro-linha {\n  margin: 0 16px 8px;\n  font-size: 0.92rem;\n  font-weight: 700;\n  color: var(--ion-color-primary);\n}\n/*# sourceMappingURL=vistoria-inicio.page.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaInicioPage, { className: "VistoriaInicioPage", filePath: "app/pages/vistoria/vistoria-inicio.page.ts", lineNumber: 73 });
})();
export {
  VistoriaInicioPage
};
//# sourceMappingURL=chunk-7XDBSKXY.js.map
