import {
  App
} from "./chunk-ZD22PWR6.js";
import {
  BiometryError,
  isBiometryErrorType
} from "./chunk-PFHNU3CN.js";
import {
  CapacitorException,
  WebPlugin
} from "./chunk-52UEIZVD.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

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
//# sourceMappingURL=chunk-2DCXLJTV.js.map
