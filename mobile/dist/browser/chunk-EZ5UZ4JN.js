import {
  AuthService
} from "./chunk-T6CYOBCK.js";
import "./chunk-P3DEM65Q.js";
import {
  AlertController,
  CommonModule,
  Component,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
  NgIf,
  Router,
  ToastController,
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
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-IS355SV5.js";
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

// src/app/pages/configuracoes/configuracoes.page.ts
function ConfiguracoesPage_ion_text_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 9)(1, "p", 10);
    \u0275\u0275text(2, "Biometria n\xE3o dispon\xEDvel neste dispositivo.");
    \u0275\u0275elementEnd()();
  }
}
var ConfiguracoesPage = class _ConfiguracoesPage {
  authService = inject(AuthService);
  alertController = inject(AlertController);
  toastController = inject(ToastController);
  router = inject(Router);
  biometricAvailable = false;
  biometricEnabled = false;
  biometricSaving = false;
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.refreshBiometricState();
    });
  }
  voltar() {
    this.router.navigate(["/home"]);
  }
  onBiometricToggle(event) {
    return __async(this, null, function* () {
      if (this.biometricSaving) {
        return;
      }
      const shouldEnable = Boolean(event.detail?.checked);
      if (!shouldEnable) {
        this.biometricSaving = true;
        yield this.authService.disableBiometricLogin();
        this.biometricEnabled = false;
        this.biometricSaving = false;
        return;
      }
      const user = this.authService.getCurrentUser();
      if (!user?.email) {
        this.biometricEnabled = false;
        yield this.presentToast("N\xE3o foi poss\xEDvel identificar o usu\xE1rio atual.");
        return;
      }
      const alert = yield this.alertController.create({
        header: "Ativar login por digital",
        message: "Confirme sua senha para habilitar o login por biometria.",
        inputs: [
          {
            name: "password",
            type: "password",
            placeholder: "Senha"
          }
        ],
        buttons: [
          {
            text: "Cancelar",
            role: "cancel"
          },
          {
            text: "Ativar",
            role: "confirm"
          }
        ]
      });
      yield alert.present();
      const { role, data } = yield alert.onDidDismiss();
      const password = data?.values?.password?.trim();
      if (role !== "confirm" || !password) {
        this.biometricEnabled = false;
        return;
      }
      this.biometricSaving = true;
      const enabled = yield this.authService.enableBiometricLogin(user.email, password);
      this.biometricEnabled = enabled;
      this.biometricSaving = false;
      if (!enabled) {
        yield this.presentToast("N\xE3o foi poss\xEDvel ativar o login por biometria.");
      }
    });
  }
  refreshBiometricState() {
    return __async(this, null, function* () {
      this.biometricAvailable = yield this.authService.isBiometricAvailable();
      this.biometricEnabled = yield this.authService.isBiometricEnabled();
    });
  }
  presentToast(message) {
    return __async(this, null, function* () {
      const toast = yield this.toastController.create({
        message,
        duration: 2500,
        color: "danger",
        position: "top"
      });
      yield toast.present();
    });
  }
  static \u0275fac = function ConfiguracoesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ConfiguracoesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ConfiguracoesPage, selectors: [["app-configuracoes"]], decls: 18, vars: 5, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["fill", "solid", 3, "click"], [3, "fullscreen"], [1, "content"], ["lines", "none"], ["aria-label", "Login por digital", 3, "ionChange", "checked", "disabled"], ["color", "medium", 4, "ngIf"], ["color", "medium"], [1, "info"]], template: function ConfiguracoesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Configura\xE7\xF5es");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2)(7, "ion-button", 3);
      \u0275\u0275listener("click", function ConfiguracoesPage_Template_ion_button_click_7_listener() {
        return ctx.voltar();
      });
      \u0275\u0275text(8, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(9, "ion-content", 4)(10, "div", 5)(11, "ion-item", 6)(12, "ion-label");
      \u0275\u0275text(13, " Login por digital ");
      \u0275\u0275elementStart(14, "p");
      \u0275\u0275text(15, "Ative para entrar no aplicativo usando biometria.");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(16, "ion-toggle", 7);
      \u0275\u0275listener("ionChange", function ConfiguracoesPage_Template_ion_toggle_ionChange_16_listener($event) {
        return ctx.onBiometricToggle($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(17, ConfiguracoesPage_ion_text_17_Template, 3, 0, "ion-text", 8);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(9);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("checked", ctx.biometricEnabled)("disabled", !ctx.biometricAvailable || ctx.biometricSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.biometricAvailable);
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonToggle,
    IonText
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  padding: 12px;\n}\n.info[_ngcontent-%COMP%] {\n  margin-top: 10px;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=configuracoes.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfiguracoesPage, [{
    type: Component,
    args: [{ selector: "app-configuracoes", standalone: true, imports: [
      CommonModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonTitle,
      IonButton,
      IonContent,
      IonItem,
      IonLabel,
      IonToggle,
      IonText
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>Configura\xE7\xF5es</ion-title>\r\n    <ion-buttons slot="end">\r\n      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>\r\n    </ion-buttons>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content">\r\n    <ion-item lines="none">\r\n      <ion-label>\r\n        Login por digital\r\n        <p>Ative para entrar no aplicativo usando biometria.</p>\r\n      </ion-label>\r\n      <ion-toggle\r\n        aria-label="Login por digital"\r\n        [checked]="biometricEnabled"\r\n        [disabled]="!biometricAvailable || biometricSaving"\r\n        (ionChange)="onBiometricToggle($event)"\r\n      ></ion-toggle>\r\n    </ion-item>\r\n\r\n    <ion-text color="medium" *ngIf="!biometricAvailable">\r\n      <p class="info">Biometria n\xE3o dispon\xEDvel neste dispositivo.</p>\r\n    </ion-text>\r\n  </div>\r\n</ion-content>\r\n', styles: ["/* src/app/pages/configuracoes/configuracoes.page.scss */\n.content {\n  padding: 12px;\n}\n.info {\n  margin-top: 10px;\n  font-size: 0.9rem;\n}\n/*# sourceMappingURL=configuracoes.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ConfiguracoesPage, { className: "ConfiguracoesPage", filePath: "src/app/pages/configuracoes/configuracoes.page.ts", lineNumber: 41 });
})();
export {
  ConfiguracoesPage
};
//# sourceMappingURL=chunk-EZ5UZ4JN.js.map
