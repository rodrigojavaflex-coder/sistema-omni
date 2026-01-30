import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-HOZ3DUWF.js";
import {
  AlertController,
  Component,
  FormsModule,
  IonButton,
  IonButtons,
  IonContent,
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-FWNB6FX6.js";
import "./chunk-3EJ4SNN5.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor
} from "./chunk-RP3QMZ46.js";
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

// src/app/pages/vistoria/vistoria-finalizar.page.ts
function VistoriaFinalizarPage_ion_buttons_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-buttons", 12);
    \u0275\u0275element(1, "ion-menu-button");
    \u0275\u0275elementEnd();
  }
}
function VistoriaFinalizarPage_ion_text_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 13)(1, "p", 14);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaFinalizarPage_ion_spinner_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 15);
  }
}
function VistoriaFinalizarPage_span_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Finalizar vistoria");
    \u0275\u0275elementEnd();
  }
}
var VistoriaFinalizarPage = class _VistoriaFinalizarPage {
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  router = inject(Router);
  alertController = inject(AlertController);
  observacao = "";
  tempoMinutos = 0;
  isSaving = false;
  errorMessage = "";
  isNative = Capacitor.getPlatform() !== "web";
  ngOnInit() {
    this.tempoMinutos = this.flowService.getTempoEmMinutos();
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
        this.flowService.finalizar();
        this.router.navigate(["/home"]);
      } catch (error) {
        this.errorMessage = error?.message || "Erro ao finalizar vistoria.";
      } finally {
        this.isSaving = false;
      }
    });
  }
  cancelarVistoria() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return;
      }
      const alert = yield this.alertController.create({
        header: "Cancelar vistoria?",
        message: "Os itens j\xE1 registrados ser\xE3o mantidos como cancelados.",
        buttons: [
          { text: "Voltar", role: "cancel" },
          {
            text: "Cancelar vistoria",
            role: "destructive",
            handler: () => __async(this, null, function* () {
              yield this.vistoriaService.cancelarVistoria(vistoriaId);
              this.flowService.finalizar();
              this.router.navigate(["/home"]);
            })
          }
        ]
      });
      yield alert.present();
    });
  }
  static \u0275fac = function VistoriaFinalizarPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaFinalizarPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaFinalizarPage, selectors: [["app-vistoria-finalizar"]], decls: 23, vars: 9, consts: [[3, "translucent"], ["slot", "start", 4, "ngIf"], ["slot", "end"], ["color", "danger", 3, "click"], [3, "fullscreen"], [1, "content"], ["position", "stacked"], ["placeholder", "Observa\xE7\xE3o opcional", 3, "ngModelChange", "ngModel"], ["color", "danger", 4, "ngIf"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], [4, "ngIf"], ["slot", "start"], ["color", "danger"], [1, "error-message"], ["name", "crescent"]], template: function VistoriaFinalizarPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar");
      \u0275\u0275template(2, VistoriaFinalizarPage_ion_buttons_2_Template, 2, 0, "ion-buttons", 1);
      \u0275\u0275elementStart(3, "ion-title");
      \u0275\u0275text(4, "Finalizar Vistoria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "ion-buttons", 2)(6, "ion-button", 3);
      \u0275\u0275listener("click", function VistoriaFinalizarPage_Template_ion_button_click_6_listener() {
        return ctx.cancelarVistoria();
      });
      \u0275\u0275text(7, "Cancelar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(8, "ion-content", 4)(9, "div", 5)(10, "ion-item")(11, "ion-label", 6);
      \u0275\u0275text(12, "Tempo total (minutos)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "ion-text");
      \u0275\u0275text(14);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(15, "ion-item")(16, "ion-label", 6);
      \u0275\u0275text(17, "Observa\xE7\xE3o geral");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "ion-textarea", 7);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaFinalizarPage_Template_ion_textarea_ngModelChange_18_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.observacao, $event) || (ctx.observacao = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(19, VistoriaFinalizarPage_ion_text_19_Template, 3, 1, "ion-text", 8);
      \u0275\u0275elementStart(20, "ion-button", 9);
      \u0275\u0275listener("click", function VistoriaFinalizarPage_Template_ion_button_click_20_listener() {
        return ctx.finalizar();
      });
      \u0275\u0275template(21, VistoriaFinalizarPage_ion_spinner_21_Template, 1, 0, "ion-spinner", 10)(22, VistoriaFinalizarPage_span_22_Template, 2, 0, "span", 11);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.isNative);
      \u0275\u0275advance(6);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.tempoMinutos);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.observacao);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.isSaving);
    }
  }, dependencies: [
    NgIf,
    FormsModule,
    NgControlStatus,
    NgModel,
    IonContent,
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
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=vistoria-finalizar.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaFinalizarPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-finalizar", standalone: true, imports: [
      NgIf,
      FormsModule,
      IonContent,
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
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start" *ngIf="isNative">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>Finalizar Vistoria</ion-title>\r\n    <ion-buttons slot="end">\r\n      <ion-button color="danger" (click)="cancelarVistoria()">Cancelar</ion-button>\r\n    </ion-buttons>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content">\r\n    <ion-item>\r\n      <ion-label position="stacked">Tempo total (minutos)</ion-label>\r\n      <ion-text>{{ tempoMinutos }}</ion-text>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-label position="stacked">Observa\xE7\xE3o geral</ion-label>\r\n      <ion-textarea\r\n        [(ngModel)]="observacao"\r\n        placeholder="Observa\xE7\xE3o opcional"\r\n      ></ion-textarea>\r\n    </ion-item>\r\n\r\n    <ion-text color="danger" *ngIf="errorMessage">\r\n      <p class="error-message">{{ errorMessage }}</p>\r\n    </ion-text>\r\n\r\n    <ion-button expand="block" [disabled]="isSaving" (click)="finalizar()">\r\n      <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r\n      <span *ngIf="!isSaving">Finalizar vistoria</span>\r\n    </ion-button>\r\n  </div>\r\n</ion-content>\r\n', styles: ["/* src/app/pages/vistoria/vistoria-finalizar.page.scss */\n.content {\n  padding: 16px;\n}\n.error-message {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=vistoria-finalizar.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaFinalizarPage, { className: "VistoriaFinalizarPage", filePath: "src/app/pages/vistoria/vistoria-finalizar.page.ts", lineNumber: 46 });
})();
export {
  VistoriaFinalizarPage
};
//# sourceMappingURL=chunk-K6XNDLQF.js.map
