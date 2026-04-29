import {
  AuthService
} from "./chunk-T6CYOBCK.js";
import {
  ErrorMessageService
} from "./chunk-P3DEM65Q.js";
import {
  CommonModule,
  Component,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormsModule,
  IonContent,
  IonSpinner,
  MaxLengthValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgIf,
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
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
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

// src/app/pages/redefinir-senha/redefinir-senha.page.ts
function RedefinirSenhaPage_p_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "Informe o e-mail do seu login");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_p_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "C\xF3digo e nova senha");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_p_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.sucessoMensagem);
  }
}
function RedefinirSenhaPage_p_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.avisoDigital);
  }
}
function RedefinirSenhaPage_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 13)(2, "button", 14);
    \u0275\u0275listener("click", function RedefinirSenhaPage_ng_container_10_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.irParaLogin());
    });
    \u0275\u0275text(3, "Ir para o login");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_div_3_span_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "E-mail \xE9 obrigat\xF3rio");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_div_3_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "E-mail inv\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275template(1, RedefinirSenhaPage_ng_template_11_form_0_div_3_span_1_Template, 2, 0, "span", 25)(2, RedefinirSenhaPage_ng_template_11_form_0_div_3_span_2_Template, 2, 0, "span", 25);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_4_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", (tmp_5_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_5_0.errors == null ? null : tmp_5_0.errors["email"]);
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_span_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "Enviar c\xF3digo");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275element(1, "ion-spinner", 28);
    \u0275\u0275text(2, " Enviando... ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 16);
    \u0275\u0275listener("ngSubmit", function RedefinirSenhaPage_ng_template_11_form_0_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onSubmitEmail());
    });
    \u0275\u0275elementStart(1, "div", 17);
    \u0275\u0275element(2, "input", 18);
    \u0275\u0275template(3, RedefinirSenhaPage_ng_template_11_form_0_div_3_Template, 3, 2, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, RedefinirSenhaPage_ng_template_11_form_0_div_4_Template, 2, 1, "div", 20);
    \u0275\u0275elementStart(5, "button", 21);
    \u0275\u0275template(6, RedefinirSenhaPage_ng_template_11_form_0_span_6_Template, 2, 0, "span", 22)(7, RedefinirSenhaPage_ng_template_11_form_0_span_7_Template, 3, 0, "span", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "a", 23);
    \u0275\u0275text(9, "Voltar ao login");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r0.formEmail);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_4_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_4_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_5_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r0.formEmail.get("email")) == null ? null : tmp_5_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.formEmail.invalid || ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isLoading);
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 35);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.infoMessage);
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1, " Informe os 6 d\xEDgitos ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275text(1, " M\xEDn. 6 caracteres, com letra e n\xFAmero ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_div_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_span_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "Redefinir senha");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_span_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275element(1, "ion-spinner", 28);
    \u0275\u0275text(2, " Salvando... ");
    \u0275\u0275elementEnd();
  }
}
function RedefinirSenhaPage_ng_template_11_form_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 16);
    \u0275\u0275listener("ngSubmit", function RedefinirSenhaPage_ng_template_11_form_1_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onSubmitConfirmar());
    });
    \u0275\u0275template(1, RedefinirSenhaPage_ng_template_11_form_1_div_1_Template, 2, 1, "div", 29);
    \u0275\u0275elementStart(2, "p", 30);
    \u0275\u0275text(3, "C\xF3digo enviado para: ");
    \u0275\u0275elementStart(4, "strong");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 17)(7, "input", 31);
    \u0275\u0275listener("input", function RedefinirSenhaPage_ng_template_11_form_1_Template_input_input_7_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onCodeInput($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, RedefinirSenhaPage_ng_template_11_form_1_div_8_Template, 2, 0, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 17);
    \u0275\u0275element(10, "input", 32);
    \u0275\u0275template(11, RedefinirSenhaPage_ng_template_11_form_1_div_11_Template, 2, 0, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 17);
    \u0275\u0275element(13, "input", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275template(14, RedefinirSenhaPage_ng_template_11_form_1_div_14_Template, 2, 1, "div", 20);
    \u0275\u0275elementStart(15, "button", 21);
    \u0275\u0275template(16, RedefinirSenhaPage_ng_template_11_form_1_span_16_Template, 2, 0, "span", 22)(17, RedefinirSenhaPage_ng_template_11_form_1_span_17_Template, 3, 0, "span", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 34);
    \u0275\u0275listener("click", function RedefinirSenhaPage_ng_template_11_form_1_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.voltarEmail());
    });
    \u0275\u0275text(19, " Usar outro e-mail ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "a", 23);
    \u0275\u0275text(21, "Voltar ao login");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("formGroup", ctx_r0.formConfirmar);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.infoMessage);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.emailPendente);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_6_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_6_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_7_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r0.formConfirmar.get("code")) == null ? null : tmp_7_0.touched));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_8_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_8_0.touched));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ((tmp_9_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx_r0.formConfirmar.get("newPassword")) == null ? null : tmp_9_0.touched));
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.errorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.formConfirmar.invalid || ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.isLoading);
  }
}
function RedefinirSenhaPage_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, RedefinirSenhaPage_ng_template_11_form_0_Template, 10, 8, "form", 15)(1, RedefinirSenhaPage_ng_template_11_form_1_Template, 22, 14, "form", 15);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("ngIf", ctx_r0.step === 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.step === 2);
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
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RedefinirSenhaPage, selectors: [["app-redefinir-senha"]], decls: 13, vars: 7, consts: [["formBlock", ""], [3, "fullscreen"], [1, "login-wrapper"], [1, "login-card"], [1, "login-header"], [1, "login-title"], ["class", "login-subtitle", 4, "ngIf"], ["class", "login-subtitle", "style", "text-align: center", 4, "ngIf"], ["class", "digital-hint", 4, "ngIf"], [4, "ngIf", "ngIfElse"], [1, "login-subtitle"], [1, "login-subtitle", 2, "text-align", "center"], [1, "digital-hint"], [1, "login-form", 2, "margin-top", "0.5rem"], ["type", "button", 1, "login-button", 3, "click"], ["class", "login-form", 3, "formGroup", "ngSubmit", 4, "ngIf"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "input-group"], ["type", "email", "id", "rs-email", "formControlName", "email", "placeholder", "E-mail", "autocomplete", "email", 1, "form-input"], ["class", "error-message", 4, "ngIf"], ["class", "alert-error", 4, "ngIf"], ["type", "submit", 1, "login-button", 3, "disabled"], ["class", "button-text", 4, "ngIf"], ["routerLink", "/login", 1, "pr-link"], [1, "error-message"], [4, "ngIf"], [1, "alert-error"], [1, "button-text"], ["name", "crescent"], ["class", "info-banner", 4, "ngIf"], [1, "email-hint"], ["type", "text", "id", "rs-code", "formControlName", "code", "inputmode", "numeric", "autocomplete", "one-time-code", "maxlength", "6", "placeholder", "000000", 1, "form-input", 3, "input"], ["type", "password", "id", "rs-np", "formControlName", "newPassword", "placeholder", "Nova senha", "autocomplete", "new-password", 1, "form-input"], ["type", "password", "id", "rs-cf", "formControlName", "confirmPassword", "placeholder", "Confirmar senha", "autocomplete", "new-password", 1, "form-input"], ["type", "button", 1, "btn-secondary", 3, "click", "disabled"], [1, "info-banner"]], template: function RedefinirSenhaPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-content", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "h1", 5);
      \u0275\u0275text(5, "Redefinir senha");
      \u0275\u0275elementEnd();
      \u0275\u0275template(6, RedefinirSenhaPage_p_6_Template, 2, 0, "p", 6)(7, RedefinirSenhaPage_p_7_Template, 2, 0, "p", 6)(8, RedefinirSenhaPage_p_8_Template, 2, 1, "p", 7)(9, RedefinirSenhaPage_p_9_Template, 2, 1, "p", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, RedefinirSenhaPage_ng_container_10_Template, 4, 0, "ng-container", 9)(11, RedefinirSenhaPage_ng_template_11_Template, 2, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      const formBlock_r5 = \u0275\u0275reference(12);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(6);
      \u0275\u0275property("ngIf", ctx.step === 1);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.step === 2 && !ctx.sucesso);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.sucesso);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.sucesso && ctx.avisoDigital);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.sucesso)("ngIfElse", formBlock_r5);
    }
  }, dependencies: [CommonModule, NgIf, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, MaxLengthValidator, ReactiveFormsModule, FormGroupDirective, FormControlName, IonContent, IonSpinner, RouterLink], styles: ['\n\n.login-wrapper[_ngcontent-%COMP%] {\n  padding: 1rem;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: #ffffff;\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid #e2e8f0;\n  box-sizing: border-box;\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #1a202c;\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: #ffffff;\n  color: #1a202c;\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.form-input.error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  background: #3b82f6;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #2563eb;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: #2563eb;\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.biometric-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid #3b82f6;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: #ffffff;\n  color: #1d4ed8;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: #2563eb;\n  color: #2563eb;\n  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.15);\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n}\n/*# sourceMappingURL=login.page.css.map */', "\n\n.info-banner[_ngcontent-%COMP%] {\n  padding: 0.75rem;\n  border-radius: 8px;\n  background: #eff6ff;\n  color: #1e3a5f;\n  font-size: 0.9rem;\n}\n.email-hint[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.85rem;\n  color: #64748b;\n  margin: 0 0 0.25rem 0;\n}\n.digital-hint[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin: 0.5rem 0 0;\n  padding: 0 0.5rem;\n  line-height: 1.4;\n}\n.pr-link[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin-top: 0.5rem;\n  color: #2563eb;\n  text-decoration: none;\n  font-size: 0.9rem;\n  padding: 0.4rem 0.5rem;\n  border-radius: 6px;\n}\n.pr-link[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.btn-secondary[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.6rem 1rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  background: #fff;\n  color: #334155;\n  font-size: 0.95rem;\n  cursor: pointer;\n}\n.btn-secondary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n@media (prefers-color-scheme: dark) {\n  .info-banner[_ngcontent-%COMP%] {\n    background: #1e3a5f;\n    color: #e0e7ff;\n  }\n  .digital-hint[_ngcontent-%COMP%] {\n    color: #94a3b8;\n  }\n  .pr-link[_ngcontent-%COMP%] {\n    color: #60a5fa;\n  }\n  .btn-secondary[_ngcontent-%COMP%] {\n    background: #374151;\n    border-color: #4b5563;\n    color: #e2e8f0;\n  }\n}\n/*# sourceMappingURL=redefinir-senha.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RedefinirSenhaPage, [{
    type: Component,
    args: [{ selector: "app-redefinir-senha", standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, IonContent, IonSpinner, RouterLink], template: `<ion-content [fullscreen]="true">\r
  <div class="login-wrapper">\r
    <div class="login-card">\r
      <div class="login-header">\r
        <h1 class="login-title">Redefinir senha</h1>\r
        <p class="login-subtitle" *ngIf="step === 1">Informe o e-mail do seu login</p>\r
        <p class="login-subtitle" *ngIf="step === 2 && !sucesso">C\xF3digo e nova senha</p>\r
        <p class="login-subtitle" *ngIf="sucesso" style="text-align: center">{{ sucessoMensagem }}</p>\r
        <p class="digital-hint" *ngIf="sucesso && avisoDigital">{{ avisoDigital }}</p>\r
      </div>\r
\r
      <ng-container *ngIf="sucesso; else formBlock">\r
        <div class="login-form" style="margin-top: 0.5rem">\r
          <button type="button" class="login-button" (click)="irParaLogin()">Ir para o login</button>\r
        </div>\r
      </ng-container>\r
      <ng-template #formBlock>\r
        <form\r
          *ngIf="step === 1"\r
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
            <div\r
              class="error-message"\r
              *ngIf="formEmail.get('email')?.invalid && formEmail.get('email')?.touched"\r
            >\r
              <span *ngIf="formEmail.get('email')?.errors?.['required']">E-mail \xE9 obrigat\xF3rio</span>\r
              <span *ngIf="formEmail.get('email')?.errors?.['email']">E-mail inv\xE1lido</span>\r
            </div>\r
          </div>\r
          <div class="alert-error" *ngIf="errorMessage">{{ errorMessage }}</div>\r
          <button type="submit" class="login-button" [disabled]="formEmail.invalid || isLoading">\r
            <span *ngIf="!isLoading" class="button-text">Enviar c\xF3digo</span>\r
            <span *ngIf="isLoading" class="button-text">\r
              <ion-spinner name="crescent"></ion-spinner>\r
              Enviando...\r
            </span>\r
          </button>\r
          <a routerLink="/login" class="pr-link">Voltar ao login</a>\r
        </form>\r
\r
        <form\r
          *ngIf="step === 2"\r
          [formGroup]="formConfirmar"\r
          (ngSubmit)="onSubmitConfirmar()"\r
          class="login-form"\r
        >\r
          <div class="info-banner" *ngIf="infoMessage">{{ infoMessage }}</div>\r
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
            <div\r
              class="error-message"\r
              *ngIf="formConfirmar.get('code')?.invalid && formConfirmar.get('code')?.touched"\r
            >\r
              Informe os 6 d\xEDgitos\r
            </div>\r
          </div>\r
          <div class="input-group">\r
            <input\r
              type="password"\r
              id="rs-np"\r
              formControlName="newPassword"\r
              class="form-input"\r
              [class.error]="\r
                formConfirmar.get('newPassword')?.invalid && formConfirmar.get('newPassword')?.touched\r
              "\r
              placeholder="Nova senha"\r
              autocomplete="new-password" />\r
            <div\r
              class="error-message"\r
              *ngIf="formConfirmar.get('newPassword')?.invalid && formConfirmar.get('newPassword')?.touched"\r
            >\r
              M\xEDn. 6 caracteres, com letra e n\xFAmero\r
            </div>\r
          </div>\r
          <div class="input-group">\r
            <input\r
              type="password"\r
              id="rs-cf"\r
              formControlName="confirmPassword"\r
              class="form-input"\r
              placeholder="Confirmar senha"\r
              autocomplete="new-password" />\r
          </div>\r
          <div class="alert-error" *ngIf="errorMessage">{{ errorMessage }}</div>\r
          <button type="submit" class="login-button" [disabled]="formConfirmar.invalid || isLoading">\r
            <span *ngIf="!isLoading" class="button-text">Redefinir senha</span>\r
            <span *ngIf="isLoading" class="button-text">\r
              <ion-spinner name="crescent"></ion-spinner>\r
              Salvando...\r
            </span>\r
          </button>\r
          <button type="button" class="btn-secondary" (click)="voltarEmail()" [disabled]="isLoading">\r
            Usar outro e-mail\r
          </button>\r
          <a routerLink="/login" class="pr-link">Voltar ao login</a>\r
        </form>\r
      </ng-template>\r
    </div>\r
  </div>\r
</ion-content>\r
`, styles: ['/* src/app/pages/login/login.page.scss */\n.login-wrapper {\n  padding: 1rem;\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card {\n  background: #ffffff;\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid #e2e8f0;\n  box-sizing: border-box;\n  animation: fadeInUp 0.5s ease-out;\n}\n.login-header {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: #1a202c;\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle {\n  color: #64748b;\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group {\n  position: relative;\n  width: 100%;\n}\n.form-input {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: #ffffff;\n  color: #1a202c;\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input:focus {\n  outline: none;\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.form-input.error {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button {\n  width: 100%;\n  padding: 0.8rem;\n  background: #3b82f6;\n  color: #ffffff;\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button:hover:not(:disabled) {\n  background: #2563eb;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: #2563eb;\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.biometric-button {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid #3b82f6;\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: #ffffff;\n  color: #1d4ed8;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button:hover:not(:disabled) {\n  border-color: #2563eb;\n  color: #2563eb;\n  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.15);\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title {\n    font-size: 1.35rem;\n  }\n}\n/*# sourceMappingURL=login.page.css.map */\n', "/* src/app/pages/redefinir-senha/redefinir-senha.page.scss */\n.info-banner {\n  padding: 0.75rem;\n  border-radius: 8px;\n  background: #eff6ff;\n  color: #1e3a5f;\n  font-size: 0.9rem;\n}\n.email-hint {\n  text-align: center;\n  font-size: 0.85rem;\n  color: #64748b;\n  margin: 0 0 0.25rem 0;\n}\n.digital-hint {\n  text-align: center;\n  font-size: 0.8rem;\n  color: #64748b;\n  margin: 0.5rem 0 0;\n  padding: 0 0.5rem;\n  line-height: 1.4;\n}\n.pr-link {\n  display: block;\n  text-align: center;\n  margin-top: 0.5rem;\n  color: #2563eb;\n  text-decoration: none;\n  font-size: 0.9rem;\n  padding: 0.4rem 0.5rem;\n  border-radius: 6px;\n}\n.pr-link:focus-visible {\n  outline: 2px solid #3b82f6;\n  outline-offset: 2px;\n}\n.btn-secondary {\n  width: 100%;\n  padding: 0.6rem 1rem;\n  border: 2px solid #e2e8f0;\n  border-radius: 8px;\n  background: #fff;\n  color: #334155;\n  font-size: 0.95rem;\n  cursor: pointer;\n}\n.btn-secondary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n@media (prefers-color-scheme: dark) {\n  .info-banner {\n    background: #1e3a5f;\n    color: #e0e7ff;\n  }\n  .digital-hint {\n    color: #94a3b8;\n  }\n  .pr-link {\n    color: #60a5fa;\n  }\n  .btn-secondary {\n    background: #374151;\n    border-color: #4b5563;\n    color: #e2e8f0;\n  }\n}\n/*# sourceMappingURL=redefinir-senha.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RedefinirSenhaPage, { className: "RedefinirSenhaPage", filePath: "src/app/pages/redefinir-senha/redefinir-senha.page.ts", lineNumber: 18 });
})();
export {
  RedefinirSenhaPage
};
//# sourceMappingURL=chunk-KAPSGUVE.js.map
