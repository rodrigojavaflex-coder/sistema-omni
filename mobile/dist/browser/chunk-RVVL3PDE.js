import {
  App
} from "./chunk-IQRVTVKG.js";
import {
  BiometryError,
  isBiometryErrorType
} from "./chunk-PFHNU3CN.js";
import {
  CapacitorException,
  WebPlugin
} from "./chunk-XS4INNGU.js";
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
//# sourceMappingURL=chunk-RVVL3PDE.js.map
