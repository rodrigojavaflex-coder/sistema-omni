import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LU64LGPG.js";
import {
  AlertController,
  AuthService,
  Component,
  ErrorMessageService,
  FormsModule,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NgControlStatus,
  NgIf,
  NgModel,
  Router,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-KKQO7KIV.js";
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

// src/app/pages/vistoria/vistoria-finalizar.page.ts
function VistoriaFinalizarPage_div_11_div_29_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const detalhe_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(detalhe_r1);
  }
}
function VistoriaFinalizarPage_div_11_div_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "p")(2, "strong");
    \u0275\u0275text(3, "Detalhes:");
    \u0275\u0275elementEnd()();
    \u0275\u0275repeaterCreate(4, VistoriaFinalizarPage_div_11_div_29_For_5_Template, 2, 1, "p", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.resumoIrregularidadesDetalhes);
  }
}
function VistoriaFinalizarPage_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "p")(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p")(6, "strong");
    \u0275\u0275text(7, "Vistoriador:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "strong");
    \u0275\u0275text(11, "Ve\xEDculo vistoriado:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p")(14, "strong");
    \u0275\u0275text(15, "Motorista:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p")(18, "strong");
    \u0275\u0275text(19, "Od\xF4metro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "p")(22, "strong");
    \u0275\u0275text(23, "% Bateria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(24);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "p")(26, "strong");
    \u0275\u0275text(27, "Irregularidades identificadas:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(28);
    \u0275\u0275elementEnd();
    \u0275\u0275template(29, VistoriaFinalizarPage_div_11_div_29_Template, 6, 0, "div", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVistoriaNumero);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVistoriador);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoVeiculo);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoMotorista);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoOdometro);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoBateria);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.resumoIrregularidades);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.resumoIrregularidadesDetalhes.length > 0);
  }
}
function VistoriaFinalizarPage_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "p");
    \u0275\u0275text(2, "Carregando resumo da vistoria...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaFinalizarPage_ion_text_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 16)(1, "p", 17);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaFinalizarPage_ion_spinner_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 18);
  }
}
function VistoriaFinalizarPage_span_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Finalizar Vistoria");
    \u0275\u0275elementEnd();
  }
}
var VistoriaFinalizarPage = class _VistoriaFinalizarPage {
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  router = inject(Router);
  authService = inject(AuthService);
  errorMessageService = inject(ErrorMessageService);
  alertController = inject(AlertController);
  observacao = "";
  tempoMinutos = 0;
  isSaving = false;
  loadingResumo = false;
  errorMessage = "";
  resumoVistoriador = "-";
  resumoVeiculo = "-";
  resumoMotorista = "-";
  resumoOdometro = "-";
  resumoBateria = "-";
  resumoIrregularidades = 0;
  resumoIrregularidadesDetalhes = [];
  get vistoriaNrDisplay() {
    const nr = this.flowService.getNumeroVistoriaDisplay();
    return nr ? `Vistoria - ${nr}` : "Vistoria";
  }
  get veiculoDisplay() {
    const veiculo = this.flowService.getVeiculoDescricao();
    return veiculo ? `Ve\xEDculo ${veiculo}` : "Ve\xEDculo -";
  }
  get resumoVistoriaNumero() {
    return this.flowService.getNumeroVistoriaDisplay() || "-";
  }
  ngOnInit() {
    return __async(this, null, function* () {
      this.tempoMinutos = this.flowService.getTempoEmMinutos();
      yield this.carregarResumo();
    });
  }
  voltar() {
    this.router.navigate(["/vistoria/areas"]);
  }
  finalizar() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.isSaving = true;
      this.errorMessage = "";
      try {
        yield this.vistoriaService.finalizarVistoria(vistoriaId, {
          tempo: this.tempoMinutos,
          observacao: this.observacao?.trim() || void 0
        });
        yield this.mostrarResumoConclusao();
        this.flowService.finalizar();
        this.router.navigate(["/home"]);
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao finalizar vistoria. Tente novamente.");
      } finally {
        this.isSaving = false;
      }
    });
  }
  carregarResumo() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId)
        return;
      this.loadingResumo = true;
      try {
        const [vistoria, irregularidades] = yield Promise.all([
          this.vistoriaService.getById(vistoriaId),
          this.vistoriaService.listarIrregularidades(vistoriaId)
        ]);
        const currentUser = this.authService.getCurrentUser();
        if (vistoria.idUsuario && currentUser?.id === vistoria.idUsuario) {
          this.resumoVistoriador = currentUser.nome ?? vistoria.idUsuario;
        } else {
          this.resumoVistoriador = vistoria.idUsuario ?? "-";
        }
        this.resumoVeiculo = vistoria.veiculo?.descricao ?? "-";
        this.resumoMotorista = vistoria.motorista?.nome ?? "-";
        this.resumoOdometro = vistoria.odometro != null ? `${vistoria.odometro}` : "-";
        this.resumoBateria = vistoria.porcentagembateria == null ? "-" : `${vistoria.porcentagembateria}%`;
        this.resumoIrregularidades = irregularidades.length;
        this.resumoIrregularidadesDetalhes = irregularidades.map((item) => {
          const area = item.nomeArea ?? item.idarea ?? "\xC1rea";
          const componente = item.nomeComponente ?? item.idcomponente ?? "Componente";
          const sintoma = item.descricaoSintoma ?? item.idsintoma ?? "Sintoma";
          return `${area} - ${componente} - ${sintoma}`;
        });
      } finally {
        this.loadingResumo = false;
      }
    });
  }
  mostrarResumoConclusao() {
    return __async(this, null, function* () {
      const numeroVistoria = this.flowService.getNumeroVistoriaDisplay() || "-";
      const detalhes = this.resumoIrregularidadesDetalhes.length > 0 ? this.resumoIrregularidadesDetalhes.map((item) => `- ${this.escapeHtml(item)}`).join("<br>") : "- Nenhuma irregularidade registrada";
      const alert = yield this.alertController.create({
        header: `Vistoria ${numeroVistoria} concluida com sucesso`,
        cssClass: "alert-resumo-vistoria",
        message: `<strong>Vistoriador:</strong> ${this.escapeHtml(this.resumoVistoriador)}<br><strong>Veiculo:</strong> ${this.escapeHtml(this.resumoVeiculo)}<br><strong>Motorista:</strong> ${this.escapeHtml(this.resumoMotorista)}<br><strong>Odometro:</strong> ${this.escapeHtml(this.resumoOdometro)}<br><strong>% Bateria:</strong> ${this.escapeHtml(this.resumoBateria)}<br><strong>Irregularidades:</strong> ${this.resumoIrregularidades}<br><br><strong>Resumo:</strong><br>${detalhes}`,
        buttons: [{ text: "OK", cssClass: "alert-ok-voltar" }]
      });
      yield alert.present();
      yield alert.onDidDismiss();
    });
  }
  escapeHtml(value) {
    return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  static \u0275fac = function VistoriaFinalizarPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaFinalizarPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaFinalizarPage, selectors: [["app-vistoria-finalizar"]], decls: 28, vars: 10, consts: [[3, "translucent"], ["slot", "start"], ["slot", "end"], ["fill", "solid", 3, "click"], [3, "fullscreen"], [1, "content"], ["class", "resumo-vistoria", 4, "ngIf"], ["position", "stacked"], ["placeholder", "Observa\xE7\xE3o opcional", 3, "ngModelChange", "ngModel"], ["color", "danger", 4, "ngIf"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], [4, "ngIf"], [1, "resumo-vistoria"], ["class", "irregularidades-lista", 4, "ngIf"], [1, "irregularidades-lista"], ["color", "danger"], [1, "error-message"], ["name", "crescent"]], template: function VistoriaFinalizarPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 0)(1, "ion-toolbar")(2, "ion-buttons", 1);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Finalizar Vistoria");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 2)(7, "ion-button", 3);
      \u0275\u0275listener("click", function VistoriaFinalizarPage_Template_ion_button_click_7_listener() {
        return ctx.voltar();
      });
      \u0275\u0275text(8, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(9, "ion-content", 4)(10, "div", 5);
      \u0275\u0275template(11, VistoriaFinalizarPage_div_11_Template, 30, 8, "div", 6)(12, VistoriaFinalizarPage_div_12_Template, 3, 0, "div", 6);
      \u0275\u0275elementStart(13, "ion-item")(14, "ion-label", 7);
      \u0275\u0275text(15, "Tempo total (minutos)");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "ion-text");
      \u0275\u0275text(17);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "ion-item")(19, "ion-label", 7);
      \u0275\u0275text(20, "Observa\xE7\xE3o geral");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "ion-textarea", 8);
      \u0275\u0275twoWayListener("ngModelChange", function VistoriaFinalizarPage_Template_ion_textarea_ngModelChange_21_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.observacao, $event) || (ctx.observacao = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275template(22, VistoriaFinalizarPage_ion_text_22_Template, 3, 1, "ion-text", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "ion-footer")(24, "ion-toolbar")(25, "ion-button", 10);
      \u0275\u0275listener("click", function VistoriaFinalizarPage_Template_ion_button_click_25_listener() {
        return ctx.finalizar();
      });
      \u0275\u0275template(26, VistoriaFinalizarPage_ion_spinner_26_Template, 1, 0, "ion-spinner", 11)(27, VistoriaFinalizarPage_span_27_Template, 2, 0, "span", 12);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(9);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", !ctx.loadingResumo);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingResumo);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.tempoMinutos);
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.observacao);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance(3);
      \u0275\u0275property("disabled", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.isSaving);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.isSaving);
    }
  }, dependencies: [
    NgIf,
    FormsModule,
    NgControlStatus,
    NgModel,
    IonContent,
    IonFooter,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonText
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.vistoria-center-info[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.vistoria-center-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: block;\n  line-height: 1.2;\n}\n.vistoria-center-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:first-child {\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.vistoria-center-info[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:last-child {\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n.resumo-vistoria[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.resumo-vistoria[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n}\n/*# sourceMappingURL=vistoria-finalizar.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaFinalizarPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-finalizar", standalone: true, imports: [
      NgIf,
      FormsModule,
      IonContent,
      IonFooter,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonItem,
      IonLabel,
      IonTextarea,
      IonButton,
      IonSpinner,
      IonText
    ], template: '<ion-header [translucent]="true">\r\n  <ion-toolbar>\r\n    <ion-buttons slot="start">\r\n      <ion-menu-button></ion-menu-button>\r\n    </ion-buttons>\r\n    <ion-title>Finalizar Vistoria</ion-title>\r\n    <ion-buttons slot="end">\r\n      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>\r\n    </ion-buttons>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content [fullscreen]="true">\r\n  <div class="content">\r\n    <div class="resumo-vistoria" *ngIf="!loadingResumo">\r\n      <p><strong>Vistoria:</strong> {{ resumoVistoriaNumero }}</p>\r\n      <p><strong>Vistoriador:</strong> {{ resumoVistoriador }}</p>\r\n      <p><strong>Ve\xEDculo vistoriado:</strong> {{ resumoVeiculo }}</p>\r\n      <p><strong>Motorista:</strong> {{ resumoMotorista }}</p>\r\n      <p><strong>Od\xF4metro:</strong> {{ resumoOdometro }}</p>\r\n      <p><strong>% Bateria:</strong> {{ resumoBateria }}</p>\r\n      <p><strong>Irregularidades identificadas:</strong> {{ resumoIrregularidades }}</p>\r\n      <div *ngIf="resumoIrregularidadesDetalhes.length > 0" class="irregularidades-lista">\r\n        <p><strong>Detalhes:</strong></p>\r\n        @for (detalhe of resumoIrregularidadesDetalhes; track detalhe) {\r\n          <p>{{ detalhe }}</p>\r\n        }\r\n      </div>\r\n    </div>\r\n\r\n    <div class="resumo-vistoria" *ngIf="loadingResumo">\r\n      <p>Carregando resumo da vistoria...</p>\r\n    </div>\r\n\r\n    <ion-item>\r\n      <ion-label position="stacked">Tempo total (minutos)</ion-label>\r\n      <ion-text>{{ tempoMinutos }}</ion-text>\r\n    </ion-item>\r\n\r\n    <ion-item>\r\n      <ion-label position="stacked">Observa\xE7\xE3o geral</ion-label>\r\n      <ion-textarea\r\n        [(ngModel)]="observacao"\r\n        placeholder="Observa\xE7\xE3o opcional"\r\n      ></ion-textarea>\r\n    </ion-item>\r\n\r\n    <ion-text color="danger" *ngIf="errorMessage">\r\n      <p class="error-message">{{ errorMessage }}</p>\r\n    </ion-text>\r\n\r\n  </div>\r\n</ion-content>\r\n\r\n<ion-footer>\r\n  <ion-toolbar>\r\n    <ion-button expand="block" [disabled]="isSaving" (click)="finalizar()">\r\n      <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r\n      <span *ngIf="!isSaving">Finalizar Vistoria</span>\r\n    </ion-button>\r\n  </ion-toolbar>\r\n</ion-footer>\r\n', styles: ["/* src/app/pages/vistoria/vistoria-finalizar.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content {\n  padding: 16px;\n}\n.vistoria-nr-bar {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.vistoria-center-info {\n  text-align: center;\n}\n.vistoria-center-info span {\n  display: block;\n  line-height: 1.2;\n}\n.vistoria-center-info span:first-child {\n  font-size: 0.8rem;\n  font-weight: 600;\n}\n.vistoria-center-info span:last-child {\n  font-size: 0.95rem;\n  font-weight: 700;\n}\n.error-message {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n.resumo-vistoria {\n  margin-bottom: 12px;\n  padding: 12px;\n  border-radius: 8px;\n  background: var(--ion-color-light);\n}\n.resumo-vistoria p {\n  margin: 0 0 6px;\n}\n/*# sourceMappingURL=vistoria-finalizar.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaFinalizarPage, { className: "VistoriaFinalizarPage", filePath: "src/app/pages/vistoria/vistoria-finalizar.page.ts", lineNumber: 49 });
})();
export {
  VistoriaFinalizarPage
};
//# sourceMappingURL=chunk-NNWADHTK.js.map
