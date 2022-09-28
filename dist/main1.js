(() => {
  var modules = {
    "./src/global.css": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
        modules.exports = `body {
            background-color: skyblue;
        }`
    },
  };
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

  var css = __webpack_require__("./src/global.css");
  console.log(css);
})();
