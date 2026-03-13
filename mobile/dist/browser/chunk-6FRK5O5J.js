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
  AlertController,
  AuthService,
  ChangeDetectorRef,
  Component,
  ErrorMessageService,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
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
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
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

// src/app/pages/vistoria/vistoria-areas.page.ts
function VistoriaAreasPage_div_23_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " \xB7 ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.selectedArea.nome, " ");
  }
}
function VistoriaAreasPage_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "p", 22)(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275template(8, VistoriaAreasPage_div_23_ng_container_8_Template, 5, 1, "ng-container", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.vistoriaNumero, " \xB7 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.veiculoNumero, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedArea !== null);
  }
}
function VistoriaAreasPage_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "ion-spinner", 24);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando \xE1reas...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "ion-text", 25)(2, "p", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ion-button", 27);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_25_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.carregarAreas());
    });
    \u0275\u0275text(5, "Tentar novamente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaAreasPage_div_26_ion_card_2_ion_card_content_4_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const area_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Irregularidades nesta vistoria: ", ctx_r0.contagemPorArea[area_r4.id], " ");
  }
}
function VistoriaAreasPage_div_26_ion_card_2_ion_card_content_4_p_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34)(1, "ion-text", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const area_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Pendencias em vistorias anteriores: ", ctx_r0.contagemPendentesPorArea[area_r4.id], " ");
  }
}
function VistoriaAreasPage_div_26_ion_card_2_ion_card_content_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card-content");
    \u0275\u0275template(1, VistoriaAreasPage_div_26_ion_card_2_ion_card_content_4_p_1_Template, 3, 1, "p", 20)(2, VistoriaAreasPage_div_26_ion_card_2_ion_card_content_4_p_2_Template, 3, 1, "p", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.contagemPorArea[area_r4.id]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.contagemPendentesPorArea[area_r4.id]);
  }
}
function VistoriaAreasPage_div_26_ion_card_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 31);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_26_ion_card_2_Template_ion_card_click_0_listener() {
      const area_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.abrirArea(area_r4));
    });
    \u0275\u0275elementStart(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaAreasPage_div_26_ion_card_2_ion_card_content_4_Template, 3, 2, "ion-card-content", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r4 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(area_r4.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.contagemPorArea[area_r4.id] || ctx_r0.contagemPendentesPorArea[area_r4.id]);
  }
}
function VistoriaAreasPage_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "div", 29);
    \u0275\u0275template(2, VistoriaAreasPage_div_26_ion_card_2_Template, 5, 2, "ion-card", 30);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.areas);
  }
}
function VistoriaAreasPage_div_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "p");
    \u0275\u0275text(2, "Nenhuma \xE1rea encontrada. Verifique se h\xE1 \xE1reas ativas cadastradas no sistema.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-button", 27);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_27_Template_ion_button_click_3_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.carregarAreas());
    });
    \u0275\u0275text(4, "Tentar novamente");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_28_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 23)(1, "ion-text", 25)(2, "p", 26);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ion-button", 27);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_28_div_1_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.carregarComponentesDaArea());
    });
    \u0275\u0275text(5, "Tentar novamente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaAreasPage_div_28_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275element(1, "ion-spinner", 24);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando componentes...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_28_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p");
    \u0275\u0275text(2, "Nenhum componente nesta \xE1rea.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_28_div_4_ion_card_1_ion_card_content_4_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r8 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Irregularidades nesta vistoria: ", ctx_r0.irregularidadesPorComponente[item_r8.idComponente], " ");
  }
}
function VistoriaAreasPage_div_28_div_4_ion_card_1_ion_card_content_4_p_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 34)(1, "ion-text", 35);
    \u0275\u0275text(2, "Existe irregularidade pendente em vistoria anterior");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_28_div_4_ion_card_1_ion_card_content_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card-content");
    \u0275\u0275template(1, VistoriaAreasPage_div_28_div_4_ion_card_1_ion_card_content_4_p_1_Template, 3, 1, "p", 20)(2, VistoriaAreasPage_div_28_div_4_ion_card_1_ion_card_content_4_p_2_Template, 3, 0, "p", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r8 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.irregularidadesPorComponente[item_r8.idComponente] > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.pendentesPorComponente.has(item_r8.idComponente));
  }
}
function VistoriaAreasPage_div_28_div_4_ion_card_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 31);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_28_div_4_ion_card_1_Template_ion_card_click_0_listener() {
      const item_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.abrirComponente(item_r8));
    });
    \u0275\u0275elementStart(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaAreasPage_div_28_div_4_ion_card_1_ion_card_content_4_Template, 3, 2, "ion-card-content", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r8.componente == null ? null : item_r8.componente.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.irregularidadesPorComponente[item_r8.idComponente] > 0 || ctx_r0.pendentesPorComponente.has(item_r8.idComponente));
  }
}
function VistoriaAreasPage_div_28_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275template(1, VistoriaAreasPage_div_28_div_4_ion_card_1_Template, 5, 2, "ion-card", 30);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.componentes);
  }
}
function VistoriaAreasPage_div_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28);
    \u0275\u0275template(1, VistoriaAreasPage_div_28_div_1_Template, 6, 1, "div", 18)(2, VistoriaAreasPage_div_28_div_2_Template, 4, 0, "div", 18)(3, VistoriaAreasPage_div_28_div_3_Template, 3, 0, "div", 20)(4, VistoriaAreasPage_div_28_div_4_Template, 2, 1, "div", 36);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.loadingComponentes);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.loadingComponentes && !ctx_r0.errorMessage && ctx_r0.componentes.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.loadingComponentes && !ctx_r0.errorMessage && ctx_r0.componentes.length > 0);
  }
}
function VistoriaAreasPage_ion_footer_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-footer")(1, "ion-toolbar")(2, "ion-button", 37);
    \u0275\u0275listener("click", function VistoriaAreasPage_ion_footer_29_Template_ion_button_click_2_listener() {
      \u0275\u0275restoreView(_r9);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.finalizarVistoria());
    });
    \u0275\u0275text(3, "Concluir Vistoria");
    \u0275\u0275elementEnd()()();
  }
}
var VistoriaAreasPage = class _VistoriaAreasPage {
  flowService = inject(VistoriaFlowService);
  areaService = inject(AreaVistoriadaService);
  vistoriaService = inject(VistoriaService);
  bootstrapService = inject(VistoriaBootstrapService);
  alertController = inject(AlertController);
  errorMessageService = inject(ErrorMessageService);
  authService = inject(AuthService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  areas = [];
  contagemPorArea = {};
  contagemPendentesPorArea = {};
  loading = false;
  errorMessage = "";
  /** Bottom sheet de componentes (mesma aba) */
  selectedArea = null;
  componentes = [];
  loadingComponentes = false;
  irregularidadesPorComponente = {};
  pendentesPorComponente = /* @__PURE__ */ new Set();
  irregularidadesList = [];
  pendentesList = [];
  reopenAreaId = null;
  initialized = false;
  /** Número da vistoria para exibição abaixo da barra */
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
  voltarOuFechar() {
    if (this.selectedArea !== null) {
      this.fecharSheetComponentes();
    } else {
      this.router.navigate(["/vistoria/inicio"]);
    }
  }
  ngOnInit() {
    const vistoriaId = this.flowService.getVistoriaId();
    if (!vistoriaId) {
      this.router.navigate(["/vistoria/inicio"]);
      return;
    }
    const navState = this.router.getCurrentNavigation()?.extras?.state ?? history.state ?? {};
    this.reopenAreaId = navState.reopenAreaId ?? null;
    if (!this.flowService.getNumeroVistoria() && vistoriaId) {
      this.vistoriaService.getById(vistoriaId).then((v) => {
        if (v?.numeroVistoria != null) {
          this.flowService.updateContext({ numeroVistoria: v.numeroVistoria });
          this.cdr.detectChanges();
        }
      });
    }
    this.initialized = true;
    this.carregarAreas();
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      if (!this.initialized) {
        return;
      }
      const navState = history.state ?? {};
      this.reopenAreaId = navState.reopenAreaId ?? this.reopenAreaId;
      yield this.carregarAreas();
    });
  }
  carregarAreas() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      const modeloId = this.flowService.getVeiculoModeloId();
      if (!vistoriaId)
        return;
      this.loading = true;
      this.errorMessage = "";
      try {
        const bootstrap = yield this.bootstrapService.getOrFetch(vistoriaId);
        if (bootstrap) {
          this.aplicarBootstrap(bootstrap);
          yield this.recarregarIndicadores(vistoriaId);
          if (!this.flowService.getNumeroVistoria() && bootstrap.vistoria?.numeroVistoria != null) {
            this.flowService.updateContext({ numeroVistoria: bootstrap.vistoria.numeroVistoria });
          }
          if (this.reopenAreaId) {
            const area = this.areas.find((a) => a.id === this.reopenAreaId);
            if (area) {
              yield this.abrirArea(area);
            }
            this.reopenAreaId = null;
          }
          return;
        }
        if (modeloId) {
          this.areas = yield this.areaService.listarPorModelo(modeloId);
        }
        if (this.areas.length === 0) {
          this.areas = yield this.areaService.listarAtivas();
        }
        const [irregularidades, pendentes] = yield Promise.all([
          this.vistoriaService.listarIrregularidades(vistoriaId),
          this.flowService.getVeiculoId() ? this.vistoriaService.listarIrregularidadesPendentes(this.flowService.getVeiculoId()) : Promise.resolve([])
        ]);
        this.aplicarIndicadores(irregularidades, pendentes);
        if (this.reopenAreaId) {
          const area = this.areas.find((a) => a.id === this.reopenAreaId);
          if (area) {
            yield this.abrirArea(area);
          }
          this.reopenAreaId = null;
        }
      } catch {
        this.errorMessage = "Erro ao carregar \xE1reas. Tente novamente.";
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  abrirArea(area) {
    return __async(this, null, function* () {
      this.errorMessage = "";
      this.selectedArea = area;
      this.componentes = [];
      this.irregularidadesPorComponente = {};
      this.pendentesPorComponente = /* @__PURE__ */ new Set();
      yield this.carregarComponentesDaArea();
    });
  }
  /** Recarrega componentes da área selecionada (uso após erro ou retry). */
  carregarComponentesDaArea() {
    return __async(this, null, function* () {
      const area = this.selectedArea;
      if (!area)
        return;
      this.errorMessage = "";
      this.loadingComponentes = true;
      this.irregularidadesPorComponente = {};
      this.pendentesPorComponente = /* @__PURE__ */ new Set();
      this.cdr.detectChanges();
      try {
        const vistoriaId = this.flowService.getVistoriaId();
        const bootstrap = vistoriaId ? this.bootstrapService.getSnapshot(vistoriaId) : null;
        const areaBootstrap = bootstrap?.areas?.find((a) => a.id === area.id);
        if (areaBootstrap) {
          this.componentes = areaBootstrap.componentes;
        } else {
          this.componentes = yield this.areaService.listarComponentes(area.id);
        }
        this.irregularidadesList.filter((item) => item.idarea === area.id).forEach((item) => {
          this.irregularidadesPorComponente[item.idcomponente] = (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
        });
        this.pendentesList.filter((item) => item.idarea === area.id).forEach((item) => this.pendentesPorComponente.add(item.idcomponente));
      } catch {
        this.errorMessage = "Erro ao carregar componentes. Tente novamente.";
      } finally {
        this.loadingComponentes = false;
        this.cdr.detectChanges();
      }
    });
  }
  aplicarBootstrap(bootstrap) {
    this.areas = bootstrap.areas;
    this.aplicarIndicadores(bootstrap.irregularidadesVistoria ?? [], bootstrap.pendentesVeiculo ?? []);
  }
  aplicarIndicadores(irregularidades, pendentesRaw) {
    this.irregularidadesList = irregularidades;
    const idsDaVistoriaAtual = new Set(irregularidades.map((item) => item.id));
    this.pendentesList = pendentesRaw.filter((item) => !idsDaVistoriaAtual.has(item.id));
    this.contagemPorArea = irregularidades.reduce((acc, item) => {
      acc[item.idarea] = (acc[item.idarea] ?? 0) + 1;
      return acc;
    }, {});
    this.contagemPendentesPorArea = this.pendentesList.reduce((acc, item) => {
      acc[item.idarea] = (acc[item.idarea] ?? 0) + 1;
      return acc;
    }, {});
  }
  recarregarIndicadores(vistoriaId) {
    return __async(this, null, function* () {
      const veiculoId = this.flowService.getVeiculoId();
      const [irregularidades, pendentes] = yield Promise.all([
        this.vistoriaService.listarIrregularidades(vistoriaId),
        veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([])
      ]);
      this.aplicarIndicadores(irregularidades, pendentes);
    });
  }
  fecharSheetComponentes() {
    this.selectedArea = null;
    this.componentes = [];
    this.errorMessage = "";
    this.cdr.detectChanges();
  }
  abrirComponente(item) {
    const areaId = this.selectedArea?.id;
    const componenteId = item.idComponente;
    if (!areaId || !componenteId)
      return;
    this.router.navigate([`/vistoria/areas/${areaId}/componentes/${componenteId}`], {
      state: {
        areaNome: this.selectedArea?.nome ?? "\xC1rea",
        componenteNome: item.componente?.nome ?? "Componente"
      }
    });
  }
  finalizarVistoria() {
    this.router.navigate(["/vistoria/finalizar"]);
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
  escapeHtml(value) {
    return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  static \u0275fac = function VistoriaAreasPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaAreasPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaAreasPage, selectors: [["app-vistoria-areas"]], decls: 30, vars: 10, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 1, "resumo-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["x", "8", "y", "2", "width", "8", "height", "4", "rx", "1"], ["d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["d", "M9 12h6"], ["d", "M9 16h6"], ["fill", "solid", "color", "medium", "aria-label", "Resumo da vistoria", 1, "resumo-btn", 3, "click"], ["d", "m3 17 2 2 4-4"], ["d", "m3 7 2 2 4-4"], ["d", "M13 6h8"], ["d", "M13 12h8"], ["d", "M13 18h8"], ["fill", "solid", 3, "click"], [3, "fullscreen"], ["class", "selected-context", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["class", "content sheet-context", 4, "ngIf"], [4, "ngIf"], [1, "selected-context"], [1, "context-inline"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], ["fill", "outline", 3, "click"], [1, "content", "sheet-context"], [1, "cards-container"], ["button", "", "class", "level-card", 3, "click", 4, "ngFor", "ngForOf"], ["button", "", 1, "level-card", 3, "click"], ["class", "ion-text-wrap", 4, "ngIf"], ["color", "primary"], [1, "ion-text-wrap"], ["color", "warning"], ["class", "cards-container", 4, "ngIf"], ["expand", "block", 3, "click"]], template: function VistoriaAreasPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2)(7, "ion-button", 3);
      \u0275\u0275listener("click", function VistoriaAreasPage_Template_ion_button_click_7_listener() {
        return ctx.abrirResumoPendenciasVeiculo();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(8, "svg", 4);
      \u0275\u0275element(9, "rect", 5)(10, "path", 6)(11, "path", 7)(12, "path", 8);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "ion-button", 9);
      \u0275\u0275listener("click", function VistoriaAreasPage_Template_ion_button_click_13_listener() {
        return ctx.abrirResumoVistoria();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 4);
      \u0275\u0275element(15, "path", 10)(16, "path", 11)(17, "path", 12)(18, "path", 13)(19, "path", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(20, "ion-button", 15);
      \u0275\u0275listener("click", function VistoriaAreasPage_Template_ion_button_click_20_listener() {
        return ctx.voltarOuFechar();
      });
      \u0275\u0275text(21, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "ion-content", 16);
      \u0275\u0275template(23, VistoriaAreasPage_div_23_Template, 9, 3, "div", 17)(24, VistoriaAreasPage_div_24_Template, 4, 0, "div", 18)(25, VistoriaAreasPage_div_25_Template, 6, 1, "div", 18)(26, VistoriaAreasPage_div_26_Template, 3, 1, "div", 19)(27, VistoriaAreasPage_div_27_Template, 5, 0, "div", 18)(28, VistoriaAreasPage_div_28_Template, 5, 4, "div", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275template(29, VistoriaAreasPage_ion_footer_29_Template, 4, 0, "ion-footer", 20);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.selectedArea === null ? "\xC1reas" : "Componentes");
      \u0275\u0275advance(17);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.areas.length > 0 && ctx.selectedArea === null);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.areas.length === 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedArea !== null);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    IonContent,
    IonFooter,
    IonHeader,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonText,
    IonSpinner
  ], styles: ['@charset "UTF-8";\n\n\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.content.sheet-context[_ngcontent-%COMP%] {\n  align-items: stretch;\n}\n.cards-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n  margin-top: 12px;\n}\n.level-card[_ngcontent-%COMP%] {\n  margin: 0;\n  cursor: pointer;\n  --background: var(--ion-card-background, var(--ion-item-background));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.level-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 4px 0;\n  font-size: 1rem;\n  color: var(--ion-color-medium-shade);\n}\n.nivel-instruction[_ngcontent-%COMP%] {\n  --min-height: 48px;\n  --padding-top: 10px;\n  --padding-bottom: 10px;\n  --padding-start: 16px;\n  --padding-end: 16px;\n  --background: var(--ion-color-primary-tint, #e8f4ff);\n  --border-width: 0 0 1px 0;\n  --border-color: var(--ion-color-primary-shade, #0d6efd);\n}\n.nivel-instruction[_ngcontent-%COMP%]   .nivel-instruction-inner[_ngcontent-%COMP%] {\n  width: 100%;\n  font-weight: 600;\n  font-size: 1rem;\n  color: var(--ion-color-dark);\n}\n.nivel-instruction[_ngcontent-%COMP%]   .nivel-breadcrumb[_ngcontent-%COMP%] {\n  color: var(--ion-color-primary);\n}\n.nivel-instruction[_ngcontent-%COMP%]   .nivel-link[_ngcontent-%COMP%] {\n  color: var(--ion-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 44px;\n  --padding-start: 8px;\n  --padding-end: 8px;\n  --background: var(--ion-color-light);\n}\n.selected-context[_ngcontent-%COMP%] {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  padding: 14px 16px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  text-align: left;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 1.02rem;\n  color: #0f172a;\n  display: block;\n  line-height: 1.4;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: inline;\n  color: #1d4ed8;\n  margin-right: 4px;\n}\n.selected-context[_ngcontent-%COMP%]   .context-inline[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.actions[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n/*# sourceMappingURL=vistoria-areas.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaAreasPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-areas", standalone: true, imports: [
      NgIf,
      NgForOf,
      IonContent,
      IonFooter,
      IonHeader,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonButton,
      IonText,
      IonSpinner
    ], template: `<ion-header [translucent]="true">\r
  <ion-toolbar>\r
    <ion-buttons slot="start">\r
      <ion-menu-button></ion-menu-button>\r
    </ion-buttons>\r
    <ion-title>{{ selectedArea === null ? '\xC1reas' : 'Componentes' }}</ion-title>\r
    <ion-buttons slot="end">\r
      <ion-button\r
        class="resumo-btn"\r
        fill="solid"\r
        color="medium"\r
        (click)="abrirResumoPendenciasVeiculo()"\r
        aria-label="Pendencias de outras vistorias"\r
      >\r
        <svg\r
          xmlns="http://www.w3.org/2000/svg"\r
          width="18"\r
          height="18"\r
          viewBox="0 0 24 24"\r
          fill="none"\r
          stroke="currentColor"\r
          stroke-width="2"\r
          stroke-linecap="round"\r
          stroke-linejoin="round"\r
          aria-hidden="true"\r
        >\r
          <rect x="8" y="2" width="8" height="4" rx="1"></rect>\r
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>\r
          <path d="M9 12h6"></path>\r
          <path d="M9 16h6"></path>\r
        </svg>\r
      </ion-button>\r
      <ion-button class="resumo-btn" fill="solid" color="medium" (click)="abrirResumoVistoria()" aria-label="Resumo da vistoria">\r
        <svg\r
          xmlns="http://www.w3.org/2000/svg"\r
          width="18"\r
          height="18"\r
          viewBox="0 0 24 24"\r
          fill="none"\r
          stroke="currentColor"\r
          stroke-width="2"\r
          stroke-linecap="round"\r
          stroke-linejoin="round"\r
          aria-hidden="true"\r
        >\r
          <path d="m3 17 2 2 4-4"></path>\r
          <path d="m3 7 2 2 4-4"></path>\r
          <path d="M13 6h8"></path>\r
          <path d="M13 12h8"></path>\r
          <path d="M13 18h8"></path>\r
        </svg>\r
      </ion-button>\r
      <ion-button fill="solid" (click)="voltarOuFechar()">Voltar</ion-button>\r
    </ion-buttons>\r
  </ion-toolbar>\r
</ion-header>\r
\r
<ion-content [fullscreen]="true">\r
  <div class="selected-context" *ngIf="!loading">\r
    <p class="context-inline">\r
      <strong>Vistoria:</strong> {{ vistoriaNumero }} \xB7\r
      <strong>Ve\xEDculo:</strong> {{ veiculoNumero }}\r
      <ng-container *ngIf="selectedArea !== null">\r
        \xB7 <strong>\xC1rea:</strong> {{ selectedArea.nome }}\r
      </ng-container>\r
    </p>\r
  </div>\r
\r
  <div class="content" *ngIf="loading">\r
    <ion-spinner name="crescent"></ion-spinner>\r
    <p>Carregando \xE1reas...</p>\r
  </div>\r
\r
  <div class="content" *ngIf="errorMessage">\r
    <ion-text color="danger"><p class="error-message">{{ errorMessage }}</p></ion-text>\r
    <ion-button fill="outline" (click)="carregarAreas()">Tentar novamente</ion-button>\r
  </div>\r
\r
  <!-- Lista de \xE1reas em cards -->\r
  <div class="content sheet-context" *ngIf="!loading && areas.length > 0 && selectedArea === null">\r
    <div class="cards-container">\r
      <ion-card *ngFor="let area of areas" button (click)="abrirArea(area)" class="level-card">\r
        <ion-card-header>\r
          <ion-card-title>{{ area.nome }}</ion-card-title>\r
        </ion-card-header>\r
        <ion-card-content *ngIf="contagemPorArea[area.id] || contagemPendentesPorArea[area.id]">\r
          <p *ngIf="contagemPorArea[area.id]">\r
            <ion-text color="primary">\r
              Irregularidades nesta vistoria: {{ contagemPorArea[area.id] }}\r
            </ion-text>\r
          </p>\r
          <p *ngIf="contagemPendentesPorArea[area.id]" class="ion-text-wrap">\r
            <ion-text color="warning">\r
              Pendencias em vistorias anteriores: {{ contagemPendentesPorArea[area.id] }}\r
            </ion-text>\r
          </p>\r
        </ion-card-content>\r
      </ion-card>\r
    </div>\r
  </div>\r
\r
  <div class="content" *ngIf="!loading && areas.length === 0">\r
    <p>Nenhuma \xE1rea encontrada. Verifique se h\xE1 \xE1reas ativas cadastradas no sistema.</p>\r
    <ion-button fill="outline" (click)="carregarAreas()">Tentar novamente</ion-button>\r
  </div>\r
\r
  <!-- Componentes da \xE1rea selecionada em cards -->\r
  <div class="content sheet-context" *ngIf="selectedArea !== null">\r
    <div *ngIf="errorMessage" class="content">\r
      <ion-text color="danger"><p class="error-message">{{ errorMessage }}</p></ion-text>\r
      <ion-button fill="outline" (click)="carregarComponentesDaArea()">Tentar novamente</ion-button>\r
    </div>\r
    <div *ngIf="loadingComponentes" class="content">\r
      <ion-spinner name="crescent"></ion-spinner>\r
      <p>Carregando componentes...</p>\r
    </div>\r
    <div *ngIf="!loadingComponentes && !errorMessage && componentes.length === 0">\r
      <p>Nenhum componente nesta \xE1rea.</p>\r
    </div>\r
    <div *ngIf="!loadingComponentes && !errorMessage && componentes.length > 0" class="cards-container">\r
      <ion-card *ngFor="let item of componentes" button (click)="abrirComponente(item)" class="level-card">\r
        <ion-card-header>\r
          <ion-card-title>{{ item.componente?.nome }}</ion-card-title>\r
        </ion-card-header>\r
        <ion-card-content *ngIf="irregularidadesPorComponente[item.idComponente] > 0 || pendentesPorComponente.has(item.idComponente)">\r
          <p *ngIf="irregularidadesPorComponente[item.idComponente] > 0">\r
            <ion-text color="primary">\r
              Irregularidades nesta vistoria: {{ irregularidadesPorComponente[item.idComponente] }}\r
            </ion-text>\r
          </p>\r
          <p *ngIf="pendentesPorComponente.has(item.idComponente)" class="ion-text-wrap">\r
            <ion-text color="warning">Existe irregularidade pendente em vistoria anterior</ion-text>\r
          </p>\r
        </ion-card-content>\r
      </ion-card>\r
    </div>\r
  </div>\r
\r
</ion-content>\r
\r
<ion-footer *ngIf="!loading">\r
  <ion-toolbar>\r
    <ion-button expand="block" (click)="finalizarVistoria()">Concluir Vistoria</ion-button>\r
  </ion-toolbar>\r
</ion-footer>\r
`, styles: ['@charset "UTF-8";\n\n/* src/app/pages/vistoria/vistoria-areas.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.content.sheet-context {\n  align-items: stretch;\n}\n.cards-container {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n  margin-top: 12px;\n}\n.level-card {\n  margin: 0;\n  cursor: pointer;\n  --background: var(--ion-card-background, var(--ion-item-background));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.level-card ion-card-header {\n  padding: 16px 18px;\n}\n.level-card ion-card-title {\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.level-card ion-card-content {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card ion-card-content p {\n  margin: 0 0 4px 0;\n  font-size: 1rem;\n  color: var(--ion-color-medium-shade);\n}\n.nivel-instruction {\n  --min-height: 48px;\n  --padding-top: 10px;\n  --padding-bottom: 10px;\n  --padding-start: 16px;\n  --padding-end: 16px;\n  --background: var(--ion-color-primary-tint, #e8f4ff);\n  --border-width: 0 0 1px 0;\n  --border-color: var(--ion-color-primary-shade, #0d6efd);\n}\n.nivel-instruction .nivel-instruction-inner {\n  width: 100%;\n  font-weight: 600;\n  font-size: 1rem;\n  color: var(--ion-color-dark);\n}\n.nivel-instruction .nivel-breadcrumb {\n  color: var(--ion-color-primary);\n}\n.nivel-instruction .nivel-link {\n  color: var(--ion-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n}\n.error-message {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar {\n  --min-height: 44px;\n  --padding-start: 8px;\n  --padding-end: 8px;\n  --background: var(--ion-color-light);\n}\n.selected-context {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  padding: 14px 16px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  text-align: left;\n}\n.selected-context p {\n  margin: 0 0 8px;\n  font-size: 1.02rem;\n  color: #0f172a;\n  display: block;\n  line-height: 1.4;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.selected-context p:last-child {\n  margin-bottom: 0;\n}\n.selected-context p strong {\n  display: inline;\n  color: #1d4ed8;\n  margin-right: 4px;\n}\n.selected-context .context-inline {\n  margin: 0;\n}\n.actions {\n  margin-top: 24px;\n}\n/*# sourceMappingURL=vistoria-areas.page.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaAreasPage, { className: "VistoriaAreasPage", filePath: "src/app/pages/vistoria/vistoria-areas.page.ts", lineNumber: 55 });
})();
export {
  VistoriaAreasPage
};
//# sourceMappingURL=chunk-6FRK5O5J.js.map
