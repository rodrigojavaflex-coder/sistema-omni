import {
  AreaVistoriadaService
} from "./chunk-2LKB7HLG.js";
import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LOSUBM6T.js";
import {
  Component,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
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
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
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

// src/app/pages/vistoria/vistoria-areas.page.ts
function VistoriaAreasPage_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8);
    \u0275\u0275element(1, "ion-spinner", 9);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando \xE1reas...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaAreasPage_ion_text_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 10)(1, "p", 11);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaAreasPage_ion_list_12_ion_item_1_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.contagemPorArea[area_r3.id], " irregularidade(s) ");
  }
}
function VistoriaAreasPage_ion_list_12_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 13);
    \u0275\u0275listener("click", function VistoriaAreasPage_ion_list_12_ion_item_1_Template_ion_item_click_0_listener() {
      const area_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.abrirArea(area_r3));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, VistoriaAreasPage_ion_list_12_ion_item_1_p_4_Template, 2, 1, "p", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const area_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(area_r3.nome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.contagemPorArea[area_r3.id]);
  }
}
function VistoriaAreasPage_ion_list_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaAreasPage_ion_list_12_ion_item_1_Template, 5, 2, "ion-item", 12);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.areas);
  }
}
function VistoriaAreasPage_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "p");
    \u0275\u0275text(2, "Nenhuma \xE1rea encontrada para o modelo.");
    \u0275\u0275elementEnd()();
  }
}
var VistoriaAreasPage = class _VistoriaAreasPage {
  flowService = inject(VistoriaFlowService);
  areaService = inject(AreaVistoriadaService);
  vistoriaService = inject(VistoriaService);
  router = inject(Router);
  areas = [];
  contagemPorArea = {};
  loading = false;
  errorMessage = "";
  ngOnInit() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      const modeloId = this.flowService.getVeiculoModeloId();
      if (!vistoriaId || !modeloId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.loading = true;
      try {
        this.areas = yield this.areaService.listarPorModelo(modeloId);
        const irregularidades = yield this.vistoriaService.listarIrregularidades(vistoriaId);
        this.contagemPorArea = irregularidades.reduce((acc, item) => {
          acc[item.idarea] = (acc[item.idarea] ?? 0) + 1;
          return acc;
        }, {});
      } catch {
        this.errorMessage = "Erro ao carregar \xE1reas.";
      } finally {
        this.loading = false;
      }
    });
  }
  abrirArea(area) {
    this.router.navigate([`/vistoria/areas/${area.id}`], {
      state: { areaNome: area.nome }
    });
  }
  finalizarVistoria() {
    this.router.navigate(["/vistoria/finalizar"]);
  }
  static \u0275fac = function VistoriaAreasPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaAreasPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaAreasPage, selectors: [["app-vistoria-areas"]], decls: 14, vars: 6, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], [3, "click"], [3, "fullscreen"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], [4, "ngIf"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], ["button", "", "detail", "true", 3, "click", 4, "ngFor", "ngForOf"], ["button", "", "detail", "true", 3, "click"]], template: function VistoriaAreasPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "\xC1reas Vistoriadas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2)(7, "ion-button", 3);
      \u0275\u0275listener("click", function VistoriaAreasPage_Template_ion_button_click_7_listener() {
        return ctx.finalizarVistoria();
      });
      \u0275\u0275text(8, "Finalizar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(9, "ion-content", 4);
      \u0275\u0275template(10, VistoriaAreasPage_div_10_Template, 4, 0, "div", 5)(11, VistoriaAreasPage_ion_text_11_Template, 3, 1, "ion-text", 6)(12, VistoriaAreasPage_ion_list_12_Template, 2, 1, "ion-list", 7)(13, VistoriaAreasPage_div_13_Template, 3, 0, "div", 5);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(9);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.areas.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.areas.length === 0);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonText,
    IonSpinner
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n/*# sourceMappingURL=vistoria-areas.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaAreasPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-areas", standalone: true, imports: [
      NgIf,
      NgForOf,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonList,
      IonItem,
      IonLabel,
      IonButton,
      IonText,
      IonSpinner
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>\xC1reas Vistoriadas</ion-title>\r\n    <ion-buttons slot="end">\r\n      <ion-button (click)="finalizarVistoria()">Finalizar</ion-button>\r\n    </ion-buttons>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content" *ngIf="loading">\r\n    <ion-spinner name="crescent"></ion-spinner>\r\n    <p>Carregando \xE1reas...</p>\r\n  </div>\r\n\r\n  <ion-text color="danger" *ngIf="errorMessage">\r\n    <p class="error-message">{{ errorMessage }}</p>\r\n  </ion-text>\r\n\r\n  <ion-list *ngIf="!loading && areas.length > 0">\r\n    <ion-item button detail="true" *ngFor="let area of areas" (click)="abrirArea(area)">\r\n      <ion-label>\r\n        <h2>{{ area.nome }}</h2>\r\n        <p *ngIf="contagemPorArea[area.id]">\r\n          {{ contagemPorArea[area.id] }} irregularidade(s)\r\n        </p>\r\n      </ion-label>\r\n    </ion-item>\r\n  </ion-list>\r\n\r\n  <div class="content" *ngIf="!loading && areas.length === 0">\r\n    <p>Nenhuma \xE1rea encontrada para o modelo.</p>\r\n  </div>\r\n</ion-content>\r\n', styles: ["/* src/app/pages/vistoria/vistoria-areas.page.scss */\n.content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 24px;\n  gap: 12px;\n}\n.error-message {\n  padding: 12px 16px;\n}\n/*# sourceMappingURL=vistoria-areas.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaAreasPage, { className: "VistoriaAreasPage", filePath: "src/app/pages/vistoria/vistoria-areas.page.ts", lineNumber: 45 });
})();
export {
  VistoriaAreasPage
};
//# sourceMappingURL=chunk-ZLEYQ34N.js.map
