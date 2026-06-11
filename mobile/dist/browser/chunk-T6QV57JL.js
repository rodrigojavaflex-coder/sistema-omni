import "./chunk-NKDSIBHB.js";
import {
  RecordingStatus
} from "./chunk-6L2LYKT6.js";
import {
  Capacitor,
  WebPlugin,
  registerPlugin
} from "./chunk-XS4INNGU.js";
import {
  __async,
  __commonJS,
  __toESM
} from "./chunk-3RNQ4BE2.js";

// node_modules/@babel/runtime/helpers/interopRequireDefault.js
var require_interopRequireDefault = __commonJS({
  "node_modules/@babel/runtime/helpers/interopRequireDefault.js"(exports, module) {
    "use strict";
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }
    module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/OverloadYield.js
var require_OverloadYield = __commonJS({
  "node_modules/@babel/runtime/helpers/OverloadYield.js"(exports, module) {
    "use strict";
    function _OverloadYield(e, d) {
      this.v = e, this.k = d;
    }
    module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorDefine.js
var require_regeneratorDefine = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorDefine.js"(exports, module) {
    "use strict";
    function _regeneratorDefine(e, r, n, t) {
      var i = Object.defineProperty;
      try {
        i({}, "", {});
      } catch (e2) {
        i = 0;
      }
      module.exports = _regeneratorDefine = function regeneratorDefine(e2, r2, n2, t2) {
        function o(r3, n3) {
          _regeneratorDefine(e2, r3, function(e3) {
            return this._invoke(r3, n3, e3);
          });
        }
        r2 ? i ? i(e2, r2, {
          value: n2,
          enumerable: !t2,
          configurable: !t2,
          writable: !t2
        }) : e2[r2] = n2 : (o("next", 0), o("throw", 1), o("return", 2));
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _regeneratorDefine(e, r, n, t);
    }
    module.exports = _regeneratorDefine, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regenerator.js
var require_regenerator = __commonJS({
  "node_modules/@babel/runtime/helpers/regenerator.js"(exports, module) {
    "use strict";
    var regeneratorDefine = require_regeneratorDefine();
    function _regenerator() {
      var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
      function i(r2, n2, o2, i2) {
        var c2 = n2 && n2.prototype instanceof Generator ? n2 : Generator, u3 = Object.create(c2.prototype);
        return regeneratorDefine(u3, "_invoke", (function(r3, n3, o3) {
          var i3, c3, u4, f3 = 0, p = o3 || [], y = false, G = {
            p: 0,
            n: 0,
            v: e,
            a: d,
            f: d.bind(e, 4),
            d: function d2(t2, r4) {
              return i3 = t2, c3 = 0, u4 = e, G.n = r4, a;
            }
          };
          function d(r4, n4) {
            for (c3 = r4, u4 = n4, t = 0; !y && f3 && !o4 && t < p.length; t++) {
              var o4, i4 = p[t], d2 = G.p, l = i4[2];
              r4 > 3 ? (o4 = l === n4) && (u4 = i4[(c3 = i4[4]) ? 5 : (c3 = 3, 3)], i4[4] = i4[5] = e) : i4[0] <= d2 && ((o4 = r4 < 2 && d2 < i4[1]) ? (c3 = 0, G.v = n4, G.n = i4[1]) : d2 < l && (o4 = r4 < 3 || i4[0] > n4 || n4 > l) && (i4[4] = r4, i4[5] = n4, G.n = l, c3 = 0));
            }
            if (o4 || r4 > 1) return a;
            throw y = true, n4;
          }
          return function(o4, p2, l) {
            if (f3 > 1) throw TypeError("Generator is already running");
            for (y && 1 === p2 && d(p2, l), c3 = p2, u4 = l; (t = c3 < 2 ? e : u4) || !y; ) {
              i3 || (c3 ? c3 < 3 ? (c3 > 1 && (G.n = -1), d(c3, u4)) : G.n = u4 : G.v = u4);
              try {
                if (f3 = 2, i3) {
                  if (c3 || (o4 = "next"), t = i3[o4]) {
                    if (!(t = t.call(i3, u4))) throw TypeError("iterator result is not an object");
                    if (!t.done) return t;
                    u4 = t.value, c3 < 2 && (c3 = 0);
                  } else 1 === c3 && (t = i3["return"]) && t.call(i3), c3 < 2 && (u4 = TypeError("The iterator does not provide a '" + o4 + "' method"), c3 = 1);
                  i3 = e;
                } else if ((t = (y = G.n < 0) ? u4 : r3.call(n3, G)) !== a) break;
              } catch (t2) {
                i3 = e, c3 = 1, u4 = t2;
              } finally {
                f3 = 1;
              }
            }
            return {
              value: t,
              done: y
            };
          };
        })(r2, o2, i2), true), u3;
      }
      var a = {};
      function Generator() {
      }
      function GeneratorFunction() {
      }
      function GeneratorFunctionPrototype() {
      }
      t = Object.getPrototypeOf;
      var c = [][n] ? t(t([][n]())) : (regeneratorDefine(t = {}, n, function() {
        return this;
      }), t), u2 = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
      function f2(e2) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(e2, GeneratorFunctionPrototype) : (e2.__proto__ = GeneratorFunctionPrototype, regeneratorDefine(e2, o, "GeneratorFunction")), e2.prototype = Object.create(u2), e2;
      }
      return GeneratorFunction.prototype = GeneratorFunctionPrototype, regeneratorDefine(u2, "constructor", GeneratorFunctionPrototype), regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), regeneratorDefine(u2), regeneratorDefine(u2, o, "Generator"), regeneratorDefine(u2, n, function() {
        return this;
      }), regeneratorDefine(u2, "toString", function() {
        return "[object Generator]";
      }), (module.exports = _regenerator = function _regenerator2() {
        return {
          w: i,
          m: f2
        };
      }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
    }
    module.exports = _regenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorAsyncIterator.js
var require_regeneratorAsyncIterator = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorAsyncIterator.js"(exports, module) {
    "use strict";
    var OverloadYield = require_OverloadYield();
    var regeneratorDefine = require_regeneratorDefine();
    function AsyncIterator(t, e) {
      function n(r2, o, i, f2) {
        try {
          var c = t[r2](o), u2 = c.value;
          return u2 instanceof OverloadYield ? e.resolve(u2.v).then(function(t2) {
            n("next", t2, i, f2);
          }, function(t2) {
            n("throw", t2, i, f2);
          }) : e.resolve(u2).then(function(t2) {
            c.value = t2, i(c);
          }, function(t2) {
            return n("throw", t2, i, f2);
          });
        } catch (t2) {
          f2(t2);
        }
      }
      var r;
      this.next || (regeneratorDefine(AsyncIterator.prototype), regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
        return this;
      })), regeneratorDefine(this, "_invoke", function(t2, o, i) {
        function f2() {
          return new e(function(e2, r2) {
            n(t2, i, e2, r2);
          });
        }
        return r = r ? r.then(f2, f2) : f2();
      }, true);
    }
    module.exports = AsyncIterator, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorAsyncGen.js
var require_regeneratorAsyncGen = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorAsyncGen.js"(exports, module) {
    "use strict";
    var regenerator = require_regenerator();
    var regeneratorAsyncIterator = require_regeneratorAsyncIterator();
    function _regeneratorAsyncGen(r, e, t, o, n) {
      return new regeneratorAsyncIterator(regenerator().w(r, e, t, o), n || Promise);
    }
    module.exports = _regeneratorAsyncGen, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorAsync.js
var require_regeneratorAsync = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorAsync.js"(exports, module) {
    "use strict";
    var regeneratorAsyncGen = require_regeneratorAsyncGen();
    function _regeneratorAsync(n, e, r, t, o) {
      var a = regeneratorAsyncGen(n, e, r, t, o);
      return a.next().then(function(n2) {
        return n2.done ? n2.value : a.next();
      });
    }
    module.exports = _regeneratorAsync, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorKeys.js
var require_regeneratorKeys = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorKeys.js"(exports, module) {
    "use strict";
    function _regeneratorKeys(e) {
      var n = Object(e), r = [];
      for (var t in n) r.unshift(t);
      return function e2() {
        for (; r.length; ) if ((t = r.pop()) in n) return e2.value = t, e2.done = false, e2;
        return e2.done = true, e2;
      };
    }
    module.exports = _regeneratorKeys, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/typeof.js
var require_typeof = __commonJS({
  "node_modules/@babel/runtime/helpers/typeof.js"(exports, module) {
    "use strict";
    function _typeof(o) {
      "@babel/helpers - typeof";
      return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
        return typeof o2;
      } : function(o2) {
        return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
    }
    module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorValues.js
var require_regeneratorValues = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorValues.js"(exports, module) {
    "use strict";
    var _typeof = require_typeof()["default"];
    function _regeneratorValues(e) {
      if (null != e) {
        var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0;
        if (t) return t.call(e);
        if ("function" == typeof e.next) return e;
        if (!isNaN(e.length)) return {
          next: function next() {
            return e && r >= e.length && (e = void 0), {
              value: e && e[r++],
              done: !e
            };
          }
        };
      }
      throw new TypeError(_typeof(e) + " is not iterable");
    }
    module.exports = _regeneratorValues, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/helpers/regeneratorRuntime.js
var require_regeneratorRuntime = __commonJS({
  "node_modules/@babel/runtime/helpers/regeneratorRuntime.js"(exports, module) {
    "use strict";
    var OverloadYield = require_OverloadYield();
    var regenerator = require_regenerator();
    var regeneratorAsync = require_regeneratorAsync();
    var regeneratorAsyncGen = require_regeneratorAsyncGen();
    var regeneratorAsyncIterator = require_regeneratorAsyncIterator();
    var regeneratorKeys = require_regeneratorKeys();
    var regeneratorValues = require_regeneratorValues();
    function _regeneratorRuntime() {
      "use strict";
      var r = regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
      function n(r2) {
        var e2 = "function" == typeof r2 && r2.constructor;
        return !!e2 && (e2 === t || "GeneratorFunction" === (e2.displayName || e2.name));
      }
      var o = {
        "throw": 1,
        "return": 2,
        "break": 3,
        "continue": 3
      };
      function a(r2) {
        var e2, t2;
        return function(n2) {
          e2 || (e2 = {
            stop: function stop() {
              return t2(n2.a, 2);
            },
            "catch": function _catch() {
              return n2.v;
            },
            abrupt: function abrupt(r3, e3) {
              return t2(n2.a, o[r3], e3);
            },
            delegateYield: function delegateYield(r3, o2, a2) {
              return e2.resultName = o2, t2(n2.d, regeneratorValues(r3), a2);
            },
            finish: function finish(r3) {
              return t2(n2.f, r3);
            }
          }, t2 = function t3(r3, _t, o2) {
            n2.p = e2.prev, n2.n = e2.next;
            try {
              return r3(_t, o2);
            } finally {
              e2.next = n2.n;
            }
          }), e2.resultName && (e2[e2.resultName] = n2.v, e2.resultName = void 0), e2.sent = n2.v, e2.next = n2.n;
          try {
            return r2.call(this, e2);
          } finally {
            n2.p = e2.prev, n2.n = e2.next;
          }
        };
      }
      return (module.exports = _regeneratorRuntime = function _regeneratorRuntime2() {
        return {
          wrap: function wrap(e2, t2, n2, o2) {
            return r.w(a(e2), t2, n2, o2 && o2.reverse());
          },
          isGeneratorFunction: n,
          mark: r.m,
          awrap: function awrap(r2, e2) {
            return new OverloadYield(r2, e2);
          },
          AsyncIterator: regeneratorAsyncIterator,
          async: function async(r2, e2, t2, o2, u2) {
            return (n(e2) ? regeneratorAsyncGen : regeneratorAsync)(a(r2), e2, t2, o2, u2);
          },
          keys: regeneratorKeys,
          values: regeneratorValues
        };
      }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
    }
    module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@babel/runtime/regenerator/index.js
var require_regenerator2 = __commonJS({
  "node_modules/@babel/runtime/regenerator/index.js"(exports, module) {
    "use strict";
    var runtime = require_regeneratorRuntime()();
    module.exports = runtime;
    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
      } else {
        Function("r", "regeneratorRuntime = r")(runtime);
      }
    }
  }
});

// node_modules/@babel/runtime/helpers/asyncToGenerator.js
var require_asyncToGenerator = __commonJS({
  "node_modules/@babel/runtime/helpers/asyncToGenerator.js"(exports, module) {
    "use strict";
    function asyncGeneratorStep(n, t, e, r, o, a, c) {
      try {
        var i = n[a](c), u2 = i.value;
      } catch (n2) {
        return void e(n2);
      }
      i.done ? t(u2) : Promise.resolve(u2).then(r, o);
    }
    function _asyncToGenerator(n) {
      return function() {
        var t = this, e = arguments;
        return new Promise(function(r, o) {
          var a = n.apply(t, e);
          function _next(n2) {
            asyncGeneratorStep(a, r, o, _next, _throw, "next", n2);
          }
          function _throw(n2) {
            asyncGeneratorStep(a, r, o, _next, _throw, "throw", n2);
          }
          _next(void 0);
        });
      };
    }
    module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/get-blob-duration/dist/getBlobDuration.js
var require_getBlobDuration = __commonJS({
  "node_modules/get-blob-duration/dist/getBlobDuration.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", { value: true }), exports.default = getBlobDuration2;
    var _regenerator = _interopRequireDefault(require_regenerator2());
    var _asyncToGenerator2 = _interopRequireDefault(require_asyncToGenerator());
    function getBlobDuration2(e) {
      return _getBlobDuration.apply(this, arguments);
    }
    function _getBlobDuration() {
      return (_getBlobDuration = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function e(r) {
        var t, n;
        return _regenerator.default.wrap(function(e2) {
          for (; ; ) switch (e2.prev = e2.next) {
            case 0:
              return t = document.createElement("video"), n = new Promise(function(e3, r2) {
                t.addEventListener("loadedmetadata", function() {
                  t.duration === 1 / 0 ? (t.currentTime = Number.MAX_SAFE_INTEGER, t.ontimeupdate = function() {
                    t.ontimeupdate = null, e3(t.duration), t.currentTime = 0;
                  }) : e3(t.duration);
                }), t.onerror = function(e4) {
                  return r2(e4.target.error);
                };
              }), t.src = "string" == typeof r || r instanceof String ? r : window.URL.createObjectURL(r), e2.abrupt("return", n);
            case 4:
            case "end":
              return e2.stop();
          }
        }, e);
      }))).apply(this, arguments);
    }
  }
});

// node_modules/@capacitor/synapse/dist/synapse.mjs
function s(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return new Proxy({}, {
          get(w, o) {
            return (c, p, r) => {
              const i = t.Capacitor.Plugins[n];
              if (i === void 0) {
                r(new Error(`Capacitor plugin ${n} not found`));
                return;
              }
              if (typeof i[o] != "function") {
                r(new Error(`Method ${o} not found in Capacitor plugin ${n}`));
                return;
              }
              (() => __async(null, null, function* () {
                try {
                  const a = yield i[o](c);
                  p(a);
                } catch (a) {
                  r(a);
                }
              }))();
            };
          }
        });
      }
    }
  );
}
function u(t) {
  t.CapacitorUtils.Synapse = new Proxy(
    {},
    {
      get(e, n) {
        return t.cordova.plugins[n];
      }
    }
  );
}
function f(t = false) {
  typeof window > "u" || (window.CapacitorUtils = window.CapacitorUtils || {}, window.Capacitor !== void 0 && !t ? s(window) : window.cordova !== void 0 && u(window));
}

// node_modules/@capacitor/filesystem/dist/esm/index.js
var Filesystem = registerPlugin("Filesystem", {
  web: () => import("./chunk-4SKY3ZGL.js").then((m) => new m.FilesystemWeb())
});
f();

// node_modules/capacitor-blob-writer/blob_writer.js
var BlobWriter = registerPlugin("BlobWriter");
function array_buffer_to_base64(buffer) {
  return window.btoa(
    Array.from(new Uint8Array(buffer)).map(function(byte) {
      return String.fromCharCode(byte);
    }).join("")
  );
}
function write_file_via_indexeddb({
  path,
  directory,
  blob,
  recursive
}) {
  return Filesystem.writeFile({
    directory,
    path,
    recursive,
    data: ""
  }).then(function() {
    return new Promise(function(resolve, reject) {
      function fail(event) {
        reject(event.target.error);
      }
      const connection = window.indexedDB.open("Disc");
      connection.onerror = fail;
      connection.onsuccess = function() {
        const db = connection.result;
        const transaction = db.transaction("FileStorage", "readwrite");
        transaction.onerror = fail;
        const store = transaction.objectStore("FileStorage");
        const name = `/${directory}/${path.replace(/^\//, "")}`;
        const load = store.get(name);
        load.onsuccess = function() {
          load.result.size = blob.size;
          load.result.content = blob;
          const put = store.put(load.result);
          put.onsuccess = function() {
            resolve(void 0);
          };
        };
      };
    });
  });
}
function write_file_via_bridge({
  path,
  directory,
  blob,
  recursive
}) {
  return Filesystem.writeFile({
    directory,
    path,
    recursive,
    data: ""
  }).then(function consume_blob() {
    if (blob.size === 0) {
      return Promise.resolve();
    }
    const chunk_size = 3 * 128 * 1024;
    const chunk_blob = blob.slice(0, chunk_size);
    blob = blob.slice(chunk_size);
    return new Response(
      chunk_blob
    ).arrayBuffer().then(function append_chunk_to_file(buffer) {
      return Filesystem.appendFile({
        directory,
        path,
        data: array_buffer_to_base64(buffer)
      });
    }).then(
      consume_blob
    );
  });
}
function write_blob(options) {
  const {
    path,
    directory,
    blob,
    fast_mode = false,
    recursive,
    on_fallback
  } = options;
  if (!blob || !Number.isSafeInteger(blob.size) || typeof blob.type !== "string") {
    return Promise.reject(new Error("Not a Blob."));
  }
  if (Capacitor.getPlatform() === "web") {
    return fast_mode ? write_file_via_indexeddb(options) : write_file_via_bridge(options);
  }
  return Promise.all([
    BlobWriter.get_config(),
    Filesystem.getUri({ path, directory })
  ]).then(function([config, file_info]) {
    const absolute_path = file_info.uri.replace("file://", "");
    const real_fetch = window.CapacitorWebFetch || window.fetch;
    return real_fetch(
      config.base_url + absolute_path + (recursive ? "?recursive=true" : ""),
      {
        headers: { authorization: config.auth_token },
        method: "put",
        body: blob
      }
    ).then(function(response) {
      if (response.status !== 204) {
        throw new Error("Bad HTTP status: " + response.status);
      }
      return file_info.uri;
    });
  }).catch(function on_fail(error) {
    if (on_fallback !== void 0) {
      on_fallback(error);
    }
    return write_file_via_bridge(options);
  });
}
var blob_writer_default = Object.freeze(write_blob);

// node_modules/capacitor-voice-recorder/dist/esm/VoiceRecorderImpl.js
var import_get_blob_duration = __toESM(require_getBlobDuration());

// node_modules/capacitor-voice-recorder/dist/esm/predefined-web-responses.js
var successResponse = () => ({ value: true });
var failureResponse = () => ({ value: false });
var missingPermissionError = () => new Error("MISSING_PERMISSION");
var alreadyRecordingError = () => new Error("ALREADY_RECORDING");
var deviceCannotVoiceRecordError = () => new Error("DEVICE_CANNOT_VOICE_RECORD");
var failedToRecordError = () => new Error("FAILED_TO_RECORD");
var emptyRecordingError = () => new Error("EMPTY_RECORDING");
var recordingHasNotStartedError = () => new Error("RECORDING_HAS_NOT_STARTED");
var failedToFetchRecordingError = () => new Error("FAILED_TO_FETCH_RECORDING");
var couldNotQueryPermissionStatusError = () => new Error("COULD_NOT_QUERY_PERMISSION_STATUS");

// node_modules/capacitor-voice-recorder/dist/esm/VoiceRecorderImpl.js
var POSSIBLE_MIME_TYPES = {
  "audio/aac": ".aac",
  "audio/mp4": ".mp3",
  "audio/webm;codecs=opus": ".ogg",
  "audio/webm": ".ogg",
  "audio/ogg;codecs=opus": ".ogg"
};
var neverResolvingPromise = () => new Promise(() => void 0);
var VoiceRecorderImpl = class _VoiceRecorderImpl {
  constructor() {
    this.mediaRecorder = null;
    this.chunks = [];
    this.pendingResult = neverResolvingPromise();
  }
  static canDeviceVoiceRecord() {
    return __async(this, null, function* () {
      var _a;
      if (((_a = navigator === null || navigator === void 0 ? void 0 : navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia) == null || _VoiceRecorderImpl.getSupportedMimeType() == null) {
        return failureResponse();
      } else {
        return successResponse();
      }
    });
  }
  startRecording(options) {
    return __async(this, null, function* () {
      if (this.mediaRecorder != null) {
        throw alreadyRecordingError();
      }
      const deviceCanRecord = yield _VoiceRecorderImpl.canDeviceVoiceRecord();
      if (!deviceCanRecord.value) {
        throw deviceCannotVoiceRecordError();
      }
      const havingPermission = yield _VoiceRecorderImpl.hasAudioRecordingPermission().catch(() => successResponse());
      if (!havingPermission.value) {
        throw missingPermissionError();
      }
      return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => this.onSuccessfullyStartedRecording(stream, options)).catch(this.onFailedToStartRecording.bind(this));
    });
  }
  stopRecording() {
    return __async(this, null, function* () {
      if (this.mediaRecorder == null) {
        throw recordingHasNotStartedError();
      }
      try {
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        return this.pendingResult;
      } catch (ignore) {
        throw failedToFetchRecordingError();
      } finally {
        this.prepareInstanceForNextOperation();
      }
    });
  }
  static hasAudioRecordingPermission() {
    return __async(this, null, function* () {
      if (navigator.permissions.query == null) {
        if (navigator.mediaDevices == null) {
          return Promise.reject(couldNotQueryPermissionStatusError());
        }
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(() => successResponse()).catch(() => {
          throw couldNotQueryPermissionStatusError();
        });
      }
      return navigator.permissions.query({ name: "microphone" }).then((result) => ({ value: result.state === "granted" })).catch(() => {
        throw couldNotQueryPermissionStatusError();
      });
    });
  }
  static requestAudioRecordingPermission() {
    return __async(this, null, function* () {
      const havingPermission = yield _VoiceRecorderImpl.hasAudioRecordingPermission().catch(() => failureResponse());
      if (havingPermission.value) {
        return successResponse();
      }
      return navigator.mediaDevices.getUserMedia({ audio: true }).then(() => successResponse()).catch(() => failureResponse());
    });
  }
  pauseRecording() {
    if (this.mediaRecorder == null) {
      throw recordingHasNotStartedError();
    } else if (this.mediaRecorder.state === "recording") {
      this.mediaRecorder.pause();
      return Promise.resolve(successResponse());
    } else {
      return Promise.resolve(failureResponse());
    }
  }
  resumeRecording() {
    if (this.mediaRecorder == null) {
      throw recordingHasNotStartedError();
    } else if (this.mediaRecorder.state === "paused") {
      this.mediaRecorder.resume();
      return Promise.resolve(successResponse());
    } else {
      return Promise.resolve(failureResponse());
    }
  }
  getCurrentStatus() {
    if (this.mediaRecorder == null) {
      return Promise.resolve({ status: RecordingStatus.NONE });
    } else if (this.mediaRecorder.state === "recording") {
      return Promise.resolve({ status: RecordingStatus.RECORDING });
    } else if (this.mediaRecorder.state === "paused") {
      return Promise.resolve({ status: RecordingStatus.PAUSED });
    } else {
      return Promise.resolve({ status: RecordingStatus.NONE });
    }
  }
  static getSupportedMimeType() {
    if ((MediaRecorder === null || MediaRecorder === void 0 ? void 0 : MediaRecorder.isTypeSupported) == null)
      return null;
    const foundSupportedType = Object.keys(POSSIBLE_MIME_TYPES).find((type) => MediaRecorder.isTypeSupported(type));
    return foundSupportedType !== null && foundSupportedType !== void 0 ? foundSupportedType : null;
  }
  onSuccessfullyStartedRecording(stream, options) {
    this.pendingResult = new Promise((resolve, reject) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onerror = () => {
        this.prepareInstanceForNextOperation();
        reject(failedToRecordError());
      };
      this.mediaRecorder.onstop = () => __async(this, null, function* () {
        var _a, _b, _c;
        const mimeType = _VoiceRecorderImpl.getSupportedMimeType();
        if (mimeType == null) {
          this.prepareInstanceForNextOperation();
          reject(failedToFetchRecordingError());
          return;
        }
        const blobVoiceRecording = new Blob(this.chunks, { type: mimeType });
        if (blobVoiceRecording.size <= 0) {
          this.prepareInstanceForNextOperation();
          reject(emptyRecordingError());
          return;
        }
        let path;
        let recordDataBase64;
        if (options != null) {
          const subDirectory = (_c = (_b = (_a = options.subDirectory) === null || _a === void 0 ? void 0 : _a.match(/^\/?(.+[^/])\/?$/)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : "";
          path = `${subDirectory}/recording-${(/* @__PURE__ */ new Date()).getTime()}${POSSIBLE_MIME_TYPES[mimeType]}`;
          yield blob_writer_default({
            blob: blobVoiceRecording,
            directory: options.directory,
            fast_mode: true,
            path,
            recursive: true
          });
        } else {
          recordDataBase64 = yield _VoiceRecorderImpl.blobToBase64(blobVoiceRecording);
        }
        const recordingDuration = yield (0, import_get_blob_duration.default)(blobVoiceRecording);
        this.prepareInstanceForNextOperation();
        resolve({ value: { recordDataBase64, mimeType, msDuration: recordingDuration * 1e3, path } });
      });
      this.mediaRecorder.ondataavailable = (event) => this.chunks.push(event.data);
      this.mediaRecorder.start();
    });
    return successResponse();
  }
  onFailedToStartRecording() {
    this.prepareInstanceForNextOperation();
    throw failedToRecordError();
  }
  static blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const recordingResult = String(reader.result);
        const splitResult = recordingResult.split("base64,");
        const toResolve = splitResult.length > 1 ? splitResult[1] : recordingResult;
        resolve(toResolve.trim());
      };
      reader.readAsDataURL(blob);
    });
  }
  prepareInstanceForNextOperation() {
    if (this.mediaRecorder != null && this.mediaRecorder.state === "recording") {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.warn("While trying to stop a media recorder, an error was thrown", error);
      }
    }
    this.pendingResult = neverResolvingPromise();
    this.mediaRecorder = null;
    this.chunks = [];
  }
};

// node_modules/capacitor-voice-recorder/dist/esm/web.js
var VoiceRecorderWeb = class extends WebPlugin {
  constructor() {
    super(...arguments);
    this.voiceRecorderInstance = new VoiceRecorderImpl();
  }
  canDeviceVoiceRecord() {
    return VoiceRecorderImpl.canDeviceVoiceRecord();
  }
  hasAudioRecordingPermission() {
    return VoiceRecorderImpl.hasAudioRecordingPermission();
  }
  requestAudioRecordingPermission() {
    return VoiceRecorderImpl.requestAudioRecordingPermission();
  }
  startRecording(options) {
    return this.voiceRecorderInstance.startRecording(options);
  }
  stopRecording() {
    return this.voiceRecorderInstance.stopRecording();
  }
  pauseRecording() {
    return this.voiceRecorderInstance.pauseRecording();
  }
  resumeRecording() {
    return this.voiceRecorderInstance.resumeRecording();
  }
  getCurrentStatus() {
    return this.voiceRecorderInstance.getCurrentStatus();
  }
};
export {
  VoiceRecorderWeb
};
/*! Bundled license information:

@babel/runtime/helpers/regenerator.js:
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)
*/
//# sourceMappingURL=chunk-T6QV57JL.js.map
