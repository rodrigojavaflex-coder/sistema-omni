import {
  PasswordToggleButtonComponent
} from "./chunk-N57VEUIB.js";
import "./chunk-4KKD5W2S.js";
import {
  AuthService,
  ErrorMessageService
} from "./chunk-XXRWZG7R.js";
import {
  Component,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  IonContent,
  IonSpinner,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Router,
  RouterLink,
  ToastController,
  Validators,
  inject,
  setClassMetadata,
  ɵNgNoValidate,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
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
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-TLQ76MG3.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-JCEFQURH.js";
import "./chunk-PFHNU3CN.js";
import "./chunk-52UEIZVD.js";
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

// src/app/pages/redefinir-senha/redefinir-senha.page.ts
function RedefinirSenhaPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1, "Informe o e-mail do seu login");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 5);
    \u0275\u0275text(1, "C\xF3digo e nova senha");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.sucessoMensagem);
  }
}
function RedefinirSenhaPage_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 7);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.avisoDigital);
  }
}
function RedefinirSenhaPage_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "button", 10);
    \u0275\u0275listener("click", function RedefinirSenhaPage_Conditional_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.irParaLogin());
    });
    \u0275\u0275text(2, "Ir para o login");
    \u0275\u0275elementEnd()();
  }
}
function RedefinirSenhaPage_Conditional_11_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "E-mail \xE9 obrigat\xF3rio");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_11_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "E-mail inv\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_11_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275conditionalCreate(1, RedefinirSenhaPage_Conditional_11_Conditional_3_Conditional_1_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(2, RedefinirSenhaPage_Conditional_11_Conditional_3_Conditional_2_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_2_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_3_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["email"]) ? 2 : -1);
  }
}
function RedefinirSenhaPage_Conditional_11_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function RedefinirSenhaPage_Conditional_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "Enviar c\xF3digo");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_11_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275element(1, "ion-spinner", 19);
    \u0275\u0275text(2, " Enviando... ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 11);
    \u0275\u0275listener("ngSubmit", function RedefinirSenhaPage_Conditional_11_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmitEmail());
    });
    \u0275\u0275elementStart(1, "div", 12);
    \u0275\u0275element(2, "input", 13);
    \u0275\u0275conditionalCreate(3, RedefinirSenhaPage_Conditional_11_Conditional_3_Template, 3, 2, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, RedefinirSenhaPage_Conditional_11_Conditional_4_Template, 2, 1, "div", 15);
    \u0275\u0275elementStart(5, "button", 16);
    \u0275\u0275conditionalCreate(6, RedefinirSenhaPage_Conditional_11_Conditional_6_Template, 2, 0, "span", 17)(7, RedefinirSenhaPage_Conditional_11_Conditional_7_Template, 3, 0, "span", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 18);
    \u0275\u0275text(9, "Voltar ao login");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.formEmail);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_2_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_2_0.touched));
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_3_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_3_0.touched) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.errorMessage ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.formEmail.invalid || ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.isLoading ? 6 : 7);
  }
}
function RedefinirSenhaPage_Conditional_12_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.infoMessage);
  }
}
function RedefinirSenhaPage_Conditional_12_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1, " Informe os 6 d\xEDgitos ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_12_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14);
    \u0275\u0275text(1, " M\xEDn. 6 caracteres, com letra e n\xFAmero ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_12_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function RedefinirSenhaPage_Conditional_12_Conditional_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "Redefinir senha");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_12_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275element(1, "ion-spinner", 19);
    \u0275\u0275text(2, " Salvando... ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 11);
    \u0275\u0275listener("ngSubmit", function RedefinirSenhaPage_Conditional_12_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onSubmitConfirmar());
    });
    \u0275\u0275conditionalCreate(1, RedefinirSenhaPage_Conditional_12_Conditional_1_Template, 2, 1, "div", 20);
    \u0275\u0275elementStart(2, "p", 21);
    \u0275\u0275text(3, "C\xF3digo enviado para: ");
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 12)(7, "input", 22);
    \u0275\u0275listener("input", function RedefinirSenhaPage_Conditional_12_Template_input_input_7_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onCodeInput($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, RedefinirSenhaPage_Conditional_12_Conditional_8_Template, 2, 0, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 12);
    \u0275\u0275element(10, "input", 23);
    \u0275\u0275elementStart(11, "app-password-toggle-button", 24);
    \u0275\u0275listener("toggled", function RedefinirSenhaPage_Conditional_12_Template_app_password_toggle_button_toggled_11_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleNewPasswordVisibility());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, RedefinirSenhaPage_Conditional_12_Conditional_12_Template, 2, 0, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 12);
    \u0275\u0275element(14, "input", 25);
    \u0275\u0275elementStart(15, "app-password-toggle-button", 26);
    \u0275\u0275listener("toggled", function RedefinirSenhaPage_Conditional_12_Template_app_password_toggle_button_toggled_15_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleConfirmPasswordVisibility());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(16, RedefinirSenhaPage_Conditional_12_Conditional_16_Template, 2, 1, "div", 15);
    \u0275\u0275elementStart(17, "button", 16);
    \u0275\u0275conditionalCreate(18, RedefinirSenhaPage_Conditional_12_Conditional_18_Template, 2, 0, "span", 17)(19, RedefinirSenhaPage_Conditional_12_Conditional_19_Template, 3, 0, "span", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "button", 27);
    \u0275\u0275listener("click", function RedefinirSenhaPage_Conditional_12_Template_button_click_20_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.voltarEmail());
    });
    \u0275\u0275text(21, " Usar outro e-mail ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "a", 18);
    \u0275\u0275text(23, "Voltar ao login");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_10_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("formGroup", ctx_r0.formConfirmar);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.infoMessage ? 1 : -1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.emailPendente);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_4_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_4_0.touched));
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_5_0.touched) ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_6_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_6_0.touched));
    \u0275\u0275property("type", ctx_r0.showNewPassword ? "text" : "password");
    \u0275\u0275advance();
    \u0275\u0275property("visible", ctx_r0.showNewPassword)("disabled", ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_10_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_10_0.touched) ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("type", ctx_r0.showConfirmPassword ? "text" : "password");
    \u0275\u0275advance();
    \u0275\u0275property("visible", ctx_r0.showConfirmPassword)("disabled", ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.errorMessage ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.formConfirmar.invalid || ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.isLoading ? 18 : 19);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.isLoading);
  }
}
var RedefinirSenhaPage = class _RedefinirSenhaPage {
  formBuilder = inject(FormBuilder);
  auth = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastController);
  errorMessageService = inject(ErrorMessageService);
  strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  step = 1;
  emailPendente = "";
  isLoading = false;
  errorMessage = "";
  infoMessage = "";
  sucesso = false;
  sucessoMensagem = "";
  /** Aviso após desativar credenciais do login por digital (troca de senha). */
  avisoDigital = "";
  showNewPassword = false;
  showConfirmPassword = false;
  formEmail = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]]
  });
  formConfirmar = this.formBuilder.group({
    code: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
    newPassword: [
      "",
      [Validators.required, Validators.minLength(6), Validators.maxLength(50), Validators.pattern(this.strongPassword)]
    ],
    confirmPassword: ["", [Validators.required, Validators.minLength(6)]]
  });
  ionViewWillEnter() {
    if (!this.sucesso) {
      this.errorMessage = "";
    }
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  onCodeInput(e) {
    const t = e.target;
    const d = t.value.replace(/\D/g, "").slice(0, 6);
    this.formConfirmar.get("code")?.setValue(d, { emitEvent: false });
    t.value = d;
  }
  onSubmitEmail() {
    return __async(this, null, function* () {
      if (this.formEmail.invalid) {
        this.formEmail.markAllAsTouched();
        return;
      }
      const email = this.formEmail.getRawValue().email.trim();
      this.isLoading = true;
      this.errorMessage = "";
      this.infoMessage = "";
      this.formEmail.disable();
      try {
        const res = yield this.auth.requestPasswordReset(email);
        this.emailPendente = email;
        this.infoMessage = res.message;
        this.step = 2;
      } catch (err) {
        this.errorMessage = this.extractApiMessage(err) ?? this.errorMessageService.fromApi(err, "N\xE3o foi poss\xEDvel enviar a solicita\xE7\xE3o.");
        const t = yield this.toast.create({
          message: this.errorMessage,
          duration: 3500,
          color: "danger",
          position: "top"
        });
        yield t.present();
      } finally {
        this.isLoading = false;
        this.formEmail.enable();
      }
    });
  }
  onSubmitConfirmar() {
    return __async(this, null, function* () {
      if (this.formConfirmar.invalid) {
        this.formConfirmar.markAllAsTouched();
        return;
      }
      const { code, newPassword, confirmPassword } = this.formConfirmar.getRawValue();
      if (newPassword !== confirmPassword) {
        this.errorMessage = "As senhas n\xE3o conferem.";
        return;
      }
      this.isLoading = true;
      this.errorMessage = "";
      this.formConfirmar.disable();
      try {
        const res = yield this.auth.confirmPasswordReset({
          email: this.emailPendente,
          code,
          newPassword,
          confirmPassword
        });
        this.sucesso = true;
        this.sucessoMensagem = res.message;
        try {
          yield this.auth.disableBiometricLogin();
        } catch {
        }
        this.avisoDigital = "Por seguran\xE7a, o login por digital foi desativado. Voc\xEA poder\xE1 ativ\xE1-lo novamente ap\xF3s entrar com a nova senha.";
      } catch (err) {
        this.errorMessage = this.extractApiMessage(err) ?? this.errorMessageService.fromApi(err, "N\xE3o foi poss\xEDvel redefinir a senha.");
        const t = yield this.toast.create({
          message: this.errorMessage,
          duration: 4e3,
          color: "danger",
          position: "top"
        });
        yield t.present();
      } finally {
        this.isLoading = false;
        this.formConfirmar.enable();
      }
    });
  }
  irParaLogin() {
    void this.router.navigate(["/login"]);
  }
  voltarEmail() {
    this.step = 1;
    this.errorMessage = "";
    this.infoMessage = "";
    this.formEmail.enable();
    this.formConfirmar.reset({
      code: "",
      newPassword: "",
      confirmPassword: ""
    });
    this.formConfirmar.enable();
  }
  extractApiMessage(err) {
    const e = err;
    const raw = e?.error?.message;
    if (raw == null) {
      return null;
    }
    return Array.isArray(raw) ? raw[0] ?? null : String(raw);
  }
  static \u0275fac = function RedefinirSenhaPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RedefinirSenhaPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RedefinirSenhaPage, selectors: [["app-redefinir-senha"]], decls: 13, vars: 6, consts: [[3, "fullscreen"], [1, "login-wrapper"], [1, "login-card"], [1, "login-header"], [1, "login-title"], [1, "login-subtitle"], [1, "login-subtitle", 2, "text-align", "center"], [1, "digital-hint"], [1, "login-form", 2, "margin-top", "0.5rem"], [1, "login-form", 3, "formGroup"], ["type", "button", 1, "login-button", 3, "click"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "input-group"], ["type", "email", "id", "rs-email", "formControlName", "email", "placeholder", "E-mail", "autocomplete", "email", 1, "form-input"], [1, "error-message"], [1, "alert-error"], ["type", "submit", 1, "login-button", 3, "disabled"], [1, "button-text"], ["routerLink", "/login", 1, "pr-link"], ["name", "crescent"], [1, "info-banner"], [1, "email-hint"], ["type", "text", "id", "rs-code", "formControlName", "code", "inputmode", "numeric", "autocomplete", "one-time-code", "maxlength", "6", "placeholder", "000000", 1, "form-input", 3, "input"], ["id", "rs-np", "formControlName", "newPassword", "placeholder", "Nova senha", "autocomplete", "new-password", 1, "form-input", "form-input-with-toggle", 3, "type"], ["showLabel", "Mostrar nova senha", "hideLabel", "Ocultar nova senha", 3, "toggled", "visible", "disabled"], ["id", "rs-cf", "formControlName", "confirmPassword", "placeholder", "Confirmar senha", "autocomplete", "new-password", 1, "form-input", "form-input-with-toggle", 3, "type"], ["showLabel", "Mostrar confirma\xE7\xE3o de senha", "hideLabel", "Ocultar confirma\xE7\xE3o de senha", 3, "toggled", "visible", "disabled"], ["type", "button", 1, "btn-secondary", 3, "click", "disabled"]], template: function RedefinirSenhaPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-content", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4);
      \u0275\u0275text(5, "Redefinir senha");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, RedefinirSenhaPage_Conditional_6_Template, 2, 0, "p", 5);
      \u0275\u0275conditionalCreate(7, RedefinirSenhaPage_Conditional_7_Template, 2, 0, "p", 5);
      \u0275\u0275conditionalCreate(8, RedefinirSenhaPage_Conditional_8_Template, 2, 1, "p", 6);
      \u0275\u0275conditionalCreate(9, RedefinirSenhaPage_Conditional_9_Template, 2, 1, "p", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(10, RedefinirSenhaPage_Conditional_10_Template, 3, 0, "div", 8)(11, RedefinirSenhaPage_Conditional_11_Template, 10, 7, "form", 9)(12, RedefinirSenhaPage_Conditional_12_Template, 24, 19, "form", 9);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(6);
      \u0275\u0275conditional(ctx.step === 1 ? 6 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.step === 2 && !ctx.sucesso ? 7 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sucesso ? 8 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sucesso && ctx.avisoDigital ? 9 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sucesso ? 10 : ctx.step === 1 ? 11 : 12);
    }
  }, dependencies: [
    ReactiveFormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    MaxLengthValidator,
    FormGroupDirective,
    FormControlName,
    IonContent,
    IonSpinner,
    RouterLink,
    PasswordToggleButtonComponent
  ], styles: ['\n\n.login-wrapper[_ngcontent-%COMP%] {\n  padding: calc(1rem + var(--ion-safe-area-top, 0px)) 1rem calc(1rem + var(--ion-safe-area-bottom, 0px));\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: var(--ion-card-background, var(--ion-background-color, #ffffff));\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  box-sizing: border-box;\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--ion-text-color, #1a202c);\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle[_ngcontent-%COMP%] {\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-text-color, #1a202c);\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb, 59, 130, 246), 0.15);\n}\n.form-input[_ngcontent-%COMP%]:disabled {\n  opacity: 0.65;\n  cursor: not-allowed;\n}\n.form-input-with-toggle[_ngcontent-%COMP%] {\n  padding-right: 3rem;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.password-toggle[_ngcontent-%COMP%]:hover:not(:disabled), \n.password-toggle[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.form-input.error[_ngcontent-%COMP%] {\n  border-color: var(--ion-color-danger, #ef4444);\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button[_ngcontent-%COMP%]:hover:not(:disabled), \n.login-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: var(--ion-color-primary-shade, #2563eb);\n}\n.login-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: var(--ion-color-primary, #2563eb);\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link[_ngcontent-%COMP%]:hover, \n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  text-decoration: underline;\n}\n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.biometric-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid var(--ion-color-primary, #3b82f6);\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-color-primary, #1d4ed8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button[_ngcontent-%COMP%]:hover:not(:disabled), \n.biometric-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  border-color: var(--ion-color-primary-shade, #2563eb);\n  color: var(--ion-color-primary-shade, #2563eb);\n}\n.biometric-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.saved-accounts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  scroll-padding-inline: 4px;\n  scroll-snap-stop: always;\n  -webkit-overflow-scrolling: touch;\n  padding: 4px 4px 10px;\n  margin: 0 -4px 8px;\n}\n.saved-account-card[_ngcontent-%COMP%] {\n  flex: 0 0 86%;\n  scroll-snap-align: start;\n  display: flex;\n  align-items: stretch;\n  min-height: 72px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n  overflow: hidden;\n  cursor: pointer;\n}\n.saved-accounts[_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 4px;\n}\n.saved-account-card[_ngcontent-%COMP%]:only-child {\n  flex-basis: 100%;\n}\n.saved-account-card.is-selected[_ngcontent-%COMP%] {\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.2);\n}\n.saved-account-main[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 8px 10px 12px;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.saved-account-main[_ngcontent-%COMP%]:hover:not(:disabled), \n.saved-account-main[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);\n}\n.saved-account-main[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.saved-account-main[_ngcontent-%COMP%]:disabled, \n.text-action[_ngcontent-%COMP%]:disabled, \n.saved-account-remove-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.saved-account-avatar[_ngcontent-%COMP%] {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  font-weight: 700;\n}\n.saved-account-meta[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.saved-account-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--ion-text-color, #0f172a);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-email[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--ion-color-medium, #64748b);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-main[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 18px;\n  color: var(--ion-color-medium, #64748b);\n}\n.saved-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0 0 12px;\n}\n.saved-actions[_ngcontent-%COMP%]   .text-action[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.saved-accounts-manage[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin: 0 0 12px;\n  max-height: min(52vh, 420px);\n  overflow-y: auto;\n  padding: 2px;\n}\n.saved-account-manage-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 72px;\n  padding: 10px 12px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n}\n.saved-account-remove-btn[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  min-width: 44px;\n  min-height: 44px;\n  padding: 0.4rem 0.7rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--ion-color-danger, #eb445a);\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.saved-account-remove-btn[_ngcontent-%COMP%]:hover:not(:disabled), \n.saved-account-remove-btn[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);\n}\n.saved-account-remove-btn[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-danger, #eb445a);\n  outline-offset: 2px;\n}\n.manage-empty[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  text-align: center;\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.9rem;\n}\n.text-action[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  margin: 0 0 12px;\n  padding: 0.4rem;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-primary, #2563eb);\n  font-size: 0.9rem;\n  cursor: pointer;\n}\n.text-action[_ngcontent-%COMP%]:hover:not(:disabled), \n.text-action[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  text-decoration: underline;\n}\n.text-action[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n  border-radius: 6px;\n}\n.remember-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--ion-text-color, #1a202c);\n  cursor: pointer;\n}\n.remember-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--ion-color-primary, #3b82f6);\n}\n.remember-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.visually-hidden[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n  .saved-account-card[_ngcontent-%COMP%] {\n    flex-basis: 88%;\n  }\n  .saved-account-card[_ngcontent-%COMP%]:only-child {\n    flex-basis: 100%;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .login-card[_ngcontent-%COMP%] {\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  }\n  .saved-account-card[_ngcontent-%COMP%] {\n    background: var(--ion-item-background, #1e293b);\n  }\n  .saved-account-manage-row[_ngcontent-%COMP%] {\n    background: var(--ion-item-background, #1e293b);\n  }\n}\n/*# sourceMappingURL=login.page.css.map */', "\n\n.info-banner[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  border-radius: 8px;\n  background: #eff6ff;\n  color: #1e3a5f;\n  font-size: 0.9rem;\n}\n.email-hint[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.85rem;\n  color: #64748b;\n  margin: 0 0 0.25rem 0;\n}\n.digital-hint[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin: 0.5rem 0 0;\n  padding: 0 0.5rem;\n  line-height: 1.4;\n}\n.pr-link[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin-top: 0.5rem;\n  color: #2563eb;\n  text-decoration: none;\n  font-size: 0.9rem;\n  padding: 0.4rem 0.5rem;\n  border-radius: 6px;\n}\n.pr-link[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.6rem 1rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  background: #fff;\n  color: #334155;\n  font-size: 0.95rem;\n  cursor: pointer;\n}\n.btn-secondary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n@media (prefers-color-scheme: dark) {\n  .info-banner[_ngcontent-%COMP%] {\n    background: #1e3a5f;\n    color: #e0e7ff;\n  }\n  .digital-hint[_ngcontent-%COMP%] {\n    color: #94a3b8;\n  }\n  .pr-link[_ngcontent-%COMP%] {\n    color: #60a5fa;\n  }\n  .btn-secondary[_ngcontent-%COMP%] {\n    background: #374151;\n    border-color: #4b5563;\n    color: #e2e8f0;\n  }\n}\n/*# sourceMappingURL=redefinir-senha.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RedefinirSenhaPage, [{
    type: Component,
    args: [{ selector: "app-redefinir-senha", standalone: true, imports: [
      ReactiveFormsModule,
      IonContent,
      IonSpinner,
      RouterLink,
      PasswordToggleButtonComponent
    ], template: `<ion-content [fullscreen]="true">\r
  <div class="login-wrapper">\r
    <div class="login-card">\r
      <div class="login-header">\r
        <h1 class="login-title">Redefinir senha</h1>\r
        @if (step === 1) {\r
          <p class="login-subtitle">Informe o e-mail do seu login</p>\r
        }\r
        @if (step === 2 && !sucesso) {\r
          <p class="login-subtitle">C\xF3digo e nova senha</p>\r
        }\r
        @if (sucesso) {\r
          <p class="login-subtitle" style="text-align: center">{{ sucessoMensagem }}</p>\r
        }\r
        @if (sucesso && avisoDigital) {\r
          <p class="digital-hint">{{ avisoDigital }}</p>\r
        }\r
      </div>\r
\r
      @if (sucesso) {\r
        <div class="login-form" style="margin-top: 0.5rem">\r
          <button type="button" class="login-button" (click)="irParaLogin()">Ir para o login</button>\r
        </div>\r
      } @else if (step === 1) {\r
        <form\r
          [formGroup]="formEmail"\r
          (ngSubmit)="onSubmitEmail()"\r
          class="login-form"\r
        >\r
          <div class="input-group">\r
            <input\r
              type="email"\r
              id="rs-email"\r
              formControlName="email"\r
              class="form-input"\r
              [class.error]="formEmail.get('email')?.invalid && formEmail.get('email')?.touched"\r
              placeholder="E-mail"\r
              autocomplete="email"\r
            />\r
            @if (formEmail.get('email')?.invalid && formEmail.get('email')?.touched) {\r
              <div class="error-message">\r
                @if (formEmail.get('email')?.errors?.['required']) {\r
                  <span>E-mail \xE9 obrigat\xF3rio</span>\r
                }\r
                @if (formEmail.get('email')?.errors?.['email']) {\r
                  <span>E-mail inv\xE1lido</span>\r
                }\r
              </div>\r
            }\r
          </div>\r
          @if (errorMessage) {\r
            <div class="alert-error">{{ errorMessage }}</div>\r
          }\r
          <button type="submit" class="login-button" [disabled]="formEmail.invalid || isLoading">\r
            @if (!isLoading) {\r
              <span class="button-text">Enviar c\xF3digo</span>\r
            } @else {\r
              <span class="button-text">\r
                <ion-spinner name="crescent"></ion-spinner>\r
                Enviando...\r
              </span>\r
            }\r
          </button>\r
          <a routerLink="/login" class="pr-link">Voltar ao login</a>\r
        </form>\r
      } @else {\r
        <form\r
          [formGroup]="formConfirmar"\r
          (ngSubmit)="onSubmitConfirmar()"\r
          class="login-form"\r
        >\r
          @if (infoMessage) {\r
            <div class="info-banner">{{ infoMessage }}</div>\r
          }\r
          <p class="email-hint">C\xF3digo enviado para: <strong>{{ emailPendente }}</strong></p>\r
          <div class="input-group">\r
            <input\r
              type="text"\r
              id="rs-code"\r
              formControlName="code"\r
              class="form-input"\r
              (input)="onCodeInput($event)"\r
              [class.error]="formConfirmar.get('code')?.invalid && formConfirmar.get('code')?.touched"\r
              inputmode="numeric"\r
              autocomplete="one-time-code"\r
              maxlength="6"\r
              placeholder="000000" />\r
            @if (formConfirmar.get('code')?.invalid && formConfirmar.get('code')?.touched) {\r
              <div class="error-message">\r
                Informe os 6 d\xEDgitos\r
              </div>\r
            }\r
          </div>\r
          <div class="input-group">\r
            <input\r
              [type]="showNewPassword ? 'text' : 'password'"\r
              id="rs-np"\r
              formControlName="newPassword"\r
              class="form-input form-input-with-toggle"\r
              [class.error]="\r
                formConfirmar.get('newPassword')?.invalid && formConfirmar.get('newPassword')?.touched\r
              "\r
              placeholder="Nova senha"\r
              autocomplete="new-password" />\r
            <app-password-toggle-button\r
              [visible]="showNewPassword"\r
              [disabled]="isLoading"\r
              showLabel="Mostrar nova senha"\r
              hideLabel="Ocultar nova senha"\r
              (toggled)="toggleNewPasswordVisibility()"\r
            />\r
            @if (formConfirmar.get('newPassword')?.invalid && formConfirmar.get('newPassword')?.touched) {\r
              <div class="error-message">\r
                M\xEDn. 6 caracteres, com letra e n\xFAmero\r
              </div>\r
            }\r
          </div>\r
          <div class="input-group">\r
            <input\r
              [type]="showConfirmPassword ? 'text' : 'password'"\r
              id="rs-cf"\r
              formControlName="confirmPassword"\r
              class="form-input form-input-with-toggle"\r
              placeholder="Confirmar senha"\r
              autocomplete="new-password" />\r
            <app-password-toggle-button\r
              [visible]="showConfirmPassword"\r
              [disabled]="isLoading"\r
              showLabel="Mostrar confirma\xE7\xE3o de senha"\r
              hideLabel="Ocultar confirma\xE7\xE3o de senha"\r
              (toggled)="toggleConfirmPasswordVisibility()"\r
            />\r
          </div>\r
          @if (errorMessage) {\r
            <div class="alert-error">{{ errorMessage }}</div>\r
          }\r
          <button type="submit" class="login-button" [disabled]="formConfirmar.invalid || isLoading">\r
            @if (!isLoading) {\r
              <span class="button-text">Redefinir senha</span>\r
            } @else {\r
              <span class="button-text">\r
                <ion-spinner name="crescent"></ion-spinner>\r
                Salvando...\r
              </span>\r
            }\r
          </button>\r
          <button type="button" class="btn-secondary" (click)="voltarEmail()" [disabled]="isLoading">\r
            Usar outro e-mail\r
          </button>\r
          <a routerLink="/login" class="pr-link">Voltar ao login</a>\r
        </form>\r
      }\r
    </div>\r
  </div>\r
</ion-content>\r
`, styles: ['/* src/app/pages/login/login.page.scss */\n.login-wrapper {\n  padding: calc(1rem + var(--ion-safe-area-top, 0px)) 1rem calc(1rem + var(--ion-safe-area-bottom, 0px));\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card {\n  background: var(--ion-card-background, var(--ion-background-color, #ffffff));\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  box-sizing: border-box;\n  animation: fadeInUp 0.5s ease-out;\n}\n.login-header {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--ion-text-color, #1a202c);\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle {\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group {\n  position: relative;\n  width: 100%;\n}\n.form-input {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-text-color, #1a202c);\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input:focus {\n  outline: none;\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb, 59, 130, 246), 0.15);\n}\n.form-input:disabled {\n  opacity: 0.65;\n  cursor: not-allowed;\n}\n.form-input-with-toggle {\n  padding-right: 3rem;\n}\n.password-toggle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle ion-icon {\n  font-size: 1.25rem;\n}\n.password-toggle:hover:not(:disabled),\n.password-toggle:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.form-input.error {\n  border-color: var(--ion-color-danger, #ef4444);\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button {\n  width: 100%;\n  padding: 0.8rem;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button:hover:not(:disabled),\n.login-button:focus-visible:not(:disabled) {\n  background: var(--ion-color-primary-shade, #2563eb);\n}\n.login-button:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: var(--ion-color-primary, #2563eb);\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link:hover,\n.forgot-link:focus-visible {\n  text-decoration: underline;\n}\n.forgot-link:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.biometric-button {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid var(--ion-color-primary, #3b82f6);\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-color-primary, #1d4ed8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button:hover:not(:disabled),\n.biometric-button:focus-visible:not(:disabled) {\n  border-color: var(--ion-color-primary-shade, #2563eb);\n  color: var(--ion-color-primary-shade, #2563eb);\n}\n.biometric-button:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.saved-accounts {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  scroll-padding-inline: 4px;\n  scroll-snap-stop: always;\n  -webkit-overflow-scrolling: touch;\n  padding: 4px 4px 10px;\n  margin: 0 -4px 8px;\n}\n.saved-account-card {\n  flex: 0 0 86%;\n  scroll-snap-align: start;\n  display: flex;\n  align-items: stretch;\n  min-height: 72px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n  overflow: hidden;\n  cursor: pointer;\n}\n.saved-accounts::-webkit-scrollbar {\n  height: 4px;\n}\n.saved-account-card:only-child {\n  flex-basis: 100%;\n}\n.saved-account-card.is-selected {\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.2);\n}\n.saved-account-main {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 8px 10px 12px;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.saved-account-main:hover:not(:disabled),\n.saved-account-main:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);\n}\n.saved-account-main:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.saved-account-main:disabled,\n.text-action:disabled,\n.saved-account-remove-btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.saved-account-avatar {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  font-weight: 700;\n}\n.saved-account-meta {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.saved-account-name {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--ion-text-color, #0f172a);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-email {\n  font-size: 0.8rem;\n  color: var(--ion-color-medium, #64748b);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-main ion-icon {\n  flex-shrink: 0;\n  font-size: 18px;\n  color: var(--ion-color-medium, #64748b);\n}\n.saved-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0 0 12px;\n}\n.saved-actions .text-action {\n  margin: 0;\n}\n.saved-accounts-manage {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin: 0 0 12px;\n  max-height: min(52vh, 420px);\n  overflow-y: auto;\n  padding: 2px;\n}\n.saved-account-manage-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 72px;\n  padding: 10px 12px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n}\n.saved-account-remove-btn {\n  flex-shrink: 0;\n  min-width: 44px;\n  min-height: 44px;\n  padding: 0.4rem 0.7rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--ion-color-danger, #eb445a);\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.saved-account-remove-btn:hover:not(:disabled),\n.saved-account-remove-btn:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);\n}\n.saved-account-remove-btn:focus-visible {\n  outline: 2px solid var(--ion-color-danger, #eb445a);\n  outline-offset: 2px;\n}\n.manage-empty {\n  margin: 0 0 12px;\n  text-align: center;\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.9rem;\n}\n.text-action {\n  display: block;\n  width: 100%;\n  margin: 0 0 12px;\n  padding: 0.4rem;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-primary, #2563eb);\n  font-size: 0.9rem;\n  cursor: pointer;\n}\n.text-action:hover:not(:disabled),\n.text-action:focus-visible:not(:disabled) {\n  text-decoration: underline;\n}\n.text-action:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n  border-radius: 6px;\n}\n.remember-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--ion-text-color, #1a202c);\n  cursor: pointer;\n}\n.remember-row input {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--ion-color-primary, #3b82f6);\n}\n.remember-row input:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.visually-hidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title {\n    font-size: 1.35rem;\n  }\n  .saved-account-card {\n    flex-basis: 88%;\n  }\n  .saved-account-card:only-child {\n    flex-basis: 100%;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .login-card {\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  }\n  .saved-account-card {\n    background: var(--ion-item-background, #1e293b);\n  }\n  .saved-account-manage-row {\n    background: var(--ion-item-background, #1e293b);\n  }\n}\n/*# sourceMappingURL=login.page.css.map */\n', "/* src/app/pages/redefinir-senha/redefinir-senha.page.scss */\n.info-banner {\n  padding: 0.75rem;\n  border-radius: 8px;\n  background: #eff6ff;\n  color: #1e3a5f;\n  font-size: 0.9rem;\n}\n.email-hint {\n  text-align: center;\n  font-size: 0.85rem;\n  color: #64748b;\n  margin: 0 0 0.25rem 0;\n}\n.digital-hint {\n  text-align: center;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin: 0.5rem 0 0;\n  padding: 0 0.5rem;\n  line-height: 1.4;\n}\n.pr-link {\n  display: block;\n  text-align: center;\n  margin-top: 0.5rem;\n  color: #2563eb;\n  text-decoration: none;\n  font-size: 0.9rem;\n  padding: 0.4rem 0.5rem;\n  border-radius: 6px;\n}\n.pr-link:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.btn-secondary {\n  width: 100%;\n  padding: 0.6rem 1rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  background: #fff;\n  color: #334155;\n  font-size: 0.95rem;\n  cursor: pointer;\n}\n.btn-secondary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n@media (prefers-color-scheme: dark) {\n  .info-banner {\n    background: #1e3a5f;\n    color: #e0e7ff;\n  }\n  .digital-hint {\n    color: #94a3b8;\n  }\n  .pr-link {\n    color: #60a5fa;\n  }\n  .btn-secondary {\n    background: #374151;\n    border-color: #4b5563;\n    color: #e2e8f0;\n  }\n}\n/*# sourceMappingURL=redefinir-senha.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RedefinirSenhaPage, { className: "RedefinirSenhaPage", filePath: "app/pages/redefinir-senha/redefinir-senha.page.ts", lineNumber: 24 });
})();
export {
  RedefinirSenhaPage
};
//# sourceMappingURL=chunk-PWTPNECU.js.map
