import {
  getBiometryName
} from "./chunk-KHNN3PQE.js";
import {
  AndroidBiometryStrength,
  BiometryError,
  BiometryErrorType,
  BiometryType,
  isBiometryErrorType
} from "./chunk-GJWECBSC.js";
import {
  registerPlugin
} from "./chunk-2FHZLFRS.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@aparajita/capacitor-biometric-auth/dist/esm/index.js
var proxy = registerPlugin("BiometricAuthNative", {
  web: () => __async(null, null, function* () {
    const module = yield import("./web-ALQMJWVI.js");
    return new module.BiometricAuthWeb();
  }),
  ios: () => __async(null, null, function* () {
    const module = yield import("./native-NUDFTO5Z.js");
    return new module.BiometricAuthNative(proxy);
  }),
  android: () => __async(null, null, function* () {
    const module = yield import("./native-NUDFTO5Z.js");
    return new module.BiometricAuthNative(proxy);
  })
});
export {
  AndroidBiometryStrength,
  proxy as BiometricAuth,
  BiometryError,
  BiometryErrorType,
  BiometryType,
  getBiometryName,
  isBiometryErrorType
};
//# sourceMappingURL=@aparajita_capacitor-biometric-auth.js.map
