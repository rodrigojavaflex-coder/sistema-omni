import {
  AreaVistoriadaService
} from "./chunk-2LKB7HLG.js";
import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LOSUBM6T.js";
import {
  ActivatedRoute,
  Component,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-SPXVY54Q.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-5JG7MXFI.js";
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
function VistoriaComponentesPage_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7);
    \u0275\u0275element(1, "ion-spinner", 8);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando componentes...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaComponentesPage_ion_text_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 9)(1, "p", 10);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaComponentesPage_ion_list_9_ion_item_1_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, " Irregularidade registrada ");
    \u0275\u0275elementEnd();
  }
}
function VistoriaComponentesPage_ion_list_9_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 12);
    \u0275\u0275listener("click", function VistoriaComponentesPage_ion_list_9_ion_item_1_Template_ion_item_click_0_listener() {
      const item_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.abrirComponente(item_r3));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, VistoriaComponentesPage_ion_list_9_ion_item_1_p_4_Template, 2, 0, "p", 6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.componente == null ? null : item_r3.componente.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.irregularidadesPorComponente.has(item_r3.idComponente));
  }
}
function VistoriaComponentesPage_ion_list_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaComponentesPage_ion_list_9_ion_item_1_Template, 5, 2, "ion-item", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.componentes);
  }
}
function VistoriaComponentesPage_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 7)(1, "p");
    \u0275\u0275text(2, "Nenhum componente encontrado nesta \xE1rea.");
    \u0275\u0275elementEnd()();
  }
}
var VistoriaComponentesPage = class _VistoriaComponentesPage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  areaService = inject(AreaVistoriadaService);
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  areaId = "";
  areaNome = "";
  componentes = [];
  irregularidadesPorComponente = /* @__PURE__ */ new Set();
  loading = false;
  errorMessage = "";
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
      this.loading = true;
      try {
        this.componentes = yield this.areaService.listarComponentes(this.areaId);
        const irregularidades = yield this.vistoriaService.listarIrregularidades(vistoriaId);
        irregularidades.filter((item) => item.idarea === this.areaId).forEach((item) => this.irregularidadesPorComponente.add(item.idcomponente));
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
  static \u0275fac = function VistoriaComponentesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaComponentesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaComponentesPage, selectors: [["app-vistoria-componentes"]], decls: 11, vars: 7, consts: [[3, "translucent"], ["slot", "start"], ["defaultHref", "/vistoria/areas"], [3, "fullscreen"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], [4, "ngIf"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], ["button", "", "detail", "true", 3, "click", 4, "ngFor", "ngForOf"], ["button", "", "detail", "true", 3, "click"]], template: function VistoriaComponentesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-back-button", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "ion-content", 3);
      \u0275\u0275template(7, VistoriaComponentesPage_div_7_Template, 4, 0, "div", 4)(8, VistoriaComponentesPage_ion_text_8_Template, 3, 1, "ion-text", 5)(9, VistoriaComponentesPage_ion_list_9_Template, 2, 1, "ion-list", 6)(10, VistoriaComponentesPage_div_10_Template, 3, 0, "div", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.areaNome);
      \u0275\u0275advance();
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.componentes.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.componentes.length === 0);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonSpinner
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n/*# sourceMappingURL=vistoria-componentes.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaComponentesPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-componentes", standalone: true, imports: [
      NgIf,
      NgForOf,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonBackButton,
      IonList,
      IonItem,
      IonLabel,
      IonText,
      IonSpinner
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-back-button defaultHref="/vistoria/areas"></ion-back-button>\r\n    </ion-buttons>\r\n    <ion-title>{{ areaNome }}</ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content" *ngIf="loading">\r\n    <ion-spinner name="crescent"></ion-spinner>\r\n    <p>Carregando componentes...</p>\r\n  </div>\r\n\r\n  <ion-text color="danger" *ngIf="errorMessage">\r\n    <p class="error-message">{{ errorMessage }}</p>\r\n  </ion-text>\r\n\r\n  <ion-list *ngIf="!loading && componentes.length > 0">\r\n    <ion-item button detail="true" *ngFor="let item of componentes" (click)="abrirComponente(item)">\r\n      <ion-label>\r\n        <h2>{{ item.componente?.nome }}</h2>\r\n        <p *ngIf="irregularidadesPorComponente.has(item.idComponente)">\r\n          Irregularidade registrada\r\n        </p>\r\n      </ion-label>\r\n    </ion-item>\r\n  </ion-list>\r\n\r\n  <div class="content" *ngIf="!loading && componentes.length === 0">\r\n    <p>Nenhum componente encontrado nesta \xE1rea.</p>\r\n  </div>\r\n</ion-content>\r\n', styles: ["/* src/app/pages/vistoria/vistoria-componentes.page.scss */\n.content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message {\n  padding: 12px 16px;\n}\n/*# sourceMappingURL=vistoria-componentes.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaComponentesPage, { className: "VistoriaComponentesPage", filePath: "src/app/pages/vistoria/vistoria-componentes.page.ts", lineNumber: 43 });
})();
export {
  VistoriaComponentesPage
};
//# sourceMappingURL=chunk-57EH7OOC.js.map
