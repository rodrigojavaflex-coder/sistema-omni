import {
  CameraResultType,
  CameraSource
} from "./chunk-DMFZDTFJ.js";
import {
  VistoriaFlowService,
  VistoriaService
} from "./chunk-HOZ3DUWF.js";
import {
  addIcons,
  arrowBackOutline,
  arrowForwardOutline,
  cameraOutline,
  checkmarkCircle,
  trashOutline
} from "./chunk-MVYH7HIC.js";
import {
  AlertController,
  Component,
  FormsModule,
  HttpClient,
  Injectable,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  NgForOf,
  NgIf,
  Platform,
  Router,
  ViewChild,
  environment,
  firstValueFrom,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
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
  ɵɵtextInterpolate2,
  ɵɵviewQuery
} from "./chunk-FWNB6FX6.js";
import "./chunk-3EJ4SNN5.js";
import "./chunk-T5LCTCQ6.js";
import {
  Capacitor,
  registerPlugin
} from "./chunk-RP3QMZ46.js";
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

// node_modules/@capacitor/camera/dist/esm/index.js
var Camera = registerPlugin("Camera", {
  web: () => import("./chunk-TVI4SJPW.js").then((m) => new m.CameraWeb())
});

// src/app/services/item-vistoriado.service.ts
var ItemVistoriadoService = class _ItemVistoriadoService {
  http = inject(HttpClient);
  apiBaseUrl = Capacitor.getPlatform() !== "web" ? environment.apiUrlNative || environment.apiUrl : environment.apiUrl;
  getAtivosPorTipo(tipoVistoriaId) {
    return __async(this, null, function* () {
      const itens = yield firstValueFrom(this.http.get(`${this.apiBaseUrl}/itensvistoriados`, {
        params: {
          tipovistoria: tipoVistoriaId,
          ativo: "true"
        }
      }));
      return itens ?? [];
    });
  }
  static \u0275fac = function ItemVistoriadoService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ItemVistoriadoService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ItemVistoriadoService, factory: _ItemVistoriadoService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ItemVistoriadoService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/pages/vistoria/vistoria-checklist.page.ts
var _c0 = ["observacaoInput"];
function VistoriaChecklistPage_ion_buttons_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-buttons", 8);
    \u0275\u0275element(1, "ion-menu-button");
    \u0275\u0275elementEnd();
  }
}
function VistoriaChecklistPage_ion_progress_bar_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-progress-bar", 9);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("value", ctx_r0.progress);
  }
}
function VistoriaChecklistPage_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "ion-spinner", 11);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando itens...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaChecklistPage_div_11_ion_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 11);
  }
}
function VistoriaChecklistPage_div_11_span_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " Salvar item ");
    \u0275\u0275element(2, "ion-icon", 28);
    \u0275\u0275elementEnd();
  }
}
function VistoriaChecklistPage_div_11_ion_text_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 29);
    \u0275\u0275element(1, "ion-icon", 30);
    \u0275\u0275text(2, " Item salvo ");
    \u0275\u0275elementEnd();
  }
}
function VistoriaChecklistPage_div_11_ion_list_31_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "img", 32);
    \u0275\u0275elementStart(2, "ion-label")(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "ion-button", 33);
    \u0275\u0275listener("click", function VistoriaChecklistPage_div_11_ion_list_31_ion_item_1_Template_ion_button_click_7_listener() {
      const i_r4 = \u0275\u0275restoreView(_r3).index;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.removerFoto(i_r4));
    });
    \u0275\u0275element(8, "ion-icon", 34);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const foto_r5 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275property("src", foto_r5.preview, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(foto_r5.nomeArquivo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatarTamanho(foto_r5.tamanho));
  }
}
function VistoriaChecklistPage_div_11_ion_list_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaChecklistPage_div_11_ion_list_31_ion_item_1_Template, 9, 3, "ion-item", 31);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.currentFotos);
  }
}
function VistoriaChecklistPage_div_11_ion_text_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 35)(1, "p", 36);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
function VistoriaChecklistPage_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 12)(2, "ion-button", 13);
    \u0275\u0275listener("click", function VistoriaChecklistPage_div_11_Template_ion_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.anterior());
    });
    \u0275\u0275element(3, "ion-icon", 14);
    \u0275\u0275text(4, " Anterior ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-button", 15);
    \u0275\u0275listener("click", function VistoriaChecklistPage_div_11_Template_ion_button_click_5_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.salvarItem());
    });
    \u0275\u0275template(6, VistoriaChecklistPage_div_11_ion_spinner_6_Template, 1, 0, "ion-spinner", 16)(7, VistoriaChecklistPage_div_11_span_7_Template, 3, 0, "span", 17);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 18)(9, "h2");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, VistoriaChecklistPage_div_11_ion_text_11_Template, 3, 0, "ion-text", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "ion-item", 20)(13, "div", 21)(14, "ion-chip", 22);
    \u0275\u0275listener("click", function VistoriaChecklistPage_div_11_Template_ion_chip_click_14_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setSituacao("conforme"));
    });
    \u0275\u0275elementStart(15, "ion-label");
    \u0275\u0275text(16, "Conforme");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "ion-chip", 22);
    \u0275\u0275listener("click", function VistoriaChecklistPage_div_11_Template_ion_chip_click_17_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.setSituacao("nao"));
    });
    \u0275\u0275elementStart(18, "ion-label");
    \u0275\u0275text(19, "N\xE3o conforme");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(20, "ion-item")(21, "ion-label", 23);
    \u0275\u0275text(22, "Observa\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "ion-textarea", 24, 0);
    \u0275\u0275listener("ionInput", function VistoriaChecklistPage_div_11_Template_ion_textarea_ionInput_23_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.currentObservacao = $event.detail.value ?? "");
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(25, "ion-item", 25)(26, "ion-label");
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "ion-button", 13);
    \u0275\u0275listener("click", function VistoriaChecklistPage_div_11_Template_ion_button_click_28_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.adicionarFoto());
    });
    \u0275\u0275element(29, "ion-icon", 26);
    \u0275\u0275text(30, " Adicionar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(31, VistoriaChecklistPage_div_11_ion_list_31_Template, 2, 1, "ion-list", 17)(32, VistoriaChecklistPage_div_11_ion_text_32_Template, 3, 1, "ion-text", 27);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.currentIndex === 0);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r0.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.isSaving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isSaving);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate2("", ctx_r0.displayIndex, ". ", ctx_r0.currentItem.descricao);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.savedIds.has(ctx_r0.currentItem.id));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("is-selected", ctx_r0.currentSituacao === "conforme")("is-conforme", ctx_r0.currentSituacao === "conforme");
    \u0275\u0275advance(3);
    \u0275\u0275classProp("is-selected", ctx_r0.currentSituacao === "nao")("is-nao", ctx_r0.currentSituacao === "nao");
    \u0275\u0275advance(6);
    \u0275\u0275property("value", ctx_r0.currentObservacao);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Fotos (", ctx_r0.currentFotos.length, ")");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", !ctx_r0.podeAdicionarFoto);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx_r0.currentFotos.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.errorMessage);
  }
}
function VistoriaChecklistPage_div_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "p");
    \u0275\u0275text(2, "Nenhum item encontrado para este tipo de vistoria.");
    \u0275\u0275elementEnd()();
  }
}
var VistoriaChecklistPage = class _VistoriaChecklistPage {
  flowService = inject(VistoriaFlowService);
  itemService = inject(ItemVistoriadoService);
  vistoriaService = inject(VistoriaService);
  router = inject(Router);
  alertController = inject(AlertController);
  platform = inject(Platform);
  backButtonSub;
  observacaoInput;
  itens = [];
  currentIndex = 0;
  currentConforme = true;
  currentObservacao = "";
  currentSituacao = "conforme";
  itemFotos = {};
  itemState = {};
  savedIds = /* @__PURE__ */ new Set();
  loadingItens = false;
  isSaving = false;
  errorMessage = "";
  isNative = Capacitor.getPlatform() !== "web";
  constructor() {
    addIcons({
      cameraOutline,
      trashOutline,
      checkmarkCircle,
      arrowBackOutline,
      arrowForwardOutline
    });
  }
  ngOnInit() {
    return __async(this, null, function* () {
      this.backButtonSub = this.platform.backButton.subscribeWithPriority(10, () => __async(this, null, function* () {
        yield this.confirmarVoltarParaInicio();
      }));
      const tipoId = this.flowService.getTipoVistoriaId();
      const vistoriaId = this.flowService.getVistoriaId();
      if (!tipoId) {
        this.router.navigate(["/vistoria/inicio"]);
        return;
      }
      this.loadingItens = true;
      try {
        this.itens = yield this.itemService.getAtivosPorTipo(tipoId);
        this.itens.sort((a, b) => a.sequencia - b.sequencia);
        if (vistoriaId) {
          const salvos = yield this.vistoriaService.listarChecklist(vistoriaId);
          salvos.forEach((salvo) => {
            this.itemState[salvo.iditemvistoriado] = {
              conforme: salvo.conforme,
              observacao: salvo.observacao ?? ""
            };
            this.savedIds.add(salvo.iditemvistoriado);
          });
          const imagens = yield this.vistoriaService.listarChecklistImagens(vistoriaId);
          imagens.forEach((item) => {
            this.itemFotos[item.iditemvistoriado] = item.imagens.map((imagem) => ({
              nomeArquivo: imagem.nomeArquivo,
              tamanho: imagem.tamanho,
              dadosBase64: imagem.dadosBase64,
              preview: `data:image/jpeg;base64,${imagem.dadosBase64}`
            }));
          });
          if (salvos.length > 0) {
            const ultimoSalvo = salvos[0];
            const index = this.itens.findIndex((item) => item.id === ultimoSalvo.iditemvistoriado);
            if (index >= 0) {
              this.currentIndex = index;
            }
          }
        }
        this.resetItemState();
      } catch {
        this.errorMessage = "Erro ao carregar checklist.";
      } finally {
        this.loadingItens = false;
      }
    });
  }
  ngOnDestroy() {
    this.backButtonSub?.unsubscribe();
  }
  confirmarVoltarParaInicio() {
    return __async(this, null, function* () {
      const alert = yield this.alertController.create({
        header: "Editar dados iniciais",
        message: "Deseja voltar para ajustar os dados da vistoria?",
        buttons: [
          { text: "Continuar checklist", role: "cancel" },
          { text: "Voltar", role: "confirm" }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role === "confirm") {
        this.router.navigate(["/vistoria/inicio"]);
      }
    });
  }
  get currentItem() {
    return this.itens[this.currentIndex] ?? null;
  }
  get progress() {
    if (this.itens.length === 0) {
      return 0;
    }
    return (this.currentIndex + 1) / this.itens.length;
  }
  get displayIndex() {
    return this.currentIndex + 1;
  }
  get currentFotos() {
    const item = this.currentItem;
    if (!item) {
      return [];
    }
    return this.itemFotos[item.id] ?? [];
  }
  get podeAdicionarFoto() {
    return this.isFotoPermitida(this.currentItem);
  }
  adicionarFoto() {
    return __async(this, null, function* () {
      const item = this.currentItem;
      if (!item || !this.isFotoPermitida(item)) {
        return;
      }
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
      const veiculo = this.sanitizeFilename(this.flowService.getVeiculoDescricao() ?? "veiculo");
      const tipo = this.sanitizeFilename(this.flowService.getTipoVistoriaDescricao() ?? "tipo");
      const data = this.formatDateFilename(this.flowService.getDataVistoriaIso() ?? (/* @__PURE__ */ new Date()).toISOString());
      const itemNome = this.sanitizeFilename(item.descricao ?? "item");
      const imageIndex = (this.itemFotos[item.id]?.length ?? 0) + 1;
      const nomeArquivo = `${veiculo}_${tipo}_${itemNome}_${data}_IMG_${imageIndex}.jpg`;
      const tamanho = this.estimateBase64Size(base64);
      const foto = {
        nomeArquivo,
        tamanho,
        dadosBase64: base64,
        preview: `data:image/jpeg;base64,${base64}`
      };
      const fotos = this.itemFotos[item.id] ?? [];
      fotos.push(foto);
      this.itemFotos[item.id] = fotos;
    });
  }
  removerFoto(index) {
    const item = this.currentItem;
    if (!item) {
      return;
    }
    const fotos = this.itemFotos[item.id] ?? [];
    fotos.splice(index, 1);
    this.itemFotos[item.id] = fotos;
  }
  salvarItem() {
    return __async(this, null, function* () {
      const item = this.currentItem;
      const vistoriaId = this.flowService.getVistoriaId();
      if (!item || !vistoriaId) {
        return;
      }
      const permiteFotos = this.isFotoPermitida(item);
      if (!this.currentConforme && item.obrigafoto && this.currentFotos.length === 0) {
        this.errorMessage = "Foto obrigat\xF3ria para item n\xE3o conforme.";
        return;
      }
      this.isSaving = true;
      this.errorMessage = "";
      try {
        const checklist = yield this.vistoriaService.salvarChecklistItem(vistoriaId, {
          iditemvistoriado: item.id,
          conforme: this.currentConforme,
          observacao: this.currentObservacao?.trim() || void 0
        });
        if (!permiteFotos && this.currentFotos.length > 0) {
          this.itemFotos[item.id] = [];
        }
        if (permiteFotos && this.currentFotos.length > 0) {
          const files = this.currentFotos.map((foto) => ({
            nomeArquivo: foto.nomeArquivo,
            blob: this.base64ToBlob(foto.dadosBase64)
          }));
          yield this.vistoriaService.uploadChecklistImagens(vistoriaId, checklist.id, files);
        }
        this.savedIds.add(item.id);
        this.proximo();
      } catch (error) {
        this.errorMessage = error?.message || "Erro ao salvar item.";
      } finally {
        this.isSaving = false;
      }
    });
  }
  anterior() {
    if (this.currentIndex > 0) {
      this.persistCurrentState();
      this.currentIndex -= 1;
      this.resetItemState();
    }
  }
  proximo() {
    if (this.currentIndex < this.itens.length - 1) {
      this.persistCurrentState();
      this.currentIndex += 1;
      this.resetItemState();
      return;
    }
    this.router.navigate(["/vistoria/finalizar"]);
  }
  cancelarVistoria() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return;
      }
      const alert = yield this.alertController.create({
        header: "Cancelar vistoria?",
        message: "Os itens j\xE1 registrados ser\xE3o mantidos como cancelados.",
        buttons: [
          { text: "Voltar", role: "cancel" },
          {
            text: "Cancelar vistoria",
            role: "destructive",
            handler: () => __async(this, null, function* () {
              yield this.vistoriaService.cancelarVistoria(vistoriaId);
              this.flowService.finalizar();
              this.router.navigate(["/home"]);
            })
          }
        ]
      });
      yield alert.present();
    });
  }
  resetItemState() {
    const item = this.currentItem;
    if (!item) {
      return;
    }
    const savedState = this.itemState[item.id];
    this.currentConforme = savedState?.conforme ?? true;
    this.currentObservacao = savedState?.observacao ?? "";
    this.currentSituacao = this.currentConforme ? "conforme" : "nao";
    this.errorMessage = "";
    if (!this.itemFotos[item.id]) {
      this.itemFotos[item.id] = [];
    }
    setTimeout(() => {
      const input = this.observacaoInput;
      if (!input) {
        return;
      }
      input.value = this.currentObservacao;
      input.getInputElement().then((el) => {
        el.value = this.currentObservacao;
      }).catch(() => void 0);
    }, 0);
  }
  persistCurrentState() {
    const item = this.currentItem;
    if (!item) {
      return;
    }
    this.itemState[item.id] = {
      observacao: this.currentObservacao,
      conforme: this.currentConforme
    };
  }
  setSituacao(value) {
    this.currentSituacao = value === "nao" ? "nao" : "conforme";
    this.currentConforme = this.currentSituacao === "conforme";
  }
  estimateBase64Size(base64) {
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.floor(base64.length * 3 / 4) - padding;
  }
  sanitizeFilename(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-_]+/g, "_").replace(/_+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  }
  formatDateFilename(dateValue) {
    const date = new Date(dateValue);
    const pad = (n) => n.toString().padStart(2, "0");
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1);
    const yyyy = date.getFullYear();
    return `${dd}${mm}${yyyy}`;
  }
  isFotoPermitida(item) {
    if (!item) {
      return false;
    }
    if (this.currentConforme && item.permitirfotoconforme === false) {
      return false;
    }
    return true;
  }
  formatarTamanho(bytes) {
    const mb = bytes / 1048576;
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }
    const kb = bytes / 1024;
    return `${kb.toFixed(1)} KB`;
  }
  base64ToBlob(base64) {
    const byteString = atob(base64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i);
    }
    return new Blob([bytes], { type: "image/jpeg" });
  }
  static \u0275fac = function VistoriaChecklistPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VistoriaChecklistPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _VistoriaChecklistPage, selectors: [["app-vistoria-checklist"]], viewQuery: function VistoriaChecklistPage_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5, IonTextarea);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.observacaoInput = _t.first);
    }
  }, decls: 13, vars: 7, consts: [["observacaoInput", ""], [3, "translucent"], ["slot", "start", 4, "ngIf"], ["slot", "end"], ["color", "danger", 3, "click"], [3, "fullscreen"], [3, "value", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["slot", "start"], [3, "value"], [1, "content"], ["name", "crescent"], [1, "actions", "actions-top"], ["fill", "outline", 3, "click", "disabled"], ["slot", "start", "name", "arrow-back-outline"], [3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], [4, "ngIf"], [1, "header"], ["color", "success", 4, "ngIf"], [1, "situacao-item"], [1, "situacao-chips"], [3, "click"], ["position", "stacked"], ["placeholder", "Observa\xE7\xE3o opcional", 3, "ionInput", "value"], ["lines", "none"], ["slot", "start", "name", "camera-outline"], ["color", "danger", 4, "ngIf"], ["slot", "end", "name", "arrow-forward-outline"], ["color", "success"], ["name", "checkmark-circle"], [4, "ngFor", "ngForOf"], ["alt", "Foto", 3, "src"], ["slot", "end", "fill", "clear", "color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], ["color", "danger"], [1, "error-message"]], template: function VistoriaChecklistPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 1)(1, "ion-toolbar");
      \u0275\u0275template(2, VistoriaChecklistPage_ion_buttons_2_Template, 2, 0, "ion-buttons", 2);
      \u0275\u0275elementStart(3, "ion-title");
      \u0275\u0275text(4, "Checklist");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "ion-buttons", 3)(6, "ion-button", 4);
      \u0275\u0275listener("click", function VistoriaChecklistPage_Template_ion_button_click_6_listener() {
        return ctx.cancelarVistoria();
      });
      \u0275\u0275text(7, "Cancelar");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(8, "ion-content", 5);
      \u0275\u0275template(9, VistoriaChecklistPage_ion_progress_bar_9_Template, 1, 1, "ion-progress-bar", 6)(10, VistoriaChecklistPage_div_10_Template, 4, 0, "div", 7)(11, VistoriaChecklistPage_div_11_Template, 33, 20, "div", 7)(12, VistoriaChecklistPage_div_12_Template, 3, 0, "div", 7);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(2);
      \u0275\u0275property("ngIf", ctx.isNative);
      \u0275\u0275advance(6);
      \u0275\u0275property("fullscreen", true);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.itens.length > 0);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.loadingItens);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loadingItens && ctx.currentItem);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", !ctx.loadingItens && !ctx.currentItem);
    }
  }, dependencies: [
    NgIf,
    NgForOf,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonItem,
    IonLabel,
    IonTextarea,
    IonButton,
    IonList,
    IonProgressBar,
    IonSpinner,
    IonText,
    IonIcon,
    IonChip
  ], styles: ["\n\n.content[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\nion-item[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n.actions-top[_ngcontent-%COMP%] {\n  margin-top: 0;\n  margin-bottom: 12px;\n}\n.error-message[_ngcontent-%COMP%] {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n.situacao-item[_ngcontent-%COMP%] {\n  --inner-padding-end: 12px;\n  --inner-padding-start: 12px;\n}\n.situacao-chips[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  width: 100%;\n}\n.situacao-chips[_ngcontent-%COMP%]   ion-chip[_ngcontent-%COMP%] {\n  flex: 1;\n  justify-content: center;\n  border-radius: 999px;\n  min-height: 34px;\n  font-weight: 600;\n  font-size: 0.82rem;\n  text-transform: none;\n  margin: 0;\n  background: transparent;\n  color: #475569;\n}\n.situacao-chips[_ngcontent-%COMP%]   ion-chip.is-selected[_ngcontent-%COMP%] {\n  background: #e2e8f0;\n  color: #0f172a;\n}\n.situacao-chips[_ngcontent-%COMP%]   ion-chip.is-conforme.is-selected[_ngcontent-%COMP%] {\n  background: #dcfce7;\n  color: #166534;\n}\n.situacao-chips[_ngcontent-%COMP%]   ion-chip.is-nao.is-selected[_ngcontent-%COMP%] {\n  background: #fee2e2;\n  color: #991b1b;\n}\n/*# sourceMappingURL=vistoria-checklist.page.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VistoriaChecklistPage, [{
    type: Component,
    args: [{ selector: "app-vistoria-checklist", standalone: true, imports: [
      NgIf,
      NgForOf,
      FormsModule,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonMenuButton,
      IonItem,
      IonLabel,
      IonTextarea,
      IonButton,
      IonList,
      IonProgressBar,
      IonSpinner,
      IonText,
      IonIcon,
      IonChip
    ], template: `<ion-header [translucent]="true">\r
  <ion-toolbar>\r
    <ion-buttons slot="start" *ngIf="isNative">\r
      <ion-menu-button></ion-menu-button>\r
    </ion-buttons>\r
    <ion-title>Checklist</ion-title>\r
    <ion-buttons slot="end">\r
      <ion-button color="danger" (click)="cancelarVistoria()">Cancelar</ion-button>\r
    </ion-buttons>\r
  </ion-toolbar>\r
</ion-header>\r
\r
<ion-content [fullscreen]="true">\r
  <ion-progress-bar *ngIf="itens.length > 0" [value]="progress"></ion-progress-bar>\r
\r
  <div class="content" *ngIf="loadingItens">\r
    <ion-spinner name="crescent"></ion-spinner>\r
    <p>Carregando itens...</p>\r
  </div>\r
\r
  <div class="content" *ngIf="!loadingItens && currentItem">\r
    <div class="actions actions-top">\r
      <ion-button fill="outline" (click)="anterior()" [disabled]="currentIndex === 0">\r
        <ion-icon slot="start" name="arrow-back-outline"></ion-icon>\r
        Anterior\r
      </ion-button>\r
      <ion-button (click)="salvarItem()" [disabled]="isSaving">\r
        <ion-spinner *ngIf="isSaving" name="crescent"></ion-spinner>\r
        <span *ngIf="!isSaving">\r
          Salvar item\r
          <ion-icon slot="end" name="arrow-forward-outline"></ion-icon>\r
        </span>\r
      </ion-button>\r
    </div>\r
\r
    <div class="header">\r
      <h2>{{ displayIndex }}. {{ currentItem.descricao }}</h2>\r
      <ion-text color="success" *ngIf="savedIds.has(currentItem.id)">\r
        <ion-icon name="checkmark-circle"></ion-icon>\r
        Item salvo\r
      </ion-text>\r
    </div>\r
\r
    <ion-item class="situacao-item">\r
      <div class="situacao-chips">\r
        <ion-chip\r
          [class.is-selected]="currentSituacao === 'conforme'"\r
          [class.is-conforme]="currentSituacao === 'conforme'"\r
          (click)="setSituacao('conforme')"\r
        >\r
          <ion-label>Conforme</ion-label>\r
        </ion-chip>\r
        <ion-chip\r
          [class.is-selected]="currentSituacao === 'nao'"\r
          [class.is-nao]="currentSituacao === 'nao'"\r
          (click)="setSituacao('nao')"\r
        >\r
          <ion-label>N\xE3o conforme</ion-label>\r
        </ion-chip>\r
      </div>\r
    </ion-item>\r
\r
    <ion-item>\r
      <ion-label position="stacked">Observa\xE7\xE3o</ion-label>\r
      <ion-textarea\r
        #observacaoInput\r
        [value]="currentObservacao"\r
        placeholder="Observa\xE7\xE3o opcional"\r
        (ionInput)="currentObservacao = $event.detail.value ?? ''"\r
      ></ion-textarea>\r
    </ion-item>\r
\r
    <ion-item lines="none">\r
      <ion-label>Fotos ({{ currentFotos.length }})</ion-label>\r
      <ion-button fill="outline" (click)="adicionarFoto()" [disabled]="!podeAdicionarFoto">\r
        <ion-icon slot="start" name="camera-outline"></ion-icon>\r
        Adicionar\r
      </ion-button>\r
    </ion-item>\r
\r
    <ion-list *ngIf="currentFotos.length > 0">\r
      <ion-item *ngFor="let foto of currentFotos; let i = index">\r
        <img [src]="foto.preview" alt="Foto" />\r
        <ion-label>\r
          <p>{{ foto.nomeArquivo }}</p>\r
          <p>{{ formatarTamanho(foto.tamanho) }}</p>\r
        </ion-label>\r
        <ion-button slot="end" fill="clear" color="danger" (click)="removerFoto(i)">\r
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>\r
        </ion-button>\r
      </ion-item>\r
    </ion-list>\r
\r
    <ion-text color="danger" *ngIf="errorMessage">\r
      <p class="error-message">{{ errorMessage }}</p>\r
    </ion-text>\r
\r
  </div>\r
\r
  <div class="content" *ngIf="!loadingItens && !currentItem">\r
    <p>Nenhum item encontrado para este tipo de vistoria.</p>\r
  </div>\r
</ion-content>\r
`, styles: ["/* src/app/pages/vistoria/vistoria-checklist.page.scss */\n.content {\n  padding: 16px;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 12px;\n}\nion-item img {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.actions {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  margin-top: 16px;\n}\n.actions-top {\n  margin-top: 0;\n  margin-bottom: 12px;\n}\n.error-message {\n  margin: 8px 0 0;\n  font-size: 0.9rem;\n}\n.situacao-item {\n  --inner-padding-end: 12px;\n  --inner-padding-start: 12px;\n}\n.situacao-chips {\n  display: flex;\n  gap: 8px;\n  width: 100%;\n}\n.situacao-chips ion-chip {\n  flex: 1;\n  justify-content: center;\n  border-radius: 999px;\n  min-height: 34px;\n  font-weight: 600;\n  font-size: 0.82rem;\n  text-transform: none;\n  margin: 0;\n  background: transparent;\n  color: #475569;\n}\n.situacao-chips ion-chip.is-selected {\n  background: #e2e8f0;\n  color: #0f172a;\n}\n.situacao-chips ion-chip.is-conforme.is-selected {\n  background: #dcfce7;\n  color: #166534;\n}\n.situacao-chips ion-chip.is-nao.is-selected {\n  background: #fee2e2;\n  color: #991b1b;\n}\n/*# sourceMappingURL=vistoria-checklist.page.css.map */\n"] }]
  }], () => [], { observacaoInput: [{
    type: ViewChild,
    args: ["observacaoInput", { read: IonTextarea }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaChecklistPage, { className: "VistoriaChecklistPage", filePath: "src/app/pages/vistoria/vistoria-checklist.page.ts", lineNumber: 74 });
})();
export {
  VistoriaChecklistPage
};
//# sourceMappingURL=chunk-S5QHQHOI.js.map
