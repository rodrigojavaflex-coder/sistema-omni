import {
  findClosestIonContent,
  scrollToTop
} from "./chunk-RXPCP5NP.js";
import {
  readTask,
  writeTask
} from "./chunk-EAS74J6L.js";
import {
  componentOnReady
} from "./chunk-TEWEZW3P.js";
import {
  __async
} from "./chunk-UL2P3LPA.js";

// node_modules/@ionic/core/components/status-tap.js
var startStatusTap = () => {
  const win = window;
  win.addEventListener("statusTap", () => {
    readTask(() => {
      const width = win.innerWidth;
      const height = win.innerHeight;
      const el = document.elementFromPoint(width / 2, height / 2);
      if (!el) {
        return;
      }
      const contentEl = findClosestIonContent(el);
      if (contentEl) {
        new Promise((resolve) => componentOnReady(contentEl, resolve)).then(() => {
          writeTask(() => __async(null, null, function* () {
            contentEl.style.setProperty("--overflow", "hidden");
            yield scrollToTop(contentEl, 300);
            contentEl.style.removeProperty("--overflow");
          }));
        });
      }
    });
  });
};
export {
  startStatusTap
};
//# sourceMappingURL=status-tap-55ADYE6V.js.map
