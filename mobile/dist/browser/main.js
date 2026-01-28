import {
  addIcons,
  logOutOutline
} from "./chunk-MVYH7HIC.js";
import {
  AuthService
} from "./chunk-APMN3AA5.js";
import {
  AlertController,
  CUSTOM_ELEMENTS_SCHEMA,
  CommonModule,
  Component,
  IonApp,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRouterOutlet,
  IonTitle,
  IonToggle,
  IonToolbar,
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
  ɵɵtext
} from "./chunk-XXY565TE.js";
import "./chunk-3EJ4SNN5.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor
} from "./chunk-RP3QMZ46.js";
import "./chunk-JGROTZJO.js";
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
    loadComponent: () => import("./chunk-XS5IOD6X.js").then((m) => m.LoginPage)
  },
  {
    path: "home",
    loadComponent: () => import("./chunk-EKTBRE3E.js").then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: "vistoria/inicio",
    loadComponent: () => import("./chunk-5C3B5E4Y.js").then((m) => m.VistoriaInicioPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/checklist",
    loadComponent: () => import("./chunk-NCFPIA4O.js").then((m) => m.VistoriaChecklistPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "vistoria/finalizar",
    loadComponent: () => import("./chunk-YHIBRWPB.js").then((m) => m.VistoriaFinalizarPage),
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ["vistoria_mobile:create"] }
  },
  {
    path: "**",
    redirectTo: "/login"
  }
];

// src/app/app.component.ts
function AppComponent_ion_menu_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-menu", 2)(1, "ion-header")(2, "ion-toolbar")(3, "ion-title");
    \u0275\u0275text(4, "Configura\xE7\xF5es");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(5, "ion-content", 3)(6, "ion-list", 4)(7, "ion-item", 5)(8, "ion-toggle", 6);
    \u0275\u0275listener("ionChange", function AppComponent_ion_menu_1_Template_ion_toggle_ionChange_8_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onBiometricToggle($event));
    });
    \u0275\u0275text(9, " Login por digital ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(10, "div", 7)(11, "ion-button", 8);
    \u0275\u0275listener("click", function AppComponent_ion_menu_1_Template_ion_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.logout());
    });
    \u0275\u0275element(12, "ion-icon", 9);
    \u0275\u0275text(13, " Sair ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("checked", ctx_r1.biometricEnabled)("disabled", !ctx_r1.biometricAvailable || ctx_r1.biometricSaving);
  }
}
var AppComponent = class _AppComponent {
  authService = inject(AuthService);
  alertController = inject(AlertController);
  toastController = inject(ToastController);
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
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AppComponent, selectors: [["app-root"]], decls: 3, vars: 1, consts: [["content-id", "main-content", 4, "ngIf"], ["id", "main-content"], ["content-id", "main-content"], [1, "menu-content"], [1, "menu-list"], ["lines", "none"], ["aria-label", "Login por digital", 3, "ionChange", "checked", "disabled"], [1, "menu-footer"], ["expand", "block", "color", "danger", 3, "click"], ["name", "log-out-outline", "slot", "start"]], template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-app");
      \u0275\u0275template(1, AppComponent_ion_menu_1_Template, 14, 2, "ion-menu", 0);
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
    IonContent,
    IonList,
    IonItem,
    IonToggle,
    IonButton,
    IonIcon
  ], styles: ["\n\n.menu-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.menu-list[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.menu-footer[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n/*# sourceMappingURL=app.component.css.map */"] });
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
      IonContent,
      IonList,
      IonItem,
      IonToggle,
      IonButton,
      IonIcon
    ], template: '<ion-app>\n  <ion-menu *ngIf="isAuthenticated && isNative" content-id="main-content">\n    <ion-header>\n      <ion-toolbar>\n        <ion-title>Configura\xE7\xF5es</ion-title>\n      </ion-toolbar>\n    </ion-header>\n    <ion-content class="menu-content">\n      <ion-list class="menu-list">\n        <ion-item lines="none">\n          <ion-toggle\n            aria-label="Login por digital"\n            [checked]="biometricEnabled"\n            [disabled]="!biometricAvailable || biometricSaving"\n            (ionChange)="onBiometricToggle($event)">\n            Login por digital\n          </ion-toggle>\n        </ion-item>\n      </ion-list>\n      <div class="menu-footer">\n        <ion-button\n          expand="block"\n          color="danger"\n          (click)="logout()">\n          <ion-icon name="log-out-outline" slot="start"></ion-icon>\n          Sair\n        </ion-button>\n      </div>\n    </ion-content>\n  </ion-menu>\n\n  <ion-router-outlet id="main-content"></ion-router-outlet>\n</ion-app>\n', styles: ["/* src/app/app.component.scss */\n.menu-content {\n  display: flex;\n  flex-direction: column;\n}\n.menu-list {\n  flex: 1;\n}\n.menu-footer {\n  padding: 16px;\n}\n/*# sourceMappingURL=app.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AppComponent, { className: "AppComponent", filePath: "src/app/app.component.ts", lineNumber: 45 });
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
      mode: "md"
      // ou 'ios' dependendo do seu caso
    })
  ]
}).catch((err) => console.error(err));
//# sourceMappingURL=main.js.map
