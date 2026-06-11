import {
  BiometricAuthBase
} from "./chunk-RVVL3PDE.js";
import "./chunk-IQRVTVKG.js";
import {
  BiometryErrorType,
  BiometryType
} from "./chunk-PFHNU3CN.js";
import "./chunk-XS4INNGU.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

// node_modules/@aparajita/capacitor-biometric-auth/dist/esm/native.js
var BiometricAuthNative = class extends BiometricAuthBase {
  constructor(capProxy) {
    super();
    const proxy = capProxy;
    this.checkBiometry = proxy.checkBiometry;
    this.internalAuthenticate = proxy.internalAuthenticate;
  }
  // @native
  checkBiometry() {
    return __async(this, null, function* () {
      return {
        isAvailable: false,
        strongBiometryIsAvailable: false,
        biometryType: BiometryType.none,
        biometryTypes: [],
        deviceIsSecure: false,
        reason: "",
        code: BiometryErrorType.none,
        strongReason: "",
        strongCode: BiometryErrorType.none
      };
    });
  }
  // @native
  // On native platforms, this will present the native authentication UI.
  internalAuthenticate(_options) {
    return __async(this, null, function* () {
    });
  }
  // Web only, used for simulating biometric authentication.
  setBiometryType(_type) {
    return __async(this, null, function* () {
      console.warn("setBiometryType() is web only");
    });
  }
  // Web only, used for simulating biometry enrollment.
  setBiometryIsEnrolled(_enrolled) {
    return __async(this, null, function* () {
      console.warn("setBiometryEnrolled() is web only");
    });
  }
  // Web only, used for simulating device security.
  setDeviceIsSecure(_isSecure) {
    return __async(this, null, function* () {
      console.warn("setDeviceIsSecure() is web only");
    });
  }
};
export {
  BiometricAuthNative
};
//# sourceMappingURL=chunk-HWXJKLBC.js.map
