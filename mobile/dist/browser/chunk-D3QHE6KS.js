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
  AlertController,
  ChangeDetectorRef,
  Component,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
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
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-3RNQ4BE2.js";

// src/app/pages/vistoria/vistoria-areas.page.ts
function VistoriaAreasPage_ion_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-button", 16);
    \u0275\u0275listener("click", function VistoriaAreasPage_ion_button_7_Template_ion_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrirResumoPendenciasVeiculo());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 5);
    \u0275\u0275element(2, "rect", 17)(3, "path", 18)(4, "path", 19)(5, "path", 20);
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_16_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 22)(1, "strong");
    \u0275\u0275text(2, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedArea.nome);
  }
}
function VistoriaAreasPage_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "div", 22)(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 22)(7, "strong");
    \u0275\u0275text(8, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, VistoriaAreasPage_div_16_div_11_Template, 5, 1, "div", 23);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.vistoriaNumero);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.veiculoNumero);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedArea !== null);
  }
}
function VistoriaAreasPage_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275element(1, "ion-spinner", 25);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando \xE1reas...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "ion-text", 26)(2, "p", 27);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ion-button", 28);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_18_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.carregarAreas());
    });
    \u0275\u0275text(5, "Tentar novamente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaAreasPage_div_19_ion_card_4_ion_card_content_4_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const area_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Irregularidades nesta vistoria: ", ctx_r1.contagemPorArea[area_r5.id], " ");
  }
}
function VistoriaAreasPage_div_19_ion_card_4_ion_card_content_4_p_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36)(1, "ion-text", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const area_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Pend\xEAncia(s) Registrada(s): ", ctx_r1.contagemPendentesPorArea[area_r5.id], " ");
  }
}
function VistoriaAreasPage_div_19_ion_card_4_ion_card_content_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card-content");
    \u0275\u0275template(1, VistoriaAreasPage_div_19_ion_card_4_ion_card_content_4_p_1_Template, 3, 1, "p", 15)(2, VistoriaAreasPage_div_19_ion_card_4_ion_card_content_4_p_2_Template, 3, 1, "p", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contagemPorArea[area_r5.id]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contagemPendentesPorArea[area_r5.id]);
  }
}
function VistoriaAreasPage_div_19_ion_card_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 33);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_19_ion_card_4_Template_ion_card_click_0_listener() {
      const area_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirArea(area_r5));
    });
    \u0275\u0275elementStart(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaAreasPage_div_19_ion_card_4_ion_card_content_4_Template, 3, 2, "ion-card-content", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(area_r5.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contagemPorArea[area_r5.id] || ctx_r1.contagemPendentesPorArea[area_r5.id]);
  }
}
function VistoriaAreasPage_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "p", 30);
    \u0275\u0275text(2, "Selecione uma Area:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 31);
    \u0275\u0275template(4, VistoriaAreasPage_div_19_ion_card_4_Template, 5, 2, "ion-card", 32);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.areas);
  }
}
function VistoriaAreasPage_div_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "p");
    \u0275\u0275text(2, "Nenhuma \xE1rea encontrada. Verifique se h\xE1 \xE1reas ativas cadastradas no sistema.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-button", 28);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_20_Template_ion_button_click_3_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.carregarAreas());
    });
    \u0275\u0275text(4, "Tentar novamente");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_21_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 24)(1, "ion-text", 26)(2, "p", 27);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ion-button", 28);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_21_div_1_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.carregarComponentesDaArea());
    });
    \u0275\u0275text(5, "Tentar novamente");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaAreasPage_div_21_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275element(1, "ion-spinner", 25);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando componentes...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_21_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "p");
    \u0275\u0275text(2, "Nenhum componente nesta \xE1rea.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_div_21_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 30);
    \u0275\u0275text(1, " Selecione um Componente: ");
    \u0275\u0275elementEnd();
  }
}
function VistoriaAreasPage_div_21_div_5_ion_card_1_ion_card_content_4_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Irregularidades nesta vistoria: ", ctx_r1.irregularidadesPorComponente[item_r9.idComponente], " ");
  }
}
function VistoriaAreasPage_div_21_div_5_ion_card_1_ion_card_content_4_p_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 36)(1, "ion-text", 37);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r9 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Pend\xEAncia(s) Registrada(s): ", ctx_r1.contagemPendentesPorComponente[item_r9.idComponente], " ");
  }
}
function VistoriaAreasPage_div_21_div_5_ion_card_1_ion_card_content_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card-content");
    \u0275\u0275template(1, VistoriaAreasPage_div_21_div_5_ion_card_1_ion_card_content_4_p_1_Template, 3, 1, "p", 15)(2, VistoriaAreasPage_div_21_div_5_ion_card_1_ion_card_content_4_p_2_Template, 3, 1, "p", 34);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.irregularidadesPorComponente[item_r9.idComponente] > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.contagemPendentesPorComponente[item_r9.idComponente] > 0);
  }
}
function VistoriaAreasPage_div_21_div_5_ion_card_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 33);
    \u0275\u0275listener("click", function VistoriaAreasPage_div_21_div_5_ion_card_1_Template_ion_card_click_0_listener() {
      const item_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.abrirComponente(item_r9));
    });
    \u0275\u0275elementStart(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaAreasPage_div_21_div_5_ion_card_1_ion_card_content_4_Template, 3, 2, "ion-card-content", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r9.componente == null ? null : item_r9.componente.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.irregularidadesPorComponente[item_r9.idComponente] > 0 || ctx_r1.contagemPendentesPorComponente[item_r9.idComponente] > 0);
  }
}
function VistoriaAreasPage_div_21_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 31);
    \u0275\u0275template(1, VistoriaAreasPage_div_21_div_5_ion_card_1_Template, 5, 2, "ion-card", 32);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.componentes);
  }
}
function VistoriaAreasPage_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29);
    \u0275\u0275template(1, VistoriaAreasPage_div_21_div_1_Template, 6, 1, "div", 13)(2, VistoriaAreasPage_div_21_div_2_Template, 4, 0, "div", 13)(3, VistoriaAreasPage_div_21_div_3_Template, 3, 0, "div", 15)(4, VistoriaAreasPage_div_21_p_4_Template, 2, 0, "p", 38)(5, VistoriaAreasPage_div_21_div_5_Template, 2, 1, "div", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.loadingComponentes);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.loadingComponentes && !ctx_r1.errorMessage && ctx_r1.componentes.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.loadingComponentes && !ctx_r1.errorMessage && ctx_r1.componentes.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.loadingComponentes && !ctx_r1.errorMessage && ctx_r1.componentes.length > 0);
  }
}
function VistoriaAreasPage_ion_footer_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-footer")(1, "ion-toolbar")(2, "div", 40)(3, "ion-button", 41);
    \u0275\u0275listener("click", function VistoriaAreasPage_ion_footer_22_Template_ion_button_click_3_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.finalizarVistoria());
    });
    \u0275\u0275text(4, " Concluir Vistoria ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-button", 42);
    \u0275\u0275listener("click", function VistoriaAreasPage_ion_footer_22_Template_ion_button_click_5_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.voltarOuFechar());
    });
    \u0275\u0275element(6, "ion-icon", 43);
    \u0275\u0275text(7, " Voltar ");
    \u0275\u0275elementEnd()()()();
  }
}
var VistoriaAreasPage = class _VistoriaAreasPage {
  flowService = inject(VistoriaFlowService);
  areaService = inject(AreaVistoriadaService);
  matrizService = inject(MatrizCriticidadeService);
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
  contagemPendentesPorComponente = {};
  irregularidadesList = [];
  pendentesList = [];
  componentesComMatrizPorArea = /* @__PURE__ */ new Map();
  componenteTemMatrizCache = /* @__PURE__ */ new Map();
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
  get canViewHistoricoVeiculo() {
    return this.authService.hasPermission("vistoria_web_historico_veiculo:read");
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
        this.areas = yield this.filtrarAreasComMatriz(this.areas);
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
      this.contagemPendentesPorComponente = {};
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
      this.contagemPendentesPorComponente = {};
      this.cdr.detectChanges();
      try {
        const vistoriaId = this.flowService.getVistoriaId();
        const bootstrap = vistoriaId ? this.bootstrapService.getSnapshot(vistoriaId) : null;
        const areaBootstrap = bootstrap?.areas?.find((a) => a.id === area.id);
        if (areaBootstrap) {
          const componentesComMatriz = areaBootstrap.componentes.filter((item) => (item.matriz?.length ?? 0) > 0);
          this.componentesComMatrizPorArea.set(area.id, componentesComMatriz);
          this.componentes = componentesComMatriz;
        } else {
          const cached = this.componentesComMatrizPorArea.get(area.id);
          if (cached) {
            this.componentes = cached;
          } else {
            const componentesRaw = yield this.areaService.listarComponentes(area.id);
            const componentesComMatriz = yield this.filtrarComponentesComMatriz(componentesRaw);
            this.componentesComMatrizPorArea.set(area.id, componentesComMatriz);
            this.componentes = componentesComMatriz;
          }
        }
        this.irregularidadesList.filter((item) => item.idarea === area.id).forEach((item) => {
          this.irregularidadesPorComponente[item.idcomponente] = (this.irregularidadesPorComponente[item.idcomponente] ?? 0) + 1;
        });
        this.pendentesList.filter((item) => item.idarea === area.id).forEach((item) => {
          this.contagemPendentesPorComponente[item.idcomponente] = (this.contagemPendentesPorComponente[item.idcomponente] ?? 0) + 1;
        });
      } catch {
        this.errorMessage = "Erro ao carregar componentes. Tente novamente.";
      } finally {
        this.loadingComponentes = false;
        this.cdr.detectChanges();
      }
    });
  }
  aplicarBootstrap(bootstrap) {
    this.componentesComMatrizPorArea.clear();
    this.areas = bootstrap.areas.map((area) => {
      const componentesComMatriz = area.componentes.filter((item) => (item.matriz?.length ?? 0) > 0);
      this.componentesComMatrizPorArea.set(area.id, componentesComMatriz);
      return __spreadProps(__spreadValues({}, area), {
        componentes: componentesComMatriz
      });
    }).filter((area) => area.componentes.length > 0);
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
      if (!this.canViewHistoricoVeiculo) {
        return;
      }
      this.router.navigate(["/vistoria/pendencias-veiculo"], {
        state: { fromMenu: false }
      });
    });
  }
  escapeHtml(value) {
    return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  filtrarAreasComMatriz(areas) {
    return __async(this, null, function* () {
      const resultado = [];
      for (const area of areas) {
        const componentesRaw = yield this.areaService.listarComponentes(area.id);
        const componentesComMatriz = yield this.filtrarComponentesComMatriz(componentesRaw);
        if (componentesComMatriz.length > 0) {
          this.componentesComMatrizPorArea.set(area.id, componentesComMatriz);
          resultado.push(area);
        }
      }
      return resultado;
    });
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
  static \u0275fac = function VistoriaAreasPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaAreasPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaAreasPage, selectors: [["app-vistoria-areas"]], decls: 23, vars: 11, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["class", "resumo-btn", "fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 3, "click", 4, "ngIf"], ["fill", "solid", "color", "medium", "aria-label", "Resumo da vistoria", 1, "resumo-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["d", "m3 17 2 2 4-4"], ["d", "m3 7 2 2 4-4"], ["d", "M13 6h8"], ["d", "M13 12h8"], ["d", "M13 18h8"], [3, "fullscreen"], ["class", "selected-context", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["class", "content sheet-context", 4, "ngIf"], [4, "ngIf"], ["fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 1, "resumo-btn", 3, "click"], ["x", "8", "y", "2", "width", "8", "height", "4", "rx", "1"], ["d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["d", "M9 12h6"], ["d", "M9 16h6"], [1, "selected-context"], [1, "context-card"], ["class", "context-card", 4, "ngIf"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], ["fill", "outline", 3, "click"], [1, "content", "sheet-context"], [1, "cards-selection-title"], [1, "cards-container"], ["button", "", "class", "level-card", 3, "click", 4, "ngFor", "ngForOf"], ["button", "", 1, "level-card", 3, "click"], ["class", "ion-text-wrap", 4, "ngIf"], ["color", "primary"], [1, "ion-text-wrap"], ["color", "warning"], ["class", "cards-selection-title", 4, "ngIf"], ["class", "cards-container", 4, "ngIf"], [1, "footer-actions"], [1, "btn-main", 3, "click"], ["fill", "outline", "color", "medium", 1, "btn-voltar", 3, "click"], ["slot", "start", "src", "/icons/corner-up-left.svg", "aria-hidden", "true"]], template: function VistoriaAreasPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2);
      \u0275\u0275template(7, VistoriaAreasPage_ion_button_7_Template, 6, 0, "ion-button", 3);
      \u0275\u0275elementStart(8, "ion-button", 4);
      \u0275\u0275listener("click", function VistoriaAreasPage_Template_ion_button_click_8_listener() {
        return ctx.abrirResumoVistoria();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(9, "svg", 5);
      \u0275\u0275element(10, "path", 6)(11, "path", 7)(12, "path", 8)(13, "path", 9)(14, "path", 10);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(15, "ion-content", 11);
      \u0275\u0275template(16, VistoriaAreasPage_div_16_Template, 12, 3, "div", 12)(17, VistoriaAreasPage_div_17_Template, 4, 0, "div", 13)(18, VistoriaAreasPage_div_18_Template, 6, 1, "div", 13)(19, VistoriaAreasPage_div_19_Template, 5, 1, "div", 14)(20, VistoriaAreasPage_div_20_Template, 5, 0, "div", 13)(21, VistoriaAreasPage_div_21_Template, 6, 5, "div", 14);
      \u0275\u0275elementEnd();
      \u0275\u0275template(22, VistoriaAreasPage_ion_footer_22_Template, 8, 0, "ion-footer", 15);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.selectedArea === null ? "\xC1reas" : "Componentes");
      \u0275\u0275advance(2);
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
    IonIcon,
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
  ], styles: ['@charset "UTF-8";\n\n\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar[_ngcontent-%COMP%] {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main[_ngcontent-%COMP%] {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.content.sheet-context[_ngcontent-%COMP%] {\n  align-items: stretch;\n}\n.cards-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n  margin-top: 12px;\n}\n.level-card[_ngcontent-%COMP%] {\n  margin: 0;\n  cursor: pointer;\n  --background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  transition:\n    transform 120ms ease,\n    box-shadow 120ms ease,\n    filter 120ms ease;\n}\n.level-card[_ngcontent-%COMP%]:active {\n  transform: scale(0.99);\n  box-shadow: 0 1px 4px rgba(25, 88, 191, 0.16);\n  filter: brightness(0.98);\n}\n.level-card[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #1d4ed8;\n  outline-offset: 2px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 600;\n  color: #1d4ed8;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 4px 0;\n  font-size: 1rem;\n  color: var(--ion-color-medium-shade);\n}\n.cards-selection-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n  color: #1d4ed8;\n}\n.nivel-instruction[_ngcontent-%COMP%] {\n  --min-height: 48px;\n  --padding-top: 10px;\n  --padding-bottom: 10px;\n  --padding-start: 16px;\n  --padding-end: 16px;\n  --background: var(--ion-color-primary-tint, #e8f4ff);\n  --border-width: 0 0 1px 0;\n  --border-color: var(--ion-color-primary-shade, #0d6efd);\n}\n.nivel-instruction[_ngcontent-%COMP%]   .nivel-instruction-inner[_ngcontent-%COMP%] {\n  width: 100%;\n  font-weight: 600;\n  font-size: 1rem;\n  color: var(--ion-color-dark);\n}\n.nivel-instruction[_ngcontent-%COMP%]   .nivel-breadcrumb[_ngcontent-%COMP%] {\n  color: var(--ion-color-primary);\n}\n.nivel-instruction[_ngcontent-%COMP%]   .nivel-link[_ngcontent-%COMP%] {\n  color: var(--ion-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 44px;\n  --padding-start: 8px;\n  --padding-end: 8px;\n  --background: var(--ion-color-light);\n}\n.selected-context[_ngcontent-%COMP%] {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.context-card[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  cursor: default;\n}\n.context-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 700;\n  margin-right: 4px;\n}\n.context-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #334155;\n  word-break: break-word;\n}\n.actions[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n/*# sourceMappingURL=vistoria-areas.page.css.map */'] });
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
      IonIcon,
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
    ], template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>{{ selectedArea === null ? '\xC1reas' : 'Componentes' }}</ion-title>
    <ion-buttons slot="end">
      <ion-button
        *ngIf="canViewHistoricoVeiculo"
        class="resumo-btn"
        fill="solid"
        color="medium"
        (click)="abrirResumoPendenciasVeiculo()"
        aria-label="Pendencias de outras vistorias"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="8" y="2" width="8" height="4" rx="1"></rect>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <path d="M9 12h6"></path>
          <path d="M9 16h6"></path>
        </svg>
      </ion-button>
      <ion-button class="resumo-btn" fill="solid" color="medium" (click)="abrirResumoVistoria()" aria-label="Resumo da vistoria">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m3 17 2 2 4-4"></path>
          <path d="m3 7 2 2 4-4"></path>
          <path d="M13 6h8"></path>
          <path d="M13 12h8"></path>
          <path d="M13 18h8"></path>
        </svg>
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div class="selected-context" *ngIf="!loading">
    <div class="context-card">
      <strong>Vistoria:</strong>
      <span>{{ vistoriaNumero }}</span>
    </div>
    <div class="context-card">
      <strong>Ve\xEDculo:</strong>
      <span>{{ veiculoNumero }}</span>
    </div>
    <div class="context-card" *ngIf="selectedArea !== null">
      <strong>\xC1rea:</strong>
      <span>{{ selectedArea.nome }}</span>
    </div>
  </div>

  <div class="content" *ngIf="loading">
    <ion-spinner name="crescent"></ion-spinner>
    <p>Carregando \xE1reas...</p>
  </div>

  <div class="content" *ngIf="errorMessage">
    <ion-text color="danger"><p class="error-message">{{ errorMessage }}</p></ion-text>
    <ion-button fill="outline" (click)="carregarAreas()">Tentar novamente</ion-button>
  </div>

  <!-- Lista de \xE1reas em cards -->
  <div class="content sheet-context" *ngIf="!loading && areas.length > 0 && selectedArea === null">
    <p class="cards-selection-title">Selecione uma Area:</p>
    <div class="cards-container">
      <ion-card *ngFor="let area of areas" button (click)="abrirArea(area)" class="level-card">
        <ion-card-header>
          <ion-card-title>{{ area.nome }}</ion-card-title>
        </ion-card-header>
        <ion-card-content *ngIf="contagemPorArea[area.id] || contagemPendentesPorArea[area.id]">
          <p *ngIf="contagemPorArea[area.id]">
            <ion-text color="primary">
              Irregularidades nesta vistoria: {{ contagemPorArea[area.id] }}
            </ion-text>
          </p>
          <p *ngIf="contagemPendentesPorArea[area.id]" class="ion-text-wrap">
            <ion-text color="warning">
              Pend\xEAncia(s) Registrada(s): {{ contagemPendentesPorArea[area.id] }}
            </ion-text>
          </p>
        </ion-card-content>
      </ion-card>
    </div>
  </div>

  <div class="content" *ngIf="!loading && areas.length === 0">
    <p>Nenhuma \xE1rea encontrada. Verifique se h\xE1 \xE1reas ativas cadastradas no sistema.</p>
    <ion-button fill="outline" (click)="carregarAreas()">Tentar novamente</ion-button>
  </div>

  <!-- Componentes da \xE1rea selecionada em cards -->
  <div class="content sheet-context" *ngIf="selectedArea !== null">
    <div *ngIf="errorMessage" class="content">
      <ion-text color="danger"><p class="error-message">{{ errorMessage }}</p></ion-text>
      <ion-button fill="outline" (click)="carregarComponentesDaArea()">Tentar novamente</ion-button>
    </div>
    <div *ngIf="loadingComponentes" class="content">
      <ion-spinner name="crescent"></ion-spinner>
      <p>Carregando componentes...</p>
    </div>
    <div *ngIf="!loadingComponentes && !errorMessage && componentes.length === 0">
      <p>Nenhum componente nesta \xE1rea.</p>
    </div>
    <p *ngIf="!loadingComponentes && !errorMessage && componentes.length > 0" class="cards-selection-title">
      Selecione um Componente:
    </p>
    <div *ngIf="!loadingComponentes && !errorMessage && componentes.length > 0" class="cards-container">
      <ion-card *ngFor="let item of componentes" button (click)="abrirComponente(item)" class="level-card">
        <ion-card-header>
          <ion-card-title>{{ item.componente?.nome }}</ion-card-title>
        </ion-card-header>
        <ion-card-content *ngIf="irregularidadesPorComponente[item.idComponente] > 0 || contagemPendentesPorComponente[item.idComponente] > 0">
          <p *ngIf="irregularidadesPorComponente[item.idComponente] > 0">
            <ion-text color="primary">
              Irregularidades nesta vistoria: {{ irregularidadesPorComponente[item.idComponente] }}
            </ion-text>
          </p>
          <p *ngIf="contagemPendentesPorComponente[item.idComponente] > 0" class="ion-text-wrap">
            <ion-text color="warning">
              Pend\xEAncia(s) Registrada(s): {{ contagemPendentesPorComponente[item.idComponente] }}
            </ion-text>
          </p>
        </ion-card-content>
      </ion-card>
    </div>
  </div>

</ion-content>

<ion-footer *ngIf="!loading">
  <ion-toolbar>
    <div class="footer-actions">
      <ion-button class="btn-main" (click)="finalizarVistoria()">
        Concluir Vistoria
      </ion-button>
      <ion-button class="btn-voltar" fill="outline" color="medium" (click)="voltarOuFechar()">
        <ion-icon slot="start" src="/icons/corner-up-left.svg" aria-hidden="true"></ion-icon>
        Voltar
      </ion-button>
    </div>
  </ion-toolbar>
</ion-footer>
`, styles: ['@charset "UTF-8";\n\n/* src/app/pages/vistoria/vistoria-areas.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.content.sheet-context {\n  align-items: stretch;\n}\n.cards-container {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n  margin-top: 12px;\n}\n.level-card {\n  margin: 0;\n  cursor: pointer;\n  --background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  transition:\n    transform 120ms ease,\n    box-shadow 120ms ease,\n    filter 120ms ease;\n}\n.level-card:active {\n  transform: scale(0.99);\n  box-shadow: 0 1px 4px rgba(25, 88, 191, 0.16);\n  filter: brightness(0.98);\n}\n.level-card:focus-visible {\n  outline: 2px solid #1d4ed8;\n  outline-offset: 2px;\n}\n.level-card ion-card-header {\n  padding: 16px 18px;\n}\n.level-card ion-card-title {\n  font-size: 1.15rem;\n  font-weight: 600;\n  color: #1d4ed8;\n}\n.level-card ion-card-content {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card ion-card-content p {\n  margin: 0 0 4px 0;\n  font-size: 1rem;\n  color: var(--ion-color-medium-shade);\n}\n.cards-selection-title {\n  margin: 0;\n  font-weight: 700;\n  color: #1d4ed8;\n}\n.nivel-instruction {\n  --min-height: 48px;\n  --padding-top: 10px;\n  --padding-bottom: 10px;\n  --padding-start: 16px;\n  --padding-end: 16px;\n  --background: var(--ion-color-primary-tint, #e8f4ff);\n  --border-width: 0 0 1px 0;\n  --border-color: var(--ion-color-primary-shade, #0d6efd);\n}\n.nivel-instruction .nivel-instruction-inner {\n  width: 100%;\n  font-weight: 600;\n  font-size: 1rem;\n  color: var(--ion-color-dark);\n}\n.nivel-instruction .nivel-breadcrumb {\n  color: var(--ion-color-primary);\n}\n.nivel-instruction .nivel-link {\n  color: var(--ion-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n}\n.error-message {\n  padding: 12px 16px;\n}\n.vistoria-nr-bar {\n  --min-height: 44px;\n  --padding-start: 8px;\n  --padding-end: 8px;\n  --background: var(--ion-color-light);\n}\n.selected-context {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.context-card {\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  cursor: default;\n}\n.context-card strong {\n  color: #0f172a;\n  font-weight: 700;\n  margin-right: 4px;\n}\n.context-card span {\n  color: #334155;\n  word-break: break-word;\n}\n.actions {\n  margin-top: 24px;\n}\n/*# sourceMappingURL=vistoria-areas.page.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaAreasPage, { className: "VistoriaAreasPage", filePath: "src/app/pages/vistoria/vistoria-areas.page.ts", lineNumber: 58 });
})();
export {
  VistoriaAreasPage
};
//# sourceMappingURL=chunk-D3QHE6KS.js.map
