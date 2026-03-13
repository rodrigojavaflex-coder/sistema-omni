import {
  addIcons,
  logOutOutline
} from "./chunk-DYQN65YV.js";
import {
  AlertController,
  AuthService,
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
  IonToggle,
  IonToolbar,
  MenuController,
  NgIf,
  Router,
  ToastController,
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
} from "./chunk-KKQO7KIV.js";
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
    loadComponent: () => import("./chunk-ZPGGKOJV.js").then((m) => m.LoginPage)
  },
  {
    path: "home",
    loadComponent: () => import("./chunk-CJSI5HAH.js").then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: "vistoria/inicio",
    loadComponent: () => import("./chunk-7NUWT6CM.js").then((m) => m.VistoriaInicioPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/areas",
    loadComponent: () => import("./chunk-6FRK5O5J.js").then((m) => m.VistoriaAreasPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/areas/:areaId",
    loadComponent: () => import("./chunk-TXDBYE4W.js").then((m) => m.VistoriaComponentesPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/areas/:areaId/componentes/:componenteId",
    loadComponent: () => import("./chunk-YLJBK4PD.js").then((m) => m.VistoriaIrregularidadePage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/finalizar",
    loadComponent: () => import("./chunk-NNWADHTK.js").then((m) => m.VistoriaFinalizarPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "**",
    redirectTo: "/login"
  }
];

// src/app/app.component.ts
function AppComponent_ion_menu_1_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14)(2, "div", 15);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 16)(5, "h1");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 17)(10, "div", 18)(11, "span", 19);
    \u0275\u0275text(12, "Perfil");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 20);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(15, "div", 18)(16, "span", 19);
    \u0275\u0275text(17, "Status");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "span", 21);
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
    \u0275\u0275textInterpolate(ctx_r1.user.perfil.nomePerfil || "Sem perfil");
    \u0275\u0275advance(4);
    \u0275\u0275classProp("active", ctx_r1.user.ativo);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.user.ativo ? "Ativo" : "Inativo", " ");
  }
}
function AppComponent_ion_menu_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-menu", 2)(1, "ion-header")(2, "ion-toolbar")(3, "ion-title");
    \u0275\u0275text(4, "Configura\xE7\xF5es");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-buttons", 3)(6, "ion-button", 4);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharMenu());
    });
    \u0275\u0275text(7, "Fechar");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(8, "ion-content", 5);
    \u0275\u0275template(9, AppComponent_ion_menu_1_div_9_Template, 20, 7, "div", 6);
    \u0275\u0275elementStart(10, "ion-list", 7)(11, "ion-item", 8)(12, "ion-toggle", 9);
    \u0275\u0275listener("ionChange", function AppComponent_ion_menu_1_Template_ion_toggle_ionChange_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBiometricToggle($event));
    });
    \u0275\u0275text(13, " Login por digital ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(14, "div", 10)(15, "ion-button", 11);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_button_click_15_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275element(16, "ion-icon", 12);
    \u0275\u0275text(17, " Sair ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(9);
    \u0275\u0275property("ngIf", ctx_r1.user);
    \u0275\u0275advance(3);
    \u0275\u0275property("checked", ctx_r1.biometricEnabled)("disabled", !ctx_r1.biometricAvailable || ctx_r1.biometricSaving);
  }
}
var AppComponent = class _AppComponent {
  authService = inject(AuthService);
  alertController = inject(AlertController);
  toastController = inject(ToastController);
  menuController = inject(MenuController);
  fecharMenu() {
    this.menuController.close();
  }
  user = null;
  isAuthenticated = false;
  isNative = Capacitor.getPlatform() !== "web";
  biometricAvailable = false;
  biometricEnabled = false;
  biometricSaving = false;
  constructor() {
    addIcons({ logOutOutline });
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.refreshBiometricState();
      } else {
        this.biometricAvailable = false;
        this.biometricEnabled = false;
      }
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
      if (!this.user?.email) {
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
      const enabled = yield this.authService.enableBiometricLogin(this.user.email, password);
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
  static \u0275fac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AppComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 3, vars: 1, consts: [["content-id", "main-content", 4, "ngIf"], ["id", "main-content"], ["content-id", "main-content"], ["slot", "end"], [3, "click"], [1, "menu-content"], ["class", "profile-card", 4, "ngIf"], [1, "menu-list"], ["lines", "none"], ["aria-label", "Login por digital", 3, "ionChange", "checked", "disabled"], [1, "menu-footer"], ["expand", "block", "color", "danger", 3, "click"], ["name", "log-out-outline", "slot", "start"], [1, "profile-card"], [1, "profile-header"], [1, "avatar"], [1, "profile-title"], [1, "profile-details"], [1, "detail-row"], [1, "detail-label"], [1, "detail-value"], [1, "detail-badge"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-app");
      \u0275\u0275template(1, AppComponent_ion_menu_1_Template, 18, 3, "ion-menu", 0);
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
    IonToggle,
    IonButton,
    IonIcon
  ], styles: ["\n\n.menu-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.profile-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 16px;\n  margin: 12px 12px 4px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);\n}\n.profile-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.avatar[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background: #1d4ed8;\n  color: #ffffff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: 700;\n}\n.profile-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0 0 4px 0;\n  font-size: 18px;\n  color: #0f172a;\n}\n.profile-title[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 13px;\n}\n.profile-details[_ngcontent-%COMP%] {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 10px;\n}\n.detail-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 6px 0;\n}\n.detail-label[_ngcontent-%COMP%] {\n  color: #475569;\n  font-size: 13px;\n}\n.detail-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #0f172a;\n}\n.detail-badge[_ngcontent-%COMP%] {\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  background: #e2e8f0;\n  color: #475569;\n}\n.detail-badge.active[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #15803d;\n}\n.menu-list[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.menu-footer[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
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
      IonToggle,
      IonButton,
      IonIcon
    ], template: `<ion-app>
  <ion-menu *ngIf="isAuthenticated && isNative" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Configura\xE7\xF5es</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="fecharMenu()">Fechar</ion-button>
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

      <ion-list class="menu-list">
        <ion-item lines="none">
          <ion-toggle
            aria-label="Login por digital"
            [checked]="biometricEnabled"
            [disabled]="!biometricAvailable || biometricSaving"
            (ionChange)="onBiometricToggle($event)">
            Login por digital
          </ion-toggle>
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
`, styles: ["/* src/app/app.component.scss */\n.menu-content {\n  display: flex;\n  flex-direction: column;\n}\n.profile-card {\n  background: #ffffff;\n  border-radius: 16px;\n  padding: 16px;\n  margin: 12px 12px 4px;\n  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);\n}\n.profile-header {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.avatar {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background: #1d4ed8;\n  color: #ffffff;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 20px;\n  font-weight: 700;\n}\n.profile-title h1 {\n  margin: 0 0 4px 0;\n  font-size: 18px;\n  color: #0f172a;\n}\n.profile-title p {\n  margin: 0;\n  color: #64748b;\n  font-size: 13px;\n}\n.profile-details {\n  border-top: 1px solid #e2e8f0;\n  padding-top: 10px;\n}\n.detail-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 6px 0;\n}\n.detail-label {\n  color: #475569;\n  font-size: 13px;\n}\n.detail-value {\n  font-weight: 600;\n  color: #0f172a;\n}\n.detail-badge {\n  padding: 4px 10px;\n  border-radius: 999px;\n  font-size: 12px;\n  background: #e2e8f0;\n  color: #475569;\n}\n.detail-badge.active {\n  background: #dcfce7;\n  color: #15803d;\n}\n.menu-list {\n  flex: 1;\n}\n.menu-footer {\n  padding: 16px;\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 48 });
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
