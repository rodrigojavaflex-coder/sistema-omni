import {
  CommonModule,
  Component,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
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
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate1
} from "./chunk-37Y5E3Q6.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import {
  registerPlugin
} from "./chunk-5JG7MXFI.js";
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

// node_modules/@capacitor/app/dist/esm/index.js
var App = registerPlugin("App", {
  web: () => import("./chunk-BKIVW3GD.js").then((m) => new m.AppWeb())
});

// src/app/pages/sobre/sobre.page.ts
var SobrePage = class _SobrePage {
  router = inject(Router);
  appName = "OMNI";
  appVersion = "-";
  buildVersion = "-";
  ngOnInit() {
    return __async(this, null, function* () {
      try {
        const info = yield App.getInfo();
        this.appName = info.name || this.appName;
        this.appVersion = info.version || "-";
        this.buildVersion = info.build || "-";
      } catch {
        this.appName = "OMNI";
        this.appVersion = "-";
        this.buildVersion = "-";
      }
    });
  }
  voltar() {
    this.router.navigate(["/home"]);
  }
  static \u0275fac = function SobrePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SobrePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SobrePage, selectors: [["app-sobre"]], decls: 25, vars: 5, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["fill", "solid", 3, "click"], [3, "fullscreen"], [1, "content"]], template: function SobrePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Sobre");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2)(7, "ion-button", 3);
      \u0275\u0275listener("click", function SobrePage_Template_ion_button_click_7_listener() {
        return ctx.voltar();
      });
      \u0275\u0275text(8, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(9, "ion-content", 4)(10, "div", 5)(11, "ion-card")(12, "ion-card-content")(13, "p")(14, "strong");
      \u0275\u0275text(15, "Aplicativo:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(16);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(17, "p")(18, "strong");
      \u0275\u0275text(19, "Vers\xE3o:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "p")(22, "strong");
      \u0275\u0275text(23, "Build:");
      \u0275\u0275elementEnd();
      \u0275\u0275text(24);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(9);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" ", ctx.appName);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.appVersion);
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate1(" ", ctx.buildVersion);
    }
  }, dependencies: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonCard,
    IonCardContent
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  padding: 12px;\n}\n/*# sourceMappingURL=sobre.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SobrePage, [{
    type: Component,
    args: [{ selector: "app-sobre", standalone: true, imports: [
      CommonModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonTitle,
      IonButton,
      IonContent,
      IonCard,
      IonCardContent
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>Sobre</ion-title>\r\n    <ion-buttons slot="end">\r\n      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>\r\n    </ion-buttons>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content">\r\n    <ion-card>\r\n      <ion-card-content>\r\n        <p><strong>Aplicativo:</strong> {{ appName }}</p>\r\n        <p><strong>Vers\xE3o:</strong> {{ appVersion }}</p>\r\n        <p><strong>Build:</strong> {{ buildVersion }}</p>\r\n      </ion-card-content>\r\n    </ion-card>\r\n  </div>\r\n</ion-content>\r\n', styles: ["/* src/app/pages/sobre/sobre.page.scss */\n.content {\n  padding: 12px;\n}\n/*# sourceMappingURL=sobre.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SobrePage, { className: "SobrePage", filePath: "src/app/pages/sobre/sobre.page.ts", lineNumber: 35 });
})();
export {
  SobrePage
};
//# sourceMappingURL=chunk-PLJWLVKG.js.map
