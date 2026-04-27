import {
  VistoriaService
} from "./chunk-QFS5PTE7.js";
import {
  VistoriaFlowService
} from "./chunk-E32UKBIK.js";
import {
  AuthService
} from "./chunk-SUV23HSM.js";
import {
  ErrorMessageService
} from "./chunk-3HI66MTA.js";
import {
  Component,
  FormsModule,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NgControlStatus,
  NgIf,
  NgModel,
  Router,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-37Y5E3Q6.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-5JG7MXFI.js";
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
  __async
} from "./chunk-3RNQ4BE2.js";

// src/app/pages/vistoria/vistoria-finalizar.page.ts
function VistoriaFinalizarPage_div_8_div_29_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const detalhe_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(detalhe_r1);
  }
}
function VistoriaFinalizarPage_div_8_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24)(1, "p")(2, "strong");
    \u0275\u0275text(3, "Detalhes:");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(4, VistoriaFinalizarPage_div_8_div_29_For_5_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.resumoIrregularidadesDetalhes);
  }
}
function VistoriaFinalizarPage_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "p")(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p")(6, "strong");
    \u0275\u0275text(7, "Vistoriador:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "strong");
    \u0275\u0275text(11, "Ve\xEDculo vistoriado:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p")(14, "strong");
    \u0275\u0275text(15, "Motorista:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p")(18, "strong");
    \u0275\u0275text(19, "Od\xF4metro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p")(22, "strong");
    \u0275\u0275text(23, "% Bateria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p")(26, "strong");
    \u0275\u0275text(27, "Irregularidades identificadas:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275template(29, VistoriaFinalizarPage_div_8_div_29_Template, 6, 0, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVistoriaNumero);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVistoriador);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVeiculo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoMotorista);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoOdometro);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoBateria);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoIrregularidades);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.resumoIrregularidadesDetalhes.length > 0);
  }
}
function VistoriaFinalizarPage_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "p");
    \u0275\u0275text(2, "Carregando resumo da vistoria...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaFinalizarPage_ion_text_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 25)(1, "p", 26);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaFinalizarPage_ion_spinner_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 27);
  }
}
function VistoriaFinalizarPage_span_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Finalizar Vistoria");
    \u0275\u0275elementEnd();
  }
}
function VistoriaFinalizarPage_div_35_p_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "- Nenhuma irregularidade registrada");
    \u0275\u0275elementEnd();
  }
}
function VistoriaFinalizarPage_div_35_For_34_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const detalhe_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("- ", detalhe_r4);
  }
}
function VistoriaFinalizarPage_div_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p")(5, "strong");
    \u0275\u0275text(6, "Vistoriador:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p")(9, "strong");
    \u0275\u0275text(10, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p")(13, "strong");
    \u0275\u0275text(14, "Motorista:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p")(17, "strong");
    \u0275\u0275text(18, "Od\xF4metro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p")(21, "strong");
    \u0275\u0275text(22, "% Bateria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p")(25, "strong");
    \u0275\u0275text(26, "Irregularidades:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 30)(29, "p")(30, "strong");
    \u0275\u0275text(31, "Resumo:");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(32, VistoriaFinalizarPage_div_35_p_32_Template, 2, 0, "p", 16);
    \u0275\u0275repeaterCreate(33, VistoriaFinalizarPage_div_35_For_34_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "ion-button", 31);
    \u0275\u0275listener("click", function VistoriaFinalizarPage_div_35_Template_ion_button_click_35_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.confirmarConclusao());
    });
    \u0275\u0275text(36, "OK");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Vistoria ", ctx_r1.resumoVistoriaNumero, " conclu\xEDda com sucesso");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVistoriador);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVeiculo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoMotorista);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoOdometro);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoBateria);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoIrregularidades);
    \u0275\u0275advance(5);
    \u0275\u0275property("ngIf", ctx_r1.resumoIrregularidadesDetalhes.length === 0);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.resumoIrregularidadesDetalhes);
  }
}
var VistoriaFinalizarPage = class _VistoriaFinalizarPage {
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  router = inject(Router);
  authService = inject(AuthService);
  errorMessageService = inject(ErrorMessageService);
  observacao = "";
  tempoMinutos = 0;
  isSaving = false;
  loadingResumo = false;
  errorMessage = "";
  resumoVistoriador = "-";
  resumoVeiculo = "-";
  resumoMotorista = "-";
  resumoOdometro = "-";
  resumoBateria = "-";
  resumoIrregularidades = 0;
  resumoIrregularidadesDetalhes = [];
  sucessoVisivel = false;
  sucessoResolver = null;
  get vistoriaNrDisplay() {
    const nr = this.flowService.getNumeroVistoriaDisplay();
    return nr ? `Vistoria - ${nr}` : "Vistoria";
  }
  get veiculoDisplay() {
    const veiculo = this.flowService.getVeiculoDescricao();
    return veiculo ? `Ve\xEDculo ${veiculo}` : "Ve\xEDculo -";
  }
  get resumoVistoriaNumero() {
    return this.flowService.getNumeroVistoriaDisplay() || "-";
  }
  get tempoTotalFormatado() {
    const totalMinutos = Math.max(0, Number(this.tempoMinutos) || 0);
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
  }
  ngOnInit() {
    return __async(this, null, function* () {
      this.tempoMinutos = this.flowService.getTempoEmMinutos();
      yield this.carregarResumo();
    });
  }
  voltar() {
    this.router.navigate(["/vistoria/areas"]);
  }
  finalizar() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.isSaving = true;
      this.errorMessage = "";
      try {
        yield this.vistoriaService.finalizarVistoria(vistoriaId, {
          tempo: this.tempoMinutos,
          observacao: this.observacao?.trim() || void 0
        });
        yield this.mostrarResumoConclusao();
        this.flowService.finalizar();
        this.router.navigate(["/home"]);
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao finalizar vistoria. Tente novamente.");
      } finally {
        this.isSaving = false;
      }
    });
  }
  carregarResumo() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId)
        return;
      this.loadingResumo = true;
      try {
        const [vistoria, irregularidades] = yield Promise.all([
          this.vistoriaService.getById(vistoriaId),
          this.vistoriaService.listarIrregularidades(vistoriaId)
        ]);
        const currentUser = this.authService.getCurrentUser();
        if (vistoria.idUsuario && currentUser?.id === vistoria.idUsuario) {
          this.resumoVistoriador = currentUser.nome ?? vistoria.idUsuario;
        } else {
          this.resumoVistoriador = vistoria.idUsuario ?? "-";
        }
        this.resumoVeiculo = vistoria.veiculo?.descricao ?? "-";
        this.resumoMotorista = vistoria.motorista?.nome ?? "-";
        this.resumoOdometro = vistoria.odometro != null ? `${vistoria.odometro}` : "-";
        this.resumoBateria = vistoria.porcentagembateria == null ? "-" : `${vistoria.porcentagembateria}%`;
        this.resumoIrregularidades = irregularidades.length;
        this.resumoIrregularidadesDetalhes = irregularidades.map((item) => {
          const area = item.nomeArea ?? item.idarea ?? "\xC1rea";
          const componente = item.nomeComponente ?? item.idcomponente ?? "Componente";
          const sintoma = item.descricaoSintoma ?? item.idsintoma ?? "Sintoma";
          return `${area} - ${componente} - ${sintoma}`;
        });
      } finally {
        this.loadingResumo = false;
      }
    });
  }
  mostrarResumoConclusao() {
    return __async(this, null, function* () {
      this.sucessoVisivel = true;
      yield new Promise((resolve) => {
        this.sucessoResolver = resolve;
      });
    });
  }
  confirmarConclusao() {
    this.sucessoVisivel = false;
    if (this.sucessoResolver) {
      this.sucessoResolver();
      this.sucessoResolver = null;
    }
  }
  static \u0275fac = function VistoriaFinalizarPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaFinalizarPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaFinalizarPage, selectors: [["app-vistoria-finalizar"]], decls: 36, vars: 11, consts: [[3, "translucent"], ["slot", "start"], [3, "fullscreen"], [1, "content"], ["class", "resumo-vistoria", 4, "ngIf"], ["position", "stacked", 1, "tempo-total-label"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["cx", "12", "cy", "12", "r", "10"], ["points", "12 6 12 12 16 14"], [1, "tempo-total-valor"], ["position", "stacked"], ["placeholder", "Observa\xE7\xE3o opcional", 3, "ngModelChange", "ngModel"], ["color", "danger", 4, "ngIf"], [1, "footer-actions"], [1, "btn-main", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], [4, "ngIf"], ["fill", "outline", "color", "medium", 1, "btn-voltar", 3, "click"], ["slot", "start", "xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["points", "9 14 4 9 9 4"], ["d", "M20 20v-7a4 4 0 0 0-4-4H4"], ["class", "sucesso-overlay", "aria-modal", "true", "role", "dialog", 4, "ngIf"], [1, "resumo-vistoria"], ["class", "irregularidades-lista", 4, "ngIf"], [1, "irregularidades-lista"], ["color", "danger"], [1, "error-message"], ["name", "crescent"], ["aria-modal", "true", "role", "dialog", 1, "sucesso-overlay"], [1, "sucesso-card"], [1, "irregularidades-lista-overlay"], ["expand", "block", 3, "click"]], template: function VistoriaFinalizarPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Finalizar Vistoria");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "ion-content", 2)(7, "div", 3);
      \u0275\u0275template(8, VistoriaFinalizarPage_div_8_Template, 30, 8, "div", 4)(9, VistoriaFinalizarPage_div_9_Template, 3, 0, "div", 4);
      \u0275\u0275elementStart(10, "ion-item")(11, "ion-label", 5)(12, "span");
      \u0275\u0275text(13, "Tempo total (minutos):");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 6);
      \u0275\u0275element(15, "circle", 7)(16, "polyline", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(17, "ion-text", 9);
      \u0275\u0275text(18);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(19, "ion-item")(20, "ion-label", 10);
      \u0275\u0275text(21, "Observa\xE7\xE3o geral");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(22, "ion-textarea", 11);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaFinalizarPage_Template_ion_textarea_ngModelChange_22_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.observacao, $event) || (ctx.observacao = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(23, VistoriaFinalizarPage_ion_text_23_Template, 3, 1, "ion-text", 12);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(24, "ion-footer")(25, "ion-toolbar")(26, "div", 13)(27, "ion-button", 14);
      \u0275\u0275listener("click", function VistoriaFinalizarPage_Template_ion_button_click_27_listener() {
        return ctx.finalizar();
      });
      \u0275\u0275template(28, VistoriaFinalizarPage_ion_spinner_28_Template, 1, 0, "ion-spinner", 15)(29, VistoriaFinalizarPage_span_29_Template, 2, 0, "span", 16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "ion-button", 17);
      \u0275\u0275listener("click", function VistoriaFinalizarPage_Template_ion_button_click_30_listener() {
        return ctx.voltar();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(31, "svg", 18);
      \u0275\u0275element(32, "polyline", 19)(33, "path", 20);
      \u0275\u0275elementEnd();
      \u0275\u0275text(34, " Voltar ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(35, VistoriaFinalizarPage_div_35_Template, 37, 8, "div", 21);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(6);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", !ctx.loadingResumo);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingResumo);
      \u0275\u0275advance(9);
      \u0275\u0275textInterpolate(ctx.tempoTotalFormatado);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.observacao);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.isSaving);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.sucessoVisivel);
    }
  }, dependencies: [
    NgIf,
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
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonText
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar[_ngcontent-%COMP%] {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main[_ngcontent-%COMP%] {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.vistoria-center-info[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.vistoria-center-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  line-height: 1.2;\n}\n.vistoria-center-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child {\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.vistoria-center-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n.resumo-vistoria[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.resumo-vistoria[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n}\n.tempo-total-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.tempo-total-valor[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #0f172a;\n  margin-top: 6px;\n}\n.sucesso-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 9999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  background: rgba(2, 6, 23, 0.82);\n}\n.sucesso-card[_ngcontent-%COMP%] {\n  width: min(720px, 100%);\n  max-height: 90vh;\n  overflow: auto;\n  padding: 18px;\n  border-radius: 12px;\n  background: #ffffff;\n  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.35);\n}\n.sucesso-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  font-size: 1.15rem;\n}\n.sucesso-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n}\n.irregularidades-lista-overlay[_ngcontent-%COMP%] {\n  margin: 12px 0 14px;\n}\n/*# sourceMappingURL=vistoria-finalizar.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaFinalizarPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-finalizar", standalone: true, imports: [
      NgIf,
      FormsModule,
      IonContent,
      IonFooter,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonItem,
      IonLabel,
      IonTextarea,
      IonButton,
      IonSpinner,
      IonText
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>Finalizar Vistoria</ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content">\r\n    <div class="resumo-vistoria" *ngIf="!loadingResumo">\r\n      <p><strong>Vistoria:</strong> {{ resumoVistoriaNumero }}</p>\r\n      <p><strong>Vistoriador:</strong> {{ resumoVistoriador }}</p>\r\n      <p><strong>Ve\xEDculo vistoriado:</strong> {{ resumoVeiculo }}</p>\r\n      <p><strong>Motorista:</strong> {{ resumoMotorista }}</p>\r\n      <p><strong>Od\xF4metro:</strong> {{ resumoOdometro }}</p>\r\n      <p><strong>% Bateria:</strong> {{ resumoBateria }}</p>\r\n      <p><strong>Irregularidades identificadas:</strong> {{ resumoIrregularidades }}</p>\r\n      <div *ngIf="resumoIrregularidadesDetalhes.length > 0" class="irregularidades-lista">\r\n        <p><strong>Detalhes:</strong></p>\r\n        @for (detalhe of resumoIrregularidadesDetalhes; track detalhe) {\r\n          <p>{{ detalhe }}</p>\r\n        }\r\n      </div>\r\n    </div>\r\n\r\n    <div class="resumo-vistoria" *ngIf="loadingResumo">\r\n      <p>Carregando resumo da vistoria...</p>\r\n    </div>\r\n\r\n    <ion-item>\r\n      <ion-label position="stacked" class="tempo-total-label">\r\n        <span>Tempo total (minutos):</span>\r\n        <svg\r\n          xmlns="http://www.w3.org/2000/svg"\r\n          width="16"\r\n          height="16"\r\n          viewBox="0 0 24 24"\r\n          fill="none"\r\n          stroke="currentColor"\r\n          stroke-width="2"\r\n          stroke-linecap="round"\r\n          stroke-linejoin="round"\r\n          aria-hidden="true"\r\n        >\r\n          <circle cx="12" cy="12" r="10"></circle>\r\n          <polyline points="12 6 12 12 16 14"></polyline>\r\n        </svg>\r\n      </ion-label>\r\n      <ion-text class="tempo-total-valor">{{ tempoTotalFormatado }}</ion-text>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-label position="stacked">Observa\xE7\xE3o geral</ion-label>\r\n      <ion-textarea\r\n        [(ngModel)]="observacao"\r\n        placeholder="Observa\xE7\xE3o opcional"\r\n      ></ion-textarea>\r\n    </ion-item>\r\n\r\n    <ion-text color="danger" *ngIf="errorMessage">\r\n      <p class="error-message">{{ errorMessage }}</p>\r\n    </ion-text>\r\n\r\n  </div>\r\n</ion-content>\r\n\r\n<ion-footer>\r\n  <ion-toolbar>\r\n    <div class="footer-actions">\r\n      <ion-button class="btn-main" [disabled]="isSaving" (click)="finalizar()">\r\n        <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r\n        <span *ngIf="!isSaving">Finalizar Vistoria</span>\r\n      </ion-button>\r\n      <ion-button class="btn-voltar" fill="outline" color="medium" (click)="voltar()">\r\n        <svg\r\n          slot="start"\r\n          xmlns="http://www.w3.org/2000/svg"\r\n          width="18"\r\n          height="18"\r\n          viewBox="0 0 24 24"\r\n          fill="none"\r\n          stroke="currentColor"\r\n          stroke-width="2"\r\n          stroke-linecap="round"\r\n          stroke-linejoin="round"\r\n          aria-hidden="true"\r\n        >\r\n          <polyline points="9 14 4 9 9 4"></polyline>\r\n          <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>\r\n        </svg>\r\n        Voltar\r\n      </ion-button>\r\n    </div>\r\n  </ion-toolbar>\r\n</ion-footer>\r\n\r\n<div class="sucesso-overlay" *ngIf="sucessoVisivel" aria-modal="true" role="dialog">\r\n  <div class="sucesso-card">\r\n    <h2>Vistoria {{ resumoVistoriaNumero }} conclu\xEDda com sucesso</h2>\r\n    <p><strong>Vistoriador:</strong> {{ resumoVistoriador }}</p>\r\n    <p><strong>Ve\xEDculo:</strong> {{ resumoVeiculo }}</p>\r\n    <p><strong>Motorista:</strong> {{ resumoMotorista }}</p>\r\n    <p><strong>Od\xF4metro:</strong> {{ resumoOdometro }}</p>\r\n    <p><strong>% Bateria:</strong> {{ resumoBateria }}</p>\r\n    <p><strong>Irregularidades:</strong> {{ resumoIrregularidades }}</p>\r\n\r\n    <div class="irregularidades-lista-overlay">\r\n      <p><strong>Resumo:</strong></p>\r\n      <p *ngIf="resumoIrregularidadesDetalhes.length === 0">- Nenhuma irregularidade registrada</p>\r\n      @for (detalhe of resumoIrregularidadesDetalhes; track detalhe) {\r\n        <p>- {{ detalhe }}</p>\r\n      }\r\n    </div>\r\n\r\n    <ion-button expand="block" (click)="confirmarConclusao()">OK</ion-button>\r\n  </div>\r\n</div>\r\n', styles: ["/* src/app/pages/vistoria/vistoria-finalizar.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content {\n  padding: 16px;\n}\n.vistoria-nr-bar {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.vistoria-center-info {\n  text-align: center;\n}\n.vistoria-center-info span {\n  display: block;\n  line-height: 1.2;\n}\n.vistoria-center-info span:first-child {\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.vistoria-center-info span:last-child {\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n.error-message {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n.resumo-vistoria {\n  margin-bottom: 12px;\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.resumo-vistoria p {\n  margin: 0 0 6px;\n}\n.tempo-total-label {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n.tempo-total-valor {\n  font-size: 1.05rem;\n  font-weight: 700;\n  color: #0f172a;\n  margin-top: 6px;\n}\n.sucesso-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 9999;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  background: rgba(2, 6, 23, 0.82);\n}\n.sucesso-card {\n  width: min(720px, 100%);\n  max-height: 90vh;\n  overflow: auto;\n  padding: 18px;\n  border-radius: 12px;\n  background: #ffffff;\n  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.35);\n}\n.sucesso-card h2 {\n  margin: 0 0 12px;\n  font-size: 1.15rem;\n}\n.sucesso-card p {\n  margin: 0 0 6px;\n}\n.irregularidades-lista-overlay {\n  margin: 12px 0 14px;\n}\n/*# sourceMappingURL=vistoria-finalizar.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaFinalizarPage, { className: "VistoriaFinalizarPage", filePath: "src/app/pages/vistoria/vistoria-finalizar.page.ts", lineNumber: 48 });
})();
export {
  VistoriaFinalizarPage
};
//# sourceMappingURL=chunk-MXDHNRM2.js.map
