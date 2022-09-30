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

/***/ "./lib/src/index.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js!./src/global.css":
/*!*****************************************************************************************************************!*\
  !*** ./lib/src/index.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js!./src/global.css ***!
  \*****************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = __webpack_require__ (/*! ../lib/runtime/noSourceMap.js */ "./lib/runtime/noSourceMap.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__ (/*! ../lib/runtime/api.js */ "./lib/runtime/api.js");

var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
___CSS_LOADER_EXPORT___.push([module.id, "body {\n    background-color: skyblue;\n    display: -ms-flexbox;\n    display: flex;\n}", ""]);

module.exports =  ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./lib/src/index.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js!./src/index.css":
/*!****************************************************************************************************************!*\
  !*** ./lib/src/index.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js!./src/index.css ***!
  \****************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ = __webpack_require__ (/*! ../lib/runtime/noSourceMap.js */ "./lib/runtime/noSourceMap.js");
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__ (/*! ../lib/runtime/api.js */ "./lib/runtime/api.js");
var __CSS_LOADER_AT_RULE_IMPORT_0__ = __webpack_require__ (/*! -!../lib/src/index.js??ruleSet[1].rules[0].use[1]!../node_modules/postcss-loader/dist/cjs.js!./global.css */ "./lib/src/index.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js!./src/global.css");

var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
___CSS_LOADER_EXPORT___.i(__CSS_LOADER_AT_RULE_IMPORT_0__, "");
___CSS_LOADER_EXPORT___.push([module.id, "/* @import './index.css'; */\n/* @import '       '; */\n\np {\n    color: red;\n    display: -ms-flexbox;\n    display: flex;\n}\n", ""]);

module.exports =  ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./src/index.css":
/*!***********************!*\
  !*** ./src/index.css ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


        var result = __webpack_require__(/*! !!../lib/src/index.js??ruleSet[1].rules[0].use[1]!../node_modules/postcss-loader/dist/cjs.js!./index.css */ "./lib/src/index.js??ruleSet[1].rules[0].use[1]!./node_modules/postcss-loader/dist/cjs.js!./src/index.css");

        if (result && result.__esModule) {
            result = result.default;
        }

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

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