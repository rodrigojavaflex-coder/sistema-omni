import {
  VistoriaBootstrapService
} from "./chunk-F57OVUJW.js";
import {
  CameraResultType,
  CameraSource
} from "./chunk-DMFZDTFJ.js";
import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-LU64LGPG.js";
import {
  addIcons,
  arrowBack,
  cameraOutline,
  trashOutline
} from "./chunk-DYQN65YV.js";
import {
  ActivatedRoute,
  AlertController,
  AuthService,
  Component,
  ErrorMessageService,
  FormsModule,
  HttpClient,
  Injectable,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
  Router,
  ViewChild,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-KKQO7KIV.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor,
  registerPlugin
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

// node_modules/@capacitor/camera/dist/esm/index.js
var Camera = registerPlugin("Camera", {
  web: () => import("./chunk-ONVX354O.js").then((m) => new m.CameraWeb())
});

// node_modules/capacitor-voice-recorder/dist/esm/index.js
var VoiceRecorder = registerPlugin("VoiceRecorder", {
  web: () => import("./chunk-F6V6BQOJ.js").then((m) => new m.VoiceRecorderWeb())
});

// src/app/services/matriz-criticidade.service.ts
var MatrizCriticidadeService = class _MatrizCriticidadeService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  listarPorComponente(componenteId) {
    return __async(this, null, function* () {
      const matriz = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/matriz-criticidade`, {
        params: { idcomponente: componenteId }
      }));
      return matriz ?? [];
    });
  }
  static \u0275fac = function MatrizCriticidadeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatrizCriticidadeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MatrizCriticidadeService, factory: _MatrizCriticidadeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatrizCriticidadeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/pages/vistoria/vistoria-irregularidade.page.ts
var _c0 = ["observacaoInput"];
function VistoriaIrregularidadePage_div_23_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, " \xB7 ");
    \u0275\u0275elementStart(2, "strong");
    \u0275\u0275text(3, "Sintoma:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.selectedMatriz == null ? null : ctx_r0.selectedMatriz.sintoma == null ? null : ctx_r0.selectedMatriz.sintoma.descricao, " ");
  }
}
function VistoriaIrregularidadePage_div_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23)(1, "p", 24)(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementStart(8, "strong");
    \u0275\u0275text(9, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10);
    \u0275\u0275elementStart(11, "strong");
    \u0275\u0275text(12, "Componente:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(13);
    \u0275\u0275template(14, VistoriaIrregularidadePage_div_23_ng_container_14_Template, 5, 1, "ng-container", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r0.vistoriaNumero, " \xB7 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.veiculoNumero, " \xB7 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.areaNome, " \xB7 ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", ctx_r0.componenteNome, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMatriz == null ? null : ctx_r0.selectedMatriz.sintoma == null ? null : ctx_r0.selectedMatriz.sintoma.descricao);
  }
}
function VistoriaIrregularidadePage_div_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275element(1, "ion-spinner", 26);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando sintomas...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_ion_text_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 27)(1, "p", 28);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 33);
    \u0275\u0275text(2, "Irregularidade registrada nesta vistoria");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_p_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 34);
    \u0275\u0275text(2, " Existe irregularidade pendente em vistoria anterior ");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_p_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 27);
    \u0275\u0275text(2, " Registro bloqueado: ja existe irregularidade pendente para este sintoma ");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card-content");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_p_1_Template, 3, 0, "p", 22)(2, VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_p_2_Template, 3, 0, "p", 22)(3, VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_p_3_Template, 3, 0, "p", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isIrregularidadeJaRegistrada(item_r3));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.temPendenteAnterior(item_r3));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isBloqueadoPorPendente(item_r3));
  }
}
function VistoriaIrregularidadePage_div_26_ion_card_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 32);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_26_ion_card_2_Template_ion_card_click_0_listener() {
      const item_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(!ctx_r0.isBloqueadoPorPendente(item_r3) && ctx_r0.selecionarSintoma(item_r3));
    });
    \u0275\u0275elementStart(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaIrregularidadePage_div_26_ion_card_2_ion_card_content_4_Template, 4, 3, "ion-card-content", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("level-card", true)("level-card--selected", ctx_r0.isSintomaSelected(item_r3))("level-card--bloqueado", ctx_r0.isBloqueadoPorPendente(item_r3));
    \u0275\u0275attribute("tabindex", ctx_r0.isBloqueadoPorPendente(item_r3) ? -1 : 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r3.sintoma == null ? null : item_r3.sintoma.descricao);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isBloqueadoPorPendente(item_r3) || ctx_r0.isIrregularidadeJaRegistrada(item_r3) || ctx_r0.temPendenteAnterior(item_r3));
  }
}
function VistoriaIrregularidadePage_div_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 30);
    \u0275\u0275template(2, VistoriaIrregularidadePage_div_26_ion_card_2_Template, 5, 9, "ion-card", 31);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r0.matriz);
  }
}
function VistoriaIrregularidadePage_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 25)(1, "p");
    \u0275\u0275text(2, "Nenhum sintoma configurado para este componente.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_28_ion_text_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 33)(1, "p", 28);
    \u0275\u0275text(2, "Irregularidade j\xE1 registrada nesta vistoria. Voc\xEA pode editar a observa\xE7\xE3o e adicionar novas m\xEDdias.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_28_ion_list_13_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "img", 43);
    \u0275\u0275elementStart(2, "ion-label")(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ion-button", 44);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_28_ion_list_13_ion_item_1_Template_ion_button_click_5_listener() {
      const i_r6 = \u0275\u0275restoreView(_r5).index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.removerFoto(i_r6));
    });
    \u0275\u0275element(6, "ion-icon", 45);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const foto_r7 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", foto_r7.preview, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(foto_r7.nomeArquivo);
  }
}
function VistoriaIrregularidadePage_div_28_ion_list_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_28_ion_list_13_ion_item_1_Template, 7, 2, "ion-item", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.fotos);
  }
}
function VistoriaIrregularidadePage_div_28_ion_item_14_p_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("J\xE1 salvos: ", ctx_r0.audiosExistentesCount);
  }
}
function VistoriaIrregularidadePage_div_28_ion_item_14_p_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Gravando: ", ctx_r0.tempoGravacaoSegundos, "s");
  }
}
function VistoriaIrregularidadePage_div_28_ion_item_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 38)(1, "ion-label");
    \u0275\u0275text(2);
    \u0275\u0275template(3, VistoriaIrregularidadePage_div_28_ion_item_14_p_3_Template, 2, 1, "p", 22)(4, VistoriaIrregularidadePage_div_28_ion_item_14_p_4_Template, 2, 1, "p", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 46)(6, "ion-button", 47);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_28_ion_item_14_Template_ion_button_click_6_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.iniciarAudio());
    });
    \u0275\u0275text(7, " Gravar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ion-button", 48);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_28_ion_item_14_Template_ion_button_click_8_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.pararAudio());
    });
    \u0275\u0275text(9, " Parar ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" \xC1udios novos (", ctx_r0.audios.length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.audiosExistentesCount > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.gravandoAudio);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.gravandoAudio || !ctx_r0.podeGravarAudio);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", !ctx_r0.gravandoAudio);
  }
}
function VistoriaIrregularidadePage_div_28_ion_list_15_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label")(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "audio", 49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-button", 44);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_28_ion_list_15_ion_item_1_Template_ion_button_click_5_listener() {
      const i_r10 = \u0275\u0275restoreView(_r9).index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.removerAudio(i_r10));
    });
    \u0275\u0275element(6, "ion-icon", 45);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r11 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r11.nomeArquivo);
    \u0275\u0275advance();
    \u0275\u0275property("src", a_r11.previewUrl, \u0275\u0275sanitizeUrl);
  }
}
function VistoriaIrregularidadePage_div_28_ion_list_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_28_ion_list_15_ion_item_1_Template, 7, 2, "ion-item", 42);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.audios);
  }
}
function VistoriaIrregularidadePage_div_28_ion_text_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 27)(1, "p", 28);
    \u0275\u0275text(2, "Dispositivo n\xE3o suporta grava\xE7\xE3o de \xE1udio.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25);
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_28_ion_text_1_Template, 3, 0, "ion-text", 35);
    \u0275\u0275elementStart(2, "ion-item")(3, "ion-label", 36);
    \u0275\u0275text(4, "Descreva o Problema");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-textarea", 37, 0);
    \u0275\u0275listener("ionInput", function VistoriaIrregularidadePage_div_28_Template_ion_textarea_ionInput_5_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.observacao = $event.detail.value ?? "");
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "ion-item", 38)(8, "ion-label");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ion-button", 39);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_28_Template_ion_button_click_10_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.adicionarFoto());
    });
    \u0275\u0275element(11, "ion-icon", 40);
    \u0275\u0275text(12, " Adicionar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(13, VistoriaIrregularidadePage_div_28_ion_list_13_Template, 2, 1, "ion-list", 22)(14, VistoriaIrregularidadePage_div_28_ion_item_14_Template, 10, 5, "ion-item", 41)(15, VistoriaIrregularidadePage_div_28_ion_list_15_Template, 2, 1, "ion-list", 22)(16, VistoriaIrregularidadePage_div_28_ion_text_16_Template, 3, 0, "ion-text", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.irregularidadeEmEdicaoId);
    \u0275\u0275advance(4);
    \u0275\u0275property("value", ctx_r0.observacao);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Fotos (", ctx_r0.fotos.length, ")");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r0.fotos.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMatriz.permiteAudio);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMatriz.permiteAudio && ctx_r0.audios.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.selectedMatriz.permiteAudio && !ctx_r0.podeGravarAudio);
  }
}
function VistoriaIrregularidadePage_ion_footer_29_ion_spinner_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 26);
  }
}
function VistoriaIrregularidadePage_ion_footer_29_span_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Salvar irregularidade");
    \u0275\u0275elementEnd();
  }
}
function VistoriaIrregularidadePage_ion_footer_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-footer")(1, "ion-toolbar")(2, "ion-button", 50);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_ion_footer_29_Template_ion_button_click_2_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.salvarIrregularidade());
    });
    \u0275\u0275template(3, VistoriaIrregularidadePage_ion_footer_29_ion_spinner_3_Template, 1, 0, "ion-spinner", 51)(4, VistoriaIrregularidadePage_ion_footer_29_span_4_Template, 2, 0, "span", 22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.saving || !ctx_r0.selectedMatriz);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.saving);
  }
}
var VistoriaIrregularidadePage = class _VistoriaIrregularidadePage {
  route = inject(ActivatedRoute);
  router = inject(Router);
  matrizService = inject(MatrizCriticidadeService);
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  bootstrapService = inject(VistoriaBootstrapService);
  alertController = inject(AlertController);
  errorMessageService = inject(ErrorMessageService);
  authService = inject(AuthService);
  observacaoInput;
  areaId = "";
  componenteId = "";
  areaNome = "";
  componenteNome = "";
  matriz = [];
  pendentesParaComponente = [];
  selectedMatriz = null;
  irregularidadeEmEdicaoId = null;
  observacao = "";
  fotos = [];
  audios = [];
  audiosExistentesCount = 0;
  irregularidadesDaVistoria = [];
  audioBase64;
  audioMimeType;
  audioDurationMs;
  gravandoAudio = false;
  tempoGravacaoSegundos = 0;
  audioTimerId = null;
  podeGravarAudio = true;
  loading = false;
  saving = false;
  errorMessage = "";
  isNative = Capacitor.getPlatform() !== "web";
  /** Número da vistoria para exibição abaixo da barra */
  get vistoriaNrDisplay() {
    const nr = this.flowService.getNumeroVistoriaDisplay();
    return nr ? `Vistoria - ${nr}` : "Vistoria";
  }
  get vistoriaNumero() {
    return this.flowService.getNumeroVistoriaDisplay() || "-";
  }
  get veiculoNumero() {
    return this.flowService.getVeiculoDescricao() || "-";
  }
  /** Nível atual (breadcrumb) */
  get headerTitle() {
    if (this.selectedMatriz?.sintoma?.descricao) {
      return `${this.areaNome} - ${this.componenteNome} - ${this.selectedMatriz.sintoma.descricao}`;
    }
    return `${this.areaNome} - ${this.componenteNome}`;
  }
  /** Instrução do nível atual */
  get nivelInstruction() {
    if (this.selectedMatriz !== null) {
      return "Descreva o problema e anexe m\xEDdias";
    }
    return "Selecione o Sintoma:";
  }
  constructor() {
    addIcons({
      arrowBack,
      cameraOutline,
      trashOutline
    });
  }
  voltar() {
    return __async(this, null, function* () {
      if (this.selectedMatriz !== null) {
        if (this.temDadosNaoSalvos()) {
          const confirmarSaida = yield this.confirmarPerdaAlteracoes();
          if (!confirmarSaida) {
            return;
          }
        }
        this.selectedMatriz = null;
        this.irregularidadeEmEdicaoId = null;
        this.observacao = "";
        this.fotos = [];
        this.audios = [];
        this.audiosExistentesCount = 0;
      } else {
        this.router.navigate(["/vistoria/areas"]);
      }
    });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.areaId = this.route.snapshot.paramMap.get("areaId") ?? "";
      this.componenteId = this.route.snapshot.paramMap.get("componenteId") ?? "";
      if (!this.areaId || !this.componenteId) {
        this.router.navigate(["/vistoria/areas"]);
        return;
      }
      const state = this.router.getCurrentNavigation()?.extras?.state;
      this.areaNome = state?.areaNome ?? "\xC1rea";
      this.componenteNome = state?.componenteNome ?? "Componente";
      this.loading = true;
      try {
        const bootstrap = yield this.bootstrapService.getOrFetch(vistoriaId);
        const bootstrapAplicado = bootstrap ? this.aplicarBootstrap(bootstrap) : false;
        if (!bootstrapAplicado) {
          yield this.vistoriaService.getById(vistoriaId);
          const veiculoId = this.flowService.getVeiculoId();
          const [matrizRes, pendentesRes, irregularidadesRes] = yield Promise.all([
            this.matrizService.listarPorComponente(this.componenteId),
            veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([]),
            this.vistoriaService.listarIrregularidades(vistoriaId)
          ]);
          this.matriz = matrizRes;
          this.pendentesParaComponente = pendentesRes.filter((p) => p.idcomponente === this.componenteId);
          this.irregularidadesDaVistoria = irregularidadesRes.filter((i) => i.idarea === this.areaId && i.idcomponente === this.componenteId);
        }
        yield this.recarregarStatusComponente(vistoriaId);
      } catch {
        this.errorMessage = "Erro ao carregar sintomas.";
      } finally {
        this.loading = false;
        void this.verificarCapacidadeAudio();
      }
    });
  }
  isSintomaSelected(item) {
    return this.selectedMatriz != null && this.selectedMatriz.id === item.id;
  }
  /** True se já existe irregularidade pendente para este sintoma e a matriz não permite nova. */
  isBloqueadoPorPendente(item) {
    const jaTemPendenteAnterior = this.temPendenteAnterior(item);
    const jaTemNestaVistoria = this.isIrregularidadeJaRegistrada(item);
    return Boolean(jaTemPendenteAnterior && !item.permiteNovaIrregularidadeSeJaExiste && !jaTemNestaVistoria);
  }
  isIrregularidadeJaRegistrada(item) {
    return this.irregularidadesDaVistoria.some((ir) => ir.idsintoma === item.idSintoma);
  }
  temPendenteAnterior(item) {
    return this.pendentesParaComponente.some((p) => p.idsintoma === item.idSintoma);
  }
  selecionarSintoma(item) {
    return __async(this, null, function* () {
      if (this.isBloqueadoPorPendente(item)) {
        return;
      }
      this.selectedMatriz = item;
      yield this.carregarIrregularidadeExistente(item);
    });
  }
  abrirResumoVistoria() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return;
      }
      try {
        const [vistoria, irregularidades] = yield Promise.all([
          this.vistoriaService.getById(vistoriaId),
          this.vistoriaService.listarIrregularidades(vistoriaId)
        ]);
        const numeroVistoriaRaw = this.vistoriaNumero || "-";
        const numeroVistoriaDigits = numeroVistoriaRaw.replace(/\D+/g, "");
        const numeroVistoria = numeroVistoriaDigits || numeroVistoriaRaw;
        const currentUser = this.authService.getCurrentUser();
        const vistoriador = vistoria.idUsuario && currentUser?.id === vistoria.idUsuario ? currentUser.nome ?? vistoria.idUsuario : vistoria.idUsuario ?? "-";
        const veiculo = vistoria.veiculo?.descricao ?? "-";
        const motorista = vistoria.motorista?.nome ?? "-";
        const odometro = vistoria.odometro == null ? "-" : Number(vistoria.odometro).toFixed(2);
        const bateria = vistoria.porcentagembateria == null ? "-" : `${Number(vistoria.porcentagembateria).toFixed(2)}%`;
        const detalhes = irregularidades.length > 0 ? irregularidades.map((item) => {
          const area = item.nomeArea ?? item.idarea ?? "Area";
          const componente = item.nomeComponente ?? item.idcomponente ?? "Componente";
          const sintoma = item.descricaoSintoma ?? item.idsintoma ?? "Sintoma";
          return `- ${this.escapeHtml(area)} - ${this.escapeHtml(componente)} - ${this.escapeHtml(sintoma)}`;
        }).join("<br>") : "- Nenhuma irregularidade registrada";
        const alert = yield this.alertController.create({
          header: `Vistoria ${numeroVistoria}`,
          cssClass: "alert-resumo-vistoria",
          message: `<strong>Vistoriador:</strong> ${this.escapeHtml(vistoriador)}<br><strong>Veiculo:</strong> ${this.escapeHtml(veiculo)}<br><strong>Motorista:</strong> ${this.escapeHtml(motorista)}<br><strong>Odometro:</strong> ${this.escapeHtml(odometro)}<br><strong>% Bateria:</strong> ${this.escapeHtml(bateria)}<br><strong>Irregularidades:</strong> ${irregularidades.length}<br><br><strong>Resumo:</strong><br>${detalhes}`,
          buttons: [{ text: "OK", cssClass: "alert-ok-voltar" }]
        });
        yield alert.present();
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel carregar o resumo da vistoria.");
      }
    });
  }
  abrirResumoPendenciasVeiculo() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      const veiculoId = this.flowService.getVeiculoId();
      if (!vistoriaId || !veiculoId) {
        return;
      }
      try {
        const [irregularidadesAtual, pendentes] = yield Promise.all([
          this.vistoriaService.listarIrregularidades(vistoriaId),
          this.vistoriaService.listarIrregularidadesPendentes(veiculoId)
        ]);
        const idsDaVistoriaAtual = new Set(irregularidadesAtual.map((item) => item.id));
        const pendenciasAnteriores = pendentes.filter((item) => !idsDaVistoriaAtual.has(item.id));
        const detalhes = pendenciasAnteriores.length > 0 ? pendenciasAnteriores.map((item) => {
          const area = item.nomeArea ?? item.idarea ?? "Area";
          const componente = item.nomeComponente ?? item.idcomponente ?? "Componente";
          const sintoma = item.descricaoSintoma ?? item.idsintoma ?? "Sintoma";
          return `- ${this.escapeHtml(area)} - ${this.escapeHtml(componente)} - ${this.escapeHtml(sintoma)}`;
        }).join("<br>") : "- Nenhuma irregularidade pendente de outras vistorias";
        const alert = yield this.alertController.create({
          header: "Pendencias do veiculo",
          cssClass: "alert-resumo-vistoria",
          message: `<strong>Veiculo:</strong> ${this.escapeHtml(this.veiculoNumero)}<br><strong>Irregularidades pendentes (outras vistorias):</strong> ${pendenciasAnteriores.length}<br><br><strong>Resumo:</strong><br>${detalhes}`,
          buttons: [{ text: "OK", cssClass: "alert-ok-voltar" }]
        });
        yield alert.present();
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel carregar as pendencias do veiculo.");
      }
    });
  }
  adicionarFoto() {
    return __async(this, null, function* () {
      const photo = yield Camera.getPhoto({
        quality: 60,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024,
        correctOrientation: true
      });
      if (!photo.base64String) {
        return;
      }
      const base64 = photo.base64String;
      const imageIndex = this.fotos.length + 1;
      const nomeArquivo = `${this.buildMidiaBaseName("img", imageIndex)}.jpg`;
      const tamanho = this.estimateBase64Size(base64);
      this.fotos.push({
        nomeArquivo,
        tamanho,
        dadosBase64: base64,
        preview: `data:image/jpeg;base64,${base64}`
      });
    });
  }
  removerFoto(index) {
    this.fotos.splice(index, 1);
  }
  iniciarAudio() {
    return __async(this, null, function* () {
      try {
        const permission = yield VoiceRecorder.hasAudioRecordingPermission();
        if (!permission.value) {
          const request = yield VoiceRecorder.requestAudioRecordingPermission();
          if (!request.value) {
            this.errorMessage = "Permiss\xE3o de \xE1udio negada.";
            return;
          }
        }
        yield VoiceRecorder.startRecording();
        this.gravandoAudio = true;
        this.iniciarContadorGravacao();
      } catch {
        this.errorMessage = "N\xE3o foi poss\xEDvel iniciar a grava\xE7\xE3o.";
      }
    });
  }
  pararAudio() {
    return __async(this, null, function* () {
      try {
        const result = yield VoiceRecorder.stopRecording();
        if (result.value?.recordDataBase64) {
          const audioIndex = this.audios.length + 1;
          const nomeArquivo = `${this.buildMidiaBaseName("audio", audioIndex)}.m4a`;
          this.audios.push({
            nomeArquivo,
            base64: result.value.recordDataBase64,
            mimeType: result.value.mimeType ?? "audio/m4a",
            previewUrl: `data:${result.value.mimeType ?? "audio/m4a"};base64,${result.value.recordDataBase64}`,
            durationMs: result.value.msDuration
          });
        }
        this.audioBase64 = void 0;
        this.audioMimeType = void 0;
        this.audioDurationMs = void 0;
        this.gravandoAudio = false;
        this.pararContadorGravacao();
      } catch {
        this.errorMessage = "N\xE3o foi poss\xEDvel finalizar a grava\xE7\xE3o.";
        this.gravandoAudio = false;
        this.pararContadorGravacao();
      }
    });
  }
  limparAudio() {
    this.audioBase64 = void 0;
    this.audioMimeType = void 0;
    this.audioDurationMs = void 0;
  }
  removerAudio(index) {
    this.audios.splice(index, 1);
  }
  temDadosNaoSalvos() {
    return this.fotos.length > 0 || this.audios.length > 0 || (this.observacao?.trim()?.length ?? 0) > 0;
  }
  confirmarPerdaAlteracoes() {
    return __async(this, null, function* () {
      const alert = yield this.alertController.create({
        header: "Descartar altera\xE7\xF5es?",
        message: "Voc\xEA pode perder as altera\xE7\xF5es n\xE3o salvas desta irregularidade.",
        buttons: [
          { text: "Continuar editando", role: "cancel" },
          { text: "Descartar", role: "confirm" }
        ]
      });
      yield alert.present();
      const result = yield alert.onDidDismiss();
      return result.role === "confirm";
    });
  }
  salvarIrregularidade() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId || !this.selectedMatriz) {
        this.errorMessage = "Selecione um sintoma.";
        return;
      }
      if (this.selectedMatriz.exigeFoto && this.fotos.length === 0) {
        this.errorMessage = "Foto obrigat\xF3ria para este sintoma.";
        return;
      }
      this.saving = true;
      this.errorMessage = "";
      try {
        let irregularidadeId = this.irregularidadeEmEdicaoId;
        if (irregularidadeId) {
          yield this.vistoriaService.atualizarIrregularidade(irregularidadeId, {
            observacao: this.observacao?.trim() ?? ""
          });
        } else {
          const irregularidade = yield this.vistoriaService.criarIrregularidade(vistoriaId, {
            idarea: this.areaId,
            idcomponente: this.componenteId,
            idsintoma: this.selectedMatriz.idSintoma,
            observacao: this.observacao?.trim() || void 0
          });
          irregularidadeId = irregularidade.id;
        }
        if (this.fotos.length > 0) {
          const files = this.fotos.map((foto) => ({
            nomeArquivo: foto.nomeArquivo,
            blob: this.base64ToBlob(foto.dadosBase64)
          }));
          yield this.vistoriaService.uploadIrregularidadeImagens(irregularidadeId, files);
        }
        if (this.selectedMatriz.permiteAudio && this.audios.length > 0) {
          for (let i = 0; i < this.audios.length; i++) {
            const a = this.audios[i];
            const blob = this.base64ToBlob(a.base64, a.mimeType);
            yield this.vistoriaService.uploadIrregularidadeAudio(irregularidadeId, blob, a.nomeArquivo, a.durationMs);
          }
        }
        this.bootstrapService.invalidate(vistoriaId);
        this.router.navigate(["/vistoria/areas"], {
          state: {
            reopenAreaId: this.areaId,
            reopenAreaNome: this.areaNome
          },
          replaceUrl: true
          // evita voltar para este formulário (já enviado) e travar
        });
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Erro ao salvar irregularidade. Tente novamente.");
      } finally {
        this.saving = false;
      }
    });
  }
  estimateBase64Size(base64) {
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.floor(base64.length * 3 / 4) - padding;
  }
  sanitizeFilename(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  }
  buildMidiaBaseName(tipo, index) {
    const nrVistoria = this.sanitizeFilename(this.flowService.getNumeroVistoriaDisplay() || "nrvistoria");
    const nrVeiculo = this.sanitizeFilename(this.flowService.getVeiculoDescricao() || "nrveiculo");
    const area = this.sanitizeFilename(this.areaNome || "area");
    const componente = this.sanitizeFilename(this.componenteNome || "componente");
    const sintoma = this.sanitizeFilename(this.selectedMatriz?.sintoma?.descricao || "sintoma");
    return `${nrVistoria}_${nrVeiculo}_${area}_${componente}_${sintoma}_${tipo}${index}`;
  }
  carregarIrregularidadeExistente(item) {
    return __async(this, null, function* () {
      this.irregularidadeEmEdicaoId = null;
      this.observacao = "";
      this.fotos = [];
      this.audios = [];
      this.audiosExistentesCount = 0;
      const existente = this.irregularidadesDaVistoria.find((ir) => ir.idsintoma === item.idSintoma);
      if (!existente)
        return;
      this.irregularidadeEmEdicaoId = existente.id;
      this.observacao = existente.observacao ?? "";
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId)
        return;
      const [imagensResumo, audiosResumo] = yield Promise.all([
        this.vistoriaService.listarIrregularidadesImagens(vistoriaId),
        this.vistoriaService.listarIrregularidadesAudios(vistoriaId)
      ]);
      this.preencherImagensExistentes(imagensResumo, existente.id);
      this.preencherAudiosExistentesCount(audiosResumo, existente.id);
    });
  }
  preencherImagensExistentes(imagensResumo, irregularidadeId) {
    const item = imagensResumo.find((i) => i.idirregularidade === irregularidadeId);
    const imagens = item?.imagens ?? [];
    this.fotos = imagens.map((img) => {
      const mimeType = this.getMimeTypeFromFilename(img.nomeArquivo);
      return {
        nomeArquivo: img.nomeArquivo,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64: img.dadosBase64,
        preview: `data:${mimeType};base64,${img.dadosBase64}`
      };
    });
  }
  preencherAudiosExistentesCount(audiosResumo, irregularidadeId) {
    const item = audiosResumo.find((a) => a.idirregularidade === irregularidadeId);
    this.audiosExistentesCount = item?.audios?.length ?? 0;
  }
  getMimeTypeFromFilename(nomeArquivo) {
    const ext = (nomeArquivo.split(".").pop() || "").toLowerCase();
    if (ext === "png")
      return "image/png";
    if (ext === "webp")
      return "image/webp";
    if (ext === "gif")
      return "image/gif";
    return "image/jpeg";
  }
  iniciarContadorGravacao() {
    this.pararContadorGravacao();
    this.tempoGravacaoSegundos = 0;
    this.audioTimerId = setInterval(() => {
      this.tempoGravacaoSegundos += 1;
    }, 1e3);
  }
  pararContadorGravacao() {
    if (this.audioTimerId) {
      clearInterval(this.audioTimerId);
      this.audioTimerId = null;
    }
    this.tempoGravacaoSegundos = 0;
  }
  base64ToBlob(base64, mimeType = "application/octet-stream") {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return new Blob([bytes], { type: mimeType });
  }
  aplicarBootstrap(bootstrap) {
    const area = bootstrap.areas?.find((a) => a.id === this.areaId);
    const componente = area?.componentes?.find((c) => c.idComponente === this.componenteId);
    if (!area || !componente) {
      return false;
    }
    this.areaNome = area.nome || this.areaNome;
    this.componenteNome = componente.componente?.nome || this.componenteNome;
    this.matriz = componente.matriz ?? [];
    this.pendentesParaComponente = (bootstrap.pendentesVeiculo ?? []).filter((p) => p.idcomponente === this.componenteId);
    this.irregularidadesDaVistoria = (bootstrap.irregularidadesVistoria ?? []).filter((i) => i.idarea === this.areaId && i.idcomponente === this.componenteId);
    return true;
  }
  verificarCapacidadeAudio() {
    return __async(this, null, function* () {
      try {
        const canRecord = yield VoiceRecorder.canDeviceVoiceRecord();
        this.podeGravarAudio = canRecord.value === true;
      } catch {
        this.podeGravarAudio = false;
      }
    });
  }
  recarregarStatusComponente(vistoriaId) {
    return __async(this, null, function* () {
      const veiculoId = this.flowService.getVeiculoId();
      const [irregularidadesRes, pendentesRes] = yield Promise.all([
        this.vistoriaService.listarIrregularidades(vistoriaId),
        veiculoId ? this.vistoriaService.listarIrregularidadesPendentes(veiculoId) : Promise.resolve([])
      ]);
      this.irregularidadesDaVistoria = irregularidadesRes.filter((i) => i.idarea === this.areaId && i.idcomponente === this.componenteId);
      const idsDaVistoriaAtual = new Set(this.irregularidadesDaVistoria.map((item) => item.id));
      this.pendentesParaComponente = pendentesRes.filter((p) => p.idcomponente === this.componenteId && !idsDaVistoriaAtual.has(p.id));
    });
  }
  escapeHtml(value) {
    return (value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  static \u0275fac = function VistoriaIrregularidadePage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaIrregularidadePage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaIrregularidadePage, selectors: [["app-vistoria-irregularidade"]], viewQuery: function VistoriaIrregularidadePage_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, IonTextarea);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.observacaoInput = _t.first);
    }
  }, decls: 30, vars: 9, consts: [["observacaoInput", ""], [3, "translucent"], ["slot", "start"], ["slot", "end"], ["fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 1, "resumo-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["x", "8", "y", "2", "width", "8", "height", "4", "rx", "1"], ["d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["d", "M9 12h6"], ["d", "M9 16h6"], ["fill", "solid", "color", "medium", "aria-label", "Resumo da vistoria", 1, "resumo-btn", 3, "click"], ["d", "m3 17 2 2 4-4"], ["d", "m3 7 2 2 4-4"], ["d", "M13 6h8"], ["d", "M13 12h8"], ["d", "M13 18h8"], ["fill", "solid", 3, "click"], [3, "fullscreen"], ["class", "selected-context", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], ["class", "content sheet-context", 4, "ngIf"], [4, "ngIf"], [1, "selected-context"], [1, "context-inline"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], [1, "content", "sheet-context"], [1, "cards-container"], [3, "level-card", "level-card--selected", "level-card--bloqueado", "click", 4, "ngFor", "ngForOf"], [3, "click"], ["color", "primary"], ["color", "warning"], ["color", "primary", 4, "ngIf"], ["position", "stacked"], ["placeholder", "Descreva o problema", 3, "ionInput", "value"], ["lines", "none"], ["fill", "outline", 3, "click"], ["slot", "start", "name", "camera-outline"], ["lines", "none", 4, "ngIf"], [4, "ngFor", "ngForOf"], ["alt", "Foto", 3, "src"], ["slot", "end", "fill", "clear", "color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], [1, "audio-actions"], ["fill", "outline", 3, "click", "disabled"], ["color", "danger", "fill", "outline", 3, "click", "disabled"], ["controls", "", "preload", "metadata", 1, "audio-player", 3, "src"], ["expand", "block", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"]], template: function VistoriaIrregularidadePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 1)(1, "ion-toolbar")(2, "ion-buttons", 2);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Sintomas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 3)(7, "ion-button", 4);
      \u0275\u0275listener("click", function VistoriaIrregularidadePage_Template_ion_button_click_7_listener() {
        return ctx.abrirResumoPendenciasVeiculo();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(8, "svg", 5);
      \u0275\u0275element(9, "rect", 6)(10, "path", 7)(11, "path", 8)(12, "path", 9);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "ion-button", 10);
      \u0275\u0275listener("click", function VistoriaIrregularidadePage_Template_ion_button_click_13_listener() {
        return ctx.abrirResumoVistoria();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(14, "svg", 5);
      \u0275\u0275element(15, "path", 11)(16, "path", 12)(17, "path", 13)(18, "path", 14)(19, "path", 15);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(20, "ion-button", 16);
      \u0275\u0275listener("click", function VistoriaIrregularidadePage_Template_ion_button_click_20_listener() {
        return ctx.voltar();
      });
      \u0275\u0275text(21, "Voltar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(22, "ion-content", 17);
      \u0275\u0275template(23, VistoriaIrregularidadePage_div_23_Template, 15, 5, "div", 18)(24, VistoriaIrregularidadePage_div_24_Template, 4, 0, "div", 19)(25, VistoriaIrregularidadePage_ion_text_25_Template, 3, 1, "ion-text", 20)(26, VistoriaIrregularidadePage_div_26_Template, 3, 1, "div", 21)(27, VistoriaIrregularidadePage_div_27_Template, 3, 0, "div", 19)(28, VistoriaIrregularidadePage_div_28_Template, 17, 7, "div", 19);
      \u0275\u0275elementEnd();
      \u0275\u0275template(29, VistoriaIrregularidadePage_ion_footer_29_Template, 5, 3, "ion-footer", 22);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(22);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.matriz.length > 0 && ctx.selectedMatriz === null);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && ctx.matriz.length === 0 && ctx.selectedMatriz === null);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.selectedMatriz);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    FormsModule,
    IonContent,
    IonFooter,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonTextarea,
    IonSpinner
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n}\n.content.sheet-context[_ngcontent-%COMP%] {\n  align-items: stretch;\n}\n.cards-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n}\n.level-card[_ngcontent-%COMP%] {\n  margin: 0;\n  cursor: pointer;\n  --background: var(--ion-card-background, var(--ion-item-background));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.level-card--bloqueado[_ngcontent-%COMP%] {\n  cursor: default;\n  opacity: 0.85;\n  --background: var(--ion-color-light);\n}\n.level-card--selected[_ngcontent-%COMP%] {\n  --background: #e7f2ff;\n  border: 1px solid var(--ion-color-primary);\n}\n.level-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context[_ngcontent-%COMP%] {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  padding: 14px 16px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  text-align: left;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 1.02rem;\n  color: #0f172a;\n  display: block;\n  line-height: 1.4;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.selected-context[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  display: inline;\n  color: #1d4ed8;\n  margin-right: 4px;\n}\n.selected-context[_ngcontent-%COMP%]   .context-inline[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\nion-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e7f2ff;\n}\nimg[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.audio-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.audio-player[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 6px;\n}\n/*# sourceMappingURL=vistoria-irregularidade.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaIrregularidadePage, [{
    type: Component,
    args: [{ selector: "app-vistoria-irregularidade", standalone: true, imports: [
      NgIf,
      NgForOf,
      FormsModule,
      IonContent,
      IonFooter,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonList,
      IonItem,
      IonLabel,
      IonButton,
      IonIcon,
      IonText,
      IonTextarea,
      IonSpinner
    ], template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button></ion-menu-button>
    </ion-buttons>
    <ion-title>Sintomas</ion-title>
    <ion-buttons slot="end">
      <ion-button
        class="resumo-btn"
        fill="solid"
        color="medium"
        (click)="abrirResumoPendenciasVeiculo()"
        aria-label="Pendencias de outras vistorias"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="8" y="2" width="8" height="4" rx="1"></rect>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <path d="M9 12h6"></path>
          <path d="M9 16h6"></path>
        </svg>
      </ion-button>
      <ion-button class="resumo-btn" fill="solid" color="medium" (click)="abrirResumoVistoria()" aria-label="Resumo da vistoria">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m3 17 2 2 4-4"></path>
          <path d="m3 7 2 2 4-4"></path>
          <path d="M13 6h8"></path>
          <path d="M13 12h8"></path>
          <path d="M13 18h8"></path>
        </svg>
      </ion-button>
      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div class="selected-context" *ngIf="!loading">
    <p class="context-inline">
      <strong>Vistoria:</strong> {{ vistoriaNumero }} \xB7
      <strong>Ve\xEDculo:</strong> {{ veiculoNumero }} \xB7
      <strong>\xC1rea:</strong> {{ areaNome }} \xB7
      <strong>Componente:</strong> {{ componenteNome }}
      <ng-container *ngIf="selectedMatriz?.sintoma?.descricao">
        \xB7 <strong>Sintoma:</strong> {{ selectedMatriz?.sintoma?.descricao }}
      </ng-container>
    </p>
  </div>

  <div class="content" *ngIf="loading">
    <ion-spinner name="crescent"></ion-spinner>
    <p>Carregando sintomas...</p>
  </div>

  <ion-text color="danger" *ngIf="errorMessage">
    <p class="error-message">{{ errorMessage }}</p>
  </ion-text>

  <div *ngIf="!loading && matriz.length > 0 && selectedMatriz === null" class="content sheet-context">
    <div class="cards-container">
      <ion-card
        *ngFor="let item of matriz"
        [class.level-card]="true"
        [class.level-card--selected]="isSintomaSelected(item)"
        [class.level-card--bloqueado]="isBloqueadoPorPendente(item)"
        [attr.tabindex]="isBloqueadoPorPendente(item) ? -1 : 0"
        (click)="!isBloqueadoPorPendente(item) && selecionarSintoma(item)"
      >
        <ion-card-header>
          <ion-card-title>{{ item.sintoma?.descricao }}</ion-card-title>
        </ion-card-header>
        <ion-card-content *ngIf="isBloqueadoPorPendente(item) || isIrregularidadeJaRegistrada(item) || temPendenteAnterior(item)">
          <p *ngIf="isIrregularidadeJaRegistrada(item)">
            <ion-text color="primary">Irregularidade registrada nesta vistoria</ion-text>
          </p>
          <p *ngIf="temPendenteAnterior(item)">
            <ion-text color="warning">
              Existe irregularidade pendente em vistoria anterior
            </ion-text>
          </p>
          <p *ngIf="isBloqueadoPorPendente(item)">
            <ion-text color="danger">
              Registro bloqueado: ja existe irregularidade pendente para este sintoma
            </ion-text>
          </p>
        </ion-card-content>
      </ion-card>
    </div>
  </div>

  <div class="content" *ngIf="!loading && matriz.length === 0 && selectedMatriz === null">
    <p>Nenhum sintoma configurado para este componente.</p>
  </div>

  <div class="content" *ngIf="selectedMatriz">
    <ion-text color="primary" *ngIf="irregularidadeEmEdicaoId">
      <p class="error-message">Irregularidade j\xE1 registrada nesta vistoria. Voc\xEA pode editar a observa\xE7\xE3o e adicionar novas m\xEDdias.</p>
    </ion-text>

    <ion-item>
      <ion-label position="stacked">Descreva o Problema</ion-label>
      <ion-textarea
        #observacaoInput
        [value]="observacao"
        placeholder="Descreva o problema"
        (ionInput)="observacao = $event.detail.value ?? ''"
      ></ion-textarea>
    </ion-item>

    <ion-item lines="none">
      <ion-label>Fotos ({{ fotos.length }})</ion-label>
      <ion-button fill="outline" (click)="adicionarFoto()">
        <ion-icon slot="start" name="camera-outline"></ion-icon>
        Adicionar
      </ion-button>
    </ion-item>

    <ion-list *ngIf="fotos.length > 0">
      <ion-item *ngFor="let foto of fotos; let i = index">
        <img [src]="foto.preview" alt="Foto" />
        <ion-label>
          <p>{{ foto.nomeArquivo }}</p>
        </ion-label>
        <ion-button slot="end" fill="clear" color="danger" (click)="removerFoto(i)">
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-list>

    <ion-item lines="none" *ngIf="selectedMatriz.permiteAudio">
      <ion-label>
        \xC1udios novos ({{ audios.length }})
        <p *ngIf="audiosExistentesCount > 0">J\xE1 salvos: {{ audiosExistentesCount }}</p>
        <p *ngIf="gravandoAudio">Gravando: {{ tempoGravacaoSegundos }}s</p>
      </ion-label>
      <div class="audio-actions">
        <ion-button fill="outline" (click)="iniciarAudio()" [disabled]="gravandoAudio || !podeGravarAudio">
          Gravar
        </ion-button>
        <ion-button color="danger" fill="outline" (click)="pararAudio()" [disabled]="!gravandoAudio">
          Parar
        </ion-button>
      </div>
    </ion-item>

    <ion-list *ngIf="selectedMatriz.permiteAudio && audios.length > 0">
      <ion-item *ngFor="let a of audios; let i = index">
        <ion-label>
          <p>{{ a.nomeArquivo }}</p>
          <audio class="audio-player" [src]="a.previewUrl" controls preload="metadata"></audio>
        </ion-label>
        <ion-button slot="end" fill="clear" color="danger" (click)="removerAudio(i)">
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-list>

    <ion-text *ngIf="selectedMatriz.permiteAudio && !podeGravarAudio" color="danger">
      <p class="error-message">Dispositivo n\xE3o suporta grava\xE7\xE3o de \xE1udio.</p>
    </ion-text>

  </div>

</ion-content>

<ion-footer *ngIf="!loading">
  <ion-toolbar>
    <ion-button expand="block" (click)="salvarIrregularidade()" [disabled]="saving || !selectedMatriz">
      <ion-spinner *ngIf="saving" name="crescent"></ion-spinner>
      <span *ngIf="!saving">Salvar irregularidade</span>
    </ion-button>
  </ion-toolbar>
</ion-footer>
`, styles: ["/* src/app/pages/vistoria/vistoria-irregularidade.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n}\n.content.sheet-context {\n  align-items: stretch;\n}\n.cards-container {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n}\n.level-card {\n  margin: 0;\n  cursor: pointer;\n  --background: var(--ion-card-background, var(--ion-item-background));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.level-card--bloqueado {\n  cursor: default;\n  opacity: 0.85;\n  --background: var(--ion-color-light);\n}\n.level-card--selected {\n  --background: #e7f2ff;\n  border: 1px solid var(--ion-color-primary);\n}\n.level-card ion-card-header {\n  padding: 16px 18px;\n}\n.level-card ion-card-title {\n  font-size: 1.15rem;\n  font-weight: 600;\n}\n.level-card ion-card-content {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card ion-card-content p {\n  margin: 0;\n  font-size: 1rem;\n}\n.vistoria-nr-bar {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  padding: 14px 16px;\n  border-radius: 12px;\n  background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  text-align: left;\n}\n.selected-context p {\n  margin: 0 0 8px;\n  font-size: 1.02rem;\n  color: #0f172a;\n  display: block;\n  line-height: 1.4;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.selected-context p:last-child {\n  margin-bottom: 0;\n}\n.selected-context p strong {\n  display: inline;\n  color: #1d4ed8;\n  margin-right: 4px;\n}\n.selected-context .context-inline {\n  margin: 0;\n}\n.error-message {\n  padding: 12px 16px;\n}\nion-item.is-selected {\n  --background: #e7f2ff;\n}\nimg {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.audio-actions {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.audio-player {\n  width: 100%;\n  margin-top: 6px;\n}\n/*# sourceMappingURL=vistoria-irregularidade.page.css.map */\n"] }]
  }], () => [], { observacaoInput: [{
    type: ViewChild,
    args: ["observacaoInput", { read: IonTextarea }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaIrregularidadePage, { className: "VistoriaIrregularidadePage", filePath: "src/app/pages/vistoria/vistoria-irregularidade.page.ts", lineNumber: 95 });
})();
export {
  VistoriaIrregularidadePage
};
//# sourceMappingURL=chunk-YLJBK4PD.js.map
