import {
  PasswordToggleButtonComponent
} from "./chunk-N57VEUIB.js";
import {
  addIcons,
  chevronForwardOutline,
  eyeOffOutline,
  eyeOutline,
  fingerPrintOutline
} from "./chunk-4KKD5W2S.js";
import {
  AuthService,
  ErrorMessageService
} from "./chunk-XXRWZG7R.js";
import {
  AlertController,
  CheckboxControlValueAccessor,
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
  NgModel,
  ReactiveFormsModule,
  RequiredValidator,
  Router,
  RouterLink,
  ToastController,
  Validators,
  ViewChild,
  inject,
  setClassMetadata,
  ɵNgNoValidate,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
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

// src/app/pages/login/login.page.ts
var _c0 = ["emailInput"];
var _c1 = ["passwordInput"];
var _c2 = ["savedAccountsList"];
var _c3 = () => ({ standalone: true });
var _forTrack0 = ($index, $item) => $item.email;
function LoginPage_Conditional_3_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "span", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 14)(4, "span", 15);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 16);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 17);
    \u0275\u0275listener("click", function LoginPage_Conditional_3_Conditional_5_For_2_Template_button_click_8_listener() {
      const account_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.confirmRemoveAccount(account_r3));
    });
    \u0275\u0275text(9, " Remover ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const account_r3 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.accountInitial(account_r3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(account_r3.nome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(account_r3.email);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
    \u0275\u0275attribute("aria-label", "Remover e-mail " + account_r3.email);
  }
}
function LoginPage_Conditional_3_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275repeaterCreate(1, LoginPage_Conditional_3_Conditional_5_For_2_Template, 10, 5, "div", 12, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r3.savedAccounts);
  }
}
function LoginPage_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 10);
    \u0275\u0275text(1, "Nenhum e-mail salvo neste aparelho.");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "h1", 7);
    \u0275\u0275text(2, "E-mails salvos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 8);
    \u0275\u0275text(4, "Veja a lista completa e remova os que n\xE3o quiser mais neste aparelho.");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, LoginPage_Conditional_3_Conditional_5_Template, 3, 0, "div", 9)(6, LoginPage_Conditional_3_Conditional_6_Template, 2, 0, "p", 10);
    \u0275\u0275elementStart(7, "button", 11);
    \u0275\u0275listener("click", function LoginPage_Conditional_3_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.closeSavedAccountsManager());
    });
    \u0275\u0275text(8, " Voltar ao login ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r3.savedAccounts.length > 0 ? 5 : 6);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
  }
}
function LoginPage_Conditional_4_Conditional_5_For_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_5_For_3_Template_div_click_0_listener() {
      const account_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectAccount(account_r8));
    });
    \u0275\u0275elementStart(1, "button", 35);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_5_For_3_Template_button_click_1_listener() {
      const account_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r3.selectAccount(account_r8));
    });
    \u0275\u0275elementStart(2, "span", 13);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 14)(5, "span", 15);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span", 16);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(9, "ion-icon", 36);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const account_r8 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275classProp("is-selected", ctx_r3.selectedEmail === account_r8.email);
    \u0275\u0275attribute("data-email", account_r8.email);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
    \u0275\u0275attribute("aria-pressed", ctx_r3.selectedEmail === account_r8.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.accountInitial(account_r8));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(account_r8.nome);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(account_r8.email);
  }
}
function LoginPage_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32, 1);
    \u0275\u0275listener("scroll", function LoginPage_Conditional_4_Conditional_5_Template_div_scroll_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onSavedAccountsScroll());
    });
    \u0275\u0275repeaterCreate(2, LoginPage_Conditional_4_Conditional_5_For_3_Template, 10, 8, "div", 33, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 30)(5, "button", 11);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_5_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.useOtherEmail());
    });
    \u0275\u0275text(6, " Usar outro e-mail ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 11);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_5_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.openSavedAccountsManager());
    });
    \u0275\u0275text(8, " Gerenciar e-mails ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r3.savedAccounts);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
  }
}
function LoginPage_Conditional_4_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "input", 19);
  }
}
function LoginPage_Conditional_4_Conditional_8_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Email \xE9 obrigat\xF3rio");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_8_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Email inv\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_8_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275conditionalCreate(1, LoginPage_Conditional_4_Conditional_8_Conditional_5_Conditional_1_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(2, LoginPage_Conditional_4_Conditional_8_Conditional_5_Conditional_2_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    const ctx_r3 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_5_0 = ctx_r3.loginForm.get("email")) == null ? null : tmp_5_0.errors == null ? null : tmp_5_0.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_6_0 = ctx_r3.loginForm.get("email")) == null ? null : tmp_6_0.errors == null ? null : tmp_6_0.errors["email"]) ? 2 : -1);
  }
}
function LoginPage_Conditional_4_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "input", 37, 2);
    \u0275\u0275elementStart(3, "label", 38);
    \u0275\u0275text(4, "E-mail");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, LoginPage_Conditional_4_Conditional_8_Conditional_5_Template, 3, 2, "div", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    let tmp_5_0;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("error", ((tmp_4_0 = ctx_r3.loginForm.get("email")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r3.loginForm.get("email")) == null ? null : tmp_4_0.touched));
    \u0275\u0275advance(4);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r3.loginForm.get("email")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r3.loginForm.get("email")) == null ? null : tmp_5_0.touched) ? 5 : -1);
  }
}
function LoginPage_Conditional_4_Conditional_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Senha \xE9 obrigat\xF3ria");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_15_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Senha deve ter no m\xEDnimo 6 caracteres");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 24);
    \u0275\u0275conditionalCreate(1, LoginPage_Conditional_4_Conditional_15_Conditional_1_Template, 2, 0, "span");
    \u0275\u0275conditionalCreate(2, LoginPage_Conditional_4_Conditional_15_Conditional_2_Template, 2, 0, "span");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_3_0 = ctx_r3.loginForm.get("password")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["required"]) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r3.loginForm.get("password")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["minlength"]) ? 2 : -1);
  }
}
function LoginPage_Conditional_4_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "label", 25)(1, "input", 39);
    \u0275\u0275twoWayListener("ngModelChange", function LoginPage_Conditional_4_Conditional_16_Template_input_ngModelChange_1_listener($event) {
      \u0275\u0275restoreView(_r9);
      const ctx_r3 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r3.rememberEmail, $event) || (ctx_r3.rememberEmail = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Lembrar e-mail neste aparelho");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.rememberEmail);
    \u0275\u0275property("ngModelOptions", \u0275\u0275pureFunction0(3, _c3))("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
  }
}
function LoginPage_Conditional_4_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r3.errorMessage);
  }
}
function LoginPage_Conditional_4_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275text(1, "Entrar");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 28);
    \u0275\u0275element(1, "ion-spinner", 40);
    \u0275\u0275text(2, " Entrando... ");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_21_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-icon", 42);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Entrar com digital");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_21_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 40);
    \u0275\u0275elementStart(1, "span");
    \u0275\u0275text(2, "Autenticando...");
    \u0275\u0275elementEnd();
  }
}
function LoginPage_Conditional_4_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.onBiometricLogin());
    });
    \u0275\u0275conditionalCreate(1, LoginPage_Conditional_4_Conditional_21_Conditional_1_Template, 3, 0);
    \u0275\u0275conditionalCreate(2, LoginPage_Conditional_4_Conditional_21_Conditional_2_Template, 3, 0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r3.isBiometricLoading ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.isBiometricLoading ? 2 : -1);
  }
}
function LoginPage_Conditional_4_Conditional_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30)(1, "button", 11);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_22_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.showSavedAccountList());
    });
    \u0275\u0275text(2, " Ver e-mails salvos ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "button", 11);
    \u0275\u0275listener("click", function LoginPage_Conditional_4_Conditional_22_Template_button_click_3_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.openSavedAccountsManager());
    });
    \u0275\u0275text(4, " Gerenciar e-mails ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
  }
}
function LoginPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6)(1, "h1", 7);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 8);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(5, LoginPage_Conditional_4_Conditional_5_Template, 9, 2);
    \u0275\u0275elementStart(6, "form", 18);
    \u0275\u0275listener("ngSubmit", function LoginPage_Conditional_4_Template_form_ngSubmit_6_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.onSubmit());
    });
    \u0275\u0275conditionalCreate(7, LoginPage_Conditional_4_Conditional_7_Template, 1, 0, "input", 19);
    \u0275\u0275conditionalCreate(8, LoginPage_Conditional_4_Conditional_8_Template, 6, 3, "div", 20);
    \u0275\u0275elementStart(9, "div", 20);
    \u0275\u0275element(10, "input", 21, 0);
    \u0275\u0275elementStart(12, "app-password-toggle-button", 22);
    \u0275\u0275listener("toggled", function LoginPage_Conditional_4_Template_app_password_toggle_button_toggled_12_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.togglePasswordVisibility());
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "label", 23);
    \u0275\u0275text(14, "Senha");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(15, LoginPage_Conditional_4_Conditional_15_Template, 3, 2, "div", 24);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(16, LoginPage_Conditional_4_Conditional_16_Template, 4, 4, "label", 25);
    \u0275\u0275conditionalCreate(17, LoginPage_Conditional_4_Conditional_17_Template, 2, 1, "div", 26);
    \u0275\u0275elementStart(18, "button", 27);
    \u0275\u0275conditionalCreate(19, LoginPage_Conditional_4_Conditional_19_Template, 2, 0, "span", 28);
    \u0275\u0275conditionalCreate(20, LoginPage_Conditional_4_Conditional_20_Template, 3, 0, "span", 28);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(21, LoginPage_Conditional_4_Conditional_21_Template, 3, 3, "button", 29);
    \u0275\u0275conditionalCreate(22, LoginPage_Conditional_4_Conditional_22_Template, 5, 2, "div", 30);
    \u0275\u0275elementStart(23, "a", 31);
    \u0275\u0275text(24, "Esqueci minha senha");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_12_0;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r3.showSavedAccounts ? "Que bom ter voc\xEA novamente!" : "Bem-vindo");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r3.showSavedAccounts ? "Escolha um e-mail salvo ou entre com outro." : "Entre com suas credenciais", " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.showSavedAccounts ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r3.loginForm);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.showSavedAccounts ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.showEmailField ? 8 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("error", ((tmp_8_0 = ctx_r3.loginForm.get("password")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r3.loginForm.get("password")) == null ? null : tmp_8_0.touched));
    \u0275\u0275property("type", ctx_r3.showPassword ? "text" : "password");
    \u0275\u0275advance(2);
    \u0275\u0275property("visible", ctx_r3.showPassword)("disabled", ctx_r3.isLoading || ctx_r3.isBiometricLoading);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(((tmp_12_0 = ctx_r3.loginForm.get("password")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx_r3.loginForm.get("password")) == null ? null : tmp_12_0.touched) ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.showEmailField ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.errorMessage ? 17 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.loginForm.invalid || ctx_r3.isLoading);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r3.isLoading ? 19 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.isLoading ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.showBiometricButton ? 21 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.usingOtherEmail && ctx_r3.savedAccounts.length > 0 ? 22 : -1);
  }
}
var LoginPage = class _LoginPage {
  formBuilder = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  toastController = inject(ToastController);
  alertController = inject(AlertController);
  errorMessageService = inject(ErrorMessageService);
  emailInput;
  passwordInput;
  savedAccountsList;
  loginForm;
  isLoading = false;
  isBiometricLoading = false;
  errorMessage = "";
  biometricAvailable = false;
  biometricEnabled = false;
  biometricEmail = null;
  savedAccounts = [];
  selectedEmail = null;
  usingOtherEmail = false;
  rememberEmail = true;
  showPassword = false;
  managingSavedEmails = false;
  scrollSyncTimer = null;
  ignoreScrollSync = false;
  constructor() {
    const pwdValidators = [Validators.required, Validators.minLength(6)];
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", pwdValidators]
    });
    addIcons({ fingerPrintOutline, chevronForwardOutline, eyeOutline, eyeOffOutline });
  }
  get showSavedAccounts() {
    return this.savedAccounts.length > 0 && !this.usingOtherEmail;
  }
  get showEmailField() {
    return !this.showSavedAccounts;
  }
  get showBiometricButton() {
    if (!this.biometricAvailable || !this.biometricEnabled || !this.biometricEmail) {
      return false;
    }
    return this.currentEmail === this.biometricEmail;
  }
  get currentEmail() {
    return this.authService.normalizeLoginEmail(this.loginForm.get("email")?.value ?? "");
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.bootstrapLoginState();
    });
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      this.errorMessage = "";
      this.isLoading = false;
      this.isBiometricLoading = false;
      this.showPassword = false;
      this.managingSavedEmails = false;
      this.loginForm.patchValue({ password: "" });
      yield this.bootstrapLoginState();
    });
  }
  selectAccount(account, options) {
    const emailChanged = this.selectedEmail !== account.email;
    this.usingOtherEmail = false;
    this.selectedEmail = account.email;
    this.loginForm.patchValue({
      email: account.email,
      password: emailChanged ? "" : this.loginForm.get("password")?.value
    });
    this.errorMessage = "";
    if (options?.scroll !== false) {
      this.scrollAccountIntoView(account.email);
    }
    this.focusPassword();
  }
  onSavedAccountsScroll() {
    if (this.ignoreScrollSync) {
      return;
    }
    if (this.scrollSyncTimer) {
      clearTimeout(this.scrollSyncTimer);
    }
    this.scrollSyncTimer = setTimeout(() => this.syncSelectedAccountFromScroll(), 80);
  }
  useOtherEmail() {
    this.usingOtherEmail = true;
    this.selectedEmail = null;
    this.loginForm.patchValue({ email: "", password: "" });
    this.focusEmail();
  }
  showSavedAccountList() {
    this.managingSavedEmails = false;
    this.usingOtherEmail = false;
    const first = this.savedAccounts[0];
    if (first) {
      this.selectAccount(first);
      return;
    }
    this.loginForm.patchValue({ email: "", password: "" });
  }
  openSavedAccountsManager() {
    this.managingSavedEmails = true;
    this.errorMessage = "";
  }
  closeSavedAccountsManager() {
    this.managingSavedEmails = false;
    if (this.savedAccounts.length === 0) {
      this.usingOtherEmail = true;
      this.selectedEmail = null;
      this.loginForm.patchValue({ email: "", password: "" });
      this.focusEmail();
      return;
    }
    if (this.usingOtherEmail) {
      return;
    }
    const current = this.savedAccounts.find((account) => account.email === this.selectedEmail) ?? this.savedAccounts[0];
    this.selectAccount(current);
  }
  confirmRemoveAccount(account) {
    return __async(this, null, function* () {
      const alert = yield this.alertController.create({
        header: "Remover e-mail salvo?",
        message: `O e-mail ${account.email} deixar\xE1 de aparecer nesta tela.`,
        buttons: [
          { text: "Cancelar", role: "cancel" },
          { text: "Remover", role: "confirm" }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role !== "confirm") {
        return;
      }
      this.savedAccounts = yield this.authService.removeSavedLoginAccount(account.email);
      if (this.selectedEmail === account.email) {
        const next = this.savedAccounts[0];
        if (next) {
          this.selectAccount(next, { scroll: false });
        } else {
          this.selectedEmail = null;
          this.loginForm.patchValue({ email: "", password: "" });
        }
      }
      if (this.savedAccounts.length === 0) {
        this.managingSavedEmails = false;
        this.usingOtherEmail = true;
        this.focusEmail();
      }
    });
  }
  accountInitial(account) {
    const source = account.nome?.trim() || account.email;
    return source.slice(0, 1).toUpperCase();
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
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
        const email = this.resolveLoginEmail();
        const password = this.loginForm.get("password").value;
        if (!email) {
          this.errorMessage = "Selecione um e-mail salvo ou informe outro.";
          return;
        }
        this.loginForm.patchValue({ email });
        yield this.authService.login(email, password, { navigate: false });
        yield this.persistRememberedAccount(email);
        yield this.maybeEnableBiometrics(email, password);
        yield this.router.navigate(["/home"], { replaceUrl: true });
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao fazer login. Tente novamente.");
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
      if (this.isBiometricLoading || this.isLoading || !this.showBiometricButton) {
        return;
      }
      this.isBiometricLoading = true;
      this.errorMessage = "";
      try {
        yield this.authService.loginWithBiometrics();
        const user = this.authService.getCurrentUser();
        if (user?.email) {
          yield this.persistRememberedAccount(user.email, user.nome);
        }
        yield this.router.navigate(["/home"], { replaceUrl: true });
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao autenticar com biometria. Tente novamente.");
        yield this.refreshBiometricState();
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
  bootstrapLoginState() {
    return __async(this, null, function* () {
      this.rememberEmail = yield this.authService.getRememberEmailPreference();
      this.savedAccounts = yield this.authService.listSavedLoginAccounts();
      yield this.refreshBiometricState();
      if (this.savedAccounts.length === 0) {
        this.usingOtherEmail = true;
        this.selectedEmail = null;
        this.loginForm.patchValue({ email: "", password: "" });
        return;
      }
      this.usingOtherEmail = false;
      const preferred = this.savedAccounts.find((account) => account.email === this.selectedEmail) ?? this.savedAccounts.find((account) => account.email === this.biometricEmail) ?? this.savedAccounts[0];
      this.selectAccount(preferred);
    });
  }
  resolveLoginEmail() {
    if (this.showSavedAccounts) {
      return this.authService.normalizeLoginEmail(this.selectedEmail ?? "");
    }
    return this.authService.normalizeLoginEmail(this.loginForm.get("email")?.value ?? "");
  }
  scrollAccountIntoView(email) {
    this.ignoreScrollSync = true;
    const scroll = () => {
      const container = this.savedAccountsList?.nativeElement;
      const card = container?.querySelector(`[data-email="${this.cssEscape(email)}"]`);
      card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      setTimeout(() => {
        this.ignoreScrollSync = false;
      }, 350);
    };
    setTimeout(scroll, 0);
  }
  syncSelectedAccountFromScroll() {
    const container = this.savedAccountsList?.nativeElement;
    if (!container || this.savedAccounts.length === 0) {
      return;
    }
    const containerLeft = container.getBoundingClientRect().left;
    let closestEmail = this.selectedEmail;
    let closestDistance = Number.POSITIVE_INFINITY;
    container.querySelectorAll(".saved-account-card").forEach((card) => {
      const email = card.dataset["email"];
      if (!email) {
        return;
      }
      const distance = Math.abs(card.getBoundingClientRect().left - containerLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestEmail = email;
      }
    });
    const account = this.savedAccounts.find((item) => item.email === closestEmail);
    if (account && account.email !== this.selectedEmail) {
      this.selectAccount(account, { scroll: false });
    }
  }
  cssEscape(value) {
    if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
      return CSS.escape(value);
    }
    return value.replace(/"/g, '\\"');
  }
  persistRememberedAccount(email, nome) {
    return __async(this, null, function* () {
      const shouldRemember = !this.usingOtherEmail || this.rememberEmail;
      yield this.authService.setRememberEmailPreference(shouldRemember);
      if (!shouldRemember) {
        return;
      }
      const user = this.authService.getCurrentUser();
      yield this.authService.rememberLoginAccount({
        email,
        nome: nome?.trim() || user?.nome?.trim() || email
      });
    });
  }
  refreshBiometricState() {
    return __async(this, null, function* () {
      this.biometricAvailable = yield this.authService.isBiometricAvailable();
      this.biometricEnabled = yield this.authService.isBiometricEnabled();
      this.biometricEmail = yield this.authService.getBiometricEmail();
    });
  }
  focusPassword() {
    setTimeout(() => this.passwordInput?.nativeElement.focus(), 0);
  }
  focusEmail() {
    setTimeout(() => this.emailInput?.nativeElement.focus(), 0);
  }
  maybeEnableBiometrics(email, password) {
    return __async(this, null, function* () {
      yield this.refreshBiometricState();
      if (!this.biometricAvailable || this.biometricEnabled) {
        return;
      }
      if (yield this.authService.isBiometricPromptHidden(email)) {
        return;
      }
      const alert = yield this.alertController.create({
        header: "Ativar login por digital?",
        message: "Voc\xEA poder\xE1 entrar mais r\xE1pido usando a biometria.",
        inputs: [
          {
            type: "checkbox",
            label: "N\xE3o mostrar novamente",
            value: "hide",
            checked: false
          }
        ],
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
      const { role, data } = yield alert.onDidDismiss();
      if (role === "confirm") {
        const enabled = yield this.authService.enableBiometricLogin(email, password);
        this.biometricEnabled = enabled;
        this.biometricEmail = enabled ? this.authService.normalizeLoginEmail(email) : this.biometricEmail;
        return;
      }
      if (this.shouldHideBiometricPrompt(data)) {
        yield this.authService.hideBiometricPrompt(email);
      }
    });
  }
  shouldHideBiometricPrompt(data) {
    if (!data || typeof data !== "object") {
      return false;
    }
    const values = data.values;
    return Array.isArray(values) && values.includes("hide");
  }
  static \u0275fac = function LoginPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LoginPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoginPage, selectors: [["app-login"]], viewQuery: function LoginPage_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
      \u0275\u0275viewQuery(_c1, 5);
      \u0275\u0275viewQuery(_c2, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.emailInput = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.passwordInput = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.savedAccountsList = _t.first);
    }
  }, decls: 5, vars: 2, consts: [["passwordInput", ""], ["savedAccountsList", ""], ["emailInput", ""], [3, "fullscreen"], [1, "login-wrapper"], [1, "login-card"], [1, "login-header"], [1, "login-title"], [1, "login-subtitle"], ["role", "list", "aria-label", "Lista de e-mails salvos", 1, "saved-accounts-manage"], [1, "manage-empty"], ["type", "button", 1, "text-action", 3, "click", "disabled"], ["role", "listitem", 1, "saved-account-manage-row"], ["aria-hidden", "true", 1, "saved-account-avatar"], [1, "saved-account-meta"], [1, "saved-account-name"], [1, "saved-account-email"], ["type", "button", 1, "saved-account-remove-btn", 3, "click", "disabled"], [1, "login-form", 3, "ngSubmit", "formGroup"], ["type", "email", "formControlName", "email", "tabindex", "-1", "autocomplete", "username", "readonly", "", "aria-hidden", "true", 1, "visually-hidden"], [1, "input-group"], ["id", "password", "formControlName", "password", "placeholder", "Senha", "autocomplete", "current-password", "required", "", 1, "form-input", "form-input-with-toggle", 3, "type"], [3, "toggled", "visible", "disabled"], ["for", "password", 1, "form-label"], [1, "error-message"], [1, "remember-row"], [1, "alert-error"], ["type", "submit", 1, "login-button", 3, "disabled"], [1, "button-text"], ["type", "button", 1, "biometric-button", 3, "disabled"], [1, "saved-actions"], ["routerLink", "/redefinir-senha", 1, "forgot-link"], ["role", "list", "aria-label", "E-mails salvos", 1, "saved-accounts", 3, "scroll"], ["role", "listitem", 1, "saved-account-card", 3, "is-selected"], ["role", "listitem", 1, "saved-account-card", 3, "click"], ["type", "button", 1, "saved-account-main", 3, "click", "disabled"], ["name", "chevron-forward-outline", "aria-hidden", "true"], ["type", "email", "id", "email", "name", "username", "formControlName", "email", "placeholder", "Email", "autocomplete", "username", "inputmode", "email", "autocapitalize", "off", "autocorrect", "off", "spellcheck", "false", "required", "", 1, "form-input"], ["for", "email", 1, "form-label"], ["type", "checkbox", 3, "ngModelChange", "ngModel", "ngModelOptions", "disabled"], ["name", "crescent"], ["type", "button", 1, "biometric-button", 3, "click", "disabled"], ["name", "finger-print-outline", "aria-hidden", "true"]], template: function LoginPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-content", 3)(1, "div", 4)(2, "div", 5);
      \u0275\u0275conditionalCreate(3, LoginPage_Conditional_3_Template, 9, 2)(4, LoginPage_Conditional_4_Template, 25, 19);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.managingSavedEmails ? 3 : 4);
    }
  }, dependencies: [
    CommonModule,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    CheckboxControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    ReactiveFormsModule,
    FormGroupDirective,
    FormControlName,
    IonContent,
    IonSpinner,
    IonIcon,
    RouterLink,
    PasswordToggleButtonComponent
  ], styles: ['\n\n.login-wrapper[_ngcontent-%COMP%] {\n  padding: calc(1rem + var(--ion-safe-area-top, 0px)) 1rem calc(1rem + var(--ion-safe-area-bottom, 0px));\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card[_ngcontent-%COMP%] {\n  background: var(--ion-card-background, var(--ion-background-color, #ffffff));\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  box-sizing: border-box;\n  animation: _ngcontent-%COMP%_fadeInUp 0.5s ease-out;\n}\n.login-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--ion-text-color, #1a202c);\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle[_ngcontent-%COMP%] {\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.form-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-text-color, #1a202c);\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb, 59, 130, 246), 0.15);\n}\n.form-input[_ngcontent-%COMP%]:disabled {\n  opacity: 0.65;\n  cursor: not-allowed;\n}\n.form-input-with-toggle[_ngcontent-%COMP%] {\n  padding-right: 3rem;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.password-toggle[_ngcontent-%COMP%]:hover:not(:disabled), \n.password-toggle[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.form-input.error[_ngcontent-%COMP%] {\n  border-color: var(--ion-color-danger, #ef4444);\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input[_ngcontent-%COMP%]::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message[_ngcontent-%COMP%] {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error[_ngcontent-%COMP%] {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button[_ngcontent-%COMP%]:hover:not(:disabled), \n.login-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: var(--ion-color-primary-shade, #2563eb);\n}\n.login-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.button-text[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link[_ngcontent-%COMP%] {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: var(--ion-color-primary, #2563eb);\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link[_ngcontent-%COMP%]:hover, \n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  text-decoration: underline;\n}\n.forgot-link[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.biometric-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid var(--ion-color-primary, #3b82f6);\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-color-primary, #1d4ed8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button[_ngcontent-%COMP%]:hover:not(:disabled), \n.biometric-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  border-color: var(--ion-color-primary-shade, #2563eb);\n  color: var(--ion-color-primary-shade, #2563eb);\n}\n.biometric-button[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.saved-accounts[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  scroll-padding-inline: 4px;\n  scroll-snap-stop: always;\n  -webkit-overflow-scrolling: touch;\n  padding: 4px 4px 10px;\n  margin: 0 -4px 8px;\n}\n.saved-account-card[_ngcontent-%COMP%] {\n  flex: 0 0 86%;\n  scroll-snap-align: start;\n  display: flex;\n  align-items: stretch;\n  min-height: 72px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n  overflow: hidden;\n  cursor: pointer;\n}\n.saved-accounts[_ngcontent-%COMP%]::-webkit-scrollbar {\n  height: 4px;\n}\n.saved-account-card[_ngcontent-%COMP%]:only-child {\n  flex-basis: 100%;\n}\n.saved-account-card.is-selected[_ngcontent-%COMP%] {\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.2);\n}\n.saved-account-main[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 8px 10px 12px;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.saved-account-main[_ngcontent-%COMP%]:hover:not(:disabled), \n.saved-account-main[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);\n}\n.saved-account-main[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.saved-account-main[_ngcontent-%COMP%]:disabled, \n.text-action[_ngcontent-%COMP%]:disabled, \n.saved-account-remove-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.saved-account-avatar[_ngcontent-%COMP%] {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  font-weight: 700;\n}\n.saved-account-meta[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.saved-account-name[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--ion-text-color, #0f172a);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-email[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--ion-color-medium, #64748b);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-main[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 18px;\n  color: var(--ion-color-medium, #64748b);\n}\n.saved-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0 0 12px;\n}\n.saved-actions[_ngcontent-%COMP%]   .text-action[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.saved-accounts-manage[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin: 0 0 12px;\n  max-height: min(52vh, 420px);\n  overflow-y: auto;\n  padding: 2px;\n}\n.saved-account-manage-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 72px;\n  padding: 10px 12px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n}\n.saved-account-remove-btn[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  min-width: 44px;\n  min-height: 44px;\n  padding: 0.4rem 0.7rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--ion-color-danger, #eb445a);\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.saved-account-remove-btn[_ngcontent-%COMP%]:hover:not(:disabled), \n.saved-account-remove-btn[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);\n}\n.saved-account-remove-btn[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-danger, #eb445a);\n  outline-offset: 2px;\n}\n.manage-empty[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  text-align: center;\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.9rem;\n}\n.text-action[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  margin: 0 0 12px;\n  padding: 0.4rem;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-primary, #2563eb);\n  font-size: 0.9rem;\n  cursor: pointer;\n}\n.text-action[_ngcontent-%COMP%]:hover:not(:disabled), \n.text-action[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  text-decoration: underline;\n}\n.text-action[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n  border-radius: 6px;\n}\n.remember-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--ion-text-color, #1a202c);\n  cursor: pointer;\n}\n.remember-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--ion-color-primary, #3b82f6);\n}\n.remember-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.visually-hidden[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title[_ngcontent-%COMP%] {\n    font-size: 1.35rem;\n  }\n  .saved-account-card[_ngcontent-%COMP%] {\n    flex-basis: 88%;\n  }\n  .saved-account-card[_ngcontent-%COMP%]:only-child {\n    flex-basis: 100%;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .login-card[_ngcontent-%COMP%] {\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  }\n  .saved-account-card[_ngcontent-%COMP%] {\n    background: var(--ion-item-background, #1e293b);\n  }\n  .saved-account-manage-row[_ngcontent-%COMP%] {\n    background: var(--ion-item-background, #1e293b);\n  }\n}\n/*# sourceMappingURL=login.page.css.map */'] });
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
      IonIcon,
      RouterLink,
      PasswordToggleButtonComponent
    ], template: `<ion-content [fullscreen]="true">
  <div class="login-wrapper">
    <div class="login-card">
      @if (managingSavedEmails) {
        <div class="login-header">
          <h1 class="login-title">E-mails salvos</h1>
          <p class="login-subtitle">Veja a lista completa e remova os que n\xE3o quiser mais neste aparelho.</p>
        </div>

        @if (savedAccounts.length > 0) {
          <div class="saved-accounts-manage" role="list" aria-label="Lista de e-mails salvos">
            @for (account of savedAccounts; track account.email) {
              <div class="saved-account-manage-row" role="listitem">
                <span class="saved-account-avatar" aria-hidden="true">{{ accountInitial(account) }}</span>
                <span class="saved-account-meta">
                  <span class="saved-account-name">{{ account.nome }}</span>
                  <span class="saved-account-email">{{ account.email }}</span>
                </span>
                <button
                  type="button"
                  class="saved-account-remove-btn"
                  [disabled]="isLoading || isBiometricLoading"
                  [attr.aria-label]="'Remover e-mail ' + account.email"
                  (click)="confirmRemoveAccount(account)"
                >
                  Remover
                </button>
              </div>
            }
          </div>
        } @else {
          <p class="manage-empty">Nenhum e-mail salvo neste aparelho.</p>
        }

        <button
          type="button"
          class="text-action"
          [disabled]="isLoading || isBiometricLoading"
          (click)="closeSavedAccountsManager()"
        >
          Voltar ao login
        </button>
      } @else {
      <div class="login-header">
        <h1 class="login-title">{{ showSavedAccounts ? 'Que bom ter voc\xEA novamente!' : 'Bem-vindo' }}</h1>
        <p class="login-subtitle">
          {{ showSavedAccounts ? 'Escolha um e-mail salvo ou entre com outro.' : 'Entre com suas credenciais' }}
        </p>
      </div>

      @if (showSavedAccounts) {
        <div
          #savedAccountsList
          class="saved-accounts"
          role="list"
          aria-label="E-mails salvos"
          (scroll)="onSavedAccountsScroll()"
        >
          @for (account of savedAccounts; track account.email) {
            <div
              class="saved-account-card"
              role="listitem"
              [attr.data-email]="account.email"
              [class.is-selected]="selectedEmail === account.email"
              (click)="selectAccount(account)"
            >
              <button
                type="button"
                class="saved-account-main"
                [attr.aria-pressed]="selectedEmail === account.email"
                [disabled]="isLoading || isBiometricLoading"
                (click)="selectAccount(account)"
              >
                <span class="saved-account-avatar" aria-hidden="true">{{ accountInitial(account) }}</span>
                <span class="saved-account-meta">
                  <span class="saved-account-name">{{ account.nome }}</span>
                  <span class="saved-account-email">{{ account.email }}</span>
                </span>
                <ion-icon name="chevron-forward-outline" aria-hidden="true"></ion-icon>
              </button>
            </div>
          }
        </div>
        <div class="saved-actions">
          <button
            type="button"
            class="text-action"
            [disabled]="isLoading || isBiometricLoading"
            (click)="useOtherEmail()"
          >
            Usar outro e-mail
          </button>
          <button
            type="button"
            class="text-action"
            [disabled]="isLoading || isBiometricLoading"
            (click)="openSavedAccountsManager()"
          >
            Gerenciar e-mails
          </button>
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        @if (showSavedAccounts) {
          <input
            type="email"
            formControlName="email"
            class="visually-hidden"
            tabindex="-1"
            autocomplete="username"
            readonly
            aria-hidden="true"
          />
        }
        @if (showEmailField) {
          <div class="input-group">
            <input
              #emailInput
              type="email"
              id="email"
              name="username"
              formControlName="email"
              class="form-input"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Email"
              autocomplete="username"
              inputmode="email"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              required
            />
            <label for="email" class="form-label">E-mail</label>
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="error-message">
                @if (loginForm.get('email')?.errors?.['required']) {
                  <span>Email \xE9 obrigat\xF3rio</span>
                }
                @if (loginForm.get('email')?.errors?.['email']) {
                  <span>Email inv\xE1lido</span>
                }
              </div>
            }
          </div>
        }

        <div class="input-group">
          <input
            #passwordInput
            [type]="showPassword ? 'text' : 'password'"
            id="password"
            formControlName="password"
            class="form-input form-input-with-toggle"
            [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            placeholder="Senha"
            autocomplete="current-password"
            required
          />
          <app-password-toggle-button
            [visible]="showPassword"
            [disabled]="isLoading || isBiometricLoading"
            (toggled)="togglePasswordVisibility()"
          />
          <label for="password" class="form-label">Senha</label>
          @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
            <div class="error-message">
              @if (loginForm.get('password')?.errors?.['required']) {
                <span>Senha \xE9 obrigat\xF3ria</span>
              }
              @if (loginForm.get('password')?.errors?.['minlength']) {
                <span>Senha deve ter no m\xEDnimo 6 caracteres</span>
              }
            </div>
          }
        </div>

        @if (showEmailField) {
          <label class="remember-row">
            <input
              type="checkbox"
              [(ngModel)]="rememberEmail"
              [ngModelOptions]="{ standalone: true }"
              [disabled]="isLoading || isBiometricLoading"
            />
            <span>Lembrar e-mail neste aparelho</span>
          </label>
        }

        @if (errorMessage) {
          <div class="alert-error">{{ errorMessage }}</div>
        }

        <button type="submit" class="login-button" [disabled]="loginForm.invalid || isLoading">
          @if (!isLoading) {
            <span class="button-text">Entrar</span>
          }
          @if (isLoading) {
            <span class="button-text">
              <ion-spinner name="crescent"></ion-spinner>
              Entrando...
            </span>
          }
        </button>

        @if (showBiometricButton) {
          <button
            type="button"
            class="biometric-button"
            (click)="onBiometricLogin()"
            [disabled]="isLoading || isBiometricLoading"
          >
            @if (!isBiometricLoading) {
              <ion-icon name="finger-print-outline" aria-hidden="true"></ion-icon>
              <span>Entrar com digital</span>
            }
            @if (isBiometricLoading) {
              <ion-spinner name="crescent"></ion-spinner>
              <span>Autenticando...</span>
            }
          </button>
        }

        @if (usingOtherEmail && savedAccounts.length > 0) {
          <div class="saved-actions">
            <button
              type="button"
              class="text-action"
              [disabled]="isLoading || isBiometricLoading"
              (click)="showSavedAccountList()"
            >
              Ver e-mails salvos
            </button>
            <button
              type="button"
              class="text-action"
              [disabled]="isLoading || isBiometricLoading"
              (click)="openSavedAccountsManager()"
            >
              Gerenciar e-mails
            </button>
          </div>
        }

        <a routerLink="/redefinir-senha" class="forgot-link">Esqueci minha senha</a>
      </form>
      }
    </div>
  </div>
</ion-content>
`, styles: ['/* src/app/pages/login/login.page.scss */\n.login-wrapper {\n  padding: calc(1rem + var(--ion-safe-area-top, 0px)) 1rem calc(1rem + var(--ion-safe-area-bottom, 0px));\n  font-family:\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    sans-serif;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-card {\n  background: var(--ion-card-background, var(--ion-background-color, #ffffff));\n  padding: 2rem;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  width: 100%;\n  max-width: 520px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  box-sizing: border-box;\n  animation: fadeInUp 0.5s ease-out;\n}\n.login-header {\n  text-align: center;\n  margin-bottom: 1rem;\n}\n.login-title {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: var(--ion-text-color, #1a202c);\n  margin: 0 0 0.25rem 0;\n  letter-spacing: -0.025em;\n}\n.login-subtitle {\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.85rem;\n  margin: 0;\n  font-weight: 400;\n}\n.login-form {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  width: 100%;\n}\n.input-group {\n  position: relative;\n  width: 100%;\n}\n.form-input {\n  width: 100%;\n  padding: 0.8rem 1.2rem;\n  border: 2px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 8px;\n  font-size: 1rem;\n  transition: all 0.2s ease-in-out;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-text-color, #1a202c);\n  box-sizing: border-box;\n  min-height: 45px;\n}\n.form-input:focus {\n  outline: none;\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 3px rgba(var(--ion-color-primary-rgb, 59, 130, 246), 0.15);\n}\n.form-input:disabled {\n  opacity: 0.65;\n  cursor: not-allowed;\n}\n.form-input-with-toggle {\n  padding-right: 3rem;\n}\n.password-toggle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle ion-icon {\n  font-size: 1.25rem;\n}\n.password-toggle:hover:not(:disabled),\n.password-toggle:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.form-input.error {\n  border-color: var(--ion-color-danger, #ef4444);\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.form-input::placeholder {\n  color: #9ca3af;\n  opacity: 1;\n}\n.form-label {\n  position: absolute;\n  left: -9999px;\n  opacity: 0;\n}\n.error-message {\n  color: #ef4444;\n  font-size: 0.875rem;\n  margin-top: 0.5rem;\n  margin-left: 0.25rem;\n}\n.alert-error {\n  background-color: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem;\n  border-radius: 8px;\n  font-size: 0.875rem;\n  text-align: center;\n}\n.login-button {\n  width: 100%;\n  padding: 0.8rem;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  border: none;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n  min-height: 45px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: 0.25rem;\n}\n.login-button:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n  box-shadow: none;\n}\n.login-button:hover:not(:disabled),\n.login-button:focus-visible:not(:disabled) {\n  background: var(--ion-color-primary-shade, #2563eb);\n}\n.login-button:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.button-text {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.forgot-link {\n  display: block;\n  text-align: center;\n  margin: 0.75rem 0 0.25rem 0;\n  font-size: 0.9rem;\n  color: var(--ion-color-primary, #2563eb);\n  text-decoration: none;\n  padding: 0.35rem 0.5rem;\n  border-radius: 6px;\n}\n.forgot-link:hover,\n.forgot-link:focus-visible {\n  text-decoration: underline;\n}\n.forgot-link:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.biometric-button {\n  width: 100%;\n  padding: 0.8rem;\n  border: 1px solid var(--ion-color-primary, #3b82f6);\n  border-radius: 8px;\n  font-size: 0.95rem;\n  background: var(--ion-background-color, #ffffff);\n  color: var(--ion-color-primary, #1d4ed8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  transition: all 0.2s ease-in-out;\n}\n.biometric-button:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.biometric-button:hover:not(:disabled),\n.biometric-button:focus-visible:not(:disabled) {\n  border-color: var(--ion-color-primary-shade, #2563eb);\n  color: var(--ion-color-primary-shade, #2563eb);\n}\n.biometric-button:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.saved-accounts {\n  display: flex;\n  gap: 12px;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  scroll-padding-inline: 4px;\n  scroll-snap-stop: always;\n  -webkit-overflow-scrolling: touch;\n  padding: 4px 4px 10px;\n  margin: 0 -4px 8px;\n}\n.saved-account-card {\n  flex: 0 0 86%;\n  scroll-snap-align: start;\n  display: flex;\n  align-items: stretch;\n  min-height: 72px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n  overflow: hidden;\n  cursor: pointer;\n}\n.saved-accounts::-webkit-scrollbar {\n  height: 4px;\n}\n.saved-account-card:only-child {\n  flex-basis: 100%;\n}\n.saved-account-card.is-selected {\n  border-color: var(--ion-color-primary, #3b82f6);\n  box-shadow: 0 0 0 2px rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.2);\n}\n.saved-account-main {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 8px 10px 12px;\n  border: 0;\n  background: transparent;\n  color: inherit;\n  text-align: left;\n  cursor: pointer;\n}\n.saved-account-main:hover:not(:disabled),\n.saved-account-main:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.08);\n}\n.saved-account-main:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.saved-account-main:disabled,\n.text-action:disabled,\n.saved-account-remove-btn:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n.saved-account-avatar {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--ion-color-primary, #3b82f6);\n  color: var(--ion-color-primary-contrast, #ffffff);\n  font-weight: 700;\n}\n.saved-account-meta {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.saved-account-name {\n  font-weight: 700;\n  font-size: 0.95rem;\n  color: var(--ion-text-color, #0f172a);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-email {\n  font-size: 0.8rem;\n  color: var(--ion-color-medium, #64748b);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.saved-account-main ion-icon {\n  flex-shrink: 0;\n  font-size: 18px;\n  color: var(--ion-color-medium, #64748b);\n}\n.saved-actions {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  margin: 0 0 12px;\n}\n.saved-actions .text-action {\n  margin: 0;\n}\n.saved-accounts-manage {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  margin: 0 0 12px;\n  max-height: min(52vh, 420px);\n  overflow-y: auto;\n  padding: 2px;\n}\n.saved-account-manage-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 72px;\n  padding: 10px 12px;\n  border: 1px solid var(--ion-border-color, #e2e8f0);\n  border-radius: 14px;\n  background: var(--ion-item-background, var(--ion-background-color, #ffffff));\n}\n.saved-account-remove-btn {\n  flex-shrink: 0;\n  min-width: 44px;\n  min-height: 44px;\n  padding: 0.4rem 0.7rem;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--ion-color-danger, #eb445a);\n  font-size: 0.85rem;\n  font-weight: 600;\n  cursor: pointer;\n}\n.saved-account-remove-btn:hover:not(:disabled),\n.saved-account-remove-btn:focus-visible:not(:disabled) {\n  background: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);\n}\n.saved-account-remove-btn:focus-visible {\n  outline: 2px solid var(--ion-color-danger, #eb445a);\n  outline-offset: 2px;\n}\n.manage-empty {\n  margin: 0 0 12px;\n  text-align: center;\n  color: var(--ion-color-medium, #64748b);\n  font-size: 0.9rem;\n}\n.text-action {\n  display: block;\n  width: 100%;\n  margin: 0 0 12px;\n  padding: 0.4rem;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-primary, #2563eb);\n  font-size: 0.9rem;\n  cursor: pointer;\n}\n.text-action:hover:not(:disabled),\n.text-action:focus-visible:not(:disabled) {\n  text-decoration: underline;\n}\n.text-action:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n  border-radius: 6px;\n}\n.remember-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.9rem;\n  color: var(--ion-text-color, #1a202c);\n  cursor: pointer;\n}\n.remember-row input {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--ion-color-primary, #3b82f6);\n}\n.remember-row input:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: 2px;\n}\n.visually-hidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 480px) {\n  .login-card {\n    padding: 1.5rem;\n    max-width: 100%;\n  }\n  .login-title {\n    font-size: 1.35rem;\n  }\n  .saved-account-card {\n    flex-basis: 88%;\n  }\n  .saved-account-card:only-child {\n    flex-basis: 100%;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .login-card {\n    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);\n  }\n  .saved-account-card {\n    background: var(--ion-item-background, #1e293b);\n  }\n  .saved-account-manage-row {\n    background: var(--ion-item-background, #1e293b);\n  }\n}\n/*# sourceMappingURL=login.page.css.map */\n'] }]
  }], () => [], { emailInput: [{
    type: ViewChild,
    args: ["emailInput"]
  }], passwordInput: [{
    type: ViewChild,
    args: ["passwordInput"]
  }], savedAccountsList: [{
    type: ViewChild,
    args: ["savedAccountsList"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoginPage, { className: "LoginPage", filePath: "app/pages/login/login.page.ts", lineNumber: 35 });
})();
export {
  LoginPage
};
//# sourceMappingURL=chunk-R72UTCBD.js.map
