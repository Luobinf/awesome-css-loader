var postcss = require("postcss");
var loaderUtils = require("loader-utils");
var Tokenizer = require("css-selector-tokenizer");
const { getOptions } = require("loader-utils");


const cssLoader = function (inputSource) {
  let loaderOptions = getOptions(this) || {};
  const cssPlugin = (options) => {
    return (root) => {
      root.walkAtRules(/^import$/i, (rule) => {
        rule.remove();
        options.imports.push(rule.params.slice(1, -1));
      });
    };
  };

  let callback = this.async();
  let options = { imports: [] };
  let pipeline = postcss([cssPlugin(options)]);

  pipeline.process(inputSource).then((result) => {
    let { loaders, loaderIndex } = this;
    let { importLoaders = 0 } = loaderOptions;
    const loadersRequest = loaders
      .slice(
        loaderIndex,
        loaderIndex +
          1 +
          (typeof importLoaders !== "number" ? 0 : importLoaders)
      )
      .map((x) => x.request)
      .join("!");
    let importCss = options.imports
      .map(
        (url) =>
          `list.push(...require(` +
          loaderUtils.stringifyRequest(this, `-!${loadersRequest}!${url}`) +
          `));`
      )
      .join("\r\n");
    let script = `
      var list = [];
      list.toString = function () {return this.join('')}
      ${importCss}
      list.push(\`${result.css}\`);
      module.exports = list;
    `;
    callback(null, script);
  });
  
};

module.exports = cssLoader;
