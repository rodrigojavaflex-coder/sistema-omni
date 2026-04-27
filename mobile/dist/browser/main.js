import {
  VistoriaFlowService
} from "./chunk-E32UKBIK.js";
import {
  addIcons,
  clipboardOutline,
  informationCircleOutline,
  logOutOutline,
  playCircleOutline,
  settingsOutline
} from "./chunk-C5VNYMLZ.js";
import {
  AuthService
} from "./chunk-SUV23HSM.js";
import "./chunk-3HI66MTA.js";
import {
  AlertController,
  CUSTOM_ELEMENTS_SCHEMA,
  CommonModule,
  Component,
  IonApp,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  MenuController,
  NgIf,
  Router,
  bootstrapApplication,
  catchError,
  from,
  inject,
  provideHttpClient,
  provideIonicAngular,
  provideRouter,
  setClassMetadata,
  switchMap,
  throwError,
  withInterceptors,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
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
} from "./chunk-37Y5E3Q6.js";
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

// src/app/guards/auth.guard.ts
var authGuard = (route, state) => __async(null, null, function* () {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    const biometricEnabled = yield authService.isBiometricEnabled();
    if (!biometricEnabled) {
      return true;
    }
    const unlocked = yield authService.requireBiometricUnlock();
    if (unlocked) {
      return true;
    }
    yield authService.lockSession();
    router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
  router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
  return false;
});

// src/app/guards/permission.guard.ts
var permissionGuard = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const required = route.data?.["permissions"] ?? [];
  if (!authService.isAuthenticated()) {
    router.navigate(["/login"]);
    return false;
  }
  if (authService.hasAnyPermission(required)) {
    return true;
  }
  router.navigate(["/home"]);
  return false;
};

// src/app/app.routes.ts
var routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  {
    path: "login",
    loadComponent: () => import("./chunk-CHQDUJSO.js").then((m) => m.LoginPage)
  },
  {
    path: "home",
    loadComponent: () => import("./chunk-KMMELWE3.js").then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: "configuracoes",
    loadComponent: () => import("./chunk-TNURA5ZM.js").then((m) => m.ConfiguracoesPage),
    canActivate: [authGuard]
  },
  {
    path: "sobre",
    loadComponent: () => import("./chunk-PLJWLVKG.js").then((m) => m.SobrePage),
    canActivate: [authGuard]
  },
  {
    path: "vistoria/inicio",
    loadComponent: () => import("./chunk-JSPO5AOC.js").then((m) => m.VistoriaInicioPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/areas",
    loadComponent: () => import("./chunk-D3QHE6KS.js").then((m) => m.VistoriaAreasPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/areas/:areaId",
    loadComponent: () => import("./chunk-IVEGCFLW.js").then((m) => m.VistoriaComponentesPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/areas/:areaId/componentes/:componenteId",
    loadComponent: () => import("./chunk-VP53DUKW.js").then((m) => m.VistoriaIrregularidadePage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/finalizar",
    loadComponent: () => import("./chunk-MXDHNRM2.js").then((m) => m.VistoriaFinalizarPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/pendencias-veiculo",
    loadComponent: () => import("./chunk-3JHWZYWV.js").then((m) => m.VistoriaHistoricoVeiculoPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_web_historico_veiculo:read"] }
  },
  {
    path: "vistoria/historico-veiculo",
    redirectTo: "vistoria/pendencias-veiculo",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "/login"
  }
];

// src/app/app.component.ts
function AppComponent_ion_menu_1_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17)(1, "div", 18)(2, "div", 19);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 20)(5, "h1");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 21)(10, "div", 22)(11, "span", 23);
    \u0275\u0275text(12, "Perfil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 24);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 22)(16, "span", 23);
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 25);
    \u0275\u0275text(19);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.user.nome.slice(0, 1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Ol\xE1, ", ctx_r1.user.nome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.user.email);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.profileDisplayName);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("active", ctx_r1.userAtivo);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.userAtivo ? "Ativo" : "Inativo", " ");
  }
}
function AppComponent_ion_menu_1_ion_item_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 10);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_ion_item_10_Template_ion_item_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goTo("/vistoria/inicio"));
    });
    \u0275\u0275element(1, "ion-icon", 26);
    \u0275\u0275elementStart(2, "ion-label", 12);
    \u0275\u0275text(3, "Iniciar vistoria");
    \u0275\u0275elementEnd()();
  }
}
function AppComponent_ion_menu_1_ion_item_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 10);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_ion_item_11_Template_ion_item_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goTo("/vistoria/areas"));
    });
    \u0275\u0275element(1, "ion-icon", 26);
    \u0275\u0275elementStart(2, "ion-label", 12);
    \u0275\u0275text(3, "Continuar vistoria");
    \u0275\u0275elementEnd()();
  }
}
function AppComponent_ion_menu_1_ion_item_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 10);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_ion_item_12_Template_ion_item_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.goTo("/vistoria/pendencias-veiculo", { fromMenu: true }));
    });
    \u0275\u0275element(1, "ion-icon", 27);
    \u0275\u0275elementStart(2, "ion-label", 12);
    \u0275\u0275text(3, "Pend\xEAncias do Ve\xEDculo");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("menu-item-disabled", ctx_r1.hasVistoriaEmAndamento);
  }
}
function AppComponent_ion_menu_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-menu", 2)(1, "ion-header")(2, "ion-toolbar");
    \u0275\u0275element(3, "ion-title");
    \u0275\u0275elementStart(4, "ion-buttons", 3)(5, "ion-button", 4);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharMenu());
    });
    \u0275\u0275text(6, "x");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(7, "ion-content", 5);
    \u0275\u0275template(8, AppComponent_ion_menu_1_div_8_Template, 20, 7, "div", 6);
    \u0275\u0275elementStart(9, "ion-list", 7);
    \u0275\u0275template(10, AppComponent_ion_menu_1_ion_item_10_Template, 4, 0, "ion-item", 8)(11, AppComponent_ion_menu_1_ion_item_11_Template, 4, 0, "ion-item", 8)(12, AppComponent_ion_menu_1_ion_item_12_Template, 4, 2, "ion-item", 9);
    \u0275\u0275elementStart(13, "ion-item", 10);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_item_click_13_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goTo("/configuracoes"));
    });
    \u0275\u0275element(14, "ion-icon", 11);
    \u0275\u0275elementStart(15, "ion-label", 12);
    \u0275\u0275text(16, "Configura\xE7\xF5es");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "ion-item", 10);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_item_click_17_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.goTo("/sobre"));
    });
    \u0275\u0275element(18, "ion-icon", 13);
    \u0275\u0275elementStart(19, "ion-label", 12);
    \u0275\u0275text(20, "Sobre");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 14)(22, "ion-button", 15);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_button_click_22_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275element(23, "ion-icon", 16);
    \u0275\u0275text(24, " Sair ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("ngIf", ctx_r1.user);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.canStartVistoria && !ctx_r1.hasVistoriaEmAndamento);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.canStartVistoria && ctx_r1.hasVistoriaEmAndamento);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.canViewHistoricoVeiculo);
    \u0275\u0275advance();
    \u0275\u0275classProp("menu-item-disabled", ctx_r1.hasVistoriaEmAndamento);
    \u0275\u0275advance(4);
    \u0275\u0275classProp("menu-item-disabled", ctx_r1.hasVistoriaEmAndamento);
  }
}
var AppComponent = class _AppComponent {
  authService = inject(AuthService);
  flowService = inject(VistoriaFlowService);
  router = inject(Router);
  alertController = inject(AlertController);
  menuController = inject(MenuController);
  fecharMenu() {
    this.menuController.close();
  }
  user = null;
  isAuthenticated = false;
  isNative = Capacitor.getPlatform() !== "web";
  get canViewHistoricoVeiculo() {
    return this.authService.hasPermission("vistoria_web_historico_veiculo:read");
  }
  get canStartVistoria() {
    return this.authService.hasPermission("vistoria_mobile:create");
  }
  get hasVistoriaEmAndamento() {
    return Boolean(this.flowService.getVistoriaId());
  }
  get profileDisplayName() {
    const perfis = this.getUserProfiles();
    if (perfis.length === 0) {
      return "Sem perfil";
    }
    return perfis.map((perfil) => perfil.nomePerfil).filter(Boolean).join(", ");
  }
  get userAtivo() {
    if (!this.user) {
      return false;
    }
    if (typeof this.user.ativo === "boolean") {
      return this.user.ativo;
    }
    return (this.user.status ?? "").toUpperCase() === "ATIVO";
  }
  constructor() {
    addIcons({
      logOutOutline,
      settingsOutline,
      clipboardOutline,
      informationCircleOutline,
      playCircleOutline
    });
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }
  goTo(route, state) {
    return __async(this, null, function* () {
      if (this.hasVistoriaEmAndamento && (route === "/vistoria/pendencias-veiculo" || route === "/configuracoes" || route === "/sobre")) {
        return;
      }
      yield this.menuController.close();
      yield this.router.navigate([route], state ? { state } : void 0);
    });
  }
  logout() {
    return __async(this, null, function* () {
      const alert = yield this.alertController.create({
        header: "Sair do aplicativo",
        message: "Deseja realmente sair?",
        buttons: [
          {
            text: "Cancelar",
            role: "cancel"
          },
          {
            text: "Sair",
            role: "confirm"
          }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role !== "confirm") {
        return;
      }
      yield this.authService.logout();
    });
  }
  getUserProfiles() {
    if (!this.user) {
      return [];
    }
    if (Array.isArray(this.user.perfis) && this.user.perfis.length > 0) {
      return this.user.perfis;
    }
    if (this.user.perfil) {
      return [this.user.perfil];
    }
    return [];
  }
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 3, vars: 1, consts: [["content-id", "main-content", 4, "ngIf"], ["id", "main-content"], ["content-id", "main-content"], ["slot", "end"], [3, "click"], [1, "menu-content"], ["class", "profile-card", 4, "ngIf"], [1, "menu-list"], ["lines", "none", "button", "", "detail", "true", "class", "menu-item", 3, "click", 4, "ngIf"], ["lines", "none", "button", "", "detail", "true", "class", "menu-item", 3, "menu-item-disabled", "click", 4, "ngIf"], ["lines", "none", "button", "", "detail", "true", 1, "menu-item", 3, "click"], ["name", "settings-outline", "slot", "start", 1, "menu-item-icon"], [1, "menu-item-label"], ["name", "information-circle-outline", "slot", "start", 1, "menu-item-icon"], [1, "menu-footer"], ["expand", "block", "color", "danger", 3, "click"], ["name", "log-out-outline", "slot", "start"], [1, "profile-card"], [1, "profile-header"], [1, "avatar"], [1, "profile-title"], [1, "profile-details"], [1, "detail-row"], [1, "detail-label"], [1, "detail-value"], [1, "detail-badge"], ["name", "play-circle-outline", "slot", "start", 1, "menu-item-icon"], ["name", "clipboard-outline", "slot", "start", 1, "menu-item-icon"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-app");
      \u0275\u0275template(1, AppComponent_ion_menu_1_Template, 25, 8, "ion-menu", 0);
      \u0275\u0275element(2, "ion-router-outlet", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isAuthenticated && ctx.isNative);
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    IonApp,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonList,
    IonItem,
    IonButton,
    IonIcon
  ], styles: ["\n\n.menu-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n.profile-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 16px;\n  margin: 12px 12px 4px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);\n}\n.profile-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background: #1d4ed8;\n  color: #ffffff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: 700;\n}\n.profile-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 4px 0;\n  font-size: 18px;\n  color: #0f172a;\n}\n.profile-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 13px;\n}\n.profile-details[_ngcontent-%COMP%] {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 10px;\n}\n.detail-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 6px 0;\n}\n.detail-label[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 13px;\n}\n.detail-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #0f172a;\n}\n.detail-badge[_ngcontent-%COMP%] {\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  background: #e2e8f0;\n  color: #475569;\n}\n.detail-badge.active[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.menu-list[_ngcontent-%COMP%] {\n  flex: 1;\n  padding: 8px 10px 0;\n  border-top: 1px solid #e2e8f0;\n}\n.menu-item[_ngcontent-%COMP%] {\n  --background: #ffffff;\n  --border-radius: 12px;\n  --padding-start: 12px;\n  --inner-padding-end: 8px;\n  --min-height: 46px;\n  margin: 6px 0;\n  border: 1px solid #e2e8f0;\n}\n.menu-item.item-disabled[_ngcontent-%COMP%] {\n  opacity: 0.55;\n}\n.menu-item-icon[_ngcontent-%COMP%] {\n  color: #1d4ed8;\n  font-size: 18px;\n  margin-right: 8px;\n}\n.menu-item-label[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: #0f172a;\n}\n.menu-item.menu-item-disabled[_ngcontent-%COMP%] {\n  opacity: 0.45;\n  pointer-events: none;\n}\n.menu-footer[_ngcontent-%COMP%] {\n  padding: 16px;\n  margin-top: auto;\n  background:\n    linear-gradient(\n      to top,\n      #ffffff 75%,\n      rgba(255, 255, 255, 0));\n}\n/*# sourceMappingURL=app.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AppComponent, [{
    type: Component,
    args: [{ selector: "app-root", standalone: true, schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [
      CommonModule,
      IonApp,
      IonRouterOutlet,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonButtons,
      IonContent,
      IonList,
      IonItem,
      IonButton,
      IonIcon
    ], template: `<ion-app>
  <ion-menu *ngIf="isAuthenticated && isNative" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fecharMenu()">x</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="menu-content">
      <div class="profile-card" *ngIf="user">
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
            <span class="detail-value">{{ profileDisplayName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="detail-badge" [class.active]="userAtivo">
              {{ userAtivo ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
        </div>
      </div>

      <ion-list class="menu-list">
        <ion-item
          *ngIf="canStartVistoria && !hasVistoriaEmAndamento"
          lines="none"
          button
          detail="true"
          class="menu-item"
          (click)="goTo('/vistoria/inicio')"
        >
          <ion-icon name="play-circle-outline" slot="start" class="menu-item-icon"></ion-icon>
          <ion-label class="menu-item-label">Iniciar vistoria</ion-label>
        </ion-item>
        <ion-item
          *ngIf="canStartVistoria && hasVistoriaEmAndamento"
          lines="none"
          button
          detail="true"
          class="menu-item"
          (click)="goTo('/vistoria/areas')"
        >
          <ion-icon name="play-circle-outline" slot="start" class="menu-item-icon"></ion-icon>
          <ion-label class="menu-item-label">Continuar vistoria</ion-label>
        </ion-item>
        <ion-item
          *ngIf="canViewHistoricoVeiculo"
          lines="none"
          button
          detail="true"
          class="menu-item"
          [class.menu-item-disabled]="hasVistoriaEmAndamento"
          (click)="goTo('/vistoria/pendencias-veiculo', { fromMenu: true })"
        >
          <ion-icon name="clipboard-outline" slot="start" class="menu-item-icon"></ion-icon>
          <ion-label class="menu-item-label">Pend\xEAncias do Ve\xEDculo</ion-label>
        </ion-item>
        <ion-item
          lines="none"
          button
          detail="true"
          class="menu-item"
          [class.menu-item-disabled]="hasVistoriaEmAndamento"
          (click)="goTo('/configuracoes')"
        >
          <ion-icon name="settings-outline" slot="start" class="menu-item-icon"></ion-icon>
          <ion-label class="menu-item-label">Configura\xE7\xF5es</ion-label>
        </ion-item>
        <ion-item
          lines="none"
          button
          detail="true"
          class="menu-item"
          [class.menu-item-disabled]="hasVistoriaEmAndamento"
          (click)="goTo('/sobre')"
        >
          <ion-icon name="information-circle-outline" slot="start" class="menu-item-icon"></ion-icon>
          <ion-label class="menu-item-label">Sobre</ion-label>
        </ion-item>
      </ion-list>
      <div class="menu-footer">
        <ion-button
          expand="block"
          color="danger"
          (click)="logout()">
          <ion-icon name="log-out-outline" slot="start"></ion-icon>
          Sair
        </ion-button>
      </div>
    </ion-content>
  </ion-menu>

  <ion-router-outlet id="main-content"></ion-router-outlet>
</ion-app>
`, styles: ["/* src/app/app.component.scss */\n.menu-content {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n.profile-card {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 16px;\n  margin: 12px 12px 4px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);\n}\n.profile-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.avatar {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background: #1d4ed8;\n  color: #ffffff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: 700;\n}\n.profile-title h1 {\n  margin: 0 0 4px 0;\n  font-size: 18px;\n  color: #0f172a;\n}\n.profile-title p {\n  margin: 0;\n  color: #64748b;\n  font-size: 13px;\n}\n.profile-details {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 10px;\n}\n.detail-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 6px 0;\n}\n.detail-label {\n  color: #475569;\n  font-size: 13px;\n}\n.detail-value {\n  font-weight: 600;\n  color: #0f172a;\n}\n.detail-badge {\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  background: #e2e8f0;\n  color: #475569;\n}\n.detail-badge.active {\n  background: #dcfce7;\n  color: #15803d;\n}\n.menu-list {\n  flex: 1;\n  padding: 8px 10px 0;\n  border-top: 1px solid #e2e8f0;\n}\n.menu-item {\n  --background: #ffffff;\n  --border-radius: 12px;\n  --padding-start: 12px;\n  --inner-padding-end: 8px;\n  --min-height: 46px;\n  margin: 6px 0;\n  border: 1px solid #e2e8f0;\n}\n.menu-item.item-disabled {\n  opacity: 0.55;\n}\n.menu-item-icon {\n  color: #1d4ed8;\n  font-size: 18px;\n  margin-right: 8px;\n}\n.menu-item-label {\n  font-weight: 500;\n  color: #0f172a;\n}\n.menu-item.menu-item-disabled {\n  opacity: 0.45;\n  pointer-events: none;\n}\n.menu-footer {\n  padding: 16px;\n  margin-top: auto;\n  background:\n    linear-gradient(\n      to top,\n      #ffffff 75%,\n      rgba(255, 255, 255, 0));\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 53 });
})();

// src/app/interceptors/auth.interceptor.ts
var authInterceptor = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (req.url.includes("/auth/login") || req.url.includes("/auth/refresh")) {
    return next(req);
  }
  return from(authService.getAccessToken()).pipe(switchMap((token) => {
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next(req).pipe(catchError((error) => {
      if (error.status === 401) {
        return from(authService.refreshAccessToken()).pipe(switchMap((newToken) => {
          if (newToken) {
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(newReq);
          } else {
            authService.logout();
            return throwError(() => error);
          }
        }), catchError(() => {
          authService.logout();
          return throwError(() => error);
        }));
      }
      return throwError(() => error);
    }));
  }));
};

// src/main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIonicAngular({
      mode: "md",
      // ou 'ios' dependendo do seu caso
      // Permite renderizar HTML (ex.: <strong>, <br>) em mensagens de AlertController.
      innerHTMLTemplatesEnabled: true
    })
  ]
}).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
