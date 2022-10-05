const postcss = require("postcss");
const { importParser, urlParser } = require("../plugins");
const schema = require("./options.json");
const {
  getImportCode,
  getExportCode,
  getModuleCode,
  shouldUseImportPlugin,
  shouldUseURLPlugin
} = require("../utils/index");

async function loader(source) {
  const rawOptions = this.getOptions(schema);
  console.log('rawOptions', rawOptions)
  const importPluginImports = [];
  const importPluginApi = [];
  const loaderContext = this;

  const callback = this.async();

  const options = {
    imports: importPluginImports,
    api: importPluginApi,
    loaderContext,
    urlHandler(url) {  //  importLoaders 功能实现
      const { importLoaders } = rawOptions;
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
      return request;
    },
  };

  let plugins = [];

  if(shouldUseImportPlugin(rawOptions)) {
    plugins = plugins.concat(importParser(options))
  }

  if(shouldUseURLPlugin(rawOptions)) {
    plugins = plugins.concat(urlParser(options))
  }


  let result;
  try {
    result = await postcss(plugins).process(source);
  } catch (error) {
    callback(error, result);
    return;
  }

  // console.log( result.warnings())

  try {
    // import ___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___ from "../node_modules/css-loader/dist/runtime/noSourceMaps.js";
    // import ___CSS_LOADER_API_IMPORT___ from "../node_modules/css-loader/dist/runtime/api.js";
    // import ___CSS_LOADER_AT_RULE_IMPORT_0___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./global.css";
    // import ___CSS_LOADER_AT_RULE_IMPORT_1___ from "-!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./test.css";

    const imports = [].concat(importPluginImports);

    if(shouldUseImportPlugin(rawOptions)) {
      imports.unshift({
        type: "api_import",
        importName: "___CSS_LOADER_API_IMPORT___",
        url: this.utils.contextify(
          loaderContext.context || loaderContext.rootContext,
          require.resolve("../runtime/api.js")
        ),
      });
  
      if (rawOptions.sourceMap) {
        imports.unshift({
          importName: "___CSS_LOADER_API_SOURCEMAP_IMPORT___",
          url: this.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            require.resolve("../runtime/sourceMap.js")
          ),
        });
      } else {
        imports.unshift({
          importName: "___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___",
          url: this.utils.contextify(
            loaderContext.context || loaderContext.rootContext,
            require.resolve("../runtime/noSourceMap.js")
          ),
        });
      }
    }

    const importCode = getImportCode(imports, rawOptions);
    const moduleCode = getModuleCode(result, importPluginApi, rawOptions);
    const exportCode = getExportCode(rawOptions);

    console.log(9999999999);
    console.log(`${importCode}${moduleCode}${exportCode}`);

    callback(null, `${importCode}${moduleCode}${exportCode}`);
  } catch (error) {
    callback(error);
  }
  
}

module.exports = loader;
