/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/runtime/api.js":
/*!****************************!*\
  !*** ./lib/runtime/api.js ***!
  \****************************/
/***/ ((module) => {

module.exports = function (cssWithMappingToString) {
  let list = [];

  // import a list of modules into the list
  list.toString = function toString() {
    return this.map((item) => {
      let content = cssWithMappingToString(item);
      return content;
    }).join("");
  };

  list.i = function i(modules) {

    if(typeof modules === 'string') {
        modules = [[null, modules, undefined]]
    }

    for(let i = 0; i < modules.length; i++) {
        const item = [].concat(modules[i]);
        list.push(item)
    }
  };

  return list;
};


/***/ }),

/***/ "./lib/runtime/noSourceMap.js":
/*!************************************!*\
  !*** ./lib/runtime/noSourceMap.js ***!
  \************************************/
/***/ ((module) => {

module.exports = function (item) {
    return item[1]
}

/***/ }),

/***/ "./lib/src/index.js??ruleSet[1].rules[0].use[0]!./node_modules/postcss-loader/dist/cjs.js!./src/global.css":
/*!*****************************************************************************************************************!*\
  !*** ./lib/src/index.js??ruleSet[1].rules[0].use[0]!./node_modules/postcss-loader/dist/cjs.js!./src/global.css ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/runtime/noSourceMap.js */ "./lib/runtime/noSourceMap.js");
/* harmony import */ var _lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/runtime/api.js */ "./lib/runtime/api.js");
/* harmony import */ var _lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n    box-sizing: border-box;\n}", ""]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/runtime/noSourceMap.js */ "./lib/runtime/noSourceMap.js");
/* harmony import */ var _lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/runtime/api.js */ "./lib/runtime/api.js");
/* harmony import */ var _lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_src_index_js_ruleSet_1_rules_0_use_0_node_modules_postcss_loader_dist_cjs_js_global_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! -!../lib/src/index.js??ruleSet[1].rules[0].use[0]!../node_modules/postcss-loader/dist/cjs.js!./global.css */ "./lib/src/index.js??ruleSet[1].rules[0].use[0]!./node_modules/postcss-loader/dist/cjs.js!./src/global.css");
// Imports



var ___CSS_LOADER_EXPORT___ = _lib_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_lib_runtime_noSourceMap_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.i(_lib_src_index_js_ruleSet_1_rules_0_use_0_node_modules_postcss_loader_dist_cjs_js_global_css__WEBPACK_IMPORTED_MODULE_2__["default"], "");
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\n    color: red;\n    display: -ms-flexbox;\n    display: flex; \n    height: 200px;\n}\n", ""]);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const css = __webpack_require__(/*! ./index.css */ "./src/index.css");
console.log(css);
})();

/******/ })()
;