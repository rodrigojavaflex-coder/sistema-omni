import {
  AreaVistoriadaService
} from "./chunk-ILMLSKLF.js";
import {
  MatrizCriticidadeService
} from "./chunk-EYEGL3HD.js";
import {
  VistoriaBootstrapService
} from "./chunk-GFAV4T6B.js";
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
  ActivatedRoute,
  AlertController,
  Component,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
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

// src/app/pages/vistoria/vistoria-componentes.page.ts
var _c0 = () => [0.25, 0.5, 1];
function VistoriaComponentesPage_ion_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-button", 20);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_button_7_Template_ion_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrirResumoPendenciasVeiculo());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "rect", 21)(3, "path", 22)(4, "path", 23)(5, "path", 24);
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 26)(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 26)(7, "strong");
    \u0275\u0275text(8, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 26)(12, "strong");
    \u0275\u0275text(13, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.vistoriaNumero);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.veiculoNumero);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.areaNome);
  }
}
function VistoriaComponentesPage_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27);
    \u0275\u0275element(1, "ion-spinner", 28);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando componentes...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_ion_text_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 29)(1, "p", 30);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaComponentesPage_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31)(1, "p", 32);
    \u0275\u0275text(2, "Selecione um Componente:");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "p");
    \u0275\u0275text(2, "Nenhum componente encontrado nesta \xE1rea.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_ion_item_28_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Irregularidades nesta vistoria: ", ctx_r1.irregularidadesPorComponente[item_r4.idComponente], " ");
  }
}
function VistoriaComponentesPage_ion_item_28_p_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36)(1, "ion-text", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Pend\xEAncia(s) Registrada(s): ", ctx_r1.contagemPendentesPorComponente[item_r4.idComponente], " ");
  }
}
function VistoriaComponentesPage_ion_item_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 33);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_item_28_Template_ion_item_click_0_listener() {
      const item_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrirComponente(item_r4));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, VistoriaComponentesPage_ion_item_28_p_4_Template, 3, 1, "p", 19)(5, VistoriaComponentesPage_ion_item_28_p_5_Template, 3, 1, "p", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r4.componente == null ? null : item_r4.componente.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.irregularidadesPorComponente[item_r4.idComponente] > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contagemPendentesPorComponente[item_r4.idComponente] > 0);
  }
}
function VistoriaComponentesPage_ion_footer_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-footer")(1, "ion-toolbar")(2, "div", 38)(3, "ion-button", 39);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_footer_29_Template_ion_button_click_3_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.irParaFinalizar());
    });
    \u0275\u0275text(4, " Concluir Vistoria ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-button", 40);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_footer_29_Template_ion_button_click_5_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.voltar());
    });
    \u0275\u0275element(6, "ion-icon", 41);
    \u0275\u0275text(7, " Voltar ");
    \u0275\u0275elementEnd()()()();
  }
}
var VistoriaComponentesPage = class _VistoriaComponentesPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  areaService = inject(AreaVistoriadaService);
  matrizService = inject(MatrizCriticidadeService);
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
  contagemPendentesPorComponente = {};
  loading = false;
  errorMessage = "";
  initialized = false;
  componenteTemMatrizCache = /* @__PURE__ */ new Map();
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
  get canViewHistoricoVeiculo() {
    return this.authService.hasPermission("vistoria_web_historico_veiculo:read");
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
      this.contagemPendentesPorComponente = {};
      try {
        const bootstrap = yield this.bootstrapService.getOrFetch(vistoriaId);
        const areaBootstrap = bootstrap?.areas?.find((a) => a.id === this.areaId);
        if (bootstrap && areaBootstrap) {
          this.componentes = areaBootstrap.componentes.filter((item) => (item.matriz?.length ?? 0) > 0);
          yield this.recarregarIndicadores(vistoriaId);
          return;
        }
        const componentesRaw = yield this.areaService.listarComponentes(this.areaId);
        this.componentes = yield this.filtrarComponentesComMatriz(componentesRaw);
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
        pendentesAnteriores.filter((item) => item.idarea === this.areaId).forEach((item) => {
          this.contagemPendentesPorComponente[item.idcomponente] = (this.contagemPendentesPorComponente[item.idcomponente] ?? 0) + 1;
        });
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
      if (!this.canViewHistoricoVeiculo) {
        return;
      }
      this.router.navigate(["/vistoria/pendencias-veiculo"], {
        state: { fromMenu: false }
      });
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
      this.contagemPendentesPorComponente = {};
      pendentesAnteriores.filter((item) => item.idarea === this.areaId).forEach((item) => {
        this.contagemPendentesPorComponente[item.idcomponente] = (this.contagemPendentesPorComponente[item.idcomponente] ?? 0) + 1;
      });
    });
  }
  escapeHtml(value) {
    return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  filtrarComponentesComMatriz(componentes) {
    return __async(this, null, function* () {
      const checks = yield Promise.all(componentes.map((item) => __async(this, null, function* () {
        return {
          item,
          temMatriz: yield this.componenteTemMatriz(item.idComponente)
        };
      })));
      return checks.filter((entry) => entry.temMatriz).map((entry) => entry.item);
    });
  }
  componenteTemMatriz(idComponente) {
    return __async(this, null, function* () {
      const cached = this.componenteTemMatrizCache.get(idComponente);
      if (cached !== void 0) {
        return cached;
      }
      try {
        const matriz = yield this.matrizService.listarPorComponente(idComponente);
        const tem = matriz.length > 0;
        this.componenteTemMatrizCache.set(idComponente, tem);
        return tem;
      } catch {
        this.componenteTemMatrizCache.set(idComponente, false);
        return false;
      }
    });
  }
  static \u0275fac = function VistoriaComponentesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaComponentesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaComponentesPage, selectors: [["app-vistoria-componentes"]], decls: 30, vars: 15, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["class", "resumo-btn", "fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 3, "click", 4, "ngIf"], ["fill", "solid", "color", "medium", "aria-label", "Resumo da vistoria", 1, "resumo-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["d", "m3 17 2 2 4-4"], ["d", "m3 7 2 2 4-4"], ["d", "M13 6h8"], ["d", "M13 12h8"], ["d", "M13 18h8"], [3, "fullscreen"], ["class", "selected-context", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], ["class", "content sheet-context", 4, "ngIf"], ["backdropBreakpoint", "0.25", 3, "isOpen", "initialBreakpoint", "breakpoints"], [1, "ion-padding"], ["button", "", "detail", "true", 3, "click", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 1, "resumo-btn", 3, "click"], ["x", "8", "y", "2", "width", "8", "height", "4", "rx", "1"], ["d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["d", "M9 12h6"], ["d", "M9 16h6"], [1, "selected-context"], [1, "context-card"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], [1, "content", "sheet-context"], [1, "cards-selection-title"], ["button", "", "detail", "true", 3, "click"], ["class", "ion-text-wrap", 4, "ngIf"], ["color", "primary"], [1, "ion-text-wrap"], ["color", "warning"], [1, "footer-actions"], [1, "btn-main", 3, "click"], ["fill", "outline", "color", "medium", 1, "btn-voltar", 3, "click"], ["slot", "start", "src", "/icons/corner-up-left.svg", "aria-hidden", "true"]], template: function VistoriaComponentesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Componentes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2);
      \u0275\u0275template(7, VistoriaComponentesPage_ion_button_7_Template, 6, 0, "ion-button", 3);
      \u0275\u0275elementStart(8, "ion-button", 4);
      \u0275\u0275listener("click", function VistoriaComponentesPage_Template_ion_button_click_8_listener() {
        return ctx.abrirResumoVistoria();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(9, "svg", 5);
      \u0275\u0275element(10, "path", 6)(11, "path", 7)(12, "path", 8)(13, "path", 9)(14, "path", 10);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(15, "ion-content", 11);
      \u0275\u0275template(16, VistoriaComponentesPage_div_16_Template, 16, 3, "div", 12)(17, VistoriaComponentesPage_div_17_Template, 4, 0, "div", 13)(18, VistoriaComponentesPage_ion_text_18_Template, 3, 1, "ion-text", 14)(19, VistoriaComponentesPage_div_19_Template, 3, 0, "div", 15)(20, VistoriaComponentesPage_div_20_Template, 3, 0, "div", 13);
      \u0275\u0275elementStart(21, "ion-modal", 16)(22, "ion-header")(23, "ion-toolbar")(24, "ion-title");
      \u0275\u0275text(25);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(26, "ion-content", 17)(27, "ion-list");
      \u0275\u0275template(28, VistoriaComponentesPage_ion_item_28_Template, 6, 3, "ion-item", 18);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275template(29, VistoriaComponentesPage_ion_footer_29_Template, 8, 0, "ion-footer", 19);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.canViewHistoricoVeiculo);
      \u0275\u0275advance(8);
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
      \u0275\u0275property("isOpen", !ctx.loading && ctx.componentes.length > 0)("initialBreakpoint", 0.5)("breakpoints", \u0275\u0275pureFunction0(14, _c0));
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
    IonIcon,
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
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar[_ngcontent-%COMP%] {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main[_ngcontent-%COMP%] {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context[_ngcontent-%COMP%] {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.context-card[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  cursor: default;\n}\n.context-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 700;\n  margin-right: 4px;\n}\n.context-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #334155;\n  word-break: break-word;\n}\n.actions[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n.cards-selection-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n  color: #1d4ed8;\n}\n/*# sourceMappingURL=vistoria-componentes.page.css.map */"] });
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
      IonIcon,
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
    ], template: '<ion-header [translucent]="true">\n  <ion-toolbar>\n    <ion-buttons slot="start">\n      <ion-menu-button></ion-menu-button>\n    </ion-buttons>\n    <ion-title>Componentes</ion-title>\n    <ion-buttons slot="end">\n      <ion-button\n        *ngIf="canViewHistoricoVeiculo"\n        class="resumo-btn"\n        fill="solid"\n        color="medium"\n        (click)="abrirResumoPendenciasVeiculo()"\n        aria-label="Pendencias de outras vistorias"\n      >\n        <svg\n          xmlns="http://www.w3.org/2000/svg"\n          width="18"\n          height="18"\n          viewBox="0 0 24 24"\n          fill="none"\n          stroke="currentColor"\n          stroke-width="2"\n          stroke-linecap="round"\n          stroke-linejoin="round"\n          aria-hidden="true"\n        >\n          <rect x="8" y="2" width="8" height="4" rx="1"></rect>\n          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>\n          <path d="M9 12h6"></path>\n          <path d="M9 16h6"></path>\n        </svg>\n      </ion-button>\n      <ion-button class="resumo-btn" fill="solid" color="medium" (click)="abrirResumoVistoria()" aria-label="Resumo da vistoria">\n        <svg\n          xmlns="http://www.w3.org/2000/svg"\n          width="18"\n          height="18"\n          viewBox="0 0 24 24"\n          fill="none"\n          stroke="currentColor"\n          stroke-width="2"\n          stroke-linecap="round"\n          stroke-linejoin="round"\n          aria-hidden="true"\n        >\n          <path d="m3 17 2 2 4-4"></path>\n          <path d="m3 7 2 2 4-4"></path>\n          <path d="M13 6h8"></path>\n          <path d="M13 12h8"></path>\n          <path d="M13 18h8"></path>\n        </svg>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content [fullscreen]="true">\n  <div class="selected-context" *ngIf="!loading">\n    <div class="context-card">\n      <strong>Vistoria:</strong>\n      <span>{{ vistoriaNumero }}</span>\n    </div>\n    <div class="context-card">\n      <strong>Ve\xEDculo:</strong>\n      <span>{{ veiculoNumero }}</span>\n    </div>\n    <div class="context-card">\n      <strong>\xC1rea:</strong>\n      <span>{{ areaNome }}</span>\n    </div>\n  </div>\n\n  <div class="content" *ngIf="loading">\n    <ion-spinner name="crescent"></ion-spinner>\n    <p>Carregando componentes...</p>\n  </div>\n\n  <ion-text color="danger" *ngIf="errorMessage">\n    <p class="error-message">{{ errorMessage }}</p>\n  </ion-text>\n\n  <div class="content sheet-context" *ngIf="!loading && componentes.length > 0">\n    <p class="cards-selection-title">Selecione um Componente:</p>\n  </div>\n\n  <div class="content" *ngIf="!loading && componentes.length === 0">\n    <p>Nenhum componente encontrado nesta \xE1rea.</p>\n  </div>\n\n  <ion-modal\n    [isOpen]="!loading && componentes.length > 0"\n    [initialBreakpoint]="0.5"\n    [breakpoints]="[0.25, 0.5, 1]"\n    backdropBreakpoint="0.25"\n  >\n    <ion-header>\n      <ion-toolbar>\n        <ion-title>{{ areaNome }}</ion-title>\n      </ion-toolbar>\n    </ion-header>\n    <ion-content class="ion-padding">\n      <ion-list>\n        <ion-item button detail="true" *ngFor="let item of componentes" (click)="abrirComponente(item)">\n          <ion-label>\n            <h2>{{ item.componente?.nome }}</h2>\n            <p *ngIf="irregularidadesPorComponente[item.idComponente] > 0">\n              <ion-text color="primary">\n                Irregularidades nesta vistoria: {{ irregularidadesPorComponente[item.idComponente] }}\n              </ion-text>\n            </p>\n            <p *ngIf="contagemPendentesPorComponente[item.idComponente] > 0" class="ion-text-wrap">\n              <ion-text color="warning">\n                Pend\xEAncia(s) Registrada(s): {{ contagemPendentesPorComponente[item.idComponente] }}\n              </ion-text>\n            </p>\n          </ion-label>\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  </ion-modal>\n</ion-content>\n\n<ion-footer *ngIf="!loading">\n  <ion-toolbar>\n    <div class="footer-actions">\n      <ion-button class="btn-main" (click)="irParaFinalizar()">\n        Concluir Vistoria\n      </ion-button>\n      <ion-button class="btn-voltar" fill="outline" color="medium" (click)="voltar()">\n        <ion-icon slot="start" src="/icons/corner-up-left.svg" aria-hidden="true"></ion-icon>\n        Voltar\n      </ion-button>\n    </div>\n  </ion-toolbar>\n</ion-footer>\n', styles: ["/* src/app/pages/vistoria/vistoria-componentes.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.context-card {\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  cursor: default;\n}\n.context-card strong {\n  color: #0f172a;\n  font-weight: 700;\n  margin-right: 4px;\n}\n.context-card span {\n  color: #334155;\n  word-break: break-word;\n}\n.actions {\n  margin-top: 24px;\n}\n.cards-selection-title {\n  margin: 0;\n  font-weight: 700;\n  color: #1d4ed8;\n}\n/*# sourceMappingURL=vistoria-componentes.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaComponentesPage, { className: "VistoriaComponentesPage", filePath: "src/app/pages/vistoria/vistoria-componentes.page.ts", lineNumber: 56 });
})();
export {
  VistoriaComponentesPage
};
//# sourceMappingURL=chunk-IVEGCFLW.js.map
