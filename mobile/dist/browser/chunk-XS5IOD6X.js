import {
  addIcons,
  fingerPrintOutline
} from "./chunk-MVYH7HIC.js";
import {
  AuthService
} from "./chunk-APMN3AA5.js";
import {
  AlertController,
  CommonModule,
  Component,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  IonContent,
  IonIcon,
  IonSpinner,
  NgControlStatus,
  NgControlStatusGroup,
  NgIf,
  ReactiveFormsModule,
  RequiredValidator,
  Router,
  ToastController,
  Validators,
  inject,
  setClassMetadata,
  ɵNgNoValidate,
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
  ɵɵtextInterpolate1
} from "./chunk-XXY565TE.js";
import "./chunk-3EJ4SNN5.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-RP3QMZ46.js";
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

// src/app/pages/login/login.page.ts
function LoginPage_div_13_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Email \xE9 obrigat\xF3rio");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_div_13_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Email inv\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275template(1, LoginPage_div_13_span_1_Template, 2, 0, "span", 18)(2, LoginPage_div_13_span_2_Template, 2, 0, "span", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.loginForm.get("email")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.loginForm.get("email")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["email"]);
  }
}
function LoginPage_div_18_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Senha \xE9 obrigat\xF3ria");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_div_18_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Senha muito curta");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275template(1, LoginPage_div_18_span_1_Template, 2, 0, "span", 18)(2, LoginPage_div_18_span_2_Template, 2, 0, "span", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    let tmp_2_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_1_0 = ctx_r0.loginForm.get("password")) == null ? null : tmp_1_0.errors == null ? null : tmp_1_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_2_0 = ctx_r0.loginForm.get("password")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["minlength"]);
  }
}
function LoginPage_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.errorMessage, " ");
  }
}
function LoginPage_span_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275text(1, "Entrar");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_span_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275element(1, "ion-spinner", 21);
    \u0275\u0275text(2, " Entrando... ");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_button_23_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275element(1, "ion-icon", 23);
    \u0275\u0275text(2, " Entrar com digital ");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_button_23_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275element(1, "ion-spinner", 21);
    \u0275\u0275text(2, " Verificando... ");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_button_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function LoginPage_button_23_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onBiometricLogin());
    });
    \u0275\u0275template(1, LoginPage_button_23_span_1_Template, 3, 0, "span", 15)(2, LoginPage_button_23_span_2_Template, 3, 0, "span", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.isBiometricLoading || ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isBiometricLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isBiometricLoading);
  }
}
var LoginPage = class _LoginPage {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  toastController = inject(ToastController);
  alertController = inject(AlertController);
  loginForm;
  isLoading = false;
  isBiometricLoading = false;
  errorMessage = "";
  biometricAvailable = false;
  biometricEnabled = false;
  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
    addIcons({ fingerPrintOutline });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.refreshBiometricState();
    });
  }
  ionViewWillEnter() {
    this.loginForm.reset({ email: "", password: "" });
    this.errorMessage = "";
    this.isLoading = false;
    this.isBiometricLoading = false;
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.loginForm.invalid) {
        return;
      }
      this.isLoading = true;
      this.errorMessage = "";
      this.loginForm.disable();
      try {
        const { email, password } = this.loginForm.value;
        yield this.authService.login(email, password, { navigate: false });
        yield this.maybeEnableBiometrics(email, password);
        this.router.navigate(["/home"]);
      } catch (error) {
        this.errorMessage = error.message || "Erro ao fazer login";
        const toast = yield this.toastController.create({
          message: this.errorMessage,
          duration: 3e3,
          color: "danger",
          position: "top"
        });
        yield toast.present();
      } finally {
        this.isLoading = false;
        this.loginForm.enable();
      }
    });
  }
  onBiometricLogin() {
    return __async(this, null, function* () {
      if (this.isBiometricLoading || this.isLoading) {
        return;
      }
      this.isBiometricLoading = true;
      this.errorMessage = "";
      try {
        yield this.authService.loginWithBiometrics();
        this.router.navigate(["/home"]);
      } catch (error) {
        this.errorMessage = error.message || "Erro ao autenticar com biometria";
        const toast = yield this.toastController.create({
          message: this.errorMessage,
          duration: 3e3,
          color: "danger",
          position: "top"
        });
        yield toast.present();
      } finally {
        this.isBiometricLoading = false;
      }
    });
  }
  refreshBiometricState() {
    return __async(this, null, function* () {
      this.biometricAvailable = yield this.authService.isBiometricAvailable();
      this.biometricEnabled = yield this.authService.isBiometricEnabled();
    });
  }
  maybeEnableBiometrics(email, password) {
    return __async(this, null, function* () {
      yield this.refreshBiometricState();
      if (!this.biometricAvailable || this.biometricEnabled) {
        return;
      }
      const alert = yield this.alertController.create({
        header: "Ativar login por digital?",
        message: "Voc\xEA poder\xE1 entrar mais r\xE1pido usando a biometria.",
        buttons: [
          {
            text: "Agora n\xE3o",
            role: "cancel"
          },
          {
            text: "Ativar",
            role: "confirm"
          }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role === "confirm") {
        const enabled = yield this.authService.enableBiometricLogin(email, password);
        this.biometricEnabled = enabled;
      }
    });
  }
  static \u0275fac = function LoginPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginPage, selectors: [["app-login"]], decls: 24, vars: 13, consts: [[3, "fullscreen"], [1, "login-wrapper"], [1, "login-card"], [1, "login-header"], [1, "login-title"], [1, "login-subtitle"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "input-group"], ["type", "email", "id", "email", "formControlName", "email", "placeholder", "Email", "required", "", 1, "form-input"], ["for", "email", 1, "form-label"], ["class", "error-message", 4, "ngIf"], ["type", "password", "id", "password", "formControlName", "password", "placeholder", "Senha", "required", "", 1, "form-input"], ["for", "password", 1, "form-label"], ["class", "alert-error", 4, "ngIf"], ["type", "submit", 1, "login-button", 3, "disabled"], ["class", "button-text", 4, "ngIf"], ["type", "button", "class", "biometric-button", 3, "disabled", "click", 4, "ngIf"], [1, "error-message"], [4, "ngIf"], [1, "alert-error"], [1, "button-text"], ["name", "crescent"], ["type", "button", 1, "biometric-button", 3, "click", "disabled"], ["name", "finger-print-outline"]], template: function LoginPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-content", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4);
      \u0275\u0275text(5, "Bem-vindo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "p", 5);
      \u0275\u0275text(7, "Entre com suas credenciais");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "form", 6);
      \u0275\u0275listener("ngSubmit", function LoginPage_Template_form_ngSubmit_8_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(9, "div", 7);
      \u0275\u0275element(10, "input", 8);
      \u0275\u0275elementStart(11, "label", 9);
      \u0275\u0275text(12, "Email");
      \u0275\u0275elementEnd();
      \u0275\u0275template(13, LoginPage_div_13_Template, 3, 2, "div", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "div", 7);
      \u0275\u0275element(15, "input", 11);
      \u0275\u0275elementStart(16, "label", 12);
      \u0275\u0275text(17, "Senha");
      \u0275\u0275elementEnd();
      \u0275\u0275template(18, LoginPage_div_18_Template, 3, 2, "div", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275template(19, LoginPage_div_19_Template, 2, 1, "div", 13);
      \u0275\u0275elementStart(20, "button", 14);
      \u0275\u0275template(21, LoginPage_span_21_Template, 2, 0, "span", 15)(22, LoginPage_span_22_Template, 3, 0, "span", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275template(23, LoginPage_button_23_Template, 3, 3, "button", 16);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      let tmp_2_0;
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(8);
      \u0275\u0275property("formGroup", ctx.loginForm);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("error", ((tmp_2_0 = ctx.loginForm.get("email")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.loginForm.get("email")) == null ? null : tmp_2_0.touched));
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ((tmp_3_0 = ctx.loginForm.get("email")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.loginForm.get("email")) == null ? null : tmp_3_0.touched));
      \u0275\u0275advance(2);
      \u0275\u0275classProp("error", ((tmp_4_0 = ctx.loginForm.get("password")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.loginForm.get("password")) == null ? null : tmp_4_0.touched));
      \u0275\u0275advance(3);
      \u0275\u0275property("ngIf", ((tmp_5_0 = ctx.loginForm.get("password")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx.loginForm.get("password")) == null ? null : tmp_5_0.touched));
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.loginForm.invalid || ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.biometricAvailable && ctx.biometricEnabled);
    }
  }, dependencies: [
    CommonModule,
    NgIf,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    IonContent,
    IonSpinner,
    IonIcon
  ], styles: ['\n\n.login-wrapper[_ngcontent-%COMP%] {\n  padding: 1rem;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid #e2e8f0;\n  box-sizing: border-box;\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #1a202c;\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: #ffffff;\n  color: #1a202c;\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.form-input.error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  background: #3b82f6;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2563eb;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.biometric-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid #3b82f6;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: #ffffff;\n  color: #1d4ed8;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #2563eb;\n  color: #2563eb;\n  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.15);\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n}\n/*# sourceMappingURL=login.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoginPage, [{
    type: Component,
    args: [{ selector: "app-login", standalone: true, imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonContent,
      IonSpinner,
      IonIcon
    ], template: `<ion-content [fullscreen]="true">
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">Bem-vindo</h1>
        <p class="login-subtitle">Entre com suas credenciais</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="input-group">
          <input
            type="email"
            id="email"
            formControlName="email"
            class="form-input"
            [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            placeholder="Email"
            required>
          <label for="email" class="form-label">Email</label>
          <div class="error-message" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            <span *ngIf="loginForm.get('email')?.errors?.['required']">Email \xE9 obrigat\xF3rio</span>
            <span *ngIf="loginForm.get('email')?.errors?.['email']">Email inv\xE1lido</span>
          </div>
        </div>

        <div class="input-group">
          <input
            type="password"
            id="password"
            formControlName="password"
            class="form-input"
            [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            placeholder="Senha"
            required>
          <label for="password" class="form-label">Senha</label>
          <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            <span *ngIf="loginForm.get('password')?.errors?.['required']">Senha \xE9 obrigat\xF3ria</span>
            <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Senha muito curta</span>
          </div>
        </div>

        <div class="alert-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          [disabled]="loginForm.invalid || isLoading">
          <span class="button-text" *ngIf="!isLoading">Entrar</span>
          <span class="button-text" *ngIf="isLoading">
            <ion-spinner name="crescent"></ion-spinner>
            Entrando...
          </span>
        </button>

        <button
          *ngIf="biometricAvailable && biometricEnabled"
          type="button"
          class="biometric-button"
          [disabled]="isBiometricLoading || isLoading"
          (click)="onBiometricLogin()">
          <span class="button-text" *ngIf="!isBiometricLoading">
            <ion-icon name="finger-print-outline"></ion-icon>
            Entrar com digital
          </span>
          <span class="button-text" *ngIf="isBiometricLoading">
            <ion-spinner name="crescent"></ion-spinner>
            Verificando...
          </span>
        </button>
      </form>
    </div>
  </div>
</ion-content>
`, styles: ['/* src/app/pages/login/login.page.scss */\n.login-wrapper {\n  padding: 1rem;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card {\n  background: #ffffff;\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid #e2e8f0;\n  box-sizing: border-box;\n  animation: fadeInUp 0.5s ease-out;\n}\n.login-header {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #1a202c;\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle {\n  color: #64748b;\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group {\n  position: relative;\n  width: 100%;\n}\n.form-input {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: #ffffff;\n  color: #1a202c;\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.form-input.error {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button {\n  width: 100%;\n  padding: 0.8rem;\n  background: #3b82f6;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button:hover:not(:disabled) {\n  background: #2563eb;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.biometric-button {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid #3b82f6;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: #ffffff;\n  color: #1d4ed8;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button:hover:not(:disabled) {\n  border-color: #2563eb;\n  color: #2563eb;\n  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.15);\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title {\n    font-size: 1.35rem;\n  }\n}\n/*# sourceMappingURL=login.page.css.map */\n'] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginPage, { className: "LoginPage", filePath: "src/app/pages/login/login.page.ts", lineNumber: 30 });
})();
export {
  LoginPage
};
//# sourceMappingURL=chunk-XS5IOD6X.js.map
