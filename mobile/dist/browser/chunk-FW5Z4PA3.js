import "./chunk-6L2LYKT6.js";
import {
  MatrizCriticidadeService
} from "./chunk-RHJFJ3UX.js";
import {
  VistoriaBootstrapService
} from "./chunk-MDNFBFQA.js";
import {
  VistoriaService
} from "./chunk-YUK26TMQ.js";
import {
  addIcons,
  arrowBack,
  cameraOutline,
  trashOutline
} from "./chunk-C5VNYMLZ.js";
import {
  VistoriaFlowService
} from "./chunk-6KJ4EGXY.js";
import {
  AuthService
} from "./chunk-7MZB25UE.js";
import {
  ErrorMessageService
} from "./chunk-AN5CWPW3.js";
import {
  ActivatedRoute,
  AlertController,
  ChangeDetectorRef,
  Component,
  FormsModule,
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
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
  ɵɵdefineComponent,
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
} from "./chunk-7F2ASLWB.js";
import "./chunk-JZ773BOS.js";
import "./chunk-T5LCTCQ6.js";
import "./chunk-JCEFQURH.js";
import "./chunk-PFHNU3CN.js";
import {
  Capacitor,
  CapacitorException,
  WebPlugin,
  registerPlugin
} from "./chunk-XS4INNGU.js";
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

// node_modules/@capacitor/camera/dist/esm/definitions.js
var CameraSource;
(function(CameraSource2) {
  CameraSource2["Prompt"] = "PROMPT";
  CameraSource2["Camera"] = "CAMERA";
  CameraSource2["Photos"] = "PHOTOS";
})(CameraSource || (CameraSource = {}));
var CameraDirection;
(function(CameraDirection2) {
  CameraDirection2["Rear"] = "REAR";
  CameraDirection2["Front"] = "FRONT";
})(CameraDirection || (CameraDirection = {}));
var CameraResultType;
(function(CameraResultType2) {
  CameraResultType2["Uri"] = "uri";
  CameraResultType2["Base64"] = "base64";
  CameraResultType2["DataUrl"] = "dataUrl";
})(CameraResultType || (CameraResultType = {}));
var MediaType;
(function(MediaType2) {
  MediaType2[MediaType2["Photo"] = 0] = "Photo";
  MediaType2[MediaType2["Video"] = 1] = "Video";
})(MediaType || (MediaType = {}));
var MediaTypeSelection;
(function(MediaTypeSelection2) {
  MediaTypeSelection2[MediaTypeSelection2["Photo"] = 0] = "Photo";
  MediaTypeSelection2[MediaTypeSelection2["Video"] = 1] = "Video";
  MediaTypeSelection2[MediaTypeSelection2["All"] = 2] = "All";
})(MediaTypeSelection || (MediaTypeSelection = {}));
var EncodingType;
(function(EncodingType2) {
  EncodingType2[EncodingType2["JPEG"] = 0] = "JPEG";
  EncodingType2[EncodingType2["PNG"] = 1] = "PNG";
})(EncodingType || (EncodingType = {}));
var CameraErrorCode;
(function(CameraErrorCode2) {
  CameraErrorCode2["CameraPermissionDenied"] = "OS-PLUG-CAMR-0003";
  CameraErrorCode2["GalleryPermissionDenied"] = "OS-PLUG-CAMR-0005";
  CameraErrorCode2["NoCameraAvailable"] = "OS-PLUG-CAMR-0007";
  CameraErrorCode2["TakePhotoCancelled"] = "OS-PLUG-CAMR-0006";
  CameraErrorCode2["TakePhotoFailed"] = "OS-PLUG-CAMR-0010";
  CameraErrorCode2["TakePhotoInvalidArguments"] = "OS-PLUG-CAMR-0014";
  CameraErrorCode2["InvalidImageData"] = "OS-PLUG-CAMR-0008";
  CameraErrorCode2["EditPhotoFailed"] = "OS-PLUG-CAMR-0009";
  CameraErrorCode2["EditPhotoCancelled"] = "OS-PLUG-CAMR-0013";
  CameraErrorCode2["EditPhotoEmptyUri"] = "OS-PLUG-CAMR-0024";
  CameraErrorCode2["ImageNotFound"] = "OS-PLUG-CAMR-0011";
  CameraErrorCode2["ProcessImageFailed"] = "OS-PLUG-CAMR-0012";
  CameraErrorCode2["ChooseMediaFailed"] = "OS-PLUG-CAMR-0018";
  CameraErrorCode2["ChooseMediaCancelled"] = "OS-PLUG-CAMR-0020";
  CameraErrorCode2["MediaPathError"] = "OS-PLUG-CAMR-0021";
  CameraErrorCode2["FetchImageFromUriFailed"] = "OS-PLUG-CAMR-0028";
  CameraErrorCode2["RecordVideoFailed"] = "OS-PLUG-CAMR-0016";
  CameraErrorCode2["RecordVideoCancelled"] = "OS-PLUG-CAMR-0017";
  CameraErrorCode2["VideoNotFound"] = "OS-PLUG-CAMR-0025";
  CameraErrorCode2["PlayVideoFailed"] = "OS-PLUG-CAMR-0023";
  CameraErrorCode2["EncodeResultFailed"] = "OS-PLUG-CAMR-0019";
  CameraErrorCode2["FileNotFound"] = "OS-PLUG-CAMR-0027";
  CameraErrorCode2["InvalidArgument"] = "OS-PLUG-CAMR-0031";
  CameraErrorCode2["GeneralError"] = "OS-PLUG-CAMR-0026";
})(CameraErrorCode || (CameraErrorCode = {}));

// node_modules/@capacitor/camera/dist/esm/web.js
var CameraWeb = class extends WebPlugin {
  takePhoto(options) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        if (options.webUseInput) {
          this.takePhotoCameraInputExperience(options, resolve, reject);
        } else {
          this.takePhotoCameraExperience(options, resolve, reject);
        }
      }));
    });
  }
  recordVideo(_options) {
    return __async(this, null, function* () {
      throw this.unimplemented("recordVideo is not implemented on Web.");
    });
  }
  playVideo(_options) {
    return __async(this, null, function* () {
      throw this.unimplemented("playVideo is not implemented on Web.");
    });
  }
  chooseFromGallery(options) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        this.galleryInputExperience(options, resolve, reject);
      }));
    });
  }
  editPhoto(_options) {
    return __async(this, null, function* () {
      throw this.unimplemented("editPhoto is not implemented on Web.");
    });
  }
  editURIPhoto(_options) {
    return __async(this, null, function* () {
      throw this.unimplemented("editURIPhoto is not implemented on Web.");
    });
  }
  getPhoto(options) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        if (options.webUseInput || options.source === CameraSource.Photos) {
          this.fileInputExperience(options, resolve, reject);
        } else if (options.source === CameraSource.Prompt) {
          let actionSheet = document.querySelector("pwa-action-sheet");
          if (!actionSheet) {
            actionSheet = document.createElement("pwa-action-sheet");
            document.body.appendChild(actionSheet);
          }
          actionSheet.header = options.promptLabelHeader || "Photo";
          actionSheet.cancelable = false;
          actionSheet.options = [
            { title: options.promptLabelPhoto || "From Photos" },
            { title: options.promptLabelPicture || "Take Picture" }
          ];
          actionSheet.addEventListener("onSelection", (e) => __async(this, null, function* () {
            const selection = e.detail;
            if (selection === 0) {
              this.fileInputExperience(options, resolve, reject);
            } else {
              this.cameraExperience(options, resolve, reject);
            }
          }));
        } else {
          this.cameraExperience(options, resolve, reject);
        }
      }));
    });
  }
  pickImages(_options) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => __async(this, null, function* () {
        this.multipleFileInputExperience(resolve, reject);
      }));
    });
  }
  cameraExperience(options, resolve, reject) {
    return __async(this, null, function* () {
      yield this._setupPWACameraModal(options.direction, (photo) => this._getCameraPhoto(photo, options), () => this.fileInputExperience(options, resolve, reject), resolve, reject);
    });
  }
  fileInputExperience(options, resolve, reject) {
    let input = document.querySelector("#_capacitor-camera-input");
    const cleanup = () => {
      var _a;
      (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(input);
    };
    if (!input) {
      input = document.createElement("input");
      input.id = "_capacitor-camera-input";
      input.type = "file";
      input.hidden = true;
      document.body.appendChild(input);
      input.addEventListener("change", (_e) => {
        const file = input.files[0];
        let format = "jpeg";
        if (file.type === "image/png") {
          format = "png";
        } else if (file.type === "image/gif") {
          format = "gif";
        }
        if (options.resultType === "dataUrl" || options.resultType === "base64") {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            if (options.resultType === "dataUrl") {
              resolve({
                dataUrl: reader.result,
                format
              });
            } else if (options.resultType === "base64") {
              const b64 = reader.result.split(",")[1];
              resolve({
                base64String: b64,
                format
              });
            }
            cleanup();
          });
          reader.readAsDataURL(file);
        } else {
          resolve({
            webPath: URL.createObjectURL(file),
            format
          });
          cleanup();
        }
      });
      input.addEventListener("cancel", (_e) => {
        reject(new CapacitorException("User cancelled photos app"));
        cleanup();
      });
    }
    input.accept = "image/*";
    input.capture = true;
    if (options.source === CameraSource.Photos || options.source === CameraSource.Prompt) {
      input.removeAttribute("capture");
    } else if (options.direction === CameraDirection.Front) {
      input.capture = "user";
    } else if (options.direction === CameraDirection.Rear) {
      input.capture = "environment";
    }
    input.click();
  }
  multipleFileInputExperience(resolve, reject) {
    let input = document.querySelector("#_capacitor-camera-input-multiple");
    const cleanup = () => {
      var _a;
      (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(input);
    };
    if (!input) {
      input = document.createElement("input");
      input.id = "_capacitor-camera-input-multiple";
      input.type = "file";
      input.hidden = true;
      input.multiple = true;
      document.body.appendChild(input);
      input.addEventListener("change", (_e) => {
        const photos = [];
        for (let i = 0; i < input.files.length; i++) {
          const file = input.files[i];
          let format = "jpeg";
          if (file.type === "image/png") {
            format = "png";
          } else if (file.type === "image/gif") {
            format = "gif";
          }
          photos.push({
            webPath: URL.createObjectURL(file),
            format
          });
        }
        resolve({ photos });
        cleanup();
      });
      input.addEventListener("cancel", (_e) => {
        reject(new CapacitorException("User cancelled photos app"));
        cleanup();
      });
    }
    input.accept = "image/*";
    input.click();
  }
  _getCameraPhoto(photo, options) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const format = this._getFileFormat(photo);
      if (options.resultType === "uri") {
        resolve({
          webPath: URL.createObjectURL(photo),
          format,
          saved: false
        });
      } else {
        reader.readAsDataURL(photo);
        reader.onloadend = () => {
          const r = reader.result;
          if (options.resultType === "dataUrl") {
            resolve({
              dataUrl: r,
              format,
              saved: false
            });
          } else {
            resolve({
              base64String: r.split(",")[1],
              format,
              saved: false
            });
          }
        };
        reader.onerror = (e) => {
          reject(e);
        };
      }
    });
  }
  takePhotoCameraExperience(options, resolve, reject) {
    return __async(this, null, function* () {
      yield this._setupPWACameraModal(options.cameraDirection, (photo) => {
        var _a;
        return this._buildPhotoMediaResult(photo, (_a = options.includeMetadata) !== null && _a !== void 0 ? _a : false);
      }, () => this.takePhotoCameraInputExperience(options, resolve, reject), resolve, reject);
    });
  }
  takePhotoCameraInputExperience(options, resolve, reject) {
    const input = this._createFileInput("_capacitor-camera-input-takephoto");
    const cleanup = () => {
      var _a;
      (_a = input.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(input);
    };
    input.onchange = (_e) => __async(this, null, function* () {
      var _a;
      if (!this._validateFileInput(input, reject, cleanup)) {
        return;
      }
      const file = input.files[0];
      resolve(yield this._buildPhotoMediaResult(file, (_a = options.includeMetadata) !== null && _a !== void 0 ? _a : false));
      cleanup();
    });
    input.oncancel = () => {
      reject(new CapacitorException("User cancelled photos app"));
      cleanup();
    };
    input.accept = "image/*";
    if (options.cameraDirection === CameraDirection.Front) {
      input.capture = "user";
    } else {
      input.capture = "environment";
    }
    input.click();
  }
  galleryInputExperience(options, resolve, reject) {
    var _a, _b;
    const input = this._createFileInput("_capacitor-camera-input-gallery");
    input.multiple = (_a = options.allowMultipleSelection) !== null && _a !== void 0 ? _a : false;
    const cleanup = () => {
      var _a2;
      (_a2 = input.parentNode) === null || _a2 === void 0 ? void 0 : _a2.removeChild(input);
    };
    input.onchange = (_e) => __async(this, null, function* () {
      var _a2;
      if (!this._validateFileInput(input, reject, cleanup)) {
        return;
      }
      const results = [];
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        if (file.type.startsWith("image/")) {
          results.push(yield this._buildPhotoMediaResult(file, (_a2 = options.includeMetadata) !== null && _a2 !== void 0 ? _a2 : false));
        } else if (file.type.startsWith("video/")) {
          const format = this._getFileFormat(file);
          let thumbnail;
          let resolution;
          let duration;
          try {
            const videoInfo = yield this._getVideoMetadata(file);
            thumbnail = videoInfo.thumbnail;
            if (options.includeMetadata) {
              resolution = videoInfo.resolution;
              duration = videoInfo.duration;
            }
          } catch (e) {
            console.warn("Failed to get video metadata:", e);
          }
          const result = {
            type: MediaType.Video,
            thumbnail,
            webPath: URL.createObjectURL(file),
            saved: false
          };
          if (options.includeMetadata) {
            result.metadata = {
              format,
              resolution,
              size: file.size,
              creationDate: new Date(file.lastModified).toISOString(),
              duration
            };
          }
          results.push(result);
        }
      }
      resolve({ results });
      cleanup();
    });
    input.oncancel = () => {
      reject(new CapacitorException("User cancelled photos app"));
      cleanup();
    };
    const mediaType = (_b = options.mediaType) !== null && _b !== void 0 ? _b : MediaTypeSelection.Photo;
    if (mediaType === MediaTypeSelection.Photo) {
      input.accept = "image/*";
    } else if (mediaType === MediaTypeSelection.Video) {
      input.accept = "video/*";
    } else {
      input.accept = "image/*,video/*";
    }
    input.click();
  }
  _getFileFormat(file) {
    if (file.type === "image/png") {
      return "png";
    } else if (file.type === "image/gif") {
      return "gif";
    } else if (file.type.startsWith("video/")) {
      return file.type.split("/")[1];
    } else if (file.type.startsWith("image/")) {
      return "jpeg";
    }
    return file.type.split("/")[1] || "jpeg";
  }
  _buildPhotoMediaResult(file, includeMetadata) {
    return __async(this, null, function* () {
      const format = this._getFileFormat(file);
      const thumbnail = yield this._getBase64FromFile(file);
      const result = {
        type: MediaType.Photo,
        thumbnail,
        webPath: URL.createObjectURL(file),
        saved: false
      };
      if (includeMetadata) {
        const resolution = yield this._getImageResolution(file);
        result.metadata = {
          format,
          resolution,
          size: file.size,
          creationDate: "lastModified" in file ? new Date(file.lastModified).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      return result;
    });
  }
  _validateFileInput(input, reject, cleanup) {
    if (!input.files || input.files.length === 0) {
      const message = input.multiple ? "No files selected" : "No file selected";
      reject(new CapacitorException(message));
      cleanup();
      return false;
    }
    return true;
  }
  _setupPWACameraModal(cameraDirection, onPhotoCallback, fallbackCallback, resolve, reject) {
    return __async(this, null, function* () {
      if (customElements.get("pwa-camera-modal")) {
        const cameraModal = document.createElement("pwa-camera-modal");
        cameraModal.facingMode = cameraDirection === CameraDirection.Front ? "user" : "environment";
        document.body.appendChild(cameraModal);
        try {
          yield cameraModal.componentOnReady();
          cameraModal.addEventListener("onPhoto", (e) => __async(null, null, function* () {
            const photo = e.detail;
            if (photo === null) {
              reject(new CapacitorException("User cancelled photos app"));
            } else if (photo instanceof Error) {
              reject(photo);
            } else {
              resolve(yield onPhotoCallback(photo));
            }
            cameraModal.dismiss();
            document.body.removeChild(cameraModal);
          }));
          cameraModal.present();
        } catch (e) {
          fallbackCallback();
        }
      } else {
        console.error(`Unable to load PWA Element 'pwa-camera-modal'. See the docs: https://capacitorjs.com/docs/web/pwa-elements.`);
        fallbackCallback();
      }
    });
  }
  _createFileInput(id) {
    let input = document.querySelector(`#${id}`);
    if (!input) {
      input = document.createElement("input");
      input.id = id;
      input.type = "file";
      input.hidden = true;
      document.body.appendChild(input);
    }
    return input;
  }
  _getImageResolution(image) {
    return __async(this, null, function* () {
      try {
        const bitmap = yield createImageBitmap(image);
        const resolution = `${bitmap.width}x${bitmap.height}`;
        bitmap.close();
        return resolution;
      } catch (e) {
        console.warn("Failed to get image resolution:", e);
        return void 0;
      }
    });
  }
  _getBase64FromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  }
  _getVideoMetadata(videoFile) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.onloadedmetadata = () => {
        const seekTime = Math.min(1, video.duration * 0.1);
        video.currentTime = seekTime;
      };
      video.onseeked = () => {
        const result = {
          resolution: `${video.videoWidth}x${video.videoHeight}`,
          duration: video.duration
        };
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            result.thumbnail = canvas.toDataURL("image/jpeg", 0.8).split(",")[1];
          }
        } catch (e) {
          console.warn("Failed to generate video thumbnail:", e);
        }
        URL.revokeObjectURL(video.src);
        resolve(result);
      };
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve({});
      };
      video.src = URL.createObjectURL(videoFile);
    });
  }
  checkPermissions() {
    return __async(this, null, function* () {
      if (typeof navigator === "undefined" || !navigator.permissions) {
        throw this.unavailable("Permissions API not available in this browser");
      }
      try {
        const permission = yield window.navigator.permissions.query({
          name: "camera"
        });
        return {
          camera: permission.state,
          photos: "granted"
        };
      } catch (_a) {
        throw this.unavailable("Camera permissions are not available in this browser");
      }
    });
  }
  requestPermissions() {
    return __async(this, null, function* () {
      throw this.unimplemented("Not implemented on web.");
    });
  }
  pickLimitedLibraryPhotos() {
    return __async(this, null, function* () {
      throw this.unavailable("Not implemented on web.");
    });
  }
  getLimitedLibraryPhotos() {
    return __async(this, null, function* () {
      throw this.unavailable("Not implemented on web.");
    });
  }
};
var Camera = new CameraWeb();

// node_modules/@capacitor/camera/dist/esm/index.js
var Camera2 = registerPlugin("Camera", {
  web: () => new CameraWeb()
});

// node_modules/capacitor-voice-recorder/dist/esm/index.js
var VoiceRecorder = registerPlugin("VoiceRecorder", {
  web: () => import("./chunk-T6QV57JL.js").then((m) => new m.VoiceRecorderWeb())
});

// src/app/pages/vistoria/vistoria-irregularidade.page.ts
var _c0 = ["observacaoInput"];
function VistoriaIrregularidadePage_ion_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-button", 22);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_ion_button_7_Template_ion_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.abrirResumoPendenciasVeiculo());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 7);
    \u0275\u0275element(2, "rect", 23)(3, "path", 24)(4, "path", 25)(5, "path", 26);
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_16_div_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 28)(1, "strong");
    \u0275\u0275text(2, "Sintoma:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.selectedMatriz == null ? null : ctx_r1.selectedMatriz.sintoma == null ? null : ctx_r1.selectedMatriz.sintoma.descricao);
  }
}
function VistoriaIrregularidadePage_div_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 28)(2, "strong");
    \u0275\u0275text(3, "Vistoria:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 28)(7, "strong");
    \u0275\u0275text(8, "Ve\xEDculo:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 28)(12, "strong");
    \u0275\u0275text(13, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 28)(17, "strong");
    \u0275\u0275text(18, "Componente:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(21, VistoriaIrregularidadePage_div_16_div_21_Template, 5, 1, "div", 29);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.vistoriaNumero);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.veiculoNumero);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.areaNome);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.componenteNome);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedMatriz == null ? null : ctx_r1.selectedMatriz.sintoma == null ? null : ctx_r1.selectedMatriz.sintoma.descricao);
  }
}
function VistoriaIrregularidadePage_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275element(1, "ion-spinner", 31);
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3, "Carregando sintomas...");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_ion_text_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 32)(1, "p", 33);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.errorMessage);
  }
}
function VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_p_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p")(1, "ion-text", 41);
    \u0275\u0275text(2, "Irregularidade registrada nesta vistoria");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_p_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 42)(1, "ion-text", 43);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" Pend\xEAncia(s) Registrada(s): ", ctx_r1.quantidadePendenciasAnteriores(item_r4), " ");
  }
}
function VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_ion_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-button", 44);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_ion_button_3_Template_ion_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const item_r4 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.visualizarRegistroPendente(item_r4, $event));
    });
    \u0275\u0275text(1, " Ver Pend\xEAncia(s) ");
    \u0275\u0275elementEnd();
  }
}
function VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-card-content");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_p_1_Template, 3, 0, "p", 18)(2, VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_p_2_Template, 3, 1, "p", 39)(3, VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_ion_button_3_Template, 2, 0, "ion-button", 40);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isIrregularidadeJaRegistrada(item_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.temPendenteAnterior(item_r4));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.temPendenteAnterior(item_r4));
  }
}
function VistoriaIrregularidadePage_div_19_ion_card_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-card", 38);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_19_ion_card_4_Template_ion_card_click_0_listener() {
      const item_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selecionarSintoma(item_r4));
    });
    \u0275\u0275elementStart(1, "ion-card-header")(2, "ion-card-title");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(4, VistoriaIrregularidadePage_div_19_ion_card_4_ion_card_content_4_Template, 4, 3, "ion-card-content", 18);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("level-card", true)("level-card--selected", ctx_r1.isSintomaSelected(item_r4));
    \u0275\u0275attribute("tabindex", 0);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r4.sintoma == null ? null : item_r4.sintoma.descricao);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.isIrregularidadeJaRegistrada(item_r4) || ctx_r1.temPendenteAnterior(item_r4));
  }
}
function VistoriaIrregularidadePage_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "p", 35);
    \u0275\u0275text(2, "Selecione um Sintoma:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36);
    \u0275\u0275template(4, VistoriaIrregularidadePage_div_19_ion_card_4_Template, 5, 7, "ion-card", 37);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.matriz);
  }
}
function VistoriaIrregularidadePage_div_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "p");
    \u0275\u0275text(2, "Nenhum sintoma configurado para este componente.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_21_ion_text_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 41)(1, "p", 33);
    \u0275\u0275text(2, "Irregularidade j\xE1 registrada nesta vistoria. Voc\xEA pode editar a observa\xE7\xE3o e adicionar novas m\xEDdias.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_21_ion_text_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 55)(1, "p", 56);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.observacaoFieldError);
  }
}
function VistoriaIrregularidadePage_div_21_ion_list_16_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item");
    \u0275\u0275element(1, "img", 58);
    \u0275\u0275elementStart(2, "ion-label")(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "ion-button", 59);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_21_ion_list_16_ion_item_1_Template_ion_button_click_5_listener() {
      const i_r8 = \u0275\u0275restoreView(_r7).index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removerFoto(i_r8));
    });
    \u0275\u0275element(6, "ion-icon", 60);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const foto_r9 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", "data:image/jpeg;base64," + foto_r9.dadosBase64, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(foto_r9.nomeArquivo);
  }
}
function VistoriaIrregularidadePage_div_21_ion_list_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_21_ion_list_16_ion_item_1_Template, 7, 2, "ion-item", 57);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.fotos);
  }
}
function VistoriaIrregularidadePage_div_21_ion_item_17_p_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("J\xE1 salvos: ", ctx_r1.audiosExistentesCount);
  }
}
function VistoriaIrregularidadePage_div_21_ion_item_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item", 51)(1, "ion-label");
    \u0275\u0275text(2);
    \u0275\u0275template(3, VistoriaIrregularidadePage_div_21_ion_item_17_p_3_Template, 2, 1, "p", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-button", 61);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_21_ion_item_17_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.abrirGravacaoAudio());
    });
    \u0275\u0275text(5, " Gravar \xE1udio ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" \xC1udios novos (", ctx_r1.audios.length, ") ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.audiosExistentesCount > 0);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.gravandoAudio || ctx_r1.gravacaoPreparando || !ctx_r1.podeGravarAudio);
  }
}
function VistoriaIrregularidadePage_div_21_ion_list_18_ion_item_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-item")(1, "ion-label")(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275element(4, "audio", 62);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "ion-button", 59);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_21_ion_list_18_ion_item_1_Template_ion_button_click_5_listener() {
      const i_r12 = \u0275\u0275restoreView(_r11).index;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.removerAudio(i_r12));
    });
    \u0275\u0275element(6, "ion-icon", 60);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const a_r13 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(a_r13.nomeArquivo);
    \u0275\u0275advance();
    \u0275\u0275property("src", a_r13.previewUrl, \u0275\u0275sanitizeUrl);
  }
}
function VistoriaIrregularidadePage_div_21_ion_list_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-list");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_21_ion_list_18_ion_item_1_Template, 7, 2, "ion-item", 57);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.audios);
  }
}
function VistoriaIrregularidadePage_div_21_ion_text_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ion-text", 32)(1, "p", 33);
    \u0275\u0275text(2, "Dispositivo n\xE3o suporta grava\xE7\xE3o de \xE1udio.");
    \u0275\u0275elementEnd()();
  }
}
function VistoriaIrregularidadePage_div_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 30);
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_21_ion_text_1_Template, 3, 0, "ion-text", 45);
    \u0275\u0275elementStart(2, "ion-item", 46)(3, "ion-label", 47);
    \u0275\u0275text(4, " Descreva o problema ");
    \u0275\u0275elementStart(5, "span", 48);
    \u0275\u0275text(6, "(obrigat\xF3rio)");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "ion-textarea", 49, 0);
    \u0275\u0275listener("ionInput", function VistoriaIrregularidadePage_div_21_Template_ion_textarea_ionInput_7_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onObservacaoInput($event.detail.value ?? ""));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, VistoriaIrregularidadePage_div_21_ion_text_9_Template, 3, 1, "ion-text", 50);
    \u0275\u0275elementStart(10, "ion-item", 51)(11, "ion-label");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "ion-button", 52);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_21_Template_ion_button_click_13_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.adicionarFoto());
    });
    \u0275\u0275element(14, "ion-icon", 53);
    \u0275\u0275text(15, " Adicionar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(16, VistoriaIrregularidadePage_div_21_ion_list_16_Template, 2, 1, "ion-list", 18)(17, VistoriaIrregularidadePage_div_21_ion_item_17_Template, 6, 3, "ion-item", 54)(18, VistoriaIrregularidadePage_div_21_ion_list_18_Template, 2, 1, "ion-list", 18)(19, VistoriaIrregularidadePage_div_21_ion_text_19_Template, 3, 0, "ion-text", 16);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.irregularidadeEmEdicaoId);
    \u0275\u0275advance();
    \u0275\u0275classProp("item-descricao-problema--erro", ctx_r1.observacaoFieldError);
    \u0275\u0275advance(5);
    \u0275\u0275property("value", ctx_r1.observacao);
    \u0275\u0275attribute("aria-required", true)("aria-invalid", ctx_r1.observacaoFieldError ? "true" : null)("aria-describedby", ctx_r1.observacaoFieldError ? "erro-desc-problema" : null);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.observacaoFieldError);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Fotos (", ctx_r1.fotos.length, ")");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx_r1.fotos.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedMatriz.permiteAudio);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedMatriz.permiteAudio && ctx_r1.audios.length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.selectedMatriz.permiteAudio && !ctx_r1.podeGravarAudio);
  }
}
function VistoriaIrregularidadePage_ion_footer_22_ion_spinner_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "ion-spinner", 31);
  }
}
function VistoriaIrregularidadePage_ion_footer_22_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, "Salvar irregularidade");
    \u0275\u0275elementEnd();
  }
}
function VistoriaIrregularidadePage_ion_footer_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "ion-footer")(1, "ion-toolbar")(2, "div", 63)(3, "ion-button", 64);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_ion_footer_22_Template_ion_button_click_3_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.salvarIrregularidade());
    });
    \u0275\u0275template(4, VistoriaIrregularidadePage_ion_footer_22_ion_spinner_4_Template, 1, 0, "ion-spinner", 65)(5, VistoriaIrregularidadePage_ion_footer_22_span_5_Template, 2, 0, "span", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "ion-button", 66);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_ion_footer_22_Template_ion_button_click_6_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.voltar());
    });
    \u0275\u0275element(7, "ion-icon", 67);
    \u0275\u0275text(8, " Voltar ");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.saving || !ctx_r1.selectedMatriz || ctx_r1.gravandoAudio || ctx_r1.gravacaoPreparando);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.saving);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.gravandoAudio || ctx_r1.gravacaoPreparando);
  }
}
function VistoriaIrregularidadePage_div_23_p_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "- Nenhuma foto");
    \u0275\u0275elementEnd();
  }
}
function VistoriaIrregularidadePage_div_23_div_33_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 75)(1, "img", 76);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_23_div_33_div_1_Template_img_click_1_listener() {
      const foto_r17 = \u0275\u0275restoreView(_r16).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.abrirPreviewImagemRegistro(foto_r17.src, foto_r17.nomeArquivo));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const foto_r17 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", foto_r17.src, \u0275\u0275sanitizeUrl)("alt", foto_r17.nomeArquivo);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(foto_r17.nomeArquivo);
  }
}
function VistoriaIrregularidadePage_div_23_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_23_div_33_div_1_Template, 4, 3, "div", 74);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.registroVisualizacao.fotos);
  }
}
function VistoriaIrregularidadePage_div_23_p_38_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "- Nenhum \xE1udio");
    \u0275\u0275elementEnd();
  }
}
function VistoriaIrregularidadePage_div_23_div_39_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 78)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "audio", 79);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const audio_r18 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(audio_r18.nomeArquivo);
    \u0275\u0275advance();
    \u0275\u0275property("src", audio_r18.src, \u0275\u0275sanitizeUrl);
  }
}
function VistoriaIrregularidadePage_div_23_div_39_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275template(1, VistoriaIrregularidadePage_div_23_div_39_div_1_Template, 4, 2, "div", 77);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.registroVisualizacao.audios);
  }
}
function VistoriaIrregularidadePage_div_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 68)(1, "div", 69)(2, "h2");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p")(5, "strong");
    \u0275\u0275text(6, "Data do registro:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p")(9, "strong");
    \u0275\u0275text(10, "Vistoriador:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p")(13, "strong");
    \u0275\u0275text(14, "\xC1rea:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "p")(17, "strong");
    \u0275\u0275text(18, "Componente:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p")(21, "strong");
    \u0275\u0275text(22, "Sintoma:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "p")(25, "strong");
    \u0275\u0275text(26, "Observa\xE7\xE3o:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 70)(29, "p")(30, "strong");
    \u0275\u0275text(31);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(32, VistoriaIrregularidadePage_div_23_p_32_Template, 2, 0, "p", 18)(33, VistoriaIrregularidadePage_div_23_div_33_Template, 2, 1, "div", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div", 70)(35, "p")(36, "strong");
    \u0275\u0275text(37);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(38, VistoriaIrregularidadePage_div_23_p_38_Template, 2, 0, "p", 18)(39, VistoriaIrregularidadePage_div_23_div_39_Template, 2, 1, "div", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "ion-button", 72);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_23_Template_ion_button_click_40_listener() {
      \u0275\u0275restoreView(_r15);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharVisualizacaoRegistro());
    });
    \u0275\u0275text(41, "OK");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Registro ", ctx_r1.registroVisualizacao.numero);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.registroVisualizacao.dataRegistro);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.registroVisualizacao.vistoriador);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.registroVisualizacao.area);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.registroVisualizacao.componente);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.registroVisualizacao.sintoma);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.registroVisualizacao.observacao);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Fotos (", ctx_r1.registroVisualizacao.fotos.length, "):");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.registroVisualizacao.fotos.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.registroVisualizacao.fotos.length > 0);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("\xC1udios (", ctx_r1.registroVisualizacao.audios.length, "):");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.registroVisualizacao.audios.length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.registroVisualizacao.audios.length > 0);
  }
}
function VistoriaIrregularidadePage_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 80)(1, "div", 81)(2, "p", 82);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "ion-button", 83);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_24_Template_ion_button_click_4_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharPreviewImagemRegistro());
    });
    \u0275\u0275text(5, "Fechar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 84);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_24_Template_div_click_6_listener() {
      \u0275\u0275restoreView(_r19);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.fecharPreviewImagemRegistro());
    });
    \u0275\u0275elementStart(7, "img", 85);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_24_Template_img_click_7_listener($event) {
      \u0275\u0275restoreView(_r19);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.previewImagemRegistroNome);
    \u0275\u0275advance(4);
    \u0275\u0275property("src", ctx_r1.previewImagemRegistroSrc, \u0275\u0275sanitizeUrl);
  }
}
function VistoriaIrregularidadePage_div_25_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "h1", 88);
    \u0275\u0275text(2, "Preparando grava\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 89);
    \u0275\u0275text(4, "Aguarde enquanto o microfone \xE9 ativado.");
    \u0275\u0275elementEnd();
    \u0275\u0275element(5, "ion-spinner", 90);
    \u0275\u0275elementContainerEnd();
  }
}
function VistoriaIrregularidadePage_div_25_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "h1", 88);
    \u0275\u0275text(2, "Gravando \xE1udio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 89);
    \u0275\u0275text(4, "Fale pr\xF3ximo ao microfone. Toque em finalizar para salvar na lista.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 91);
    \u0275\u0275element(6, "span", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 93);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 94);
    \u0275\u0275text(10, "Dura\xE7\xE3o");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 95)(12, "ion-button", 96);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_25_ng_container_3_Template_ion_button_click_12_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.finalizarGravacaoModal());
    });
    \u0275\u0275text(13, " Parar e salvar \xE1udio ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "ion-button", 97);
    \u0275\u0275listener("click", function VistoriaIrregularidadePage_div_25_ng_container_3_Template_ion_button_click_14_listener() {
      \u0275\u0275restoreView(_r20);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.descartarGravacaoModal());
    });
    \u0275\u0275text(15, " Descartar grava\xE7\xE3o ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r1.tempoGravacaoFormatado);
  }
}
function VistoriaIrregularidadePage_div_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 86)(1, "div", 87);
    \u0275\u0275template(2, VistoriaIrregularidadePage_div_25_ng_container_2_Template, 6, 0, "ng-container", 18)(3, VistoriaIrregularidadePage_div_25_ng_container_3_Template, 16, 1, "ng-container", 18);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.gravacaoPreparando);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r1.gravacaoPreparando);
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
  cdr = inject(ChangeDetectorRef);
  observacaoInput;
  areaId = "";
  componenteId = "";
  areaNome = "";
  componenteNome = "";
  matriz = [];
  pendentesParaComponente = [];
  selectedMatriz = null;
  irregularidadeEmEdicaoId = null;
  irregularidadeEmEdicaoNumero = null;
  observacao = "";
  fotos = [];
  audios = [];
  audiosExistentesCount = 0;
  irregularidadesDaVistoria = [];
  cacheMidiasRegistros = /* @__PURE__ */ new Map();
  registroVisualizacao = null;
  exibirRegistroVisualizacao = false;
  previewImagemRegistroSrc = null;
  previewImagemRegistroNome = null;
  registroPreviewAudioUrls = /* @__PURE__ */ new Set();
  audioBase64;
  audioMimeType;
  audioDurationMs;
  gravandoAudio = false;
  /** Modal aberto antes do native concluir startRecording (evita tela “muda” sem feedback). */
  gravacaoPreparando = false;
  exibirModalGravacaoAudio = false;
  tempoGravacaoSegundos = 0;
  audioTimerId = null;
  audioObjectUrls = /* @__PURE__ */ new Set();
  podeGravarAudio = true;
  loading = false;
  saving = false;
  errorMessage = "";
  /** Mensagem de validação contextual para o texto «Descreva o problema» (acesso: aria-describedby). */
  observacaoFieldError = "";
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
  get canViewHistoricoVeiculo() {
    return this.authService.hasPermission("vistoria_web_historico_veiculo:read");
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
  get tempoGravacaoFormatado() {
    const s = this.tempoGravacaoSegundos;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
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
        if (!(yield this.validarSemGravacaoAtiva("voltar"))) {
          return;
        }
        if (this.temDadosNaoSalvos()) {
          const confirmarSaida = yield this.confirmarPerdaAlteracoes();
          if (!confirmarSaida) {
            return;
          }
        }
        this.selectedMatriz = null;
        this.irregularidadeEmEdicaoId = null;
        this.irregularidadeEmEdicaoNumero = null;
        this.limparMidiasEmMemoria();
      } else {
        this.limparMidiasEmMemoria();
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
        yield this.precarregarMidiasRegistrosExistentes();
      } catch {
        this.errorMessage = "Erro ao carregar sintomas.";
      } finally {
        this.loading = false;
        void this.verificarCapacidadeAudio();
      }
    });
  }
  ngOnDestroy() {
    if (this.gravandoAudio || this.gravacaoPreparando) {
      void VoiceRecorder.stopRecording().catch(() => void 0);
    }
    this.exibirModalGravacaoAudio = false;
    this.gravacaoPreparando = false;
    this.gravandoAudio = false;
    this.limparMidiasEmMemoria();
  }
  isSintomaSelected(item) {
    return this.selectedMatriz != null && this.selectedMatriz.id === item.id;
  }
  isIrregularidadeJaRegistrada(item) {
    return this.irregularidadesDaVistoria.some((ir) => ir.idsintoma === item.idSintoma);
  }
  temPendenteAnterior(item) {
    return this.pendentesParaComponente.some((p) => p.idsintoma === item.idSintoma);
  }
  quantidadePendenciasAnteriores(item) {
    return this.obterPendenciasAnterioresDoSintoma(item).length;
  }
  selecionarSintoma(item) {
    return __async(this, null, function* () {
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
      if (!this.canViewHistoricoVeiculo) {
        return;
      }
      this.router.navigate(["/vistoria/pendencias-veiculo"], {
        state: { fromMenu: false }
      });
    });
  }
  visualizarRegistroPendente(item, event) {
    return __async(this, null, function* () {
      event?.stopPropagation();
      event?.preventDefault();
      const existente = yield this.selecionarRegistroPendente(item);
      if (!existente) {
        return;
      }
      const midias = yield this.carregarMidiasDoRegistro(existente);
      const numero = existente.numeroIrregularidade ? `#${existente.numeroIrregularidade}` : existente.id.slice(0, 8);
      const observacao = existente.observacao?.trim() ? existente.observacao.trim() : "Sem observa\xE7\xE3o informada";
      this.revogarPreviewsRegistroVisualizacao();
      const fotos = midias.fotos.map((foto) => ({
        nomeArquivo: foto.nomeArquivo,
        src: `data:${this.getMimeTypeFromFilename(foto.nomeArquivo)};base64,${foto.dadosBase64}`
      }));
      const audios = midias.audios.map((audio) => {
        const src = this.criarPreviewAudioBlobUrl(audio.base64, audio.mimeType);
        this.registroPreviewAudioUrls.add(src);
        return {
          nomeArquivo: audio.nomeArquivo,
          src
        };
      });
      this.registroVisualizacao = {
        numero,
        dataRegistro: this.formatarDataHoraRegistro(existente.atualizadoEm),
        vistoriador: existente.vistoriadorNome?.trim() || "N\xE3o informado",
        area: this.areaNome,
        componente: this.componenteNome,
        sintoma: item.sintoma?.descricao ?? existente.descricaoSintoma ?? "-",
        observacao,
        fotos,
        audios
      };
      this.exibirRegistroVisualizacao = true;
    });
  }
  obterPendenciasAnterioresDoSintoma(item) {
    return this.pendentesParaComponente.filter((ir) => ir.idsintoma === item.idSintoma).sort((a, b) => {
      const dataA = new Date(a.atualizadoEm).getTime();
      const dataB = new Date(b.atualizadoEm).getTime();
      return dataB - dataA;
    });
  }
  selecionarRegistroPendente(item) {
    return __async(this, null, function* () {
      const pendencias = this.obterPendenciasAnterioresDoSintoma(item);
      if (pendencias.length === 0) {
        return null;
      }
      if (pendencias.length === 1) {
        return pendencias[0];
      }
      const alert = yield this.alertController.create({
        header: `Pend\xEAncias anteriores (${pendencias.length})`,
        message: "Selecione qual irregularidade deseja visualizar.",
        inputs: pendencias.map((registro, index) => ({
          type: "radio",
          label: this.montarRotuloRegistroPendente(registro),
          value: registro.id,
          checked: index === 0
        })),
        buttons: [
          { text: "Cancelar", role: "cancel" },
          { text: "Visualizar", role: "confirm" }
        ]
      });
      yield alert.present();
      const { role, data } = yield alert.onDidDismiss();
      if (role !== "confirm") {
        return null;
      }
      const selectedValue = typeof data?.values === "string" ? data.values : data?.values?.toString?.() ?? "";
      return pendencias.find((registro) => registro.id === selectedValue) ?? pendencias[0];
    });
  }
  montarRotuloRegistroPendente(registro) {
    const numero = registro.numeroIrregularidade ? `#${registro.numeroIrregularidade}` : registro.id.slice(0, 8);
    const data = this.formatarDataHoraRegistro(registro.atualizadoEm);
    const vistoriador = registro.vistoriadorNome?.trim() || "N\xE3o informado";
    return `${numero} \u2022 ${data} \u2022 ${vistoriador}`;
  }
  formatarDataHoraRegistro(value) {
    const date = this.parseDataRegistro(value);
    if (!date) {
      return "-";
    }
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  parseDataRegistro(value) {
    if (!value) {
      return null;
    }
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) {
      return isoDate;
    }
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) {
      return null;
    }
    const [, year, month, day, hour, minute, second] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second ?? 0));
  }
  carregarMidiasDoRegistro(irregularidade) {
    return __async(this, null, function* () {
      const irregularidadeId = irregularidade.id;
      const cached = this.cacheMidiasRegistros.get(irregularidadeId);
      if (cached) {
        return cached;
      }
      const vistoriaId = irregularidade.idvistoria ?? this.flowService.getVistoriaId();
      if (!vistoriaId) {
        return { fotos: [], audios: [] };
      }
      const [imagensResumo, audiosResumo] = yield Promise.all([
        this.vistoriaService.listarIrregularidadesImagens(vistoriaId, irregularidadeId),
        this.vistoriaService.listarIrregularidadesAudios(vistoriaId, irregularidadeId)
      ]);
      const imagensItem = imagensResumo.find((i) => i.idirregularidade === irregularidadeId);
      const audiosItem = audiosResumo.find((a) => a.idirregularidade === irregularidadeId);
      const resultado = {
        fotos: (imagensItem?.imagens ?? []).map((img) => ({
          nomeArquivo: img.nomeArquivo,
          tamanho: Number(img.tamanho) || 0,
          dadosBase64: img.dadosBase64
        })),
        audios: (audiosItem?.audios ?? []).map((audio) => ({
          id: audio.id,
          nomeArquivo: audio.nomeArquivo,
          base64: audio.dadosBase64,
          mimeType: audio.mimeType || "audio/m4a",
          previewUrl: void 0,
          durationMs: audio.duracaoMs ?? void 0
        }))
      };
      this.cacheMidiasRegistros.set(irregularidadeId, resultado);
      return resultado;
    });
  }
  precarregarMidiasRegistrosExistentes() {
    return __async(this, null, function* () {
      const registros = [...this.irregularidadesDaVistoria, ...this.pendentesParaComponente];
      if (registros.length === 0) {
        return;
      }
      yield Promise.all(registros.map((irregularidade) => this.carregarMidiasDoRegistro(irregularidade).catch(() => ({
        fotos: [],
        audios: []
      }))));
    });
  }
  adicionarFoto() {
    return __async(this, null, function* () {
      const photo = yield Camera2.getPhoto({
        quality: 60,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        allowEditing: false,
        width: 1024,
        height: 1024,
        correctOrientation: true
      });
      if (!photo.base64String) {
        return;
      }
      const base64 = photo.base64String;
      const imageIndex = this.fotos.length + 1;
      const nomeArquivo = `img${imageIndex}.jpg`;
      const tamanho = this.estimateBase64Size(base64);
      this.fotos.push({
        nomeArquivo,
        tamanho,
        dadosBase64: base64
      });
    });
  }
  removerFoto(index) {
    void this.confirmarRemocaoMidia("foto", () => {
      this.fotos.splice(index, 1);
    });
  }
  abrirGravacaoAudio() {
    return __async(this, null, function* () {
      if (this.gravandoAudio || this.gravacaoPreparando) {
        return;
      }
      this.errorMessage = "";
      this.gravacaoPreparando = true;
      this.exibirModalGravacaoAudio = true;
      this.cdr.detectChanges();
      yield this.agendarReflowUI();
      try {
        const permission = yield VoiceRecorder.hasAudioRecordingPermission();
        if (!permission.value) {
          const request = yield VoiceRecorder.requestAudioRecordingPermission();
          if (!request.value) {
            this.errorMessage = "Permiss\xE3o de \xE1udio negada.";
            this.fecharFluxoGravacaoSemSalvar();
            return;
          }
        }
        yield VoiceRecorder.startRecording();
        this.gravacaoPreparando = false;
        this.gravandoAudio = true;
        this.iniciarContadorGravacao();
        this.cdr.detectChanges();
      } catch {
        this.errorMessage = "N\xE3o foi poss\xEDvel iniciar a grava\xE7\xE3o.";
        this.fecharFluxoGravacaoSemSalvar();
      }
    });
  }
  finalizarGravacaoModal() {
    return __async(this, null, function* () {
      if (this.gravacaoPreparando) {
        return;
      }
      if (!this.gravandoAudio) {
        this.exibirModalGravacaoAudio = false;
        return;
      }
      try {
        const result = yield VoiceRecorder.stopRecording();
        if (result.value?.recordDataBase64) {
          const audioIndex = this.audios.length + 1;
          const nomeArquivo = `audio${audioIndex}.m4a`;
          const mime = result.value.mimeType ?? "audio/m4a";
          this.audios.push({
            nomeArquivo,
            base64: result.value.recordDataBase64,
            mimeType: mime,
            previewUrl: this.criarPreviewAudioBlobUrl(result.value.recordDataBase64, mime),
            durationMs: result.value.msDuration
          });
        } else {
          this.errorMessage = "N\xE3o foi poss\xEDvel obter o \xE1udio gravado.";
        }
        this.audioBase64 = void 0;
        this.audioMimeType = void 0;
        this.audioDurationMs = void 0;
      } catch {
        this.errorMessage = "N\xE3o foi poss\xEDvel finalizar a grava\xE7\xE3o.";
      } finally {
        this.gravandoAudio = false;
        this.gravacaoPreparando = false;
        this.exibirModalGravacaoAudio = false;
        this.pararContadorGravacao();
        this.cdr.detectChanges();
      }
    });
  }
  descartarGravacaoModal() {
    return __async(this, null, function* () {
      if (this.gravacaoPreparando) {
        return;
      }
      const alert = yield this.alertController.create({
        header: "Descartar grava\xE7\xE3o?",
        message: "O \xE1udio em andamento n\xE3o ser\xE1 salvo.",
        buttons: [
          { text: "Continuar gravando", role: "cancel" },
          { text: "Descartar", role: "confirm" }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role !== "confirm") {
        return;
      }
      try {
        yield VoiceRecorder.stopRecording();
      } catch {
      }
      this.audioBase64 = void 0;
      this.audioMimeType = void 0;
      this.audioDurationMs = void 0;
      this.gravandoAudio = false;
      this.gravacaoPreparando = false;
      this.exibirModalGravacaoAudio = false;
      this.pararContadorGravacao();
      this.cdr.detectChanges();
    });
  }
  limparAudio() {
    this.audioBase64 = void 0;
    this.audioMimeType = void 0;
    this.audioDurationMs = void 0;
  }
  removerAudio(index) {
    void this.confirmarRemocaoMidia("audio", () => {
      const previewUrl = this.audios[index]?.previewUrl;
      this.revogarPreviewAudio(previewUrl);
      this.audios.splice(index, 1);
    });
  }
  confirmarRemocaoMidia(tipo, onConfirm) {
    return __async(this, null, function* () {
      const label = tipo === "foto" ? "foto" : "\xE1udio";
      const alert = yield this.alertController.create({
        header: `Excluir ${label}?`,
        message: `Deseja realmente excluir este ${label} da irregularidade?`,
        buttons: [
          { text: "Cancelar", role: "cancel" },
          {
            text: "Excluir",
            role: "confirm",
            cssClass: "danger"
          }
        ]
      });
      yield alert.present();
      const { role } = yield alert.onDidDismiss();
      if (role === "confirm") {
        onConfirm();
      }
    });
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
  onObservacaoInput(value) {
    this.observacao = value ?? "";
    if (this.observacaoFieldError) {
      this.observacaoFieldError = "";
    }
    this.errorMessage = "";
  }
  salvarIrregularidade() {
    return __async(this, null, function* () {
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId || !this.selectedMatriz) {
        this.observacaoFieldError = "";
        this.errorMessage = "Selecione um sintoma.";
        return;
      }
      const observacaoTrim = this.observacao.trim();
      if (!observacaoTrim) {
        this.observacaoFieldError = "Descreva o problema com texto objetivo antes de salvar \u2014 o campo n\xE3o pode ficar em branco ou s\xF3 com espa\xE7os.";
        yield this.agendarReflowUI();
        yield this.observacaoInput?.setFocus();
        return;
      }
      this.observacaoFieldError = "";
      if (this.selectedMatriz.exigeFoto && this.fotos.length === 0) {
        this.errorMessage = "Foto obrigat\xF3ria para este sintoma.";
        return;
      }
      this.saving = true;
      this.errorMessage = "";
      try {
        if (!(yield this.validarSemGravacaoAtiva("salvar"))) {
          return;
        }
        let irregularidadeId = this.irregularidadeEmEdicaoId;
        let numeroIrregularidade = this.irregularidadeEmEdicaoNumero;
        if (irregularidadeId) {
          yield this.vistoriaService.atualizarIrregularidade(irregularidadeId, {
            observacao: observacaoTrim
          });
        } else {
          const irregularidade = yield this.vistoriaService.criarIrregularidade(vistoriaId, {
            idarea: this.areaId,
            idcomponente: this.componenteId,
            idsintoma: this.selectedMatriz.idSintoma,
            observacao: observacaoTrim
          });
          irregularidadeId = irregularidade.id;
          numeroIrregularidade = irregularidade.numeroIrregularidade ?? null;
        }
        if (!numeroIrregularidade) {
          const irregularidades = yield this.vistoriaService.listarIrregularidades(vistoriaId);
          numeroIrregularidade = irregularidades.find((item) => item.id === irregularidadeId)?.numeroIrregularidade ?? null;
        }
        if (!numeroIrregularidade) {
          this.errorMessage = "Nao foi possivel obter o numero da irregularidade para nomear as midias.";
          return;
        }
        if (this.fotos.length > 0) {
          const files = this.fotos.map((foto, index) => ({
            nomeArquivo: `${numeroIrregularidade}_img${index + 1}.jpg`,
            blob: this.base64ToBlob(foto.dadosBase64)
          }));
          yield this.vistoriaService.uploadIrregularidadeImagens(irregularidadeId, files);
        }
        if (this.selectedMatriz.permiteAudio) {
          yield this.vistoriaService.removerAudiosIrregularidade(irregularidadeId);
          for (let i = 0; i < this.audios.length; i++) {
            const a = this.audios[i];
            const blob = this.base64ToBlob(a.base64, a.mimeType);
            yield this.vistoriaService.uploadIrregularidadeAudio(irregularidadeId, blob, `${numeroIrregularidade}_audio${i + 1}.m4a`, a.durationMs);
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
  validarSemGravacaoAtiva(acao) {
    return __async(this, null, function* () {
      if (!this.gravandoAudio && !this.gravacaoPreparando) {
        return true;
      }
      const alert = yield this.alertController.create({
        header: "Gravacao em andamento",
        message: this.gravacaoPreparando ? "Aguarde o microfone iniciar no modal de grava\xE7\xE3o." : acao === "salvar" ? "Para salvar, finalize o \xE1udio no modal (Parar e salvar)." : "Para voltar, finalize o \xE1udio no modal (Parar e salvar ou Descartar).",
        backdropDismiss: false,
        buttons: [{ text: "Entendi", role: "confirm" }]
      });
      yield alert.present();
      yield alert.onDidDismiss();
      return false;
    });
  }
  fecharFluxoGravacaoSemSalvar() {
    this.gravacaoPreparando = false;
    this.gravandoAudio = false;
    this.exibirModalGravacaoAudio = false;
    this.pararContadorGravacao();
    this.cdr.detectChanges();
  }
  agendarReflowUI() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 0);
    });
  }
  carregarIrregularidadeExistente(item) {
    return __async(this, null, function* () {
      this.irregularidadeEmEdicaoId = null;
      this.irregularidadeEmEdicaoNumero = null;
      this.observacao = "";
      this.fotos = [];
      this.revogarTodosPreviewsAudio();
      this.audios = [];
      this.audiosExistentesCount = 0;
      const existente = this.irregularidadesDaVistoria.find((ir) => ir.idsintoma === item.idSintoma);
      if (!existente)
        return;
      this.irregularidadeEmEdicaoId = existente.id;
      this.irregularidadeEmEdicaoNumero = existente.numeroIrregularidade ?? null;
      this.observacao = existente.observacao ?? "";
      const vistoriaId = this.flowService.getVistoriaId();
      if (!vistoriaId)
        return;
      const [imagensResumo, audiosResumo] = yield Promise.all([
        this.vistoriaService.listarIrregularidadesImagens(vistoriaId, existente.id),
        this.vistoriaService.listarIrregularidadesAudios(vistoriaId, existente.id)
      ]);
      this.preencherImagensExistentes(imagensResumo, existente.id);
      this.preencherAudiosExistentes(audiosResumo, existente.id);
    });
  }
  preencherImagensExistentes(imagensResumo, irregularidadeId) {
    const item = imagensResumo.find((i) => i.idirregularidade === irregularidadeId);
    const imagens = item?.imagens ?? [];
    this.fotos = imagens.map((img) => {
      return {
        nomeArquivo: img.nomeArquivo,
        tamanho: Number(img.tamanho) || 0,
        dadosBase64: img.dadosBase64
      };
    });
  }
  preencherAudiosExistentes(audiosResumo, irregularidadeId) {
    this.revogarTodosPreviewsAudio();
    const item = audiosResumo.find((a) => a.idirregularidade === irregularidadeId);
    const audios = item?.audios ?? [];
    this.audios = audios.map((audio) => ({
      id: audio.id,
      nomeArquivo: audio.nomeArquivo,
      base64: audio.dadosBase64,
      mimeType: audio.mimeType || "audio/m4a",
      previewUrl: this.criarPreviewAudioBlobUrl(audio.dadosBase64, audio.mimeType || "audio/m4a"),
      durationMs: audio.duracaoMs ?? void 0
    }));
    this.audiosExistentesCount = this.audios.length;
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
  criarPreviewAudioBlobUrl(base64, mimeType) {
    const blob = this.base64ToBlob(base64, mimeType || "audio/m4a");
    const url = URL.createObjectURL(blob);
    this.audioObjectUrls.add(url);
    return url;
  }
  revogarPreviewAudio(url) {
    if (!url)
      return;
    URL.revokeObjectURL(url);
    this.audioObjectUrls.delete(url);
  }
  revogarTodosPreviewsAudio() {
    for (const url of this.audioObjectUrls) {
      URL.revokeObjectURL(url);
    }
    this.audioObjectUrls.clear();
  }
  revogarPreviewsRegistroVisualizacao() {
    for (const url of this.registroPreviewAudioUrls) {
      this.revogarPreviewAudio(url);
    }
    this.registroPreviewAudioUrls.clear();
  }
  limparMidiasEmMemoria() {
    this.observacao = "";
    this.fotos = [];
    this.revogarTodosPreviewsAudio();
    this.audios = [];
    this.audiosExistentesCount = 0;
    this.audioBase64 = void 0;
    this.audioMimeType = void 0;
    this.audioDurationMs = void 0;
    this.registroVisualizacao = null;
    this.exibirRegistroVisualizacao = false;
    this.revogarPreviewsRegistroVisualizacao();
    this.cacheMidiasRegistros.clear();
    this.pararContadorGravacao();
  }
  fecharVisualizacaoRegistro() {
    this.exibirRegistroVisualizacao = false;
    this.registroVisualizacao = null;
    this.revogarPreviewsRegistroVisualizacao();
    this.fecharPreviewImagemRegistro();
  }
  abrirPreviewImagemRegistro(src, nomeArquivo) {
    this.previewImagemRegistroSrc = src;
    this.previewImagemRegistroNome = nomeArquivo;
  }
  fecharPreviewImagemRegistro() {
    this.previewImagemRegistroSrc = null;
    this.previewImagemRegistroNome = null;
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
  }, decls: 26, vars: 13, consts: [["observacaoInput", ""], [3, "translucent"], ["slot", "start"], ["menu", "main-menu"], ["slot", "end"], ["class", "resumo-btn", "fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 3, "click", 4, "ngIf"], ["fill", "solid", "color", "medium", "aria-label", "Resumo da vistoria", 1, "resumo-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round", "aria-hidden", "true"], ["d", "m3 17 2 2 4-4"], ["d", "m3 7 2 2 4-4"], ["d", "M13 6h8"], ["d", "M13 12h8"], ["d", "M13 18h8"], [3, "fullscreen"], ["class", "selected-context", 4, "ngIf"], ["class", "content", 4, "ngIf"], ["color", "danger", 4, "ngIf"], ["class", "content sheet-context", 4, "ngIf"], [4, "ngIf"], ["class", "registro-overlay", 4, "ngIf"], ["class", "preview-imagem-overlay", 4, "ngIf"], ["class", "gravacao-audio-overlay", "role", "dialog", "aria-modal", "true", "aria-labelledby", "gravacao-audio-titulo-el", 4, "ngIf"], ["fill", "solid", "color", "medium", "aria-label", "Pendencias de outras vistorias", 1, "resumo-btn", 3, "click"], ["x", "8", "y", "2", "width", "8", "height", "4", "rx", "1"], ["d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["d", "M9 12h6"], ["d", "M9 16h6"], [1, "selected-context"], [1, "context-card"], ["class", "context-card", 4, "ngIf"], [1, "content"], ["name", "crescent"], ["color", "danger"], [1, "error-message"], [1, "content", "sheet-context"], [1, "cards-selection-title"], [1, "cards-container"], [3, "level-card", "level-card--selected", "click", 4, "ngFor", "ngForOf"], [3, "click"], ["class", "pendencia-anterior-info", 4, "ngIf"], ["size", "small", "fill", "outline", "color", "primary", 3, "click", 4, "ngIf"], ["color", "primary"], [1, "pendencia-anterior-info"], ["color", "warning"], ["size", "small", "fill", "outline", "color", "primary", 3, "click"], ["color", "primary", 4, "ngIf"], ["lines", "full", 1, "item-descricao-problema"], ["position", "stacked"], [1, "label-required"], ["placeholder", "Descreva o problema", "inputmode", "text", 3, "ionInput", "value"], ["role", "alert", "color", "danger", "id", "erro-desc-problema", 4, "ngIf"], ["lines", "none"], ["fill", "outline", 3, "click"], ["slot", "start", "name", "camera-outline"], ["lines", "none", 4, "ngIf"], ["role", "alert", "color", "danger", "id", "erro-desc-problema"], [1, "campo-descricao-erro"], [4, "ngFor", "ngForOf"], ["alt", "Foto", 3, "src"], ["slot", "end", "fill", "clear", "color", "danger", 3, "click"], ["slot", "icon-only", "name", "trash-outline"], ["slot", "end", "fill", "outline", 3, "click", "disabled"], ["controls", "", "preload", "none", 1, "audio-player", 3, "src"], [1, "footer-actions"], [1, "btn-main", 3, "click", "disabled"], ["name", "crescent", 4, "ngIf"], ["fill", "outline", "color", "medium", 1, "btn-voltar", 3, "click", "disabled"], ["slot", "start", "src", "/icons/corner-up-left.svg", "aria-hidden", "true"], [1, "registro-overlay"], [1, "registro-card"], [1, "registro-midias-bloco"], ["class", "registro-fotos-grid", 4, "ngIf"], ["expand", "block", 3, "click"], [1, "registro-fotos-grid"], ["class", "registro-foto-item", 4, "ngFor", "ngForOf"], [1, "registro-foto-item"], [1, "registro-foto-preview", 3, "click", "src", "alt"], ["class", "registro-audio-item", 4, "ngFor", "ngForOf"], [1, "registro-audio-item"], ["controls", "", "preload", "none", 3, "src"], [1, "preview-imagem-overlay"], [1, "preview-imagem-topbar"], [1, "preview-imagem-nome"], ["size", "small", 3, "click"], [1, "preview-imagem-body", 3, "click"], ["alt", "Preview da imagem", 1, "preview-imagem-full", 3, "click", "src"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "gravacao-audio-titulo-el", 1, "gravacao-audio-overlay"], [1, "gravacao-audio-panel"], ["id", "gravacao-audio-titulo-el", 1, "gravacao-audio-titulo"], [1, "gravacao-audio-sub"], ["name", "crescent", 1, "gravacao-audio-spinner"], ["aria-hidden", "true", 1, "gravacao-audio-pulse-wrap"], [1, "gravacao-audio-pulse"], ["aria-live", "polite", 1, "gravacao-audio-timer"], [1, "gravacao-audio-legenda"], [1, "gravacao-audio-botoes"], ["expand", "block", "color", "danger", 3, "click"], ["expand", "block", "fill", "outline", "color", "medium", 3, "click"]], template: function VistoriaIrregularidadePage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "ion-header", 1)(1, "ion-toolbar")(2, "ion-buttons", 2);
      \u0275\u0275element(3, "ion-menu-button", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "ion-title");
      \u0275\u0275text(5, "Sintomas");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "ion-buttons", 4);
      \u0275\u0275template(7, VistoriaIrregularidadePage_ion_button_7_Template, 6, 0, "ion-button", 5);
      \u0275\u0275elementStart(8, "ion-button", 6);
      \u0275\u0275listener("click", function VistoriaIrregularidadePage_Template_ion_button_click_8_listener() {
        return ctx.abrirResumoVistoria();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(9, "svg", 7);
      \u0275\u0275element(10, "path", 8)(11, "path", 9)(12, "path", 10)(13, "path", 11)(14, "path", 12);
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(15, "ion-content", 13);
      \u0275\u0275template(16, VistoriaIrregularidadePage_div_16_Template, 22, 5, "div", 14)(17, VistoriaIrregularidadePage_div_17_Template, 4, 0, "div", 15)(18, VistoriaIrregularidadePage_ion_text_18_Template, 3, 1, "ion-text", 16)(19, VistoriaIrregularidadePage_div_19_Template, 5, 1, "div", 17)(20, VistoriaIrregularidadePage_div_20_Template, 3, 0, "div", 15)(21, VistoriaIrregularidadePage_div_21_Template, 20, 13, "div", 15);
      \u0275\u0275elementEnd();
      \u0275\u0275template(22, VistoriaIrregularidadePage_ion_footer_22_Template, 9, 4, "ion-footer", 18)(23, VistoriaIrregularidadePage_div_23_Template, 42, 13, "div", 19)(24, VistoriaIrregularidadePage_div_24_Template, 8, 2, "div", 20)(25, VistoriaIrregularidadePage_div_25_Template, 4, 2, "div", 21);
    }
    if (rf & 2) {
      \u0275\u0275property("translucent", true);
      \u0275\u0275advance(7);
      \u0275\u0275property("ngIf", ctx.canViewHistoricoVeiculo);
      \u0275\u0275advance(8);
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
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.exibirRegistroVisualizacao && ctx.registroVisualizacao);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.previewImagemRegistroSrc);
      \u0275\u0275advance();
      \u0275\u0275property("ngIf", ctx.exibirModalGravacaoAudio);
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
  ], styles: ["\n\nion-content[_ngcontent-%COMP%] {\n  --padding-bottom: 108px;\n}\nion-footer[_ngcontent-%COMP%] {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer[_ngcontent-%COMP%]   ion-toolbar[_ngcontent-%COMP%] {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar[_ngcontent-%COMP%] {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main[_ngcontent-%COMP%] {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n}\n.content.sheet-context[_ngcontent-%COMP%] {\n  align-items: stretch;\n}\n.cards-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n}\n.level-card[_ngcontent-%COMP%] {\n  margin: 0;\n  cursor: pointer;\n  --background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  transition:\n    transform 120ms ease,\n    box-shadow 120ms ease,\n    filter 120ms ease;\n}\n.level-card[_ngcontent-%COMP%]:active {\n  transform: scale(0.99);\n  box-shadow: 0 1px 4px rgba(25, 88, 191, 0.16);\n  filter: brightness(0.98);\n}\n.level-card[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid #1d4ed8;\n  outline-offset: 2px;\n}\n.level-card--selected[_ngcontent-%COMP%] {\n  --background: #e7f2ff;\n  border: 1px solid var(--ion-color-primary);\n}\n.level-card[_ngcontent-%COMP%]   ion-card-header[_ngcontent-%COMP%] {\n  padding: 16px 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-title[_ngcontent-%COMP%] {\n  font-size: 1.15rem;\n  font-weight: 600;\n  color: #1d4ed8;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%] {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card[_ngcontent-%COMP%]   ion-card-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n}\n.cards-selection-title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-weight: 700;\n  color: #1d4ed8;\n}\n.pendencia-anterior-info[_ngcontent-%COMP%] {\n  margin-bottom: 6px !important;\n  font-weight: 600;\n}\n.vistoria-nr-bar[_ngcontent-%COMP%] {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context[_ngcontent-%COMP%] {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.context-card[_ngcontent-%COMP%] {\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  cursor: default;\n}\n.context-card[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: #0f172a;\n  font-weight: 700;\n  margin-right: 4px;\n}\n.context-card[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #334155;\n  word-break: break-word;\n}\n.error-message[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n}\n.item-descricao-problema[_ngcontent-%COMP%] {\n  --highlight-color-focused: var(--ion-color-primary);\n}\n.item-descricao-problema--erro[_ngcontent-%COMP%] {\n  --border-color: var(--ion-color-danger);\n  --highlight-color-invalid: var(--ion-color-danger);\n}\n.item-descricao-problema[_ngcontent-%COMP%]   ion-label[_ngcontent-%COMP%]   .label-required[_ngcontent-%COMP%] {\n  color: var(--ion-color-medium);\n  font-weight: 500;\n  font-size: 0.85em;\n}\n.campo-descricao-erro[_ngcontent-%COMP%] {\n  margin: 0 16px 8px;\n  font-size: 0.875rem;\n  line-height: 1.35;\n  color: var(--ion-color-danger);\n}\nion-item.is-selected[_ngcontent-%COMP%] {\n  --background: #e7f2ff;\n}\nimg[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.audio-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.audio-player[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: 6px;\n}\n.registro-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483645;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  background: rgba(2, 6, 23, 0.82);\n}\n.registro-card[_ngcontent-%COMP%] {\n  width: min(720px, 100%);\n  max-height: 90vh;\n  overflow: auto;\n  padding: 18px;\n  border-radius: 12px;\n  background: #ffffff;\n  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.35);\n}\n.registro-card[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 12px;\n  font-size: 1.15rem;\n}\n.registro-card[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 6px;\n}\n.registro-midias-bloco[_ngcontent-%COMP%] {\n  margin: 12px 0;\n}\n.registro-fotos-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 10px;\n}\n.registro-foto-item[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  font-size: 0.8rem;\n  word-break: break-word;\n}\n.registro-foto-preview[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 92px;\n  object-fit: cover;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n  margin-right: 0;\n}\n.registro-audio-item[_ngcontent-%COMP%] {\n  margin-bottom: 10px;\n  padding: 8px 10px;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n  background: #f8fafc;\n}\n.registro-audio-item[_ngcontent-%COMP%]   audio[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.preview-imagem-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483646;\n  display: flex;\n  flex-direction: column;\n  background: #020617;\n}\n.preview-imagem-topbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  padding: calc(10px + env(safe-area-inset-top)) 12px 10px;\n  border-bottom: 1px solid rgba(148, 163, 184, 0.25);\n}\n.preview-imagem-topbar[_ngcontent-%COMP%]   ion-button[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.preview-imagem-nome[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #e2e8f0;\n  font-size: 0.9rem;\n  font-weight: 600;\n  word-break: break-word;\n}\n.preview-imagem-body[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 14px;\n}\n.preview-imagem-full[_ngcontent-%COMP%] {\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: calc(100vh - 84px - env(safe-area-inset-top));\n  object-fit: contain;\n  border-radius: 8px;\n  margin-right: 0;\n}\n.gravacao-audio-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483646;\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: calc(12px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left));\n  background: #0f172a;\n  pointer-events: auto;\n  touch-action: none;\n  overflow: hidden;\n}\n.gravacao-audio-panel[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 16px 12px;\n  text-align: center;\n  color: #f8fafc;\n}\n.gravacao-audio-titulo[_ngcontent-%COMP%] {\n  margin: 0 0 8px;\n  font-size: 1.35rem;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}\n.gravacao-audio-sub[_ngcontent-%COMP%] {\n  margin: 0 0 28px;\n  font-size: 0.95rem;\n  line-height: 1.45;\n  color: #94a3b8;\n  max-width: 320px;\n}\n.gravacao-audio-pulse-wrap[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.gravacao-audio-pulse[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #ef4444;\n  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.55);\n  animation: _ngcontent-%COMP%_gravacao-pulse 1.4s ease-out infinite;\n}\n@keyframes _ngcontent-%COMP%_gravacao-pulse {\n  0% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45);\n  }\n  70% {\n    transform: scale(1.08);\n    box-shadow: 0 0 0 16px rgba(239, 68, 68, 0);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);\n  }\n}\n.gravacao-audio-timer[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 3.25rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.06em;\n  color: #ffffff;\n}\n.gravacao-audio-legenda[_ngcontent-%COMP%] {\n  margin: 4px 0 32px;\n  font-size: 0.8rem;\n  text-transform: uppercase;\n  letter-spacing: 0.12em;\n  color: #64748b;\n}\n.gravacao-audio-botoes[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 340px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.gravacao-audio-spinner[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  margin: 12px auto 0;\n  color: #93c5fd;\n}\n/*# sourceMappingURL=vistoria-irregularidade.page.css.map */"] });
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
      <ion-menu-button menu="main-menu"></ion-menu-button>
    </ion-buttons>
    <ion-title>Sintomas</ion-title>
    <ion-buttons slot="end">
      <ion-button
        *ngIf="canViewHistoricoVeiculo"
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
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <div class="selected-context" *ngIf="!loading">
    <div class="context-card">
      <strong>Vistoria:</strong>
      <span>{{ vistoriaNumero }}</span>
    </div>
    <div class="context-card">
      <strong>Ve\xEDculo:</strong>
      <span>{{ veiculoNumero }}</span>
    </div>
    <div class="context-card">
      <strong>\xC1rea:</strong>
      <span>{{ areaNome }}</span>
    </div>
    <div class="context-card">
      <strong>Componente:</strong>
      <span>{{ componenteNome }}</span>
    </div>
    <div class="context-card" *ngIf="selectedMatriz?.sintoma?.descricao">
      <strong>Sintoma:</strong>
      <span>{{ selectedMatriz?.sintoma?.descricao }}</span>
    </div>
  </div>

  <div class="content" *ngIf="loading">
    <ion-spinner name="crescent"></ion-spinner>
    <p>Carregando sintomas...</p>
  </div>

  <ion-text color="danger" *ngIf="errorMessage">
    <p class="error-message">{{ errorMessage }}</p>
  </ion-text>

  <div *ngIf="!loading && matriz.length > 0 && selectedMatriz === null" class="content sheet-context">
    <p class="cards-selection-title">Selecione um Sintoma:</p>
    <div class="cards-container">
      <ion-card
        *ngFor="let item of matriz"
        [class.level-card]="true"
        [class.level-card--selected]="isSintomaSelected(item)"
        [attr.tabindex]="0"
        (click)="selecionarSintoma(item)"
      >
        <ion-card-header>
          <ion-card-title>{{ item.sintoma?.descricao }}</ion-card-title>
        </ion-card-header>
        <ion-card-content *ngIf="isIrregularidadeJaRegistrada(item) || temPendenteAnterior(item)">
          <p *ngIf="isIrregularidadeJaRegistrada(item)">
            <ion-text color="primary">Irregularidade registrada nesta vistoria</ion-text>
          </p>
          <p *ngIf="temPendenteAnterior(item)" class="pendencia-anterior-info">
            <ion-text color="warning">
              Pend\xEAncia(s) Registrada(s): {{ quantidadePendenciasAnteriores(item) }}
            </ion-text>
          </p>
          <ion-button
            *ngIf="temPendenteAnterior(item)"
            size="small"
            fill="outline"
            color="primary"
            (click)="visualizarRegistroPendente(item, $event)"
          >
            Ver Pend\xEAncia(s)
          </ion-button>
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

    <ion-item
      class="item-descricao-problema"
      [class.item-descricao-problema--erro]="observacaoFieldError"
      lines="full"
    >
      <ion-label position="stacked">
        Descreva o problema
        <span class="label-required">(obrigat\xF3rio)</span>
      </ion-label>
      <ion-textarea
        #observacaoInput
        [value]="observacao"
        placeholder="Descreva o problema"
        inputmode="text"
        [attr.aria-required]="true"
        [attr.aria-invalid]="observacaoFieldError ? 'true' : null"
        [attr.aria-describedby]="observacaoFieldError ? 'erro-desc-problema' : null"
        (ionInput)="onObservacaoInput($event.detail.value ?? '')"
      ></ion-textarea>
    </ion-item>
    <ion-text
      *ngIf="observacaoFieldError"
      role="alert"
      color="danger"
      id="erro-desc-problema"
    >
      <p class="campo-descricao-erro">{{ observacaoFieldError }}</p>
    </ion-text>

    <ion-item lines="none">
      <ion-label>Fotos ({{ fotos.length }})</ion-label>
      <ion-button fill="outline" (click)="adicionarFoto()">
        <ion-icon slot="start" name="camera-outline"></ion-icon>
        Adicionar
      </ion-button>
    </ion-item>

    <ion-list *ngIf="fotos.length > 0">
      <ion-item *ngFor="let foto of fotos; let i = index">
        <img [src]="'data:image/jpeg;base64,' + foto.dadosBase64" alt="Foto" />
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
      </ion-label>
      <ion-button
        slot="end"
        fill="outline"
        (click)="abrirGravacaoAudio()"
        [disabled]="gravandoAudio || gravacaoPreparando || !podeGravarAudio"
      >
        Gravar \xE1udio
      </ion-button>
    </ion-item>

    <ion-list *ngIf="selectedMatriz.permiteAudio && audios.length > 0">
      <ion-item *ngFor="let a of audios; let i = index">
        <ion-label>
          <p>{{ a.nomeArquivo }}</p>
          <audio class="audio-player" [src]="a.previewUrl" controls preload="none"></audio>
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
    <div class="footer-actions">
      <ion-button
        class="btn-main"
        (click)="salvarIrregularidade()"
        [disabled]="saving || !selectedMatriz || gravandoAudio || gravacaoPreparando"
      >
        <ion-spinner *ngIf="saving" name="crescent"></ion-spinner>
        <span *ngIf="!saving">Salvar irregularidade</span>
      </ion-button>
      <ion-button
        class="btn-voltar"
        fill="outline"
        color="medium"
        (click)="voltar()"
        [disabled]="gravandoAudio || gravacaoPreparando"
      >
        <ion-icon slot="start" src="/icons/corner-up-left.svg" aria-hidden="true"></ion-icon>
        Voltar
      </ion-button>
    </div>
  </ion-toolbar>
</ion-footer>

<div class="registro-overlay" *ngIf="exibirRegistroVisualizacao && registroVisualizacao">
  <div class="registro-card">
    <h2>Registro {{ registroVisualizacao.numero }}</h2>
    <p><strong>Data do registro:</strong> {{ registroVisualizacao.dataRegistro }}</p>
    <p><strong>Vistoriador:</strong> {{ registroVisualizacao.vistoriador }}</p>
    <p><strong>\xC1rea:</strong> {{ registroVisualizacao.area }}</p>
    <p><strong>Componente:</strong> {{ registroVisualizacao.componente }}</p>
    <p><strong>Sintoma:</strong> {{ registroVisualizacao.sintoma }}</p>
    <p><strong>Observa\xE7\xE3o:</strong> {{ registroVisualizacao.observacao }}</p>

    <div class="registro-midias-bloco">
      <p><strong>Fotos ({{ registroVisualizacao.fotos.length }}):</strong></p>
      <p *ngIf="registroVisualizacao.fotos.length === 0">- Nenhuma foto</p>
      <div class="registro-fotos-grid" *ngIf="registroVisualizacao.fotos.length > 0">
        <div class="registro-foto-item" *ngFor="let foto of registroVisualizacao.fotos">
          <img
            [src]="foto.src"
            [alt]="foto.nomeArquivo"
            class="registro-foto-preview"
            (click)="abrirPreviewImagemRegistro(foto.src, foto.nomeArquivo)"
          />
          <p>{{ foto.nomeArquivo }}</p>
        </div>
      </div>
    </div>

    <div class="registro-midias-bloco">
      <p><strong>\xC1udios ({{ registroVisualizacao.audios.length }}):</strong></p>
      <p *ngIf="registroVisualizacao.audios.length === 0">- Nenhum \xE1udio</p>
      <div *ngIf="registroVisualizacao.audios.length > 0">
        <div class="registro-audio-item" *ngFor="let audio of registroVisualizacao.audios">
          <p>{{ audio.nomeArquivo }}</p>
          <audio [src]="audio.src" controls preload="none"></audio>
        </div>
      </div>
    </div>

    <ion-button expand="block" (click)="fecharVisualizacaoRegistro()">OK</ion-button>
  </div>
</div>

<div class="preview-imagem-overlay" *ngIf="previewImagemRegistroSrc">
  <div class="preview-imagem-topbar">
    <p class="preview-imagem-nome">{{ previewImagemRegistroNome }}</p>
    <ion-button size="small" (click)="fecharPreviewImagemRegistro()">Fechar</ion-button>
  </div>
  <div class="preview-imagem-body" (click)="fecharPreviewImagemRegistro()">
    <img
      [src]="previewImagemRegistroSrc"
      alt="Preview da imagem"
      class="preview-imagem-full"
      (click)="$event.stopPropagation()"
    />
  </div>
</div>

<!-- Overlay nativo: ion-modal com [isOpen] falha em alguns builds WebView; fixed cobre toda a viewport -->
<div
  *ngIf="exibirModalGravacaoAudio"
  class="gravacao-audio-overlay"
  role="dialog"
  aria-modal="true"
  aria-labelledby="gravacao-audio-titulo-el"
>
  <div class="gravacao-audio-panel">
    <ng-container *ngIf="gravacaoPreparando">
      <h1 id="gravacao-audio-titulo-el" class="gravacao-audio-titulo">Preparando grava\xE7\xE3o</h1>
      <p class="gravacao-audio-sub">Aguarde enquanto o microfone \xE9 ativado.</p>
      <ion-spinner class="gravacao-audio-spinner" name="crescent"></ion-spinner>
    </ng-container>
    <ng-container *ngIf="!gravacaoPreparando">
      <h1 id="gravacao-audio-titulo-el" class="gravacao-audio-titulo">Gravando \xE1udio</h1>
      <p class="gravacao-audio-sub">Fale pr\xF3ximo ao microfone. Toque em finalizar para salvar na lista.</p>
      <div class="gravacao-audio-pulse-wrap" aria-hidden="true">
        <span class="gravacao-audio-pulse"></span>
      </div>
      <p class="gravacao-audio-timer" aria-live="polite">{{ tempoGravacaoFormatado }}</p>
      <p class="gravacao-audio-legenda">Dura\xE7\xE3o</p>
      <div class="gravacao-audio-botoes">
        <ion-button expand="block" color="danger" (click)="finalizarGravacaoModal()">
          Parar e salvar \xE1udio
        </ion-button>
        <ion-button expand="block" fill="outline" color="medium" (click)="descartarGravacaoModal()">
          Descartar grava\xE7\xE3o
        </ion-button>
      </div>
    </ng-container>
  </div>
</div>

`, styles: ["/* src/app/pages/vistoria/vistoria-irregularidade.page.scss */\nion-content {\n  --padding-bottom: 108px;\n}\nion-footer {\n  box-shadow: 0 -4px 14px rgba(15, 23, 42, 0.08);\n}\nion-footer ion-toolbar {\n  --min-height: 72px;\n  --background: #ffffff;\n  --border-width: 1px 0 0;\n  --border-color: #e2e8f0;\n  --padding-start: 12px;\n  --padding-end: 12px;\n  --padding-top: 8px;\n  --padding-bottom: calc(8px + env(safe-area-inset-bottom));\n}\nion-footer ion-button {\n  margin: 0;\n  min-height: 46px;\n  font-weight: 700;\n  letter-spacing: 0.2px;\n  text-transform: none;\n  --border-radius: 12px;\n}\n.footer-actions {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.btn-voltar {\n  flex: 0 0 30%;\n  min-width: 0;\n}\n.btn-main {\n  flex: 1 1 70%;\n  min-width: 0;\n  font-size: 1.05rem;\n  --background: #f5930a !important;\n  --background-hover: #dd8509 !important;\n  --background-activated: #c97708 !important;\n  --color: #ffffff !important;\n}\n.content {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  padding: 16px;\n}\n.content.sheet-context {\n  align-items: stretch;\n}\n.cards-container {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n}\n.level-card {\n  margin: 0;\n  cursor: pointer;\n  --background:\n    linear-gradient(\n      180deg,\n      #f8fbff 0%,\n      #eef4ff 100%);\n  border: 1px solid #d7e3ff;\n  box-shadow: 0 2px 8px rgba(25, 88, 191, 0.08);\n  transition:\n    transform 120ms ease,\n    box-shadow 120ms ease,\n    filter 120ms ease;\n}\n.level-card:active {\n  transform: scale(0.99);\n  box-shadow: 0 1px 4px rgba(25, 88, 191, 0.16);\n  filter: brightness(0.98);\n}\n.level-card:focus-visible {\n  outline: 2px solid #1d4ed8;\n  outline-offset: 2px;\n}\n.level-card--selected {\n  --background: #e7f2ff;\n  border: 1px solid var(--ion-color-primary);\n}\n.level-card ion-card-header {\n  padding: 16px 18px;\n}\n.level-card ion-card-title {\n  font-size: 1.15rem;\n  font-weight: 600;\n  color: #1d4ed8;\n}\n.level-card ion-card-content {\n  padding-top: 0;\n  padding-bottom: 16px;\n  padding-inline: 18px;\n}\n.level-card ion-card-content p {\n  margin: 0;\n  font-size: 1rem;\n}\n.cards-selection-title {\n  margin: 0;\n  font-weight: 700;\n  color: #1d4ed8;\n}\n.pendencia-anterior-info {\n  margin-bottom: 6px !important;\n  font-weight: 600;\n}\n.vistoria-nr-bar {\n  --min-height: 36px;\n  --background: var(--ion-color-light);\n}\n.selected-context {\n  margin: 12px 12px 8px;\n  width: calc(100% - 24px);\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.context-card {\n  padding: 10px 12px;\n  border-radius: 12px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);\n  cursor: default;\n}\n.context-card strong {\n  color: #0f172a;\n  font-weight: 700;\n  margin-right: 4px;\n}\n.context-card span {\n  color: #334155;\n  word-break: break-word;\n}\n.error-message {\n  padding: 12px 16px;\n}\n.item-descricao-problema {\n  --highlight-color-focused: var(--ion-color-primary);\n}\n.item-descricao-problema--erro {\n  --border-color: var(--ion-color-danger);\n  --highlight-color-invalid: var(--ion-color-danger);\n}\n.item-descricao-problema ion-label .label-required {\n  color: var(--ion-color-medium);\n  font-weight: 500;\n  font-size: 0.85em;\n}\n.campo-descricao-erro {\n  margin: 0 16px 8px;\n  font-size: 0.875rem;\n  line-height: 1.35;\n  color: var(--ion-color-danger);\n}\nion-item.is-selected {\n  --background: #e7f2ff;\n}\nimg {\n  width: 64px;\n  height: 64px;\n  object-fit: cover;\n  border-radius: 8px;\n  margin-right: 12px;\n}\n.audio-actions {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.audio-player {\n  width: 100%;\n  margin-top: 6px;\n}\n.registro-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483645;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 16px;\n  background: rgba(2, 6, 23, 0.82);\n}\n.registro-card {\n  width: min(720px, 100%);\n  max-height: 90vh;\n  overflow: auto;\n  padding: 18px;\n  border-radius: 12px;\n  background: #ffffff;\n  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.35);\n}\n.registro-card h2 {\n  margin: 0 0 12px;\n  font-size: 1.15rem;\n}\n.registro-card p {\n  margin: 0 0 6px;\n}\n.registro-midias-bloco {\n  margin: 12px 0;\n}\n.registro-fotos-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n  gap: 10px;\n}\n.registro-foto-item p {\n  margin-top: 4px;\n  font-size: 0.8rem;\n  word-break: break-word;\n}\n.registro-foto-preview {\n  width: 100%;\n  height: 92px;\n  object-fit: cover;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n  margin-right: 0;\n}\n.registro-audio-item {\n  margin-bottom: 10px;\n  padding: 8px 10px;\n  border-radius: 8px;\n  border: 1px solid #e2e8f0;\n  background: #f8fafc;\n}\n.registro-audio-item audio {\n  width: 100%;\n}\n.preview-imagem-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483646;\n  display: flex;\n  flex-direction: column;\n  background: #020617;\n}\n.preview-imagem-topbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  padding: calc(10px + env(safe-area-inset-top)) 12px 10px;\n  border-bottom: 1px solid rgba(148, 163, 184, 0.25);\n}\n.preview-imagem-topbar ion-button {\n  margin: 0;\n}\n.preview-imagem-nome {\n  margin: 0;\n  color: #e2e8f0;\n  font-size: 0.9rem;\n  font-weight: 600;\n  word-break: break-word;\n}\n.preview-imagem-body {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 14px;\n}\n.preview-imagem-full {\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: calc(100vh - 84px - env(safe-area-inset-top));\n  object-fit: contain;\n  border-radius: 8px;\n  margin-right: 0;\n}\n.gravacao-audio-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483646;\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: calc(12px + env(safe-area-inset-top)) calc(12px + env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) calc(12px + env(safe-area-inset-left));\n  background: #0f172a;\n  pointer-events: auto;\n  touch-action: none;\n  overflow: hidden;\n}\n.gravacao-audio-panel {\n  width: 100%;\n  max-width: 400px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 16px 12px;\n  text-align: center;\n  color: #f8fafc;\n}\n.gravacao-audio-titulo {\n  margin: 0 0 8px;\n  font-size: 1.35rem;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}\n.gravacao-audio-sub {\n  margin: 0 0 28px;\n  font-size: 0.95rem;\n  line-height: 1.45;\n  color: #94a3b8;\n  max-width: 320px;\n}\n.gravacao-audio-pulse-wrap {\n  margin-bottom: 20px;\n}\n.gravacao-audio-pulse {\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  background: #ef4444;\n  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.55);\n  animation: gravacao-pulse 1.4s ease-out infinite;\n}\n@keyframes gravacao-pulse {\n  0% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.45);\n  }\n  70% {\n    transform: scale(1.08);\n    box-shadow: 0 0 0 16px rgba(239, 68, 68, 0);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);\n  }\n}\n.gravacao-audio-timer {\n  margin: 0;\n  font-size: 3.25rem;\n  font-weight: 700;\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.06em;\n  color: #ffffff;\n}\n.gravacao-audio-legenda {\n  margin: 4px 0 32px;\n  font-size: 0.8rem;\n  text-transform: uppercase;\n  letter-spacing: 0.12em;\n  color: #64748b;\n}\n.gravacao-audio-botoes {\n  width: 100%;\n  max-width: 340px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.gravacao-audio-spinner {\n  width: 48px;\n  height: 48px;\n  margin: 12px auto 0;\n  color: #93c5fd;\n}\n/*# sourceMappingURL=vistoria-irregularidade.page.css.map */\n"] }]
  }], () => [], { observacaoInput: [{
    type: ViewChild,
    args: ["observacaoInput", { read: IonTextarea }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(VistoriaIrregularidadePage, { className: "VistoriaIrregularidadePage", filePath: "src/app/pages/vistoria/vistoria-irregularidade.page.ts", lineNumber: 112 });
})();
export {
  VistoriaIrregularidadePage
};
//# sourceMappingURL=chunk-FW5Z4PA3.js.map
