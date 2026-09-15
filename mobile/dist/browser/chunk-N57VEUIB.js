import {
  addIcons,
  eyeOffOutline,
  eyeOutline
} from "./chunk-4KKD5W2S.js";
import {
  Component,
  EventEmitter,
  Input,
  IonIcon,
  Output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵproperty
} from "./chunk-TLQ76MG3.js";

// src/app/components/password-toggle-button.component.ts
var PasswordToggleButtonComponent = class _PasswordToggleButtonComponent {
  visible = false;
  disabled = false;
  showLabel = "Mostrar senha";
  hideLabel = "Ocultar senha";
  toggled = new EventEmitter();
  constructor() {
    addIcons({ eyeOutline, eyeOffOutline });
  }
  static \u0275fac = function PasswordToggleButtonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PasswordToggleButtonComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PasswordToggleButtonComponent, selectors: [["app-password-toggle-button"]], inputs: { visible: "visible", disabled: "disabled", showLabel: "showLabel", hideLabel: "hideLabel" }, outputs: { toggled: "toggled" }, decls: 2, vars: 4, consts: [["type", "button", 1, "password-toggle", 3, "click", "disabled"], ["aria-hidden", "true", 3, "name"]], template: function PasswordToggleButtonComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "button", 0);
      \u0275\u0275listener("click", function PasswordToggleButtonComponent_Template_button_click_0_listener() {
        return ctx.toggled.emit();
      });
      \u0275\u0275element(1, "ion-icon", 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("disabled", ctx.disabled);
      \u0275\u0275attribute("aria-label", ctx.visible ? ctx.hideLabel : ctx.showLabel)("aria-pressed", ctx.visible);
      \u0275\u0275advance();
      \u0275\u0275property("name", ctx.visible ? "eye-off-outline" : "eye-outline");
    }
  }, dependencies: [IonIcon], styles: ["\n\n[_nghost-%COMP%] {\n  display: contents;\n}\n.password-toggle[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n}\n.password-toggle[_ngcontent-%COMP%]:hover:not(:disabled), \n.password-toggle[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle[_ngcontent-%COMP%]:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=password-toggle-button.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PasswordToggleButtonComponent, [{
    type: Component,
    args: [{ selector: "app-password-toggle-button", standalone: true, imports: [IonIcon], template: `
    <button
      type="button"
      class="password-toggle"
      [attr.aria-label]="visible ? hideLabel : showLabel"
      [attr.aria-pressed]="visible"
      [disabled]="disabled"
      (click)="toggled.emit()"
    >
      <ion-icon
        [name]="visible ? 'eye-off-outline' : 'eye-outline'"
        aria-hidden="true"
      ></ion-icon>
    </button>
  `, styles: ["/* angular:styles/component:css;e07428a0bec8490e0fc719e618fc37c88448422ecfe7e085cd6f626390709484;C:/PROJETOS/OMNI/mobile/src/app/components/password-toggle-button.component.ts */\n:host {\n  display: contents;\n}\n.password-toggle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 44px;\n  height: 45px;\n  border: 0;\n  background: transparent;\n  color: var(--ion-color-medium, #64748b);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 8px;\n}\n.password-toggle ion-icon {\n  font-size: 1.25rem;\n}\n.password-toggle:hover:not(:disabled),\n.password-toggle:focus-visible:not(:disabled) {\n  color: var(--ion-color-primary, #2563eb);\n}\n.password-toggle:focus-visible {\n  outline: 2px solid var(--ion-color-primary, #3b82f6);\n  outline-offset: -2px;\n}\n.password-toggle:disabled {\n  opacity: 0.55;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=password-toggle-button.component.css.map */\n"] }]
  }], () => [], { visible: [{
    type: Input
  }], disabled: [{
    type: Input
  }], showLabel: [{
    type: Input
  }], hideLabel: [{
    type: Input
  }], toggled: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PasswordToggleButtonComponent, { className: "PasswordToggleButtonComponent", filePath: "app/components/password-toggle-button.component.ts", lineNumber: 66 });
})();

export {
  PasswordToggleButtonComponent
};
//# sourceMappingURL=chunk-N57VEUIB.js.map
