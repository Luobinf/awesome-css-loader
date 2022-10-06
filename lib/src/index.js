const postcss = require("postcss");
const { importParser, urlParser } = require("../plugins");
const schema = require("./options.json");
const {
  getImportCode,
  getExportCode,
  getModuleCode,
  shouldUseImportPlugin,
  shouldUseURLPlugin,
  normalizeOptions,
  getFilter,
  sort,
} = require("../utils/index");


async function loader(source) {
  const rawOptions = this.getOptions(schema);
  console.log("rawOptions", rawOptions);

  const loaderContext = this;

  const callback = this.async();

  let options;

  try {
    options = normalizeOptions(rawOptions, this);
  } catch (error) {
    callback(error);
    return;
  }

  let plugins = [];
  const importPluginImports = [];
  const importPluginApi = [];

  if (shouldUseImportPlugin(options)) {
    plugins.push(
      importParser({
        loaderContext,
        imports: importPluginImports,
        api: importPluginApi,
        filter: options.import.filter,
        urlHandler(url) {
          //  importLoaders 功能实现
          const { importLoaders } = options;
          const { loaderIndex } = loaderContext;
          const loaders = loaderContext.loaders.slice(
            loaderIndex,
            loaderIndex +
              1 +
              (typeof importLoaders !== "number" ? 0 : importLoaders)
          );
          const loaderRequest = loaders
            .map((x) => {
              return x.request;
            })
            .join("!");
          const tempRequest = `-!${loaderRequest}!` + url;
          const request = loaderContext.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            tempRequest
          );
          return JSON.stringify(request);
        },
      })
    );
  }

  const urlPluginImports = [];
  const replacements = [];

  if (shouldUseURLPlugin(options)) {
    const needToResolveURL = !options.esModule;

    plugins.push(
      urlParser({
        imports: urlPluginImports,
        replacements,
        context: this.context,
        rootContext: this.rootContext,
        filter: getFilter(options.url.filter, this.resourcePath), //干嘛用的？？看 css-loader 文档。
        resolver: needToResolveURL
          ? this.getResolve({ mainFiles: [], extensions: [] })
          : // eslint-disable-next-line no-undefined
            undefined,
        urlHandler: (url) => {
          return JSON.stringify(this.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            url
          ));
        },
      })
    );
  }

  let result;

  try {
    result = await postcss(plugins).process(source);
  } catch (error) {
    callback(error, result);
    return;
  }

  // console.log( result.warnings())

  for (const warning of result.warnings()) {
    this.emitWarning(new Error(warning));
  }

  try {
    // import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
    // import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
    // import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";
    // import ___CSS_LOADER_AT_RULE_IMPORT_1___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./test.css";

    const imports = []
      .concat(importPluginImports.sort(sort))
      .concat(urlPluginImports.sort(sort));

    
    if (shouldUseImportPlugin(options)) {
      imports.unshift({
        type: "api_import",
        importName: "___CSS_LOADER_API_IMPORT___",
        url: JSON.stringify(this.utils.contextify(
          loaderContext.context || loaderContext.rootContext,
          require.resolve("../runtime/api.js")
        )),
      });

      if (options.sourceMap) {
        imports.unshift({
          importName: "___CSS_LOADER_API_SOURCEMAP_IMPORT___",
          url: JSON.stringify(this.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            require.resolve("../runtime/sourceMap.js")
          )),
        });
      } else {
        imports.unshift({
          importName: "___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___",
          url: JSON.stringify(this.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            require.resolve("../runtime/noSourceMap.js")
          )),
        });
      }
    }

    const importCode = getImportCode(imports, options);
    const moduleCode = getModuleCode(result, importPluginApi, replacements, options);
    const exportCode = getExportCode(options);


    console.log(`importPluginApi`)
    console.log(importPluginApi)
    console.log(`importPluginApi`)

    console.log(9999999999);
    console.log(`${importCode}${moduleCode}${exportCode}`);

    callback(null, `${importCode}${moduleCode}${exportCode}`);
  } catch (error) {
    callback(error);
  }
}

module.exports = loader;

// 带有URL解析过后的代码
// Imports
// import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
// import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
// import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";
// import ___CSS_LOADER_AT_RULE_IMPORT_1___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./test.css";
// import ___CSS_LOADER_GET_URL_IMPORT___ from "../node_modules/css-loader/dist/runtime/getUrl.js";
// var ___CSS_LOADER_URL_IMPORT_0___ = new URL("./image.png", import.meta.url);
// var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___);
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_0___);
// ___CSS_LOADER_EXPORT___.i(___CSS_LOADER_AT_RULE_IMPORT_1___);
// var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
// // Module
// ___CSS_LOADER_EXPORT___.push([module.id, "/* @import './index.css'; */\n\n\nhtml {\n    font-size: 20px;\n    display: -ms-flexbox;\n    display: flex;\n    background-image: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\n}", ""]);
// // Exports
// export default ___CSS_LOADER_EXPORT___;




