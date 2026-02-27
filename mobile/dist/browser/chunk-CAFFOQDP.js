import {
  AuthService
} from "./chunk-FAJD6DZI.js";
import {
  Component,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  NgIf,
  RouterLink,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-SPXVY54Q.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor
} from "./chunk-5JG7MXFI.js";
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

// src/app/pages/home/home.page.ts
function HomePage_ion_buttons_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-buttons", 4);
    \u0275\u0275element(1, "ion-menu-button");
    \u0275\u0275elementEnd();
  }
}
function HomePage_div_6_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 16)(1, "ion-button", 17);
    \u0275\u0275text(2, " Iniciar Vistoria ");
    \u0275\u0275elementEnd()();
  }
}
function HomePage_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5)(1, "div", 6)(2, "div", 7)(3, "div", 8);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 9)(6, "h1");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 10)(11, "div", 11)(12, "span", 12);
    \u0275\u0275text(13, "Perfil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 13);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 11)(17, "span", 12);
    \u0275\u0275text(18, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 14);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275template(21, HomePage_div_6_div_21_Template, 3, 0, "div", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.user.nome.slice(0, 1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Ol\xE1, ", ctx_r0.user.nome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.user.email);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.user.perfil.nomePerfil || "Sem perfil");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("active", ctx_r0.user.ativo);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.user.ativo ? "Ativo" : "Inativo", " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.canStartVistoria);
  }
}
var HomePage = class _HomePage {
  authService = inject(AuthService);
  user = null;
  isNative = Capacitor.getPlatform() !== "web";
  ngOnInit() {
    return __async(this, null, function* () {
      this.user = this.authService.getCurrentUser();
    });
  }
  get canStartVistoria() {
    return this.authService.hasPermission("vistoria_mobile:create");
  }
  static \u0275fac = function HomePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HomePage, selectors: [["app-home"]], decls: 7, vars: 4, consts: [[3, "translucent"], ["slot", "start", 4, "ngIf"], [3, "fullscreen"], ["class", "home-container", 4, "ngIf"], ["slot", "start"], [1, "home-container"], [1, "profile-card"], [1, "profile-header"], [1, "avatar"], [1, "profile-title"], [1, "profile-details"], [1, "detail-row"], [1, "detail-label"], [1, "detail-value"], [1, "detail-badge"], ["class", "home-actions", 4, "ngIf"], [1, "home-actions"], ["expand", "block", "routerLink", "/vistoria/inicio"]], template: function HomePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar");
      \u0275\u0275template(2, HomePage_ion_buttons_2_Template, 2, 0, "ion-buttons", 1);
      \u0275\u0275elementStart(3, "ion-title");
      \u0275\u0275text(4, "Home");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(5, "ion-content", 2);
      \u0275\u0275template(6, HomePage_div_6_Template, 22, 8, "div", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.isNative);
      \u0275\u0275advance(3);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.user);
    }
  }, dependencies: [
    NgIf,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenuButton,
    IonButtons,
    IonButton
  ], styles: ["\n\n.home-container[_ngcontent-%COMP%] {\n  padding: 24px;\n  min-height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 55%,\n      #cbd5f5 100%);\n}\n.profile-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 20px;\n  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);\n  margin-bottom: 20px;\n}\n.profile-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 16px;\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 56px;\n  height: 56px;\n  border-radius: 16px;\n  background: #1d4ed8;\n  color: #ffffff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 22px;\n  font-weight: 700;\n}\n.profile-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 4px 0;\n  font-size: 20px;\n  color: #0f172a;\n}\n.profile-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 14px;\n}\n.profile-details[_ngcontent-%COMP%] {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 12px;\n}\n.detail-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 0;\n}\n.detail-label[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 14px;\n}\n.detail-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #0f172a;\n}\n.detail-badge[_ngcontent-%COMP%] {\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  background: #e2e8f0;\n  color: #475569;\n}\n.detail-badge.active[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.home-actions[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n/*# sourceMappingURL=home.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HomePage, [{
    type: Component,
    args: [{ selector: "app-home", standalone: true, imports: [
      NgIf,
      RouterLink,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonMenuButton,
      IonButtons,
      IonButton
    ], template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start" *ngIf="isNative">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Home</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div class="home-container" *ngIf="user">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">{{ user.nome.slice(0, 1) }}</div>
        <div class="profile-title">
          <h1>Ol\xE1, {{ user.nome }}</h1>
          <p>{{ user.email }}</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-row">
          <span class="detail-label">Perfil</span>
          <span class="detail-value">{{ user.perfil.nomePerfil || 'Sem perfil' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status</span>
          <span class="detail-badge" [class.active]="user.ativo">
            {{ user.ativo ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
      </div>
    </div>

    <div class="home-actions" *ngIf="canStartVistoria">
      <ion-button expand="block" routerLink="/vistoria/inicio">
        Iniciar Vistoria
      </ion-button>
    </div>

  </div>
</ion-content>
`, styles: ["/* src/app/pages/home/home.page.scss */\n.home-container {\n  padding: 24px;\n  min-height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      #f8fafc 0%,\n      #e2e8f0 55%,\n      #cbd5f5 100%);\n}\n.profile-card {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 20px;\n  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);\n  margin-bottom: 20px;\n}\n.profile-header {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 16px;\n}\n.avatar {\n  width: 56px;\n  height: 56px;\n  border-radius: 16px;\n  background: #1d4ed8;\n  color: #ffffff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 22px;\n  font-weight: 700;\n}\n.profile-title h1 {\n  margin: 0 0 4px 0;\n  font-size: 20px;\n  color: #0f172a;\n}\n.profile-title p {\n  margin: 0;\n  color: #64748b;\n  font-size: 14px;\n}\n.profile-details {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 12px;\n}\n.detail-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 8px 0;\n}\n.detail-label {\n  color: #475569;\n  font-size: 14px;\n}\n.detail-value {\n  font-weight: 600;\n  color: #0f172a;\n}\n.detail-badge {\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  background: #e2e8f0;\n  color: #475569;\n}\n.detail-badge.active {\n  background: #dcfce7;\n  color: #15803d;\n}\n.home-actions {\n  margin-top: 16px;\n}\n/*# sourceMappingURL=home.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HomePage, { className: "HomePage", filePath: "src/app/pages/home/home.page.ts", lineNumber: 34 });
})();
export {
  HomePage
};
//# sourceMappingURL=chunk-CAFFOQDP.js.map
