import {
  VeiculoService
} from "./chunk-WKRXQXWF.js";
import {
  VistoriaService
} from "./chunk-FMHQP3QV.js";
import {
  VistoriaFlowService
} from "./chunk-H4N3HFGI.js";
import {
  ErrorMessageService
} from "./chunk-P3DEM65Q.js";
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
} from "./chunk-IS355SV5.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-5JG7MXFI.js";
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

// src/app/pages/vistoria/vistoria-historico-veiculo.page.ts
function VistoriaHistoricoVeiculoPage_ion_buttons_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-buttons", 10)(1, "ion-button", 11);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_ion_buttons_6_Template_ion_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.voltar());
    });
    \u0275\u0275text(2, "Voltar");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275element(1, "ion-spinner", 13);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando pend\xEAncias...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "ion-text", 14)(2, "p", 15);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaHistoricoVeiculoPage_div_10_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label", 24);
    \u0275\u0275text(2, "Selecionar ve\xEDculo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "ion-searchbar", 25);
    \u0275\u0275listener("ionInput", function VistoriaHistoricoVeiculoPage_div_10_ion_item_1_Template_ion_searchbar_ionInput_3_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onBuscarVeiculos($event));
    })("ionClear", function VistoriaHistoricoVeiculoPage_div_10_ion_item_1_Template_ion_searchbar_ionClear_3_listener() {
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
function VistoriaHistoricoVeiculoPage_div_10_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 26);
    \u0275\u0275element(1, "ion-spinner", 13);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Buscando ve\xEDculos...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_10_ion_card_3_ion_item_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 29);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_10_ion_card_3_ion_item_2_Template_ion_item_click_0_listener() {
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
function VistoriaHistoricoVeiculoPage_div_10_ion_card_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card", 27)(1, "ion-card-content");
    \u0275\u0275template(2, VistoriaHistoricoVeiculoPage_div_10_ion_card_3_ion_item_2_Template, 6, 2, "ion-item", 28);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx_r1.veiculos);
  }
}
function VistoriaHistoricoVeiculoPage_div_10_ion_card_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card")(1, "ion-card-content")(2, "p", 30)(3, "strong");
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
function VistoriaHistoricoVeiculoPage_div_10_ion_select_option_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 31);
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
function VistoriaHistoricoVeiculoPage_div_10_ion_select_option_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-select-option", 31);
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ion_spinner_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 13);
  }
}
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_span_24_Template(rf, ctx) {
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275element(1, "ion-spinner", 13);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Carregando m\xEDdias...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_4_img_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 46);
    \u0275\u0275listener("pointerup", function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_4_img_1_Template_img_pointerup_0_listener() {
      const midia_r12 = \u0275\u0275restoreView(_r11).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(6);
      return \u0275\u0275resetView(ctx_r1.abrirImagem(midia_r12));
    })("click", function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_4_img_1_Template_img_click_0_listener() {
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_4_img_1_Template, 1, 2, "img", 45);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getImagens(item_r10));
  }
}
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 47);
    \u0275\u0275text(1, "Sem imagens");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_10_div_1_span_3_Template(rf, ctx) {
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_10_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50)(1, "p", 51);
    \u0275\u0275text(2);
    \u0275\u0275template(3, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_10_div_1_span_3_Template, 2, 1, "span", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "audio", 52);
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_10_div_1_Template, 5, 3, "div", 49);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r10 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getAudios(item_r10));
  }
}
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 47);
    \u0275\u0275text(1, "Sem audio");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "p")(2, "strong");
    \u0275\u0275text(3, "Imagens");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_4_Template, 2, 1, "div", 42)(5, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_ng_template_5_Template, 2, 0, "ng-template", null, 1, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementStart(7, "p")(8, "strong");
    \u0275\u0275text(9, "\xC1udios");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_div_10_Template, 2, 1, "div", 43)(11, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_ng_template_11_Template, 2, 0, "ng-template", null, 2, \u0275\u0275templateRefExtractor);
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 34)(1, "ion-card-header")(2, "ion-card-title");
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
    \u0275\u0275elementStart(13, "div", 35)(14, "div", 36)(15, "div")(16, "p")(17, "strong");
    \u0275\u0275text(18, "M\xEDdias");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p", 37);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "ion-button", 38);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_Template_ion_button_click_22_listener() {
      const item_r10 = \u0275\u0275restoreView(_r9).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.toggleMidias(item_r10));
    });
    \u0275\u0275template(23, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ion_spinner_23_Template, 1, 0, "ion-spinner", 39)(24, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_span_24_Template, 2, 1, "span", 16);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(25, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_div_25_Template, 4, 0, "div", 40)(26, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_ng_container_26_Template, 13, 4, "ng-container", 16);
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
function VistoriaHistoricoVeiculoPage_div_10_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_10_div_19_ion_card_1_Template, 27, 14, "ion-card", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.itensFiltrados);
  }
}
function VistoriaHistoricoVeiculoPage_div_10_ng_template_20_p_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 54);
    \u0275\u0275text(1, " Nenhuma irregularidade n\xE3o resolvida para os filtros selecionados. ");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_10_ng_template_20_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 54);
    \u0275\u0275text(1, "Selecione um ve\xEDculo para visualizar as pend\xEAncias.");
    \u0275\u0275elementEnd();
  }
}
function VistoriaHistoricoVeiculoPage_div_10_ng_template_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, VistoriaHistoricoVeiculoPage_div_10_ng_template_20_p_0_Template, 2, 0, "p", 53)(1, VistoriaHistoricoVeiculoPage_div_10_ng_template_20_ng_template_1_Template, 2, 0, "ng-template", null, 3, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    const selectVehicleHint_r16 = \u0275\u0275reference(2);
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("ngIf", ctx_r1.selectedVeiculoId)("ngIfElse", selectVehicleHint_r16);
  }
}
function VistoriaHistoricoVeiculoPage_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275template(1, VistoriaHistoricoVeiculoPage_div_10_ion_item_1_Template, 4, 1, "ion-item", 16)(2, VistoriaHistoricoVeiculoPage_div_10_div_2_Template, 4, 0, "div", 17)(3, VistoriaHistoricoVeiculoPage_div_10_ion_card_3_Template, 3, 1, "ion-card", 18)(4, VistoriaHistoricoVeiculoPage_div_10_ion_card_4_Template, 9, 2, "ion-card", 16);
    \u0275\u0275elementStart(5, "ion-item")(6, "ion-label");
    \u0275\u0275text(7, "\xC1rea");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "ion-select", 19);
    \u0275\u0275twoWayListener("ngModelChange", function VistoriaHistoricoVeiculoPage_div_10_Template_ion_select_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.areaFiltro, $event) || (ctx_r1.areaFiltro = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ionChange", function VistoriaHistoricoVeiculoPage_div_10_Template_ion_select_ionChange_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAreaChange());
    });
    \u0275\u0275elementStart(9, "ion-select-option", 20);
    \u0275\u0275text(10, "Todas");
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, VistoriaHistoricoVeiculoPage_div_10_ion_select_option_11_Template, 2, 2, "ion-select-option", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "ion-item")(13, "ion-label");
    \u0275\u0275text(14, "Componente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "ion-select", 22);
    \u0275\u0275twoWayListener("ngModelChange", function VistoriaHistoricoVeiculoPage_div_10_Template_ion_select_ngModelChange_15_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.componenteFiltro, $event) || (ctx_r1.componenteFiltro = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(16, "ion-select-option", 20);
    \u0275\u0275text(17, "Todos");
    \u0275\u0275elementEnd();
    \u0275\u0275template(18, VistoriaHistoricoVeiculoPage_div_10_ion_select_option_18_Template, 2, 2, "ion-select-option", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(19, VistoriaHistoricoVeiculoPage_div_10_div_19_Template, 2, 1, "div", 23)(20, VistoriaHistoricoVeiculoPage_div_10_ng_template_20_Template, 3, 2, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const emptyState_r17 = \u0275\u0275reference(21);
    const ctx_r1 = \u0275\u0275nextContext();
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
function VistoriaHistoricoVeiculoPage_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 55);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_11_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharImagem());
    });
    \u0275\u0275elementStart(1, "div", 56);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_11_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r18);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "span", 57);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-button", 58);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_11_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharImagem());
    });
    \u0275\u0275text(5, "Fechar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 59);
    \u0275\u0275listener("click", function VistoriaHistoricoVeiculoPage_div_11_Template_div_click_6_listener($event) {
      \u0275\u0275restoreView(_r18);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(7, "img", 60);
    \u0275\u0275listener("touchstart", function VistoriaHistoricoVeiculoPage_div_11_Template_img_touchstart_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchStart($event));
    })("touchmove", function VistoriaHistoricoVeiculoPage_div_11_Template_img_touchmove_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchMove($event));
    })("touchend", function VistoriaHistoricoVeiculoPage_div_11_Template_img_touchend_7_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onImageTouchEnd($event));
    })("touchcancel", function VistoriaHistoricoVeiculoPage_div_11_Template_img_touchcancel_7_listener($event) {
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
  errorMessageService = inject(ErrorMessageService);
  loading = false;
  errorMessage = "";
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
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaHistoricoVeiculoPage, selectors: [["app-vistoria-historico-veiculo"]], decls: 12, vars: 7, consts: [["emptyState", ""], ["semImagensTpl", ""], ["semAudiosTpl", ""], ["selectVehicleHint", ""], [3, "translucent"], ["slot", "start"], ["slot", "end", 4, "ngIf"], [3, "fullscreen"], ["class", "content", 4, "ngIf"], ["class", "image-overlay", 3, "click", 4, "ngIf"], ["slot", "end"], ["fill", "solid", 3, "click"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], [4, "ngIf"], ["class", "search-loading", 4, "ngIf"], ["class", "search-results", 4, "ngIf"], ["interface", "popover", "placeholder", "Todas", 3, "ngModelChange", "ionChange", "ngModel"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], ["interface", "popover", "placeholder", "Todos", 3, "ngModelChange", "ngModel"], ["class", "cards-container", 4, "ngIf", "ngIfElse"], ["position", "stacked"], ["placeholder", "Digite placa ou descri\xE7\xE3o", 3, "ionInput", "ionClear", "value"], [1, "search-loading"], [1, "search-results"], ["lines", "none", "button", "", 3, "click", 4, "ngFor", "ngForOf"], ["lines", "none", "button", "", 3, "click"], [1, "veiculo-destaque"], [3, "value"], [1, "cards-container"], ["class", "level-card", 4, "ngFor", "ngForOf"], [1, "level-card"], [1, "midias-section"], [1, "midias-header"], [1, "midias-resumo"], ["size", "small", "fill", "outline", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["class", "midias-loading", 4, "ngIf"], [1, "midias-loading"], ["class", "imagem-grid", 4, "ngIf", "ngIfElse"], ["class", "audio-list", 4, "ngIf", "ngIfElse"], [1, "imagem-grid"], [3, "src", "alt", "pointerup", "click", 4, "ngFor", "ngForOf"], [3, "pointerup", "click", "src", "alt"], [1, "sem-midia"], [1, "audio-list"], ["class", "audio-item", 4, "ngFor", "ngForOf"], [1, "audio-item"], [1, "audio-name"], ["controls", "", "preload", "none", 3, "src"], ["class", "empty-text", 4, "ngIf", "ngIfElse"], [1, "empty-text"], [1, "image-overlay", 3, "click"], [1, "image-overlay-header", 3, "click"], [1, "image-overlay-title"], ["fill", "solid", "size", "small", 3, "click"], [1, "image-overlay-body", 3, "click"], [1, "image-modal-preview", 3, "touchstart", "touchmove", "touchend", "touchcancel", "src", "alt"]], template: function VistoriaHistoricoVeiculoPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 4)(1, "ion-toolbar")(2, "ion-buttons", 5);
      \u0275\u0275element(3, "ion-menu-button");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Pend\xEAncias do Ve\xEDculo");
      \u0275\u0275elementEnd();
      \u0275\u0275template(6, VistoriaHistoricoVeiculoPage_ion_buttons_6_Template, 3, 0, "ion-buttons", 6);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "ion-content", 7);
      \u0275\u0275template(8, VistoriaHistoricoVeiculoPage_div_8_Template, 4, 0, "div", 8)(9, VistoriaHistoricoVeiculoPage_div_9_Template, 4, 1, "div", 8)(10, VistoriaHistoricoVeiculoPage_div_10_Template, 22, 10, "div", 8);
      \u0275\u0275elementEnd();
      \u0275\u0275template(11, VistoriaHistoricoVeiculoPage_div_11_Template, 8, 5, "div", 9);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(6);
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
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  padding: 12px;\n}\n.cards-container[_ngcontent-%COMP%] {\n  margin-top: 12px;\n  display: grid;\n  gap: 12px;\n}\n.search-loading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 8px 0 0;\n  color: #6b7280;\n}\n.search-results[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.veiculo-destaque[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #1d4ed8;\n}\n.midias-section[_ngcontent-%COMP%] {\n  margin-top: 10px;\n}\n.midias-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.midias-resumo[_ngcontent-%COMP%] {\n  margin: 2px 0 0;\n  color: #6b7280;\n  font-size: 0.8rem;\n}\n.midias-loading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.imagem-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 8px;\n  margin-bottom: 10px;\n}\n.imagem-grid[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 120px;\n  object-fit: cover;\n  border-radius: 8px;\n  border: 1px solid #d1d5db;\n  cursor: zoom-in;\n}\n.audio-list[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 10px;\n}\n.audio-item[_ngcontent-%COMP%]   audio[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.audio-name[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n  font-size: 0.85rem;\n}\n.sem-midia[_ngcontent-%COMP%] {\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.empty-text[_ngcontent-%COMP%] {\n  margin: 16px 0;\n  color: #6b7280;\n  text-align: center;\n}\n.image-modal-content[_ngcontent-%COMP%] {\n  --background: #000000;\n}\n.image-modal-container[_ngcontent-%COMP%] {\n  min-height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n.image-modal-preview[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: calc(100vh - 120px);\n  object-fit: contain;\n  border-radius: 8px;\n  touch-action: none;\n  transition: transform 0.08s ease-out;\n  will-change: transform;\n}\n.image-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  background: rgba(0, 0, 0, 0.95);\n  display: flex;\n  flex-direction: column;\n}\n.image-overlay-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  color: #ffffff;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n}\n.image-overlay-title[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  font-weight: 600;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.image-overlay-body[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n/*# sourceMappingURL=vistoria-historico-veiculo.page.css.map */"] });
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
    ], template: `<ion-header [translucent]="true">\r
  <ion-toolbar>\r
    <ion-buttons slot="start">\r
      <ion-menu-button></ion-menu-button>\r
    </ion-buttons>\r
    <ion-title>Pend\xEAncias do Ve\xEDculo</ion-title>\r
    <ion-buttons slot="end" *ngIf="!openedFromMenu">\r
      <ion-button fill="solid" (click)="voltar()">Voltar</ion-button>\r
    </ion-buttons>\r
  </ion-toolbar>\r
</ion-header>\r
\r
<ion-content [fullscreen]="true">\r
  <div class="content" *ngIf="loading">\r
    <ion-spinner name="crescent"></ion-spinner>\r
    <p>Carregando pend\xEAncias...</p>\r
  </div>\r
\r
  <div class="content" *ngIf="errorMessage">\r
    <ion-text color="danger"><p class="error-message">{{ errorMessage }}</p></ion-text>\r
  </div>\r
\r
  <div class="content" *ngIf="!loading && !errorMessage">\r
    <ion-item *ngIf="openedFromMenu">\r
      <ion-label position="stacked">Selecionar ve\xEDculo</ion-label>\r
      <ion-searchbar\r
        [value]="veiculoSearch"\r
        placeholder="Digite placa ou descri\xE7\xE3o"\r
        (ionInput)="onBuscarVeiculos($event)"\r
        (ionClear)="limparVeiculoSelecionado()"\r
      ></ion-searchbar>\r
    </ion-item>\r
\r
    <div class="search-loading" *ngIf="openedFromMenu && loadingVeiculos">\r
      <ion-spinner name="crescent"></ion-spinner>\r
      <span>Buscando ve\xEDculos...</span>\r
    </div>\r
\r
    <ion-card *ngIf="openedFromMenu && veiculos.length > 0" class="search-results">\r
      <ion-card-content>\r
        <ion-item\r
          *ngFor="let veiculo of veiculos"\r
          lines="none"\r
          button\r
          (click)="selecionarVeiculo(veiculo)"\r
        >\r
          <ion-label>\r
            <strong>{{ veiculo.descricao }}</strong>\r
            <p>{{ veiculo.placa }}</p>\r
          </ion-label>\r
        </ion-item>\r
      </ion-card-content>\r
    </ion-card>\r
\r
    <ion-card *ngIf="selectedVeiculoId">\r
      <ion-card-content>\r
        <p class="veiculo-destaque"><strong>Ve\xEDculo {{ veiculoDescricao }}</strong></p>\r
        <p><strong>Total de pend\xEAncias:</strong> {{ total }}</p>\r
      </ion-card-content>\r
    </ion-card>\r
\r
    <ion-item>\r
      <ion-label>\xC1rea</ion-label>\r
      <ion-select [(ngModel)]="areaFiltro" (ionChange)="onAreaChange()" interface="popover" placeholder="Todas">\r
        <ion-select-option value="">Todas</ion-select-option>\r
        <ion-select-option *ngFor="let area of areaOptions" [value]="area.id">\r
          {{ area.nome }}\r
        </ion-select-option>\r
      </ion-select>\r
    </ion-item>\r
\r
    <ion-item>\r
      <ion-label>Componente</ion-label>\r
      <ion-select [(ngModel)]="componenteFiltro" interface="popover" placeholder="Todos">\r
        <ion-select-option value="">Todos</ion-select-option>\r
        <ion-select-option *ngFor="let componente of componenteOptions" [value]="componente.id">\r
          {{ componente.nome }}\r
        </ion-select-option>\r
      </ion-select>\r
    </ion-item>\r
\r
    <div class="cards-container" *ngIf="selectedVeiculoId && itensFiltrados.length > 0; else emptyState">\r
      <ion-card *ngFor="let item of itensFiltrados" class="level-card">\r
        <ion-card-header>\r
          <ion-card-title>\r
            {{ item.nomeArea || '\xC1rea' }} - {{ item.nomeComponente || 'Componente' }} - {{ item.descricaoSintoma || 'Sintoma' }}\r
          </ion-card-title>\r
        </ion-card-header>\r
        <ion-card-content>\r
          <p><strong>Vistoria:</strong> {{ item.numeroVistoria }} ({{ formatarData(item.datavistoria) }})</p>\r
          <p><strong>Observa\xE7\xE3o:</strong> {{ item.observacao || '-' }}</p>\r
\r
          <div class="midias-section">\r
            <div class="midias-header">\r
              <div>\r
                <p><strong>M\xEDdias</strong> ({{ item.midias.length || 0 }})</p>\r
                <p class="midias-resumo">\r
                  {{ getQuantidadeImagens(item) }} imagem(ns) \u2022 {{ getQuantidadeAudios(item) }} \xE1udio(s)\r
                </p>\r
              </div>\r
              <ion-button\r
                size="small"\r
                fill="outline"\r
                (click)="toggleMidias(item)"\r
                [disabled]="isMidiaLoading(item.id)"\r
              >\r
                <ion-spinner *ngIf="isMidiaLoading(item.id)" name="crescent"></ion-spinner>\r
                <span *ngIf="!isMidiaLoading(item.id)">\r
                  {{ isMidiaExpanded(item.id) ? 'Ocultar m\xEDdias' : 'Carregar m\xEDdias' }}\r
                </span>\r
              </ion-button>\r
            </div>\r
\r
            <div class="midias-loading" *ngIf="isMidiaLoading(item.id)">\r
              <ion-spinner name="crescent"></ion-spinner>\r
              <span>Carregando m\xEDdias...</span>\r
            </div>\r
\r
            <ng-container *ngIf="isMidiaExpanded(item.id) && isMidiaLoaded(item.id) && !isMidiaLoading(item.id)">\r
              <p><strong>Imagens</strong></p>\r
              <div class="imagem-grid" *ngIf="getImagens(item).length > 0; else semImagensTpl">\r
                <img\r
                  *ngFor="let midia of getImagens(item)"\r
                  [src]="midia.src"\r
                  [alt]="midia.nomeArquivo"\r
                  (pointerup)="abrirImagem(midia)"\r
                  (click)="abrirImagem(midia)"\r
                />\r
              </div>\r
              <ng-template #semImagensTpl>\r
                <p class="sem-midia">Sem imagens</p>\r
              </ng-template>\r
\r
              <p><strong>\xC1udios</strong></p>\r
              <div class="audio-list" *ngIf="getAudios(item).length > 0; else semAudiosTpl">\r
                <div *ngFor="let midia of getAudios(item)" class="audio-item">\r
                  <p class="audio-name">\r
                    {{ midia.nomeArquivo }}\r
                    <span *ngIf="formatarDuracao(midia.duracaoMs)">({{ formatarDuracao(midia.duracaoMs) }})</span>\r
                  </p>\r
                  <audio [src]="midia.src" controls preload="none"></audio>\r
                </div>\r
              </div>\r
              <ng-template #semAudiosTpl>\r
                <p class="sem-midia">Sem audio</p>\r
              </ng-template>\r
            </ng-container>\r
          </div>\r
        </ion-card-content>\r
      </ion-card>\r
    </div>\r
\r
    <ng-template #emptyState>\r
      <p class="empty-text" *ngIf="selectedVeiculoId; else selectVehicleHint">\r
        Nenhuma irregularidade n\xE3o resolvida para os filtros selecionados.\r
      </p>\r
      <ng-template #selectVehicleHint>\r
        <p class="empty-text">Selecione um ve\xEDculo para visualizar as pend\xEAncias.</p>\r
      </ng-template>\r
    </ng-template>\r
  </div>\r
</ion-content>\r
\r
<div class="image-overlay" *ngIf="imagemSelecionada" (click)="fecharImagem()">\r
  <div class="image-overlay-header" (click)="$event.stopPropagation()">\r
    <span class="image-overlay-title">{{ imagemSelecionada.nomeArquivo || 'Imagem' }}</span>\r
    <ion-button fill="solid" size="small" (click)="fecharImagem()">Fechar</ion-button>\r
  </div>\r
  <div class="image-overlay-body" (click)="$event.stopPropagation()">\r
    <img\r
      [src]="imagemSelecionada.src"\r
      [alt]="imagemSelecionada.nomeArquivo"\r
      class="image-modal-preview"\r
      [style.transform]="imageTransform"\r
      (touchstart)="onImageTouchStart($event)"\r
      (touchmove)="onImageTouchMove($event)"\r
      (touchend)="onImageTouchEnd($event)"\r
      (touchcancel)="onImageTouchEnd($event)"\r
    />\r
  </div>\r
</div>\r
`, styles: ["/* src/app/pages/vistoria/vistoria-historico-veiculo.page.scss */\n.content {\n  padding: 12px;\n}\n.cards-container {\n  margin-top: 12px;\n  display: grid;\n  gap: 12px;\n}\n.search-loading {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 8px 0 0;\n  color: #6b7280;\n}\n.search-results {\n  margin-top: 8px;\n}\n.veiculo-destaque {\n  font-size: 1rem;\n  color: #1d4ed8;\n}\n.midias-section {\n  margin-top: 10px;\n}\n.midias-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n}\n.midias-resumo {\n  margin: 2px 0 0;\n  color: #6b7280;\n  font-size: 0.8rem;\n}\n.midias-loading {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.imagem-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 8px;\n  margin-bottom: 10px;\n}\n.imagem-grid img {\n  width: 100%;\n  height: 120px;\n  object-fit: cover;\n  border-radius: 8px;\n  border: 1px solid #d1d5db;\n  cursor: zoom-in;\n}\n.audio-list {\n  display: grid;\n  gap: 10px;\n}\n.audio-item audio {\n  width: 100%;\n}\n.audio-name {\n  margin: 0 0 6px;\n  font-size: 0.85rem;\n}\n.sem-midia {\n  margin: 6px 0 10px;\n  color: #6b7280;\n}\n.empty-text {\n  margin: 16px 0;\n  color: #6b7280;\n  text-align: center;\n}\n.image-modal-content {\n  --background: #000000;\n}\n.image-modal-container {\n  min-height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n.image-modal-preview {\n  width: 100%;\n  max-height: calc(100vh - 120px);\n  object-fit: contain;\n  border-radius: 8px;\n  touch-action: none;\n  transition: transform 0.08s ease-out;\n  will-change: transform;\n}\n.image-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 10000;\n  background: rgba(0, 0, 0, 0.95);\n  display: flex;\n  flex-direction: column;\n}\n.image-overlay-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 10px 12px;\n  color: #ffffff;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.15);\n}\n.image-overlay-title {\n  font-size: 0.9rem;\n  font-weight: 600;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.image-overlay-body {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 12px;\n}\n/*# sourceMappingURL=vistoria-historico-veiculo.page.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaHistoricoVeiculoPage, { className: "VistoriaHistoricoVeiculoPage", filePath: "src/app/pages/vistoria/vistoria-historico-veiculo.page.ts", lineNumber: 70 });
})();
export {
  VistoriaHistoricoVeiculoPage
};
//# sourceMappingURL=chunk-6K55KBXH.js.map
