import {
  AreaVistoriadaService
} from "./chunk-F5MXBTF5.js";
import {
  VistoriaBootstrapService
} from "./chunk-F57OVUJW.js";
import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LU64LGPG.js";
import {
  ActivatedRoute,
  AlertController,
  AuthService,
  Component,
  ErrorMessageService,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
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
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-KKQO7KIV.js";
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

// src/app/pages/vistoria/vistoria-componentes.page.ts
var _c0 = () => [0.25, 0.5, 1];
function VistoriaComponentesPage_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "p", 26)(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.vistoriaNumero, " \xB7 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.veiculoNumero, " \xB7 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.areaNome, " ");
  }
}
function VistoriaComponentesPage_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "ion-spinner", 28);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando componentes...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_ion_text_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 29)(1, "p", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaComponentesPage_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "p");
    \u0275\u0275text(2, "Selecione um componente abaixo para registrar irregularidade.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "p");
    \u0275\u0275text(2, "Nenhum componente encontrado nesta \xE1rea.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_ion_item_35_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 34);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Irregularidades nesta vistoria: ", ctx_r0.irregularidadesPorComponente[item_r3.idComponente], " ");
  }
}
function VistoriaComponentesPage_ion_item_35_p_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 35)(1, "ion-text", 36);
    \u0275\u0275text(2, "Existe irregularidade pendente em vistoria anterior");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_ion_item_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 32);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_item_35_Template_ion_item_click_0_listener() {
      const item_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.abrirComponente(item_r3));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, VistoriaComponentesPage_ion_item_35_p_4_Template, 3, 1, "p", 24)(5, VistoriaComponentesPage_ion_item_35_p_5_Template, 3, 0, "p", 33);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.componente == null ? null : item_r3.componente.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.irregularidadesPorComponente[item_r3.idComponente] > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.pendentesPorComponente.has(item_r3.idComponente));
  }
}
function VistoriaComponentesPage_ion_footer_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-footer")(1, "ion-toolbar")(2, "ion-button", 37);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_footer_36_Template_ion_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.irParaFinalizar());
    });
    \u0275\u0275text(3, "Concluir Vistoria");
    \u0275\u0275elementEnd()()();
  }
}
var VistoriaComponentesPage = class _VistoriaComponentesPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  areaService = inject(AreaVistoriadaService);
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  bootstrapService = inject(VistoriaBootstrapService);
  alertController = inject(AlertController);
  errorMessageService = inject(ErrorMessageService);
  authService = inject(AuthService);
  areaId = "";
  areaNome = "";
  componentes = [];
  irregularidadesPorComponente = {};
  pendentesPorComponente = /* @__PURE__ */ new Set();
  loading = false;
  errorMessage = "";
  initialized = false;
  get vistoriaNrDisplay() {
    const nr = this.flowService.getNumeroVistoriaDisplay();
    return nr ? `Vistoria - ${nr}` : "Vistoria";
  }
  get vistoriaNumero() {
    return this.flowService.getNumeroVistoriaDisplay() || "-";
  }
  get veiculoNumero() {
    return this.flowService.getVeiculoDescricao() || "-";
  }
  voltar() {
    this.router.navigate(["/vistoria/areas"]);
  }
  irParaFinalizar() {
    this.router.navigate(["/vistoria/finalizar"]);
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.areaId = this.route.snapshot.paramMap.get("areaId") ?? "";
      if (!this.areaId) {
        this.router.navigate(["/vistoria/areas"]);
        return;
      }
      const state = this.router.getCurrentNavigation()?.extras?.state;
      this.areaNome = state?.areaNome ?? "\xC1rea";
      this.initialized = true;
      yield this.carregarDados();
    });
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      if (!this.initialized) {
        return;
      }
      yield this.carregarDados();
    });
  }
  carregarDados() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return;
      }
      this.loading = true;
      this.errorMessage = "";
      this.irregularidadesPorComponente = {};
      this.pendentesPorComponente = /* @__PURE__ */ new Set();
      try {
        const bootstrap = yield this.bootstrapService.getOrFetch(vistoriaId);
        const areaBootstrap = bootstrap?.areas?.find((a) => a.id === this.areaId);
        if (bootstrap && areaBootstrap) {
          this.componentes = areaBootstrap.componentes;
          yield this.recarregarIndicadores(vistoriaId);
          return;
        }
        this.componentes = yield this.areaService.listarComponentes(this.areaId);
        const veiculoId = this.flowService.getVeiculoId();
        const [irregularidades, pendentes] = yield Promise.all([
          this.vistoriaService.listarIrregularidades(vistoriaId),
          veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([])
        ]);
        const idsDaVistoriaAtual = new Set(irregularidades.map((item) => item.id));
        const pendentesAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
        irregularidades.filter((item) => item.idarea === this.areaId).forEach((item) => {
          this.irregularidadesPorComponente[item.idcomponente] = (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
        });
        pendentesAnteriores.filter((item) => item.idarea === this.areaId).forEach((item) => this.pendentesPorComponente.add(item.idcomponente));
      } catch {
        this.errorMessage = "Erro ao carregar componentes.";
      } finally {
        this.loading = false;
      }
    });
  }
  abrirComponente(item) {
    const componenteId = item.idComponente;
    if (!componenteId) {
      return;
    }
    this.router.navigate([`/vistoria/areas/${this.areaId}/componentes/${componenteId}`], {
      state: {
        areaNome: this.areaNome,
        componenteNome: item.componente?.nome ?? "Componente"
      }
    });
  }
  abrirResumoVistoria() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return;
      }
      try {
        const [vistoria, irregularidades] = yield Promise.all([
          this.vistoriaService.getById(vistoriaId),
          this.vistoriaService.listarIrregularidades(vistoriaId)
        ]);
        const numeroVistoriaRaw = this.vistoriaNumero || "-";
        const numeroVistoriaDigits = numeroVistoriaRaw.replace(/\D+/g, "");
        const numeroVistoria = numeroVistoriaDigits || numeroVistoriaRaw;
        const currentUser = this.authService.getCurrentUser();
        const vistoriador = vistoria.idUsuario && currentUser?.id === vistoria.idUsuario ? currentUser.nome ?? vistoria.idUsuario : vistoria.idUsuario ?? "-";
        const veiculo = vistoria.veiculo?.descricao ?? "-";
        const motorista = vistoria.motorista?.nome ?? "-";
        const odometro = vistoria.odometro == null ? "-" : Number(vistoria.odometro).toFixed(2);
        const bateria = vistoria.porcentagembateria == null ? "-" : `${Number(vistoria.porcentagembateria).toFixed(2)}%`;
        const detalhes = irregularidades.length > 0 ? irregularidades.map((item) => {
          const area = item.nomeArea ?? item.idarea ?? "Area";
          const componente = item.nomeComponente ?? item.idcomponente ?? "Componente";
          const sintoma = item.descricaoSintoma ?? item.idsintoma ?? "Sintoma";
          return `- ${this.escapeHtml(area)} - ${this.escapeHtml(componente)} - ${this.escapeHtml(sintoma)}`;
        }).join("<br>") : "- Nenhuma irregularidade registrada";
        const alert = yield this.alertController.create({
          header: `Vistoria ${numeroVistoria}`,
          cssClass: "alert-resumo-vistoria",
          message: `<strong>Vistoriador:</strong> ${this.escapeHtml(vistoriador)}<br><strong>Veiculo:</strong> ${this.escapeHtml(veiculo)}<br><strong>Motorista:</strong> ${this.escapeHtml(motorista)}<br><strong>Odometro:</strong> ${this.escapeHtml(odometro)}<br><strong>% Bateria:</strong> ${this.escapeHtml(bateria)}<br><strong>Irregularidades:</strong> ${irregularidades.length}<br><br><strong>Resumo:</strong><br>${detalhes}`,
          buttons: [{ text: "OK", cssClass: "alert-ok-voltar" }]
        });
        yield alert.present();
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel carregar o resumo da vistoria.");
      }
    });
  }
  abrirResumoPendenciasVeiculo() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      const veiculoId = this.flowService.getVeiculoId();
      if (!vistoriaId || !veiculoId) {
        return;
      }
      try {
        const [irregularidadesAtual, pendentes] = yield Promise.all([
          this.vistoriaService.listarIrregularidades(vistoriaId),
          this.vistoriaService.listarIrregularidadesPendentes(veiculoId)
        ]);
        const idsDaVistoriaAtual = new Set(irregularidadesAtual.map((item) => item.id));
        const pendenciasAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
        const detalhes = pendenciasAnteriores.length > 0 ? pendenciasAnteriores.map((item) => {
          const area = item.nomeArea ?? item.idarea ?? "Area";
          const componente = item.nomeComponente ?? item.idcomponente ?? "Componente";
          const sintoma = item.descricaoSintoma ?? item.idsintoma ?? "Sintoma";
          return `- ${this.escapeHtml(area)} - ${this.escapeHtml(componente)} - ${this.escapeHtml(sintoma)}`;
        }).join("<br>") : "- Nenhuma irregularidade pendente de outras vistorias";
        const alert = yield this.alertController.create({
          header: "Pendencias do veiculo",
          cssClass: "alert-resumo-vistoria",
          message: `<strong>Veiculo:</strong> ${this.escapeHtml(this.veiculoNumero)}<br><strong>Irregularidades pendentes (outras vistorias):</strong> ${pendenciasAnteriores.length}<br><br><strong>Resumo:</strong><br>${detalhes}`,
          buttons: [{ text: "OK", cssClass: "alert-ok-voltar" }]
        });
        yield alert.present();
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel carregar as pendencias do veiculo.");
      }
    });
  }
  recarregarIndicadores(vistoriaId) {
    return __async(this, null, function* () {
      const veiculoId = this.flowService.getVeiculoId();
      const [irregularidades, pendentes] = yield Promise.all([
        this.vistoriaService.listarIrregularidades(vistoriaId),
        veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([])
      ]);
      this.irregularidadesPorComponente = {};
      irregularidades.filter((item) => item.idarea === this.areaId).forEach((item) => {
        this.irregularidadesPorComponente[item.idcomponente] = (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
      });
      const idsDaVistoriaAtual = new Set(irregularidades.map((item) => item.id));
      const pendentesAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
      this.pendentesPorComponente = new Set(pendentesAnteriores.filter((item) => item.idarea === this.areaId).map((item) => item.idcomponente));
    });
  }
  escapeHtml(value) {
    return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  static \u0275fac = function VistoriaComponentesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaComponentesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaComponentesPage, selectors: [["app-vistoria-componentes"]], decls: 37, vars: 14, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 1, "resumo-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["x", "8", "y", "2", "width", "8", "height", "4", "rx", "1"], ["d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["d", "M9 12h6"], ["d", "M9 16h6"], ["fill", "solid", "color", "medium", "aria-label", "Resumo da vistoria", 1, "resumo-btn", 3, "click"], ["d", "m3 17 2 2 4-4"], ["d", "m3 7 2 2 4-4"], ["d", "M13 6h8"], ["d", "M13 12h8"], ["d", "M13 18h8"], ["fill", "solid", 3, "click"], [3, "fullscreen"], ["class", "selected-context", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], ["class", "content sheet-context", 4, "ngIf"], ["backdropBreakpoint", "0.25", 3, "isOpen", "initialBreakpoint", "breakpoints"], [1, "ion-padding"], ["button", "", "detail", "true", 3, "click", 4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "selected-context"], [1, "context-inline"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], [1, "content", "sheet-context"], ["button", "", "detail", "true", 3, "click"], ["class", "ion-text-wrap", 4, "ngIf"], ["color", "primary"], [1, "ion-text-wrap"], ["color", "warning"], ["expand", "block", 3, "click"]], template: function VistoriaComponentesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Componentes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2)(7, "ion-button", 3);
      \u0275\u0275listener("click", function VistoriaComponentesPage_Template_ion_button_click_7_listener() {
        return ctx.abrirResumoPendenciasVeiculo();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(8, "svg", 4);
      \u0275\u0275element(9, "rect", 5)(10, "path", 6)(11, "path", 7)(12, "path", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "ion-button", 9);
      \u0275\u0275listener("click", function VistoriaComponentesPage_Template_ion_button_click_13_listener() {
        return ctx.abrirResumoVistoria();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 4);
      \u0275\u0275element(15, "path", 10)(16, "path", 11)(17, "path", 12)(18, "path", 13)(19, "path", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(20, "ion-button", 15);
      \u0275\u0275listener("click", function VistoriaComponentesPage_Template_ion_button_click_20_listener() {
        return ctx.voltar();
      });
      \u0275\u0275text(21, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "ion-content", 16);
      \u0275\u0275template(23, VistoriaComponentesPage_div_23_Template, 11, 3, "div", 17)(24, VistoriaComponentesPage_div_24_Template, 4, 0, "div", 18)(25, VistoriaComponentesPage_ion_text_25_Template, 3, 1, "ion-text", 19)(26, VistoriaComponentesPage_div_26_Template, 3, 0, "div", 20)(27, VistoriaComponentesPage_div_27_Template, 3, 0, "div", 18);
      \u0275\u0275elementStart(28, "ion-modal", 21)(29, "ion-header")(30, "ion-toolbar")(31, "ion-title");
      \u0275\u0275text(32);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(33, "ion-content", 22)(34, "ion-list");
      \u0275\u0275template(35, VistoriaComponentesPage_ion_item_35_Template, 6, 3, "ion-item", 23);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(36, VistoriaComponentesPage_ion_footer_36_Template, 4, 0, "ion-footer", 24);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(22);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.componentes.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.componentes.length === 0);
      \u0275\u0275advance();
      \u0275\u0275property("isOpen", !ctx.loading && ctx.componentes.length > 0)("initialBreakpoint", 0.5)("breakpoints", \u0275\u0275pureFunction0(13, _c0));
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.areaNome);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.componentes);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    IonContent,
    IonFooter,
    IonHeader,
    IonModal,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context[_ngcontent-%COMP%] {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  padding: 14px 16px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  text-align: left;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 1.02rem;\n  color: #0f172a;\n  display: block;\n  line-height: 1.4;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: inline;\n  color: #1d4ed8;\n  margin-right: 4px;\n}\n.selected-context[_ngcontent-%COMP%]   .context-inline[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.actions[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n/*# sourceMappingURL=vistoria-componentes.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaComponentesPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-componentes", standalone: true, imports: [
      NgIf,
      NgForOf,
      IonContent,
      IonFooter,
      IonHeader,
      IonModal,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonButton,
      IonList,
      IonItem,
      IonLabel,
      IonText,
      IonSpinner
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>Componentes</ion-title>\r\n    <ion-buttons slot="end">\r\n      <ion-button\r\n        class="resumo-btn"\r\n        fill="solid"\r\n        color="medium"\r\n        (click)="abrirResumoPendenciasVeiculo()"\r\n        aria-label="Pendencias de outras vistorias"\r\n      >\r\n        <svg\r\n          xmlns="http://www.w3.org/2000/svg"\r\n          width="18"\r\n          height="18"\r\n          viewBox="0 0 24 24"\r\n          fill="none"\r\n          stroke="currentColor"\r\n          stroke-width="2"\r\n          stroke-linecap="round"\r\n          stroke-linejoin="round"\r\n          aria-hidden="true"\r\n        >\r\n          <rect x="8" y="2" width="8" height="4" rx="1"></rect>\r\n          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>\r\n          <path d="M9 12h6"></path>\r\n          <path d="M9 16h6"></path>\r\n        </svg>\r\n      </ion-button>\r\n      <ion-button class="resumo-btn" fill="solid" color="medium" (click)="abrirResumoVistoria()" aria-label="Resumo da vistoria">\r\n        <svg\r\n          xmlns="http://www.w3.org/2000/svg"\r\n          width="18"\r\n          height="18"\r\n          viewBox="0 0 24 24"\r\n          fill="none"\r\n          stroke="currentColor"\r\n          stroke-width="2"\r\n          stroke-linecap="round"\r\n          stroke-linejoin="round"\r\n          aria-hidden="true"\r\n        >\r\n          <path d="m3 17 2 2 4-4"></path>\r\n          <path d="m3 7 2 2 4-4"></path>\r\n          <path d="M13 6h8"></path>\r\n          <path d="M13 12h8"></path>\r\n          <path d="M13 18h8"></path>\r\n        </svg>\r\n      </ion-button>\r\n      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>\r\n    </ion-buttons>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="selected-context" *ngIf="!loading">\r\n    <p class="context-inline">\r\n      <strong>Vistoria:</strong> {{ vistoriaNumero }} \xB7\r\n      <strong>Ve\xEDculo:</strong> {{ veiculoNumero }} \xB7\r\n      <strong>\xC1rea:</strong> {{ areaNome }}\r\n    </p>\r\n  </div>\r\n\r\n  <div class="content" *ngIf="loading">\r\n    <ion-spinner name="crescent"></ion-spinner>\r\n    <p>Carregando componentes...</p>\r\n  </div>\r\n\r\n  <ion-text color="danger" *ngIf="errorMessage">\r\n    <p class="error-message">{{ errorMessage }}</p>\r\n  </ion-text>\r\n\r\n  <div class="content sheet-context" *ngIf="!loading && componentes.length > 0">\r\n    <p>Selecione um componente abaixo para registrar irregularidade.</p>\r\n  </div>\r\n\r\n  <div class="content" *ngIf="!loading && componentes.length === 0">\r\n    <p>Nenhum componente encontrado nesta \xE1rea.</p>\r\n  </div>\r\n\r\n  <ion-modal\r\n    [isOpen]="!loading && componentes.length > 0"\r\n    [initialBreakpoint]="0.5"\r\n    [breakpoints]="[0.25, 0.5, 1]"\r\n    backdropBreakpoint="0.25"\r\n  >\r\n    <ion-header>\r\n      <ion-toolbar>\r\n        <ion-title>{{ areaNome }}</ion-title>\r\n      </ion-toolbar>\r\n    </ion-header>\r\n    <ion-content class="ion-padding">\r\n      <ion-list>\r\n        <ion-item button detail="true" *ngFor="let item of componentes" (click)="abrirComponente(item)">\r\n          <ion-label>\r\n            <h2>{{ item.componente?.nome }}</h2>\r\n            <p *ngIf="irregularidadesPorComponente[item.idComponente] > 0">\r\n              <ion-text color="primary">\r\n                Irregularidades nesta vistoria: {{ irregularidadesPorComponente[item.idComponente] }}\r\n              </ion-text>\r\n            </p>\r\n            <p *ngIf="pendentesPorComponente.has(item.idComponente)" class="ion-text-wrap">\r\n              <ion-text color="warning">Existe irregularidade pendente em vistoria anterior</ion-text>\r\n            </p>\r\n          </ion-label>\r\n        </ion-item>\r\n      </ion-list>\r\n    </ion-content>\r\n  </ion-modal>\r\n</ion-content>\r\n\r\n<ion-footer *ngIf="!loading">\r\n  <ion-toolbar>\r\n    <ion-button expand="block" (click)="irParaFinalizar()">Concluir Vistoria</ion-button>\r\n  </ion-toolbar>\r\n</ion-footer>\r\n', styles: ["/* src/app/pages/vistoria/vistoria-componentes.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  padding: 14px 16px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  text-align: left;\n}\n.selected-context p {\n  margin: 0 0 8px;\n  font-size: 1.02rem;\n  color: #0f172a;\n  display: block;\n  line-height: 1.4;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.selected-context p:last-child {\n  margin-bottom: 0;\n}\n.selected-context p strong {\n  display: inline;\n  color: #1d4ed8;\n  margin-right: 4px;\n}\n.selected-context .context-inline {\n  margin: 0;\n}\n.actions {\n  margin-top: 24px;\n}\n/*# sourceMappingURL=vistoria-componentes.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaComponentesPage, { className: "VistoriaComponentesPage", filePath: "src/app/pages/vistoria/vistoria-componentes.page.ts", lineNumber: 53 });
})();
export {
  VistoriaComponentesPage
};
//# sourceMappingURL=chunk-TXDBYE4W.js.map
