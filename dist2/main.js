(() => {
    // webpackBootstrap
    var __webpack_modules__ = {
      "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css":
        (module, __unused_webpack_exports, __webpack_require__) => {
          // Imports
          var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = __webpack_require__(
            /*! ../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js"
          );
          var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(
            /*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js"
          );
          var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(
            ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___
          );
          // Module
          ___CSS_LOADER_EXPORT___.push([
            module.id,
            "body {\n    background-color: skyblue;\n}",
            "",
          ]);
          // Exports
          module.exports = ___CSS_LOADER_EXPORT___;
        },
  
      "./node_modules/css-loader/dist/runtime/api.js": (module) => {
        "use strict";
        module.exports = function (cssWithMappingToString) {
          var list = []; // return the list of modules as css string
  
          list.toString = function toString() {
            return this.map(function (item) {
              var content = "";
              var needLayer = typeof item[5] !== "undefined";
  
              if (item[4]) {
                content += "@supports (".concat(item[4], ") {");
              }
  
              if (item[2]) {
                content += "@media ".concat(item[2], " {");
              }
  
              if (needLayer) {
                content += "@layer".concat(
                  item[5].length > 0 ? " ".concat(item[5]) : "",
                  " {"
                );
              }
  
              content += cssWithMappingToString(item);
  
              if (needLayer) {
                content += "}";
              }
  
              if (item[2]) {
                content += "}";
              }
  
              if (item[4]) {
                content += "}";
              }
  
              return content;
            }).join("");
          }; // import a list of modules into the list
  
          list.i = function i(modules, media, dedupe, supports, layer) {
            if (typeof modules === "string") {
              modules = [[null, modules, undefined]];
            }
  
            var alreadyImportedModules = {};
  
            if (dedupe) {
              for (var k = 0; k < this.length; k++) {
                var id = this[k][0];
  
                if (id != null) {
                  alreadyImportedModules[id] = true;
                }
              }
            }
  
            for (var _k = 0; _k < modules.length; _k++) {
              var item = [].concat(modules[_k]);
  
              if (dedupe && alreadyImportedModules[item[0]]) {
                continue;
              }
  
              if (typeof layer !== "undefined") {
                if (typeof item[5] === "undefined") {
                  item[5] = layer;
                } else {
                  item[1] = "@layer"
                    .concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")
                    .concat(item[1], "}");
                  item[5] = layer;
                }
              }
  
              if (media) {
                if (!item[2]) {
                  item[2] = media;
                } else {
                  item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                  item[2] = media;
                }
              }
  
              if (supports) {
                if (!item[4]) {
                  item[4] = "".concat(supports);
                } else {
                  item[1] = "@supports ("
                    .concat(item[4], ") {")
                    .concat(item[1], "}");
                  item[4] = supports;
                }
              }
  
              list.push(item);
            }
          };
  
          return list;
        };
      },
  
      "./src/global.css": (
        module,
        __unused_webpack_exports,
        __webpack_require__
      ) => {
        var result = __webpack_require__(
          "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[0].use[1]!./src/global.css"
        );
  
        if (result && result.__esModule) {
          result = result.default;
        }
  
        if (typeof result === "string") {
          module.exports = result;
        } else {
          module.exports = result.toString();
        }
      },
    };
    // The module cache
    var __webpack_module_cache__ = {};
  
    // The require function
    function __webpack_require__(moduleId) {
      // Check if module is in cache
      var cachedModule = __webpack_module_cache__[moduleId];
      if (cachedModule !== undefined) {
        return cachedModule.exports;
      }
      // Create a new module (and put it into the cache)
      var module = (__webpack_module_cache__[moduleId] = {
        id: moduleId,
        // no module.loaded needed
        exports: {},
      });
  
      // Execute the module function
      __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  
      // Return the exports of the module
      return module.exports;
    }
  
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() => {
      /*!**********************!*\
    !*** ./src/index.js ***!
    \**********************/
      var css = __webpack_require__(/*! ./global.css */ "./src/global.css");
  
      console.log(css);
    })();
  })();
  
  
  
  (() => {
    var modules = {
      "css-loader/dist/cjs.js!./src/global.css": (module, exports, require) => {
        var ___CSS_LOADER_API_IMPORT___ = require("css-loader/dist/runtime/api.js");
        var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(function (i) {
          return i[1];
        });
        ___CSS_LOADER_EXPORT___.push([
          module.id,
          "body {\r\n    background-color: green;\r\n  }",
          "",
        ]);
        module.exports = ___CSS_LOADER_EXPORT___;
      },
  
      //  数组的一个重写 toString 方法
      "css-loader/dist/runtime/api.js": (module) => {
        module.exports = function () {
          var list = [];
          list.toString = function toString() {
            return this.join("");
          };
          return list;
        };
      },
      "./src/global.css": (module, exports, require) => {
        var result = require("css-loader/dist/cjs.js!./src/global.css");
        console.log(result)
        if (typeof result === "string") {
          module.exports = result;
        } else {
          module.exports = result.toString();
        }
      },
    };
    var cache = {};
    function require(moduleId) {
      if (cache[moduleId]) {
        return cache[moduleId].exports;
      }
      var module = (cache[moduleId] = {
        id: moduleId,
        exports: {},
      });
      modules[moduleId](module, module.exports, require);
      return module.exports;
    }
    (() => {
      const css = require("./src/global.css");
      console.log(css);
      console.log(css.toString())
    })();
  })();
  