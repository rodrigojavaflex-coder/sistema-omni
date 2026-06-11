import {
  BiometricAuthBase
} from "./chunk-RVVL3PDE.js";
import "./chunk-IQRVTVKG.js";
import {
  getBiometryName
} from "./chunk-JCEFQURH.js";
import {
  BiometryError,
  BiometryErrorType,
  BiometryType
} from "./chunk-PFHNU3CN.js";
import "./chunk-XS4INNGU.js";
import {
  __async
} from "./chunk-3RNQ4BE2.js";

// node_modules/@aparajita/capacitor-biometric-auth/dist/esm/web.js
var BiometricAuthWeb = class extends BiometricAuthBase {
  constructor() {
    super(...arguments);
    this.biometryType = BiometryType.none;
    this.biometryTypes = [];
    this.biometryIsEnrolled = false;
    this.deviceIsSecure = false;
  }
  // On the web, return the fake biometry set by setBiometryType().
  checkBiometry() {
    return __async(this, null, function* () {
      const hasBiometry = this.biometryType !== BiometryType.none;
      const available = hasBiometry && this.biometryIsEnrolled;
      let reason = "";
      let code = BiometryErrorType.none;
      if (!hasBiometry) {
        reason = "No biometry is available";
        code = BiometryErrorType.biometryNotAvailable;
      } else if (!this.biometryIsEnrolled) {
        reason = "Biometry is not enrolled";
        code = BiometryErrorType.biometryNotEnrolled;
      }
      return {
        isAvailable: available,
        strongBiometryIsAvailable: this.biometryIsEnrolled && this.hasStrongBiometry(),
        biometryType: this.biometryType,
        biometryTypes: this.biometryTypes,
        deviceIsSecure: this.deviceIsSecure,
        reason,
        code
      };
    });
  }
  hasStrongBiometry() {
    return this.biometryTypes.some((type) => type === BiometryType.faceId || type === BiometryType.touchId || type === BiometryType.fingerprintAuthentication);
  }
  // On the web, fake authentication with a confirm dialog.
  internalAuthenticate(options) {
    return __async(this, null, function* () {
      const result = yield this.checkBiometry();
      if (result.isAvailable && // oxlint-disable-next-line no-alert
      confirm(
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- we want to use the default value if options?.reason is an empty string
        (options === null || options === void 0 ? void 0 : options.reason) || `Authenticate with ${result.biometryTypes.map((type) => getBiometryName(type)).join(" or ")}?`
      )) {
        return;
      }
      if (options === null || options === void 0 ? void 0 : options.allowDeviceCredential) {
        if (result.deviceIsSecure) {
          if (confirm("Authenticate with device security?")) {
            return;
          }
          throw new BiometryError("User cancelled", BiometryErrorType.userCancel);
        } else if (result.isAvailable) {
          throw new BiometryError("Device is not secure", BiometryErrorType.noDeviceCredential);
        }
      } else if (!result.isAvailable) {
        throw result.biometryType === BiometryType.none ? new BiometryError("Biometry is not available", BiometryErrorType.biometryNotAvailable) : new BiometryError("Biometry is not enrolled", BiometryErrorType.biometryNotEnrolled);
      }
      throw new BiometryError("User cancelled", BiometryErrorType.userCancel);
    });
  }
  // Web only, used for simulating biometric authentication.
  setBiometryType(type) {
    return __async(this, null, function* () {
      if (type === void 0) {
        return;
      }
      const types = Array.isArray(type) ? type : [type];
      this.biometryTypes = [];
      this.biometryType = BiometryType.none;
      if (types.length === 0) {
        return;
      }
      if (isBiometryTypes(types)) {
        this.biometryType = types[0];
        if (this.biometryType !== BiometryType.none) {
          this.biometryTypes = types;
        }
      } else {
        for (const [i, theType] of types.entries()) {
          if (isBiometryType(theType)) {
            if (this.biometryType === BiometryType.none) {
              this.biometryTypes = [];
            } else {
              this.biometryTypes.push(theType);
            }
            if (i === 0) {
              this.biometryType = theType;
            }
          }
        }
      }
    });
  }
  // Web only, used for simulating device unlock security.
  setBiometryIsEnrolled(enrolled) {
    return __async(this, null, function* () {
      this.biometryIsEnrolled = enrolled;
    });
  }
  // Web only, used for simulating device unlock security.
  setDeviceIsSecure(isSecure) {
    return __async(this, null, function* () {
      this.deviceIsSecure = isSecure;
    });
  }
};
function isBiometryType(value) {
  return Object.values(BiometryType).includes(value);
}
function isBiometryTypes(value) {
  return value.every((type) => isBiometryType(type));
}
export {
  BiometricAuthWeb
};
//# sourceMappingURL=chunk-3ATNMSQE.js.map
