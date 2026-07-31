import {
  App
} from "./chunk-NNFG5AYU.js";
import {
  BiometryError,
  isBiometryErrorType
} from "./chunk-GJWECBSC.js";
import {
  CapacitorException,
  WebPlugin
} from "./chunk-2FHZLFRS.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@aparajita/capacitor-biometric-auth/dist/esm/base.js
var BiometricAuthBase = class extends WebPlugin {
  authenticate(options) {
    return __async(this, null, function* () {
      try {
        yield this.internalAuthenticate(options);
      } catch (error) {
        throw error instanceof CapacitorException && isBiometryErrorType(error.code) ? new BiometryError(error.message, error.code) : error;
      }
    });
  }
  addResumeListener(listener) {
    return __async(this, null, function* () {
      return App.addListener("appStateChange", ({ isActive }) => {
        if (isActive) {
          ;
          (() => __async(this, null, function* () {
            try {
              const info = yield this.checkBiometry();
              listener(info);
            } catch (error) {
              console.error(error);
            }
          }))();
        }
      });
    });
  }
};

export {
  BiometricAuthBase
};
//# sourceMappingURL=chunk-DKL6YLUK.js.map
