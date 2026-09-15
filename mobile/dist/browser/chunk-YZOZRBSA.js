import {
  PasswordToggleButtonComponent
} from "./chunk-N57VEUIB.js";
import "./chunk-4KKD5W2S.js";
import {
  AuthService
} from "./chunk-XXRWZG7R.js";
import {
  Component,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Router,
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
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
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

// src/app/pages/alterar-senha/alterar-senha.page.ts
function AlterarSenhaPage_Conditional_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1, "Senha atual \xE9 obrigat\xF3ria");
    \u0275\u0275elementEnd();
  }
}
function AlterarSenhaPage_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1, "M\xEDn. 6 caracteres, com letra e n\xFAmero");
    \u0275\u0275elementEnd();
  }
}
function AlterarSenhaPage_Conditional_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275text(1, "As senhas n\xE3o conferem");
    \u0275\u0275elementEnd();
  }
}
function AlterarSenhaPage_Conditional_41_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function AlterarSenhaPage_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "Alterar senha");
    \u0275\u0275elementEnd();
  }
}
function AlterarSenhaPage_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275element(1, "ion-spinner", 28);
    \u0275\u0275text(2, " Salvando... ");
    \u0275\u0275elementEnd();
  }
}
var AlterarSenhaPage = class _AlterarSenhaPage {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  toastController = inject(ToastController);
  strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  isLoading = false;
  errorMessage = "";
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  form = this.formBuilder.group({
    currentPassword: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    newPassword: [
      "",
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(this.strongPassword)
      ]
    ],
    confirmPassword: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
  });
  ionViewWillEnter() {
    this.errorMessage = "";
    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
  get passwordsMismatch() {
    const newPassword = String(this.form.get("newPassword")?.value ?? "");
    const confirmPassword = String(this.form.get("confirmPassword")?.value ?? "");
    return confirmPassword.length > 0 && newPassword !== confirmPassword;
  }
  voltar() {
    void this.router.navigate(["/home"]);
  }
  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  onSubmit() {
    return __async(this, null, function* () {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();
      if (newPassword !== confirmPassword) {
        this.errorMessage = "As senhas n\xE3o conferem.";
        return;
      }
      this.isLoading = true;
      this.errorMessage = "";
      this.form.disable();
      try {
        yield this.authService.changePassword({
          currentPassword,
          newPassword,
          confirmPassword
        });
        this.form.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        const toast = yield this.toastController.create({
          message: "Senha alterada com sucesso.",
          duration: 2500,
          color: "success",
          position: "top"
        });
        yield toast.present();
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : "N\xE3o foi poss\xEDvel alterar a senha. Tente novamente.";
        const toast = yield this.toastController.create({
          message: this.errorMessage,
          duration: 3500,
          color: "danger",
          position: "top"
        });
        yield toast.present();
      } finally {
        this.isLoading = false;
        this.form.enable();
      }
    });
  }
  static \u0275fac = function AlterarSenhaPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AlterarSenhaPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AlterarSenhaPage, selectors: [["app-alterar-senha"]], decls: 45, vars: 24, consts: [[3, "translucent"], ["slot", "start"], ["menu", "main-menu"], ["slot", "end"], ["fill", "solid", 3, "click"], [3, "fullscreen"], [1, "login-wrapper", "alterar-senha-wrapper"], [1, "login-card"], [1, "login-header"], [1, "login-title"], [1, "login-subtitle"], [1, "login-form", 3, "ngSubmit", "formGroup"], [1, "input-group"], ["for", "as-current", 1, "field-label"], [1, "password-field"], ["id", "as-current", "formControlName", "currentPassword", "placeholder", "Senha atual", "autocomplete", "current-password", 1, "form-input", "form-input-with-toggle", 3, "type"], ["showLabel", "Mostrar senha atual", "hideLabel", "Ocultar senha atual", 3, "toggled", "visible", "disabled"], [1, "error-message"], ["for", "as-new", 1, "field-label"], ["id", "as-new", "formControlName", "newPassword", "placeholder", "Nova senha", "autocomplete", "new-password", 1, "form-input", "form-input-with-toggle", 3, "type"], ["showLabel", "Mostrar nova senha", "hideLabel", "Ocultar nova senha", 3, "toggled", "visible", "disabled"], ["for", "as-confirm", 1, "field-label"], ["id", "as-confirm", "formControlName", "confirmPassword", "placeholder", "Confirmar nova senha", "autocomplete", "new-password", 1, "form-input", "form-input-with-toggle", 3, "type"], ["showLabel", "Mostrar confirma\xE7\xE3o de senha", "hideLabel", "Ocultar confirma\xE7\xE3o de senha", 3, "toggled", "visible", "disabled"], [1, "password-hint"], [1, "alert-error"], ["type", "submit", 1, "login-button", 3, "disabled"], [1, "button-text"], ["name", "crescent"]], template: function AlterarSenhaPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Alterar senha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 3)(7, "ion-button", 4);
      \u0275\u0275listener("click", function AlterarSenhaPage_Template_ion_button_click_7_listener() {
        return ctx.voltar();
      });
      \u0275\u0275text(8, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(9, "ion-content", 5)(10, "div", 6)(11, "div", 7)(12, "div", 8)(13, "h1", 9);
      \u0275\u0275text(14, "Alterar senha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(15, "p", 10);
      \u0275\u0275text(16, "Informe a senha atual e defina uma nova");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(17, "form", 11);
      \u0275\u0275listener("ngSubmit", function AlterarSenhaPage_Template_form_ngSubmit_17_listener() {
        return ctx.onSubmit();
      });
      \u0275\u0275elementStart(18, "div", 12)(19, "label", 13);
      \u0275\u0275text(20, "Senha atual");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 14);
      \u0275\u0275element(22, "input", 15);
      \u0275\u0275elementStart(23, "app-password-toggle-button", 16);
      \u0275\u0275listener("toggled", function AlterarSenhaPage_Template_app_password_toggle_button_toggled_23_listener() {
        return ctx.toggleCurrentPassword();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(24, AlterarSenhaPage_Conditional_24_Template, 2, 0, "div", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "div", 12)(26, "label", 18);
      \u0275\u0275text(27, "Nova senha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(28, "div", 14);
      \u0275\u0275element(29, "input", 19);
      \u0275\u0275elementStart(30, "app-password-toggle-button", 20);
      \u0275\u0275listener("toggled", function AlterarSenhaPage_Template_app_password_toggle_button_toggled_30_listener() {
        return ctx.toggleNewPassword();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(31, AlterarSenhaPage_Conditional_31_Template, 2, 0, "div", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(32, "div", 12)(33, "label", 21);
      \u0275\u0275text(34, "Confirmar nova senha");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(35, "div", 14);
      \u0275\u0275element(36, "input", 22);
      \u0275\u0275elementStart(37, "app-password-toggle-button", 23);
      \u0275\u0275listener("toggled", function AlterarSenhaPage_Template_app_password_toggle_button_toggled_37_listener() {
        return ctx.toggleConfirmPassword();
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(38, AlterarSenhaPage_Conditional_38_Template, 2, 0, "div", 17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(39, "p", 24);
      \u0275\u0275text(40, " A senha deve ter pelo menos 6 caracteres, incluindo letra e n\xFAmero. ");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(41, AlterarSenhaPage_Conditional_41_Template, 2, 1, "div", 25);
      \u0275\u0275elementStart(42, "button", 26);
      \u0275\u0275conditionalCreate(43, AlterarSenhaPage_Conditional_43_Template, 2, 0, "span", 27)(44, AlterarSenhaPage_Conditional_44_Template, 3, 0, "span", 27);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_7_0;
      let tmp_8_0;
      let tmp_12_0;
      let tmp_13_0;
      let tmp_17_0;
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(9);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(8);
      \u0275\u0275property("formGroup", ctx.form);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("error", ((tmp_3_0 = ctx.form.get("currentPassword")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.form.get("currentPassword")) == null ? null : tmp_3_0.touched));
      \u0275\u0275property("type", ctx.showCurrentPassword ? "text" : "password");
      \u0275\u0275advance();
      \u0275\u0275property("visible", ctx.showCurrentPassword)("disabled", ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_7_0 = ctx.form.get("currentPassword")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx.form.get("currentPassword")) == null ? null : tmp_7_0.touched) ? 24 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("error", ((tmp_8_0 = ctx.form.get("newPassword")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx.form.get("newPassword")) == null ? null : tmp_8_0.touched));
      \u0275\u0275property("type", ctx.showNewPassword ? "text" : "password");
      \u0275\u0275advance();
      \u0275\u0275property("visible", ctx.showNewPassword)("disabled", ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_12_0 = ctx.form.get("newPassword")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx.form.get("newPassword")) == null ? null : tmp_12_0.touched) ? 31 : -1);
      \u0275\u0275advance(5);
      \u0275\u0275classProp("error", ((tmp_13_0 = ctx.form.get("confirmPassword")) == null ? null : tmp_13_0.invalid) && ((tmp_13_0 = ctx.form.get("confirmPassword")) == null ? null : tmp_13_0.touched) || ((tmp_13_0 = ctx.form.get("confirmPassword")) == null ? null : tmp_13_0.touched) && ctx.passwordsMismatch);
      \u0275\u0275property("type", ctx.showConfirmPassword ? "text" : "password");
      \u0275\u0275advance();
      \u0275\u0275property("visible", ctx.showConfirmPassword)("disabled", ctx.isLoading);
      \u0275\u0275advance();
      \u0275\u0275conditional(((tmp_17_0 = ctx.form.get("confirmPassword")) == null ? null : tmp_17_0.touched) && ctx.passwordsMismatch ? 38 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.errorMessage ? 41 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.form.invalid || ctx.isLoading || ctx.passwordsMismatch);
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.isLoading ? 43 : 44);
    }
  }, dependencies: [
    ReactiveFormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    FormGroupDirective,
    FormControlName,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonSpinner,
    PasswordToggleButtonComponent
  ], styles: ['\n\n.login-wrapper[_ngcontent-%COMP%] {\n  padding: calc(1rem + var(--ion-safe-area-top, 0px)) 1rem calc(1rem + var(--ion-safe-area-bottom, 0px));\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: var(--ion-card-background, var(--ion-background-color, #ffffff));\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  box-sizing: border-box;\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--ion-text-color, #1a202c);\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle[_ngcontent-%COMP%] {\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-text-color, #1a202c);\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb, 59, 130, 246), 0.15);\n}\n.form-input[_ngcontent-%COMP%]:disabled {\n  opacity: 0.65;\n  cursor: not-allowed;\n}\n.form-input-with-toggle[_ngcontent-%COMP%] {\n  padding-right: 3rem;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.password-toggle[_ngcontent-%COMP%]:hover:not(:disabled), \n.password-toggle[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.form-input.error[_ngcontent-%COMP%] {\n  border-color: var(--ion-color-danger, #ef4444);\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button[_ngcontent-%COMP%]:hover:not(:disabled), \n.login-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: var(--ion-color-primary-shade, #2563eb);\n}\n.login-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: var(--ion-color-primary, #2563eb);\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link[_ngcontent-%COMP%]:hover, \n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  text-decoration: underline;\n}\n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.biometric-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid var(--ion-color-primary, #3b82f6);\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-color-primary, #1d4ed8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button[_ngcontent-%COMP%]:hover:not(:disabled), \n.biometric-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  border-color: var(--ion-color-primary-shade, #2563eb);\n  color: var(--ion-color-primary-shade, #2563eb);\n}\n.biometric-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.saved-accounts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  scroll-padding-inline: 4px;\n  scroll-snap-stop: always;\n  -webkit-overflow-scrolling: touch;\n  padding: 4px 4px 10px;\n  margin: 0 -4px 8px;\n}\n.saved-account-card[_ngcontent-%COMP%] {\n  flex: 0 0 86%;\n  scroll-snap-align: start;\n  display: flex;\n  align-items: stretch;\n  min-height: 72px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n  overflow: hidden;\n  cursor: pointer;\n}\n.saved-accounts[_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 4px;\n}\n.saved-account-card[_ngcontent-%COMP%]:only-child {\n  flex-basis: 100%;\n}\n.saved-account-card.is-selected[_ngcontent-%COMP%] {\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.2);\n}\n.saved-account-main[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 8px 10px 12px;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.saved-account-main[_ngcontent-%COMP%]:hover:not(:disabled), \n.saved-account-main[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);\n}\n.saved-account-main[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.saved-account-main[_ngcontent-%COMP%]:disabled, \n.text-action[_ngcontent-%COMP%]:disabled, \n.saved-account-remove-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.saved-account-avatar[_ngcontent-%COMP%] {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  font-weight: 700;\n}\n.saved-account-meta[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.saved-account-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--ion-text-color, #0f172a);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-email[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--ion-color-medium, #64748b);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-main[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 18px;\n  color: var(--ion-color-medium, #64748b);\n}\n.saved-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0 0 12px;\n}\n.saved-actions[_ngcontent-%COMP%]   .text-action[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.saved-accounts-manage[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin: 0 0 12px;\n  max-height: min(52vh, 420px);\n  overflow-y: auto;\n  padding: 2px;\n}\n.saved-account-manage-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 72px;\n  padding: 10px 12px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n}\n.saved-account-remove-btn[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  min-width: 44px;\n  min-height: 44px;\n  padding: 0.4rem 0.7rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--ion-color-danger, #eb445a);\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.saved-account-remove-btn[_ngcontent-%COMP%]:hover:not(:disabled), \n.saved-account-remove-btn[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);\n}\n.saved-account-remove-btn[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-danger, #eb445a);\n  outline-offset: 2px;\n}\n.manage-empty[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  text-align: center;\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.9rem;\n}\n.text-action[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  margin: 0 0 12px;\n  padding: 0.4rem;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-primary, #2563eb);\n  font-size: 0.9rem;\n  cursor: pointer;\n}\n.text-action[_ngcontent-%COMP%]:hover:not(:disabled), \n.text-action[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  text-decoration: underline;\n}\n.text-action[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n  border-radius: 6px;\n}\n.remember-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--ion-text-color, #1a202c);\n  cursor: pointer;\n}\n.remember-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--ion-color-primary, #3b82f6);\n}\n.remember-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.visually-hidden[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n  .saved-account-card[_ngcontent-%COMP%] {\n    flex-basis: 88%;\n  }\n  .saved-account-card[_ngcontent-%COMP%]:only-child {\n    flex-basis: 100%;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .login-card[_ngcontent-%COMP%] {\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  }\n  .saved-account-card[_ngcontent-%COMP%] {\n    background: var(--ion-item-background, #1e293b);\n  }\n  .saved-account-manage-row[_ngcontent-%COMP%] {\n    background: var(--ion-item-background, #1e293b);\n  }\n}\n/*# sourceMappingURL=login.page.css.map */', "\n\n.alterar-senha-wrapper[_ngcontent-%COMP%] {\n  align-items: flex-start;\n}\n.field-label[_ngcontent-%COMP%] {\n  display: block;\n  margin: 0 0 0.35rem 0.15rem;\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--ion-text-color, #1a202c);\n}\n.password-field[_ngcontent-%COMP%] {\n  position: relative;\n}\n.password-hint[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.8rem;\n  line-height: 1.4;\n  color: var(--ion-color-medium, #64748b);\n}\n/*# sourceMappingURL=alterar-senha.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlterarSenhaPage, [{
    type: Component,
    args: [{ selector: "app-alterar-senha", standalone: true, imports: [
      ReactiveFormsModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonTitle,
      IonButton,
      IonContent,
      IonSpinner,
      PasswordToggleButtonComponent
    ], template: `<ion-header [translucent]="true">\r
  <ion-toolbar>\r
    <ion-buttons slot="start">\r
      <ion-menu-button menu="main-menu"></ion-menu-button>\r
    </ion-buttons>\r
    <ion-title>Alterar senha</ion-title>\r
    <ion-buttons slot="end">\r
      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>\r
    </ion-buttons>\r
  </ion-toolbar>\r
</ion-header>\r
\r
<ion-content [fullscreen]="true">\r
  <div class="login-wrapper alterar-senha-wrapper">\r
    <div class="login-card">\r
      <div class="login-header">\r
        <h1 class="login-title">Alterar senha</h1>\r
        <p class="login-subtitle">Informe a senha atual e defina uma nova</p>\r
      </div>\r
\r
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">\r
        <div class="input-group">\r
          <label class="field-label" for="as-current">Senha atual</label>\r
          <div class="password-field">\r
            <input\r
              [type]="showCurrentPassword ? 'text' : 'password'"\r
              id="as-current"\r
              formControlName="currentPassword"\r
              class="form-input form-input-with-toggle"\r
              [class.error]="\r
                form.get('currentPassword')?.invalid && form.get('currentPassword')?.touched\r
              "\r
              placeholder="Senha atual"\r
              autocomplete="current-password"\r
            />\r
            <app-password-toggle-button\r
              [visible]="showCurrentPassword"\r
              [disabled]="isLoading"\r
              showLabel="Mostrar senha atual"\r
              hideLabel="Ocultar senha atual"\r
              (toggled)="toggleCurrentPassword()"\r
            />\r
          </div>\r
          @if (form.get('currentPassword')?.invalid && form.get('currentPassword')?.touched) {\r
            <div class="error-message">Senha atual \xE9 obrigat\xF3ria</div>\r
          }\r
        </div>\r
\r
        <div class="input-group">\r
          <label class="field-label" for="as-new">Nova senha</label>\r
          <div class="password-field">\r
            <input\r
              [type]="showNewPassword ? 'text' : 'password'"\r
              id="as-new"\r
              formControlName="newPassword"\r
              class="form-input form-input-with-toggle"\r
              [class.error]="form.get('newPassword')?.invalid && form.get('newPassword')?.touched"\r
              placeholder="Nova senha"\r
              autocomplete="new-password"\r
            />\r
            <app-password-toggle-button\r
              [visible]="showNewPassword"\r
              [disabled]="isLoading"\r
              showLabel="Mostrar nova senha"\r
              hideLabel="Ocultar nova senha"\r
              (toggled)="toggleNewPassword()"\r
            />\r
          </div>\r
          @if (form.get('newPassword')?.invalid && form.get('newPassword')?.touched) {\r
            <div class="error-message">M\xEDn. 6 caracteres, com letra e n\xFAmero</div>\r
          }\r
        </div>\r
\r
        <div class="input-group">\r
          <label class="field-label" for="as-confirm">Confirmar nova senha</label>\r
          <div class="password-field">\r
            <input\r
              [type]="showConfirmPassword ? 'text' : 'password'"\r
              id="as-confirm"\r
              formControlName="confirmPassword"\r
              class="form-input form-input-with-toggle"\r
              [class.error]="\r
                (form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched) ||\r
                (form.get('confirmPassword')?.touched && passwordsMismatch)\r
              "\r
              placeholder="Confirmar nova senha"\r
              autocomplete="new-password"\r
            />\r
            <app-password-toggle-button\r
              [visible]="showConfirmPassword"\r
              [disabled]="isLoading"\r
              showLabel="Mostrar confirma\xE7\xE3o de senha"\r
              hideLabel="Ocultar confirma\xE7\xE3o de senha"\r
              (toggled)="toggleConfirmPassword()"\r
            />\r
          </div>\r
          @if (form.get('confirmPassword')?.touched && passwordsMismatch) {\r
            <div class="error-message">As senhas n\xE3o conferem</div>\r
          }\r
        </div>\r
\r
        <p class="password-hint">\r
          A senha deve ter pelo menos 6 caracteres, incluindo letra e n\xFAmero.\r
        </p>\r
\r
        @if (errorMessage) {\r
          <div class="alert-error">{{ errorMessage }}</div>\r
        }\r
\r
        <button type="submit" class="login-button" [disabled]="form.invalid || isLoading || passwordsMismatch">\r
          @if (!isLoading) {\r
            <span class="button-text">Alterar senha</span>\r
          } @else {\r
            <span class="button-text">\r
              <ion-spinner name="crescent"></ion-spinner>\r
              Salvando...\r
            </span>\r
          }\r
        </button>\r
      </form>\r
    </div>\r
  </div>\r
</ion-content>\r
`, styles: ['/* src/app/pages/login/login.page.scss */\n.login-wrapper {\n  padding: calc(1rem + var(--ion-safe-area-top, 0px)) 1rem calc(1rem + var(--ion-safe-area-bottom, 0px));\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card {\n  background: var(--ion-card-background, var(--ion-background-color, #ffffff));\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  box-sizing: border-box;\n  animation: fadeInUp 0.5s ease-out;\n}\n.login-header {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--ion-text-color, #1a202c);\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle {\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group {\n  position: relative;\n  width: 100%;\n}\n.form-input {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-text-color, #1a202c);\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input:focus {\n  outline: none;\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb, 59, 130, 246), 0.15);\n}\n.form-input:disabled {\n  opacity: 0.65;\n  cursor: not-allowed;\n}\n.form-input-with-toggle {\n  padding-right: 3rem;\n}\n.password-toggle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle ion-icon {\n  font-size: 1.25rem;\n}\n.password-toggle:hover:not(:disabled),\n.password-toggle:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.form-input.error {\n  border-color: var(--ion-color-danger, #ef4444);\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button {\n  width: 100%;\n  padding: 0.8rem;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button:hover:not(:disabled),\n.login-button:focus-visible:not(:disabled) {\n  background: var(--ion-color-primary-shade, #2563eb);\n}\n.login-button:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: var(--ion-color-primary, #2563eb);\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link:hover,\n.forgot-link:focus-visible {\n  text-decoration: underline;\n}\n.forgot-link:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.biometric-button {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid var(--ion-color-primary, #3b82f6);\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-color-primary, #1d4ed8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button:hover:not(:disabled),\n.biometric-button:focus-visible:not(:disabled) {\n  border-color: var(--ion-color-primary-shade, #2563eb);\n  color: var(--ion-color-primary-shade, #2563eb);\n}\n.biometric-button:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.saved-accounts {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  scroll-padding-inline: 4px;\n  scroll-snap-stop: always;\n  -webkit-overflow-scrolling: touch;\n  padding: 4px 4px 10px;\n  margin: 0 -4px 8px;\n}\n.saved-account-card {\n  flex: 0 0 86%;\n  scroll-snap-align: start;\n  display: flex;\n  align-items: stretch;\n  min-height: 72px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n  overflow: hidden;\n  cursor: pointer;\n}\n.saved-accounts::-webkit-scrollbar {\n  height: 4px;\n}\n.saved-account-card:only-child {\n  flex-basis: 100%;\n}\n.saved-account-card.is-selected {\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.2);\n}\n.saved-account-main {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 8px 10px 12px;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.saved-account-main:hover:not(:disabled),\n.saved-account-main:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);\n}\n.saved-account-main:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.saved-account-main:disabled,\n.text-action:disabled,\n.saved-account-remove-btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.saved-account-avatar {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  font-weight: 700;\n}\n.saved-account-meta {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.saved-account-name {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--ion-text-color, #0f172a);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-email {\n  font-size: 0.8rem;\n  color: var(--ion-color-medium, #64748b);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-main ion-icon {\n  flex-shrink: 0;\n  font-size: 18px;\n  color: var(--ion-color-medium, #64748b);\n}\n.saved-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0 0 12px;\n}\n.saved-actions .text-action {\n  margin: 0;\n}\n.saved-accounts-manage {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin: 0 0 12px;\n  max-height: min(52vh, 420px);\n  overflow-y: auto;\n  padding: 2px;\n}\n.saved-account-manage-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 72px;\n  padding: 10px 12px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n}\n.saved-account-remove-btn {\n  flex-shrink: 0;\n  min-width: 44px;\n  min-height: 44px;\n  padding: 0.4rem 0.7rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--ion-color-danger, #eb445a);\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.saved-account-remove-btn:hover:not(:disabled),\n.saved-account-remove-btn:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);\n}\n.saved-account-remove-btn:focus-visible {\n  outline: 2px solid var(--ion-color-danger, #eb445a);\n  outline-offset: 2px;\n}\n.manage-empty {\n  margin: 0 0 12px;\n  text-align: center;\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.9rem;\n}\n.text-action {\n  display: block;\n  width: 100%;\n  margin: 0 0 12px;\n  padding: 0.4rem;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-primary, #2563eb);\n  font-size: 0.9rem;\n  cursor: pointer;\n}\n.text-action:hover:not(:disabled),\n.text-action:focus-visible:not(:disabled) {\n  text-decoration: underline;\n}\n.text-action:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n  border-radius: 6px;\n}\n.remember-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--ion-text-color, #1a202c);\n  cursor: pointer;\n}\n.remember-row input {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--ion-color-primary, #3b82f6);\n}\n.remember-row input:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.visually-hidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title {\n    font-size: 1.35rem;\n  }\n  .saved-account-card {\n    flex-basis: 88%;\n  }\n  .saved-account-card:only-child {\n    flex-basis: 100%;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .login-card {\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  }\n  .saved-account-card {\n    background: var(--ion-item-background, #1e293b);\n  }\n  .saved-account-manage-row {\n    background: var(--ion-item-background, #1e293b);\n  }\n}\n/*# sourceMappingURL=login.page.css.map */\n', "/* src/app/pages/alterar-senha/alterar-senha.page.scss */\n.alterar-senha-wrapper {\n  align-items: flex-start;\n}\n.field-label {\n  display: block;\n  margin: 0 0 0.35rem 0.15rem;\n  font-size: 0.85rem;\n  font-weight: 600;\n  color: var(--ion-text-color, #1a202c);\n}\n.password-field {\n  position: relative;\n}\n.password-hint {\n  margin: 0;\n  font-size: 0.8rem;\n  line-height: 1.4;\n  color: var(--ion-color-medium, #64748b);\n}\n/*# sourceMappingURL=alterar-senha.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AlterarSenhaPage, { className: "AlterarSenhaPage", filePath: "app/pages/alterar-senha/alterar-senha.page.ts", lineNumber: 36 });
})();
export {
  AlterarSenhaPage
};
//# sourceMappingURL=chunk-YZOZRBSA.js.map
