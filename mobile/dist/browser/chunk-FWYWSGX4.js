import {
  Filesystem
} from "./chunk-KDVGJNJQ.js";
import {
  Directory
} from "./chunk-HK2EHJHC.js";
import {
  VeiculoService
} from "./chunk-6BHNPHDX.js";
import {
  VistoriaService
} from "./chunk-M3ZJWNPO.js";
import {
  VistoriaFlowService
} from "./chunk-EHNZXCFC.js";
import {
  AuthService,
  ErrorMessageService
} from "./chunk-XXRWZG7R.js";
import {
  CommonModule,
  Component,
  FormsModule,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  NgControlStatus,
  NgForOf,
  NgIf,
  NgModel,
  Router,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
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
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtextInterpolate3,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-TLQ76MG3.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-JCEFQURH.js";
import "./chunk-PFHNU3CN.js";
import {
  Capacitor,
  registerPlugin
} from "./chunk-52UEIZVD.js";
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
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-3RNQ4BE2.js";

// node_modules/@capacitor-community/file-opener/dist/esm/index.js
var FileOpener = registerPlugin("FileOpener");

// src/app/pages/vistoria/vistoria-historico-veiculo.page.ts
function VistoriaHistoricoVeiculoPage_ion_spinner_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 15);
  }
}
function VistoriaHistoricoVeiculoPage_span_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1, "PDF");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_ion_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-button", 17);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_ion_button_10_Template_ion_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.voltar());
    });
    \u0275\u0275text(1, "Voltar");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275element(1, "ion-spinner", 15);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando pend\xEAncias...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "ion-text", 19)(2, "p", 20);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_text_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 19)(1, "p", 20);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.pdfErrorMessage);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_item_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label", 30);
    \u0275\u0275text(2, "Selecionar ve\xEDculo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-searchbar", 31);
    \u0275\u0275listener("ionInput", function VistoriaHistoricoVeiculoPage_div_14_ion_item_2_Template_ion_searchbar_ionInput_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onBuscarVeiculos($event));
    })("ionClear", function VistoriaHistoricoVeiculoPage_div_14_ion_item_2_Template_ion_searchbar_ionClear_3_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.limparVeiculoSelecionado());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("value", ctx_r1.veiculoSearch);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "ion-spinner", 15);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Buscando ve\xEDculos...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_card_4_ion_item_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 35);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_14_ion_card_4_ion_item_2_Template_ion_item_click_0_listener() {
      const veiculo_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.selecionarVeiculo(veiculo_r6));
    });
    \u0275\u0275elementStart(1, "ion-label")(2, "strong");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const veiculo_r6 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(veiculo_r6.descricao);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(veiculo_r6.placa);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_card_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 33)(1, "ion-card-content");
    \u0275\u0275template(2, VistoriaHistoricoVeiculoPage_div_14_ion_card_4_ion_item_2_Template, 6, 2, "ion-item", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.veiculos);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_card_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card")(1, "ion-card-content")(2, "p", 36)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "p")(6, "strong");
    \u0275\u0275text(7, "Total de pend\xEAncias:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Ve\xEDculo ", ctx_r1.veiculoDescricao);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.total);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_select_option_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const area_r7 = ctx.$implicit;
    \u0275\u0275property("value", area_r7.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", area_r7.nome, " ");
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ion_select_option_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 37);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const componente_r8 = ctx.$implicit;
    \u0275\u0275property("value", componente_r8.id);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", componente_r8.nome, " ");
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ion_spinner_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 15);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_span_24_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.isMidiaExpanded(item_r10.id) ? "Ocultar m\xEDdias" : "Carregar m\xEDdias", " ");
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46);
    \u0275\u0275element(1, "ion-spinner", 15);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Carregando m\xEDdias...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_4_img_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 51);
    \u0275\u0275listener("pointerup", function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_4_img_1_Template_img_pointerup_0_listener() {
      const midia_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.abrirImagem(midia_r12));
    })("click", function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_4_img_1_Template_img_click_0_listener() {
      const midia_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.abrirImagem(midia_r12));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const midia_r12 = ctx.$implicit;
    \u0275\u0275property("src", midia_r12.src, \u0275\u0275sanitizeUrl)("alt", midia_r12.nomeArquivo);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_4_img_1_Template, 1, 2, "img", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getImagens(item_r10));
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 52);
    \u0275\u0275text(1, "Sem imagens");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_10_div_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const midia_r13 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", ctx_r1.formatarDuracao(midia_r13.duracaoMs), ")");
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_10_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "p", 56);
    \u0275\u0275text(2);
    \u0275\u0275template(3, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_10_div_1_span_3_Template, 2, 1, "span", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "audio", 57);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const midia_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", midia_r13.nomeArquivo, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.formatarDuracao(midia_r13.duracaoMs));
    \u0275\u0275advance();
    \u0275\u0275property("src", midia_r13.src, \u0275\u0275sanitizeUrl);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 53);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_10_div_1_Template, 5, 3, "div", 54);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getAudios(item_r10));
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 52);
    \u0275\u0275text(1, "Sem audio");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "p")(2, "strong");
    \u0275\u0275text(3, "Imagens");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_4_Template, 2, 1, "div", 47)(5, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_ng_template_5_Template, 2, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(7, "p")(8, "strong");
    \u0275\u0275text(9, "\xC1udios");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_div_10_Template, 2, 1, "div", 48)(11, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_ng_template_11_Template, 2, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const semImagensTpl_r14 = \u0275\u0275reference(6);
    const semAudiosTpl_r15 = \u0275\u0275reference(12);
    const item_r10 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.getImagens(item_r10).length > 0)("ngIfElse", semImagensTpl_r14);
    \u0275\u0275advance(6);
    \u0275\u0275property("ngIf", ctx_r1.getAudios(item_r10).length > 0)("ngIfElse", semAudiosTpl_r15);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 40)(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "ion-card-content")(5, "p")(6, "strong");
    \u0275\u0275text(7, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p")(10, "strong");
    \u0275\u0275text(11, "Observa\xE7\xE3o:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 41)(14, "div", 42)(15, "div")(16, "p")(17, "strong");
    \u0275\u0275text(18, "M\xEDdias");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p", 43);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "ion-button", 44);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_Template_ion_button_click_22_listener() {
      const item_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleMidias(item_r10));
    });
    \u0275\u0275template(23, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ion_spinner_23_Template, 1, 0, "ion-spinner", 9)(24, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_span_24_Template, 2, 1, "span", 22);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(25, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_div_25_Template, 4, 0, "div", 45)(26, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_ng_container_26_Template, 13, 4, "ng-container", 22);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r10 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate3(" ", item_r10.nomeArea || "\xC1rea", " - ", item_r10.nomeComponente || "Componente", " - ", item_r10.descricaoSintoma || "Sintoma", " ");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate2(" ", item_r10.numeroVistoria, " (", ctx_r1.formatarData(item_r10.datavistoria), ")");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", item_r10.observacao || "-");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" (", item_r10.midias.length || 0, ")");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2(" ", ctx_r1.getQuantidadeImagens(item_r10), " imagem(ns) \u2022 ", ctx_r1.getQuantidadeAudios(item_r10), " \xE1udio(s) ");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.isMidiaLoading(item_r10.id));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isMidiaLoading(item_r10.id));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.isMidiaLoading(item_r10.id));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isMidiaLoading(item_r10.id));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isMidiaExpanded(item_r10.id) && ctx_r1.isMidiaLoaded(item_r10.id) && !ctx_r1.isMidiaLoading(item_r10.id));
  }
}
function VistoriaHistoricoVeiculoPage_div_14_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_14_div_20_ion_card_1_Template, 27, 14, "ion-card", 39);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.itensFiltrados);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ng_template_21_p_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1, " Nenhuma irregularidade n\xE3o resolvida para os filtros selecionados. ");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ng_template_21_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 59);
    \u0275\u0275text(1, "Selecione um ve\xEDculo para visualizar as pend\xEAncias.");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_14_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VistoriaHistoricoVeiculoPage_div_14_ng_template_21_p_0_Template, 2, 0, "p", 58)(1, VistoriaHistoricoVeiculoPage_div_14_ng_template_21_ng_template_1_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const selectVehicleHint_r16 = \u0275\u0275reference(2);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngIf", ctx_r1.selectedVeiculoId)("ngIfElse", selectVehicleHint_r16);
  }
}
function VistoriaHistoricoVeiculoPage_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_14_ion_text_1_Template, 3, 1, "ion-text", 21)(2, VistoriaHistoricoVeiculoPage_div_14_ion_item_2_Template, 4, 1, "ion-item", 22)(3, VistoriaHistoricoVeiculoPage_div_14_div_3_Template, 4, 0, "div", 23)(4, VistoriaHistoricoVeiculoPage_div_14_ion_card_4_Template, 3, 1, "ion-card", 24)(5, VistoriaHistoricoVeiculoPage_div_14_ion_card_5_Template, 9, 2, "ion-card", 22);
    \u0275\u0275elementStart(6, "ion-item")(7, "ion-label");
    \u0275\u0275text(8, "\xC1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "ion-select", 25);
    \u0275\u0275twoWayListener("ngModelChange", function VistoriaHistoricoVeiculoPage_div_14_Template_ion_select_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.areaFiltro, $event) || (ctx_r1.areaFiltro = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ionChange", function VistoriaHistoricoVeiculoPage_div_14_Template_ion_select_ionChange_9_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAreaChange());
    });
    \u0275\u0275elementStart(10, "ion-select-option", 26);
    \u0275\u0275text(11, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275template(12, VistoriaHistoricoVeiculoPage_div_14_ion_select_option_12_Template, 2, 2, "ion-select-option", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "ion-item")(14, "ion-label");
    \u0275\u0275text(15, "Componente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "ion-select", 28);
    \u0275\u0275twoWayListener("ngModelChange", function VistoriaHistoricoVeiculoPage_div_14_Template_ion_select_ngModelChange_16_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.componenteFiltro, $event) || (ctx_r1.componenteFiltro = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(17, "ion-select-option", 26);
    \u0275\u0275text(18, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275template(19, VistoriaHistoricoVeiculoPage_div_14_ion_select_option_19_Template, 2, 2, "ion-select-option", 27);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(20, VistoriaHistoricoVeiculoPage_div_14_div_20_Template, 2, 1, "div", 29)(21, VistoriaHistoricoVeiculoPage_div_14_ng_template_21_Template, 3, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emptyState_r17 = \u0275\u0275reference(22);
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.pdfErrorMessage);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.openedFromMenu);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.openedFromMenu && ctx_r1.loadingVeiculos);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.openedFromMenu && ctx_r1.veiculos.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedVeiculoId);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.areaFiltro);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.areaOptions);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.componenteFiltro);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngForOf", ctx_r1.componenteOptions);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedVeiculoId && ctx_r1.itensFiltrados.length > 0)("ngIfElse", emptyState_r17);
  }
}
function VistoriaHistoricoVeiculoPage_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 60);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_15_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharImagem());
    });
    \u0275\u0275elementStart(1, "div", 61);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_15_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r18);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "span", 62);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-button", 63);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_15_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharImagem());
    });
    \u0275\u0275text(5, "Fechar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 64);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_15_Template_div_click_6_listener($event) {
      \u0275\u0275restoreView(_r18);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(7, "img", 65);
    \u0275\u0275listener("touchstart", function VistoriaHistoricoVeiculoPage_div_15_Template_img_touchstart_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchStart($event));
    })("touchmove", function VistoriaHistoricoVeiculoPage_div_15_Template_img_touchmove_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchMove($event));
    })("touchend", function VistoriaHistoricoVeiculoPage_div_15_Template_img_touchend_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchEnd($event));
    })("touchcancel", function VistoriaHistoricoVeiculoPage_div_15_Template_img_touchcancel_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchEnd($event));
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.imagemSelecionada.nomeArquivo || "Imagem");
    \u0275\u0275advance(4);
    \u0275\u0275styleProp("transform", ctx_r1.imageTransform);
    \u0275\u0275property("src", ctx_r1.imagemSelecionada.src, \u0275\u0275sanitizeUrl)("alt", ctx_r1.imagemSelecionada.nomeArquivo);
  }
}
var VistoriaHistoricoVeiculoPage = class _VistoriaHistoricoVeiculoPage {
  router = inject(Router);
  flowService = inject(VistoriaFlowService);
  vistoriaService = inject(VistoriaService);
  veiculoService = inject(VeiculoService);
  authService = inject(AuthService);
  errorMessageService = inject(ErrorMessageService);
  loading = false;
  gerandoPdf = false;
  errorMessage = "";
  pdfErrorMessage = "";
  veiculoDescricao = "-";
  total = 0;
  itens = [];
  areaOptions = [];
  componenteOptions = [];
  areaFiltro = "";
  componenteFiltro = "";
  selectedVeiculoId = "";
  openedFromMenu = false;
  veiculoSearch = "";
  veiculos = [];
  loadingVeiculos = false;
  imagemSelecionada = null;
  expandedMidias = /* @__PURE__ */ new Set();
  loadingMidias = /* @__PURE__ */ new Set();
  loadedMidias = /* @__PURE__ */ new Set();
  imageScale = 1;
  imageTranslateX = 0;
  imageTranslateY = 0;
  pinchStartDistance = null;
  pinchStartScale = 1;
  panStartX = 0;
  panStartY = 0;
  lastTapTs = 0;
  initialized = false;
  get itensFiltrados() {
    return this.itens.filter((item) => {
      const byArea = !this.areaFiltro || item.idarea === this.areaFiltro;
      const byComponente = !this.componenteFiltro || item.idcomponente === this.componenteFiltro;
      return byArea && byComponente;
    });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      yield this.syncContextFromNavigation();
      this.initialized = true;
    });
  }
  ionViewWillEnter() {
    return __async(this, null, function* () {
      if (!this.initialized) {
        return;
      }
      yield this.syncContextFromNavigation();
    });
  }
  onBuscarVeiculos(event) {
    return __async(this, null, function* () {
      if (!this.openedFromMenu) {
        return;
      }
      const value = (event.detail?.value ?? "").toString();
      this.veiculoSearch = value;
      if (!value.trim()) {
        this.veiculos = [];
        this.limparVeiculoSelecionado();
        return;
      }
      this.loadingVeiculos = true;
      try {
        this.veiculos = yield this.veiculoService.searchAtivos(value);
      } catch {
        this.veiculos = [];
      } finally {
        this.loadingVeiculos = false;
      }
    });
  }
  selecionarVeiculo(veiculo) {
    return __async(this, null, function* () {
      if (!this.openedFromMenu) {
        return;
      }
      this.selectedVeiculoId = veiculo.id;
      this.veiculoDescricao = veiculo.descricao || "-";
      this.veiculoSearch = `${veiculo.descricao} - ${veiculo.placa}`;
      this.veiculos = [];
      yield this.carregar(veiculo.id);
    });
  }
  limparVeiculoSelecionado() {
    if (!this.openedFromMenu) {
      return;
    }
    this.resetHistoricoState();
    this.veiculoSearch = "";
    this.veiculos = [];
  }
  voltar() {
    this.router.navigate(["/vistoria/areas"]);
  }
  gerarRelatorioPdf() {
    return __async(this, null, function* () {
      if (!this.selectedVeiculoId || this.gerandoPdf) {
        return;
      }
      this.gerandoPdf = true;
      this.pdfErrorMessage = "";
      try {
        if (Capacitor.isNativePlatform()) {
          yield this.abrirPdfNativo();
          return;
        }
        const blob = yield this.vistoriaService.baixarPdfPendenciasVeiculo(this.selectedVeiculoId, {
          areaId: this.areaFiltro || void 0,
          componenteId: this.componenteFiltro || void 0
        });
        if (!this.isPdfBlob(blob)) {
          throw new Error("Relat\xF3rio PDF n\xE3o dispon\xEDvel neste ambiente.");
        }
        yield this.abrirPdfWeb(blob);
      } catch (error) {
        this.pdfErrorMessage = this.mensagemErroGerarPdf(error);
      } finally {
        this.gerandoPdf = false;
      }
    });
  }
  abrirPdfNativo() {
    return __async(this, null, function* () {
      if (!this.selectedVeiculoId) {
        return;
      }
      const token = yield this.authService.getAccessToken();
      if (!token) {
        throw new Error("Sess\xE3o expirada. Fa\xE7a login novamente.");
      }
      const fileName = `pendencias-veiculo-${this.sanitizeFilename(this.veiculoDescricao)}.pdf`;
      const downloaded = yield Filesystem.downloadFile({
        url: this.vistoriaService.montarUrlPdfPendenciasVeiculo(this.selectedVeiculoId, {
          areaId: this.areaFiltro || void 0,
          componenteId: this.componenteFiltro || void 0
        }),
        path: fileName,
        directory: Directory.Cache,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const filePath = downloaded.path;
      if (!filePath) {
        throw new Error("N\xE3o foi poss\xEDvel baixar o relat\xF3rio PDF.");
      }
      try {
        yield FileOpener.open({
          filePath,
          contentType: "application/pdf",
          openWithDefault: true
        });
      } catch (error) {
        throw new Error(this.mensagemErroAbrirPdf(error));
      }
    });
  }
  abrirPdfWeb(blob) {
    return __async(this, null, function* () {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
    });
  }
  isPdfBlob(blob) {
    const tipo = (blob.type || "").toLowerCase();
    return !tipo || tipo.includes("pdf") || tipo === "application/octet-stream";
  }
  mensagemErroGerarPdf(error) {
    const raw = typeof error === "object" && error !== null && "message" in error ? String(error.message) : String(error ?? "");
    if (/error downloading file/i.test(raw)) {
      return "N\xE3o foi poss\xEDvel baixar o relat\xF3rio PDF. Tente novamente.";
    }
    const status = Number(typeof error === "object" && error !== null && "status" in error ? error.status : 0);
    if (status === 404) {
      return "Relat\xF3rio PDF n\xE3o dispon\xEDvel neste ambiente. Verifique se a API est\xE1 atualizada.";
    }
    if (status === 403) {
      return "Voc\xEA n\xE3o tem permiss\xE3o para gerar o relat\xF3rio PDF.";
    }
    return this.errorMessageService.fromApi(error, "N\xE3o foi poss\xEDvel gerar o relat\xF3rio PDF.");
  }
  mensagemErroAbrirPdf(error) {
    const raw = typeof error === "object" && error !== null && "message" in error ? String(error.message) : String(error ?? "");
    if (/activity not found|no app|unavailable|not found to handle/i.test(raw)) {
      return "Nenhum aplicativo para abrir PDF est\xE1 instalado neste dispositivo.";
    }
    if (/error downloading file/i.test(raw)) {
      return "N\xE3o foi poss\xEDvel baixar o relat\xF3rio PDF. Tente novamente.";
    }
    return this.errorMessageService.fromApi(error, "N\xE3o foi poss\xEDvel abrir o relat\xF3rio PDF.");
  }
  sanitizeFilename(value) {
    const cleaned = value.replace(/[<>:"/\\|?*]+/g, "").trim();
    return cleaned.slice(0, 40) || "veiculo";
  }
  onAreaChange() {
    if (!this.areaFiltro) {
      this.componenteFiltro = "";
      this.rebuildComponenteOptions();
      return;
    }
    const componentesDaArea = this.itens.filter((item) => item.idarea === this.areaFiltro).map((item) => ({ id: item.idcomponente, nome: item.nomeComponente ?? "Componente" }));
    this.componenteOptions = this.deduplicateOptions(componentesDaArea);
    if (this.componenteFiltro && !this.componenteOptions.some((option) => option.id === this.componenteFiltro)) {
      this.componenteFiltro = "";
    }
  }
  formatarData(dateIso) {
    if (!dateIso) {
      return "-";
    }
    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleString("pt-BR");
  }
  abrirImagem(midia) {
    if (!midia.src) {
      return;
    }
    this.resetImageTransform();
    this.imagemSelecionada = {
      nomeArquivo: midia.nomeArquivo,
      src: midia.src
    };
  }
  fecharImagem() {
    this.imagemSelecionada = null;
    this.resetImageTransform();
  }
  get imageTransform() {
    return `translate(${this.imageTranslateX}px, ${this.imageTranslateY}px) scale(${this.imageScale})`;
  }
  onImageTouchStart(event) {
    if (event.touches.length === 2) {
      this.pinchStartDistance = this.getTouchDistance(event.touches[0], event.touches[1]);
      this.pinchStartScale = this.imageScale;
      return;
    }
    if (event.touches.length === 1 && this.imageScale > 1) {
      const touch = event.touches[0];
      this.panStartX = touch.clientX - this.imageTranslateX;
      this.panStartY = touch.clientY - this.imageTranslateY;
    }
    const now = Date.now();
    if (now - this.lastTapTs < 280) {
      if (this.imageScale === 1) {
        this.imageScale = 2;
      } else {
        this.resetImageTransform();
      }
      this.lastTapTs = 0;
      return;
    }
    this.lastTapTs = now;
  }
  onImageTouchMove(event) {
    if (event.touches.length === 2 && this.pinchStartDistance) {
      const currentDistance = this.getTouchDistance(event.touches[0], event.touches[1]);
      const nextScale = this.pinchStartScale * (currentDistance / this.pinchStartDistance);
      this.imageScale = this.clamp(nextScale, 1, 4);
      this.clampTranslation();
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && this.imageScale > 1) {
      const touch = event.touches[0];
      this.imageTranslateX = touch.clientX - this.panStartX;
      this.imageTranslateY = touch.clientY - this.panStartY;
      this.clampTranslation();
      event.preventDefault();
    }
  }
  onImageTouchEnd(event) {
    if (event.touches.length < 2) {
      this.pinchStartDistance = null;
    }
    if (this.imageScale <= 1) {
      this.imageScale = 1;
      this.imageTranslateX = 0;
      this.imageTranslateY = 0;
      return;
    }
    this.clampTranslation();
  }
  resetImageTransform() {
    this.imageScale = 1;
    this.imageTranslateX = 0;
    this.imageTranslateY = 0;
    this.pinchStartDistance = null;
    this.pinchStartScale = 1;
  }
  getTouchDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  clampTranslation() {
    if (this.imageScale <= 1) {
      this.imageTranslateX = 0;
      this.imageTranslateY = 0;
      return;
    }
    const maxOffsetX = (window.innerWidth * this.imageScale - window.innerWidth) / 2;
    const maxOffsetY = (window.innerHeight * this.imageScale - window.innerHeight) / 2;
    this.imageTranslateX = this.clamp(this.imageTranslateX, -maxOffsetX, maxOffsetX);
    this.imageTranslateY = this.clamp(this.imageTranslateY, -maxOffsetY, maxOffsetY);
  }
  formatarDuracao(ms) {
    if (!ms || ms <= 0) {
      return "";
    }
    const totalSegundos = Math.floor(ms / 1e3);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
  }
  getImagens(item) {
    return (item.midias ?? []).filter((midia) => midia.tipo === "imagem");
  }
  getAudios(item) {
    return (item.midias ?? []).filter((midia) => midia.tipo === "audio");
  }
  getQuantidadeImagens(item) {
    return (item.midias ?? []).filter((midia) => midia.tipo === "imagem").length;
  }
  getQuantidadeAudios(item) {
    return (item.midias ?? []).filter((midia) => midia.tipo === "audio").length;
  }
  isMidiaExpanded(irregularidadeId) {
    return this.expandedMidias.has(irregularidadeId);
  }
  isMidiaLoading(irregularidadeId) {
    return this.loadingMidias.has(irregularidadeId);
  }
  isMidiaLoaded(irregularidadeId) {
    return this.loadedMidias.has(irregularidadeId);
  }
  toggleMidias(item) {
    return __async(this, null, function* () {
      if (this.expandedMidias.has(item.id)) {
        this.expandedMidias.delete(item.id);
        return;
      }
      this.expandedMidias.add(item.id);
      if (!this.loadedMidias.has(item.id)) {
        yield this.carregarMidiasIrregularidade(item);
      }
    });
  }
  carregar(veiculoId) {
    return __async(this, null, function* () {
      const targetVeiculoId = veiculoId || this.selectedVeiculoId;
      if (!targetVeiculoId) {
        this.itens = [];
        this.total = 0;
        this.areaOptions = [];
        this.componenteOptions = [];
        return;
      }
      this.areaFiltro = "";
      this.componenteFiltro = "";
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = yield this.vistoriaService.listarHistoricoIrregularidadesNaoResolvidas(targetVeiculoId);
        this.veiculoDescricao = response.veiculo || this.veiculoDescricao || "-";
        this.total = response.total ?? 0;
        this.itens = response.itens ?? [];
        this.expandedMidias.clear();
        this.loadingMidias.clear();
        this.loadedMidias.clear();
        this.imagemSelecionada = null;
        this.areaOptions = this.deduplicateOptions(this.itens.map((item) => ({ id: item.idarea, nome: item.nomeArea ?? "\xC1rea" })));
        this.rebuildComponenteOptions();
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel carregar as pendencias do veiculo.");
      } finally {
        this.loading = false;
      }
    });
  }
  syncContextFromNavigation() {
    return __async(this, null, function* () {
      const navState = this.router.getCurrentNavigation()?.extras?.state ?? history.state ?? {};
      const flowVistoriaId = this.flowService.getVistoriaId();
      const flowVeiculoId = this.flowService.getVeiculoId();
      if (navState.fromMenu === true) {
        this.openedFromMenu = true;
      } else if (navState.fromMenu === false) {
        this.openedFromMenu = false;
      } else {
        this.openedFromMenu = !flowVistoriaId;
      }
      if (!this.openedFromMenu && flowVeiculoId) {
        this.selectedVeiculoId = flowVeiculoId;
        this.veiculoDescricao = this.flowService.getVeiculoDescricao() || "-";
        this.veiculoSearch = this.veiculoDescricao;
        this.veiculos = [];
        yield this.carregar(flowVeiculoId);
        return;
      }
      if (this.openedFromMenu && this.selectedVeiculoId) {
        yield this.carregar(this.selectedVeiculoId);
        return;
      }
      if (this.openedFromMenu && !this.selectedVeiculoId) {
        this.resetHistoricoState();
        this.veiculoSearch = "";
        this.veiculos = [];
        return;
      }
      this.resetHistoricoState();
    });
  }
  resetHistoricoState() {
    this.selectedVeiculoId = "";
    this.veiculoDescricao = "-";
    this.total = 0;
    this.itens = [];
    this.areaFiltro = "";
    this.componenteFiltro = "";
    this.areaOptions = [];
    this.componenteOptions = [];
    this.expandedMidias.clear();
    this.loadingMidias.clear();
    this.loadedMidias.clear();
    this.imagemSelecionada = null;
    this.errorMessage = "";
  }
  carregarMidiasIrregularidade(item) {
    return __async(this, null, function* () {
      if (this.loadingMidias.has(item.id)) {
        return;
      }
      this.loadingMidias.add(item.id);
      try {
        const [imagensResumo, audiosResumo] = yield Promise.all([
          this.vistoriaService.listarIrregularidadesImagens(item.idvistoria, item.id),
          this.vistoriaService.listarIrregularidadesAudios(item.idvistoria, item.id)
        ]);
        this.atualizarMidiasDoItem(item, imagensResumo, audiosResumo);
        this.loadedMidias.add(item.id);
      } catch (error) {
        this.errorMessage = this.errorMessageService.fromApi(error, "Nao foi possivel carregar as midias desta irregularidade.");
      } finally {
        this.loadingMidias.delete(item.id);
      }
    });
  }
  atualizarMidiasDoItem(item, imagensResumo, audiosResumo) {
    const imagens = imagensResumo.find((i) => i.idirregularidade === item.id)?.imagens ?? [];
    const audios = audiosResumo.find((a) => a.idirregularidade === item.id)?.audios ?? [];
    const imagensCarregadas = imagens.map((img, index) => {
      const existente = (item.midias ?? []).find((m) => m.tipo === "imagem" && m.nomeArquivo === img.nomeArquivo);
      const mimeType = existente?.mimeType || this.getMimeTypeFromFilename(img.nomeArquivo);
      const dadosBase64 = img.dadosBase64;
      return {
        id: existente?.id || `img-${item.id}-${index}`,
        tipo: "imagem",
        nomeArquivo: img.nomeArquivo,
        mimeType,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64,
        src: this.buildMidiaSrc(dadosBase64, mimeType)
      };
    });
    const audiosCarregados = audios.map((audio, index) => {
      const existente = (item.midias ?? []).find((m) => m.tipo === "audio" && (m.id === audio.id || m.nomeArquivo === audio.nomeArquivo));
      const mimeType = audio.mimeType || existente?.mimeType || "audio/m4a";
      const dadosBase64 = audio.dadosBase64;
      return {
        id: audio.id || existente?.id || `audio-${item.id}-${index}`,
        tipo: "audio",
        nomeArquivo: audio.nomeArquivo,
        mimeType,
        tamanho: existente?.tamanho || 0,
        dadosBase64,
        duracaoMs: audio.duracaoMs ?? existente?.duracaoMs,
        src: this.buildMidiaSrc(dadosBase64, mimeType)
      };
    });
    this.itens = this.itens.map((current) => current.id === item.id ? __spreadProps(__spreadValues({}, current), {
      midias: [...imagensCarregadas, ...audiosCarregados]
    }) : current);
  }
  buildMidiaSrc(dadosBase64, mimeType) {
    return `data:${mimeType};base64,${dadosBase64}`;
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
  rebuildComponenteOptions() {
    const source = this.areaFiltro ? this.itens.filter((item) => item.idarea === this.areaFiltro) : this.itens;
    this.componenteOptions = this.deduplicateOptions(source.map((item) => ({ id: item.idcomponente, nome: item.nomeComponente ?? "Componente" })));
  }
  deduplicateOptions(items) {
    const map = /* @__PURE__ */ new Map();
    items.forEach((item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item.nome);
      }
    });
    return Array.from(map.entries()).map(([id, nome]) => ({ id, nome }));
  }
  static \u0275fac = function VistoriaHistoricoVeiculoPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaHistoricoVeiculoPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaHistoricoVeiculoPage, selectors: [["app-vistoria-historico-veiculo"]], decls: 16, vars: 10, consts: [["emptyState", ""], ["semImagensTpl", ""], ["semAudiosTpl", ""], ["selectVehicleHint", ""], [3, "translucent"], ["slot", "start"], ["menu", "main-menu"], ["slot", "end"], ["fill", "clear", "color", "danger", "aria-label", "Imprimir relat\xF3rio PDF", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["class", "pdf-mark", "aria-hidden", "true", 4, "ngIf"], ["fill", "solid", 3, "click", 4, "ngIf"], [3, "fullscreen"], ["class", "content", 4, "ngIf"], ["class", "image-overlay", 3, "click", 4, "ngIf"], ["name", "crescent"], ["aria-hidden", "true", 1, "pdf-mark"], ["fill", "solid", 3, "click"], [1, "content"], ["color", "danger"], [1, "error-message"], ["color", "danger", 4, "ngIf"], [4, "ngIf"], ["class", "search-loading", 4, "ngIf"], ["class", "search-results", 4, "ngIf"], ["interface", "popover", "placeholder", "Todas", 3, "ngModelChange", "ionChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "popover", "placeholder", "Todos", 3, "ngModelChange", "ngModel"], ["class", "cards-container", 4, "ngIf", "ngIfElse"], ["position", "stacked"], ["placeholder", "Digite placa ou descri\xE7\xE3o", 3, "ionInput", "ionClear", "value"], [1, "search-loading"], [1, "search-results"], ["lines", "none", "button", "", 3, "click", 4, "ngFor", "ngForOf"], ["lines", "none", "button", "", 3, "click"], [1, "veiculo-destaque"], [3, "value"], [1, "cards-container"], ["class", "level-card", 4, "ngFor", "ngForOf"], [1, "level-card"], [1, "midias-section"], [1, "midias-header"], [1, "midias-resumo"], ["size", "small", "fill", "outline", 3, "click", "disabled"], ["class", "midias-loading", 4, "ngIf"], [1, "midias-loading"], ["class", "imagem-grid", 4, "ngIf", "ngIfElse"], ["class", "audio-list", 4, "ngIf", "ngIfElse"], [1, "imagem-grid"], [3, "src", "alt", "pointerup", "click", 4, "ngFor", "ngForOf"], [3, "pointerup", "click", "src", "alt"], [1, "sem-midia"], [1, "audio-list"], ["class", "audio-item", 4, "ngFor", "ngForOf"], [1, "audio-item"], [1, "audio-name"], ["controls", "", "preload", "none", 3, "src"], ["class", "empty-text", 4, "ngIf", "ngIfElse"], [1, "empty-text"], [1, "image-overlay", 3, "click"], [1, "image-overlay-header", 3, "click"], [1, "image-overlay-title"], ["fill", "solid", "size", "small", 3, "click"], [1, "image-overlay-body", 3, "click"], [1, "image-modal-preview", 3, "touchstart", "touchmove", "touchend", "touchcancel", "src", "alt"]], template: function VistoriaHistoricoVeiculoPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 4)(1, "ion-toolbar")(2, "ion-buttons", 5);
      \u0275\u0275element(3, "ion-menu-button", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Pend\xEAncias do Ve\xEDculo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 7)(7, "ion-button", 8);
      \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_Template_ion_button_click_7_listener() {
        return ctx.gerarRelatorioPdf();
      });
      \u0275\u0275template(8, VistoriaHistoricoVeiculoPage_ion_spinner_8_Template, 1, 0, "ion-spinner", 9)(9, VistoriaHistoricoVeiculoPage_span_9_Template, 2, 0, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275template(10, VistoriaHistoricoVeiculoPage_ion_button_10_Template, 2, 0, "ion-button", 11);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(11, "ion-content", 12);
      \u0275\u0275template(12, VistoriaHistoricoVeiculoPage_div_12_Template, 4, 0, "div", 13)(13, VistoriaHistoricoVeiculoPage_div_13_Template, 4, 1, "div", 13)(14, VistoriaHistoricoVeiculoPage_div_14_Template, 23, 11, "div", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(15, VistoriaHistoricoVeiculoPage_div_15_Template, 8, 5, "div", 14);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("disabled", !ctx.selectedVeiculoId || ctx.gerandoPdf);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.gerandoPdf);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.gerandoPdf);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.openedFromMenu);
      \u0275\u0275advance();
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loading);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loading && !ctx.errorMessage);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.imagemSelecionada);
    }
  }, dependencies: [
    CommonModule,
    NgForOf,
    NgIf,
    FormsModule,
    NgControlStatus,
    NgModel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText
  ], styles: ['@charset "UTF-8";\n\n\n\n.content[_ngcontent-%COMP%] {\n  padding: 12px;\n}\nion-toolbar[_ngcontent-%COMP%]   ion-button[aria-label="Imprimir relat\\f3rio PDF"][_ngcontent-%COMP%] {\n  min-width: 44px;\n  min-height: 44px;\n  --color: var(--ion-color-danger);\n  --color-hover: var(--ion-color-danger-shade);\n  --color-focused: var(--ion-color-danger-shade);\n  --color-activated: var(--ion-color-danger-shade);\n}\nion-toolbar[_ngcontent-%COMP%]   ion-button[aria-label="Imprimir relat\\f3rio PDF"][_ngcontent-%COMP%]   .pdf-mark[_ngcontent-%COMP%] {\n  font-family:\n    Arial,\n    Helvetica,\n    sans-serif;\n  font-size: 1.2rem;\n  font-weight: 800;\n  letter-spacing: -0.06em;\n  line-height: 1;\n}\nion-toolbar[_ngcontent-%COMP%]   ion-button[aria-label="Imprimir relat\\f3rio PDF"][_ngcontent-%COMP%]   ion-spinner[_ngcontent-%COMP%] {\n  width: 1.35rem;\n  height: 1.35rem;\n}\nion-toolbar[_ngcontent-%COMP%]   ion-button[aria-label="Imprimir relat\\f3rio PDF"][disabled][_ngcontent-%COMP%] {\n  opacity: 0.45;\n}\n.cards-container[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  display: grid;\n  gap: 12px;\n}\n.search-loading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 8px 0 0;\n  color: #6b7280;\n}\n.search-results[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.veiculo-destaque[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #1d4ed8;\n}\n.midias-section[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\n.midias-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.midias-resumo[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  color: #6b7280;\n  font-size: 0.8rem;\n}\n.midias-loading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.imagem-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 8px;\n  margin-bottom: 10px;\n}\n.imagem-grid[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 120px;\n  object-fit: cover;\n  border-radius: 8px;\n  border: 1px solid #d1d5db;\n  cursor: zoom-in;\n}\n.audio-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n.audio-item[_ngcontent-%COMP%]   audio[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.audio-name[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 0.85rem;\n}\n.sem-midia[_ngcontent-%COMP%] {\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.empty-text[_ngcontent-%COMP%] {\n  margin: 16px 0;\n  color: #6b7280;\n  text-align: center;\n}\n.image-modal-content[_ngcontent-%COMP%] {\n  --background: #000000;\n}\n.image-modal-container[_ngcontent-%COMP%] {\n  min-height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n.image-modal-preview[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: calc(100vh - 120px);\n  object-fit: contain;\n  border-radius: 8px;\n  touch-action: none;\n  transition: transform 0.08s ease-out;\n  will-change: transform;\n}\n.image-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  background: rgba(0, 0, 0, 0.95);\n  display: flex;\n  flex-direction: column;\n}\n.image-overlay-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  color: #ffffff;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n}\n.image-overlay-title[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.image-overlay-body[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n/*# sourceMappingURL=vistoria-historico-veiculo.page.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaHistoricoVeiculoPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-historico-veiculo", standalone: true, imports: [
      CommonModule,
      FormsModule,
      IonHeader,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonTitle,
      IonButton,
      IonContent,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonCardContent,
      IonItem,
      IonLabel,
      IonSearchbar,
      IonSelect,
      IonSelectOption,
      IonSpinner,
      IonText
    ], template: `<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-menu-button menu="main-menu"></ion-menu-button>
    </ion-buttons>
    <ion-title>Pend\xEAncias do Ve\xEDculo</ion-title>
    <ion-buttons slot="end">
      <ion-button
        fill="clear"
        color="danger"
        [disabled]="!selectedVeiculoId || gerandoPdf"
        (click)="gerarRelatorioPdf()"
        aria-label="Imprimir relat\xF3rio PDF"
      >
        <ion-spinner *ngIf="gerandoPdf" name="crescent"></ion-spinner>
        <span *ngIf="!gerandoPdf" class="pdf-mark" aria-hidden="true">PDF</span>
      </ion-button>
      <ion-button fill="solid" *ngIf="!openedFromMenu" (click)="voltar()">Voltar</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div class="content" *ngIf="loading">
    <ion-spinner name="crescent"></ion-spinner>
    <p>Carregando pend\xEAncias...</p>
  </div>

  <div class="content" *ngIf="errorMessage">
    <ion-text color="danger"><p class="error-message">{{ errorMessage }}</p></ion-text>
  </div>

  <div class="content" *ngIf="!loading && !errorMessage">
    <ion-text color="danger" *ngIf="pdfErrorMessage">
      <p class="error-message">{{ pdfErrorMessage }}</p>
    </ion-text>
    <ion-item *ngIf="openedFromMenu">
      <ion-label position="stacked">Selecionar ve\xEDculo</ion-label>
      <ion-searchbar
        [value]="veiculoSearch"
        placeholder="Digite placa ou descri\xE7\xE3o"
        (ionInput)="onBuscarVeiculos($event)"
        (ionClear)="limparVeiculoSelecionado()"
      ></ion-searchbar>
    </ion-item>

    <div class="search-loading" *ngIf="openedFromMenu && loadingVeiculos">
      <ion-spinner name="crescent"></ion-spinner>
      <span>Buscando ve\xEDculos...</span>
    </div>

    <ion-card *ngIf="openedFromMenu && veiculos.length > 0" class="search-results">
      <ion-card-content>
        <ion-item
          *ngFor="let veiculo of veiculos"
          lines="none"
          button
          (click)="selecionarVeiculo(veiculo)"
        >
          <ion-label>
            <strong>{{ veiculo.descricao }}</strong>
            <p>{{ veiculo.placa }}</p>
          </ion-label>
        </ion-item>
      </ion-card-content>
    </ion-card>

    <ion-card *ngIf="selectedVeiculoId">
      <ion-card-content>
        <p class="veiculo-destaque"><strong>Ve\xEDculo {{ veiculoDescricao }}</strong></p>
        <p><strong>Total de pend\xEAncias:</strong> {{ total }}</p>
      </ion-card-content>
    </ion-card>

    <ion-item>
      <ion-label>\xC1rea</ion-label>
      <ion-select [(ngModel)]="areaFiltro" (ionChange)="onAreaChange()" interface="popover" placeholder="Todas">
        <ion-select-option value="">Todas</ion-select-option>
        <ion-select-option *ngFor="let area of areaOptions" [value]="area.id">
          {{ area.nome }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label>Componente</ion-label>
      <ion-select [(ngModel)]="componenteFiltro" interface="popover" placeholder="Todos">
        <ion-select-option value="">Todos</ion-select-option>
        <ion-select-option *ngFor="let componente of componenteOptions" [value]="componente.id">
          {{ componente.nome }}
        </ion-select-option>
      </ion-select>
    </ion-item>

    <div class="cards-container" *ngIf="selectedVeiculoId && itensFiltrados.length > 0; else emptyState">
      <ion-card *ngFor="let item of itensFiltrados" class="level-card">
        <ion-card-header>
          <ion-card-title>
            {{ item.nomeArea || '\xC1rea' }} - {{ item.nomeComponente || 'Componente' }} - {{ item.descricaoSintoma || 'Sintoma' }}
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>Vistoria:</strong> {{ item.numeroVistoria }} ({{ formatarData(item.datavistoria) }})</p>
          <p><strong>Observa\xE7\xE3o:</strong> {{ item.observacao || '-' }}</p>

          <div class="midias-section">
            <div class="midias-header">
              <div>
                <p><strong>M\xEDdias</strong> ({{ item.midias.length || 0 }})</p>
                <p class="midias-resumo">
                  {{ getQuantidadeImagens(item) }} imagem(ns) \u2022 {{ getQuantidadeAudios(item) }} \xE1udio(s)
                </p>
              </div>
              <ion-button
                size="small"
                fill="outline"
                (click)="toggleMidias(item)"
                [disabled]="isMidiaLoading(item.id)"
              >
                <ion-spinner *ngIf="isMidiaLoading(item.id)" name="crescent"></ion-spinner>
                <span *ngIf="!isMidiaLoading(item.id)">
                  {{ isMidiaExpanded(item.id) ? 'Ocultar m\xEDdias' : 'Carregar m\xEDdias' }}
                </span>
              </ion-button>
            </div>

            <div class="midias-loading" *ngIf="isMidiaLoading(item.id)">
              <ion-spinner name="crescent"></ion-spinner>
              <span>Carregando m\xEDdias...</span>
            </div>

            <ng-container *ngIf="isMidiaExpanded(item.id) && isMidiaLoaded(item.id) && !isMidiaLoading(item.id)">
              <p><strong>Imagens</strong></p>
              <div class="imagem-grid" *ngIf="getImagens(item).length > 0; else semImagensTpl">
                <img
                  *ngFor="let midia of getImagens(item)"
                  [src]="midia.src"
                  [alt]="midia.nomeArquivo"
                  (pointerup)="abrirImagem(midia)"
                  (click)="abrirImagem(midia)"
                />
              </div>
              <ng-template #semImagensTpl>
                <p class="sem-midia">Sem imagens</p>
              </ng-template>

              <p><strong>\xC1udios</strong></p>
              <div class="audio-list" *ngIf="getAudios(item).length > 0; else semAudiosTpl">
                <div *ngFor="let midia of getAudios(item)" class="audio-item">
                  <p class="audio-name">
                    {{ midia.nomeArquivo }}
                    <span *ngIf="formatarDuracao(midia.duracaoMs)">({{ formatarDuracao(midia.duracaoMs) }})</span>
                  </p>
                  <audio [src]="midia.src" controls preload="none"></audio>
                </div>
              </div>
              <ng-template #semAudiosTpl>
                <p class="sem-midia">Sem audio</p>
              </ng-template>
            </ng-container>
          </div>
        </ion-card-content>
      </ion-card>
    </div>

    <ng-template #emptyState>
      <p class="empty-text" *ngIf="selectedVeiculoId; else selectVehicleHint">
        Nenhuma irregularidade n\xE3o resolvida para os filtros selecionados.
      </p>
      <ng-template #selectVehicleHint>
        <p class="empty-text">Selecione um ve\xEDculo para visualizar as pend\xEAncias.</p>
      </ng-template>
    </ng-template>
  </div>
</ion-content>

<div class="image-overlay" *ngIf="imagemSelecionada" (click)="fecharImagem()">
  <div class="image-overlay-header" (click)="$event.stopPropagation()">
    <span class="image-overlay-title">{{ imagemSelecionada.nomeArquivo || 'Imagem' }}</span>
    <ion-button fill="solid" size="small" (click)="fecharImagem()">Fechar</ion-button>
  </div>
  <div class="image-overlay-body" (click)="$event.stopPropagation()">
    <img
      [src]="imagemSelecionada.src"
      [alt]="imagemSelecionada.nomeArquivo"
      class="image-modal-preview"
      [style.transform]="imageTransform"
      (touchstart)="onImageTouchStart($event)"
      (touchmove)="onImageTouchMove($event)"
      (touchend)="onImageTouchEnd($event)"
      (touchcancel)="onImageTouchEnd($event)"
    />
  </div>
</div>
`, styles: ['@charset "UTF-8";\n\n/* src/app/pages/vistoria/vistoria-historico-veiculo.page.scss */\n.content {\n  padding: 12px;\n}\nion-toolbar ion-button[aria-label="Imprimir relat\\f3rio PDF"] {\n  min-width: 44px;\n  min-height: 44px;\n  --color: var(--ion-color-danger);\n  --color-hover: var(--ion-color-danger-shade);\n  --color-focused: var(--ion-color-danger-shade);\n  --color-activated: var(--ion-color-danger-shade);\n}\nion-toolbar ion-button[aria-label="Imprimir relat\\f3rio PDF"] .pdf-mark {\n  font-family:\n    Arial,\n    Helvetica,\n    sans-serif;\n  font-size: 1.2rem;\n  font-weight: 800;\n  letter-spacing: -0.06em;\n  line-height: 1;\n}\nion-toolbar ion-button[aria-label="Imprimir relat\\f3rio PDF"] ion-spinner {\n  width: 1.35rem;\n  height: 1.35rem;\n}\nion-toolbar ion-button[aria-label="Imprimir relat\\f3rio PDF"][disabled] {\n  opacity: 0.45;\n}\n.cards-container {\n  margin-top: 12px;\n  display: grid;\n  gap: 12px;\n}\n.search-loading {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 8px 0 0;\n  color: #6b7280;\n}\n.search-results {\n  margin-top: 8px;\n}\n.veiculo-destaque {\n  font-size: 1rem;\n  color: #1d4ed8;\n}\n.midias-section {\n  margin-top: 10px;\n}\n.midias-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.midias-resumo {\n  margin: 2px 0 0;\n  color: #6b7280;\n  font-size: 0.8rem;\n}\n.midias-loading {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.imagem-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 8px;\n  margin-bottom: 10px;\n}\n.imagem-grid img {\n  width: 100%;\n  height: 120px;\n  object-fit: cover;\n  border-radius: 8px;\n  border: 1px solid #d1d5db;\n  cursor: zoom-in;\n}\n.audio-list {\n  display: grid;\n  gap: 10px;\n}\n.audio-item audio {\n  width: 100%;\n}\n.audio-name {\n  margin: 0 0 6px;\n  font-size: 0.85rem;\n}\n.sem-midia {\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.empty-text {\n  margin: 16px 0;\n  color: #6b7280;\n  text-align: center;\n}\n.image-modal-content {\n  --background: #000000;\n}\n.image-modal-container {\n  min-height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n.image-modal-preview {\n  width: 100%;\n  max-height: calc(100vh - 120px);\n  object-fit: contain;\n  border-radius: 8px;\n  touch-action: none;\n  transition: transform 0.08s ease-out;\n  will-change: transform;\n}\n.image-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  background: rgba(0, 0, 0, 0.95);\n  display: flex;\n  flex-direction: column;\n}\n.image-overlay-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  color: #ffffff;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n}\n.image-overlay-title {\n  font-size: 0.9rem;\n  font-weight: 600;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.image-overlay-body {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n/*# sourceMappingURL=vistoria-historico-veiculo.page.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaHistoricoVeiculoPage, { className: "VistoriaHistoricoVeiculoPage", filePath: "app/pages/vistoria/vistoria-historico-veiculo.page.ts", lineNumber: 74 });
})();
export {
  VistoriaHistoricoVeiculoPage
};
//# sourceMappingURL=chunk-FWYWSGX4.js.map
